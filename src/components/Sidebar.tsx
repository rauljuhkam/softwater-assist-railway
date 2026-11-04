import React from 'react';
import { Plus, Trash2, Droplets, MessageSquare, X } from 'lucide-react';
import { ChatSession } from '../types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpenMobile,
  onCloseMobile
}) => {
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

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Chat History
          </div>

          {sessions.length === 0 ? (
            <div className="px-2 py-6 text-xs text-slate-400 italic">
              No conversations yet.
            </div>
          ) : (
            sessions.map((session) => {
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
                  <div className="flex items-center gap-2 truncate pr-6">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                    <span className="truncate">{session.title || 'Conversation'}</span>
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
