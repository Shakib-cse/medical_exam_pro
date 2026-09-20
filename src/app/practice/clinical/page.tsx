"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  XCircle,
  Info,
  Check,
  X,
  AlertCircle,
  MessageSquare,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { overviewApi } from "@/services/overviewApi";
import { mockExamApi } from "@/services/mockExamApi";
import { questionBankApi } from "@/services/questionBankApi";
import { PracticeHeader } from "../_components/PracticeHeader";
import { QuestionNavigator, NavigatorItem } from "../_components/QuestionNavigator";
import { ExamResultView } from "../_components/ExamResultView";
import {
  getSavedCPSSession,
  saveCPSSession,
  markCPSSessionCompleted,
  clearCPSSession,
  formatAverageTime,
} from "@/lib/practiceSession";

// ==========================================
// 1. DATA TYPES & INTERFACES
// ==========================================

export interface OptionItem {
  id: string; // "A", "B", "C", etc.
  label: string;
}

export interface SBAQuestion {
  id: string | number;
  itemType: "SBA";
  badge: string;
  topic: string;
  subTopic: string;
  vignette: string;
  question: string;
  options: OptionItem[];
  correctOption: string;
  explanation: string;
}

export interface EMQCase {
  id: string;
  caseNumber: number;
  vignette: string;
  correctOption: string;
  explanation: string;
}

export interface EMQTheme {
  id: string | number;
  itemType: "EMQ";
  themeNumber: number;
  topic: string;
  subTopic: string;
  title: string;
  instruction?: string;
  options: OptionItem[];
  cases: EMQCase[];
}

export type PracticeItem = SBAQuestion | EMQTheme;

// ==========================================
// 2. MAIN COMPONENT IMPLEMENTATION
// ==========================================
// ==========================================

function ClinicalPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Query parameters from Specialty Practice Settings Page
  const specialityParam =
    searchParams.get("speciality") || searchParams.get("topic") || "Cardiology & Respiratory Focus";
  const questionTypeParam = (searchParams.get("type") || "SBA") as "SBA" | "EMQ" | "Both";
  const timerParam = searchParams.get("timer") || "on";
  const topicsParam = searchParams.get("topics") || "all";
  const modeParam = searchParams.get("mode") || "new";

  const showTimer = timerParam !== "off";

  // Practice state
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // SBA state: questionIndex -> selectedOptionId
  const [userSbaAnswers, setUserSbaAnswers] = useState<Record<number, string>>({});

  // EMQ state: themeIndex -> { caseId: selectedOptionId }
  const [userEmqAnswers, setUserEmqAnswers] = useState<Record<number, Record<string, string>>>({});
  // EMQ submitted state: themeIndex -> boolean
  const [emqSubmitted, setEmqSubmitted] = useState<Record<number, boolean>>({});

  // Flagged questions
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});

  // Timer: starts at 0 (00:00) and counts up only after all questions are loaded
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Session completion state (shows results page matching screenshot)
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Modals
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeEmqPicker, setActiveEmqPicker] = useState<{
    themeIndex: number;
    caseId: string;
  } | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // ==========================================
  // A. TIMER EFFECT (Starts at 0 and counts up only AFTER questions finish loading)
  // ==========================================
  useEffect(() => {
    if (!showTimer || loadingQuestions || isSessionFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer, loadingQuestions, isSessionFinished]);

  // ==========================================
  // B. DYNAMIC BACKEND / TOPIC FILTERING
  // ==========================================
  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      setLoadingQuestions(true);
      setElapsedSeconds(0);
      setLoadError(null);
      let sbaList: SBAQuestion[] = [];
      let emqList: EMQTheme[] = [];

      // Try fetching dynamic questions from backend question bank
      try {
        let bankDetail: any = null;
        try {
          const specRes = await questionBankApi.getQuestionBankBySpecialty(specialityParam, false);
          if (specRes?.data?.questions && specRes.data.questions.length > 0) {
            bankDetail = specRes.data;
          }
        } catch {
          // fallback to searching all question banks
        }

        if (!bankDetail) {
          const banksRes = await questionBankApi.getQuestionBanks();
          if (banksRes?.data && Array.isArray(banksRes.data)) {
            const matchedBank = banksRes.data.find(
              (b) =>
                b.specialty.toLowerCase().includes(specialityParam.toLowerCase()) ||
                specialityParam.toLowerCase().includes(b.specialty.toLowerCase()) ||
                b.title.toLowerCase().includes(specialityParam.toLowerCase())
            );
            if (matchedBank?.id) {
              const detailRes = await questionBankApi.getQuestionBankById(matchedBank.id);
              if (detailRes?.data?.questions) {
                bankDetail = detailRes.data;
              }
            }
          }
        }

        if (bankDetail?.questions && bankDetail.questions.length > 0) {
          const allBankQuestions = bankDetail.questions;
          const sbas: SBAQuestion[] = [];
          const emqs: EMQTheme[] = [];

          allBankQuestions.forEach((q: any, idx: number) => {
            if (q.questionType === "EMQ") {
              emqs.push({
                id: `emq-${q.id || idx}`,
                itemType: "EMQ",
                themeNumber: q.themeNumber || idx + 1,
                topic: bankDetail.specialty || bankDetail.title || specialityParam,
                subTopic: q.subTopic || "General",
                title: q.questionText.replace(/^Theme_[A-Za-z0-9]+_/, "").replace(/_/g, " "),
                instruction: q.explanation || "For each case, select the single most appropriate answer from the option list.",
                options: (q.options || []).map((optStr: string, oIdx: number) => {
                  const cleanLabel = typeof optStr === "string" ? optStr.replace(/^[A-Z]\.\s*/, "") : String(optStr);
                  return {
                    id: String.fromCharCode(65 + oIdx),
                    label: cleanLabel,
                  };
                }),
                cases: Array.isArray(q.cases)
                  ? q.cases.map((c: any, cIdx: number) => ({
                      id: c.id || `case-${cIdx + 1}`,
                      caseNumber: c.caseNumber || cIdx + 1,
                      vignette: c.vignette || c.question || "",
                      correctOption: c.correctOption || "A",
                      explanation: c.explanation || "Standard clinical rationale.",
                    }))
                  : [],
              });
            } else {
              // SBA
              const rawParts = q.questionText.split("\n\n");
              const vignette = rawParts.length > 1 ? rawParts[0] : "";
              const question = rawParts.length > 1 ? rawParts.slice(1).join("\n\n") : q.questionText;

              sbas.push({
                id: `sba-${q.id || idx}`,
                itemType: "SBA",
                badge: `Q.${sbas.length + 1}`,
                topic: bankDetail.specialty || bankDetail.title || specialityParam,
                subTopic: q.subTopic || "Clinical Review",
                vignette: vignette || question,
                question: question || vignette,
                options: (q.options || []).map((optStr: string, oIdx: number) => {
                  const cleanLabel = typeof optStr === "string" ? optStr.replace(/^[A-E]\.\s*/, "") : String(optStr);
                  return {
                    id: String.fromCharCode(65 + oIdx),
                    label: cleanLabel,
                  };
                }),
                correctOption: String.fromCharCode(65 + (q.correctAnswer ?? 0)),
                explanation: q.explanation || "Standard clinical rationale from exam bank.",
              });
            }
          });

          sbaList = sbas;
          emqList = emqs;
        }
      } catch (err: any) {
        console.error("Error loading questions:", err);
        if (isMounted) {
          setLoadError(err?.message || "Failed to load questions from server");
        }
      }

      // Filter by selected topics if specific topics were chosen
      if (topicsParam !== "all" && topicsParam.trim() !== "") {
        const selectedTopicList = topicsParam
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);

        if (selectedTopicList.length > 0) {
          sbaList = sbaList.filter((q) =>
            selectedTopicList.some(
              (sel) =>
                q.subTopic.toLowerCase().includes(sel) ||
                sel.includes(q.subTopic.toLowerCase()) ||
                q.topic.toLowerCase().includes(sel)
            )
          );

          emqList = emqList.filter((theme) =>
            selectedTopicList.some(
              (sel) =>
                theme.subTopic.toLowerCase().includes(sel) ||
                sel.includes(theme.subTopic.toLowerCase()) ||
                theme.title.toLowerCase().includes(sel)
            )
          );
        }
      }

      // Build practice items based on questionTypeParam:
      // "SBA" -> only SBA questions
      // "EMQ" -> only EMQ themes
      // "Both" -> SBA questions first, then EMQ themes
      let combined: PracticeItem[] = [];
      if (questionTypeParam === "SBA") {
        combined = sbaList;
      } else if (questionTypeParam === "EMQ") {
        combined = emqList;
      } else {
        // "Both"
        combined = [...sbaList, ...emqList];
      }

      if (isMounted) {
        let resumeIndex = 0;
        if (modeParam === "resume" || modeParam === "results") {
          const saved = getSavedCPSSession(specialityParam);
          if (saved) {
            if (saved.isCompleted || modeParam === "results") {
              setIsSessionFinished(true);
            }
            resumeIndex =
              typeof saved.currentIndex === "number" && saved.currentIndex < combined.length
                ? saved.currentIndex
                : 0;
            if (saved.userSbaAnswers) setUserSbaAnswers(saved.userSbaAnswers);
            if (saved.userEmqAnswers) setUserEmqAnswers(saved.userEmqAnswers);
            if (saved.emqSubmitted) setEmqSubmitted(saved.emqSubmitted);
            if (saved.flagged) setFlagged(saved.flagged);
            if (typeof saved.elapsedSeconds === "number") setElapsedSeconds(saved.elapsedSeconds);
          }
        } else {
          // Starting new session: clear previous saved session and reset state
          clearCPSSession(specialityParam);
          setUserSbaAnswers({});
          setUserEmqAnswers({});
          setEmqSubmitted({});
          setFlagged({});
          setElapsedSeconds(0);
          setIsSessionFinished(false);
        }

        setPracticeItems(combined);
        setCurrentIndex(resumeIndex);
        setLoadingQuestions(false);
      }
    }

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [specialityParam, questionTypeParam, topicsParam, modeParam]);

  // Calculate live score summary (attempted, correct, percentage)
  const scoreCalculation = useMemo(() => {
    let totalScorable = 0;
    let totalCorrect = 0;
    let attempted = 0;

    practiceItems.forEach((item, idx) => {
      if (item.itemType === "SBA") {
        totalScorable += 1;
        if (userSbaAnswers[idx]) {
          attempted += 1;
          if (userSbaAnswers[idx] === item.correctOption) {
            totalCorrect += 1;
          }
        }
      } else {
        item.cases.forEach((c) => {
          totalScorable += 1;
          const ans = userEmqAnswers[idx]?.[c.id];
          if (ans) {
            attempted += 1;
            if (ans === c.correctOption) {
              totalCorrect += 1;
            }
          }
        });
      }
    });

    const percent = attempted > 0 ? Math.round((totalCorrect / attempted) * 100) : 0;
    return { totalScorable, totalCorrect, attempted, percent };
  }, [practiceItems, userSbaAnswers, userEmqAnswers]);

  // ==========================================
  // C. AUTOSAVE ACTIVE EXAM PROGRESS
  // ==========================================
  useEffect(() => {
    if (loadingQuestions || practiceItems.length === 0) return;

    saveCPSSession({
      speciality: specialityParam,
      specialitySlug: specialityParam.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      questionType: questionTypeParam,
      timer: timerParam as "on" | "off",
      topics: topicsParam,
      currentIndex,
      totalQuestions: practiceItems.length,
      attemptedCount: scoreCalculation.attempted,
      correctCount: scoreCalculation.totalCorrect,
      userSbaAnswers,
      userEmqAnswers,
      emqSubmitted,
      flagged,
      elapsedSeconds,
      isCompleted: false,
      lastUpdated: Date.now(),
    });
  }, [
    loadingQuestions,
    practiceItems.length,
    specialityParam,
    questionTypeParam,
    timerParam,
    topicsParam,
    currentIndex,
    userSbaAnswers,
    userEmqAnswers,
    emqSubmitted,
    flagged,
    elapsedSeconds,
    scoreCalculation,
  ]);

  // Current item
  const currentItem = practiceItems[currentIndex];
  const isSBA = currentItem?.itemType === "SBA";
  const isEMQ = currentItem?.itemType === "EMQ";

  // ==========================================
  // C. QUESTION NAVIGATOR DERIVATIONS
  // ==========================================
  const navigatorItems: NavigatorItem[] = useMemo(() => {
    return practiceItems.map((item, idx) => {
      if (item.itemType === "SBA") {
        const ans = userSbaAnswers[idx];
        const isAnswered = Boolean(ans);
        const isCorrect = isAnswered ? ans === item.correctOption : null;
        let status: NavigatorItem["status"] = "unanswered";

        if (flagged[idx]) {
          status = "flagged";
        } else if (isAnswered) {
          status = isCorrect ? "correct" : "wrong";
        }

        return {
          id: item.id,
          label: item.badge,
          subTopic: item.subTopic || item.topic,
          status,
        };
      } else {
        // EMQ Theme
        const themeAns = userEmqAnswers[idx] || {};
        const isSubmitted = Boolean(emqSubmitted[idx]);
        const allCasesCorrect =
          isSubmitted &&
          item.cases.every((c) => themeAns[c.id] === c.correctOption);
        const anyCaseWrong =
          isSubmitted &&
          item.cases.some((c) => themeAns[c.id] && themeAns[c.id] !== c.correctOption);

        let status: NavigatorItem["status"] = "unanswered";
        if (flagged[idx]) {
          status = "flagged";
        } else if (isSubmitted) {
          status = allCasesCorrect ? "correct" : anyCaseWrong ? "wrong" : "unanswered";
        }

        return {
          id: item.id,
          label: `Theme ${item.themeNumber}`,
          subTopic: item.subTopic || item.title,
          status,
        };
      }
    });
  }, [practiceItems, userSbaAnswers, userEmqAnswers, emqSubmitted, flagged]);

  // ==========================================
  // D. SBA INTERACTION HANDLERS
  // "user select then emmidietly show"
  // ==========================================
  const handleSelectSbaOption = (optionId: string) => {
    setUserSbaAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionId,
    }));
  };

  // ==========================================
  // E. EMQ INTERACTION HANDLERS
  // "for emq user selects best option for each case, then submits"
  // ==========================================
  const handlePickEmqOption = (caseId: string, optionId: string) => {
    setUserEmqAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        ...(prev[currentIndex] || {}),
        [caseId]: optionId,
      },
    }));
    setActiveEmqPicker(null);
  };

  const handleClearEmqOption = (caseId: string) => {
    if (emqSubmitted[currentIndex]) return; // Do not clear once submitted
    setUserEmqAnswers((prev) => {
      const currentThemeAnswers = { ...(prev[currentIndex] || {}) };
      delete currentThemeAnswers[caseId];
      return {
        ...prev,
        [currentIndex]: currentThemeAnswers,
      };
    });
  };

  const handleSubmitEmqTheme = () => {
    if (!isEMQ) return;
    const currentTheme = currentItem as EMQTheme;
    const currentThemeAnswers = userEmqAnswers[currentIndex] || {};

    // Check if user answered all cases in this theme
    const unansweredCase = currentTheme.cases.find((c) => !currentThemeAnswers[c.id]);
    if (unansweredCase) {
      setFeedbackMessage(`Please select an option for Case ${unansweredCase.caseNumber} before submitting.`);
      setTimeout(() => setFeedbackMessage(null), 3500);
      return;
    }

    setEmqSubmitted((prev) => ({
      ...prev,
      [currentIndex]: true,
    }));
  };

  // ==========================================
  // F. NAVIGATION CONTROLS & COMPLETION
  // ==========================================
  const finishSession = () => {
    saveCPSSession({
      speciality: specialityParam,
      specialitySlug: specialityParam.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      questionType: questionTypeParam,
      timer: timerParam as "on" | "off",
      topics: topicsParam,
      currentIndex,
      totalQuestions: practiceItems.length,
      attemptedCount: scoreCalculation.attempted,
      correctCount: scoreCalculation.totalCorrect,
      userSbaAnswers,
      userEmqAnswers,
      emqSubmitted,
      flagged,
      elapsedSeconds,
      isCompleted: true,
      lastUpdated: Date.now(),
    });
    markCPSSessionCompleted(specialityParam);
    setShowExitModal(false);
    setIsSessionFinished(true);
  };

  const handleRetakeSession = () => {
    clearCPSSession(specialityParam);
    setUserSbaAnswers({});
    setUserEmqAnswers({});
    setEmqSubmitted({});
    setFlagged({});
    setElapsedSeconds(0);
    setCurrentIndex(0);
    setIsSessionFinished(false);
  };

  const handleNext = () => {
    if (currentIndex < practiceItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishSession();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  };

  // Page header title formatted as in screenshots
  const headerPracticeTitle = useMemo(() => {
    if (questionTypeParam === "SBA") {
      return `${specialityParam} → SBA Practice`;
    } else if (questionTypeParam === "EMQ") {
      return `${specialityParam} → EMQ Practice`;
    } else {
      return `${specialityParam} → SBA & EMQ Practice`;
    }
  }, [specialityParam, questionTypeParam]);

  // If user completed session, render dedicated Completed Results Page (Matches Screenshot)
  if (isSessionFinished) {
    const questionsAttempted =
      scoreCalculation.attempted > 0
        ? scoreCalculation.attempted
        : Object.keys(userSbaAnswers).length +
          Object.values(userEmqAnswers).reduce(
            (acc, curr) => acc + Object.keys(curr).length,
            0
          );
    const effectiveAttempted = questionsAttempted > 0 ? questionsAttempted : practiceItems.length;
    const avgSec = effectiveAttempted > 0 ? Math.round(elapsedSeconds / effectiveAttempted) : 0;
    const averageTimeString = formatAverageTime(avgSec);

    return (
      <ExamResultView
        specialtyOrTitle={specialityParam}
        overallAccuracy={scoreCalculation.percent}
        questionsAttempted={effectiveAttempted}
        averageTime={averageTimeString}
        returnUrl="/dashboard/clinical-problem-solving"
        onRetake={handleRetakeSession}
        examType="CPS"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3F6] text-slate-800 flex flex-col font-sans">
      {/* 1. TOP HEADER BAR (Matches Screenshot 1 & Screenshot 2) */}
      <PracticeHeader
        title={headerPracticeTitle}
        totalQuestions={practiceItems.length}
        currentIndex={currentIndex}
        timeRemaining={elapsedSeconds}
        showTimer={showTimer}
        onEndSession={() => setShowExitModal(true)}
        questionLabel={isEMQ ? "Theme" : "Question"}
        loading={loadingQuestions}
      />

      {/* 2. MAIN PRACTICE AREA */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-7">
        {feedbackMessage && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {loadingQuestions ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#1D82EB] animate-spin" />
              <div className="absolute w-3 h-3 rounded-full bg-[#1D82EB]" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-slate-800">
                Loading {specialityParam} Questions...
              </p>
              <p className="text-xs sm:text-sm text-slate-500">
                Preparing your practice session
              </p>
            </div>
          </div>
        ) : loadError ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center px-4 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs max-w-md mx-auto my-12">
            <AlertCircle className="w-12 h-12 text-rose-500" />
            <h3 className="text-base font-bold text-slate-800">Failed to Load Questions</h3>
            <p className="text-xs text-slate-500">{loadError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#1D82EB] text-white text-xs font-bold hover:bg-[#1870cb] transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : practiceItems.length === 0 ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 text-center px-4 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs max-w-md mx-auto my-12">
            <HelpCircle className="w-12 h-12 text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">No Questions Found</h3>
            <p className="text-xs text-slate-500">
              No questions matched your selected filters for {specialityParam}. Please return to practice settings to choose topics.
            </p>
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl bg-[#1D82EB] text-white text-xs font-bold hover:bg-[#1870cb] transition-colors cursor-pointer"
            >
              Back to Practice Settings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Column: QUESTION NAVIGATOR (Exact match to screenshot sidebar) */}
          <aside className="lg:col-span-1 bg-white/70 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <QuestionNavigator
              totalQuestions={practiceItems.length}
              currentIndex={currentIndex}
              items={navigatorItems}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              title="QUESTION NAVIGATOR"
              layout="list"
            />
          </aside>

          {/* Right Column: QUESTION CARD (SBA or EMQ) */}
          <section className="lg:col-span-3 space-y-6">
            {/* ==========================================
                VIEW A: SBA QUESTION (Single Best Answer)
               ========================================== */}
            {isSBA && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                {/* Vignette */}
                <div className="space-y-4">
                  <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
                    {(currentItem as SBAQuestion).vignette}
                  </p>

                  <h2 className="font-bold text-slate-900 text-base sm:text-lg pt-1">
                    {(currentItem as SBAQuestion).question}
                  </h2>
                </div>

                {/* Multiple Choice Options */}
                <div className="space-y-3 pt-2">
                  {(currentItem as SBAQuestion).options.map((opt) => {
                    const currentSba = currentItem as SBAQuestion;
                    const selected = userSbaAnswers[currentIndex] === opt.id;
                    const isAnswered = Boolean(userSbaAnswers[currentIndex]);
                    const isCorrectOption = opt.id === currentSba.correctOption;

                    let containerStyle =
                      "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800 cursor-pointer";
                    let badgeStyle = "bg-slate-100 text-slate-600";
                    let radioBorder = "border-slate-300 bg-white";
                    let radioDotColor = "";

                    if (isAnswered) {
                      if (isCorrectOption) {
                        // Correct option is ALWAYS green when answered
                        containerStyle =
                          "border-emerald-500 bg-[#E8F8F0] text-emerald-950 font-semibold ring-1 ring-emerald-500 cursor-default";
                        badgeStyle = "bg-[#059669] text-white";
                        radioBorder = "border-emerald-600 bg-white";
                        radioDotColor = "bg-emerald-600";
                      } else if (selected && !isCorrectOption) {
                        // User selected this WRONG option -> red styling
                        containerStyle =
                          "border-red-500 bg-[#FEF2F2] text-red-950 font-semibold ring-1 ring-red-500 cursor-default";
                        badgeStyle = "bg-red-600 text-white";
                        radioBorder = "border-red-600 bg-white";
                        radioDotColor = "bg-red-600";
                      } else {
                        // Other unselected options
                        containerStyle = "border-slate-200 opacity-60 text-slate-500 cursor-default";
                        badgeStyle = "bg-slate-100 text-slate-400";
                        radioBorder = "border-slate-300 bg-white";
                      }
                    } else if (selected) {
                      containerStyle =
                        "border-[#1D82EB] bg-blue-50/60 text-slate-900 font-semibold ring-1 ring-[#1D82EB] cursor-pointer";
                      badgeStyle = "bg-[#1D82EB] text-white";
                      radioBorder = "border-[#1D82EB] bg-white";
                      radioDotColor = "bg-[#1D82EB]";
                    }

                    return (
                      <div
                        key={opt.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => !isAnswered && handleSelectSbaOption(opt.id)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${containerStyle}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                          >
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
                        </div>

                        {/* Radio circle */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${radioBorder}`}
                        >
                          {radioDotColor && (
                            <div className={`w-2.5 h-2.5 rounded-full ${radioDotColor}`} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Card (Immediately revealed when answered) */}
                {Boolean(userSbaAnswers[currentIndex]) && (() => {
                  const currentSba = currentItem as SBAQuestion;
                  const correctOptObj = currentSba.options.find(
                    (o) => o.id === currentSba.correctOption
                  );

                  return (
                    <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-2xl p-5 space-y-2.5 animate-in fade-in slide-in-from-top-2 shadow-2xs">
                      <div className="flex items-center gap-2 text-[#059669]">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#059669]" />
                        <span className="text-xs sm:text-sm font-bold text-[#059669]">
                          Correct Answer: {currentSba.correctOption}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-800 pl-6">
                        {correctOptObj?.label}
                      </p>

                      <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed pl-6 pt-1">
                        <strong className="text-slate-800 font-bold">Explanation: </strong>
                        {currentSba.explanation}
                      </p>
                    </div>
                  );
                })()}

                {/* SBA Bottom Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  {/* Left: Flag and Report */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleToggleFlag}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        flagged[currentIndex]
                          ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Flag
                        className={`w-3.5 h-3.5 ${
                          flagged[currentIndex] ? "text-amber-600 fill-amber-500" : "text-slate-500"
                        }`}
                      />
                      <span>{flagged[currentIndex] ? "Flagged" : "Flag"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReportModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Report Issue</span>
                    </button>
                  </div>

                  {/* Right: Previous and Next/Submit */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                    >
                      <span>
                        {userSbaAnswers[currentIndex]
                          ? currentIndex === practiceItems.length - 1
                            ? "Complete Session"
                            : "Next Question"
                          : "Submit Answer"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                VIEW B: EMQ QUESTION (Extended Matching)
               ========================================== */}
            {isEMQ && (
              <div className="space-y-6">
                {/* 1. Theme Header & Shared Options Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="space-y-1.5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Theme {(currentItem as EMQTheme).themeNumber}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-slate-800">
                      {(currentItem as EMQTheme).title}
                    </h2>
                  </div>

                  {/* Amber Instructions Callout */}
                  <div className="flex items-center gap-2 text-amber-600 text-xs font-medium py-1">
                    <Info className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>
                      {(currentItem as EMQTheme).instruction ||
                        "For each case, select the single most appropriate answer from the option list. Each option may be used once, more than once or not at all"}
                    </span>
                  </div>

                  {/* Shared Options List */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs sm:text-sm font-semibold text-slate-500">
                      Options: <span className="font-normal text-slate-400">(Shared for all cases)</span>
                    </div>

                    <div className="space-y-2">
                      {(currentItem as EMQTheme).options.map((opt) => (
                        <div
                          key={opt.id}
                          className="border border-slate-200/90 rounded-xl p-3 sm:p-3.5 flex items-center gap-3.5 bg-white hover:bg-slate-50/70 transition-colors"
                        >
                          <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {opt.id}
                          </span>
                          <span className="text-xs sm:text-[13px] text-slate-800 font-medium">
                            {opt.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Cases List */}
                <div className="space-y-5">
                  {(currentItem as EMQTheme).cases.map((c) => {
                    const currentThemeAnswers = userEmqAnswers[currentIndex] || {};
                    const selectedOptId = currentThemeAnswers[c.id];
                    const selectedOpt = (currentItem as EMQTheme).options.find(
                      (o) => o.id === selectedOptId
                    );
                    const isSubmitted = Boolean(emqSubmitted[currentIndex]);
                    const isCorrect = selectedOptId === c.correctOption;

                    return (
                      <div
                        key={c.id}
                        className={`bg-white rounded-2xl p-6 sm:p-7 border shadow-xs space-y-4 transition-all ${
                          isSubmitted
                            ? isCorrect
                              ? "border-emerald-300 ring-1 ring-emerald-200"
                              : "border-rose-300 ring-1 ring-rose-200"
                            : "border-slate-200/80"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                            Case {c.caseNumber}
                          </h3>

                          {isSubmitted && (
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                                isCorrect
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {isCorrect ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Correct</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Incorrect</span>
                                </>
                              )}
                            </span>
                          )}
                        </div>

                        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                          {c.vignette}
                        </p>

                        {/* Selected Answer Slot */}
                        <div className="pt-1">
                          {selectedOpt ? (
                            <div
                              className={`rounded-xl p-3 sm:p-3.5 flex items-center justify-between border ${
                                isSubmitted
                                  ? isCorrect
                                    ? "bg-emerald-50 border-emerald-300"
                                    : "bg-rose-50 border-rose-300"
                                  : "bg-[#EFF6FF] border-[#93C5FD]"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                                    isSubmitted
                                      ? isCorrect
                                        ? "bg-emerald-600"
                                        : "bg-rose-600"
                                      : "bg-[#2563EB]"
                                  }`}
                                >
                                  {selectedOpt.id}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-slate-900">
                                  {selectedOpt.label}
                                </span>
                              </div>

                              {!isSubmitted && (
                                <button
                                  type="button"
                                  onClick={() => handleClearEmqOption(c.id)}
                                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                  title="Change or clear option"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveEmqPicker({
                                  themeIndex: currentIndex,
                                  caseId: c.id,
                                })
                              }
                              className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/60 hover:bg-slate-50 rounded-xl p-3.5 text-center text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-700 transition-all cursor-pointer"
                            >
                              click here to pick the right answer
                            </button>
                          )}
                        </div>

                        {/* Case Explanation (Revealed once submitted) */}
                        {isSubmitted && (
                          <div className="pt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed border-t border-slate-100">
                            {!isCorrect && (
                              <div className="text-rose-700 font-semibold mb-1">
                                Correct Answer:{" "}
                                <span className="underline">
                                  [{c.correctOption}]{" "}
                                  {
                                    (currentItem as EMQTheme).options.find(
                                      (o) => o.id === c.correctOption
                                    )?.label
                                  }
                                </span>
                              </div>
                            )}
                            <strong className="text-slate-800 font-bold">Explanation: </strong>
                            {c.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 3. EMQ Bottom Controls */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
                  {/* Left: Flag and Report */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleToggleFlag}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                        flagged[currentIndex]
                          ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Flag
                        className={`w-3.5 h-3.5 ${
                          flagged[currentIndex] ? "text-amber-600 fill-amber-500" : "text-slate-500"
                        }`}
                      />
                      <span>{flagged[currentIndex] ? "Flagged" : "Flag"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReportModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Report Issue</span>
                    </button>
                  </div>

                  {/* Right: Previous and Submit/Next */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {!emqSubmitted[currentIndex] ? (
                      <button
                        type="button"
                        onClick={handleSubmitEmqTheme}
                        className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                      >
                        <span>
                          {currentIndex === practiceItems.length - 1
                            ? "Complete Session"
                            : "Next Theme"}
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
        )}
      </main>

      {/* ==========================================
          MODAL 1: EMQ OPTION PICKER MODAL
         ========================================== */}
      {activeEmqPicker && isEMQ && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Select Option for Case
                </h3>
                <p className="text-xs text-slate-500">
                  Pick the single most appropriate answer from the shared option list.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveEmqPicker(null)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {(currentItem as EMQTheme).options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handlePickEmqOption(activeEmqPicker.caseId, opt.id)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center gap-3 transition-all cursor-pointer group"
                >
                  <span className="w-6 h-6 rounded bg-slate-100 group-hover:bg-[#1D82EB] group-hover:text-white text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 transition-colors">
                    {opt.id}
                  </span>
                  <span className="text-xs sm:text-[13px] text-slate-800 font-medium group-hover:text-slate-900">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: SESSION SUMMARY / EXIT MODAL
         ========================================== */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 border border-[#E0E4EA] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                End Practice Session?
              </h3>
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600">
              Would you like to complete and view your final results, or continue practising?
            </p>

            <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-2xl p-4 text-center space-y-1">
              <span className="text-xs font-bold text-[#059669] tracking-wider uppercase">
                Current Accuracy
              </span>
              <div className="text-3xl font-black text-[#059669]">
                {scoreCalculation.percent}%
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {scoreCalculation.attempted} questions attempted · {scoreCalculation.totalCorrect} correct
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={finishSession}
                className="w-full py-3 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs sm:text-sm text-center block transition-all shadow-xs cursor-pointer"
              >
                Finish & View Results
              </button>

              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center block transition-colors cursor-pointer"
              >
                Continue Practising
              </button>

              <Link
                href="/dashboard/clinical-problem-solving"
                className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs text-center block font-medium transition-colors"
              >
                Save Progress & Exit to Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: REPORT ISSUE MODAL
         ========================================== */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900">
              Report Issue
            </h3>
            <p className="text-xs text-slate-500">
              Found an inaccuracy in this question or explanation? Your feedback helps improve clinical accuracy.
            </p>
            <textarea
              placeholder="Describe the issue with this clinical vignette or answer key..."
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setReportModalOpen(false);
                  setFeedbackMessage("Issue reported successfully. Thank you for your feedback!");
                  setTimeout(() => setFeedbackMessage(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClinicalPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F1F3F6] flex items-center justify-center p-8 text-slate-500 font-medium">
          Loading Clinical Practice Session...
        </div>
      }
    >
      <ClinicalPracticeContent />
    </Suspense>
  );
}
