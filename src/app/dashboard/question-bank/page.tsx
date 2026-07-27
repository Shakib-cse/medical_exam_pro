"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Play } from "lucide-react";

interface QuestionBankItem {
  id: number;
  question: string;
  type: "SJT" | "Clinical";
  category: string;
  lastAttempted?: string;
  isUnattempted?: boolean;
  avgAcc: string;
}

const initialQuestions: QuestionBankItem[] = [
  {
    id: 1,
    question:
      "You are a FY2 in A&E. A senior consultant asks you to perform a procedure you are not fully comfortable with. How should you respond?",
    type: "SJT",
    category: "Professionalism",
    isUnattempted: true,
    avgAcc: "N/A",
  },
  {
    id: 2,
    question:
      "A 45-year-old male presents with sudden onset central chest pain radiating to the left jaw. ECG shows ST-segment elevation in leads V2-V4...",
    type: "Clinical",
    category: "Cardiology",
    lastAttempted: "3 days ago",
    avgAcc: "74%",
  },
  {
    id: 3,
    question:
      "A 45-year-old male presents with sudden onset central chest pain radiating to the left jaw. ECG shows ST-segment elevation in leads V2-V4...",
    type: "Clinical",
    category: "Cardiology",
    lastAttempted: "3 days ago",
    avgAcc: "74%",
  },
  {
    id: 4,
    question:
      "A 62-year-old female presents with acute onset shortness of breath and chest tightness. Chest X-ray reveals left-sided pleural effusion...",
    type: "Clinical",
    category: "Pulmonology",
    lastAttempted: "1 week ago",
    avgAcc: "68%",
  },
  {
    id: 5,
    question:
      "A 30-year-old male reports recurrent episodes of epigastric pain and bloating after meals. Endoscopy shows gastritis...",
    type: "Clinical",
    category: "Gastroenterology",
    lastAttempted: "2 weeks ago",
    avgAcc: "81%",
  },
  {
    id: 6,
    question:
      "A 50-year-old female with a history of hypertension presents with severe headache and visual disturbances. CT scan reveals hemorrhagic stroke...",
    type: "Clinical",
    category: "Neurology",
    lastAttempted: "5 days ago",
    avgAcc: "62%",
  },
  {
    id: 7,
    question:
      "A 28-year-old male with a family history of diabetes presents with fatigue and polyuria. Blood tests confirm hyperglycemia...",
    type: "Clinical",
    category: "Endocrinology",
    lastAttempted: "1 week ago",
    avgAcc: "75%",
  },
  {
    id: 8,
    question:
      "A 45-year-old female presents with persistent cough and unexplained weight loss. CT imaging shows a suspicious lung nodule...",
    type: "Clinical",
    category: "Oncology",
    lastAttempted: "3 days ago",
    avgAcc: "70%",
  },
];

export default function QuestionBankPage() {
  const router = useRouter();

  // Single card selection state (default card 1 active)
  const [selectedId, setSelectedId] = useState<number | null>(1);

  const selectedQuestion = initialQuestions.find((q) => q.id === selectedId);

  const handleSelectCard = (id: number) => {
    // Only 1 card selected at a time!
    setSelectedId(id);
  };

  const handleStartSession = () => {
    if (selectedQuestion) {
      router.push(`/practice?topic=${encodeURIComponent(`${selectedQuestion.type}: ${selectedQuestion.category}`)}`);
    } else {
      router.push("/practice");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Question Bank
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          Browse and create custom practice sets from 4,500+ clinical and SJT questions.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keyword, condition or guideline..."
            className="w-full bg-slate-50 border border-slate-200/80 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative">
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              <span>Difficulty: All</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              <span>Type: All</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
              <span>System: All</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Questions (8 cols) + Right Sidebar Panels (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Question Cards List */}
        <div className="lg:col-span-8 space-y-3.5">
          {initialQuestions.map((q) => {
            const isSelected = selectedId === q.id;

            return (
              <div
                key={q.id}
                onClick={() => handleSelectCard(q.id)}
                className={`rounded-xl p-4 sm:p-5 border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-[#fff6f0] border-[#f96302] shadow-sm ring-1 ring-[#f96302]/30"
                    : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="space-y-3.5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold ${
                        q.type === "SJT"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {q.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-600">
                      {q.category}
                    </span>
                    {q.isUnattempted ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                        Unattempted
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">
                        • Last attempted: {q.lastAttempted}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Average Accuracy Metric */}
                <div className="text-right shrink-0">
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    {q.avgAcc}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    AVG ACC.
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            SHOWING 2,410 AVAILABLE QUESTIONS
          </div>
        </div>

        {/* Right Column: Custom Session & Recently Practiced Panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Panel 1: Create Custom Session */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              Create Custom Session
            </h4>

            <div className="space-y-2 border-y border-slate-100 py-3 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Selected Questions</span>
                <span className="font-bold text-slate-900">12</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Est. Completion Time</span>
                <span className="font-bold text-slate-900">18 mins</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleStartSession}
                className="w-full py-3 px-4 rounded-lg bg-[#f96302] hover:bg-[#ea5b00] text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Start Practice Session</span>
              </button>

              <button className="w-full py-2.5 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center">
                Save for Later
              </button>
            </div>
          </div>

          {/* Panel 2: Recently Practiced */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm">
              Recently Practiced
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <h5 className="font-bold text-slate-800 text-xs">
                    SJT: Patient Safety
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    24 questions • 88% Accuracy
                  </p>
                </div>
                <Link
                  href="/practice?topic=SJT:%20Patient%20Safety"
                  className="w-8 h-8 rounded-full bg-[#f96302] text-white flex items-center justify-center shadow-xs hover:scale-105 transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current stroke-none ml-0.5" />
                </Link>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <h5 className="font-bold text-slate-800 text-xs">
                    Neurology: Stroke Management
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    15 questions • 42% Accuracy
                  </p>
                </div>
                <Link
                  href="/practice?topic=Neurology:%20Stroke%20Management"
                  className="w-8 h-8 rounded-full bg-[#f96302] text-white flex items-center justify-center shadow-xs hover:scale-105 transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current stroke-none ml-0.5" />
                </Link>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <h5 className="font-bold text-slate-800 text-xs">
                    Cardiology: ACS
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    40 questions • 76% Accuracy
                  </p>
                </div>
                <Link
                  href="/practice?topic=Cardiology:%20ACS"
                  className="w-8 h-8 rounded-full bg-[#f96302] text-white flex items-center justify-center shadow-xs hover:scale-105 transition-all shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current stroke-none ml-0.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
