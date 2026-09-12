"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight } from "lucide-react";

interface SpecialityCardData {
  id: string;
  title: string;
  image: string;
  totalQ: number;
  correct: number;
  wrong: number;
  attemptsPercent: number;
  accuracyPercent: number;
  status: "all" | "weakest" | "in_progress";
}

const specialitiesData: SpecialityCardData[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular",
    image: "/images/specialties/cardiovascular.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
  {
    id: "respiratory",
    title: "Respiratory",
    image: "/images/specialties/respiratory.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "weakest",
  },
  {
    id: "gastroenterology",
    title: "Gastroenterology / Nutrition",
    image: "/images/specialties/gastroenterology.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
  {
    id: "neurology",
    title: "Neurology / Psychiatry",
    image: "/images/specialties/neurology.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "weakest",
  },
  {
    id: "renal",
    title: "Renal / Urology",
    image: "/images/specialties/renal.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "in_progress",
  },
  {
    id: "endocrinology",
    title: "Endocrinology / Metabolic",
    image: "/images/specialties/endocrinology.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
  {
    id: "dermatology",
    title: "Dermatology / ENT / Eyes",
    image: "/images/specialties/dermatology.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "in_progress",
  },
  {
    id: "infectious",
    title: "Infectious disease / Haematology",
    image: "/images/specialties/infectious.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
  {
    id: "immunology",
    title: "Immunology / Allergies / Genetics",
    image: "/images/specialties/immunology.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
  {
    id: "musculoskeletal",
    title: "Musculoskeletal",
    image: "/images/specialties/musculoskeletal.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "in_progress",
  },
  {
    id: "paediatrics",
    title: "Paediatrics",
    image: "/images/specialties/paediatrics.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
  {
    id: "pharmacology",
    title: "Pharmacology and therapeutics",
    image: "/images/specialties/pharmacology.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
  {
    id: "reproductive",
    title: "Reproductive",
    image: "/images/specialties/reproductive.png",
    totalQ: 500,
    correct: 120,
    wrong: 99,
    attemptsPercent: 20,
    accuracyPercent: 80,
    status: "all",
  },
];

export default function ClinicalProblemSolvingPage() {
  const [filter, setFilter] = useState<"all" | "weakest" | "in_progress">("all");

  const filteredList = specialitiesData.filter((item) => {
    if (filter === "all") return true;
    if (filter === "weakest") return item.status === "weakest";
    if (filter === "in_progress") return item.status === "in_progress";
    return true;
  });

  const attempted = 1820;
  const totalQuestions = 8502;
  const currentProgressPercent = Math.round((attempted / totalQuestions) * 100);
  const overallAccuracy = 72;
  const averageTime = "1m 14s";

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
                <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] leading-tight min-h-[1.5rem] flex items-center">
                  {item.title}
                </h3>
              </div>

              {/* 5-Column Stats Box */}
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {/* Total Q. */}
                <div className="bg-[#f1f5f9]/80 rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[44px]">
                  <div className="text-[9px] text-slate-400 font-medium leading-tight">
                    Total Q.
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px] mt-0.5">
                    {item.totalQ}
                  </div>
                </div>

                {/* Correct */}
                <div className="bg-[#d1fae5] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[44px]">
                  <div className="text-[9px] text-[#059669] font-medium leading-tight">
                    Correct
                  </div>
                  <div className="font-bold text-[#059669] text-xs sm:text-[13px] mt-0.5">
                    {item.correct}
                  </div>
                </div>

                {/* Wrong */}
                <div className="bg-[#fee2e2] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[44px]">
                  <div className="text-[9px] text-[#dc2626] font-medium leading-tight">
                    Wrong
                  </div>
                  <div className="font-bold text-[#dc2626] text-xs sm:text-[13px] mt-0.5">
                    {item.wrong}
                  </div>
                </div>

                {/* Attempts */}
                <div className="bg-[#f1f5f9]/80 rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[44px]">
                  <div className="text-[9px] text-slate-400 font-medium leading-tight">
                    Attempts
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px] mt-0.5">
                    {item.attemptsPercent}%
                  </div>
                </div>

                {/* Acc */}
                <div className="bg-[#f1f5f9]/80 rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[44px]">
                  <div className="text-[9px] text-slate-400 font-medium leading-tight">
                    Acc
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px] mt-0.5">
                    {item.accuracyPercent}%
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <div className="w-full py-2.5 rounded-xl bg-brand-orange group-hover:bg-brand-orange/90 active:scale-[0.99] text-white text-xs sm:text-[13px] font-bold text-center transition-all shadow-xs shadow-brand-orange/20 flex items-center justify-center gap-1.5">
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
