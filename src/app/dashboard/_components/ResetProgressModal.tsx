"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw, X, Check } from "lucide-react";

interface ResetProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetProgressModal({
  isOpen,
  onClose,
  onConfirm,
}: ResetProgressModalProps) {
  const [resetting, setResetting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleReset = async () => {
    setResetting(true);
    try {
      // Clear local practice history / mock sessions if stored
      if (typeof window !== "undefined") {
        localStorage.removeItem("medicalexampro_practice_session");
        localStorage.removeItem("medicalexampro_user_stats");
        localStorage.removeItem("medicalexampro_flagged_questions");
        localStorage.removeItem("medicalexampro_exam_history");

        // Clear all specialty session and stats keys
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (
            key &&
            (key.startsWith("cps_session_") ||
              key.startsWith("cps_stats_") ||
              key.startsWith("pd_session_") ||
              key.startsWith("pd_stats_") ||
              key.includes("cps_session_") ||
              key.includes("pd_session_") ||
              key.includes("cps_stats_") ||
              key.includes("pd_stats_") ||
              key.startsWith("topic_last_attempt_") ||
              key.includes("topic_last_attempt_"))
          ) {
            localStorage.removeItem(key);
          }
        }
        window.dispatchEvent(new Event("storage"));
      }
      onConfirm();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setResetting(false);
        onClose();
        window.location.reload();
      }, 900);
    } catch (err) {
      console.error("Reset error:", err);
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Reset All Progress?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action will reset your question attempt counts, overall accuracy, time metrics, and weak areas history.
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
          <p className="font-semibold text-slate-800">What will be cleared:</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 text-[11px]">
            <li>Questions attempted and overall score percentages</li>
            <li>Clinical Problem Solving &amp; SJT progress history</li>
            <li>Flagged questions and mock test results</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={resetting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleReset}
            disabled={resetting || success}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange/90 transition-all flex items-center gap-2 shadow-md shadow-brand-orange/20 cursor-pointer disabled:opacity-50"
          >
            {success ? (
              <>
                <Check className="w-4 h-4" />
                <span>Reset Successful</span>
              </>
            ) : resetting ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Confirm Reset</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
