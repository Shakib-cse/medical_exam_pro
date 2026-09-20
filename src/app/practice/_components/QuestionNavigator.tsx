"use client";

import React from "react";
import { Flag, Check, X } from "lucide-react";

export interface NavigatorItem {
  id: string | number;
  label?: string;
  subTopic?: string;
  status?: "correct" | "wrong" | "flagged" | "unanswered";
}

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answeredIndices?: Record<number, boolean>;
  flaggedIndices?: Record<number, boolean>;
  correctIndices?: Record<number, boolean>;
  wrongIndices?: Record<number, boolean>;
  items?: NavigatorItem[];
  onSelectQuestion: (index: number) => void;
  title?: string;
  layout?: "list" | "grid";
}

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answeredIndices = {},
  flaggedIndices = {},
  correctIndices = {},
  wrongIndices = {},
  items,
  onSelectQuestion,
  title = "QUESTION NAVIGATOR",
  layout = "grid",
}: QuestionNavigatorProps) {
  // If items are provided or layout is "list", render the vertical question list as in the design screenshots
  if (layout === "list" || items) {
    const listItems: NavigatorItem[] =
      items && items.length > 0
        ? items
        : Array.from({ length: totalQuestions }).map((_, idx) => ({
            id: idx + 1,
            label: `Question ${idx + 1}`,
            subTopic: `Question ${idx + 1}`,
          }));

    return (
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-1">
          {title}
        </h3>

        <div className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
          {listItems.map((item, idx) => {
            const isCurrent = currentIndex === idx;
            const isFlagged = Boolean(flaggedIndices[idx]) || item.status === "flagged";
            const isCorrect = correctIndices[idx] ?? (item.status === "correct");
            const isWrong = wrongIndices[idx] ?? (item.status === "wrong");

            return (
              <div
                key={item.id ?? idx}
                onClick={() => onSelectQuestion(idx)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none ${
                  isCurrent
                    ? "bg-[#E8EDF5] border border-[#B3C5DE] shadow-xs"
                    : "hover:bg-slate-200/50"
                }`}
              >
                <span className="w-6 h-6 rounded bg-[#E2E8F0] text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <span
                  className={`text-xs sm:text-[13px] font-medium truncate flex-1 ${
                    isCurrent ? "text-slate-900 font-semibold" : "text-slate-700"
                  }`}
                  title={item.subTopic || item.label}
                >
                  {item.subTopic || item.label}
                </span>

                <div className="w-5 flex items-center justify-center shrink-0">
                  {isFlagged ? (
                    <Flag className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ) : isCorrect ? (
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                  ) : isWrong ? (
                    <X className="w-4 h-4 text-rose-500 stroke-[3]" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Otherwise, render grid layout (used in mock exams etc.)
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
