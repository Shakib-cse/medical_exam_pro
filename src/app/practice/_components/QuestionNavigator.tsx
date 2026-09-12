"use client";

import React from "react";
import { Flag } from "lucide-react";

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answeredIndices: Record<number, boolean>;
  flaggedIndices: Record<number, boolean>;
  onSelectQuestion: (index: number) => void;
  title?: string;
}

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  onSelectQuestion,
  title = "Question Navigator",
}: QuestionNavigatorProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E4EA] shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-xs sm:text-sm text-[#141B25] tracking-tight">
          {title}
        </h3>
        <span className="text-[11px] font-semibold text-slate-400">
          {Object.keys(answeredIndices).length} / {totalQuestions} Answered
        </span>
      </div>

      {/* Grid of Question Numbers */}
      <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[420px] overflow-y-auto pr-1">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const isCurrent = currentIndex === idx;
          const isAnswered = Boolean(answeredIndices[idx]);
          const isFlagged = Boolean(flaggedIndices[idx]);

          let style = "bg-[#F1F3F6] text-slate-700 hover:bg-slate-200/80 border border-[#E0E4EA]";

          if (isCurrent) {
            style = "bg-[#1D82EB] text-white font-bold border-transparent shadow-xs";
          } else if (isAnswered) {
            style = "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] font-bold";
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer select-none ${style}`}
              title={`Jump to Question ${idx + 1}`}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10.5px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#1D82EB]" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#ecfdf5] border border-[#a7f3d0]" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[#F1F3F6] border border-[#E0E4EA]" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Flagged</span>
        </div>
      </div>
    </div>
  );
}
