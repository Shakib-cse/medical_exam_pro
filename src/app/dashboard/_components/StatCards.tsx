"use client";

import { useEffect, useState } from "react";
import { overviewApi, StatCardData } from "@/services/overviewApi";

function RadialProgress({ percentage }: { percentage: number }) {
  const strokeWidth = 5.5;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = 28;

  return (
    <div className="relative w-[60px] h-[60px] flex items-center justify-center shrink-0">
      <svg className="w-[60px] h-[60px] rotate-90" viewBox="0 0 56 56">
        {/* Inner Soft Gray Center Disc */}
        <circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2 - 1}
          fill="#edf1f6"
        />
        {/* Light Gray Track Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#dce4ef"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Blue Progress Arc — starts at 6 o'clock, clockwise, flat caps */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2185e8"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
          fill="none"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Percentage label — un-rotated by counter-rotating */}
      <span
        className="absolute text-[11px] font-bold text-[#1e293b] leading-none"
        style={{ letterSpacing: "-0.02em" }}
      >
        {percentage}%
      </span>
    </div>
  );
}

const defaultStats: StatCardData[] = [
  {
    title: "QUESTIONS ATTEMPTED",
    value: "428 / 1,200",
    subtext: "36% completed",
    percentage: 36,
    type: "radial",
  },
  {
    title: "ACCURACY",
    value: "318 / 428",
    subtext: "74% correct",
    percentage: 74,
    type: "radial",
  },
  {
    title: "AVERAGE ANSWERING TIME",
    value: "82 sec",
    subtext: "Per attempted question",
    type: "text",
  },
  {
    title: "WEAKEST AREAS",
    value: "Renal, Ethics",
    subtext: "42 questions to revisit",
    type: "text",
  },
];

export function StatCards() {
  const [stats, setStats] = useState<StatCardData[]>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await overviewApi.getUserStats();
        if (res?.data) {
          const d = res.data;
          setStats([
            d.questionsAttempted || defaultStats[0],
            d.accuracy || defaultStats[1],
            d.avgTime || defaultStats[2],
            d.weakestAreas || defaultStats[3],
          ]);
        }
      } catch (err) {
        // Fallback to default stats if unauthenticated / offline
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl px-5 py-[18px] border border-slate-200/80 shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
        >
          {/* Left: label → value → subtext */}
          <div className="flex flex-col min-w-0 flex-1" style={{ gap: "6px" }}>
            <span
              className="text-[9px] font-bold text-[#8fa3b8] uppercase leading-none"
              style={{ letterSpacing: "0.09em" }}
            >
              {stat.title}
            </span>
            <div
              className="text-[21px] font-bold text-[#0f172a] leading-tight truncate"
              style={{ letterSpacing: "-0.02em" }}
            >
              {stat.value}
            </div>
            <p className="text-[11px] text-[#94a3b8] leading-none font-normal">
              {stat.subtext}
            </p>
          </div>

          {/* Right: radial ring (only for radial-type cards) */}
          {stat.type === "radial" && typeof stat.percentage === "number" && (
            <RadialProgress percentage={stat.percentage} />
          )}
        </div>
      ))}
    </div>
  );
}
