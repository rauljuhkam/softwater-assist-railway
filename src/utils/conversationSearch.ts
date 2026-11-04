import type { ChatSession, Message } from '../types/chat';

export type DateFilterValue = 'all' | 'today' | '7d' | '30d';

export interface Snippet {
  before: string;
  match: string;
  after: string;
}

export interface ConversationFilters {
  keyword: string;
  persona: string; // 'all' or an exact persona name
  dateFilter: DateFilterValue;
}

export interface FilteredConversation {
  session: ChatSession;
  snippet: Snippet | null;
}

const SNIPPET_RADIUS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

export function matchesDateFilter(timestamp: number, filter: DateFilterValue, now: number = Date.now()): boolean {
  if (filter === 'all') return true;
  if (filter === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return timestamp >= start.getTime();
  }
  if (filter === '7d') return now - timestamp <= 7 * DAY_MS;
  if (filter === '30d') return now - timestamp <= 30 * DAY_MS;
  return true;
}

export function buildSnippet(text: string, query: string): Snippet | null {
  const trimmed = query.trim();
  if (!trimmed) return null;
  const index = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (index === -1) return null;
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(text.length, index + trimmed.length + SNIPPET_RADIUS);
  return {
    before: (start > 0 ? '…' : '') + text.slice(start, index),
    match: text.slice(index, index + trimmed.length),
    after: text.slice(index + trimmed.length, end) + (end < text.length ? '…' : '')
  };
}

function findMessageSnippet(messages: Message[], query: string): Snippet | null {
  for (const message of messages) {
    const snippet = buildSnippet(message.text, query);
    if (snippet) return snippet;
  }
  return null;
}

export function filterConversations(sessions: ChatSession[], filters: ConversationFilters): FilteredConversation[] {
  const keyword = filters.keyword.trim();
  const now = Date.now();
  const result: FilteredConversation[] = [];
  for (const session of sessions) {
    if (filters.persona !== 'all' && session.persona !== filters.persona) continue;
    if (!matchesDateFilter(session.updatedAt, filters.dateFilter, now)) continue;
    if (!keyword) {
      result.push({ session, snippet: null });
      continue;
    }
    const titleMatches = session.title.toLowerCase().includes(keyword.toLowerCase());
    const snippet = findMessageSnippet(session.messages, keyword);
    if (titleMatches || snippet) result.push({ session, snippet });
  }
  return result;
}
