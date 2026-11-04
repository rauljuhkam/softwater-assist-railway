import { useState, useEffect, useRef } from 'react';
import type { ChatSession, Attachment, SystemPrompt, AdvancedSettings } from '../types/chat';
import { SIMULATED_MODELS } from '../data/knowledge';
type CloudChat = ChatSession & AdvancedSettings;
export async function api<T>(path: string, method = 'GET', data?: unknown): Promise<T> {
  const response = await fetch(`/api/${path}`, { method, cache: 'no-store', headers: data === undefined ? undefined : { 'Content-Type': 'application/json' }, body: data === undefined ? undefined : JSON.stringify(data) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'The request failed. Please try again.');
  return result;
}
export function useChatStorage() {
  const [sessions, setSessions] = useState<CloudChat[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [settings, updateSettings] = useState<AdvancedSettings>({ temperature: 0.7, topP: 0.9 });
  const [selectedModel, updateModel] = useState(SIMULATED_MODELS[0].name);
  const [selectedPersona, updatePersona] = useState('Water basics');
  const [tipsMuted, setTipsMuted] = useState(false);
  const [pendingSessions, setPendingSessions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(new Set<string>());
  const creating = useRef(false);
  const generations = useRef(new Map<string, number>());
  const activeId = useRef<string | null>(null);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const apply = (chat: CloudChat) => setSessions(previous => previous.some(s => s.id === chat.id) ? previous.map(s => s.id === chat.id ? chat : s) : [chat, ...previous]);
  function show(chat: CloudChat) {
    activeId.current = chat.id; setActiveSessionId(chat.id);
    updateSettings({ temperature: chat.temperature, topP: chat.topP }); updateModel(chat.model); updatePersona(chat.persona);
  }
  async function reload() {
    setLoading(true); setError(null);
    try {
      const [chats, personas] = await Promise.all([api<CloudChat[]>('chats'), api<SystemPrompt[]>('prompts')]);
      setSessions(chats); setPrompts(personas);
      const current = chats.find(s => s.id === activeId.current) ?? chats[0];
      if (current) show(current);
      else { activeId.current = null; setActiveSessionId(null); if (personas[0]) updatePersona(personas[0].name); }
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }
  useEffect(() => { void reload(); }, []);
  function selectSession(id: string) {
    const current = sessions.find(s => s.id === id); if (current) show(current);
    void api<CloudChat>(`chats/${id}`).then(chat => { apply(chat); if (activeId.current === id) show(chat); }).catch(e => setError(e.message));
  }
  async function createNewSession(title = 'New conversation') {
    if (creating.current) return null; creating.current = true;
    try {
      const chat = await api<CloudChat>('chats', 'POST', { title, model: selectedModel, persona: selectedPersona, ...settings });
      apply(chat); show(chat); setError(null); return chat.id;
    } catch (e) { setError((e as Error).message); return null; }
    finally { creating.current = false; }
  }
  async function deleteSession(id: string) {
    generations.current.set(id, (generations.current.get(id) ?? 0) + 1);
    try {
      await api(`chats/${id}`, 'DELETE'); setSessions(previous => previous.filter(s => s.id !== id));
      if (activeId.current === id) { activeId.current = null; setActiveSessionId(null); }
      setError(null);
    } catch (e) { setError((e as Error).message); }
  }
  async function clearCurrentSession() {
    const id = activeId.current; if (!id) return;
    generations.current.set(id, (generations.current.get(id) ?? 0) + 1);
    try { apply(await api<CloudChat>(`chats/${id}/messages`, 'DELETE')); setError(null); }
    catch (e) { setError((e as Error).message); }
  }
  async function sendMessage(text: string, attachment?: Attachment) {
    if (!text.trim() || loading) return;
    let id = activeId.current;
    if (id && pending.current.has(id)) return;
    if (!id) id = await createNewSession(text.trim().slice(0, 60));
    if (!id || pending.current.has(id)) return;
    const target = id;
    const generation = generations.current.get(target) ?? 0;
    pending.current.add(target); setPendingSessions(new Set(pending.current)); setError(null);
    setSessions(previous => previous.map(s => s.id === target ? { ...s, messages: [...s.messages, { id: `pending-${Date.now()}`, sender: 'user', text: text.trim(), timestamp: Date.now(), attachment }] } : s));
    try {
      await queue.current;
      const reply = await api<CloudChat>(`chats/${target}/messages`, 'POST', { text, attachment });
      if ((generations.current.get(target) ?? 0) === generation) setSessions(previous => previous.map(s => s.id === target ? reply : s));
    } catch (e) {
      setError((e as Error).message);
      try { const saved = await api<CloudChat>(`chats/${target}`); setSessions(previous => previous.map(s => s.id === target ? saved : s)); } catch { /* Preserve original error. */ }
    } finally { pending.current.delete(target); setPendingSessions(new Set(pending.current)); }
  }
  function savePreference(patch: Partial<CloudChat>) {
    const id = activeId.current; if (!id) return;
    setSessions(previous => previous.map(s => s.id === id ? { ...s, ...patch } : s));
    queue.current = queue.current.catch(() => undefined).then(async () => {
      try { await api(`chats/${id}`, 'PATCH', patch); }
      catch (e) { setError((e as Error).message); throw e; }
    });
    void queue.current.catch(() => undefined);
  }
  function setSettings(value: AdvancedSettings) { updateSettings(value); savePreference(value); }
  function setSelectedModel(value: string) { updateModel(value); savePreference({ model: value }); }
  function setSelectedPersona(value: string) { updatePersona(value); savePreference({ persona: value }); }
  async function mutatePrompt(method: string, input: unknown) {
    try {
      await api('prompts', method, input);
      const [list, chats] = await Promise.all([api<SystemPrompt[]>('prompts'), api<CloudChat[]>('chats')]);
      setPrompts(list); setSessions(chats);
      updatePersona(chats.find(s => s.id === activeId.current)?.persona ?? list[0]?.name ?? 'Water basics'); setError(null);
    } catch (e) { setError((e as Error).message); }
  }
  return {
    sessions, activeSessionId, activeSession: sessions.find(s => s.id === activeSessionId) ?? null,
    prompts, settings, tipsMuted, selectedModel, selectedPersona, pendingSessions,
    isCurrentSessionTyping: loading || (activeSessionId ? pendingSessions.has(activeSessionId) : creating.current),
    loading, error, reload, createNewSession, selectSession, deleteSession, clearCurrentSession, sendMessage,
    setSettings, setSelectedModel, setSelectedPersona, setTipsMuted, toggleTipsMuted: () => setTipsMuted(v => !v),
    addPrompt: (name: string, content: string) => mutatePrompt('POST', { name, content }),
    editPrompt: (id: string, name: string, content: string) => mutatePrompt('PUT', { id, name, content }),
    deletePrompt: (id: string) => mutatePrompt('DELETE', { id })
  };
}
