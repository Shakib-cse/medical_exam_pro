"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, Scale, FileText, ArrowRight, Sparkles, HelpCircle } from "lucide-react";

function PracticeRouter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mockId = searchParams.get("mockId");
    const examId = searchParams.get("examId");
    const domainId = searchParams.get("domainId");
    const type = searchParams.get("type");
    const speciality = searchParams.get("speciality");
    const topic = searchParams.get("topic") || "";
    const topicId = searchParams.get("topicId");
    const bankId = searchParams.get("bankId");

    const queryStr = searchParams.toString();

    // 1. Mock Exam redirection
    if (mockId || examId || topic.toLowerCase().includes("mock")) {
      router.replace(`/practice/mock-exam${queryStr ? `?${queryStr}` : ""}`);
      return;
    }

    // 2. Professional Dilemmas redirection
    if (
      domainId ||
      type === "SJT" ||
      type === "RANKING" ||
      speciality?.toLowerCase().includes("dilemma") ||
      topic.toLowerCase().includes("dilemma") ||
      topic.toLowerCase().includes("professional")
    ) {
      router.replace(`/practice/professional-dilemmas${queryStr ? `?${queryStr}` : ""}`);
      return;
    }

    // 3. Clinical redirection
    if (topicId || bankId || speciality || (topic && topic !== "Mock Practice Exam")) {
      router.replace(`/practice/clinical${queryStr ? `?${queryStr}` : ""}`);
      return;
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Medical Practice Modules
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Select Your Practice Mode
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
            Choose from 3 specialised practice environments tailored to MSRA preparation.
          </p>
        </div>

        {/* 3 Separate Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Clinical Problem Solving */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Clinical Focus
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Clinical Problem Solving
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Practice SBA questions with clinical vignettes, immediate feedback, diagnostic rationales, and full question navigator.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                href="/practice/clinical"
                className="w-full py-2.5 px-4 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Launch Clinical Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Professional Dilemmas */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                SJT / Dilemmas
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Professional Dilemmas
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Situational Judgment Test (SJT) with interactive 1-to-5 ranking, ethical integrity scenarios, and GMC guidance consensus.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                href="/practice/professional-dilemmas"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Launch SJT Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Mock Exam */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange bg-orange-50 px-2 py-0.5 rounded-md">
                Full MSRA Simulation
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-2">
                Mock Exam
              </h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Realistic exam condition timed simulation covering both papers with flag for review, section progression, and score report.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link
                href="/practice/mock-exam"
                className="w-full py-2.5 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Start Mock Exam</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StandalonePracticePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <PracticeRouter />
    </Suspense>
  );
}
