"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, HelpCircle, Loader2, FileText } from "lucide-react";
import { mockExamApi, MockExamCardData, MockExamHistoryRow } from "@/services/mockExamApi";

export default function MockExamsPage() {
  const [cards, setCards] = useState<MockExamCardData[]>([]);
  const [history, setHistory] = useState<MockExamHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [examsRes, historyRes] = await Promise.allSettled([
          mockExamApi.getMockExams(),
          mockExamApi.getExamHistory(),
        ]);

        if (examsRes.status === "fulfilled" && examsRes.value?.data) {
          setCards(examsRes.value.data);
        }

        if (historyRes.status === "fulfilled" && historyRes.value?.data) {
          setHistory(historyRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load mock exams dynamically:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Deduplicate history by exam card (keep only the latest attempt per exam card)
  const latestHistory = history.reduce<MockExamHistoryRow[]>((acc, row) => {
    const key = row.mockExamId || row.examType;
    const exists = acc.some(
      (item) => (item.mockExamId && item.mockExamId === key) || item.examType === key
    );
    if (!exists) {
      acc.push(row);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Exam Centre
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            Refine your exam technique with full-length simulations and targeted practice modules.
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full border border-cyan-200">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />
            <span>Syncing Exam Data...</span>
          </div>
        )}
      </div>

      {/* Top Grid of Practice Module Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-16" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-slate-100 rounded w-20" />
                  <div className="h-4 bg-slate-100 rounded w-24" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="h-4 bg-slate-100 rounded w-28" />
                <div className="h-8 bg-slate-200 rounded-full w-28" />
              </div>
            </div>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Mock Exams Available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            New mock exams created by administrators in the Admin Dashboard will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header: Title & Difficulty Badge */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {card.title}
                  </h3>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase ${card.difficultyType === "advanced"
                      ? "bg-rose-100 text-rose-700"
                      : card.difficultyType === "clinical"
                        ? "bg-sky-100 text-sky-700"
                        : card.difficultyType === "standard"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {card.difficultyBadge}
                  </span>
                </div>

                {/* Sub-info: Duration & Questions */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{card.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{card.questions} Questions</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Score & Start Practice Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {card.notAttempted || !card.bestScore ? (
                    <span className="text-xs font-semibold text-slate-400">
                      Not Attempted Yet
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      Best Score: <span className="font-extrabold text-slate-900">{card.bestScore}</span>
                    </span>
                  )}
                </div>

                <Link
                  href={`/practice?topic=${encodeURIComponent(card.title)}&examId=${card.id}`}
                  className="px-5 py-2 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white text-xs font-bold transition-all shadow-md shadow-brand-orange/20 cursor-pointer active:scale-95"
                >
                  {card.actionText || "Start Practice"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Table: Exam History (Shows 1 row per exam card with the latest score) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">EXAM TYPE</th>
                <th className="py-4 px-6">SCORE</th>
                <th className="py-4 px-6">TIME TAKEN</th>
                <th className="py-4 px-6">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {latestHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium italic">
                    No attempt history recorded yet. Complete a mock exam to view your scores here.
                  </td>
                </tr>
              ) : (
                latestHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {row.date}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {row.examType}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-black text-xs px-2 py-0.5 rounded-md ${row.scoreColor === "green"
                          ? "bg-[#c6f6d5] text-[#10b981]"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {row.score}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {row.timeTaken}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/practice?topic=${encodeURIComponent(row.examType)}&examId=${row.mockExamId || ""}`}
                        className="text-brand-orange hover:text-brand-orange/80 font-bold text-xs hover:underline cursor-pointer"
                      >
                        Review Answers
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
