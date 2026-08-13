"use client";

import React from "react";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Bookmark, Flag } from "lucide-react";

export interface QuestionItem {
  id: number;
  backendId?: string;
  badge: string;
  topic: string;
  subTopic: string;
  vignette: string;
  question: string;
  options: { id: string; label: string }[];
  correctOption: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Moderate" | "Hard";
  frequency: string;
}

interface PracticeQuestionCardProps {
  currentQ: QuestionItem;
  currentIndex: number;
  totalQuestions: number;
  userAnswer?: string;
  isBookmarked: boolean;
  isFlagged: boolean;
  onSelectOption: (optionId: string) => void;
  onPrevious: () => void;
  onNextOrFinish: () => void;
  onToggleBookmark: () => void;
  onToggleFlag: () => void;
}

export function PracticeQuestionCard({
  currentQ,
  currentIndex,
  totalQuestions,
  userAnswer,
  isBookmarked,
  isFlagged,
  onSelectOption,
  onPrevious,
  onNextOrFinish,
  onToggleBookmark,
  onToggleFlag,
}: PracticeQuestionCardProps) {
  const isAnswered = Boolean(userAnswer);
  const isCorrect = isAnswered && userAnswer === currentQ.correctOption;

  const capitalizeStr = (s: string) => {
    if (!s) return "";
    let formatted = s.charAt(0).toUpperCase() + s.slice(1);
    return formatted.replace(/:\s*([a-z])/g, (_, l) => `: ${l.toUpperCase()}`);
  };

  const formattedTopic = capitalizeStr(currentQ.topic);
  const formattedSubTopic = capitalizeStr(currentQ.subTopic);

  return (
    <div className="space-y-6">
      {/* Question Vignette Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        {/* Badge & Topic Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-[#072438] text-white font-extrabold text-xs tracking-wide">
              {currentQ.badge}
            </span>
            <span className="text-xs font-bold text-slate-500">
              {formattedTopic} • {formattedSubTopic}
            </span>
          </div>

          <span className="text-xs font-bold text-slate-400">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Vignette & Question Text */}
        <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
          <p className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-normal">
            {currentQ.vignette}
          </p>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">
            {currentQ.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt) => {
            const isSelected = userAnswer === opt.id;
            const isCorrectOption = opt.id === currentQ.correctOption;

            let optionStyles = "border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800";

            if (isAnswered) {
              if (isCorrectOption) {
                optionStyles = "border-2 border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs";
              } else if (isSelected && !isCorrect) {
                optionStyles = "border-2 border-red-500 bg-red-50/80 text-red-950 font-semibold shadow-xs";
              } else {
                optionStyles = "border border-slate-200 opacity-60 text-slate-500";
              }
            }

            return (
              <button
                key={opt.id}
                disabled={isAnswered}
                onClick={() => onSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-4 text-xs sm:text-sm transition-all cursor-pointer ${optionStyles}`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-xs ${isAnswered && isCorrectOption
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : isAnswered && isSelected && !isCorrect
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                >
                  {opt.id}
                </div>
                <span className="flex-1 font-medium leading-relaxed">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback & Explanation Card */}
      {isAnswered && (
        <div
          className={`rounded-2xl p-6 border shadow-2xs space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isCorrect
              ? "bg-[#f0fdf4] border-emerald-300 text-emerald-950"
              : "bg-[#fef2f2] border-red-300 text-red-950"
            }`}
        >
          <div className="flex items-center gap-2.5">
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <h4 className="font-extrabold text-sm sm:text-base">
              {isCorrect
                ? `Correct! Option ${currentQ.correctOption} is right.`
                : `Incorrect. Correct Answer: Option ${currentQ.correctOption}`}
            </h4>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <span className="font-bold text-slate-900 block uppercase tracking-wider text-[11px]">
              EXPLANATION & CLINICAL REASONING
            </span>
            <p className="leading-relaxed font-normal text-slate-700">
              {currentQ.explanation}
            </p>
          </div>

          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-200/60 text-[11px]">
            <div>
              <span className="block font-bold text-slate-400 uppercase tracking-tight">TOPIC</span>
              <span className="font-bold text-slate-800">{formattedTopic} - {formattedSubTopic}</span>
            </div>
            <div>
              <span className="block font-bold text-slate-400 uppercase tracking-tight">DIFFICULTY</span>
              <span className={`font-bold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>
                {currentQ.difficulty}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-400 uppercase tracking-tight">EXAM FREQUENCY</span>
              <span className="font-bold text-slate-800">{currentQ.frequency}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <button
            disabled={currentIndex === 0}
            onClick={onPrevious}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#072438] text-white text-xs font-bold hover:bg-[#0c2642] transition-all shadow-md disabled:opacity-40 cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
        </div>

        <button
          onClick={onNextOrFinish}
          className="flex items-center gap-1.5 px-7 py-3 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-brand-orange/20 active:scale-95 cursor-pointer"
        >
          <span>{currentIndex === totalQuestions - 1 ? "Finish Test" : "Next Question"}</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}
