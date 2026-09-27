"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Lock,
  Zap,
  ChevronRight,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { questionBankApi, QuestionBankItemData } from "@/services/questionBankApi";
import { mockExamApi } from "@/services/mockExamApi";
import {
  getSpecialtyStats,
  getPDStats,
  formatAverageTime,
  getCurrentUserId,
  CPSSpecialtyStats,
  CPS_SPECIALTIES_CONFIG,
} from "@/lib/practiceSession";

interface SpecialtyConfig {
  id: string;
  title: string;
  specialtyKey: string;
  image: string;
  isUnlocked: boolean;
  practiceUrl?: string;
  defaultTotalQ: number;
  sbaCount?: number;
  emqCount?: number;
}

interface DomainConfig {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  isUnlocked: boolean;
  practiceUrl?: string;
  defaultTotalQ: number;
}

interface MockCardData {
  id: string;
  title: string;
  duration?: string;
  questions?: number;
}

// 3 Clinical specialties that contain free sample questions in the database (matching the free sample zip)
const FREE_SAMPLE_CPS_SPECIALTY_IDS = [
  "cardiovascular",
  "gastroenterology",
  "neurology",
];

// Free sample specific counts (from the free sample zip stored in DB)
const FREE_SAMPLE_CPS_COUNTS: Record<string, { totalQ: number; sbaCount: number; emqCount: number }> = {
  cardiovascular: { totalQ: 10, sbaCount: 6, emqCount: 4 },
  gastroenterology: { totalQ: 10, sbaCount: 5, emqCount: 5 },
  neurology: { totalQ: 10, sbaCount: 4, emqCount: 6 },
};

// All 18 standard MSRA Clinical specialties with Free Sample cards positioned FIRST
const CPS_SPECIALTIES_BASE: SpecialtyConfig[] = (() => {
  const allConfigs = CPS_SPECIALTIES_CONFIG.map((item) => {
    const isFree = FREE_SAMPLE_CPS_SPECIALTY_IDS.includes(item.id);
    const freeCounts = FREE_SAMPLE_CPS_COUNTS[item.id];
    return {
      id: item.id,
      title: item.title,
      specialtyKey: item.title,
      image: `/images/specialties/${item.id}.png`,
      isUnlocked: isFree,
      practiceUrl: isFree
        ? `/practice/clinical?speciality=${encodeURIComponent(item.title)}&type=Both&free=true`
        : undefined,
      defaultTotalQ: isFree && freeCounts ? freeCounts.totalQ : item.totalQ,
      sbaCount: isFree && freeCounts ? freeCounts.sbaCount : item.sbaCount,
      emqCount: isFree && freeCounts ? freeCounts.emqCount : item.emqCount,
    };
  });

  const freeItems = allConfigs.filter((c) => c.isUnlocked);
  const lockedItems = allConfigs.filter((c) => !c.isUnlocked);
  return [...freeItems, ...lockedItems];
})();

// Helper to strictly match a specialty against free sample banks from DB
function findMatchingFreeBank(
  item: { id: string; title: string },
  freeBanks: any[]
): any | null {
  if (!freeBanks || !Array.isArray(freeBanks) || freeBanks.length === 0) return null;
  const cleanId = item.id.toLowerCase().trim();
  const cleanTitle = item.title.toLowerCase().trim();

  for (const bank of freeBanks) {
    const bTitle = (bank.title || "").toLowerCase().trim();
    const bSpec = (bank.specialty || "").toLowerCase().trim();

    // Specific exact mapping for the 3 free clinical specialties in DB
    if (cleanId === "cardiovascular" && (bTitle.includes("cardio") || bSpec.includes("cardio"))) return bank;
    if (cleanId === "gastroenterology" && (bTitle.includes("gastro") || bSpec.includes("gastro"))) return bank;
    if (cleanId === "neurology" && (bTitle.includes("neuro") || bSpec.includes("neuro"))) return bank;

    // Strict equality check only (do not use substring includes to avoid false matches)
    if (bTitle === cleanTitle || bSpec === cleanTitle) return bank;
  }
  return null;
}

// 3 standard MSRA Professional Dilemmas domains (Professionalism & Integrity is the free sample domain)
const PD_DOMAINS_BASE: DomainConfig[] = [
  {
    id: "professional-integrity",
    title: "Professional Integrity",
    subtitle: "Probity, safety and ethics",
    image: "/images/dilemmas/professional-integrity.jpg",
    isUnlocked: true,
    practiceUrl: "/practice/professional-dilemmas?topic=Professionalism%20%26%20Integrity&free=true",
    defaultTotalQ: 20, // Free sample question count from DB
  },
  {
    id: "coping-with-pressure",
    title: "Coping with Pressure",
    subtitle: "Prioritisation & resilience",
    image: "/images/dilemmas/coping-with-pressure.jpg",
    isUnlocked: false,
    defaultTotalQ: 399,
  },
  {
    id: "empathy-and-sensitivity",
    title: "Empathy and Sensitivity",
    subtitle: "Patient-centred judgement",
    image: "/images/dilemmas/empathy-and-sensitivity.jpg",
    isUnlocked: false,
    defaultTotalQ: 1072,
  },
];

export function FreeSampleDashboard() {
  const user = useSelector((state: RootState) => (state as any).auth?.user);
  const [filter, setFilter] = useState<"all" | "weakest" | "in_progress">("all");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [modalReason, setModalReason] = useState<string>("Unlock Full MSRA Question Bank");

  // Dynamic question counts from DB
  const [dbBankCounts, setDbBankCounts] = useState<Record<string, number>>({});
  // Dynamic free sample banks from DB
  const [freeSampleBanks, setFreeSampleBanks] = useState<any[]>([]);
  // Dynamic user performance stats per specialty
  const [cpsStatsMap, setCpsStatsMap] = useState<Record<string, CPSSpecialtyStats>>({});
  const [pdStatsMap, setPdStatsMap] = useState<Record<string, CPSSpecialtyStats>>({});
  // Dynamic mock exams from DB
  const [mockList, setMockList] = useState<MockCardData[]>([]);

  // 1. Fetch DB question banks to get exact question counts for all sections
  useEffect(() => {
    let isMounted = true;

    async function loadDbBanks() {
      try {
        const [banksRes, mocksRes, freeSampleRes] = await Promise.all([
          questionBankApi.getQuestionBanks(),
          mockExamApi.getMockExams(),
          questionBankApi.getFreeSampleBanks(),
        ]);

        if (!isMounted) return;

        if (freeSampleRes?.data && Array.isArray(freeSampleRes.data)) {
          setFreeSampleBanks(freeSampleRes.data);
        }

        if (banksRes?.data && Array.isArray(banksRes.data)) {
          const countMap: Record<string, number> = {};
          for (const b of banksRes.data) {
            const count = b.questionCount || b.totalQuestions || 0;
            if (b.specialty) countMap[b.specialty.toLowerCase().trim()] = count;
            if (b.title) countMap[b.title.toLowerCase().trim()] = count;
          }
          setDbBankCounts(countMap);
        }

        if (mocksRes?.data && Array.isArray(mocksRes.data) && mocksRes.data.length > 0) {
          setMockList(
            mocksRes.data.map((m: any, idx: number) => ({
              id: m.id || `mock-${idx + 1}`,
              title: m.title || `Mock Exam ${m.examNumber || idx + 1}`,
              duration: m.duration,
              questions: m.questions,
            }))
          );
        } else {
          setMockList(
            Array.from({ length: 10 }, (_, i) => ({
              id: `mock-${i + 1}`,
              title: `Mock Exam ${i + 1}`,
            }))
          );
        }
      } catch (err) {
        console.warn("Could not load dynamic DB banks/mocks:", err);
      }
    }

    loadDbBanks();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Compute dynamic question counts & state for each CPS specialty matching DB
  const resolvedCpsSpecialties = useMemo(() => {
    const mapped = CPS_SPECIALTIES_BASE.map((item) => {
      const freeBank = findMatchingFreeBank(item, freeSampleBanks);
      // ONLY cards that actually have free sample data in DB are active!
      const isFree = Boolean(
        freeSampleBanks.length > 0
          ? freeBank
          : FREE_SAMPLE_CPS_SPECIALTY_IDS.includes(item.id)
      );

      let resolvedTotalQ = item.defaultTotalQ;
      let sbaCount = item.sbaCount ?? 0;
      let emqCount = item.emqCount ?? 0;

      if (isFree && freeBank) {
        if (typeof freeBank.sbaCount === "number") sbaCount = freeBank.sbaCount;
        if (typeof freeBank.emqCount === "number") emqCount = freeBank.emqCount;
        resolvedTotalQ =
          sbaCount + emqCount > 0
            ? sbaCount + emqCount
            : freeBank.totalQuestions || freeBank.questionCount || 10;
      } else if (!isFree && Object.keys(dbBankCounts).length > 0) {
        const specKey = item.specialtyKey.toLowerCase().trim();
        const titleKey = item.title.toLowerCase().trim();
        if (dbBankCounts[specKey] !== undefined) {
          resolvedTotalQ = dbBankCounts[specKey];
        } else if (dbBankCounts[titleKey] !== undefined) {
          resolvedTotalQ = dbBankCounts[titleKey];
        }
      }

      return {
        ...item,
        isUnlocked: isFree,
        totalQ: resolvedTotalQ,
        sbaCount,
        emqCount,
        practiceUrl: isFree
          ? `/practice/clinical?speciality=${encodeURIComponent(item.title)}&type=Both&free=true`
          : undefined,
      };
    });

    // CRITICAL: Cards accessible from free MUST be in the FIRST position of the grid!
    const unlocked = mapped.filter((c) => c.isUnlocked);
    const locked = mapped.filter((c) => !c.isUnlocked);
    return [...unlocked, ...locked];
  }, [freeSampleBanks, dbBankCounts]);

  // 3. Compute dynamic question counts for PD domains matching DB
  const resolvedPdDomains = useMemo(() => {
    const freePdBank = freeSampleBanks.find(
      (b) =>
        (b.category || "").toLowerCase().includes("professional") ||
        (b.specialty || "").toLowerCase().includes("professional") ||
        (b.title || "").toLowerCase().includes("professional")
    );

    const mapped = PD_DOMAINS_BASE.map((domain) => {
      let resolvedCount = domain.defaultTotalQ;
      const isFree = domain.id === "professional-integrity";

      if (isFree && freePdBank) {
        resolvedCount =
          freePdBank.totalQuestions ||
          freePdBank.questionCount ||
          freePdBank.questions?.length ||
          20;
      } else if (Object.keys(dbBankCounts).length > 0) {
        if (domain.id === "coping-with-pressure") {
          resolvedCount = dbBankCounts["coping with pressure"] || domain.defaultTotalQ;
        } else if (domain.id === "empathy-and-sensitivity") {
          resolvedCount =
            dbBankCounts["empathy & sensitivity"] ||
            dbBankCounts["empathy and sensitivity"] ||
            domain.defaultTotalQ;
        }
      }

      return {
        ...domain,
        isUnlocked: isFree,
        totalQ: resolvedCount,
        practiceUrl: isFree
          ? "/practice/professional-dilemmas?topic=Professionalism%20%26%20Integrity&free=true"
          : undefined,
      };
    });

    const unlocked = mapped.filter((d) => d.isUnlocked);
    const locked = mapped.filter((d) => !d.isUnlocked);
    return [...unlocked, ...locked];
  }, [freeSampleBanks, dbBankCounts]);

  // 4. Load real user progress dynamically from practice sessions
  const loadAllStats = useCallback(() => {
    const activeUserId = user?.id || getCurrentUserId();

    // CPS Stats
    const cpsMap: Record<string, CPSSpecialtyStats> = {};
    for (const item of resolvedCpsSpecialties) {
      const byId = getSpecialtyStats(item.id, item.totalQ, activeUserId);
      const byTitle = getSpecialtyStats(item.title, item.totalQ, activeUserId);
      const byKey = item.specialtyKey
        ? getSpecialtyStats(item.specialtyKey, item.totalQ, activeUserId)
        : null;

      let best = byTitle.attempted >= byId.attempted ? byTitle : byId;
      if (byKey && byKey.attempted > best.attempted) {
        best = byKey;
      }

      // CRITICAL: Strictly bound stats to this free card's total questions
      const totalQ = item.totalQ > 0 ? item.totalQ : item.defaultTotalQ || 7;
      const boundedAttempted = Math.min(totalQ, best.attempted);
      const boundedCorrect = Math.min(boundedAttempted, best.correct);
      const accuracy = boundedAttempted > 0 ? Math.round((boundedCorrect / boundedAttempted) * 100) : 0;
      const progressPercent = totalQ > 0 ? Math.min(100, Math.round((boundedAttempted / totalQ) * 100)) : 0;

      cpsMap[item.id] = {
        ...best,
        attempted: boundedAttempted,
        correct: boundedCorrect,
        accuracy,
        progressPercent,
      };
    }
    setCpsStatsMap(cpsMap);

    // PD Stats
    const pdMap: Record<string, CPSSpecialtyStats> = {};
    for (const domain of resolvedPdDomains) {
      const byId = getPDStats(domain.id, domain.totalQ, activeUserId);
      const byTitle = getPDStats(domain.title, domain.totalQ, activeUserId);
      const best = byTitle.attempted >= byId.attempted ? byTitle : byId;

      const totalQ = domain.totalQ > 0 ? domain.totalQ : domain.defaultTotalQ || 20;
      const boundedAttempted = Math.min(totalQ, best.attempted);
      const boundedCorrect = Math.min(boundedAttempted, best.correct);
      const accuracy = boundedAttempted > 0 ? Math.round((boundedCorrect / boundedAttempted) * 100) : 0;
      const progressPercent = totalQ > 0 ? Math.min(100, Math.round((boundedAttempted / totalQ) * 100)) : 0;

      pdMap[domain.id] = {
        ...best,
        attempted: boundedAttempted,
        correct: boundedCorrect,
        accuracy,
        progressPercent,
      };
    }
    setPdStatsMap(pdMap);
  }, [user?.id, resolvedCpsSpecialties, resolvedPdDomains]);

  useEffect(() => {
    loadAllStats();

    window.addEventListener("focus", loadAllStats);
    window.addEventListener("storage", loadAllStats);
    window.addEventListener("practice_session_update", loadAllStats);
    window.addEventListener("pd_session_update", loadAllStats);

    return () => {
      window.removeEventListener("focus", loadAllStats);
      window.removeEventListener("storage", loadAllStats);
      window.removeEventListener("practice_session_update", loadAllStats);
      window.removeEventListener("pd_session_update", loadAllStats);
    };
  }, [loadAllStats]);

  // 5. Dynamic Overall Top Stats calculation (combining all free sample CPS + SJT questions)
  const totalFreeCpsQuestions = useMemo(() => {
    return (
      resolvedCpsSpecialties
        .filter((c) => c.isUnlocked)
        .reduce((acc, curr) => acc + curr.totalQ, 0) || 30
    );
  }, [resolvedCpsSpecialties]);

  const totalFreePdQuestions = useMemo(() => {
    return (
      resolvedPdDomains
        .filter((d) => d.isUnlocked)
        .reduce((acc, curr) => acc + curr.totalQ, 0) || 20
    );
  }, [resolvedPdDomains]);

  const totalFreeSampleQuestions = totalFreeCpsQuestions + totalFreePdQuestions;

  const {
    attempted,
    correct,
    overallAccuracy,
    averageTime,
    currentProgressPercent,
    cpsAttempted,
    pdAttempted,
  } = useMemo(() => {
    let att = 0;
    let corr = 0;
    let timeSec = 0;
    let cpsAtt = 0;
    let pdAtt = 0;

    // CPS attempted & accuracy
    for (const item of resolvedCpsSpecialties) {
      if (!item.isUnlocked) continue;
      const s = cpsStatsMap[item.id];
      if (s) {
        att += s.attempted;
        cpsAtt += s.attempted;
        corr += s.correct;
        timeSec += s.totalTimeSeconds;
      }
    }

    // Professional Dilemmas (PD / SJT) attempted & accuracy
    for (const domain of resolvedPdDomains) {
      if (!domain.isUnlocked) continue;
      const s = pdStatsMap[domain.id];
      if (s) {
        att += s.attempted;
        pdAtt += s.attempted;
        corr += s.correct;
        timeSec += s.totalTimeSeconds;
      }
    }

    const progPercent =
      totalFreeSampleQuestions > 0
        ? Math.min(100, Math.round((att / totalFreeSampleQuestions) * 100))
        : 0;
    const accPercent = att > 0 ? Math.round((corr / att) * 100) : 0;
    const avgSec = att > 0 ? timeSec / att : 0;

    return {
      attempted: att,
      correct: corr,
      overallAccuracy: accPercent,
      averageTime: formatAverageTime(avgSec),
      currentProgressPercent: progPercent,
      cpsAttempted: cpsAtt,
      pdAttempted: pdAtt,
    };
  }, [cpsStatsMap, pdStatsMap, resolvedCpsSpecialties, resolvedPdDomains, totalFreeSampleQuestions]);

  const openUpgradeModal = (reason: string) => {
    setModalReason(reason);
    setUpgradeModalOpen(true);
  };

  // Filter items
  const filteredCps = useMemo(() => {
    return resolvedCpsSpecialties.filter((item) => {
      const st = cpsStatsMap[item.id];
      const isWeakest = st && st.attempted > 0 && st.accuracy < 60;
      const isInProgress = st && st.attempted > 0 && st.progressPercent < 100;
      if (filter === "all") return true;
      if (filter === "weakest") return isWeakest;
      if (filter === "in_progress") return isInProgress;
      return true;
    });
  }, [resolvedCpsSpecialties, cpsStatsMap, filter]);

  return (
    <div className="space-y-7 pb-14 font-sans select-none mx-auto">
      {/* 1. Page Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0e2439] tracking-tight">
            Clinical Problem Solving
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Choose a specialty to start practicing CPS questions.
          </p>
        </div>

        {/* Upgrade for Full Access Button */}
        <Link
          href="/dashboard/subscription"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Upgrade for Full Access</span>
        </Link>
      </div>

      {/* 2. Top Stats Overview (Dynamic Real Stats calculated for current user) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Questions Attempted */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Free Sample Questions</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                CPS + SJT
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {attempted.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-400">
                / {totalFreeSampleQuestions.toLocaleString()}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {cpsAttempted}/{totalFreeCpsQuestions} Clinical &bull; {pdAttempted}/{totalFreePdQuestions} Dilemmas
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1875d2] rounded-full transition-all duration-500"
                style={{ width: `${currentProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Sample Progress</span>
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

          {/* Radial Accuracy Gauge */}
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="23.5" fill="#F1F5F9" />
              <circle
                cx="40"
                cy="40"
                r="33"
                stroke="#EDF2F7"
                strokeWidth="6.5"
                fill="none"
              />
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

      {/* 4. Section 1: Clinical Problem Solving (18 Cards in 4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCps.map((item) => {
          const st = cpsStatsMap[item.id] || {
            attempted: 0,
            correct: 0,
            accuracy: 0,
            totalTimeSeconds: 0,
            averageTime: "0s",
            progressPercent: 0,
          };
          const cardCorrect = item.isUnlocked ? st.correct : 0;
          const cardWrong = item.isUnlocked ? Math.max(0, st.attempted - st.correct) : 0;
          const cardAttempts = item.isUnlocked ? `${st.progressPercent}%` : "00%";
          const cardAcc = item.isUnlocked ? `${st.accuracy}%` : "00%";

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-3 sm:p-3.5 border transition-all duration-300 flex flex-col justify-between group min-w-0 w-full overflow-hidden ${
                item.isUnlocked
                  ? "border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md hover:border-slate-300/80"
                  : "border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
              }`}
            >
              {/* Top Image Box */}
              <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden bg-slate-100 isolate transform-gpu">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className={`object-cover transition-transform duration-500 ease-out will-change-transform ${
                    item.isUnlocked
                      ? "group-hover:scale-105"
                      : "opacity-40 filter grayscale-[25%] contrast-75 brightness-105"
                  }`}
                />
                {!item.isUnlocked && (
                  <div className="absolute inset-0 bg-[#3a4d6b]/10 backdrop-blur-[0.5px] flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#556987] border border-white">
                      <Lock className="w-6 h-6 stroke-[1.8]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content & Metrics */}
              <div className="pt-3 pb-0.5 space-y-3 flex-1 flex flex-col justify-between">
                {/* Title & subtle bottom divider */}
                <div className="border-b border-slate-100 pb-2.5 space-y-1">
                  <h3
                    className="font-bold text-slate-900 text-sm sm:text-[15px] leading-tight min-h-[1.5rem] flex items-center truncate"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  {item.isUnlocked && (
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        {item.sbaCount ? `${item.sbaCount} SBA` : "SBA"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 font-bold">
                        {item.emqCount ? `${item.emqCount} EMQ` : "EMQ"}
                      </span>
                    </div>
                  )}
                </div>

                {/* 5-Column Stats Box (Exact counts matching reference image) */}
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
                  <div
                    className={`rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px] ${
                      item.isUnlocked && cardCorrect > 0 ? "bg-[#cff1e6]" : "bg-[#f1f3f6]"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-semibold leading-tight ${
                        item.isUnlocked && cardCorrect > 0
                          ? "text-[#10b981]"
                          : "text-slate-500 font-medium"
                      }`}
                    >
                      Correct
                    </div>
                    <div
                      className={`w-4/5 h-[1px] my-0.5 ${
                        item.isUnlocked && cardCorrect > 0 ? "bg-[#a7f3d0]" : "bg-slate-200/80"
                      }`}
                    />
                    <div
                      className={`font-bold text-xs sm:text-[13px] ${
                        item.isUnlocked && cardCorrect > 0
                          ? "text-[#10b981]"
                          : item.isUnlocked
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {item.isUnlocked ? cardCorrect : "00"}
                    </div>
                  </div>

                  {/* Wrong */}
                  <div
                    className={`rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px] ${
                      item.isUnlocked && cardWrong > 0 ? "bg-[#fcdada]" : "bg-[#f1f3f6]"
                    }`}
                  >
                    <div
                      className={`text-[10px] font-semibold leading-tight ${
                        item.isUnlocked && cardWrong > 0
                          ? "text-[#ef4444]"
                          : "text-slate-500 font-medium"
                      }`}
                    >
                      Wrong
                    </div>
                    <div
                      className={`w-4/5 h-[1px] my-0.5 ${
                        item.isUnlocked && cardWrong > 0 ? "bg-[#fca5a5]" : "bg-slate-200/80"
                      }`}
                    />
                    <div
                      className={`font-bold text-xs sm:text-[13px] ${
                        item.isUnlocked && cardWrong > 0
                          ? "text-[#ef4444]"
                          : item.isUnlocked
                          ? "text-slate-700"
                          : "text-slate-400"
                      }`}
                    >
                      {item.isUnlocked ? cardWrong : "00"}
                    </div>
                  </div>

                  {/* Attempts */}
                  <div className="bg-[#f1f3f6] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px]">
                    <div className="text-[10px] text-slate-500 font-medium leading-tight">
                      Attempts
                    </div>
                    <div className="w-4/5 h-[1px] my-0.5 bg-slate-200/80" />
                    <div
                      className={`font-bold text-xs sm:text-[13px] ${
                        item.isUnlocked ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {cardAttempts}
                    </div>
                  </div>

                  {/* Acc */}
                  <div className="bg-[#f1f3f6] rounded-lg py-1.5 px-0.5 flex flex-col items-center justify-center min-h-[46px]">
                    <div className="text-[10px] text-slate-500 font-medium leading-tight">
                      Acc
                    </div>
                    <div className="w-4/5 h-[1px] my-0.5 bg-slate-200/80" />
                    <div
                      className={`font-bold text-xs sm:text-[13px] ${
                        item.isUnlocked ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {cardAcc}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-0.5">
                  {item.isUnlocked ? (
                    <Link
                      href={item.practiceUrl || "#"}
                      className="w-full py-2.5 rounded-full bg-[#f97316] hover:bg-[#ea580c] active:scale-[0.99] text-white text-xs sm:text-[13px] font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Start Practicing</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openUpgradeModal(`Unlock ${item.title} and all 18 CPS specialties`)
                      }
                      className="w-full py-2.5 rounded-full bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#556987] hover:text-[#334155] text-xs sm:text-[13px] font-semibold text-center transition-all flex items-center justify-center gap-2 border border-[#E2E8F0] cursor-pointer shadow-2xs"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#556987] stroke-[2]" />
                      <span>Locked</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Section 2: Professional Dilemmas (Exact dynamic domain counts from DB) */}
      <div className="pt-6 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e2439] tracking-tight">
            Professional Dilemmas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Practice professional dilemmas by domain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
          {resolvedPdDomains.map((domain) => {
            const pdSt = pdStatsMap[domain.id];
            const hasAttempt = pdSt && pdSt.attempted > 0;

            return (
              <div
                key={domain.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between group space-y-4 ${
                  domain.isUnlocked
                    ? "border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-300"
                    : "border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]"
                }`}
              >
                {/* Image Container with rounded corners */}
                <div className="relative w-full h-44 sm:h-48 md:h-52 rounded-xl overflow-hidden bg-slate-100 isolate">
                  <Image
                    src={domain.image}
                    alt={domain.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-500 ease-out ${
                      domain.isUnlocked
                        ? "group-hover:scale-105"
                        : "opacity-40 filter grayscale-[25%] contrast-75 brightness-105"
                    }`}
                  />
                  {!domain.isUnlocked && (
                    <div className="absolute inset-0 bg-[#3a4d6b]/10 backdrop-blur-[0.5px] flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#556987] border border-white">
                        <Lock className="w-6 h-6 stroke-[1.8]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Domain Info */}
                <div className="space-y-1.5 px-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#141B25] tracking-tight leading-snug">
                      {domain.title}
                    </h3>
                    <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      {domain.totalQ.toLocaleString()} Qs
                    </span>
                  </div>
                  <p className="text-xs sm:text-[13px] text-[#64748B] font-normal">
                    {domain.subtitle}
                  </p>
                  {domain.isUnlocked && (
                    <div className="pt-1 flex items-center gap-2 text-[10px] font-bold">
                      <span
                        className={`px-2 py-0.5 rounded-md ${
                          hasAttempt
                            ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                            : "bg-slate-50 text-slate-500 border border-slate-200/60"
                        }`}
                      >
                        {hasAttempt ? `${pdSt.accuracy}% Acc` : "Unattempted"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="pt-1">
                  {domain.isUnlocked ? (
                    <Link
                      href={domain.practiceUrl || "#"}
                      className="w-full h-11 py-2.5 px-4 rounded-full bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] text-white text-xs sm:text-[13.5px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer select-none"
                    >
                      <span>Start Practicing</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openUpgradeModal(`Unlock ${domain.title} and all SJT domains`)}
                      className="w-full h-11 py-2.5 px-4 rounded-full bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#556987] hover:text-[#334155] text-xs sm:text-[13.5px] font-semibold flex items-center justify-center gap-2 border border-[#E2E8F0] transition-all cursor-pointer select-none shadow-2xs"
                    >
                      <Lock className="w-4 h-4 text-[#556987] stroke-[2]" />
                      <span>Locked</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Section 3: Mock Exams (Exact dynamic mocks from DB) */}
      <div className="pt-6 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0e2439] tracking-tight">
            Mock Exams
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Practice full-length timed mocks in the real MSRA sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
          {mockList.map((mock) => (
            <div
              key={mock.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all flex flex-col justify-between space-y-4"
            >
              {/* Header: Title + Locked Badge */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-[#141B25] text-base sm:text-[17px]">
                  {mock.title}
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F1F3F6] text-[#64748B] border border-[#E0E4EA] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Locked</span>
                </span>
              </div>

              {/* Center Lock Icon + Upgrade Prompt */}
              <div className="py-5 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#556987] shadow-xs">
                  <Lock className="w-6 h-6 stroke-[1.8]" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-3 max-w-[190px] leading-relaxed">
                  Requires Plan Upgrade to Unlock Mock Exam
                </p>
              </div>

              {/* Locked Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => openUpgradeModal(`Unlock ${mock.title} and all 10 Full-Length Mocks`)}
                  className="w-full py-2.5 rounded-full bg-[#EDF2F7] hover:bg-[#E2E8F0] text-[#556987] hover:text-[#334155] text-xs sm:text-[13px] font-semibold text-center transition-all shadow-2xs flex items-center justify-center gap-2 border border-[#E2E8F0] cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#556987] stroke-[2]" />
                  <span>Locked</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Upgrade Modal */}
      {upgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setUpgradeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Icon & Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shadow-xs">
                <Zap className="w-6 h-6 fill-orange-500 text-orange-500" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
                  Full Access Required
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Upgrade to Unlock Full Access
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
              You are currently on the <span className="font-semibold text-slate-800">Free Sample</span> tier. Upgrade your account to unlock all 11,007 MSRA questions, 18 Clinical Specialties, all SJT domains, and 10 realistic mock exams.
            </p>

            {/* Benefit Checkmarks */}
            <div className="space-y-2.5 py-3 px-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>All 18 Clinical Problem Solving specialties (8,502 questions)</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>All 3 Professional Dilemmas domains (2,505 scenarios)</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>10 Realistic full-length mock exams with 5-minute timed break</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>One-off payment with no recurring billing or auto-renewal</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/dashboard/subscription"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>View Plans &amp; Upgrade</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setUpgradeModalOpen(false)}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Continue Free Trial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
