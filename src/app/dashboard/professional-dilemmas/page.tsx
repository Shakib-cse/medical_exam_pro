"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { overviewApi, DilemmaCardData } from "@/services/overviewApi";

interface DomainCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  practiceHref: string;
}

const DEFAULT_DOMAINS: DomainCard[] = [
  {
    id: "professional-integrity",
    title: "Professional Integrity",
    subtitle: "Probity, safety and candour",
    image: "/images/dilemmas/professional-integrity.jpg",
    practiceHref: "/dashboard/professional-dilemmas/professional-integrity",
  },
  {
    id: "coping-with-pressure",
    title: "Coping with Pressure",
    subtitle: "Prioritisation under stress",
    image: "/images/dilemmas/coping-with-pressure.jpg",
    practiceHref: "/dashboard/professional-dilemmas/coping-with-pressure",
  },
  {
    id: "empathy-and-sensitivity",
    title: "Empathy and Sensitivity",
    subtitle: "Patient-centred judgement",
    image: "/images/dilemmas/empathy-and-sensitivity.jpg",
    practiceHref: "/dashboard/professional-dilemmas/empathy-and-sensitivity",
  },
];

export default function ProfessionalDilemmasPage() {
  const [domainCards, setDomainCards] = useState<DomainCard[]>(DEFAULT_DOMAINS);
  const [stats, setStats] = useState({
    attempted: 325,
    totalQuestions: 2505,
    overallAccuracy: 72,
    averageTime: "1m 26s",
  });

  // Calculate current progress percentage
  const currentProgressPercent = Math.min(
    100,
    Math.round((stats.attempted / stats.totalQuestions) * 100)
  );

  // Load custom cards or user stats if available
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await overviewApi.getOverviewContent();
        if (
          res?.data?.professional_dilemmas?.content &&
          Array.isArray(res.data.professional_dilemmas.content) &&
          res.data.professional_dilemmas.content.length > 0
        ) {
          const apiCards: DilemmaCardData[] = res.data.professional_dilemmas.content;
          // If valid custom cards are present, merge them with practice links
          if (apiCards.length >= 3) {
            setDomainCards(
              apiCards.map((c, idx) => ({
                id: `domain-${idx}`,
                title: c.title,
                subtitle: c.subtitle,
                image: c.image || DEFAULT_DOMAINS[idx % DEFAULT_DOMAINS.length].image,
                practiceHref: `/dashboard/professional-dilemmas/${c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote overview dilemmas:", err);
      }
    }

    loadContent();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-7 pb-10 w-full">
      {/* 1. Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-[32px] lg:text-[38px] font-bold text-[#141B25] tracking-tight leading-tight">
          Professional Dilemmas
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm lg:text-[16px] font-normal">
          Practice professional dilemmas by domain
        </p>
      </div>

      {/* 2. Top Stats Section (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
        {/* Card 1: Questions Attempted */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[160px] space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Questions Attempted
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#141B25] tracking-tight">
                {stats.attempted.toLocaleString()} / {stats.totalQuestions.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-[#64748B] font-normal">Current Progress</span>
              <span className="text-[#141B25] font-bold">{currentProgressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#F1F3F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2589D0] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between min-h-[160px]">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Overall Accuracy
            </p>
            <div className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141B25] tracking-tight">
              {stats.overallAccuracy}%
            </div>
          </div>

          {/* Radial Accuracy Gauge with inner gap padding */}
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
                strokeDashoffset={(2 * Math.PI * 33) * (1 - stats.overallAccuracy / 100)}
                strokeLinecap="butt"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">
                {stats.overallAccuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Time/ Question */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between min-h-[160px]">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Average Time/ Question
            </p>
            <div className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#141B25] tracking-tight">
              {stats.averageTime}
            </div>
          </div>

          {/* Exact Figma Clock SVG Icon */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#2589D0]"
            >
              <path
                d="M89.5317 74.3518C87.8007 73.0641 85.3538 73.4236 84.0661 75.1543C83.3544 76.1105 82.6029 77.0365 81.8136 77.9297C80.3849 79.5459 80.5366 82.0146 82.1528 83.4436C82.8657 84.0757 83.7858 84.4243 84.7386 84.4232C85.819 84.4232 86.8948 83.9773 87.6667 83.1041C88.6015 82.0463 89.4915 80.9497 90.3343 79.8172C91.622 78.0865 91.2628 75.6393 89.5317 74.3518ZM96.0646 56.0324C93.9579 55.5736 91.8757 56.9105 91.4169 59.0184C91.1635 60.1818 90.8608 61.334 90.5095 62.4717C89.8726 64.533 91.0272 66.7201 93.0884 67.357C93.4726 67.4756 93.8608 67.532 94.2429 67.532C95.9108 67.532 97.4554 66.4551 97.9737 64.7777C98.3907 63.4277 98.75 62.0606 99.0507 60.6801C99.5095 58.5723 98.1726 56.4914 96.0646 56.0324ZM70.7296 86.8621C69.6889 87.4427 68.6241 87.9792 67.5382 88.4701C65.572 89.358 64.698 91.6717 65.5858 93.6379C66.2382 95.0824 67.6599 95.9373 69.1481 95.9373C69.6856 95.9373 70.2319 95.8258 70.7536 95.5902C72.0414 95.0081 73.3041 94.3719 74.5382 93.6832C76.422 92.6316 77.0964 90.252 76.0444 88.3684C74.9931 86.485 72.6134 85.8105 70.7296 86.8621ZM46.0931 18.75V48.382L31.769 62.7059C30.2437 64.2314 30.2437 66.7047 31.769 68.2301C32.1313 68.5934 32.5619 68.8816 33.036 69.0779C33.51 69.2743 34.0182 69.375 34.5313 69.3742C35.0444 69.3749 35.5526 69.2741 36.0267 69.0778C36.5007 68.8814 36.9313 68.5933 37.2937 68.2301L52.7616 52.7621C53.4941 52.0295 53.9056 51.036 53.9056 50V18.75C53.9056 16.5926 52.1567 14.8438 49.9993 14.8438C47.8419 14.8438 46.0931 16.5926 46.0931 18.75Z"
                fill="currentColor"
              />
              <path
                d="M96.0938 8.39844C93.9363 8.39844 92.1875 10.1473 92.1875 12.3047V23.1516C83.0953 8.89219 67.217 0 50 0C36.6445 0 24.0885 5.20098 14.6445 14.6445C5.20098 24.0885 0 36.6445 0 50C0 63.3555 5.20098 75.9115 14.6445 85.3555C24.0885 94.799 36.6445 100 50 100C50.033 100 50.0648 99.9959 50.0977 99.9951C50.1305 99.9959 50.1623 100 50.1953 100C51.6031 100 53.0248 99.9406 54.4213 99.8238C56.5711 99.6437 58.168 97.7551 57.9881 95.6053C57.8078 93.4555 55.9217 91.8578 53.7693 92.0387C52.5889 92.1373 51.3865 92.1875 50.1953 92.1875C50.1623 92.1875 50.1305 92.1916 50.0977 92.1924C50.0648 92.1916 50.033 92.1875 50 92.1875C26.7377 92.1875 7.8125 73.2623 7.8125 50C7.8125 26.7377 26.7377 7.8125 50 7.8125C64.9918 7.8125 78.7807 15.8033 86.3156 28.5156H75.5748C73.4174 28.5156 71.6686 30.2645 71.6686 32.4219C71.6686 34.5793 73.4174 36.3281 75.5748 36.3281H87.5C89.7936 36.3309 92.0431 35.6986 93.9994 34.5014C94.1203 34.4327 94.2374 34.3576 94.3502 34.2764C97.7498 32.0398 100 28.1928 100 23.8281V12.3047C100 10.1473 98.2512 8.39844 96.0938 8.39844Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Domain Cards Section (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
        {domainCards.map((domain) => (
          <div
            key={domain.id}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group space-y-4"
          >
            {/* Image Container with rounded corners */}
            <div className="relative w-full h-48 sm:h-52 md:h-56 rounded-xl overflow-hidden bg-slate-100 isolate">
              <Image
                src={domain.image}
                alt={domain.title}
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Domain Info */}
            <div className="space-y-1 px-1">
              <h3 className="text-base sm:text-lg font-bold text-[#141B25] tracking-tight leading-snug">
                {domain.title}
              </h3>
              <p className="text-xs sm:text-[13.5px] text-[#64748B] font-normal">
                {domain.subtitle}
              </p>
            </div>

            {/* Action CTA Button */}
            <div className="pt-1">
              <Link
                href={domain.practiceHref}
                className="w-full h-11 py-2.5 px-4 rounded-full bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] text-white text-xs sm:text-[13.5px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer select-none"
              >
                <span>Start Practicing</span>
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M0.75 0.75L7 7L0.75 13.25"
                    stroke="white"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
