"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Flag, XCircle, Ban, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getAggregatePracticeStats,
  getCurrentUserId,
  TOTAL_OVERALL_QUESTIONS,
} from "@/lib/practiceSession";

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
  const user = useSelector((state: RootState) => state.auth.user);

  const [counts, setCounts] = useState(() => {
    const activeUserId = typeof window !== "undefined" ? (user?.id || getCurrentUserId()) : null;
    const agg = typeof window !== "undefined" ? getAggregatePracticeStats(activeUserId) : null;
    return {
      flagged: propFlagged ?? (agg ? agg.flagged : 0),
      incorrect: propIncorrect ?? (agg ? agg.incorrect : 0),
      unattempted: propUnattempted ?? (agg ? agg.unattempted : TOTAL_OVERALL_QUESTIONS),
    };
  });

  const refreshStats = useCallback(() => {
    try {
      const activeUserId = user?.id || getCurrentUserId();
      const agg = getAggregatePracticeStats(activeUserId);
      setCounts({
        flagged: propFlagged ?? agg.flagged,
        incorrect: propIncorrect ?? agg.incorrect,
        unattempted: propUnattempted ?? agg.unattempted,
      });
    } catch (e) {
      console.warn("Could not calculate dynamic quick access counts:", e);
    }
  }, [propFlagged, propIncorrect, propUnattempted, user?.id]);

  // Sync with prop changes if passed or when user logs in/out
  useEffect(() => {
    refreshStats();
  }, [refreshStats, user?.id]);

  // Load and subscribe to real-time events across windows & practice sessions
  useEffect(() => {
    refreshStats();

    window.addEventListener("storage", refreshStats);
    window.addEventListener("focus", refreshStats);
    window.addEventListener("practice_session_update", refreshStats);
    window.addEventListener("pd_session_update", refreshStats);
    window.addEventListener("flagged_questions_update", refreshStats);

    return () => {
      window.removeEventListener("storage", refreshStats);
      window.removeEventListener("focus", refreshStats);
      window.removeEventListener("practice_session_update", refreshStats);
      window.removeEventListener("pd_session_update", refreshStats);
      window.removeEventListener("flagged_questions_update", refreshStats);
    };
  }, [refreshStats, user?.id]);

  return (
    <div className="w-full bg-[#09223a]/95 backdrop-blur-md rounded-2xl py-2 px-2.5 sm:py-2.5 sm:px-3.5 border border-[#133c63] shadow-2xl shadow-slate-950/40">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#18426d]/80">
        {/* Section 1: Flagged Cases (Interactive Button linking to Flag part) */}
        <div className="pb-2 md:pb-0 md:pr-3">
          <Link
            href="/dashboard/flags"
            title="Go to flagged cases"
            className="group w-full h-full border border-[#1D82EB] bg-[#0c2b4a]/90 hover:bg-[#113a63] active:bg-[#0c2b4a] rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer shadow-xs hover:border-[#3b96f5] hover:shadow-[0_0_14px_rgba(29,130,235,0.22)] active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Flag Icon Box */}
              <div className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg bg-[#144270]/90 border border-[#23588f] flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform shadow-inner">
                <Flag className="w-4.5 h-4.5 text-white stroke-[2.2]" />
              </div>
              <div className="min-w-0 text-left">
                <p className="text-[11px] sm:text-xs font-semibold text-slate-300 leading-tight group-hover:text-white transition-colors">
                  Flagged Cases
                </p>
                <div className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight mt-0.5">
                  {counts.flagged.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Subtle Chevron indicator showing it's a clickable button */}
            <div className="shrink-0 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Section 2: Answered Incorrectly (Static Informational Card) */}
        <div className="py-2 md:py-0 md:px-3">
          <div
            className="w-full h-full border border-[#18426d]/70 bg-[#0c2b4a]/60 rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 flex items-center gap-3 cursor-default shadow-xs select-none"
          >
            {/* Cross Icon Box */}
            <div className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg bg-[#144270]/90 border border-[#23588f] flex items-center justify-center shrink-0 text-white shadow-inner">
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
          </div>
        </div>

        {/* Section 3: Unattempted Cases (Static Informational Card) */}
        <div className="pt-2 md:pt-0 md:pl-3">
          <div
            className="w-full h-full border border-[#18426d]/70 bg-[#0c2b4a]/60 rounded-xl py-2 px-3 sm:py-2.5 sm:px-3.5 flex items-center gap-3 cursor-default shadow-xs select-none"
          >
            {/* Ban / Circle-Slash Icon Box */}
            <div className="w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-lg bg-[#144270]/90 border border-[#23588f] flex items-center justify-center shrink-0 text-white shadow-inner">
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
          </div>
        </div>
      </div>
    </div>
  );
}

