"use client";

import Link from "next/link";
import { Clock, HelpCircle, ChevronRight } from "lucide-react";

interface MockCard {
  id: number;
  title: string;
  difficultyBadge: string;
  difficultyType: "moderate" | "advanced" | "clinical" | "standard";
  duration: string;
  questions: number;
  bestScore?: string;
  notAttempted?: boolean;
}

const mockCards: MockCard[] = [
  {
    id: 1,
    title: "Cardiology & Respiratory Focus",
    difficultyBadge: "MODERATE",
    difficultyType: "moderate",
    duration: "45 mins",
    questions: 50,
    bestScore: "72%",
  },
  {
    id: 2,
    title: "Neurology & Renal Deep Dive",
    difficultyBadge: "ADVANCED",
    difficultyType: "advanced",
    duration: "45 mins",
    questions: 50,
    bestScore: "58%",
  },
  {
    id: 3,
    title: "SJT Professionalism Module",
    difficultyBadge: "CLINICAL",
    difficultyType: "clinical",
    duration: "30 mins",
    questions: 40,
    bestScore: "84%",
  },
  {
    id: 4,
    title: "Mixed Clinical Review",
    difficultyBadge: "STANDARD",
    difficultyType: "standard",
    duration: "60 mins",
    questions: 70,
    notAttempted: true,
  },
];

interface HistoryRow {
  id: number;
  date: string;
  examType: string;
  score: string;
  scoreColor: "green" | "amber" | "rose";
  timeTaken: string;
}

const examHistory: HistoryRow[] = [
  {
    id: 1,
    date: "Oct 24, 2023",
    examType: "Full Mock Exam #2",
    score: "76%",
    scoreColor: "green",
    timeTaken: "2h 55m",
  },
  {
    id: 2,
    date: "Oct 18, 2023",
    examType: "SJT Deep Dive",
    score: "82%",
    scoreColor: "green",
    timeTaken: "28m 10s",
  },
  {
    id: 3,
    date: "Oct 12, 2023",
    examType: "Gold Standard Mock",
    score: "68%",
    scoreColor: "amber",
    timeTaken: "3h 05m",
  },
  {
    id: 4,
    date: "Oct 05, 2023",
    examType: "Neurology Module",
    score: "52%",
    scoreColor: "rose",
    timeTaken: "44m 30s",
  },
];

export default function MockExamsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Exam Center
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          Refine your exam technique with full-length simulations and targeted practice modules.
        </p>
      </div>

      {/* Top 2x2 Grid of Practice Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header: Title & Difficulty Badge */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {card.title}
                </h3>
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-sm tracking-wider ${
                    card.difficultyType === "advanced"
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
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>{card.questions} Questions</span>
                </div>
              </div>
            </div>

            {/* Bottom Row: Score & Start Practice Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                {card.notAttempted ? (
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
                href={`/practice?topic=${encodeURIComponent(card.title)}`}
                className="px-4 py-1.5 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-700 hover:text-orange-600 text-xs font-bold transition-all cursor-pointer"
              >
                Start Practice
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Table: Exam History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">DATE</th>
                <th className="py-3.5 px-6">EXAM TYPE</th>
                <th className="py-3.5 px-6">SCORE</th>
                <th className="py-3.5 px-6">TIME TAKEN</th>
                <th className="py-3.5 px-6">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {examHistory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-600">
                    {row.date}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {row.examType}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-md ${
                        row.scoreColor === "green"
                          ? "bg-[#c6f6d5] text-[#10b981]"
                          : row.scoreColor === "amber"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
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
                      href={`/practice?topic=${encodeURIComponent(row.examType)}`}
                      className="text-[#f96302] hover:text-[#ea5b00] font-bold text-xs hover:underline cursor-pointer"
                    >
                      Review Answers
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
