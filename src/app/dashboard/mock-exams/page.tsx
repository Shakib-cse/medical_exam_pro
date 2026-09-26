"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Info, Trophy, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { mockExamApi } from "@/services/mockExamApi";
import { getCurrentUserId, getUserPrefix } from "@/lib/practiceSession";

interface MockCardItem {
  id: string;
  mockNumber: number;
  title: string;
  isCompleted: boolean;
  score: number;
  dateTaken: string;
  duration?: string;
  questions?: number;
}

const cleanInitialMocks: MockCardItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `mock-${i + 1}`,
  mockNumber: i + 1,
  title: `Mock Exam ${i + 1}`,
  isCompleted: false,
  score: 0,
  dateTaken: "Not attempted yet",
  duration: "120 mins",
  questions: 115,
}));

export default function MockExamsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [mockList, setMockList] = useState<MockCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const activeUid = user?.id || getCurrentUserId();
        const userPrefix = getUserPrefix(activeUid);

        const res = await mockExamApi.getMockExams();
        if (!isMounted) return;

        if (res?.data && res.data.length > 0) {
          const mapped: MockCardItem[] = res.data.map((item, idx) => {
            // Backend attempt is strictly for this user (backend filters by req.user.id)
            const hasBackendAttempt = !item.notAttempted && Boolean(item.bestScore);
            let localCompleted: any = null;

            // ONLY check keys that belong strictly to this specific active user:
            if (typeof window !== "undefined" && activeUid) {
              try {
                const key1 = `${userPrefix}mock_completed_${item.id}`;
                const key2 = `${userPrefix}mock_completed_${item.examNumber}`;
                const raw = localStorage.getItem(key1) || localStorage.getItem(key2);
                if (raw) {
                  localCompleted = JSON.parse(raw);
                }
              } catch {}
            }

            const isComp = hasBackendAttempt || Boolean(localCompleted);
            const scoreVal = hasBackendAttempt
              ? (parseInt(item.bestScore || "0") || 0)
              : (localCompleted?.score ?? 0);

            const dateVal = hasBackendAttempt
              ? (item.dateTaken || "Not attempted yet")
              : localCompleted?.completedAt
              ? new Date(localCompleted.completedAt).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "Not attempted yet";

            return {
              id: item.id,
              mockNumber: item.examNumber || idx + 1,
              title: item.title || `Mock Exam ${idx + 1}`,
              isCompleted: isComp,
              score: isComp ? scoreVal : 0,
              dateTaken: isComp ? dateVal : "Not attempted yet",
              duration: item.duration,
              questions: item.questions,
            };
          });
          setMockList(mapped);
        } else {
          setMockList(cleanInitialMocks);
        }
      } catch (err) {
        console.warn("Could not fetch mock exams, using clean list:", err);
        if (isMounted) {
          setMockList(cleanInitialMocks);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    window.addEventListener("storage", loadData);
    window.addEventListener("focus", loadData);
    window.addEventListener("mock_session_update", loadData);
    window.addEventListener("practice_session_update", loadData);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadData);
      window.removeEventListener("focus", loadData);
      window.removeEventListener("mock_session_update", loadData);
      window.removeEventListener("practice_session_update", loadData);
    };
  }, [user?.id]);


  const completedCount = mockList.filter((m) => m.isCompleted).length;
  const totalCount = mockList.length || 10;
  const completedMocks = mockList.filter((m) => m.isCompleted && m.score > 0);
  const avgScore =
    completedMocks.length > 0
      ? Math.round(
          completedMocks.reduce((acc, curr) => acc + curr.score, 0) /
            completedMocks.length
        )
      : 0;

  return (
    <div className="space-y-6 sm:space-y-7 pb-10 w-full">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-[32px] lg:text-[38px] font-bold text-[#141B25] tracking-tight leading-tight">
          Mock Exams
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm lg:text-[16px] font-normal">
          Practice full-length timed mocks in the real MSRA sequence.
        </p>
      </div>

      {/* 2. Top Stats: 2 Cards (Spanning 50% each on md+) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 w-full">
          {/* Card 1 Skeleton */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-center min-h-[160px] space-y-3">
            <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-28 bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Card 2 Skeleton */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between min-h-[160px]">
            <div className="space-y-3">
              <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
              <div className="h-10 w-20 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="w-20 h-20 rounded-full border-[6.5px] border-slate-200 bg-slate-50 flex items-center justify-center animate-pulse">
              <div className="w-11 h-11 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 w-full">
          {/* Card 1: Questions Attempted */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-center min-h-[160px] space-y-2">
            <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Questions Attempted
            </p>
            <div className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141B25] tracking-tight">
              {String(completedCount).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
            </div>
          </div>

          {/* Card 2: Average Score with Donut Gauge */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between min-h-[160px]">
            <div className="space-y-2">
              <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">Average Score</p>
              <div className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141B25] tracking-tight">
                {avgScore}%
              </div>
            </div>

            {/* Radial Ring with Inner Disc and Gap Margin */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                {/* Inner soft filled disc with white gap margin */}
                <circle cx="40" cy="40" r="23.5" fill="#F1F5F9" />
                {/* Outer Track background circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="33"
                  stroke="#EDF2F7"
                  strokeWidth="6.5"
                  fill="none"
                />
                {/* Outer Progress Blue Ring with butt linecap */}
                <circle
                  cx="40"
                  cy="40"
                  r="33"
                  stroke="#1D82EB"
                  strokeWidth="6.5"
                  strokeDasharray={2 * Math.PI * 33}
                  strokeDashoffset={(2 * Math.PI * 33) * (1 - avgScore / 100)}
                  strokeLinecap="butt"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">
                  {avgScore}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Grid of Mock Exam Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
        {isLoading
          ? Array.from({ length: 10 }, (_, i) => (
              <div
                key={`mock-skeleton-${i}`}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-5 min-h-[220px]"
              >
                {/* Header Skeleton */}
                <div className="flex items-center justify-between gap-2">
                  <div className="h-5 w-28 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 w-22 bg-slate-100 rounded-full border border-slate-200 animate-pulse" />
                </div>

                {/* Score & Taken Date Skeleton */}
                <div className="space-y-2.5">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-36 bg-slate-100 rounded animate-pulse" />
                </div>

                {/* Action Skeleton */}
                <div className="pt-2">
                  <div className="w-full h-10 rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))
          : mockList.map((mock) => (
              <div
                key={mock.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header: Title + Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-[#141B25] text-base sm:text-[17px]">
                    {mock.title}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      mock.isCompleted
                        ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]"
                        : "bg-[#F1F3F6] text-[#64748B] border border-[#E0E4EA]"
                    }`}
                  >
                    {mock.isCompleted ? "Completed" : "Not attempted"}
                  </span>
                </div>

                {/* Score & Taken Date */}
                <div className="space-y-2 text-xs sm:text-[13px]">
                  <div className="flex items-center gap-2">
                    <Trophy
                      className={`w-4 h-4 shrink-0 ${
                        mock.isCompleted ? "text-[#059669]" : "text-slate-400"
                      }`}
                    />
                    <span className="font-bold text-slate-700">
                      Score:{" "}
                      <span
                        className={
                          mock.isCompleted ? "text-[#059669] font-bold" : "text-slate-700 font-bold"
                        }
                      >
                        {mock.score}%
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Taken on: {mock.dateTaken}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  {mock.isCompleted ? (
                    <>
                      <Link
                        href={`/practice/mock-exam?mockId=${mock.id}&mode=retake`}
                        className="w-full py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white text-xs sm:text-[13px] font-bold text-center transition-all shadow-xs cursor-pointer"
                      >
                        Retake
                      </Link>
                      <Link
                        href={`/practice/result?mockId=${mock.id}`}
                        className="w-full text-center text-xs sm:text-[13px] font-semibold text-[#1D82EB] hover:text-[#1875d2] transition-colors cursor-pointer pt-1"
                      >
                        View Result
                      </Link>
                    </>
                  ) : (
                    <Link
                      href={`/practice/mock-exam?mockId=${mock.id}&mode=start`}
                      className="w-full py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white text-xs sm:text-[13px] font-bold text-center transition-all shadow-xs cursor-pointer"
                    >
                      Start Mock
                    </Link>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* 4. Bottom Info Banner */}
      <div className="bg-[#eaf4fe] border border-[#c6e1fc] rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-slate-700">
        <div className="w-5 h-5 rounded-full bg-[#1875d2] text-white flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-3.5 h-3.5" />
        </div>
        <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 font-medium">
          These are timed, full-length MSRA-style mock exams designed to closely
          replicate the real exam sequence. Each mock starts with Professional
          Dilemmas (50 questions in 45 minutes), followed by Clinical Problem
          Solving (86 questions in 75 minutes). The sequence is fixed to mirror
          the actual MSRA format and includes a short break between sections.
        </p>
      </div>
    </div>
  );
}

