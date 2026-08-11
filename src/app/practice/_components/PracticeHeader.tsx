"use client";

import React from "react";
import Link from "next/link";
import { Clock, ChevronLeft } from "lucide-react";

interface PracticeHeaderProps {
  activeTopic: string;
  totalQuestions: number;
  answeredCount: number;
  timeElapsed: number;
  onFinishTest: () => void;
}

export function PracticeHeader({
  activeTopic,
  totalQuestions,
  answeredCount,
  timeElapsed,
  onFinishTest,
}: PracticeHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <header className="bg-[#072438] text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Title & Exit Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Exit to Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div>
            <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug">
              {activeTopic}
            </h1>
            <span className="text-[11px] font-medium text-slate-400">
              Question Progress: {answeredCount} / {totalQuestions} ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Right: Timer & Finish Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(timeElapsed)}</span>
          </div>

          <button
            onClick={onFinishTest}
            className="px-5 py-2 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Finish Test
          </button>
        </div>
      </div>
    </header>
  );
}
