import { describe, it, expect } from 'vitest';
import { buildSnippet, matchesDateFilter, filterConversations } from '../utils/conversationSearch';
import type { ChatSession } from '../types/chat';

const DAY_MS = 24 * 60 * 60 * 1000;

function session(overrides: Partial<ChatSession>): ChatSession {
  return {
    id: 'id',
    title: 'Conversation',
    createdAt: 0,
    updatedAt: 0,
    messages: [],
    model: 'GPT-4 (simulated)',
    persona: 'Water basics',
    ...overrides
  };
}

describe('matchesDateFilter', () => {
  const now = new Date('2026-11-05T12:00:00Z').getTime();
  it('passes everything for "all"', () => {
    expect(matchesDateFilter(0, 'all', now)).toBe(true);
  });
  it('restricts "today" to the current calendar day', () => {
    const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
    expect(matchesDateFilter(startOfDay.getTime(), 'today', now)).toBe(true);
    expect(matchesDateFilter(startOfDay.getTime() - 1, 'today', now)).toBe(false);
  });
  it('restricts "7d" to the last 7 days', () => {
    expect(matchesDateFilter(now - 6 * DAY_MS, '7d', now)).toBe(true);
    expect(matchesDateFilter(now - 8 * DAY_MS, '7d', now)).toBe(false);
  });
  it('restricts "30d" to the last 30 days', () => {
    expect(matchesDateFilter(now - 29 * DAY_MS, '30d', now)).toBe(true);
    expect(matchesDateFilter(now - 31 * DAY_MS, '30d', now)).toBe(false);
  });
});

describe('buildSnippet', () => {
  it('returns null when the query is blank or not found', () => {
    expect(buildSnippet('hello world', '')).toBeNull();
    expect(buildSnippet('hello world', 'xyz')).toBeNull();
  });
  it('finds a case-insensitive match and keeps surrounding context', () => {
    const snippet = buildSnippet('The water is too HARD for this softener.', 'hard');
    expect(snippet).toEqual({ before: 'The water is too ', match: 'HARD', after: ' for this softener.' });
  });
  it('truncates long context with an ellipsis', () => {
    const text = 'x'.repeat(100) + 'needle' + 'y'.repeat(100);
    const snippet = buildSnippet(text, 'needle');
    expect(snippet?.before.startsWith('…')).toBe(true);
    expect(snippet?.after.endsWith('…')).toBe(true);
  });
});

describe('filterConversations', () => {
  const sessions: ChatSession[] = [
    session({ id: 'a', title: 'Softener install', persona: 'Water basics', updatedAt: Date.now(), messages: [{ id: 'm1', sender: 'user', text: 'How hard is my water?', timestamp: Date.now() }] }),
    session({ id: 'b', title: 'Old chat', persona: 'Troubleshooting', updatedAt: Date.now() - 40 * DAY_MS, messages: [{ id: 'm2', sender: 'assistant', text: 'Salt levels look fine.', timestamp: Date.now() - 40 * DAY_MS }] })
  ];

  it('matches keyword against message content, not just the title', () => {
    const result = filterConversations(sessions, { keyword: 'salt', persona: 'all', dateFilter: 'all' });
    expect(result.map(r => r.session.id)).toEqual(['b']);
    expect(result[0].snippet?.match.toLowerCase()).toBe('salt');
  });

  it('combines persona, date, and keyword filters with AND logic', () => {
    const result = filterConversations(sessions, { keyword: 'water', persona: 'Water basics', dateFilter: '30d' });
    expect(result.map(r => r.session.id)).toEqual(['a']);
  });

  it('excludes a conversation that matches keyword but fails another filter', () => {
    const result = filterConversations(sessions, { keyword: 'salt', persona: 'all', dateFilter: '30d' });
    expect(result).toEqual([]);
  });

  it('returns every conversation when no filters are set', () => {
    const result = filterConversations(sessions, { keyword: '', persona: 'all', dateFilter: 'all' });
    expect(result.map(r => r.session.id)).toEqual(['a', 'b']);
  });
});
