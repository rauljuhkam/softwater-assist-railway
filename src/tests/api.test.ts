import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
const { db, tx, answer } = vi.hoisted(() => {
  const tx = { chatSession: { updateMany: vi.fn(), findUniqueOrThrow: vi.fn(), update: vi.fn() }, message: { count: vi.fn(), create: vi.fn(), deleteMany: vi.fn() } };
  const db = { chatSession: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn(), delete: vi.fn(), updateMany: vi.fn() }, $transaction: vi.fn(), $queryRaw: vi.fn() };
  return { db, tx, answer: vi.fn() };
});
vi.mock('../server/db', () => ({ db }));
vi.mock('../services/mockChatService', () => ({ sendMessage: answer }));
import { handle } from '../server/api';
const chat = { id: 'a', title: 'Test', model: 'GPT-4 (simulated)', persona: 'Water basics', temperature: 0.7, topP: 0.9, generation: 1, pending: true, createdAt: new Date(0), updatedAt: new Date(1), messages: [] };
const request = (path: string, method = 'GET', input?: unknown) => new Request(`http://localhost/api/${path}`, { method, body: input === undefined ? undefined : JSON.stringify(input) });
beforeEach(() => {
  vi.stubEnv('RAILWAY_PUBLIC_DOMAIN', '');
  vi.resetAllMocks();
  db.$transaction.mockImplementation(async callback => callback(tx));
  db.chatSession.findUnique.mockResolvedValue(chat);
  db.chatSession.updateMany.mockResolvedValue({ count: 1 });
  tx.chatSession.findUniqueOrThrow.mockResolvedValue(chat);
  tx.chatSession.updateMany.mockResolvedValue({ count: 1 });
  tx.message.count.mockResolvedValue(0);
  answer.mockResolvedValue({ text: 'Educational answer' });
});
afterEach(() => vi.unstubAllEnvs());
describe('Railway API boundaries and reply cancellation', () => {
  it('rejects empty messages before writing', async () => {
    const result = await handle(request('chats/a/messages', 'POST', { text: '  ' }), ['chats', 'a', 'messages']);
    expect(result.status).toBe(400); expect(db.$transaction).not.toHaveBeenCalled();
  });
  it('rejects oversized messages', async () => {
    expect((await handle(request('chats/a/messages', 'POST', { text: 'a'.repeat(8001) }), ['chats', 'a', 'messages'])).status).toBe(400);
  });
  it('rejects out of range settings', async () => {
    expect((await handle(request('chats/a', 'PATCH', { topP: 1.1 }), ['chats', 'a'])).status).toBe(400);
    expect(db.chatSession.update).not.toHaveBeenCalled();
  });
  it('rejects malformed JSON', async () => {
    const result = await handle(new Request('http://localhost/api/chats', { method: 'POST', body: '{' }), ['chats']);
    expect(result.status).toBe(400);
  });
  it('rejects cross-origin writes', async () => {
    const result = await handle(new Request('http://localhost/api/chats/a', { method: 'DELETE', headers: { origin: 'https://other.test' } }), ['chats', 'a']);
    expect(result.status).toBe(403); expect(db.chatSession.delete).not.toHaveBeenCalled();
  });
  it('accepts same-origin writes in local development', async () => {
    db.chatSession.update.mockResolvedValue(chat);
    const result = await handle(new Request('http://localhost/api/chats/a', { method: 'PATCH', headers: { origin: 'http://localhost' }, body: JSON.stringify({ topP: 0.8 }) }), ['chats', 'a']);
    expect(result.status).toBe(200);
    expect(db.chatSession.update).toHaveBeenCalled();
  });
  it('accepts the Railway HTTPS origin behind an internal HTTP proxy', async () => {
    vi.stubEnv('RAILWAY_PUBLIC_DOMAIN', 'softwater-assist-railway-production.up.railway.app');
    db.chatSession.update.mockResolvedValue(chat);
    const result = await handle(new Request('http://0.0.0.0:8080/api/chats/a', { method: 'PATCH', headers: { origin: 'https://softwater-assist-railway-production.up.railway.app' }, body: JSON.stringify({ topP: 0.8 }) }), ['chats', 'a']);
    expect(result.status).toBe(200);
    expect(db.chatSession.update).toHaveBeenCalledWith(expect.objectContaining({ data: { topP: 0.8 } }));
  });
  it('does not trust a different origin even if forwarded headers claim it', async () => {
    vi.stubEnv('RAILWAY_PUBLIC_DOMAIN', 'softwater-assist-railway-production.up.railway.app');
    const result = await handle(new Request('http://0.0.0.0:8080/api/chats/a', { method: 'DELETE', headers: { origin: 'https://other.test', 'x-forwarded-host': 'other.test', 'x-forwarded-proto': 'https' } }), ['chats', 'a']);
    expect(result.status).toBe(403); expect(db.chatSession.delete).not.toHaveBeenCalled();
  });
  it('does not leak database credentials on failure', async () => {
    db.chatSession.findMany.mockRejectedValue(new Error('postgresql://user:secret@private-host'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const result = await handle(request('chats'), ['chats']);
    expect(result.status).toBe(503); expect(await result.text()).not.toContain('secret');
    expect(JSON.stringify(spy.mock.calls)).not.toContain('secret'); spy.mockRestore();
  });
  it('serializes timestamps and database message fields for the existing UI', async () => {
    db.chatSession.findMany.mockResolvedValue([{ ...chat, messages: [{ id: 'm', role: 'user', content: 'hello', createdAt: new Date(5), attachment: null }] }]);
    const result = await handle(request('chats'), ['chats']); const json = await result.json();
    expect(json[0].createdAt).toBe(0); expect(json[0].messages[0]).toMatchObject({ sender: 'user', text: 'hello', timestamp: 5 });
  });
  it('persists user and assistant messages in their originating session', async () => {
    const result = await handle(request('chats/a/messages', 'POST', { text: 'hardness' }), ['chats', 'a', 'messages']);
    expect(result.status).toBe(200);
    expect(tx.message.create.mock.calls.map(call => call[0].data)).toEqual([
      { sessionId: 'a', role: 'user', content: 'hardness' },
      { sessionId: 'a', role: 'assistant', content: 'Educational answer', model: chat.model, persona: chat.persona }
    ]);
  });
  it('discards the assistant reply if clear/delete invalidates the generation', async () => {
    tx.chatSession.updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 });
    await handle(request('chats/a/messages', 'POST', { text: 'salt' }), ['chats', 'a', 'messages']);
    expect(tx.message.create).toHaveBeenCalledTimes(1);
  });
  it('rejects duplicate sends while the session is claimed', async () => {
    tx.chatSession.updateMany.mockResolvedValue({ count: 0 });
    expect((await handle(request('chats/a/messages', 'POST', { text: 'salt' }), ['chats', 'a', 'messages'])).status).toBe(409);
    expect(answer).not.toHaveBeenCalled();
  });
  it('clearing a conversation invalidates pending replies in the same transaction', async () => {
    const result = await handle(request('chats/a/messages', 'DELETE'), ['chats', 'a', 'messages']);
    expect(result.status).toBe(200);
    expect(tx.chatSession.update).toHaveBeenCalledWith({ where: { id: 'a' }, data: { generation: { increment: 1 }, pending: false } });
    expect(tx.message.deleteMany).toHaveBeenCalledWith({ where: { sessionId: 'a' } });
  });
});
