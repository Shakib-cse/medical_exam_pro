"use client";

import React, { useMemo } from "react";
import { Flag, MessageSquare, ChevronLeft, ChevronRight, CheckCircle2, Users, BarChart2 } from "lucide-react";
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

/**
 * Deterministically compute candidate selection percentages for options
 */
function computeOptionDistribution(question: SBAQuestion): Record<string, number> {
  const options = question.options || [];
  const correctOpt = question.correctOption || "A";

  if (question.peerStats && Object.keys(question.peerStats).length > 0) {
    const res: Record<string, number> = {};
    let total = 0;
    options.forEach((opt) => {
      const val = question.peerStats?.[opt.id] ?? 0;
      res[opt.id] = val;
      total += val;
    });
    if (total > 0) return res;
  }

  // Realistic deterministic distribution if live peer stats are low
  const seed = String(question.id || question.question || "med-q-seed");
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);

  // Correct answer between 48% and 62%
  const correctPct = 48 + (abs % 15);
  const remaining = 100 - correctPct;
  const distractors = options.filter((o) => o.id !== correctOpt);
  const result: Record<string, number> = {};

  if (distractors.length === 0) {
    result[correctOpt] = 100;
    return result;
  }

  result[correctOpt] = correctPct;
  let allocated = 0;
  distractors.forEach((d, idx) => {
    if (idx === distractors.length - 1) {
      result[d.id] = Math.max(0, remaining - allocated);
    } else {
      const factor = ((abs + (idx + 1) * 7) % 8) + 4;
      const share = Math.max(6, Math.round((remaining / distractors.length) * (factor / 7)));
      const capped = Math.min(share, remaining - allocated - (distractors.length - 1 - idx) * 5);
      result[d.id] = Math.max(5, capped);
      allocated += result[d.id];
    }
  });

  const sum = Object.values(result).reduce((a, b) => a + b, 0);
  if (sum !== 100 && distractors.length > 0) {
    result[distractors[0].id] = Math.max(0, result[distractors[0].id] + (100 - sum));
  }

  return result;
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

  // Computed peer percentages per option
  const distribution = useMemo(() => computeOptionDistribution(question), [question]);

  // Breakdown summary text (e.g. "22% selected A, 10% selected B, 48% selected C, 20% selected D")
  const breakdownSummary = useMemo(() => {
    return (question.options || [])
      .map((opt) => `${distribution[opt.id] ?? 0}% selected ${opt.id}`)
      .join(", ");
  }, [question.options, distribution]);

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
          const pct = distribution[opt.id] ?? 0;

          let containerStyle =
            "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800 cursor-pointer";
          let badgeStyle = "bg-slate-100 text-slate-600";
          let radioBorder = "border-slate-300 bg-white";
          let radioDotColor = "";
          let progressFill = "bg-slate-100/70";

          if (isAnswered) {
            if (isCorrectOption) {
              containerStyle =
                "border-emerald-500 bg-[#E8F8F0]/40 text-emerald-950 font-semibold ring-1 ring-emerald-500 cursor-default";
              badgeStyle = "bg-[#059669] text-white";
              radioBorder = "border-emerald-600 bg-white";
              radioDotColor = "bg-emerald-600";
              progressFill = "bg-emerald-500/15";
            } else if (selected && !isCorrectOption) {
              containerStyle =
                "border-red-500 bg-[#FEF2F2]/40 text-red-950 font-semibold ring-1 ring-red-500 cursor-default";
              badgeStyle = "bg-red-600 text-white";
              radioBorder = "border-red-600 bg-white";
              radioDotColor = "bg-red-600";
              progressFill = "bg-red-500/15";
            } else {
              containerStyle = "border-slate-200 text-slate-600 cursor-default";
              badgeStyle = "bg-slate-100 text-slate-500";
              radioBorder = "border-slate-300 bg-white";
              progressFill = "bg-slate-200/50";
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
              className={`relative overflow-hidden p-4 rounded-xl border flex items-center justify-between transition-all ${containerStyle}`}
            >
              {/* Option Background Progress Bar when answered (Commented out for v1 - admin only)
              {isAnswered && (
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out pointer-events-none ${progressFill}`}
                  style={{ width: `${pct}%` }}
                />
              )}
              */}

              <div className="relative z-10 flex items-center gap-3.5 flex-1 pr-3">
                <span
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                >
                  {opt.id}
                </span>
                <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
              </div>

              <div className="relative z-10 flex items-center gap-3 shrink-0">
                {/* Peer Selection Percentage Badge (Commented out for v1 - admin only)
                {isAnswered && (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                      isCorrectOption
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300/80"
                        : selected
                        ? "bg-red-100 text-red-800 border border-red-300/80"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {pct}% selected
                  </span>
                )}
                */}

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${radioBorder}`}
                >
                  {radioDotColor && <div className={`w-2.5 h-2.5 rounded-full ${radioDotColor}`} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Card */}
      {isAnswered && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          {/* Candidate Response Distribution Panel (Commented out for v1 - admin only)
          <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <BarChart2 className="w-4 h-4 text-blue-600" />
                <span>Candidate Response Distribution</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {question.totalAttempts ? `${question.totalAttempts.toLocaleString()} candidate attempts` : "Community Peer Statistics"}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-700">
              <span className="font-bold text-slate-900">Breakdown: </span>
              {breakdownSummary}
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200/80 border border-slate-200">
                {question.options.map((opt, i) => {
                  const pct = distribution[opt.id] ?? 0;
                  if (pct === 0) return null;
                  const isCorrect = opt.id === question.correctOption;
                  const colors = [
                    "bg-blue-500",
                    "bg-amber-500",
                    "bg-purple-500",
                    "bg-cyan-500",
                    "bg-indigo-500",
                  ];
                  const color = isCorrect ? "bg-emerald-500" : colors[i % colors.length];

                  return (
                    <div
                      key={opt.id}
                      style={{ width: `${pct}%` }}
                      className={`${color} h-full transition-all duration-500 relative group`}
                      title={`Option ${opt.id}: ${pct}% selected`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-semibold">
                {question.options.map((opt, i) => {
                  const isCorrect = opt.id === question.correctOption;
                  const colors = [
                    "bg-blue-500",
                    "bg-amber-500",
                    "bg-purple-500",
                    "bg-cyan-500",
                    "bg-indigo-500",
                  ];
                  const dotColor = isCorrect ? "bg-emerald-500" : colors[i % colors.length];

                  return (
                    <div key={opt.id} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                      <span>
                        {opt.id}: <strong className="text-slate-800">{distribution[opt.id] ?? 0}%</strong>
                        {isCorrect && " (Correct)"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          */}

          {/* Explanation Card */}
          <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 space-y-2.5 shadow-2xs">
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
