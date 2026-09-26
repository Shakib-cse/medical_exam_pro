"use client";

import React from "react";
import Link from "next/link";
import { Check, Undo2 } from "lucide-react";

export interface ExamResultViewProps {
  specialtyOrTitle: string;
  overallAccuracy: number;
  questionsAttempted?: number;
  averageTime?: string;
  totalQuestions?: number;
  correctCount?: number;
  incorrectCount?: number;
  returnUrl?: string;
  onRetake?: () => void;
  examType?: "CPS" | "Mock" | "PD";
}

export function ExamResultView({
  specialtyOrTitle,
  overallAccuracy,
  questionsAttempted = 0,
  averageTime = "0s",
  totalQuestions,
  correctCount,
  incorrectCount,
  returnUrl = "/dashboard/clinical-problem-solving",
  onRetake,
  examType = "CPS",
}: ExamResultViewProps) {
  // Derive clean names for display matching user's exact specification:
  const cleanParam = (specialtyOrTitle || "Clinical Problem Solving").trim();
  const shortSpecialtyName = cleanParam.replace(/\s+(Medicine|Focus|Practice)$/i, "");
  const fullSpecialtyName = cleanParam.toLowerCase().includes("medicine")
    ? cleanParam
    : `${shortSpecialtyName} Medicine`;

  const topBarTitle =
    examType === "Mock"
      ? "Mock Result"
      : examType === "PD"
      ? "Professional Dilemmas Result"
      : `${shortSpecialtyName} Result`;

  const headingTitle =
    examType === "Mock"
      ? "Mock Exam Completed"
      : examType === "PD"
      ? `${cleanParam} Completed`
      : `${fullSpecialtyName} Completed`;

  const motivationalSubject =
    examType === "Mock"
      ? "mock exam"
      : examType === "PD"
      ? "ethical scenario set"
      : shortSpecialtyName;

  // Outer circular progress ring dimensions
  const outerRadius = 88;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * outerRadius; // 552.92
  const clampedAccuracy = Math.min(100, Math.max(0, Math.round(overallAccuracy)));
  const strokeDashoffset = circumference * (1 - clampedAccuracy / 100);

  // Inner solid blue disc radius (leaving a clean 10px white gap/padding between inner disc and outer ring)
  const innerDiscRadius = 72;

  // Resolved metrics for Mock
  const resolvedTotal = totalQuestions ?? (questionsAttempted > 0 ? questionsAttempted : 115);
  const resolvedCorrect =
    correctCount ?? Math.round((resolvedTotal * clampedAccuracy) / 100);
  const resolvedIncorrect =
    incorrectCount ?? Math.max(0, resolvedTotal - resolvedCorrect);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans">
      {/* 1. TOP NAV BAR (Dark Navy matching screenshot) */}
      <header className="w-full bg-[#0F172A] px-6 sm:px-10 py-3.5 flex items-center justify-between border-b border-[#1E293B]">
        <div className="text-white text-xs sm:text-sm font-semibold tracking-wide">
          {topBarTitle}
        </div>
      </header>

      {/* 2. MAIN RESULTS CONTENT */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-xl mx-auto w-full text-center">
        {/* Green Circular Success Badge with soft translucent mint halo */}
        <div className="flex items-center justify-center mb-5 sm:mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#A7F3D0]/60 flex items-center justify-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#10B981] flex items-center justify-center shadow-xs">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3.5]" />
            </div>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-[30px] font-extrabold text-[#0B1E34] tracking-tight leading-snug">
          {headingTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5">
          Great work! Your results are ready to review.
        </p>

        {/* Donut Accuracy/Score Meter with inner blue disc and white padding ring */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 my-7 sm:my-8 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background Outer Ring Track */}
            <circle
              cx="100"
              cy="100"
              r={outerRadius}
              stroke="#F1F5F9"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Active Blue Progress Arc with flat cut (strokeLinecap="butt") */}
            <circle
              cx="100"
              cy="100"
              r={outerRadius}
              stroke="#1D82EB"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt"
              className="transition-all duration-1000 ease-out"
            />

            {/* Inner Solid Blue Disc (padded from inside by white gap) */}
            <circle
              cx="100"
              cy="100"
              r={innerDiscRadius}
              fill="#1D82EB"
            />
          </svg>

          {/* White Text Centered inside the Inner Blue Disc */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-3xl sm:text-[40px] font-extrabold text-white tracking-tight leading-none">
              {clampedAccuracy}%
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-white/95 mt-1 tracking-normal">
              {examType === "Mock" ? "Overall Score" : "Overall Accuracy"}
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        {examType === "Mock" ? (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[450px] mb-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 py-4 sm:py-5 px-3 sm:px-4 text-center shadow-xs flex flex-col items-center justify-center min-h-[90px]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1E34] tracking-tight">
                {resolvedTotal}
              </div>
              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1.5">
                Total Questions
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 py-4 sm:py-5 px-3 sm:px-4 text-center shadow-xs flex flex-col items-center justify-center min-h-[90px]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1E34] tracking-tight">
                {resolvedCorrect}
              </div>
              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1.5">
                Correct
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 py-4 sm:py-5 px-3 sm:px-4 text-center shadow-xs flex flex-col items-center justify-center min-h-[90px]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1E34] tracking-tight">
                {resolvedIncorrect}
              </div>
              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1.5">
                Incorrect
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full max-w-[430px] mb-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 py-5 sm:py-6 px-4 sm:px-6 text-center shadow-xs flex flex-col items-center justify-center min-h-[96px]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1E34] tracking-tight">
                {questionsAttempted}
              </div>
              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1.5">
                Questions Attempted
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 py-5 sm:py-6 px-4 sm:px-6 text-center shadow-xs flex flex-col items-center justify-center min-h-[96px]">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1E34] tracking-tight">
                {averageTime || "0s"}
              </div>
              <div className="text-xs sm:text-[13px] text-slate-500 font-normal mt-1.5">
                Average Time
              </div>
            </div>
          </div>
        )}

        {/* Motivational Feedback Text */}
        <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-md mx-auto text-center mb-7">
          Good progress! You&apos;ve completed this {motivationalSubject} and achieved a {clampedAccuracy}% score. Keep practising to strengthen your performance and build confidence for the MSRA.
        </p>

        {/* Primary CTA Button: Return to Dashboard */}
        <div className="flex flex-col items-center">
          <Link
            href={returnUrl}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Undo2 className="w-4 h-4 stroke-[2.5]" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

