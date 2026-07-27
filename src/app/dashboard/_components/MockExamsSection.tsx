"use client";

import Link from "next/link";
import { Clock, HelpCircle, Play } from "lucide-react";

interface MockExam {
  id: number;
  name: string;
  status: "Completed" | "In progress" | "Not started";
  duration: string;
  questions: number;
  progress: number;
  actionText: "Restart" | "Resume" | "Start";
}

const mockExams: MockExam[] = [
  { id: 1, name: "Mock Exam 1", status: "Completed", duration: "90 min", questions: 100, progress: 100, actionText: "Restart" },
  { id: 2, name: "Mock Exam 2", status: "Completed", duration: "90 min", questions: 100, progress: 100, actionText: "Restart" },
  { id: 3, name: "Mock Exam 3", status: "Completed", duration: "90 min", questions: 100, progress: 100, actionText: "Restart" },
  { id: 4, name: "Mock Exam 4", status: "In progress", duration: "90 min", questions: 100, progress: 50, actionText: "Resume" },
  { id: 5, name: "Mock Exam 5", status: "In progress", duration: "90 min", questions: 100, progress: 33, actionText: "Resume" },
  { id: 6, name: "Mock Exam 6", status: "Not started", duration: "90 min", questions: 100, progress: 33, actionText: "Start" },
  { id: 7, name: "Mock Exam 7", status: "Not started", duration: "90 min", questions: 100, progress: 0, actionText: "Start" },
  { id: 8, name: "Mock Exam 8", status: "Not started", duration: "90 min", questions: 100, progress: 0, actionText: "Start" },
  { id: 9, name: "Mock Exam 9", status: "Not started", duration: "90 min", questions: 100, progress: 0, actionText: "Start" },
  { id: 10, name: "Mock Exam 10", status: "Not started", duration: "90 min", questions: 100, progress: 0, actionText: "Start" },
];

export function MockExamsSection() {
  return (
    <div className="bg-[#e3e8ee] rounded-2xl p-5 sm:p-6 border border-slate-300/70 shadow-xs space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
        Mock Exams
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5"
          >
            {/* Title & Badge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1.5">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{exam.name}</h4>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                    exam.status === "Completed"
                      ? "bg-[#c6f6d5] text-[#22543d]"
                      : exam.status === "In progress"
                      ? "bg-[#feebc8] text-[#7b341e]"
                      : "bg-slate-100 text-slate-500"
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
                  className={`h-full rounded-full transition-all ${
                    exam.progress === 100
                      ? "bg-teal-500"
                      : exam.progress > 0
                      ? "bg-cyan-500"
                      : "bg-slate-200"
                  }`}
                  style={{ width: `${exam.progress}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <Link
              href="/practice"
              className="w-full py-1.5 px-3 rounded-md bg-[#f96302] hover:bg-[#ea5b00] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <span>{exam.actionText}</span>
              <Play className="w-3 h-3 fill-current stroke-none" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
