"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  HelpCircle,
  Clock,
  ArrowLeft,
  Info,
  Loader2,
} from "lucide-react";
import { questionBankApi, QuestionBankItemData } from "@/services/questionBankApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getSavedCPSSession,
  getSpecialtyStats,
  CPSSavedSession,
  CPSSpecialtyStats,
  formatAverageTime,
  getCurrentUserId,
  CPS_SPECIALTIES_CONFIG,
} from "@/lib/practiceSession";

interface SpecialtyMeta {
  title: string;
  subtitle: string;
}

const SPECIALTY_META: Record<string, SpecialtyMeta> = {
  cardiovascular: {
    title: "Cardiovascular Medicine",
    subtitle: "Comprehensive question bank covering coronary artery disease, heart failure, arrhythmias, valvular disorders, and cardiology emergencies.",
  },
  dermatology: {
    title: "Dermatology",
    subtitle: "Comprehensive question bank covering inflammatory dermatoses, cutaneous infections, skin malignancies, and dermatological emergencies.",
  },
  ent: {
    title: "ENT",
    subtitle: "Comprehensive question bank covering otological, rhinological, head & neck, and ENT emergency management.",
  },
  endocrinology: {
    title: "Endocrinology & Diabetes",
    subtitle: "Comprehensive question bank covering diabetes management, thyroid and parathyroid disorders, adrenal conditions, and pituitary disease.",
  },
  gastroenterology: {
    title: "Gastroenterology & Hepatology",
    subtitle: "Comprehensive question bank covering luminal gastroenterology, chronic liver disease, pancreaticobiliary pathology, and acute GI emergencies.",
  },
  immunology: {
    title: "Genetics & Immunology",
    subtitle: "Comprehensive question bank covering single-gene disorders, chromosomal abnormalities, immunodeficiency, and allergy.",
  },
  haematology: {
    title: "Haematology & Oncology",
    subtitle: "Comprehensive question bank covering anaemias, haematological malignancies, coagulopathies, and oncological emergencies.",
  },
  infectious: {
    title: "Infectious Diseases",
    subtitle: "Comprehensive question bank covering bacterial, viral, fungal, and tropical infections, sepsis, and antimicrobial stewardship.",
  },
  neurology: {
    title: "Neurology",
    subtitle: "Comprehensive question bank covering stroke, headache, epilepsy, movement disorders, demyelinating disease, and neuromuscular conditions.",
  },
  ophthalmology: {
    title: "Ophthalmology",
    subtitle: "Comprehensive question bank covering acute eye conditions, glaucoma, retinal pathology, neuro-ophthalmology, and ocular trauma.",
  },
  paediatrics: {
    title: "Paediatrics",
    subtitle: "Comprehensive question bank covering neonatology, developmental assessment, paediatric infections, respiratory emergencies, and safeguarding.",
  },
  pharmacology: {
    title: "Pharmacology",
    subtitle: "Comprehensive question bank covering prescribing safety, therapeutic drug monitoring, adverse drug reactions, and toxicology.",
  },
  psychiatry: {
    title: "Psychiatry",
    subtitle: "Comprehensive question bank covering mood disorders, psychosis, anxiety, substance misuse, eating disorders, and psychiatric emergencies.",
  },
  renal: {
    title: "Renal Medicine & Urology",
    subtitle: "Comprehensive question bank covering acute and chronic kidney disease, electrolyte disturbances, glomerular disease, and urology.",
  },
  reproductive: {
    title: "Reproductive Medicine",
    subtitle: "Comprehensive question bank covering antenatal and postnatal care, obstetric emergencies, gynaecology, and sexual health.",
  },
  respiratory: {
    title: "Respiratory Medicine",
    subtitle: "Comprehensive question bank covering airways disease, pleural disease, lung cancer, interstitial disorders, and respiratory failure.",
  },
  musculoskeletal: {
    title: "Rheumatology & Musculoskeletal Medicine",
    subtitle: "Comprehensive question bank covering inflammatory arthritides, connective tissue disease, osteoporosis, and soft tissue disorders.",
  },
  surgery: {
    title: "Surgery & Orthopaedics",
    subtitle: "Comprehensive question bank covering acute abdomen, fractures, vascular and perioperative management, and surgical emergencies.",
  },
};

// Module-level in-memory cache across route navigations
const specialtyClientCache = new Map<string, QuestionBankItemData>();

function getInitialSpecialtyData(slug: string): QuestionBankItemData | null {
  if (specialtyClientCache.has(slug)) {
    return specialtyClientCache.get(slug)!;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(`cps_specialty_${slug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        specialtyClientCache.set(slug, parsed);
        return parsed;
      }
    } catch {}
  }
  return null;
}

function setCachedSpecialtyData(slug: string, data: QuestionBankItemData) {
  specialtyClientCache.set(slug, data);
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(`cps_specialty_${slug}`, JSON.stringify(data));
    } catch {}
  }
}

export default function SpecialtyPracticeSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = typeof params?.specialityId === "string" ? params.specialityId.toLowerCase() : "cardiovascular";
  const defaultMeta = SPECIALTY_META[rawId] || {
    title: rawId.charAt(0).toUpperCase() + rawId.slice(1).replace(/-/g, " "),
    subtitle: "Practice clinical problem solving questions from the question bank.",
  };

  const initialData = getInitialSpecialtyData(rawId);

  // Backend dynamic question bank state
  const [dynamicBank, setDynamicBank] = useState<QuestionBankItemData | null>(initialData);
  const [loadingBank, setLoadingBank] = useState<boolean>(!initialData);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Practice settings state
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [questionType, setQuestionType] = useState<"SBA" | "EMQ" | "Both">("SBA");
  const [topicMode, setTopicMode] = useState<"all" | "choose">("choose");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Saved in-progress session state for resuming
  const [savedSession, setSavedSession] = useState<CPSSavedSession | null>(null);

  // Pure dynamic database values - zero dummy data
  const availableTopics = dynamicBank?.subTopics || [];
  const currentTitle = dynamicBank?.title || defaultMeta.title;
  const currentSubtitle = dynamicBank?.description || defaultMeta.subtitle;
  const specConfig = CPS_SPECIALTIES_CONFIG.find(
    (c) => c.id === rawId || c.title.toLowerCase() === currentTitle.toLowerCase()
  );
  const currentSbaCount = (dynamicBank as any)?.sbaCount ?? specConfig?.sbaCount ?? 0;
  const currentEmqCount = (dynamicBank as any)?.emqCount ?? specConfig?.emqCount ?? 0;
  const currentTotalQ = dynamicBank?.questionCount || specConfig?.totalQ || (currentSbaCount + currentEmqCount) || 0;

  // Fetch dynamic question bank and subtopics from database whenever rawId changes
  useEffect(() => {
    let isMounted = true;
    async function fetchSpecialtyBank() {
      try {
        const cached = getInitialSpecialtyData(rawId);
        if (cached && isMounted) {
          setDynamicBank(cached);
          setLoadingBank(false);
        } else if (!cached && isMounted) {
          setLoadingBank(true);
        }
        setLoadError(null);
        const res = await questionBankApi.getQuestionBankBySpecialty(rawId, true);
        if (isMounted && res?.data) {
          setDynamicBank(res.data);
          setCachedSpecialtyData(rawId, res.data);
        }
      } catch (err: any) {
        console.error("Failed to load question bank:", err);
        if (isMounted && !dynamicBank) {
          setLoadError(err?.message || "Failed to load question bank");
        }
      } finally {
        if (isMounted) {
          setLoadingBank(false);
        }
      }
    }

    fetchSpecialtyBank();
    return () => {
      isMounted = false;
    };
  }, [rawId]);

  // Check for unfinished session on mount and when rawId/currentTitle changes
  const user = useSelector((state: RootState) => state.auth.user);
  const activeUserId = user?.id || getCurrentUserId();

  useEffect(() => {
    const session = getSavedCPSSession(rawId, activeUserId) || getSavedCPSSession(currentTitle, activeUserId);
    if (session && !session.isCompleted && session.totalQuestions > 0) {
      setSavedSession(session);
    } else {
      setSavedSession(null);
    }
  }, [rawId, currentTitle, activeUserId]);

  const hasUnfinishedSession = Boolean(
    savedSession && !savedSession.isCompleted && savedSession.totalQuestions > 0
  );

  // Dynamic statistics state derived from real user sessions & database bank stats
  const [specialtyStats, setSpecialtyStats] = useState<CPSSpecialtyStats>({
    attempted: 0,
    correct: 0,
    accuracy: 0,
    totalTimeSeconds: 0,
    averageTime: "0s",
    progressPercent: 0,
  });

  // Calculate and synchronize dynamic stats whenever rawId, currentTitle, currentTotalQ, savedSession, or dynamicBank changes
  useEffect(() => {
    if (!dynamicBank) return;

    // 1. Get client-side saved/live session stats (by slug or title)
    const statsBySlug = getSpecialtyStats(rawId, currentTotalQ, activeUserId);
    const statsByTitle = getSpecialtyStats(currentTitle, currentTotalQ, activeUserId);
    let chosen = statsBySlug.attempted >= statsByTitle.attempted ? statsBySlug : statsByTitle;

    // 2. Check if backend database attempts have more data
    const backendStats = dynamicBank?.stats;
    if (backendStats && backendStats.attempted > chosen.attempted) {
      chosen = {
        attempted: backendStats.attempted,
        correct: backendStats.correct,
        accuracy: backendStats.accuracy,
        totalTimeSeconds: backendStats.averageTimeSeconds * backendStats.attempted,
        averageTime: formatAverageTime(backendStats.averageTimeSeconds),
        progressPercent:
          currentTotalQ > 0
            ? Math.min(100, Math.round((backendStats.attempted / currentTotalQ) * 100))
            : 0,
      };
    }

    setSpecialtyStats(chosen);
  }, [rawId, currentTitle, currentTotalQ, savedSession, dynamicBank]);

  const attemptedCount = specialtyStats.attempted;
  const accuracyPercent = specialtyStats.accuracy;
  const averageTimeString = specialtyStats.averageTime;
  const progressPercent = specialtyStats.progressPercent;

  const toggleTopic = (topic: string) => {
    let next: string[];
    if (selectedTopics.includes(topic)) {
      next = selectedTopics.filter((t) => t !== topic);
    } else {
      next = [...selectedTopics, topic];
    }
    setSelectedTopics(next);

    // If all options are selected, automatically switch to "all"
    // If any option is unselected, go to "choose"
    if (next.length === availableTopics.length) {
      setTopicMode("all");
    } else {
      setTopicMode("choose");
    }
  };

  const handleSelectAllTopics = () => {
    setTopicMode("all");
    setSelectedTopics(availableTopics);
  };

  const handleChooseTopics = () => {
    setTopicMode("choose");
  };

  // If loading failed without any cached/fallback data
  if (loadError && !dynamicBank) {
    return (
      <div className="space-y-6 sm:space-y-7 pb-8">
        <div className="space-y-1">
          <Link
            href="/dashboard/clinical-problem-solving"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E718D] hover:text-[#0F172A] transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Clinical Problem Solving</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {currentTitle}
          </h1>
        </div>
        <div className="bg-white rounded-2xl p-10 border border-slate-200/80 shadow-2xs text-center space-y-3">
          <p className="text-sm font-semibold text-red-600">
            {loadError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-xs font-bold bg-[#1D82EB] text-white rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7 pb-8">
      {/* 1. Page Header with Back Link */}
      <div className="space-y-1">
        <Link
          href="/dashboard/clinical-problem-solving"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5E718D] hover:text-[#0F172A] transition-colors mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clinical Problem Solving</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          {currentTitle}
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium line-clamp-2">
          {currentSubtitle}
        </p>
      </div>

      {/* 2. Top Stats (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Questions Attempted */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5E718D]">Questions Attempted</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                {attemptedCount.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-400">
                / {currentTotalQ.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1D82EB] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>Current Progress</span>
              <span className="text-slate-700 font-bold">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5E718D]">Overall Accuracy</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {accuracyPercent}%
            </div>
          </div>

          {/* Radial Accuracy Gauge with inner gap padding */}
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
                strokeDashoffset={(2 * Math.PI * 33) * (1 - accuracyPercent / 100)}
                strokeLinecap="butt"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">
                {accuracyPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Time / Question */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[#5E718D]">Average Time/ Question</p>
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {averageTimeString}
            </div>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 text-[#1D82EB]" viewBox="0 0 48 48" fill="none">
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

      {/* 3. Main Practice Settings & Session Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Practice Settings Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs space-y-6">
          <h2 className="text-lg font-bold text-[#0F172A]">Practice Settings</h2>

          {/* Row 1: Timer Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Timer</span>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold ${!timerEnabled ? "text-slate-900" : "text-slate-400"}`}>
                Off
              </span>
              <button
                type="button"
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  timerEnabled ? "bg-[#1D82EB]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    timerEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold ${timerEnabled ? "text-slate-900" : "text-slate-400"}`}>
                On
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Row 2: Question Type Selection */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-slate-700">Question Type</span>
            <div className="flex items-center gap-2">
              {(["SBA", "EMQ", "Both"] as const).map((type) => {
                const countBadge =
                  type === "SBA" && currentSbaCount > 0
                    ? ` (${currentSbaCount})`
                    : type === "EMQ" && currentEmqCount > 0
                    ? ` (${currentEmqCount})`
                    : type === "Both" && currentTotalQ > 0
                    ? ` (${currentTotalQ})`
                    : "";
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setQuestionType(type)}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      questionType === type
                        ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs"
                        : "bg-[#f8fafc] text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                    }`}
                  >
                    {type}{countBadge}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Row 3: Topics Filter Header */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Topics</span>
              <span className="text-xs font-semibold text-slate-400">
                ({availableTopics.length} available)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllTopics}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  topicMode === "all"
                    ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs"
                    : "bg-[#f8fafc] text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                All Topics
              </button>
              <button
                type="button"
                onClick={handleChooseTopics}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  topicMode === "choose"
                    ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs"
                    : "bg-[#f8fafc] text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                Choose Topics
              </button>
            </div>
          </div>

          {/* Selectable Topics Checkbox List */}
          <div className="space-y-3 pt-2">
            {loadingBank && availableTopics.length === 0 ? (
              <div className="space-y-3 py-1 animate-pulse">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-[4px] bg-slate-200 shrink-0" />
                    <div
                      className="h-3.5 bg-slate-100 rounded-md"
                      style={{ width: `${50 + (i % 4) * 12}%` }}
                    />
                  </div>
                ))}
              </div>
            ) : availableTopics.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No subtopics found for this specialty.</p>
            ) : (
              availableTopics.map((topic) => {
                const isChecked = selectedTopics.includes(topic);
                return (
                  <div
                    key={topic}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleTopic(topic)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleTopic(topic);
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-[#1D82EB] text-white"
                          : "border border-slate-300 bg-white group-hover:border-slate-400"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs sm:text-[13px] font-medium transition-colors ${
                        isChecked ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                      }`}
                    >
                      {topic}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Session Card (1 Col) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A]">Session</h2>

            {/* Previous Session Found Notice or Active Bank Info */}
            {hasUnfinishedSession && savedSession ? (
              <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-4 sm:p-5 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-[#1D82EB]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-[13px] font-bold">
                    Previous Session In Progress
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                  Question {savedSession.currentIndex + 1} of {savedSession.totalQuestions} · {savedSession.questionType}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You stopped at question {savedSession.currentIndex + 1}. Click Resume Session to continue where you left off.
                </p>
              </div>
            ) : (
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 text-[#059669]">
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-[13px] font-bold">
                    Active Question Bank
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                  {questionType} · {selectedTopics.length === availableTopics.length && availableTopics.length > 0 ? "All Topics" : selectedTopics.length === 0 ? "No Topics Selected" : `${selectedTopics.length} Topics Selected`}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedTopics.length === 0
                    ? "Select one or more topics above to begin practice."
                    : `${currentTotalQ} dynamic questions available in database.`}
                </p>
              </div>
            )}
          </div>

          {/* Action CTA Buttons */}
          <div className="space-y-3 pt-4">
            <Link
              href={
                hasUnfinishedSession && savedSession
                  ? `/practice/clinical?topic=${encodeURIComponent(savedSession.speciality || currentTitle)}&speciality=${encodeURIComponent(savedSession.speciality || currentTitle)}&type=${savedSession.questionType}&timer=${savedSession.timer}&mode=resume&topics=${encodeURIComponent(savedSession.topics)}`
                  : "#"
              }
              className={`w-full py-3 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] active:scale-[0.99] text-white font-bold text-xs sm:text-sm text-center shadow-xs shadow-blue-500/20 flex items-center justify-center transition-all ${
                hasUnfinishedSession
                  ? "cursor-pointer opacity-100"
                  : "opacity-40 pointer-events-none cursor-not-allowed"
              }`}
            >
              <span>Resume Session</span>
            </Link>

            <Link
              href={`/practice/clinical?topic=${encodeURIComponent(currentTitle)}&speciality=${encodeURIComponent(currentTitle)}&type=${questionType}&timer=${timerEnabled ? "on" : "off"}&mode=new&topics=${topicMode === "all" ? "all" : encodeURIComponent(selectedTopics.join(","))}`}
              className={`w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange/90 active:scale-[0.99] text-white font-bold text-xs sm:text-sm text-center shadow-xs shadow-brand-orange/20 flex items-center justify-center transition-all ${
                selectedTopics.length === 0 ? "opacity-40 pointer-events-none cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <span>Start New Session</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
