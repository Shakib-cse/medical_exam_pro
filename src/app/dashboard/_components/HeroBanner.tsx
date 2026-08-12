"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const STORAGE_KEY = "medicalexampro_practice_session";

export function HeroBanner() {
  const [savedSession, setSavedSession] = useState<{
    topic: string;
    currentIndex: number;
    totalQuestions: number;
    progressPct: number;
    isSaved: boolean;
  }>({
    topic: "Start Your Medical Practice Session",
    currentIndex: 0,
    totalQuestions: 0,
    progressPct: 0,
    isSaved: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStr = localStorage.getItem(STORAGE_KEY);
      if (savedStr) {
        try {
          const parsed = JSON.parse(savedStr);
          const cIndex = typeof parsed.currentIndex === "number" ? parsed.currentIndex : 0;
          const totalQ = typeof parsed.totalQuestions === "number" ? parsed.totalQuestions : 10;
          const pct = Math.round(((cIndex + 1) / totalQ) * 100);

          setSavedSession({
            topic: parsed.topic || "Active Practice Session",
            currentIndex: cIndex,
            totalQuestions: totalQ,
            progressPct: Math.min(100, pct),
            isSaved: true,
          });
        } catch (e) {
          console.error("Error reading saved session in HeroBanner", e);
        }
      }
    }
  }, []);

  // 14 staggered bubble dots matching the reference image graphic
  const dotConfigs = [
    { size: "w-4 h-4", y: "translate-y-0" },
    { size: "w-2.5 h-2.5", y: "-translate-y-1" },
    { size: "w-3 h-3", y: "translate-y-1" },
    { size: "w-4.5 h-4.5", y: "-translate-y-0.5" },
    { size: "w-3 h-3", y: "translate-y-1" },
    { size: "w-4 h-4", y: "-translate-y-1" },
    { size: "w-3 h-3", y: "translate-y-0.5" },
    { size: "w-4.5 h-4.5", y: "-translate-y-1" },
    { size: "w-3 h-3", y: "translate-y-1" },
    { size: "w-4 h-4", y: "-translate-y-0.5" },
    { size: "w-2.5 h-2.5", y: "translate-y-1" },
    { size: "w-4 h-4", y: "-translate-y-1" },
    { size: "w-3 h-3", y: "translate-y-0.5" },
    { size: "w-2.5 h-2.5", y: "-translate-y-0.5" },
  ];

  return (
    <div className="relative w-full rounded-2xl sm:rounded-[22px] bg-navy-card text-white p-6 sm:p-8 border border-white/10 shadow-lg overflow-hidden">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left Column Content */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs sm:text-sm font-medium text-slate-300/80 tracking-wide block">
            {savedSession.isSaved ? "Start where you left off" : "Ready to prepare?"}
          </span>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
            {savedSession.topic}
          </h2>

          <p className="text-slate-300/80 text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
            {savedSession.isSaved
              ? `You stopped at question ${savedSession.currentIndex + 1} of ${savedSession.totalQuestions}. Continue your timed set and review explanations.`
              : "Choose a topic from Clinical Problem Solving or launch a Mock Exam to track your real-time analytics."}
          </p>

          <div className="pt-2">
            <Link
              href={savedSession.isSaved ? "/practice?mode=resume" : "/dashboard/question-bank"}
              className="inline-flex items-center gap-1 px-6 py-2.5 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>{savedSession.isSaved ? "Resume set" : "Start practicing"}</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Right Column Progress Box */}
        <div className="lg:col-span-5 bg-navy/90 border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
            <span className="text-slate-200">Current Progress</span>
            <span className="text-white">{savedSession.progressPct}%</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-5">
            <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${savedSession.progressPct}%` }}
              />
            </div>

            {/* Bubble Dots Graphic */}
            <div className="flex items-center justify-between px-1 py-1">
              {dotConfigs.map((dot, i) => (
                <span
                  key={i}
                  className={`${dot.size} ${dot.y} rounded-full bg-[#004080] transition-all`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
