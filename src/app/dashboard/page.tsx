"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DashboardWelcome } from "./_components/DashboardWelcome";
import { TopStatCards } from "./_components/TopStatCards";
import { OverallPerformance } from "./_components/OverallPerformance";
import { WeakAreasTable, WeakAreaItem } from "./_components/WeakAreasTable";
import { getCurrentUserId } from "@/lib/practiceSession";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [stats, setStats] = useState({
    attempted: 0,
    totalQuestions: 11007,
    overallAccuracy: 0,
    averageTime: "0m 00s",
    cps: { attempted: 0, total: 8502, accuracy: 0 },
    pd: { attempted: 0, total: 2505, accuracy: 0 },
    mocks: { taken: 0, total: 10, avgScore: 0 },
    weakAreas: [] as WeakAreaItem[],
    flaggedCount: 0,
    incorrectCount: 0,
    unattemptedCount: 11007,
    subscriptionDaysLeft: 42,
  });

  useEffect(() => {
    // Load local stats or practice history if available
    try {
      if (typeof window !== "undefined") {
        const activeUserId = user?.id || getCurrentUserId();
        const userPrefix = activeUserId ? `user_${activeUserId}_` : "";
        const savedStats = localStorage.getItem(`${userPrefix}medicalexampro_user_stats`);
        if (savedStats) {
          const parsed = JSON.parse(savedStats);
          setStats((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.warn("Could not load stored user stats:", e);
    }
  }, [user?.id]);

  const handleResetProgress = () => {
    setStats({
      attempted: 0,
      totalQuestions: 11007,
      overallAccuracy: 0,
      averageTime: "0m 00s",
      cps: { attempted: 0, total: 8502, accuracy: 0 },
      pd: { attempted: 0, total: 2505, accuracy: 0 },
      mocks: { taken: 0, total: 10, avgScore: 0 },
      weakAreas: [
        { id: "1", topic: "Arrhythmias", speciality: "Cardiology", accuracy: 0 },
        { id: "2", topic: "Epilepsy", speciality: "Neurology", accuracy: 0 },
        { id: "3", topic: "Interstitial Lung Disease", speciality: "Respiratory", accuracy: 0 },
      ],
      flaggedCount: 0,
      incorrectCount: 0,
      unattemptedCount: 11007,
      subscriptionDaysLeft: 42,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Welcome & Action Header */}
      <DashboardWelcome
        userName={user?.firstName || "Alex"}
        subscriptionDaysLeft={stats.subscriptionDaysLeft}
        onResetProgress={handleResetProgress}
      />

      {/* 2. Top Performance Stats (3 Cards) */}
      <TopStatCards
        attempted={stats.attempted}
        totalQuestions={stats.totalQuestions}
        overallAccuracy={stats.overallAccuracy}
        averageTime={stats.averageTime}
      />

      {/* 3. Overall Performance Section (3 Cards) */}
      <OverallPerformance
        cpsData={stats.cps}
        pdData={stats.pd}
        mockData={stats.mocks}
      />

      {/* 4. Weak Areas Section (Table) */}
      <WeakAreasTable items={stats.weakAreas} />
    </div>
  );
}
