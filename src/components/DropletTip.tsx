import React, { useState, useEffect } from 'react';
import { X, BellOff, Bell, BookOpen } from 'lucide-react';
import { DOG_TIPS, DogTip } from '../data/knowledge';

interface DropletTipProps {
  tipsMuted: boolean;
  onToggleTipsMuted: () => void;
}

export const DropletTip: React.FC<DropletTipProps> = ({
  tipsMuted,
  onToggleTipsMuted
}) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Cycle tips every 60 seconds in-app
  useEffect(() => {
    const timer = setInterval(() => {
      if (!tipsMuted) {
        setCurrentTipIndex((prev) => (prev + 1) % DOG_TIPS.length);
        setIsDismissed(false); // New minute brings a new tip
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [tipsMuted]);

  const activeTip: DogTip = DOG_TIPS[currentTipIndex];

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const handleDogClick = () => {
    if (tipsMuted) {
      onToggleTipsMuted();
      setIsDismissed(false);
    } else if (isDismissed) {
      // Un-dismiss and show tip
      setIsDismissed(false);
    } else {
      // Cycle to next tip on click
      setCurrentTipIndex((prev) => (prev + 1) % DOG_TIPS.length);
    }
  };

  return (
    <div className="w-full px-4 mb-2 flex-shrink-0 transition-all duration-300">
      <div className="max-w-3xl mx-auto flex items-end justify-end gap-3">
        {/* Tip Speech Bubble (Rendered in reserved layout space so it never covers messages or links) */}
        {!tipsMuted && !isDismissed && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3.5 max-w-sm w-full relative animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs text-brand-700">Tip from Droplet</span>
                <span className="text-[10px] text-slate-400 font-medium">({activeTip.title})</span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                title="Dismiss this tip"
                aria-label="Dismiss tip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tip Body strictly grounded in knowledge.json and model-specific manual */}
            <p className="text-xs text-slate-700 leading-relaxed mb-2">
              {activeTip.tip}
            </p>

            {/* Source & Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400" />
                {activeTip.source}
              </span>
              <button
                onClick={onToggleTipsMuted}
                className="text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium transition-colors"
                title="Mute tips from Droplet"
              >
                <BellOff className="w-3 h-3" />
                <span>Mute tips</span>
              </button>
            </div>
          </div>
        )}

        {/* Dog Character (Droplet) */}
        <div
          id="droplet-dog-button"
          onClick={handleDogClick}
          className="group relative cursor-pointer flex-shrink-0 select-none"
          title={
            tipsMuted
              ? 'Droplet tips are muted. Click to unmute!'
              : isDismissed
              ? 'Click Droplet to view tip!'
              : 'Click Droplet for another tip!'
          }
        >
          {/* Animated SVG Dog */}
          <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-brand-200 flex items-center justify-center shadow-xs transition-transform transform group-hover:scale-105 active:scale-95">
            <svg
              className={`w-9 h-9 ${!tipsMuted && !isDismissed ? 'animate-bounce' : ''}`}
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animationDuration: '3s' }}
            >
              {/* Ears */}
              <ellipse cx="18" cy="22" rx="7" ry="14" fill="#8B5CF6" transform="rotate(-15 18 22)" />
              <ellipse cx="46" cy="22" rx="7" ry="14" fill="#3B82F6" transform="rotate(15 46 22)" />
              {/* Head */}
              <circle cx="32" cy="34" r="20" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
              {/* Water droplet patch over left eye */}
              <path
                d="M24 24 C22 28 20 32 24 35 C28 35 29 32 27 28 Z"
                fill="#93C5FD"
                opacity="0.75"
              />
              {/* Eyes */}
              <circle cx="25" cy="33" r="2.8" fill="#1E293B" />
              <circle cx="26" cy="32" r="0.9" fill="#FFFFFF" />
              <circle cx="39" cy="33" r="2.8" fill="#1E293B" />
              <circle cx="40" cy="32" r="0.9" fill="#FFFFFF" />
              {/* Snout */}
              <ellipse cx="32" cy="41" rx="6.5" ry="4.5" fill="#E2E8F0" />
              {/* Nose */}
              <path d="M29.5 39 H34.5 L32 42 Z" fill="#0F172A" />
              {/* Mouth */}
              <path d="M30 43.5 Q32 45.5 34 43.5" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
              {/* Water Droplet Collar Tag */}
              <circle cx="32" cy="53" r="3.5" fill="#2563EB" />
              <path d="M32 49.5 L34 52.5 A2 2 0 1 1 30 52.5 Z" fill="#60A5FA" />
            </svg>
          </div>

          {/* Muted indicator badge */}
          {tipsMuted && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-600 text-white flex items-center justify-center text-[10px] shadow-xs">
              <BellOff className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
