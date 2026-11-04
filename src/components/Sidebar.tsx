import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Droplets, MessageSquare, X, Search } from 'lucide-react';
import { ChatSession, SystemPrompt } from '../types/chat';
import { filterConversations, DateFilterValue } from '../utils/conversationSearch';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  prompts: SystemPrompt[];
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const DATE_FILTER_OPTIONS: { value: DateFilterValue; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  prompts,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpenMobile,
  onCloseMobile
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [persona, setPersona] = useState('all');
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all');

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(keywordInput), 300);
    return () => clearTimeout(timer);
  }, [keywordInput]);

  const filtered = filterConversations(sessions, { keyword, persona, dateFilter });

  const resetFilters = () => {
    setKeywordInput('');
    setKeyword('');
    setPersona('all');
    setDateFilter('all');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 leading-tight text-sm">
                SoftWater Assist
              </h1>
              <p className="text-xs text-slate-500">Water softener education</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-slate-100 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Search conversations…"
              aria-label="Search conversations"
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
          </div>
          <div className="flex gap-2">
            <select
              aria-label="Filter by persona"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="flex-1 min-w-0 text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All personas</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <select
              aria-label="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilterValue)}
              className="flex-1 min-w-0 text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 focus:outline-none cursor-pointer"
            >
              {DATE_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Chat History
          </div>

          {sessions.length === 0 ? (
            <div className="px-2 py-6 text-xs text-slate-400 italic">
              No conversations yet.
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-2 py-6 text-xs text-slate-400 italic text-center space-y-2">
              <p>No conversations found. Try adjusting the filters.</p>
              <button
                onClick={resetFilters}
                className="text-brand-600 hover:underline not-italic font-medium"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filtered.map(({ session, snippet }) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onCloseMobile();
                  }}
                  className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-2 truncate pr-6">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <span className="truncate block">{session.title || 'Conversation'}</span>
                      {snippet && (
                        <span className="block truncate text-[10px] text-slate-400 font-normal">
                          {snippet.before}
                          <strong className="text-slate-600 font-semibold">{snippet.match}</strong>
                          {snippet.after}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-600 text-slate-400 rounded transition-opacity"
                    title="Delete conversation"
                    aria-label={`Delete ${session.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          <div className="text-[11px] text-slate-500 text-center leading-relaxed">
            Learn more:{' '}
            <a
              href="https://www.epa.gov/watersense/cation-exchange-water-softeners"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:underline"
            >
              EPA WaterSense
            </a>{' '}
            ·{' '}
            <a
              href="https://extension.psu.edu/water-softening"
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:underline"
            >
              Penn State Extension
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
