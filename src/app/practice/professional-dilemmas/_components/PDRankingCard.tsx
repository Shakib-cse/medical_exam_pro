"use client";

import React from "react";
import {
  Clock,
  GripVertical,
  CheckCircle2,
  Flag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  BookOpen,
} from "lucide-react";
import { PDQuestion } from "../page";

interface PDRankingCardProps {
  question: PDQuestion;
  currentIndex: number;
  totalQuestions: number;
  currentRankOrder: string[];
  isSubmitted: boolean;
  score?: number;
  isFlagged: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetId: string) => void;
  onMoveRank: (index: number, direction: "up" | "down") => void;
  onToggleFlag: () => void;
  onReportIssue: () => void;
  onPrevious: () => void;
  onSubmitOrNext: () => void;
}

export function PDRankingCard({
  question,
  currentIndex,
  totalQuestions,
  currentRankOrder,
  isSubmitted,
  score,
  isFlagged,
  onDragStart,
  onDragOver,
  onDrop,
  onMoveRank,
  onToggleFlag,
  onReportIssue,
  onPrevious,
  onSubmitOrNext,
}: PDRankingCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E4EA] shadow-2xs space-y-6">
      {/* Instruction Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#082138] text-white text-[11px] sm:text-xs font-bold shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>Drag To Rank: 1 Most Appropriate 5 Least Appropriate</span>
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

      {/* Ranking Drag/Drop Options List */}
      <div className="space-y-3 pt-2">
        {currentRankOrder.map((optId, rankIdx) => {
          const opt = question.options.find((o) => o.id === optId);
          if (!opt) return null;

          const idealRank = question.idealOrder
            ? question.idealOrder.indexOf(optId) + 1
            : opt.idealRank;
          const isExactMatch = isSubmitted && idealRank === rankIdx + 1;

          return (
            <div
              key={opt.id}
              draggable={!isSubmitted}
              onDragStart={(e) => onDragStart(e, opt.id)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, opt.id)}
              className={`rounded-2xl p-4 sm:p-5 border transition-all flex items-center justify-between gap-4 ${
                isSubmitted
                  ? isExactMatch
                    ? "bg-emerald-50/70 border-emerald-300"
                    : "bg-amber-50/50 border-amber-200"
                  : "bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs cursor-grab active:cursor-grabbing"
              }`}
            >
              {/* Left: Rank Badge + Letter Box + Text */}
              <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                {/* Rank Circle (1 to 5) */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-sm sm:text-base shrink-0 ${
                    isSubmitted
                      ? isExactMatch
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                        : "border-amber-500 text-amber-600 bg-amber-50"
                      : "border-[#10B981] text-[#10B981] bg-[#ECFDF5]"
                  }`}
                >
                  {rankIdx + 1}
                </div>

                {/* Letter Badge (A - E) */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 border border-slate-200/70 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {opt.id}
                </div>

                {/* Option Description */}
                <span className="text-xs sm:text-[13.5px] text-slate-800 font-medium leading-snug">
                  {opt.label}
                </span>
              </div>

              {/* Right: Drag Handle Icon / Ideal Rank Badge */}
              <div className="flex items-center gap-2 shrink-0">
                {!isSubmitted ? (
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      onClick={() => onMoveRank(rankIdx, "up")}
                      disabled={rankIdx === 0}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 cursor-pointer sm:hidden"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMoveRank(rankIdx, "down")}
                      disabled={rankIdx === currentRankOrder.length - 1}
                      className="p-1 rounded hover:bg-slate-100 disabled:opacity-20 cursor-pointer sm:hidden"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <GripVertical className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-grab" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                      Ideal Rank:
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-black bg-slate-800 text-white">
                      #{idealRank}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rationale & Concordance Results (Revealed after submit) */}
      {isSubmitted && (
        <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
          {/* Concordance Score Banner */}
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                Concordance Score
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {score !== undefined ? `${score}%` : "Scored"}
              </div>
            </div>
            <div className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Scored via GMC concordance difference matrix comparing your sequence against the panel consensus.
            </div>
          </div>

          {/* Rationale and Reference */}
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
                : "Submit Ranking"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
