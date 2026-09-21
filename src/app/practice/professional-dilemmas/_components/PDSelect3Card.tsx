"use client";

import React from "react";
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Flag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { PDQuestion } from "../page";

interface PDSelect3CardProps {
  question: PDQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOptions: string[];
  isSubmitted: boolean;
  score?: number;
  isFlagged: boolean;
  onToggleOption: (optionId: string) => void;
  onToggleFlag: () => void;
  onReportIssue: () => void;
  onPrevious: () => void;
  onSubmitOrNext: () => void;
}

export function PDSelect3Card({
  question,
  currentIndex,
  totalQuestions,
  selectedOptions,
  isSubmitted,
  score,
  isFlagged,
  onToggleOption,
  onToggleFlag,
  onReportIssue,
  onPrevious,
  onSubmitOrNext,
}: PDSelect3CardProps) {
  const correctSet = new Set(question.correctAnswers || []);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E4EA] shadow-2xs space-y-6">
      {/* Instruction Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#082138] text-white text-[11px] sm:text-xs font-bold shadow-2xs">
        <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
        <span>Select Three Most Appropriate Options ({selectedOptions.length}/3 selected)</span>
      </div>

      {/* Clinical Vignette & Question Text */}
      <div className="space-y-3">
        <p className="text-slate-800 text-sm sm:text-[15px] font-normal leading-relaxed">
          {question.vignette}
        </p>
        {question.instruction && (
          <p className="text-slate-900 text-sm sm:text-[15px] font-bold leading-relaxed pt-1">
            {question.instruction}
          </p>
        )}
      </div>

      {/* 8 Options List */}
      <div className="space-y-2.5 pt-2">
        {question.options.map((opt) => {
          const isSelected = selectedOptions.includes(opt.id);
          const isCorrectAnswer = correctSet.has(opt.id);
          const peerPercent = question.peerStats ? question.peerStats[opt.id] : undefined;

          let containerStyle =
            "border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800 cursor-pointer";
          let badgeStyle = "bg-slate-100 text-slate-600";

          if (isSubmitted) {
            if (isCorrectAnswer) {
              containerStyle =
                "border-emerald-500 bg-[#E8F8F0] text-emerald-950 font-semibold ring-1 ring-emerald-500 cursor-default";
              badgeStyle = "bg-[#059669] text-white";
            } else if (isSelected && !isCorrectAnswer) {
              containerStyle =
                "border-red-400 bg-[#FEF2F2] text-red-950 font-semibold ring-1 ring-red-400 cursor-default";
              badgeStyle = "bg-red-600 text-white";
            } else {
              containerStyle = "border-slate-200 opacity-60 text-slate-500 cursor-default";
              badgeStyle = "bg-slate-100 text-slate-400";
            }
          } else if (isSelected) {
            containerStyle =
              "border-[#1D82EB] bg-blue-50/60 text-slate-900 font-semibold ring-1 ring-[#1D82EB] cursor-pointer";
            badgeStyle = "bg-[#1D82EB] text-white";
          }

          return (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              onClick={() => !isSubmitted && onToggleOption(opt.id)}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${containerStyle}`}
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                >
                  {opt.id}
                </span>
                <span className="text-xs sm:text-[13.5px] leading-snug">{opt.label}</span>
              </div>

              {/* Checkbox indicator or Peer Percentage */}
              <div className="flex items-center gap-3 shrink-0">
                {isSubmitted && peerPercent !== undefined && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-white/80 px-2.5 py-1 rounded-full border border-slate-200/80">
                    <span className="text-slate-400">Peer:</span>
                    <span className="text-slate-800">{peerPercent}%</span>
                  </div>
                )}

                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    isSelected
                      ? isSubmitted
                        ? isCorrectAnswer
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-red-600 border-red-600 text-white"
                        : "bg-[#1D82EB] border-[#1D82EB] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rationale and Correct Answers Banner */}
      {isSubmitted && (
        <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Select 3 Accuracy
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {score !== undefined ? `${score}%` : "Scored"}
              </div>
            </div>
            <div className="text-xs text-slate-700">
              <span className="font-bold">Correct Options: </span>
              <span className="underline font-mono text-emerald-700 font-extrabold">
                {(question.correctAnswers || []).join(", ")}
              </span>
            </div>
          </div>

          {question.explanation && (
            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>GMC Guidance &amp; Consensus Rationale</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed pl-6">
                {question.explanation}
              </p>
              {question.references && (
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pl-6 pt-1">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Reference: {question.references}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleFlag}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
              isFlagged
                ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Flag
              className={`w-3.5 h-3.5 ${
                isFlagged ? "text-amber-600 fill-amber-500" : "text-slate-500"
              }`}
            />
            <span>{isFlagged ? "Flagged" : "Flag"}</span>
          </button>

          <button
            type="button"
            onClick={onReportIssue}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Report Issue</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={onSubmitOrNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <span>
              {isSubmitted
                ? currentIndex === totalQuestions - 1
                  ? "Complete Session"
                  : "Next Question"
                : "Submit Answers"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
