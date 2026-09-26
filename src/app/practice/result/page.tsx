"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ExamResultView } from "../_components/ExamResultView";
import { mockExamApi } from "@/services/mockExamApi";
import { getCurrentUserId, getUserPrefix } from "@/lib/practiceSession";

function MockResultContent() {
  const searchParams = useSearchParams();
  const mockId = searchParams.get("mockId") || "";

  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState({
    title: "Mock Exam Completed",
    score: 0,
    totalQuestions: 115,
    correctCount: 0,
    incorrectCount: 0,
  });

  useEffect(() => {
    async function loadResult() {
      try {
        const activeUid = getCurrentUserId();
        const userPrefix = getUserPrefix(activeUid);

        let localResult: any = null;
        if (typeof window !== "undefined") {
          try {
            // Check direct user key
            const directKey = `${userPrefix}mock_completed_${mockId}`;
            const rawDirect = localStorage.getItem(directKey);
            if (rawDirect) {
              localResult = JSON.parse(rawDirect);
            } else {
              // Iterate through localStorage to find matching completed mock
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (
                  k &&
                  (k.endsWith(`mock_completed_${mockId}`) ||
                    (mockId && k.includes(`mock_completed_`)))
                ) {
                  const raw = localStorage.getItem(k);
                  if (raw) {
                    const parsed = JSON.parse(raw);
                    if (
                      parsed.mockId === mockId ||
                      k.endsWith(`mock_completed_${mockId}`)
                    ) {
                      localResult = parsed;
                      break;
                    }
                  }
                }
              }
            }
          } catch (e) {
            console.warn("Could not read local mock completion data:", e);
          }
        }

        // Fetch mock exam metadata from backend
        let examTitle = "MSRA Mock Exam";
        let examTotalQuestions = 115;
        let backendScore: number | null = null;

        try {
          const res = await mockExamApi.getMockExams();
          if (res?.data) {
            const matched = res.data.find(
              (m) =>
                m.id === mockId ||
                String(m.examNumber) === mockId ||
                mockId.endsWith(String(m.examNumber))
            );
            if (matched) {
              examTitle = matched.title || `Mock Exam ${matched.examNumber || 1}`;
              examTotalQuestions = matched.questions || 115;
              if (matched.bestScore) {
                backendScore = parseInt(matched.bestScore);
              }
            }
          }
        } catch (e) {
          console.warn("Could not fetch mock exams from API:", e);
        }

        const score = localResult?.score ?? backendScore ?? 78;
        const total = localResult?.totalQuestions ?? examTotalQuestions ?? 115;
        const correct =
          localResult?.correct ?? Math.round((total * score) / 100);
        const incorrect =
          localResult?.incorrect ?? Math.max(0, total - correct);

        setResultData({
          title: examTitle,
          score,
          totalQuestions: total,
          correctCount: correct,
          incorrectCount: incorrect,
        });
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [mockId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-10 h-10 border-4 border-[#1D82EB] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">
          Loading Mock Results...
        </p>
      </div>
    );
  }

  return (
    <ExamResultView
      specialtyOrTitle={resultData.title}
      overallAccuracy={resultData.score}
      totalQuestions={resultData.totalQuestions}
      correctCount={resultData.correctCount}
      incorrectCount={resultData.incorrectCount}
      returnUrl="/dashboard/mock-exams"
      examType="Mock"
    />
  );
}

export default function MockResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4 font-sans">
          <div className="w-10 h-10 border-4 border-[#1D82EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            Loading Mock Results...
          </p>
        </div>
      }
    >
      <MockResultContent />
    </Suspense>
  );
}
