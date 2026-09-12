"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Flag, XCircle, Ban } from "lucide-react";

interface QuickAccessHighlightsProps {
  flaggedCount?: number;
  incorrectCount?: number;
  unattemptedCount?: number;
}

export function QuickAccessHighlights({
  flaggedCount: propFlagged,
  incorrectCount: propIncorrect,
  unattemptedCount: propUnattempted,
}: QuickAccessHighlightsProps) {
  const [counts, setCounts] = useState({
    flagged: propFlagged ?? 128,
    incorrect: propIncorrect ?? 412,
    unattempted: propUnattempted ?? 1265,
  });

  // Sync with prop changes if passed
  useEffect(() => {
    if (
      propFlagged !== undefined ||
      propIncorrect !== undefined ||
      propUnattempted !== undefined
    ) {
      setCounts({
        flagged: propFlagged ?? 128,
        incorrect: propIncorrect ?? 412,
        unattempted: propUnattempted ?? 1265,
      });
    }
  }, [propFlagged, propIncorrect, propUnattempted]);

  // Load from localStorage if available
  useEffect(() => {
    const loadStats = () => {
      try {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("medicalexampro_user_stats");
          if (saved) {
            const parsed = JSON.parse(saved);
            setCounts((prev) => ({
              flagged: propFlagged ?? parsed.flaggedCount ?? prev.flagged,
              incorrect: propIncorrect ?? parsed.incorrectCount ?? prev.incorrect,
              unattempted: propUnattempted ?? parsed.unattemptedCount ?? prev.unattempted,
            }));
          }
        }
      } catch (e) {
        console.warn("Could not load stored quick access counts:", e);
      }
    };

    loadStats();
    window.addEventListener("storage", loadStats);
    return () => window.removeEventListener("storage", loadStats);
  }, [propFlagged, propIncorrect, propUnattempted]);

  return (
    <div className="w-full bg-[#09223a]/95 backdrop-blur-md rounded-2xl py-2 px-2.5 sm:py-2.5 sm:px-3.5 border border-[#133c63] shadow-2xl shadow-slate-950/40">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#18426d]/80">
        {/* Section 1: Flagged Cases */}
        <div className="pb-2 md:pb-0 md:pr-3">
          <Link
            href="/dashboard/flags"
            className="group w-full h-full border border-[#1D82EB] bg-[#0c2b4a]/80 hover:bg-[#113a63] rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 flex items-center gap-3 transition-all cursor-pointer shadow-xs"
          >
            {/* Flag Icon Box */}
            <div className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg bg-[#144270]/90 border border-[#23588f] flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform shadow-inner">
              <Flag className="w-4.5 h-4.5 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-semibold text-slate-300 leading-tight">
                Flagged Cases
              </p>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5">
                {counts.flagged.toLocaleString()}
              </div>
            </div>
          </Link>
        </div>

        {/* Section 2: Answered Incorrectly */}
        <div className="py-2 md:py-0 md:px-3">
          <Link
            href="/dashboard/question-bank?filter=incorrect"
            className="group w-full h-full border border-[#1D82EB] bg-[#0c2b4a]/80 hover:bg-[#113a63] rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 flex items-center gap-3 transition-all cursor-pointer shadow-xs"
          >
            {/* Cross Icon Box */}
            <div className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg bg-[#144270]/90 border border-[#23588f] flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform shadow-inner">
              <XCircle className="w-4.5 h-4.5 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-semibold text-slate-300 leading-tight">
                Answered Incorrectly
              </p>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5">
                {counts.incorrect.toLocaleString()}
              </div>
            </div>
          </Link>
        </div>

        {/* Section 3: Unattempted Cases */}
        <div className="pt-2 md:pt-0 md:pl-3">
          <Link
            href="/dashboard/question-bank?filter=unattempted"
            className="group w-full h-full border border-[#1D82EB] bg-[#0c2b4a]/80 hover:bg-[#113a63] rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 flex items-center gap-3 transition-all cursor-pointer shadow-xs"
          >
            {/* Ban / Circle-Slash Icon Box */}
            <div className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg bg-[#144270]/90 border border-[#23588f] flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform shadow-inner">
              <Ban className="w-4.5 h-4.5 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-semibold text-slate-300 leading-tight">
                Unattempted Cases
              </p>
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5">
                {counts.unattempted.toLocaleString()}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
