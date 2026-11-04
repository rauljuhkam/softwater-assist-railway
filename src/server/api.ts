import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from './db';
import { sendMessage } from '../services/mockChatService';
import { SIMULATED_MODELS } from '../data/knowledge';

class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
const fail = (status: number, message: string): never => { throw new HttpError(status, message); };
function text(value: unknown, name: string, max: number) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) return fail(400, `${name} must contain 1–${max} characters.`);
  return value.trim();
}
function setting(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1 || Math.abs(value * 10 - Math.round(value * 10)) > 0.00001) return fail(400, 'Settings must be between 0 and 1 in steps of 0.1.');
  return value;
}
async function body(request: Request): Promise<Record<string, unknown>> {
  const raw = await request.text();
  if (raw.length > 24000) return fail(413, 'This request is too large.');
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return fail(400, 'Expected a JSON object.');
    return parsed;
  } catch { return fail(400, 'Invalid JSON.'); }
}
const include = { messages: { orderBy: { createdAt: 'asc' as const } } };
function serialize(chat: any) {
  return { ...chat, createdAt: chat.createdAt.getTime(), updatedAt: chat.updatedAt.getTime(),
    messages: chat.messages.map((m: any) => ({ id: m.id, sender: m.role, text: m.content,
      timestamp: m.createdAt.getTime(), attachment: m.attachment ?? undefined,
      model: m.model ?? undefined, persona: m.persona ?? undefined })) };
}
async function chat(id: string) {
  const found = await db.chatSession.findUnique({ where: { id }, include });
  if (!found) return fail(404, 'This conversation no longer exists. Refresh the page.');
  return found;
}
async function preferences(input: Record<string, unknown>) {
  const result: { model?: string; persona?: string; temperature?: number; topP?: number } = {};
  if (input.model !== undefined) {
    if (!SIMULATED_MODELS.some(m => m.name === input.model)) return fail(400, 'Choose a simulated model from the list.');
    result.model = input.model as string;
  }
  if (input.persona !== undefined) {
    const name = text(input.persona, 'Persona', 80);
    if (!await db.systemPrompt.findUnique({ where: { name } })) return fail(400, 'This persona no longer exists. Refresh the page.');
    result.persona = name;
  }
  if (input.temperature !== undefined) result.temperature = setting(input.temperature);
  if (input.topP !== undefined) result.topP = setting(input.topP);
  return result;
}
export async function handle(request: Request, path: string[]) {
  try {
    const method = request.method;
    const origin = request.headers.get('origin');
    if (method !== 'GET' && origin && origin !== new URL(request.url).origin) return fail(403, 'Please use this app to make changes.');
    const [resource, id, sub] = path;
    if (path.length > 3) return fail(404, 'Endpoint not found.');
    if (resource === 'health' && method === 'GET' && path.length === 1) {
      await db.$queryRaw`SELECT 1`;
      return NextResponse.json({ status: 'ok', storage: 'PostgreSQL', ai: 'simulated' });
    }
    if (resource === 'chats' && path.length === 1) {
      if (method === 'GET') return NextResponse.json((await db.chatSession.findMany({ orderBy: { updatedAt: 'desc' }, include })).map(serialize));
      if (method === 'POST') {
        const input = await body(request);
        const created = await db.chatSession.create({ data: { ...await preferences(input), title: input.title === undefined ? undefined : text(input.title, 'Title', 80) }, include });
        return NextResponse.json(serialize(created), { status: 201 });
      }
    }
    if (resource === 'chats' && id && path.length === 2) {
      if (method === 'GET') return NextResponse.json(serialize(await chat(id)));
      if (method === 'DELETE') {
        await db.chatSession.delete({ where: { id } });
        return NextResponse.json({ ok: true });
      }
      if (method === 'PATCH') {
        const input = await body(request);
        const data = await preferences(input);
        return NextResponse.json(serialize(await db.chatSession.update({ where: { id }, data, include })));
      }
    }
    if (resource === 'chats' && id && sub === 'messages' && path.length === 3) {
      if (method === 'DELETE') {
        await db.$transaction(async tx => {
          await tx.chatSession.update({ where: { id }, data: { generation: { increment: 1 }, pending: false } });
          await tx.message.deleteMany({ where: { sessionId: id } });
        });
        return NextResponse.json(serialize(await chat(id)));
      }
      if (method === 'POST') {
        const input = await body(request);
        const content = text(input.text, 'Message', 8000);
        let attachment: { name: string; size: number } | undefined;
        if (input.attachment !== undefined) {
          const a = input.attachment as any;
          if (!a || typeof a.size !== 'number' || !Number.isSafeInteger(a.size) || a.size < 0) return fail(400, 'Invalid attachment metadata.');
          attachment = { name: text(a.name, 'Filename', 255), size: a.size };
        }
        const state = await db.$transaction(async tx => {
          const claim = await tx.chatSession.updateMany({ where: { id, OR: [{ pending: false }, { updatedAt: { lt: new Date(Date.now() - 60000) } }] }, data: { pending: true, generation: { increment: 1 } } });
          if (!claim.count) return fail(409, 'This conversation is busy or was deleted. Wait a moment and refresh.');
          const current = await tx.chatSession.findUniqueOrThrow({ where: { id } });
          const count = await tx.message.count({ where: { sessionId: id } });
          if (!count) await tx.chatSession.update({ where: { id }, data: { title: content.slice(0, 60) } });
          await tx.message.create({ data: { sessionId: id, role: 'user', content, ...(attachment ? { attachment } : {}) } });
          return current;
        });
        try {
          const answer = await sendMessage(id, content, state.model, state.persona, attachment);
          await db.$transaction(async tx => {
            // A clear/delete invalidates this generation, even while a reply is being prepared.
            const claim = await tx.chatSession.updateMany({ where: { id, generation: state.generation, pending: true }, data: { pending: false } });
            if (claim.count) await tx.message.create({ data: { sessionId: id, role: 'assistant', content: answer.text, model: state.model, persona: state.persona } });
          });
        } finally {
          await db.chatSession.updateMany({ where: { id, generation: state.generation }, data: { pending: false } });
        }
        return NextResponse.json(serialize(await chat(id)));
      }
    }
    if (resource === 'prompts' && path.length === 1) {
      if (method === 'GET') return NextResponse.json(await db.systemPrompt.findMany({ orderBy: { createdAt: 'asc' } }));
      const input = await body(request);
      if (method === 'POST') return NextResponse.json(await db.systemPrompt.create({ data: { name: text(input.name, 'Name', 80), content: text(input.content, 'Prompt', 4000) } }), { status: 201 });
      const promptId = text(input.id, 'Prompt ID', 100);
      if (method === 'PUT') {
        const name = text(input.name, 'Name', 80);
        const content = text(input.content, 'Prompt', 4000);
        return NextResponse.json(await db.$transaction(async tx => {
          const old = await tx.systemPrompt.findUniqueOrThrow({ where: { id: promptId } });
          const updated = await tx.systemPrompt.update({ where: { id: promptId }, data: { name, content } });
          await tx.chatSession.updateMany({ where: { persona: old.name }, data: { persona: name } });
          return updated;
        }));
      }
      if (method === 'DELETE') {
        await db.$transaction(async tx => {
          const old = await tx.systemPrompt.findUniqueOrThrow({ where: { id: promptId } });
          if (old.isDefault) return fail(400, 'Default personas can be edited but cannot be deleted.');
          await tx.systemPrompt.delete({ where: { id: promptId } });
          const fallback = await tx.systemPrompt.findFirst({ where: { isDefault: true } });
          await tx.chatSession.updateMany({ where: { persona: old.name }, data: { persona: fallback?.name ?? 'Water basics' } });
        });
        return NextResponse.json({ ok: true });
      }
    }
    return fail(404, 'Endpoint not found.');
  } catch (error) {
    if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') return NextResponse.json({ error: 'This item no longer exists. Refresh the page.' }, { status: 404 });
      if (error.code === 'P2002') return NextResponse.json({ error: 'A persona with that name already exists.' }, { status: 409 });
    }
    // Never return connection strings or raw database errors to the browser/logs.
    console.error('SoftWater API failure:', error instanceof Error ? error.constructor.name : 'UnknownError');
    return NextResponse.json({ error: 'The database is temporarily unavailable. Please try again shortly.' }, { status: 503 });
  }
}
