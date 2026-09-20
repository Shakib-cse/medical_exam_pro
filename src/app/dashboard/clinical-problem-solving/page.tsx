"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";
import { getSpecialtyStats, formatAverageTime, CPSSpecialtyStats } from "@/lib/practiceSession";

interface SpecialityCardData {
  id: string;
  title: string;
  image: string;
  totalQ: number;
}

const specialitiesData: SpecialityCardData[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular Medicine",
    image: "/images/specialties/cardiovascular.png",
    totalQ: 322,
  },
  {
    id: "dermatology",
    title: "Dermatology",
    image: "/images/specialties/dermatology.png",
    totalQ: 268,
  },
  {
    id: "endocrinology",
    title: "Endocrinology & Diabetes",
    image: "/images/specialties/endocrinology.png",
    totalQ: 320,
  },
  {
    id: "ent",
    title: "ENT",
    image: "/images/specialties/ent.png",
    totalQ: 208,
  },
  {
    id: "gastroenterology",
    title: "Gastroenterology & Hepatology",
    image: "/images/specialties/gastroenterology.png",
    totalQ: 399,
  },
  {
    id: "immunology",
    title: "Genetics & Immunology",
    image: "/images/specialties/immunology.png",
    totalQ: 126,
  },
  {
    id: "haematology",
    title: "Haematology & Oncology",
    image: "/images/specialties/haematology.png",
    totalQ: 310,
  },
  {
    id: "infectious",
    title: "Infectious Diseases",
    image: "/images/specialties/infectious.png",
    totalQ: 147,
  },
  {
    id: "neurology",
    title: "Neurology",
    image: "/images/specialties/neurology.png",
    totalQ: 288,
  },
  {
    id: "ophthalmology",
    title: "Ophthalmology",
    image: "/images/specialties/ophthalmology.png",
    totalQ: 183,
  },
  {
    id: "paediatrics",
    title: "Paediatrics",
    image: "/images/specialties/paediatrics.png",
    totalQ: 405,
  },
  {
    id: "pharmacology",
    title: "Pharmacology",
    image: "/images/specialties/pharmacology.png",
    totalQ: 478,
  },
  {
    id: "psychiatry",
    title: "Psychiatry",
    image: "/images/specialties/psychiatry.png",
    totalQ: 221,
  },
  {
    id: "renal",
    title: "Renal Medicine & Urology",
    image: "/images/specialties/renal.png",
    totalQ: 339,
  },
  {
    id: "reproductive",
    title: "Reproductive Medicine",
    image: "/images/specialties/reproductive.png",
    totalQ: 591,
  },
  {
    id: "respiratory",
    title: "Respiratory Medicine",
    image: "/images/specialties/respiratory.png",
    totalQ: 448,
  },
  {
    id: "musculoskeletal",
    title: "Rheumatology & Musculoskeletal Medicine",
    image: "/images/specialties/musculoskeletal.png",
    totalQ: 372,
  },
  {
    id: "surgery",
    title: "Surgery & Orthopaedics",
    image: "/images/specialties/surgery.png",
    totalQ: 83,
  },
];

export default function ClinicalProblemSolvingPage() {
  const [filter, setFilter] = useState<"all" | "weakest" | "in_progress">("all");
  const [statsMap, setStatsMap] = useState<Record<string, CPSSpecialtyStats>>({});

  useEffect(() => {
    function loadAllStats() {
      const map: Record<string, CPSSpecialtyStats> = {};
      for (const item of specialitiesData) {
        const byId = getSpecialtyStats(item.id, item.totalQ);
        const byTitle = getSpecialtyStats(item.title, item.totalQ);
        map[item.id] = byTitle.attempted >= byId.attempted ? byTitle : byId;
      }
      setStatsMap(map);
    }

    loadAllStats();

    window.addEventListener("focus", loadAllStats);
    window.addEventListener("storage", loadAllStats);
    return () => {
      window.removeEventListener("focus", loadAllStats);
      window.removeEventListener("storage", loadAllStats);
    };
  }, []);

  const totalQuestions = specialitiesData.reduce((acc, curr) => acc + curr.totalQ, 0); // 5,508
  let attempted = 0;
  let correct = 0;
  let totalTimeSec = 0;
  for (const s of Object.values(statsMap)) {
    attempted += s.attempted;
    correct += s.correct;
    totalTimeSec += s.totalTimeSeconds;
  }
  const currentProgressPercent = totalQuestions > 0 ? Math.min(100, Math.round((attempted / totalQuestions) * 100)) : 0;
  const overallAccuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const avgSec = attempted > 0 ? totalTimeSec / attempted : 0;
  const averageTime = formatAverageTime(avgSec);

  const filteredList = specialitiesData.filter((item) => {
    const st = statsMap[item.id];
    const isWeakest = st && st.attempted > 0 && st.accuracy < 60;
    const isInProgress = st && st.attempted > 0 && st.progressPercent < 100;

    if (filter === "all") return true;
    if (filter === "weakest") return isWeakest;
    if (filter === "in_progress") return isInProgress;
    return true;
  });

  // Radial chart calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallAccuracy / 100) * circumference;

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Clinical Problem Solving
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Choose a speciality to start practicing CPS questions.
        </p>
      </div>

      {/* 2. Top Stats (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Questions Attempted */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Questions Attempted</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {attempted.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-400">
                / {totalQuestions.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1875d2] rounded-full transition-all duration-500"
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Current Progress</span>
              <span className="text-slate-700 font-bold">{currentProgressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5E718D]">Overall Accuracy</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {overallAccuracy}%
            </div>
          </div>

          {/* Radial Accuracy Gauge with inner gap padding */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
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
                strokeDashoffset={(2 * Math.PI * 33) * (1 - overallAccuracy / 100)}
                strokeLinecap="butt"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">
                {overallAccuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Time / Question */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Average Time/ Question</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {averageTime}
            </div>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 text-[#1875d2]" viewBox="0 0 48 48" fill="none">
              <path
                d="M21 4H27M24 4V8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M37 11L39 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle
                cx="24"
                cy="26"
                r="17"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
              <path
                d="M24 26V18M24 26L31 26"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="26" r="2.5" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === "all"
              ? "bg-[#082138] text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("weakest")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === "weakest"
              ? "bg-[#082138] text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          Weakest
        </button>
        <button
          onClick={() => setFilter("in_progress")}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            filter === "in_progress"
              ? "bg-[#082138] text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
          }`}
        >
          In Progress
        </button>
      </div>

      {/* 4. Speciality Grid (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredList.map((item) => (
          <Link
            key={item.id}
            href={`/dashboard/clinical-problem-solving/${item.id}`}
            className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80 transition-all duration-500 ease-out flex flex-col justify-between group cursor-pointer"
          >
            {/* Top Image with all 4 corners rounded inside card padding */}
            <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden bg-slate-100 isolate transform-gpu">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform"
              />
            </div>

            {/* Content & Metrics */}
            <div className="pt-3 pb-0.5 space-y-3 flex-1 flex flex-col justify-between">
              {/* Title & subtle bottom divider */}
              <div className="border-b border-slate-100 pb-2.5">
                <h3
                  className="font-bold text-slate-900 text-sm sm:text-[15px] leading-tight min-h-[1.5rem] flex items-center truncate"
                  title={item.title}
                >
                  {item.title}
                </h3>
              </div>

              {/* 5-Column Stats Box */}
              <div className="grid grid-cols-5 gap-1 text-center">
                {/* Total Q. */}
                <div className="bg-[#f1f3f6] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px]">
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    Total Q.
                  </div>
                  <div className="w-4/5 h-[1px] my-0.5 bg-slate-200/80" />
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                    {item.totalQ}
                  </div>
                </div>

                {/* Correct */}
                <div className="bg-[#cff1e6] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px]">
                  <div className="text-[10px] text-[#10b981] font-semibold leading-tight">
                    Correct
                  </div>
                  <div className="w-4/5 h-[1px] my-0.5 bg-[#a7f3d0]" />
                  <div className="font-bold text-[#10b981] text-xs sm:text-[13px]">
                    {statsMap[item.id]?.correct || 0}
                  </div>
                </div>

                {/* Wrong */}
                <div className="bg-[#fcdada] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px]">
                  <div className="text-[10px] text-[#ef4444] font-semibold leading-tight">
                    Wrong
                  </div>
                  <div className="w-4/5 h-[1px] my-0.5 bg-[#fca5a5]" />
                  <div className="font-bold text-[#ef4444] text-xs sm:text-[13px]">
                    {Math.max(0, (statsMap[item.id]?.attempted || 0) - (statsMap[item.id]?.correct || 0))}
                  </div>
                </div>

                {/* Attempts */}
                <div className="bg-[#f1f3f6] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px]">
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    Attempts
                  </div>
                  <div className="w-4/5 h-[1px] my-0.5 bg-slate-200/80" />
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                    {statsMap[item.id]?.progressPercent || 0}%
                  </div>
                </div>

                {/* Acc */}
                <div className="bg-[#f1f3f6] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px]">
                  <div className="text-[10px] text-slate-500 font-medium leading-tight">
                    Acc
                  </div>
                  <div className="w-4/5 h-[1px] my-0.5 bg-slate-200/80" />
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px]">
                    {statsMap[item.id]?.accuracy || 0}%
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <div className="w-full py-2.5 rounded-xl bg-[#f97316] group-hover:bg-[#ea580c] active:scale-[0.99] text-white text-xs sm:text-[13px] font-bold text-center transition-all shadow-xs shadow-orange-500/10 flex items-center justify-center gap-1.5">
                  <span>Start Practicing</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
