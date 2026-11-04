import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Trash2, Send, X, FileText } from 'lucide-react';
import { Attachment } from '../types/chat';

interface ComposerProps {
  onSendMessage: (text: string, attachment?: Attachment) => void;
  onClearChat: () => void;
  isTyping: boolean;
  hasMessages: boolean;
}

export const Composer: React.FC<ComposerProps> = ({
  onSendMessage,
  onClearChat,
  isTyping,
  hasMessages
}) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim() || isTyping) return;
    onSendMessage(text, attachment || undefined);
    setText('');
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store filename and size only
      setAttachment({
        name: file.name,
        size: file.size
      });
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canSend = text.trim().length > 0 && !isTyping;

  return (
    <div className="w-full px-4 mb-2 flex-shrink-0">
      <div className="max-w-3xl mx-auto bg-white border border-slate-300 rounded-2xl shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/10 transition-all p-3">
        {/* Attachment Chip if file selected */}
        {attachment && (
          <div className="mb-2.5 flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span className="font-medium text-slate-800 truncate">{attachment.name}</span>
              <span className="text-[11px] text-slate-400">({Math.round(attachment.size / 1024)} KB)</span>
            </div>
            <button
              onClick={removeAttachment}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded transition-colors"
              title="Remove attachment"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about hardness, salt, regeneration..."
          rows={1}
          maxLength={8000}
          disabled={isTyping}
          className="w-full bg-transparent resize-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none min-h-[44px] max-h-[160px] leading-relaxed"
        />

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
          <div className="flex items-center gap-1">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Attach File Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Attach water test report or manual (filename only)"
            >
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              <span>Attach File</span>
            </button>

            {/* Clear Chat Button */}
            {hasMessages && (
              <button
                type="button"
                onClick={onClearChat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title="Clear current chat messages"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Clear Chat</span>
              </button>
            )}
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all ${
              canSend
                ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
