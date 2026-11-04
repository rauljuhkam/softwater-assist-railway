import React from 'react';
import { SlidersHorizontal, Sliders, Menu, Bell, BellOff, Sparkles } from 'lucide-react';
import { SystemPrompt } from '../types/chat';
import { SIMULATED_MODELS } from '../data/knowledge';

interface HeaderProps {
  currentTitle: string;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  selectedPersona: string;
  onSelectPersona: (persona: string) => void;
  prompts: SystemPrompt[];
  onOpenManagePrompts: () => void;
  onOpenSettings: () => void;
  tipsMuted: boolean;
  onToggleTipsMuted: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTitle,
  selectedModel,
  onSelectModel,
  selectedPersona,
  onSelectPersona,
  prompts,
  onOpenManagePrompts,
  onOpenSettings,
  tipsMuted,
  onToggleTipsMuted,
  onOpenMobileMenu
}) => {
  return (
    <header className="min-h-14 border-b border-slate-200 bg-white px-4 py-2 flex flex-wrap gap-2 items-center justify-between flex-shrink-0">
      {/* Left: Mobile Toggle & Conversation Title with LOCAL DEMO badge */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <h2 className="font-semibold text-slate-800 text-sm truncate max-w-[180px] sm:max-w-[260px]">
            {currentTitle || 'New conversation'}
          </h2>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 tracking-wide uppercase">
            Simulated AI
          </span>
        </div>
      </div>

      {/* Middle/Right: Controls */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
        {/* Model Selector (Visible Simulated) */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <span className="text-slate-500 font-medium">Model:</span>
          <select aria-label="LLM Model"
            value={selectedModel}
            onChange={(e) => onSelectModel(e.target.value)}
            className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            {SIMULATED_MODELS.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Persona Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <span className="text-slate-500 font-medium">Prompt:</span>
          <select aria-label="System Prompt"
            value={selectedPersona}
            onChange={(e) => onSelectPersona(e.target.value)}
            className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer max-w-[130px] truncate"
          >
            {prompts.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manage Prompts Button */}
        <button
          onClick={onOpenManagePrompts}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs font-medium transition-colors"
          title="Manage custom personas and prompts"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Manage Prompts</span>
        </button>

        {/* Dog Tips Mute Toggle Button */}
        <button
          onClick={onToggleTipsMuted}
          className={`p-1.5 rounded-lg border transition-colors ${
            tipsMuted
              ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
              : 'bg-brand-50 text-brand-600 border-brand-200 hover:bg-brand-100'
          }`}
          title={tipsMuted ? 'Tips are muted (click to unmute Droplet tips)' : 'Droplet tips active (click to mute)'}
          aria-label="Toggle Dog Tips"
        >
          {tipsMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
        </button>

        {/* Advanced Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg bg-white shadow-2xs transition-colors"
          title="Advanced Simulated Settings (Temperature & Top-P)"
          aria-label="Open Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
