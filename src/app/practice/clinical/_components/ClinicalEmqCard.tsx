"use client";

import React from "react";
import {
  Info,
  Check,
  X,
  Flag,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EMQTheme } from "../page";

interface ClinicalEmqCardProps {
  theme: EMQTheme;
  currentIndex: number;
  totalQuestions: number;
  answers: Record<string, string>;
  isSubmitted: boolean;
  isFlagged: boolean;
  onOpenOptionPicker: (caseId: string) => void;
  onClearOption: (caseId: string) => void;
  onToggleFlag: () => void;
  onReportIssue: () => void;
  onPrevious: () => void;
  onSubmitOrNext: () => void;
}

export function ClinicalEmqCard({
  theme,
  currentIndex,
  totalQuestions,
  answers,
  isSubmitted,
  isFlagged,
  onOpenOptionPicker,
  onClearOption,
  onToggleFlag,
  onReportIssue,
  onPrevious,
  onSubmitOrNext,
}: ClinicalEmqCardProps) {
  return (
    <div className="space-y-6">
      {/* 1. Theme Header & Shared Options Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <div className="space-y-1.5">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Theme {theme.themeNumber}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800">{theme.title}</h2>
        </div>

        {/* Instructions Callout */}
        <div className="flex items-center gap-2 text-amber-600 text-xs font-medium py-1">
          <Info className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            {theme.instruction ||
              "For each case, select the single most appropriate answer from the option list. Each option may be used once, more than once or not at all."}
          </span>
        </div>

        {/* Shared Options List */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs sm:text-sm font-semibold text-slate-500">
            Options: <span className="font-normal text-slate-400">(Shared for all cases)</span>
          </div>

          <div className="space-y-2">
            {theme.options.map((opt) => (
              <div
                key={opt.id}
                className="border border-slate-200/90 rounded-xl p-3 sm:p-3.5 flex items-center gap-3.5 bg-white hover:bg-slate-50/70 transition-colors"
              >
                <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                  {opt.id}
                </span>
                <span className="text-xs sm:text-[13px] text-slate-800 font-medium">
                  {opt.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Cases List */}
      <div className="space-y-5">
        {theme.cases.map((c) => {
          const selectedOptId = answers[c.id];
          const selectedOpt = theme.options.find((o) => o.id === selectedOptId);
          const isCorrect = selectedOptId === c.correctOption;

          return (
            <div
              key={c.id}
              className={`bg-white rounded-2xl p-6 sm:p-7 border shadow-xs space-y-4 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? "border-emerald-300 ring-1 ring-emerald-200"
                    : "border-rose-300 ring-1 ring-rose-200"
                  : "border-slate-200/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Case {c.caseNumber}
                </h3>

                {isSubmitted && (
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      isCorrect
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                )}
              </div>

              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{c.vignette}</p>

              {/* Selected Answer Slot */}
              <div className="pt-1">
                {selectedOpt ? (
                  <div
                    className={`rounded-xl p-3 sm:p-3.5 flex items-center justify-between border ${
                      isSubmitted
                        ? isCorrect
                          ? "bg-emerald-50 border-emerald-300"
                          : "bg-rose-50 border-rose-300"
                        : "bg-[#EFF6FF] border-[#93C5FD]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                          isSubmitted
                            ? isCorrect
                              ? "bg-emerald-600"
                              : "bg-rose-600"
                            : "bg-[#2563EB]"
                        }`}
                      >
                        {selectedOpt.id}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-900">
                        {selectedOpt.label}
                      </span>
                    </div>

                    {!isSubmitted && (
                      <button
                        type="button"
                        onClick={() => onClearOption(c.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Change or clear option"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenOptionPicker(c.id)}
                    className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50 rounded-xl p-3.5 text-center text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
                  >
                    click here to pick the right answer
                  </button>
                )}
              </div>

              {/* Case Explanation */}
              {isSubmitted && (
                <div className="pt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100">
                  {!isCorrect && (
                    <div className="text-rose-700 font-semibold mb-1">
                      Correct Answer:{" "}
                      <span className="underline">
                        [{c.correctOption}]{" "}
                        {theme.options.find((o) => o.id === c.correctOption)?.label}
                      </span>
                    </div>
                  )}
                  <p>
                    <strong className="text-slate-800 font-bold">Explanation: </strong>
                    {c.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* EMQ Bottom Action Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
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
            <span>{isFlagged ? "Flagged" : "Flag Theme"}</span>
          </button>

          <button
            type="button"
            onClick={onReportIssue}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Report Theme</span>
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
            <span>Previous Theme</span>
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
                  : "Next Theme"
                : "Submit Theme Answers"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
