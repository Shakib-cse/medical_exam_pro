"use client";

import React from "react";
import { Flag, MessageSquare, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { SBAQuestion } from "../page";

interface ClinicalSbaCardProps {
  question: SBAQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  isFlagged: boolean;
  onSelectOption: (optionId: string) => void;
  onToggleFlag: () => void;
  onReportIssue: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ClinicalSbaCard({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onReportIssue,
  onPrevious,
  onNext,
}: ClinicalSbaCardProps) {
  const isAnswered = Boolean(selectedAnswer);
  const correctOptObj = question.options.find((o) => o.id === question.correctOption);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Vignette & Question Prompt */}
      <div className="space-y-4">
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
          {question.vignette}
        </p>

        <h2 className="font-bold text-slate-900 text-base sm:text-lg pt-1">
          {question.question}
        </h2>
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3 pt-2">
        {question.options.map((opt) => {
          const selected = selectedAnswer === opt.id;
          const isCorrectOption = opt.id === question.correctOption;

          let containerStyle =
            "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800 cursor-pointer";
          let badgeStyle = "bg-slate-100 text-slate-600";
          let radioBorder = "border-slate-300 bg-white";
          let radioDotColor = "";

          if (isAnswered) {
            if (isCorrectOption) {
              containerStyle =
                "border-emerald-500 bg-[#E8F8F0] text-emerald-950 font-semibold ring-1 ring-emerald-500 cursor-default";
              badgeStyle = "bg-[#059669] text-white";
              radioBorder = "border-emerald-600 bg-white";
              radioDotColor = "bg-emerald-600";
            } else if (selected && !isCorrectOption) {
              containerStyle =
                "border-red-500 bg-[#FEF2F2] text-red-950 font-semibold ring-1 ring-red-500 cursor-default";
              badgeStyle = "bg-red-600 text-white";
              radioBorder = "border-red-600 bg-white";
              radioDotColor = "bg-red-600";
            } else {
              containerStyle = "border-slate-200 opacity-60 text-slate-500 cursor-default";
              badgeStyle = "bg-slate-100 text-slate-400";
              radioBorder = "border-slate-300 bg-white";
            }
          } else if (selected) {
            containerStyle =
              "border-[#1D82EB] bg-blue-50/60 text-slate-900 font-semibold ring-1 ring-[#1D82EB] cursor-pointer";
            badgeStyle = "bg-[#1D82EB] text-white";
            radioBorder = "border-[#1D82EB] bg-white";
            radioDotColor = "bg-[#1D82EB]";
          }

          return (
            <div
              key={opt.id}
              role="button"
              tabIndex={0}
              onClick={() => !isAnswered && onSelectOption(opt.id)}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${containerStyle}`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                >
                  {opt.id}
                </span>
                <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${radioBorder}`}
              >
                {radioDotColor && <div className={`w-2.5 h-2.5 rounded-full ${radioDotColor}`} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Card */}
      {isAnswered && (
        <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 space-y-2.5 animate-in fade-in slide-in-from-top-2 shadow-2xs">
          <div className="flex items-center gap-2 text-[#059669]">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
            <span className="text-xs sm:text-sm font-bold text-[#059669]">
              Correct Answer: {question.correctOption}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-800 pl-6">
            {correctOptObj?.label}
          </p>

          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pl-6 pt-1">
            <strong className="text-slate-800 font-bold">Explanation: </strong>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Action Controls */}
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
            onClick={onNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <span>
              {isAnswered
                ? currentIndex === totalQuestions - 1
                  ? "Complete Session"
                  : "Next Question"
                : "Submit Answer"}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
