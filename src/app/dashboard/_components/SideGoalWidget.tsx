"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { overviewApi, DailyGoalData } from "@/services/overviewApi";

const defaultGoalConfig: DailyGoalData = {
  goalTarget: 50,
  weakestTopics: [],
};

export function SideGoalWidget() {
  const [goalConfig, setGoalConfig] = useState<DailyGoalData>(defaultGoalConfig);
  const [loading, setLoading] = useState(true);
  const [questionsToday, setQuestionsToday] = useState(0);

  useEffect(() => {
    async function fetchGoalData() {
      try {
        setLoading(true);
        const [contentRes, statsRes] = await Promise.allSettled([
          overviewApi.getOverviewContent(),
          overviewApi.getUserStats(),
        ]);

        let dynamicWeakest: Array<{ name: string; score: string }> = [];

        // 1. Scan localStorage for clinical topic test attempts (<50% accuracy score)
        if (typeof window !== "undefined") {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("topic_last_attempt_")) {
              try {
                const rawName = key.replace("topic_last_attempt_", "").replace(/-/g, " ");
                const saved = JSON.parse(localStorage.getItem(key) || "{}");
                const formattedName = saved.title || (rawName.charAt(0).toUpperCase() + rawName.slice(1));

                if (typeof saved.accuracyPct === "number" && saved.accuracyPct < 50) {
                  if (!dynamicWeakest.some((t) => t.name.toLowerCase() === formattedName.toLowerCase())) {
                    dynamicWeakest.push({
                      name: formattedName,
                      score: `${saved.accuracyPct}%`,
                    });
                  }
                }
              } catch (e) {
                console.error("Error reading topic attempt from localStorage:", e);
              }
            }
          }
        }

        // 2. Add backend weakest categories (<50% accuracy score)
        if (statsRes.status === "fulfilled" && statsRes.value?.data?.weakestTopicsList) {
          const backendWeak = statsRes.value.data.weakestTopicsList;
          backendWeak.forEach((item: any) => {
            if (
              item.accuracyPct < 50 &&
              !dynamicWeakest.some((t) => t.name.toLowerCase() === item.category.toLowerCase())
            ) {
              dynamicWeakest.push({
                name: item.category,
                score: `${item.accuracyPct}%`,
              });
            }
          });
        }

        // 3. Fallback to admin configured weakest topics if set
        if (dynamicWeakest.length === 0 && contentRes.status === "fulfilled" && contentRes.value?.data?.daily_goal?.content) {
          const goalData = contentRes.value.data.daily_goal.content;
          if (Array.isArray(goalData.weakestTopics) && goalData.weakestTopics.length > 0) {
            dynamicWeakest = goalData.weakestTopics;
          }
        }

        let targetVal = 50;
        if (contentRes.status === "fulfilled" && contentRes.value?.data?.daily_goal?.content?.goalTarget) {
          targetVal = contentRes.value.data.daily_goal.content.goalTarget;
        }

        setGoalConfig({
          goalTarget: targetVal,
          weakestTopics: dynamicWeakest,
        });

        if (typeof window !== "undefined") {
          const todayStr = new Date().toISOString().split("T")[0];
          const lastDate = localStorage.getItem("last_goal_date");
          if (lastDate !== todayStr) {
            // New day: reset today's tracked questions to 0
            localStorage.setItem("last_goal_date", todayStr);
            localStorage.setItem(`daily_questions_count_${todayStr}`, "0");
            setQuestionsToday(0);
          } else {
            const count = parseInt(localStorage.getItem(`daily_questions_count_${todayStr}`) || "0", 10);
            setQuestionsToday(count);
          }
        } else if (statsRes.status === "fulfilled" && statsRes.value?.data) {
          const stats = statsRes.value.data;
          const attempted = parseInt(stats.questionsAttempted?.value || "0", 10);
          setQuestionsToday(attempted);
        }
      } catch (err) {
        console.error("Failed to load goal data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGoalData();
  }, []);

  const progressPct =
    goalConfig.goalTarget > 0
      ? Math.min(100, Math.round((questionsToday / goalConfig.goalTarget) * 100))
      : 0;

  return (
    <div className="space-y-6">
      {/* Widget 1: Current Goal Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block text-center flex-1">
            CURRENT GOAL PROGRESS
          </span>
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-600" />}
        </div>

        <div className="text-center space-y-1">
          <div className="text-4xl font-black text-[#f96302] tracking-tight">
            {questionsToday}
            <span className="text-xl text-[#f96302]/60 font-extrabold">/{goalConfig.goalTarget}</span>
          </div>
          <p className="text-xs font-semibold text-slate-400">Questions for today</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
          <div
            className="bg-[#f96302] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Widget 2: Weakest Topics */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#1e293b] tracking-tight">
            Weakest Topics
          </h4>
        </div>

        {goalConfig.weakestTopics.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {goalConfig.weakestTopics.map((topic, idx) => (
              <Link
                key={idx}
                href={`/practice?topic=${encodeURIComponent(topic.name)}`}
                className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-lg transition-colors group cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-[#f96302] transition-colors">
                  {topic.name}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#fecdd3] text-[#9f1239] text-[11px] font-extrabold group-hover:bg-[#fca5a5] transition-colors">
                  {topic.score}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center space-y-1">
            <AlertCircle className="w-5 h-5 text-slate-300 mx-auto" />
            <p className="text-xs font-medium text-slate-500">
              No weak topics identified yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
