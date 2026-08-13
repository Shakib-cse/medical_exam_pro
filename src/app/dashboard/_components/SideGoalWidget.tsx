"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Loader2, AlertCircle } from "lucide-react";
import { overviewApi, DailyGoalData } from "@/services/overviewApi";

const defaultGoalConfig: DailyGoalData = {
  goalTarget: 50,
  weakestTopics: [],
};

export function SideGoalWidget() {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || user?.email;
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

        // 1. Scan localStorage for clinical topic test attempts (<50% accuracy score) for current user
        if (typeof window !== "undefined") {
          // Clear legacy un-scoped items if found
          for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith("topic_last_attempt_")) {
              localStorage.removeItem(key);
            }
          }

          if (userId) {
            const userPrefix = `user_${userId}_`;
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              const isUserTopicKey = key && key.startsWith(`${userPrefix}topic_last_attempt_`);

              if (isUserTopicKey) {
                try {
                  const rawName = key.replace(`${userPrefix}topic_last_attempt_`, "").replace(/-/g, " ");
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

        // Clean any invalid score formats (e.g. non-percentage strings)
        dynamicWeakest = dynamicWeakest.filter(
          (t) => t.name && typeof t.score === "string" && (t.score.endsWith("%") || !isNaN(Number(t.score)))
        );

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
          const userPrefix = userId ? `user_${userId}_` : "";
          const lastDateKey = `${userPrefix}last_goal_date`;
          const dailyCountKey = `${userPrefix}daily_questions_count_${todayStr}`;
          const lastDate = localStorage.getItem(lastDateKey) || (!userPrefix ? localStorage.getItem("last_goal_date") : null);

          if (lastDate !== todayStr) {
            // New day: reset today's tracked questions to 0
            localStorage.setItem(lastDateKey, todayStr);
            localStorage.setItem(dailyCountKey, "0");
            setQuestionsToday(0);
          } else {
            const count = parseInt(
              localStorage.getItem(dailyCountKey) ||
              (!userPrefix ? localStorage.getItem(`daily_questions_count_${todayStr}`) : null) ||
              "0",
              10
            );
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
  }, [userId]);

  const progressPct =
    goalConfig.goalTarget > 0
      ? Math.min(100, Math.round((questionsToday / goalConfig.goalTarget) * 100))
      : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-2xs space-y-4 animate-pulse">
          <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
          <div className="h-9 bg-slate-200 rounded w-1/3 mx-auto" />
          <div className="h-3.5 bg-slate-100 rounded-full w-full" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-2xs space-y-4 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="space-y-3 pt-2">
            <div className="h-8 bg-slate-100 rounded" />
            <div className="h-8 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Widget 1: Current Goal Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block text-center flex-1">
            CURRENT GOAL PROGRESS
          </span>
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
