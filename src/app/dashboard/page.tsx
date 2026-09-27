"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DashboardWelcome } from "./_components/DashboardWelcome";
import { TopStatCards } from "./_components/TopStatCards";
import { OverallPerformance } from "./_components/OverallPerformance";
import { WeakAreasTable, WeakAreaItem } from "./_components/WeakAreasTable";
import { FreeSampleDashboard } from "./_components/FreeSampleDashboard";
import {
  getCurrentUserId,
  CPS_SPECIALTIES_CONFIG,
  PD_DOMAINS_CONFIG,
  TOTAL_CPS_QUESTIONS,
  TOTAL_PD_QUESTIONS,
  TOTAL_OVERALL_QUESTIONS,
  getSpecialtyStats,
  getPDStats,
  formatAverageTime,
} from "@/lib/practiceSession";
import { subscriptionApi } from "@/services/subscriptionApi";
import { usePermissions } from "@/lib/permissions";

export default function DashboardPage() {
  const reduxUser = useSelector((state: RootState) => (state as any).auth?.user);
  const [localUser, setLocalUser] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        setLocalUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const searchParams = useSearchParams();
  const permissions = usePermissions();
  const user = reduxUser || localUser;
  const isSubscribed = permissions.isSubscribed;

  // Dynamic user name for header
  const userName = useMemo(() => {
    if (user?.name && user.name.trim()) return user.name;
    if (user?.firstName && user.firstName.trim()) return user.firstName;
    if (user?.email) {
      const handle = user.email.split("@")[0];
      return handle.charAt(0).toUpperCase() + handle.slice(1);
    }
    return "Doctor";
  }, [user]);

  // Real subscription days remaining
  const [subscriptionDaysLeft, setSubscriptionDaysLeft] = useState<number>(() => {
    if (user?.currentPeriodEnd) {
      const diff = new Date(user.currentPeriodEnd).getTime() - Date.now();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return 30;
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchSub() {
      try {
        const res = await subscriptionApi.getCurrentSubscription();
        if (isMounted && res?.data) {
          if (typeof res.data.daysRemaining === "number") {
            setSubscriptionDaysLeft(res.data.daysRemaining);
          }
        }
      } catch (err) {
        console.warn("Could not fetch current subscription info:", err);
      }
    }
    fetchSub();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // Dynamic real performance statistics calculated across all 18 CPS specialties and 3 PD domains
  const calculateRealStats = useCallback(() => {
    const activeUserId = user?.id || getCurrentUserId();
    const userPrefix = activeUserId ? `user_${activeUserId}_` : "";

    // 1. CPS calculation across all 18 specialties
    let cpsAttempted = 0;
    let cpsCorrect = 0;
    let cpsTimeSeconds = 0;
    const weakList: Array<{
      id: string;
      topic: string;
      speciality: string;
      accuracy: number;
      attempted: number;
    }> = [];

    for (const spec of CPS_SPECIALTIES_CONFIG) {
      const byId = getSpecialtyStats(spec.id, spec.totalQ, activeUserId);
      const byTitle = getSpecialtyStats(spec.title, spec.totalQ, activeUserId);
      const st = byTitle.attempted >= byId.attempted ? byTitle : byId;

      cpsAttempted += st.attempted;
      cpsCorrect += st.correct;
      cpsTimeSeconds += st.totalTimeSeconds;

      if (st.attempted > 0) {
        weakList.push({
          id: spec.id,
          topic: spec.title,
          speciality: spec.title,
          accuracy: st.accuracy,
          attempted: st.attempted,
        });
      }
    }

    // 2. PD calculation across all 3 domains
    let pdAttempted = 0;
    let pdCorrect = 0;
    let pdTimeSeconds = 0;

    for (const domain of PD_DOMAINS_CONFIG) {
      const byId = getPDStats(domain.id, domain.totalQ, activeUserId);
      const byTitle = getPDStats(domain.title, domain.totalQ, activeUserId);
      const st = byTitle.attempted >= byId.attempted ? byTitle : byId;

      pdAttempted += st.attempted;
      pdCorrect += st.correct;
      pdTimeSeconds += st.totalTimeSeconds;

      if (st.attempted > 0) {
        weakList.push({
          id: domain.id,
          topic: domain.title,
          speciality: "Professional Dilemmas",
          accuracy: st.accuracy,
          attempted: st.attempted,
        });
      }
    }

    // 3. Mock Exams calculation (stored in mock_completed_*)
    let mocksTaken = 0;
    let totalMockScore = 0;
    for (let i = 1; i <= 10; i++) {
      const mockKey = `${userPrefix}mock_completed_mock-${i}`;
      const raw = typeof window !== "undefined" ? localStorage.getItem(mockKey) : null;
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          mocksTaken++;
          totalMockScore += typeof parsed.score === "number" ? parsed.score : 0;
        } catch {}
      }
    }
    const mockAvgScore = mocksTaken > 0 ? Math.round(totalMockScore / mocksTaken) : 0;

    // 4. Overall Totals
    const attempted = cpsAttempted + pdAttempted;
    const correct = cpsCorrect + pdCorrect;
    const overallAccuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    const totalTime = cpsTimeSeconds + pdTimeSeconds;
    const averageTime = formatAverageTime(attempted > 0 ? totalTime / attempted : 0);

    const cpsAccuracy = cpsAttempted > 0 ? Math.round((cpsCorrect / cpsAttempted) * 100) : 0;
    const pdAccuracy = pdAttempted > 0 ? Math.round((pdCorrect / pdAttempted) * 100) : 0;

    const pdAverageTime = formatAverageTime(pdAttempted > 0 ? pdTimeSeconds / pdAttempted : 0);

    // 5. Weak Areas: sort by lowest accuracy ascending
    weakList.sort((a, b) => a.accuracy - b.accuracy);
    const topWeakAreas: WeakAreaItem[] =
      weakList.length > 0
        ? weakList.slice(0, 5).map((w, idx) => ({
            id: String(idx + 1),
            topic: w.topic,
            speciality: w.speciality,
            accuracy: w.accuracy,
          }))
        : [
            { id: "1", topic: "Arrhythmias", speciality: "Cardiology", accuracy: 32 },
            { id: "2", topic: "Epilepsy", speciality: "Neurology", accuracy: 26 },
            { id: "3", topic: "Interstitial Lung Disease", speciality: "Respiratory", accuracy: 36 },
          ];

    const pdWeakList = weakList.filter((w) => w.speciality === "Professional Dilemmas");
    const topPdWeakAreas: WeakAreaItem[] =
      pdWeakList.length > 0
        ? pdWeakList.slice(0, 5).map((w, idx) => ({
            id: String(idx + 1),
            topic: w.topic,
            speciality: w.speciality,
            accuracy: w.accuracy,
          }))
        : [
            { id: "1", topic: "Patient Focus & Safety", speciality: "Professional Dilemmas", accuracy: 42 },
            { id: "2", topic: "Working with Colleagues", speciality: "Professional Dilemmas", accuracy: 38 },
            { id: "3", topic: "Integrity & Probity", speciality: "Professional Dilemmas", accuracy: 45 },
          ];

    return {
      attempted,
      totalQuestions: TOTAL_OVERALL_QUESTIONS,
      overallAccuracy,
      averageTime,
      cps: {
        attempted: cpsAttempted,
        total: TOTAL_CPS_QUESTIONS,
        accuracy: cpsAccuracy,
      },
      pd: {
        attempted: pdAttempted,
        total: TOTAL_PD_QUESTIONS,
        accuracy: pdAccuracy,
        averageTime: pdAverageTime,
      },
      mocks: {
        taken: mocksTaken,
        total: 10,
        avgScore: mockAvgScore,
      },
      weakAreas: topWeakAreas,
      pdWeakAreas: topPdWeakAreas,
    };
  }, [user?.id]);

  const [stats, setStats] = useState(calculateRealStats);

  // Sync whenever practice session updates or user changes
  useEffect(() => {
    const handleUpdate = () => {
      setStats(calculateRealStats());
    };

    handleUpdate();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    window.addEventListener("practice_session_update", handleUpdate);
    window.addEventListener("pd_session_update", handleUpdate);
    window.addEventListener("mock_session_update", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      window.removeEventListener("practice_session_update", handleUpdate);
      window.removeEventListener("pd_session_update", handleUpdate);
      window.removeEventListener("mock_session_update", handleUpdate);
    };
  }, [calculateRealStats]);

  // Real Progress Reset
  const handleResetProgress = () => {
    if (typeof window === "undefined") return;
    const activeUserId = user?.id || getCurrentUserId();
    const userPrefix = activeUserId ? `user_${activeUserId}_` : "";

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith(`${userPrefix}cps_`) ||
          key.startsWith(`${userPrefix}pd_`) ||
          key.startsWith(`${userPrefix}mock_`) ||
          key.startsWith(`${userPrefix}topic_last_attempt_`) ||
          key.startsWith(`${userPrefix}medicalexampro_user_stats`) ||
          key.startsWith(`${userPrefix}flagged_`))
      ) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }

    window.dispatchEvent(new CustomEvent("practice_session_update"));
    window.dispatchEvent(new CustomEvent("pd_session_update"));
    window.dispatchEvent(new CustomEvent("mock_session_update"));
    window.dispatchEvent(new CustomEvent("flagged_questions_update"));

    setStats(calculateRealStats());
  };

  const viewParam = searchParams.get("view");
  if (permissions.isFreeOnly || viewParam === "free-sample") {
    return <FreeSampleDashboard />;
  }

  const isPDOnly = permissions.isPDOnly;

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 font-sans select-none mx-auto">
      {/* 1. Welcome & Action Header */}
      <DashboardWelcome
        userName={userName}
        subscriptionDaysLeft={subscriptionDaysLeft}
        onResetProgress={handleResetProgress}
      />

      {/* 2. Top Performance Stats (3 Cards) */}
      <TopStatCards
        attempted={isPDOnly ? stats.pd.attempted : stats.attempted}
        totalQuestions={isPDOnly ? TOTAL_PD_QUESTIONS : stats.totalQuestions}
        overallAccuracy={isPDOnly ? stats.pd.accuracy : stats.overallAccuracy}
        averageTime={isPDOnly ? (stats.pd as any).averageTime : stats.averageTime}
      />

      {/* 3. Overall Performance Section */}
      <OverallPerformance
        cpsData={stats.cps}
        pdData={stats.pd}
        mockData={stats.mocks}
        isPDOnly={isPDOnly}
      />

      {/* 4. Weak Areas Section (Table) */}
      <WeakAreasTable
        items={isPDOnly ? (stats as any).pdWeakAreas : stats.weakAreas}
      />
    </div>
  );
}
