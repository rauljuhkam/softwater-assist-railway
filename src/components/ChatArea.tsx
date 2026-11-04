import React, { useEffect, useRef } from 'react';
import { Droplets, Gauge, Beaker, RotateCcw, Scale, FileText } from 'lucide-react';
import { Message } from '../types/chat';

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  onSelectStarter: (question: string) => void;
}

const STARTER_QUESTIONS = [
  {
    icon: Gauge,
    topic: 'Hardness',
    question: 'What is water hardness and how is it measured?'
  },
  {
    icon: Beaker,
    topic: 'Ion exchange',
    question: 'How do ion-exchange softeners work?'
  },
  {
    icon: RotateCcw,
    topic: 'Regeneration',
    question: 'What happens during regeneration and what salt is suitable?'
  },
  {
    icon: Scale,
    topic: 'Selection',
    question: 'How do I choose the right capacity unit for my household demand?'
  }
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isTyping,
  onSelectStarter
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Empty state / Welcome */}
        {messages.length === 0 ? (
          <div className="py-8 text-center space-y-6 animate-in fade-in duration-200">
            {/* Center Droplet Logo */}
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-600 shadow-xs">
              <Droplets className="w-8 h-8 text-brand-600" />
            </div>

            {/* Headings */}
            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                How can I help you understand water softening?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Ask about hardness, ion exchange, regeneration, salt or maintenance. Replies in this demo are simulated educational content.
              </p>
            </div>

            {/* Starter Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left pt-2">
              {STARTER_QUESTIONS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSelectStarter(item.question)}
                    className="p-3.5 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/40 rounded-xl text-left shadow-2xs transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-brand-600">
                      <IconComponent className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-xs text-slate-700 group-hover:text-brand-700">
                        {item.topic}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 group-hover:text-slate-700 leading-snug">
                      {item.question}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="space-y-5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const timeString = new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-2xs">
                      <Droplets className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div className={`space-y-1 max-w-[82%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                    {/* Attachment chip if present */}
                    {msg.attachment && (
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs mb-1 ${
                          isUser
                            ? 'bg-brand-500/30 text-white border border-brand-400'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="font-medium truncate max-w-[180px]">
                          {msg.attachment.name}
                        </span>
                        <span className="text-[10px] opacity-75">
                          ({Math.round(msg.attachment.size / 1024)} KB)
                        </span>
                      </div>
                    )}

                    {/* Bubble Content - Blue User Bubbles per refined requirement */}
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Timestamp & Metadata */}
                    <div
                      className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                        isUser ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{timeString}</span>
                      {!isUser && msg.model && (
                        <span>• {msg.model.replace(' (simulated)', '')}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-2xs">
                  <Droplets className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-xs shadow-2xs flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-400 ml-2">SoftWater Assist is researching...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};
