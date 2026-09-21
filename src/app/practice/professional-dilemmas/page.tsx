"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Clock,
  BookOpen,
  Loader2,
} from "lucide-react";
import { questionBankApi } from "@/services/questionBankApi";
import { QuestionNavigator, NavigatorItem } from "../_components/QuestionNavigator";
import { ExamResultView } from "../_components/ExamResultView";
import { ReportIssueModal } from "../_components/ReportIssueModal";
import { EndSessionModal } from "../_components/EndSessionModal";
import { PDRankingCard } from "./_components/PDRankingCard";
import { PDSelect3Card } from "./_components/PDSelect3Card";
import {
  getSavedPDSession,
  savePDSession,
  markPDSessionCompleted,
  clearPDSession,
  formatAverageTime,
  toggleFlaggedQuestion,
  saveQuestionReport,
  getCurrentUserId,
} from "@/lib/practiceSession";

// ========================================================
// DATA TYPES & INTERFACES
// ========================================================
export interface PDOption {
  id: string; // "A", "B", "C", "D", "E" (or up to "H" for Select-3)
  label: string;
  idealRank?: number; // 1 to 5 for ranking
}

export interface PDQuestion {
  id: string;
  vignette: string;
  instruction: string;
  options: PDOption[];
  type: "RANKING" | "SELECT_3";
  domain: string;
  subTopic: string;
  idealOrder?: string[]; // e.g. ["B", "E", "C", "A", "D"]
  correctAnswers?: string[]; // e.g. ["B", "F", "H"]
  explanation?: string;
  references?: string;
  peerStats?: Record<string, number>;
}

// GMC Concordance Matrix Scoring
const CONCORDANCE_MATRIX: Record<number, number[]> = {
  1: [20, 16, 8, 2, 0],
  2: [16, 20, 16, 8, 2],
  3: [8, 16, 20, 16, 8],
  4: [2, 8, 16, 20, 16],
  5: [0, 2, 8, 16, 20],
};

function calculateRankingScore(userOrder: string[], idealOrder: string[]): number {
  if (!idealOrder || idealOrder.length === 0 || !userOrder || userOrder.length === 0) return 100;
  let totalPoints = 0;
  userOrder.forEach((optId, userIndex) => {
    const userRank = userIndex + 1;
    const idealIndex = idealOrder.indexOf(optId);
    if (idealIndex !== -1) {
      const idealRank = idealIndex + 1;
      const points = CONCORDANCE_MATRIX[idealRank]?.[userRank - 1] ?? 0;
      totalPoints += points;
    }
  });
  return Math.min(100, Math.round(totalPoints));
}

function calculateSelect3Score(userSelections: string[], correctAnswers: string[]): number {
  if (!correctAnswers || correctAnswers.length === 0) return 100;
  let matchCount = 0;
  userSelections.forEach((optId) => {
    if (correctAnswers.includes(optId)) {
      matchCount++;
    }
  });
  return Math.round((matchCount / 3) * 100);
}

function ProfessionalDilemmasPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTopic = searchParams.get("topic") || searchParams.get("domain") || "coping-with-pressure";
  const timerSetting = searchParams.get("timer") !== "off";
  const modeParam = searchParams.get("mode") || "all";
  const typeParam = searchParams.get("type") || "all"; // "ranking" | "select_3" | "all"

  // State
  const [questions, setQuestions] = useState<PDQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User responses
  const [userRankings, setUserRankings] = useState<Record<number, string[]>>({});
  const [userSelections, setUserSelections] = useState<Record<number, string[]>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [questionScores, setQuestionScores] = useState<Record<number, number>>({});

  // Session & UI state
  const [timeRemaining, setTimeRemaining] = useState(45 * 60);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Fetch Questions from DB
  useEffect(() => {
    let isMounted = true;

    async function loadPDQuestions() {
      try {
        setLoading(true);

        const banksRes = await questionBankApi.getQuestionBanks();
        const banks = banksRes.data || [];

        const normalizedTopic = rawTopic.toLowerCase().replace(/[-_]/g, " ");

        const matchedBank = banks.find((b: any) => {
          const title = (b.title || "").toLowerCase();
          const spec = (b.specialty || "").toLowerCase();
          return (
            title.includes(normalizedTopic) ||
            spec.includes(normalizedTopic) ||
            normalizedTopic.includes(title)
          );
        });

        if (matchedBank) {
          const detailRes = await questionBankApi.getQuestionBankById(matchedBank.id);
          const fullBank = detailRes.data;

          if (fullBank?.questions && Array.isArray(fullBank.questions) && fullBank.questions.length > 0) {
            let parsedList: PDQuestion[] = fullBank.questions.map((q: any, idx: number) => {
              const cases = q.cases || {};
              const qType = q.questionType === "RANKING" ? "RANKING" : "SELECT_3";

              let parsedOptions: PDOption[] = [];
              if (Array.isArray(q.options)) {
                parsedOptions = q.options.map((optText: string, oIdx: number) => ({
                  id: String.fromCharCode(65 + oIdx),
                  label: optText,
                  idealRank: cases.idealOrder ? cases.idealOrder.indexOf(String.fromCharCode(65 + oIdx)) + 1 : undefined,
                }));
              }

              return {
                id: q.id || `pd-q-${idx}`,
                vignette: q.questionText || "",
                instruction: cases.instruction || (qType === "RANKING"
                  ? "Rank in order the following actions in response to this situation (1= Most appropriate; 5= Least appropriate):"
                  : "Choose the THREE most appropriate actions to take in this situation:"),
                options: parsedOptions,
                type: qType,
                domain: fullBank.title || "Professional Dilemmas",
                subTopic: q.subTopic || fullBank.title,
                idealOrder: cases.idealOrder || ["A", "B", "C", "D", "E"],
                correctAnswers: cases.correctAnswers || ["A", "B", "C"],
                explanation: q.explanation || "",
                references: cases.references || "GMC Good Medical Practice Guidelines",
                peerStats: cases.peerStats || undefined,
              };
            });

            // Filter by type if requested
            if (typeParam === "ranking") {
              parsedList = parsedList.filter((q) => q.type === "RANKING");
            } else if (typeParam === "select_3") {
              parsedList = parsedList.filter((q) => q.type === "SELECT_3");
            }

            if (isMounted) {
              setQuestions(parsedList);

              // Restore saved session
              const saved = getSavedPDSession(rawTopic);
              if (saved && !saved.isCompleted) {
                setUserRankings(saved.userRankings || {});
                setUserSelections(saved.userSelections || {});
                setSubmittedAnswers(saved.submittedAnswers || {});
                setQuestionScores(saved.questionScores || {});
                setTimeRemaining(Math.max(0, 45 * 60 - (saved.elapsedSeconds || 0)));
                setCurrentIndex(Math.min(saved.currentIndex || 0, Math.max(0, parsedList.length - 1)));
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load Professional Dilemmas practice items:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPDQuestions();
    return () => {
      isMounted = false;
    };
  }, [rawTopic, typeParam]);

  // Timer countdown
  useEffect(() => {
    if (!timerSetting || isSessionFinished || loading) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSessionFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerSetting, isSessionFinished, loading]);

  // Persist session
  const persistSession = (overrides = {}) => {
    savePDSession({
      domain: currentQ?.domain || rawTopic,
      domainSlug: rawTopic,
      questionType: typeParam,
      timer: timerSetting ? "on" : "off",
      topics: "all",
      currentIndex,
      totalQuestions: questions.length,
      userRankings,
      userSelections,
      submittedAnswers,
      questionScores,
      flagged,
      elapsedSeconds: Math.max(0, 45 * 60 - timeRemaining),
      isCompleted: isSessionFinished,
      lastUpdated: Date.now(),
      ...overrides,
    });
  };

  const currentQ = questions[currentIndex] || {
    id: "default",
    vignette: "Loading dilemma...",
    instruction: "",
    options: [],
    type: "RANKING",
    domain: "Professional Dilemmas",
    subTopic: "Practice Scenario",
  };

  const isRanking = currentQ.type === "RANKING";
  const isSubmitted = Boolean(submittedAnswers[currentIndex]);

  // Active ranking sequence
  const currentRankOrder = useMemo(() => {
    if (userRankings[currentIndex]) {
      return userRankings[currentIndex];
    }
    return currentQ.options.map((o) => o.id);
  }, [userRankings, currentIndex, currentQ.options]);

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isSubmitted) return;
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (isSubmitted) return;
    const draggedId = e.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;

    const newOrder = [...currentRankOrder];
    const fromIndex = newOrder.indexOf(draggedId);
    const toIndex = newOrder.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, draggedId);
      setUserRankings((prev) => ({
        ...prev,
        [currentIndex]: newOrder,
      }));
    }
  };

  const moveRank = (index: number, direction: "up" | "down") => {
    if (isSubmitted) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= currentRankOrder.length) return;

    const newOrder = [...currentRankOrder];
    const [item] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, item);

    setUserRankings((prev) => ({
      ...prev,
      [currentIndex]: newOrder,
    }));
  };

  // Select-3 toggle
  const currentSelections = userSelections[currentIndex] || [];
  const handleToggleSelect3 = (optionId: string) => {
    if (isSubmitted) return;
    let next: string[];
    if (currentSelections.includes(optionId)) {
      next = currentSelections.filter((id) => id !== optionId);
    } else {
      if (currentSelections.length >= 3) {
        setFeedbackMessage("You can only select up to 3 options.");
        setTimeout(() => setFeedbackMessage(null), 3000);
        return;
      }
      next = [...currentSelections, optionId];
    }
    setUserSelections((prev) => ({
      ...prev,
      [currentIndex]: next,
    }));
  };

  // Submit answer
  const handleSubmitAnswer = () => {
    let score = 0;
    if (isRanking) {
      score = calculateRankingScore(currentRankOrder, currentQ.idealOrder || []);
    } else {
      score = calculateSelect3Score(currentSelections, currentQ.correctAnswers || []);
    }

    setSubmittedAnswers((prev) => ({ ...prev, [currentIndex]: true }));
    setQuestionScores((prev) => ({ ...prev, [currentIndex]: score }));

    persistSession({
      submittedAnswers: { ...submittedAnswers, [currentIndex]: true },
      questionScores: { ...questionScores, [currentIndex]: score },
    });
  };

  const handleNext = () => {
    if (!isSubmitted) {
      handleSubmitAnswer();
      return;
    }
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      persistSession({ currentIndex: nextIdx });
    } else {
      finishSession();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      persistSession({ currentIndex: prevIdx });
    }
  };

  const finishSession = () => {
    setIsSessionFinished(true);
    markPDSessionCompleted(rawTopic);
    setShowExitModal(false);
    persistSession({ isCompleted: true });
  };

  // Flag toggle
  const handleToggleFlag = () => {
    const nextState = !flagged[currentIndex];
    setFlagged((prev) => ({ ...prev, [currentIndex]: nextState }));

    if (currentQ) {
      toggleFlaggedQuestion(
        {
          id: String(currentQ.id),
          questionNumber: `Q${currentIndex + 1}`,
          prompt: currentQ.vignette || currentQ.instruction,
          category: currentQ.domain || "Professional Dilemmas",
          speciality: "Professional Dilemmas",
          vignette: currentQ.vignette,
          question: currentQ.instruction,
          options: currentQ.options.map((opt) => ({
            id: opt.id,
            label: opt.id,
            text: opt.label,
          })),
          explanation: currentQ.explanation,
        },
        nextState
      );
    }
  };

  const handleReportSubmit = (notes: string) => {
    if (notes.trim() && currentQ) {
      const activeUid = getCurrentUserId();
      saveQuestionReport({
        questionId: String(currentQ.id),
        questionNumber: `Q${currentIndex + 1}`,
        prompt: currentQ.vignette || currentQ.instruction,
        category: currentQ.domain || "Professional Dilemmas",
        speciality: "Professional Dilemmas",
        userId: activeUid || "candidate",
        userEmail: "candidate@example.com",
        userName: "Candidate",
        notes: notes.trim(),
      });
      setFeedbackMessage("Issue reported successfully. Sent to Clinical Quality Team!");
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  // Format countdown
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Navigator items
  const navigatorItems: NavigatorItem[] = questions.map((q, idx) => {
    const isAns = Boolean(submittedAnswers[idx]);
    const score = questionScores[idx];
    let status: "correct" | "wrong" | "flagged" | "unanswered" = "unanswered";

    if (flagged[idx]) {
      status = "flagged";
    } else if (isAns) {
      status = score && score >= 70 ? "correct" : "wrong";
    }

    return {
      id: q.id,
      label: `Question ${idx + 1}`,
      subTopic: q.subTopic || `Scenario ${idx + 1}`,
      status,
    };
  });

  // Results View
  if (isSessionFinished) {
    const answeredCount = Object.keys(submittedAnswers).length;
    const totalScoreSum = Object.values(questionScores).reduce((a, b) => a + b, 0);
    const avgScore = answeredCount > 0 ? Math.round(totalScoreSum / answeredCount) : 0;
    const timeSpent = 45 * 60 - timeRemaining;
    const avgSecPerQ = answeredCount > 0 ? Math.round(timeSpent / answeredCount) : 0;

    return (
      <ExamResultView
        specialtyOrTitle={currentQ?.domain || rawTopic}
        overallAccuracy={avgScore}
        questionsAttempted={answeredCount > 0 ? answeredCount : questions.length}
        averageTime={formatAverageTime(avgSecPerQ)}
        returnUrl="/dashboard/professional-dilemmas"
        onRetake={() => {
          clearPDSession(rawTopic);
          setSubmittedAnswers({});
          setUserRankings({});
          setUserSelections({});
          setQuestionScores({});
          setFlagged({});
          setTimeRemaining(45 * 60);
          setCurrentIndex(0);
          setIsSessionFinished(false);
          setShowExitModal(false);
        }}
        examType="PD"
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#edf0f4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#1D82EB]" />
          <p className="text-sm font-semibold text-slate-600">Loading Professional Dilemmas Practice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf0f4] text-slate-800 flex flex-col font-sans">
      {/* 1. Header Bar */}
      <header className="bg-[#082138] text-white border-b border-[#152e4a] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1568px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#113150] border border-[#1f4770] flex items-center justify-center text-cyan-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-tight">
              <span className="text-slate-300">Professional Dilemmas</span>
              <span className="text-slate-500">→</span>
              <span className="text-white">
                {isRanking ? "Ranking Practice" : "Select-3 Practice"}
              </span>
            </div>
          </div>

          {timerSetting && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0c2842] border border-[#1a4168] text-white text-xs sm:text-sm font-mono font-bold shadow-2xs">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{formatCountdown(timeRemaining)}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="text-xs sm:text-sm text-slate-300 font-medium hidden sm:block">
              Question <span className="font-bold text-white">{currentIndex + 1}</span> of{" "}
              <span className="text-slate-400">{questions.length}</span>
            </div>
            <button
              onClick={() => setShowExitModal(true)}
              className="px-4 py-1.5 rounded-full bg-[#E11D48] hover:bg-[#be123c] text-white font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              End Session
            </button>
          </div>
        </div>
      </header>

      {/* Floating Feedback Alert */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-from-top-2">
          {feedbackMessage}
        </div>
      )}

      {/* 2. Main Practice Layout */}
      <main className="flex-1 max-w-[1568px] w-full mx-auto p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Navigator */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E0E4EA] shadow-2xs">
              <QuestionNavigator
                totalQuestions={questions.length}
                currentIndex={currentIndex}
                items={navigatorItems}
                onSelectQuestion={(idx) => setCurrentIndex(idx)}
                title="NAVIGATOR FOR QUESTIONS"
                layout="list"
              />
            </div>
          </div>

          {/* Right Column: Question Content */}
          <div className="lg:col-span-3 space-y-6">
            {isRanking ? (
              <PDRankingCard
                question={currentQ}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                currentRankOrder={currentRankOrder}
                isSubmitted={isSubmitted}
                score={questionScores[currentIndex]}
                isFlagged={Boolean(flagged[currentIndex])}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMoveRank={moveRank}
                onToggleFlag={handleToggleFlag}
                onReportIssue={() => setReportModalOpen(true)}
                onPrevious={handlePrevious}
                onSubmitOrNext={handleNext}
              />
            ) : (
              <PDSelect3Card
                question={currentQ}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                selectedOptions={currentSelections}
                isSubmitted={isSubmitted}
                score={questionScores[currentIndex]}
                isFlagged={Boolean(flagged[currentIndex])}
                onToggleOption={handleToggleSelect3}
                onToggleFlag={handleToggleFlag}
                onReportIssue={() => setReportModalOpen(true)}
                onPrevious={handlePrevious}
                onSubmitOrNext={handleNext}
              />
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: REPORT ISSUE MODAL */}
      <ReportIssueModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        description="Found an inaccuracy in this professional dilemma or rationale? Your report helps maintain GMC fidelity."
      />

      {/* MODAL 2: END SESSION MODAL */}
      <EndSessionModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirmEnd={finishSession}
        answeredCount={Object.keys(submittedAnswers).length}
        totalCount={questions.length}
        examType="PD"
      />
    </div>
  );
}

export default function ProfessionalDilemmasPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">Loading Professional Dilemmas Practice...</div>
      }
    >
      <ProfessionalDilemmasPracticeContent />
    </Suspense>
  );
}
