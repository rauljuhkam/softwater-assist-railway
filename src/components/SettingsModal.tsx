import React from 'react';
import { X, Sliders, RotateCcw, Info } from 'lucide-react';
import { AdvancedSettings } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AdvancedSettings;
  onUpdateSettings: (settings: AdvancedSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  const handleReset = () => {
    onUpdateSettings({
      temperature: 0.7,
      topP: 0.9
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Advanced Settings</h3>
              <p className="text-xs text-slate-500">Simulated model configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="px-5 pt-4">
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Simulation note:</span> These parameters are saved in PostgreSQL for each conversation. They demonstrate settings without running real LLM inference. Custom prompt text is saved but is not interpreted by a language model.
            </div>
          </div>
        </div>

        {/* Sliders Body */}
        <div className="p-5 space-y-6">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Temperature</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono font-medium">
                {settings.temperature.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  temperature: parseFloat(e.target.value)
                })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.0 (Precise / Focused)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          {/* Top-P */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">Top-P (Nucleus Sampling)</label>
              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-800 font-mono font-medium">
                {settings.topP.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={settings.topP}
              onChange={(e) =>
                onUpdateSettings({
                  ...settings,
                  topP: parseFloat(e.target.value)
                })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.0 (Strict)</span>
              <span>1.0 (Diverse)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1.5 rounded hover:bg-slate-200/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
