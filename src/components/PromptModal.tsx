import React, { useState } from 'react';
import { X, Sparkles, Plus, Edit2, Trash2, Check, Lock } from 'lucide-react';
import { SystemPrompt } from '../types/chat';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: SystemPrompt[];
  onAddPrompt: (name: string, content: string) => void;
  onEditPrompt: (id: string, name: string, content: string) => void;
  onDeletePrompt: (id: string) => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  prompts,
  onAddPrompt,
  onEditPrompt,
  onDeletePrompt
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formContent, setFormContent] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormName('');
    setFormContent('');
  };

  const handleStartEdit = (p: SystemPrompt) => {
    setEditingId(p.id);
    setIsAdding(false);
    setFormName(p.name);
    setFormContent(p.content);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContent.trim()) return;
    onAddPrompt(formName, formContent);
    setIsAdding(false);
    setFormName('');
    setFormContent('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formName.trim() || !formContent.trim()) return;
    onEditPrompt(editingId, formName, formContent);
    setEditingId(null);
    setFormName('');
    setFormContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Manage System Prompts</h3>
              <p className="text-xs text-slate-500">Configure assistant personas and guidance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list / Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Add prompt form */}
          {isAdding && (
            <form onSubmit={handleSaveAdd} className="p-4 bg-brand-50/50 rounded-xl border border-brand-200 space-y-3">
              <h4 className="font-semibold text-brand-900 text-xs uppercase tracking-wide">
                New Custom Persona / Prompt
              </h4>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Well Water Specialist"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">System Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Instructions for framing answers..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/50 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md shadow-2xs"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          )}

          {/* Prompts list */}
          <div className="space-y-2.5">
            {prompts.map((p) => {
              const isEditingThis = editingId === p.id;

              if (isEditingThis) {
                return (
                  <form
                    key={p.id}
                    onSubmit={handleSaveEdit}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3"
                  >
                    <h4 className="font-semibold text-slate-800 text-xs">Edit Prompt</h4>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Instructions</label>
                      <textarea
                        rows={3}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/50 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md shadow-2xs"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div
                  key={p.id}
                  className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-800">{p.name}</span>
                      {p.isDefault && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium border border-slate-200">
                          <Lock className="w-2.5 h-2.5 text-slate-400" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.content}</p>
                  </div>

                  {true && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                        title="Edit prompt"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={p.isDefault}
                        onClick={() => onDeletePrompt(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete prompt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          {!isAdding ? (
            <button
              onClick={handleStartAdd}
              className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-semibold px-2 py-1.5 rounded hover:bg-brand-50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Prompt</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
