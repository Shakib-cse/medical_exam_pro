"use client";

import { useState } from "react";
import Link from "next/link";
import { Flag, Search, Trash2, ArrowRight, CheckCircle2, ChevronDown, BookOpen } from "lucide-react";

interface FlaggedQuestion {
  id: string;
  prompt: string;
  category: string;
  speciality: string;
  flaggedDate: string;
}

const sampleFlagged: FlaggedQuestion[] = [
  {
    id: "fq-1",
    prompt: "A 45-year-old male presents with acute chest pain and shortness of breath. ECG shows ST elevation in leads V1-V4...",
    category: "Cardiovascular",
    speciality: "Cardiology",
    flaggedDate: "2 days ago",
  },
  {
    id: "fq-2",
    prompt: "Which of the following is the most appropriate initial diagnostic test for a suspected pulmonary embolism in a pregnant patient?",
    category: "Pulmonology",
    speciality: "Respiratory",
    flaggedDate: "3 days ago",
  },
  {
    id: "fq-3",
    prompt: "Which imaging modality is preferred for diagnosing gallstones in symptomatic patients?",
    category: "Gastroenterology",
    speciality: "Gastroenterology / Nutrition",
    flaggedDate: "4 days ago",
  },
  {
    id: "fq-4",
    prompt: "What is the first-line treatment for anaphylaxis in an adult patient?",
    category: "Psychiatry",
    speciality: "Emergency Medicine",
    flaggedDate: "5 days ago",
  },
  {
    id: "fq-5",
    prompt: "What is the recommended initial intervention for treating anaphylaxis in an adult?",
    category: "Dermatology",
    speciality: "Immunology / Allergies",
    flaggedDate: "6 days ago",
  },
];

export default function FlaggedQuestionsPage() {
  const [questions, setQuestions] = useState<FlaggedQuestion[]>(sampleFlagged);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Cardiovascular", "Pulmonology", "Gastroenterology", "Psychiatry", "Dermatology"];

  const filtered = questions.filter((q) => {
    const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
    const matchesSearch =
      q.prompt.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRemove = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Flagged Questions
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Review the questions you&apos;ve marked for later and strengthen the areas that need more practice.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold shrink-0 self-start sm:self-auto">
          <Flag className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{questions.length} Flagged Questions</span>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flagged questions..."
            className="w-full bg-white text-slate-800 placeholder:text-slate-400 text-xs rounded-xl py-2.5 pl-9 pr-4 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-2xs transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#082138] text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Questions List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200/80 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Flagged Questions</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When practicing questions, click the Flag button to bookmark difficult cases for later review.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                  {q.prompt}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                    {q.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {q.speciality} &bull; Flagged {q.flaggedDate}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <Link
                  href={`/practice?questionId=${q.id}&mode=review`}
                  className="px-4 py-2 rounded-xl bg-[#082138] hover:bg-[#103456] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleRemove(q.id)}
                  className="px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
