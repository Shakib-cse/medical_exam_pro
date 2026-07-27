"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  image: string;
  totalQ: number;
  correct: number;
  wrong: number;
  attemptsPct: number;
  accuracyPct: number;
  category: "all" | "weakest" | "inProgress";
}

const topics: Topic[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "inProgress",
  },
  {
    id: "respiratory",
    title: "Respiratory",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "inProgress",
  },
  {
    id: "gastroenterology",
    title: "Gastroenterology / Nutrition",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "all",
  },
  {
    id: "neurology",
    title: "Neurology / Psychiatry",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "weakest",
  },
  {
    id: "renal",
    title: "Renal / Urology",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "weakest",
  },
  {
    id: "endocrinology",
    title: "Endocrinology / Metabolic",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "all",
  },
  {
    id: "dermatology",
    title: "Dermatology / ENT / Eyes",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "inProgress",
  },
  {
    id: "infectious",
    title: "Infectious disease / Haematology",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "all",
  },
  {
    id: "immunology",
    title: "Immunology / Allergies / Genetics",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "all",
  },
  {
    id: "musculoskeletal",
    title: "Musculoskeletal",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "inProgress",
  },
  {
    id: "paediatrics",
    title: "Paediatrics",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "all",
  },
  {
    id: "pharmacology",
    title: "Pharmacology and therapeutics",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "all",
  },
  {
    id: "reproductive",
    title: "Reproductive",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPct: 20,
    accuracyPct: 80,
    category: "all",
  },
];

export function ClinicalProblemSolving() {
  const [activeFilter, setActiveFilter] = useState<"all" | "weakest" | "inProgress">("all");

  const filteredTopics = topics.filter((t) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "weakest") return t.category === "weakest";
    if (activeFilter === "inProgress") return t.category === "inProgress";
    return true;
  });

  return (
    <div className="bg-[#e2e7ec] rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-300/60 space-y-6 w-full max-w-full overflow-hidden">
      {/* Section Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl sm:text-2xl font-bold text-[#1c2833] tracking-tight">
          Clinical Problem Solving
        </h3>

        {/* Filter Capsule */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200/60 shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 sm:px-4 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#1c2833] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 bg-transparent font-semibold"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("weakest")}
            className={`px-3 sm:px-4 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeFilter === "weakest"
                ? "bg-[#1c2833] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 bg-transparent font-semibold"
            }`}
          >
            Weakest
          </button>
          <button
            onClick={() => setActiveFilter("inProgress")}
            className={`px-3 sm:px-4 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              activeFilter === "inProgress"
                ? "bg-[#1c2833] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 bg-transparent font-semibold"
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Grid of Topic Cards with Responsive Breakpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group min-w-0 w-full overflow-hidden"
          >
            <div className="space-y-3 min-w-0">
              {/* Image Container with inner padding */}
              <div className="relative w-full h-40 sm:h-44 bg-slate-100 rounded-xl overflow-hidden">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              {/* Title */}
              <div className="pt-1 pb-2 border-b border-slate-100 min-h-[46px] flex items-center">
                <h4 className="font-bold text-[#1c2833] text-sm sm:text-base leading-snug truncate">
                  {topic.title}
                </h4>
              </div>

              {/* Responsive Metrics Table with Safety Constraints */}
              <div className="grid grid-cols-5 gap-0.5 sm:gap-1 text-center items-center py-2 w-full overflow-hidden">
                <div className="min-w-0 px-0.5">
                  <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                    Total Q.
                  </span>
                  <span className="font-black text-[#1c2833] text-xs sm:text-sm md:text-base block truncate">
                    {topic.totalQ}
                  </span>
                </div>
                <div className="min-w-0 px-0.5">
                  <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                    Correct
                  </span>
                  <span className="inline-flex items-center justify-center w-full py-1 rounded-md bg-[#c6f6d5] text-[#10b981] font-black text-xs sm:text-sm md:text-base truncate">
                    {topic.correct}
                  </span>
                </div>
                <div className="min-w-0 px-0.5">
                  <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                    Wrong
                  </span>
                  <span className="inline-flex items-center justify-center w-full py-1 rounded-md bg-[#fecdd3] text-[#f43f5e] font-black text-xs sm:text-sm md:text-base truncate">
                    {topic.wrong}
                  </span>
                </div>
                <div className="min-w-0 px-0.5">
                  <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                    Attempts
                  </span>
                  <span className="font-black text-[#1c2833] text-xs sm:text-sm md:text-base block truncate">
                    {topic.attemptsPct}%
                  </span>
                </div>
                <div className="min-w-0 px-0.5">
                  <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                    Acc
                  </span>
                  <span className="font-black text-[#1c2833] text-xs sm:text-sm md:text-base block truncate">
                    {topic.accuracyPct}%
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-3">
              <Link
                href={`/practice?topic=${encodeURIComponent(topic.title)}`}
                className="w-full py-2.5 sm:py-3 px-4 rounded-full bg-[#f96302] hover:bg-[#ea5b00] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span>Start Practicing</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
