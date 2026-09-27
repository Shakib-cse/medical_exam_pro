"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface OverallPerformanceProps {
  cpsData?: {
    attempted: number;
    total: number;
    accuracy: number;
  };
  pdData?: {
    attempted: number;
    total: number;
    accuracy: number;
  };
  mockData?: {
    taken: number;
    total: number;
    avgScore: number;
  };
  isPDOnly?: boolean;
}

export function OverallPerformance({
  cpsData = { attempted: 0, total: 8502, accuracy: 0 },
  pdData = { attempted: 0, total: 2505, accuracy: 0 },
  mockData = { taken: 0, total: 10, avgScore: 0 },
  isPDOnly = false,
}: OverallPerformanceProps) {
  const cpsPercent =
    cpsData.total > 0 ? Math.round((cpsData.attempted / cpsData.total) * 100) : 0;
  const pdPercent =
    pdData.total > 0 ? Math.round((pdData.attempted / pdData.total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        Overall Performance
      </h2>

      {isPDOnly ? (
        /* When user has Professional Dilemmas ONLY: Hide CPS and Mock Exam cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card: Professional Dilemmas */}
          <Link
            href="/dashboard/professional-dilemmas"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer relative"
          >
            {/* Top Row: Title + Green Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1875d2] transition-colors">
                  Professional Dilemmas
                </h3>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                  Active Plan
                </span>
              </div>
              {/* Green Badge */}
              <div className="px-3 py-1.5 rounded-lg bg-[#00a86b] text-white text-center shadow-xs shrink-0 flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
                  Accuracy
                </span>
                <span className="text-sm font-black leading-tight">
                  {pdData.accuracy}%
                </span>
              </div>
            </div>

            {/* Metric & Progress */}
            <div className="space-y-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900">
                  {pdData.attempted.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  / {pdData.total.toLocaleString()} attempted
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1875d2] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(pdPercent, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-400">
                  {pdPercent}% Completed
                </p>
              </div>
            </div>
          </Link>

          {/* Upgrade Banner Card */}
          <Link
            href="/dashboard/subscription"
            className="group bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 rounded-2xl p-5 sm:p-6 border border-blue-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer relative md:col-span-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Full MSRA Pass Available
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#1875d2] transition-colors">
                  Unlock Clinical Problem Solving & 10 Mock Exams
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                  Upgrade your plan to unlock 8,502 Clinical SBA questions, all 10 clinical specialties, and 10 full-length timed mock simulations.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white text-[#1875d2] shadow-xs border border-blue-100 group-hover:scale-105 transition-transform shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            <div className="pt-2 flex items-center text-xs font-bold text-[#1875d2] gap-1.5 group-hover:gap-2.5 transition-all">
              <span>View upgrade options in Subscription</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      ) : (
        /* Full MSRA Pass or Admin: show all 3 cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Clinical Problem Solving */}
          <Link
            href="/dashboard/clinical-problem-solving"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer relative"
          >
            {/* Top Row: Title + Green Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1875d2] transition-colors">
                  Clinical Problem Solving
                </h3>
              </div>
              {/* Green Badge */}
              <div className="px-3 py-1.5 rounded-lg bg-[#00a86b] text-white text-center shadow-xs shrink-0 flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
                  Accuracy
                </span>
                <span className="text-sm font-black leading-tight">
                  {cpsData.accuracy}%
                </span>
              </div>
            </div>

            {/* Metric & Progress */}
            <div className="space-y-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900">
                  {cpsData.attempted.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  / {cpsData.total.toLocaleString()} attempted
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1875d2] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(cpsPercent, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-400">
                  {cpsPercent}% Completed
                </p>
              </div>
            </div>
          </Link>

          {/* Card 2: Professional Dilemmas */}
          <Link
            href="/dashboard/professional-dilemmas"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer relative"
          >
            {/* Top Row: Title + Green Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1875d2] transition-colors">
                  Professional Dilemmas
                </h3>
              </div>
              {/* Green Badge */}
              <div className="px-3 py-1.5 rounded-lg bg-[#00a86b] text-white text-center shadow-xs shrink-0 flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
                  Accuracy
                </span>
                <span className="text-sm font-black leading-tight">
                  {pdData.accuracy}%
                </span>
              </div>
            </div>

            {/* Metric & Progress */}
            <div className="space-y-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900">
                  {pdData.attempted.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  / {pdData.total.toLocaleString()} attempted
                </span>
              </div>

              <div className="space-y-1">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1875d2] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(pdPercent, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-400">
                  {pdPercent}% Completed
                </p>
              </div>
            </div>
          </Link>

          {/* Card 3: Mock Exams */}
          <Link
            href="/dashboard/mock-exams"
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 cursor-pointer relative"
          >
            {/* Top Row: Title + Green Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1875d2] transition-colors">
                  Mock Exams
                </h3>
              </div>
              {/* Green Badge */}
              <div className="px-3 py-1.5 rounded-lg bg-[#00a86b] text-white text-center shadow-xs shrink-0 flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
                  AVG Score
                </span>
                <span className="text-sm font-black leading-tight">
                  {mockData.avgScore}%
                </span>
              </div>
            </div>

            {/* Metric & Progress */}
            <div className="space-y-2.5">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900">
                  {String(mockData.taken).padStart(2, "0")} / {String(mockData.total).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Mocks Taken
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#1875d2] group-hover:translate-x-1 transition-transform">
                <span>View Mock Exam Hub</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
