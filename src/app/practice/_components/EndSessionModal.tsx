"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface EndSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEnd: () => void;
  answeredCount: number;
  totalCount: number;
  examType?: string;
}

export function EndSessionModal({
  isOpen,
  onClose,
  onConfirmEnd,
  answeredCount,
  totalCount,
  examType = "practice",
}: EndSessionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 border border-[#E0E4EA] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              End {examType === "PD" ? "Professional Dilemmas" : examType === "CPS" ? "Clinical" : "Practice"} Session?
            </h3>
            <p className="text-xs text-slate-400">Your current progress will be scored.</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          You have answered <strong className="text-slate-900 font-bold">{answeredCount}</strong> of{" "}
          <strong className="text-slate-900 font-bold">{totalCount}</strong> questions in this session. Ending now will record your attempt and display your detailed results.
        </p>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onConfirmEnd}
            className="w-full py-3 rounded-xl bg-[#E11D48] hover:bg-[#be123c] text-white font-bold text-xs sm:text-sm text-center block transition-all shadow-xs cursor-pointer"
          >
            End Session &amp; View Results
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center block transition-colors cursor-pointer"
          >
            Continue Practice
          </button>
        </div>
      </div>
    </div>
  );
}
