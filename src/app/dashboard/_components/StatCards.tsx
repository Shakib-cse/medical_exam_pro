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
        {/* Blue Progress Arc */}
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
      {/* Percentage label */}
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
    value: "0 / 1,200",
    subtext: "0% completed",
    percentage: 0,
    type: "radial",
  },
  {
    title: "ACCURACY",
    value: "0 / 0",
    subtext: "0% correct",
    percentage: 0,
    type: "radial",
  },
  {
    title: "AVERAGE ANSWERING TIME",
    value: "0 sec",
    subtext: "Per attempted question",
    type: "text",
  },
  {
    title: "WEAKEST AREAS",
    value: "None yet",
    subtext: "0 questions to revisit",
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
        let dbAttempted = 0;
        let dbCorrect = 0;
        let dbTime = 0;
        let dbWeakestAreas = "None yet";
        let dbRevisitCount = 0;

        try {
          const res = await overviewApi.getUserStats();
          if (res?.data) {
            const d = res.data;
            const attemptedVal = parseInt(d.questionsAttempted?.value || "0", 10) || 0;
            const accuracyParts = (d.accuracy?.value || "0 / 0").split("/");
            const correctVal = parseInt(accuracyParts[0] || "0", 10) || 0;
            const timeVal = parseInt(d.avgTime?.value || "0", 10) || 0;

            dbAttempted = attemptedVal;
            dbCorrect = correctVal;
            dbTime = timeVal * attemptedVal;
            if (d.weakestAreas?.value) {
              dbWeakestAreas = d.weakestAreas.value;
            }
          }
        } catch (_) {}

        // Scan local topic practice attempts from localStorage
        let localAttempted = 0;
        let localCorrect = 0;
        let localWrong = 0;
        const localWeakTopics: Array<{ name: string; acc: number; revisit: number }> = [];

        if (typeof window !== "undefined") {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("topic_last_attempt_")) {
              try {
                const itemStr = localStorage.getItem(key);
                if (itemStr) {
                  const saved = JSON.parse(itemStr);
                  const total = saved.totalQ || ((saved.correct || 0) + (saved.wrong || 0)) || 0;
                  const corr = saved.correct || 0;
                  const wrng = saved.wrong || 0;

                  if (total > 0) {
                    localAttempted += total;
                    localCorrect += corr;
                    localWrong += wrng;

                    const rawName = key.replace("topic_last_attempt_", "");
                    const topicTitle = saved.title || rawName;
                    const acc = saved.accuracyPct ?? (total > 0 ? Math.round((corr / total) * 100) : 0);
                    
                    if (acc < 60) {
                      localWeakTopics.push({
                        name: topicTitle,
                        acc,
                        revisit: wrng || (total - corr),
                      });
                    }
                  }
                }
              } catch (_) {}
            }
          }
        }

        const totalAttempted = dbAttempted + localAttempted;
        const totalCorrect = dbCorrect + localCorrect;
        const accuracyPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
        const completedPct = totalAttempted > 0 ? Math.min(100, Math.round((totalAttempted / 1200) * 100)) : 0;
        const avgTimeSec = totalAttempted > 0 ? Math.round(dbTime / totalAttempted) || 45 : 0;

        let finalWeakestText = "None yet";
        let finalWeakestSubtext = "0 questions to revisit";

        if (localWeakTopics.length > 0) {
          finalWeakestText = localWeakTopics.map((t) => t.name).slice(0, 2).join(", ");
          const totalRevisit = localWeakTopics.reduce((acc, t) => acc + t.revisit, 0);
          finalWeakestSubtext = `${totalRevisit} questions to revisit`;
        } else if (dbWeakestAreas !== "None yet") {
          finalWeakestText = dbWeakestAreas;
        }

        setStats([
          {
            title: "QUESTIONS ATTEMPTED",
            value: totalAttempted > 0 ? `${totalAttempted.toLocaleString()} / 1,200` : "0 / 1,200",
            subtext: totalAttempted > 0 ? `${completedPct}% completed` : "No attempts yet",
            percentage: completedPct,
            type: "radial",
          },
          {
            title: "ACCURACY",
            value: `${totalCorrect.toLocaleString()} / ${totalAttempted.toLocaleString()}`,
            subtext: `${accuracyPct}% correct`,
            percentage: accuracyPct,
            type: "radial",
          },
          {
            title: "AVERAGE ANSWERING TIME",
            value: `${avgTimeSec} sec`,
            subtext: "Per attempted question",
            type: "text",
          },
          {
            title: "WEAKEST AREAS",
            value: finalWeakestText,
            subtext: finalWeakestSubtext,
            type: "text",
          },
        ]);
      } catch (err) {
        console.error("Error fetching stats:", err);
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
