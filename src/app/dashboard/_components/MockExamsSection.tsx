"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, HelpCircle, Play, FileCheck2 } from "lucide-react";
import { mockExamApi, MockExamCardData } from "@/services/mockExamApi";

export function MockExamsSection() {
  const [exams, setExams] = useState<MockExamCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      try {
        setLoading(true);
        const res = await mockExamApi.getMockExams();
        if (res?.data && Array.isArray(res.data)) {
          setExams(res.data);
        } else {
          setExams([]);
        }
      } catch (err) {
        console.error("Failed to load mock exams section:", err);
        setExams([]);
      } finally {
        setLoading(false);
      }
    }

    loadExams();
  }, []);

  if (!loading && exams.length === 0) {
    return null; // Hide cleanly if no mock exams are created yet
  }

  return (
    <div className="bg-[#e3e8ee] rounded-2xl p-5 sm:p-6 border border-slate-300/70 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Mock Exams
        </h3>
        <Link
          href="/dashboard/mock-exams"
          className="text-xs font-bold text-brand-orange hover:text-brand-orange/80 hover:underline"
        >
          View All ({exams.length})
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {exams.slice(0, 8).map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5"
          >
            {/* Title & Badge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1.5">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate" title={exam.title}>{exam.title}</h4>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0 ${exam.status === "Completed"
                    ? "bg-[#c6f6d5] text-[#10b981]"
                    : exam.status === "In progress"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                    }`}
                >
                  {exam.status}
                </span>
              </div>

              {/* Exam Info */}
              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{exam.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  <span>{exam.questions} Questions</span>
                </div>
              </div>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="space-y-1">
              <div className="flex justify-end text-[9px] font-bold text-slate-400">
                {exam.progress}%
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${exam.progress === 100
                    ? "bg-emerald-500"
                    : exam.progress > 0
                      ? "bg-brand-orange"
                      : "bg-slate-200"
                    }`}
                  style={{ width: `${exam.progress}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <Link
              href={`/practice?topic=${encodeURIComponent(exam.title)}&examId=${exam.id}`}
              className="w-full py-2 px-4 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-orange/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>{exam.actionText || "Start"}</span>
              <Play className="w-3 h-3 fill-current stroke-none ml-0.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
