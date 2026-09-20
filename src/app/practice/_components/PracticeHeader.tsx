"use client";

import React from "react";
import Link from "next/link";
import { Clock, Layers } from "lucide-react";

interface PracticeHeaderProps {
  title: string;
  totalQuestions: number;
  currentIndex: number;
  timeRemaining?: number;
  showTimer?: boolean;
  onEndSession: () => void;
  questionLabel?: string;
  loading?: boolean;
}

export function PracticeHeader({
  title,
  totalQuestions,
  currentIndex,
  timeRemaining = 0, // Default starts at 0 (00:00)
  showTimer = true,
  onEndSession,
  questionLabel = "Question",
  loading = false,
}: PracticeHeaderProps) {
  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const hours = Math.floor(safeSeconds / 3600);
    const mins = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <header className="bg-[#082138] text-white border-b border-[#14324f] sticky top-0 z-40 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#0E3456] border border-[#1A4B75] flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>

          <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug truncate">
            {title}
          </h1>
        </div>

        {/* Center: Timer Pill (Only shown if showTimer is true) */}
        {showTimer && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E3456] border border-[#1A4B75] text-cyan-300 text-xs sm:text-sm font-mono font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        )}

        {/* Right: Question Indicator & End Session Button */}
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            {loading ? (
              <span className="text-slate-400 font-medium animate-pulse">Loading questions...</span>
            ) : (
              <>
                {questionLabel} <span className="font-bold text-white">{currentIndex + 1}</span> of{" "}
                <span className="font-bold text-white">{totalQuestions}</span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={onEndSession}
            className="px-4 py-2 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] active:scale-95 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
          >
            End Session
          </button>
        </div>
      </div>
    </header>
  );
}
