"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
  title?: string;
  description?: string;
}

export function ReportIssueModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Report Issue",
  description = "Found an inaccuracy, typo, or outdated guideline in this question? Your report helps maintain MSRA examination quality.",
}: ReportIssueModalProps) {
  const [reportText, setReportText] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    onSubmit(reportText.trim());
    setReportText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base text-slate-900">{title}</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe what you think is inaccurate or should be improved..."
            rows={3}
            required
            className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setReportText("");
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reportText.trim()}
              className="px-4 py-2 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
