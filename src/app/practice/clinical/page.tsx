"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { overviewApi } from "@/services/overviewApi";
import { mockExamApi } from "@/services/mockExamApi";
import { questionBankApi } from "@/services/questionBankApi";
import { PracticeHeader } from "../_components/PracticeHeader";
import { QuestionNavigator, NavigatorItem } from "../_components/QuestionNavigator";
import { ExamResultView } from "../_components/ExamResultView";
import { ReportIssueModal } from "../_components/ReportIssueModal";
import { EndSessionModal } from "../_components/EndSessionModal";
import { ClinicalSbaCard } from "./_components/ClinicalSbaCard";
import { ClinicalEmqCard } from "./_components/ClinicalEmqCard";
import { EmqOptionPickerModal } from "./_components/EmqOptionPickerModal";
import {
  getSavedCPSSession,
  saveCPSSession,
  markCPSSessionCompleted,
  clearCPSSession,
  formatAverageTime,
  toggleFlaggedQuestion,
  saveQuestionReport,
  getCurrentUserId,
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

  // Session completion state
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Modals
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeEmqPicker, setActiveEmqPicker] = useState<{
    themeIndex: number;
    caseId: string;
  } | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (!showTimer || loadingQuestions || isSessionFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimer, loadingQuestions, isSessionFinished]);

  // Load Questions from Backend
  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      try {
        setLoadingQuestions(true);
        setLoadError(null);

        // Normalize specialty title to find matching QuestionBank in DB
        const rawSpecialty = specialityParam.trim();

        // 1. Fetch QuestionBank list to get matching bank ID
        const banksRes = await questionBankApi.getQuestionBanks();
        const banks = banksRes.data || [];

        // Fuzzy match specialty title
        const matchedBankMeta = banks.find((b: any) => {
          const bSpec = (b.specialty || "").toLowerCase();
          const bTitle = (b.title || "").toLowerCase();
          const search = rawSpecialty.toLowerCase();
          return (
            bSpec === search ||
            bTitle === search ||
            bSpec.includes(search) ||
            search.includes(bSpec) ||
            bTitle.includes(search) ||
            search.includes(bTitle)
          );
        });

        let loadedItems: PracticeItem[] = [];

        if (matchedBankMeta) {
          // Fetch full questions with options and explanations for this QuestionBank
          const bankDetailRes = await questionBankApi.getQuestionBankById(matchedBankMeta.id);
          const fullBank = bankDetailRes.data;

          if (fullBank?.questions && Array.isArray(fullBank.questions) && fullBank.questions.length > 0) {
            const parsedItems: PracticeItem[] = [];

            fullBank.questions.forEach((q: any, idx: number) => {
              // Distinguish EMQ vs SBA
              if (q.questionType === "EMQ" || (q.cases && Array.isArray(q.cases) && q.cases.length > 0)) {
                // Parse options
                let themeOptions: OptionItem[] = [];
                if (Array.isArray(q.options)) {
                  themeOptions = q.options.map((opt: string, optIdx: number) => ({
                    id: String.fromCharCode(65 + optIdx),
                    label: opt,
                  }));
                }

                // Parse cases
                const themeCases: EMQCase[] = (q.cases || []).map((c: any, cIdx: number) => ({
                  id: c.id || `case-${idx}-${cIdx}`,
                  caseNumber: cIdx + 1,
                  vignette: c.vignette || c.scenario || "",
                  correctOption: c.correctOption || "A",
                  explanation: c.explanation || q.explanation || "",
                }));

                parsedItems.push({
                  id: q.id || `emq-${idx}`,
                  itemType: "EMQ",
                  themeNumber: parsedItems.filter((i) => i.itemType === "EMQ").length + 1,
                  topic: fullBank.specialty || rawSpecialty,
                  subTopic: q.subTopic || fullBank.title || "Clinical Problem Solving",
                  title: q.questionText || `Theme: ${fullBank.title}`,
                  instruction: "For each case, select the single most appropriate answer from the option list.",
                  options: themeOptions,
                  cases: themeCases,
                });
              } else {
                // Standard SBA Question
                let sbaOptions: OptionItem[] = [];
                if (Array.isArray(q.options)) {
                  sbaOptions = q.options.map((opt: string, optIdx: number) => ({
                    id: String.fromCharCode(65 + optIdx),
                    label: opt,
                  }));
                }

                const correctLetter =
                  typeof q.correctAnswer === "number"
                    ? String.fromCharCode(65 + q.correctAnswer)
                    : typeof q.correctAnswer === "string"
                    ? q.correctAnswer
                    : "A";

                parsedItems.push({
                  id: q.id || `sba-${idx}`,
                  itemType: "SBA",
                  badge: fullBank.difficultyBadge || "MODERATE",
                  topic: fullBank.specialty || rawSpecialty,
                  subTopic: q.subTopic || fullBank.title || "Clinical Problem Solving",
                  vignette: q.questionText || "",
                  question: "What is the single most likely diagnosis or appropriate next step?",
                  options: sbaOptions,
                  correctOption: correctLetter,
                  explanation: q.explanation || "No explanation provided.",
                });
              }
            });

            loadedItems = parsedItems;
          }
        }

        // Fallback: If no DB questions found, fetch from overviewApi
        if (loadedItems.length === 0) {
          const overviewRes = await overviewApi.getOverviewContent();
          const clinicalTopics = overviewRes?.data?.clinical_topics?.content || [];
          const matchedTopic = clinicalTopics.find((t: any) =>
            (t.title || "").toLowerCase().includes(rawSpecialty.toLowerCase())
          );

          if (matchedTopic?.questions && Array.isArray(matchedTopic.questions)) {
            loadedItems = matchedTopic.questions.map((q: any, idx: number) => ({
              id: `ov-${idx}`,
              itemType: "SBA",
              badge: "STANDARD",
              topic: rawSpecialty,
              subTopic: matchedTopic.title,
              vignette: q.questionText || "",
              question: "What is the single most likely diagnosis?",
              options: (q.options || []).map((opt: string, oIdx: number) => ({
                id: String.fromCharCode(65 + oIdx),
                label: opt,
              })),
              correctOption: String.fromCharCode(65 + (q.correctAnswer || 0)),
              explanation: q.explanation || "Clinical reasoning per MSRA guidelines.",
            }));
          }
        }

        // Apply question type filter (SBA vs EMQ)
        if (questionTypeParam === "SBA") {
          loadedItems = loadedItems.filter((item) => item.itemType === "SBA");
        } else if (questionTypeParam === "EMQ") {
          loadedItems = loadedItems.filter((item) => item.itemType === "EMQ");
        }

        // Apply topics filter if not 'all'
        if (topicsParam !== "all") {
          loadedItems = loadedItems.filter((item) =>
            (item.subTopic || "").toLowerCase().includes(topicsParam.toLowerCase())
          );
        }

        if (isMounted) {
          setPracticeItems(loadedItems);

          // Restore saved session progress
          const saved = getSavedCPSSession(specialityParam);
          if (saved && !saved.isCompleted) {
            setUserSbaAnswers(saved.userSbaAnswers || {});
            setUserEmqAnswers(saved.userEmqAnswers || {});
            setEmqSubmitted(saved.emqSubmitted || {});
            setElapsedSeconds(saved.elapsedSeconds || 0);
            setCurrentIndex(Math.min(saved.currentIndex || 0, Math.max(0, loadedItems.length - 1)));
          }
        }
      } catch (err: any) {
        console.error("Failed to load questions:", err);
        if (isMounted) {
          setLoadError(err.message || "Could not load questions. Please check your connection.");
        }
      } finally {
        if (isMounted) {
          setLoadingQuestions(false);
        }
      }
    }

    loadQuestions();
    return () => {
      isMounted = false;
    };
  }, [specialityParam, questionTypeParam, topicsParam]);

  // Persist session progress on changes
  useEffect(() => {
    if (loadingQuestions || practiceItems.length === 0 || isSessionFinished) return;

    saveCPSSession({
      speciality: specialityParam,
      specialitySlug: specialityParam,
      questionType: questionTypeParam,
      timer: showTimer ? "on" : "off",
      topics: topicsParam,
      currentIndex,
      totalQuestions: practiceItems.length,
      userSbaAnswers,
      userEmqAnswers,
      emqSubmitted,
      flagged,
      elapsedSeconds,
      isCompleted: false,
      lastUpdated: Date.now(),
    });
  }, [
    currentIndex,
    userSbaAnswers,
    userEmqAnswers,
    emqSubmitted,
    flagged,
    elapsedSeconds,
    loadingQuestions,
    practiceItems.length,
    isSessionFinished,
    specialityParam,
    questionTypeParam,
    showTimer,
    topicsParam,
  ]);

  const currentItem = practiceItems[currentIndex];
  const isSBA = currentItem?.itemType === "SBA";
  const isEMQ = currentItem?.itemType === "EMQ";

  // Navigator list items
  const navigatorItems: NavigatorItem[] = useMemo(() => {
    return practiceItems.map((item, idx) => {
      let status: NavigatorItem["status"] = "unanswered";

      if (item.itemType === "SBA") {
        if (userSbaAnswers[idx]) {
          status = userSbaAnswers[idx] === item.correctOption ? "correct" : "wrong";
        }
      } else if (item.itemType === "EMQ") {
        if (emqSubmitted[idx]) {
          const themeAnswers = userEmqAnswers[idx] || {};
          const allCorrect = item.cases.every((c) => themeAnswers[c.id] === c.correctOption);
          status = allCorrect ? "correct" : "wrong";
        }
      }

      return {
        id: idx + 1,
        status,
        flagged: Boolean(flagged[idx]),
      };
    });
  }, [practiceItems, userSbaAnswers, userEmqAnswers, emqSubmitted, flagged]);

  // Real-time score calculation
  const scoreCalculation = useMemo(() => {
    let attempted = 0;
    let totalCorrect = 0;

    practiceItems.forEach((item, idx) => {
      if (item.itemType === "SBA") {
        if (userSbaAnswers[idx]) {
          attempted++;
          if (userSbaAnswers[idx] === item.correctOption) {
            totalCorrect++;
          }
        }
      } else if (item.itemType === "EMQ") {
        if (emqSubmitted[idx]) {
          const themeAnswers = userEmqAnswers[idx] || {};
          item.cases.forEach((c) => {
            if (themeAnswers[c.id]) {
              attempted++;
              if (themeAnswers[c.id] === c.correctOption) {
                totalCorrect++;
              }
            }
          });
        }
      }
    });

    const percent = attempted > 0 ? Math.round((totalCorrect / attempted) * 100) : 0;
    return { attempted, totalCorrect, percent };
  }, [practiceItems, userSbaAnswers, userEmqAnswers, emqSubmitted]);

  // SBA Option Selection Handler
  const handleSelectSbaOption = (optionId: string) => {
    setUserSbaAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionId,
    }));
  };

  // EMQ Option Selection Handlers
  const handlePickEmqOption = (caseId: string, optionId: string) => {
    setUserEmqAnswers((prev) => ({
      ...prev,
      [currentIndex]: {
        ...(prev[currentIndex] || {}),
        [caseId]: optionId,
      },
    }));
  };

  const handleClearEmqOption = (caseId: string) => {
    setUserEmqAnswers((prev) => {
      const updatedThemeAnswers = { ...(prev[currentIndex] || {}) };
      delete updatedThemeAnswers[caseId];
      return {
        ...prev,
        [currentIndex]: updatedThemeAnswers,
      };
    });
  };

  const handleSubmitOrNextEmq = () => {
    const isSubmitted = Boolean(emqSubmitted[currentIndex]);
    if (!isSubmitted) {
      setEmqSubmitted((prev) => ({
        ...prev,
        [currentIndex]: true,
      }));
    } else {
      handleNext();
    }
  };

  const finishSession = () => {
    saveCPSSession({
      speciality: specialityParam,
      specialitySlug: specialityParam,
      questionType: questionTypeParam,
      timer: showTimer ? "on" : "off",
      topics: topicsParam,
      currentIndex,
      totalQuestions: practiceItems.length,
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
    const nextState = !flagged[currentIndex];
    setFlagged((prev) => ({
      ...prev,
      [currentIndex]: nextState,
    }));

    if (currentItem) {
      const prompt =
        currentItem.itemType === "SBA"
          ? currentItem.question || currentItem.vignette
          : currentItem.title || "EMQ Theme";
      const qId =
        currentItem.itemType === "SBA"
          ? String(currentItem.id || `sba-${currentIndex}`)
          : String(currentItem.id || `emq-${currentIndex}`);
      const category = currentItem.topic || specialityParam || "Clinical";

      const userAnswer = userSbaAnswers[currentIndex];
      const sbaOptions =
        currentItem.itemType === "SBA" && currentItem.options
          ? currentItem.options.map((opt) => ({
              id: String(opt.id),
              label: String(opt.id),
              text: opt.label,
              isCorrect: opt.id === currentItem.correctOption || opt.label === currentItem.correctOption,
              isUserSelected: opt.id === userAnswer || opt.label === userAnswer,
            }))
          : undefined;

      toggleFlaggedQuestion(
        {
          id: qId,
          questionNumber: `Q${currentIndex + 1}`,
          prompt,
          category,
          speciality: specialityParam,
          vignette: currentItem.itemType === "SBA" ? currentItem.vignette : undefined,
          question: currentItem.itemType === "SBA" ? currentItem.question : undefined,
          options: sbaOptions,
          userAnswer,
          correctAnswer: currentItem.itemType === "SBA" ? currentItem.correctOption : undefined,
          explanation: currentItem.itemType === "SBA" ? currentItem.explanation : undefined,
        },
        nextState
      );
    }
  };

  const handleReportSubmit = (notes: string) => {
    if (notes.trim() && currentItem) {
      const activeUid = getCurrentUserId();
      saveQuestionReport({
        questionId: String(currentItem.id || `q-${currentIndex}`),
        questionNumber: `Q${currentIndex + 1}`,
        prompt:
          currentItem.itemType === "SBA"
            ? currentItem.question || currentItem.vignette
            : currentItem.title,
        category: currentItem.topic || specialityParam || "Clinical",
        speciality: specialityParam,
        userId: activeUid || "candidate",
        userEmail: "candidate@example.com",
        userName: "Candidate",
        notes: notes.trim(),
      });
      setFeedbackMessage("Issue reported successfully. Sent to Clinical Quality Team!");
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  // Header practice title
  const headerPracticeTitle = useMemo(() => {
    if (questionTypeParam === "SBA") {
      return `${specialityParam} → SBA Practice`;
    } else if (questionTypeParam === "EMQ") {
      return `${specialityParam} → EMQ Practice`;
    } else {
      return `${specialityParam} → SBA & EMQ Practice`;
    }
  }, [specialityParam, questionTypeParam]);

  // If user completed session, render dedicated Completed Results Page
  if (isSessionFinished) {
    const questionsAttempted =
      scoreCalculation.attempted > 0
        ? scoreCalculation.attempted
        : Object.keys(userSbaAnswers).length +
          Object.values(userEmqAnswers).reduce((acc, curr) => acc + Object.keys(curr).length, 0);
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
      {/* 1. TOP HEADER BAR */}
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
              <p className="text-xs sm:text-sm text-slate-500">Preparing your practice session</p>
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
            {/* Left Column: QUESTION NAVIGATOR */}
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
              {isSBA && (
                <ClinicalSbaCard
                  question={currentItem as SBAQuestion}
                  currentIndex={currentIndex}
                  totalQuestions={practiceItems.length}
                  selectedAnswer={userSbaAnswers[currentIndex]}
                  isFlagged={Boolean(flagged[currentIndex])}
                  onSelectOption={handleSelectSbaOption}
                  onToggleFlag={handleToggleFlag}
                  onReportIssue={() => setReportModalOpen(true)}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              )}

              {isEMQ && (
                <ClinicalEmqCard
                  theme={currentItem as EMQTheme}
                  currentIndex={currentIndex}
                  totalQuestions={practiceItems.length}
                  answers={userEmqAnswers[currentIndex] || {}}
                  isSubmitted={Boolean(emqSubmitted[currentIndex])}
                  isFlagged={Boolean(flagged[currentIndex])}
                  onOpenOptionPicker={(caseId) =>
                    setActiveEmqPicker({ themeIndex: currentIndex, caseId })
                  }
                  onClearOption={handleClearEmqOption}
                  onToggleFlag={handleToggleFlag}
                  onReportIssue={() => setReportModalOpen(true)}
                  onPrevious={handlePrevious}
                  onSubmitOrNext={handleSubmitOrNextEmq}
                />
              )}
            </section>
          </div>
        )}
      </main>

      {/* MODAL 1: EMQ OPTION PICKER */}
      {activeEmqPicker && isEMQ && (
        <EmqOptionPickerModal
          isOpen={Boolean(activeEmqPicker)}
          onClose={() => setActiveEmqPicker(null)}
          options={(currentItem as EMQTheme).options}
          currentSelectedId={userEmqAnswers[currentIndex]?.[activeEmqPicker.caseId]}
          onSelectOption={(optionId) => handlePickEmqOption(activeEmqPicker.caseId, optionId)}
          caseNumber={
            (currentItem as EMQTheme).cases.find((c) => c.id === activeEmqPicker.caseId)
              ?.caseNumber
          }
        />
      )}

      {/* MODAL 2: END PRACTICE SESSION */}
      <EndSessionModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmEnd={finishSession}
        answeredCount={scoreCalculation.attempted}
        totalCount={practiceItems.length}
        examType="CPS"
      />

      {/* MODAL 3: REPORT ISSUE */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        description="Found an inaccuracy in this question or explanation? Your feedback helps improve clinical accuracy."
      />
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
