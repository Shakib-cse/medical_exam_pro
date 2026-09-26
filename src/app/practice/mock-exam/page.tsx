"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Check,
  X,
  CheckCircle2,
  Stethoscope,
  Layers,
  BookOpen,
  Coffee,
  ArrowRight,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { mockExamApi, MockQuestion, MockExamDetail } from "@/services/mockExamApi";
import { ClinicalSbaCard } from "../clinical/_components/ClinicalSbaCard";
import { ClinicalEmqCard } from "../clinical/_components/ClinicalEmqCard";
import { EmqOptionPickerModal } from "../clinical/_components/EmqOptionPickerModal";
import { PDSelect3Card } from "../professional-dilemmas/_components/PDSelect3Card";
import { PDRankingCard } from "../professional-dilemmas/_components/PDRankingCard";
import { EndSessionModal } from "../_components/EndSessionModal";
import { ReportIssueModal } from "../_components/ReportIssueModal";
import { ExamResultView } from "../_components/ExamResultView";
import {
  formatAverageTime,
  toggleFlaggedQuestion,
  saveQuestionReport,
  getFlaggedQuestions,
  getCurrentUserId,
  saveMockSession,
  getMockSession,
  clearMockSession,
  markMockSessionCompleted,
} from "@/lib/practiceSession";

function MockExamPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockIdParam = searchParams.get("mockId") || "1";
  const modeParam = searchParams.get("mode");

  // Data states
  const [examDetail, setExamDetail] = useState<MockExamDetail | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  // Exam progress states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakSecondsLeft, setBreakSecondsLeft] = useState(300); // 5-minute break
  const [examSecondsLeft, setExamSecondsLeft] = useState(120 * 60); // 120-minute MSRA mock
  const [examSubmitted, setExamSubmitted] = useState(false);

  // User responses
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  // Modals & Feedback
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [optionPickerOpen, setOptionPickerOpen] = useState(false);
  const [activeEmqCase, setActiveEmqCase] = useState<{ id: string; caseNumber: number } | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Drag-and-drop state for Ranking
  const [draggedOptionId, setDraggedOptionId] = useState<string | null>(null);

  // Fetch Mock Exam & Start Attempt
  useEffect(() => {
    let mounted = true;
    async function loadMockData() {
      try {
        setLoading(true);
        const res = await mockExamApi.getMockExamById(mockIdParam);
        if (mounted && res?.data?.questions) {
          setExamDetail(res.data);
          const sorted = [...res.data.questions].sort((a, b) => a.order - b.order);
          setQuestions(sorted);

          const totalDuration = (res.data.durationMinutes || 120) * 60;
          setExamSecondsLeft(totalDuration);

          // 1. Sync previously flagged questions strictly for this mock question
          const activeUid = getCurrentUserId();
          const globalFlagged = getFlaggedQuestions(activeUid);
          const initialFlagged: Record<string, boolean> = {};
          sorted.forEach((q) => {
            const isFl = globalFlagged.some((f) => f.id === String(q.id));
            if (isFl) {
              initialFlagged[q.id] = true;
            }
          });

          // 2. Check for active saved session unless explicit retake
          if (modeParam === "retake") {
            clearMockSession(mockIdParam, activeUid);
            setUserAnswers({});
            setFlagged(initialFlagged);
          } else {
            const saved = getMockSession(mockIdParam, activeUid);
            if (saved && !saved.isCompleted) {
              const restoredAnswers: Record<string, any> = { ...(saved.userAnswers || {}) };
              const cpsCount = sorted.filter((q) => q.section === "CPS").length;
              // Clean out any stale auto-generated default ranking answers from older sessions
              if ((saved.currentIndex || 0) < cpsCount) {
                sorted.forEach((q) => {
                  if (q.questionType === "RANKING") {
                    delete restoredAnswers[q.id];
                  }
                });
              }
              setUserAnswers(restoredAnswers);
              setFlagged({ ...initialFlagged, ...(saved.flagged || {}) });
              setCurrentIndex(saved.currentIndex || 0);
              setIsBreakActive(saved.isBreakActive || false);
              if (typeof saved.breakSecondsLeft === "number") {
                setBreakSecondsLeft(saved.breakSecondsLeft);
              }
              if (typeof saved.examSecondsLeft === "number") {
                setExamSecondsLeft(saved.examSecondsLeft);
              }
            } else {
              setUserAnswers({});
              setFlagged(initialFlagged);
            }
          }
        }


        // Try start attempt on backend if authenticated
        try {
          const startRes = await mockExamApi.startExam(mockIdParam);
          if (mounted && startRes?.data?.id) {
            setAttemptId(startRes.data.id);
          }
        } catch {
          // Local/demo preview mode
        }
      } catch (err) {
        console.error("Failed to load mock exam:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMockData();
    return () => {
      mounted = false;
    };
  }, [mockIdParam, modeParam]);

  // Persist In-Progress Mock Session Dynamically
  useEffect(() => {
    if (loading || examSubmitted || !mockIdParam || questions.length === 0) return;
    const activeUid = getCurrentUserId();
    saveMockSession(
      {
        mockId: mockIdParam,
        mockTitle: examDetail?.title || "Mock Exam",
        currentIndex,
        totalQuestions: questions.length,
        userAnswers,
        flagged,
        isBreakActive,
        breakSecondsLeft,
        examSecondsLeft,
        isCompleted: false,
        lastUpdated: Date.now(),
      },
      activeUid
    );
  }, [
    currentIndex,
    userAnswers,
    flagged,
    isBreakActive,
    breakSecondsLeft,
    examSecondsLeft,
    loading,
    examSubmitted,
    mockIdParam,
    examDetail?.title,
    questions.length,
  ]);

  // Exam Countdown Timer
  useEffect(() => {
    if (examSubmitted || isBreakActive || loading) return;
    const timer = setInterval(() => {
      setExamSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examSubmitted, isBreakActive, loading]);

  // 5-Minute Break Countdown Timer
  useEffect(() => {
    if (!isBreakActive || examSubmitted) return;
    const breakTimer = setInterval(() => {
      setBreakSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(breakTimer);
          // Auto-start PD section when break timer ends
          handleContinueFromBreak();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(breakTimer);
  }, [isBreakActive, examSubmitted]);

  // Section divisions: CPS questions vs PD questions
  const cpsQuestions = questions.filter((q) => q.section === "CPS");
  const pdQuestions = questions.filter((q) => q.section === "PD");
  const lastCpsIndex = cpsQuestions.length > 0 ? cpsQuestions.length - 1 : 47;
  const firstPdIndex = cpsQuestions.length;

  const currentQ = questions[currentIndex] || questions[0];

  // Handlers for Question Answering
  const handleSelectSba = (optId: string) => {
    if (examSubmitted || !currentQ) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleSelectEmqOption = (caseId: string, optId: string) => {
    if (examSubmitted || !currentQ) return;
    setUserAnswers((prev) => ({
      ...prev,
      [`${currentQ.id}_case_${caseId}`]: optId,
    }));
  };

  const handleClearEmqOption = (caseId: string) => {
    if (examSubmitted || !currentQ) return;
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[`${currentQ.id}_case_${caseId}`];
      return copy;
    });
  };

  const handleToggleSelect3 = (letter: string) => {
    if (examSubmitted || !currentQ) return;
    const currentList: string[] = userAnswers[currentQ.id] || [];
    if (currentList.includes(letter)) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: currentList.filter((l) => l !== letter),
      }));
    } else {
      if (currentList.length < 3) {
        setUserAnswers((prev) => ({
          ...prev,
          [currentQ.id]: [...currentList, letter],
        }));
      }
    }
  };

  const handleMoveRankingRank = (index: number, direction: "up" | "down") => {
    if (examSubmitted || !currentQ) return;
    const currentOrder: string[] = [...(userAnswers[currentQ.id] || ["A", "B", "C", "D", "E"])];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: currentOrder }));
  };

  const handleDropRanking = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (examSubmitted || !currentQ || !draggedOptionId) return;
    const currentOrder: string[] = [...(userAnswers[currentQ.id] || ["A", "B", "C", "D", "E"])];
    const fromIdx = currentOrder.indexOf(draggedOptionId);
    const toIdx = currentOrder.indexOf(targetId);
    if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
      currentOrder.splice(fromIdx, 1);
      currentOrder.splice(toIdx, 0, draggedOptionId);
      setUserAnswers((prev) => ({ ...prev, [currentQ.id]: currentOrder }));
    }
    setDraggedOptionId(null);
  };

  // Flag toggle handler with dynamic global persistence & API sync
  const handleToggleFlag = () => {
    if (!currentQ) return;
    const nextState = !flagged[currentQ.id];
    setFlagged((prev) => ({ ...prev, [currentQ.id]: nextState }));

    const activeUid = getCurrentUserId();
    const prompt = currentQ.vignette || currentQ.questionText || "Mock Question";
    const qId = String(currentQ.id);
    const category = currentQ.section === "CPS" ? "Clinical Problem Solving" : "Professional Dilemmas";
    const speciality = examDetail?.title || "MSRA Mock Exam";

    let sbaOptions: any = undefined;
    if (currentQ.options) {
      sbaOptions = currentQ.options.map((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const cleanLabel = opt.replace(/^[A-H]\.\s*/, "");
        return {
          id: letter,
          label: letter,
          text: cleanLabel,
          isCorrect: currentQ.correctOption === letter,
          isUserSelected: userAnswers[currentQ.id] === letter,
        };
      });
    }

    toggleFlaggedQuestion(
      {
        id: qId,
        questionNumber: `Q${currentIndex + 1}`,
        prompt,
        category,
        speciality,
        vignette: currentQ.vignette,
        question: currentQ.questionText,
        options: sbaOptions,
        userAnswer: userAnswers[currentQ.id],
        correctAnswer: currentQ.correctOption || (currentQ.correctAnswers ? currentQ.correctAnswers.join(", ") : undefined),
        explanation: currentQ.explanation,
      },
      nextState,
      activeUid
    );

    setFeedbackMessage(nextState ? "Question flagged for review" : "Flag removed");
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  // Issue reporting handler with dynamic global persistence & API sync
  const handleReportSubmit = (notes: string) => {
    if (notes.trim() && currentQ) {
      const activeUid = getCurrentUserId();
      saveQuestionReport({
        questionId: String(currentQ.id),
        questionNumber: `Q${currentIndex + 1}`,
        prompt: currentQ.vignette || currentQ.questionText || "Mock Exam Question",
        category: currentQ.section === "CPS" ? "Clinical Problem Solving" : "Professional Dilemmas",
        speciality: examDetail?.title || "MSRA Mock Exam",
        userId: activeUid || "candidate",
        userEmail: "candidate@example.com",
        userName: "Candidate",
        notes: notes.trim(),
      });
      setShowReportModal(false);
      setFeedbackMessage("Issue reported successfully. Sent to Clinical Quality Team!");
      setTimeout(() => setFeedbackMessage(null), 3500);
    }
  };

  // Navigation Logic
  const handleNext = () => {
    // If candidate is on a RANKING question and clicks Submit Answer without reordering, record the current order
    if (currentQ?.questionType === "RANKING" && !userAnswers[currentQ.id]) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: ["A", "B", "C", "D", "E"],
      }));
    }

    // If on the last question of CPS, transition to 5-minute break screen!
    if (currentIndex === lastCpsIndex && !isBreakActive) {
      setIsBreakActive(true);
      return;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowEndSessionModal(true);
    }
  };


  const handlePrevious = () => {
    if (isBreakActive) {
      setIsBreakActive(false);
      setCurrentIndex(lastCpsIndex);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleContinueFromBreak = () => {
    setIsBreakActive(false);
    setCurrentIndex(firstPdIndex);
  };

  // Score Calculation and Submission
  const handleFinalSubmit = async () => {
    setShowEndSessionModal(false);
    setExamSubmitted(true);

    const totalCount = totalPossible || questions.length || 115;
    const correctCount = Math.round(totalEarned);
    const incorrectCount = Math.max(0, totalCount - correctCount);

    const activeUid = getCurrentUserId();
    markMockSessionCompleted(mockIdParam, overallAccuracy, activeUid, {
      totalQuestions: totalCount,
      correct: correctCount,
      incorrect: incorrectCount,
    });
    clearMockSession(mockIdParam, activeUid);

    if (attemptId) {
      try {
        const elapsed = Math.max(0, (examDetail?.durationMinutes || 120) * 60 - examSecondsLeft);
        await mockExamApi.submitExam(attemptId, {
          userAnswers,
          timeTakenSeconds: elapsed,
        });
      } catch (err) {
        console.warn("Could not save attempt result:", err);
      }
    }
  };

  // Calculate scores
  let totalPossible = 0;
  let totalEarned = 0;
  questions.forEach((q) => {
    if (q.questionType === "SBA") {
      totalPossible += 1;
      const ans = userAnswers[q.id];
      if (ans && (ans === q.correctOption || ans === String.fromCharCode(65 + q.correctAnswer))) {
        totalEarned += 1;
      }
    } else if (q.questionType === "EMQ") {
      const cases = q.cases || [];
      totalPossible += cases.length || 1;
      cases.forEach((c) => {
        const caseAns = userAnswers[`${q.id}_case_${c.id || c.caseNumber}`];
        if (caseAns && caseAns === c.correctOption) {
          totalEarned += 1;
        }
      });
    } else if (q.questionType === "SELECT_3") {
      totalPossible += 3;
      const selected: string[] = userAnswers[q.id] || [];
      const correctList: string[] = q.correctAnswers || [];
      selected.forEach((letter) => {
        if (correctList.includes(letter)) {
          totalEarned += 1;
        }
      });
    } else if (q.questionType === "RANKING") {
      totalPossible += 1;
      const order: string[] = userAnswers[q.id] || [];
      const ideal: string[] = q.idealOrder || [];
      if (ideal.length > 0 && order.length === ideal.length) {
        let matchCount = 0;
        ideal.forEach((letter, idx) => {
          if (order[idx] === letter) matchCount += 1;
        });
        if (matchCount === ideal.length) totalEarned += 1;
        else if (matchCount >= 3) totalEarned += 0.6;
      }
    }
  });

  const overallAccuracy = Math.round((totalEarned / (totalPossible || 1)) * 100);
  const answeredCount = questions.filter((q) => {
    if (q.questionType === "SBA") {
      return Boolean(userAnswers[q.id]);
    } else if (q.questionType === "EMQ") {
      const cases = q.cases || [];
      return cases.length > 0
        ? cases.some((c) => Boolean(userAnswers[`${q.id}_case_${c.id || c.caseNumber}`]))
        : Boolean(userAnswers[q.id]);
    } else if (q.questionType === "SELECT_3") {
      const sel = userAnswers[q.id];
      return Array.isArray(sel) && sel.length > 0;
    } else if (q.questionType === "RANKING") {
      return Boolean(userAnswers[q.id]);
    }
    return false;
  }).length;


  // Format Helper
  const formatTimer = (seconds: number) => {
    const safe = Math.max(0, seconds);
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // If exam submitted, show final result
  if (examSubmitted) {
    const elapsedSec = Math.max(0, (examDetail?.durationMinutes || 120) * 60 - examSecondsLeft);
    const avgSec = answeredCount > 0 ? Math.round(elapsedSec / answeredCount) : 0;
    const averageTimeString = formatAverageTime(avgSec);
    const totalCount = totalPossible || questions.length || 115;
    const correctCount = Math.round(totalEarned);
    const incorrectCount = Math.max(0, totalCount - correctCount);

    return (
      <ExamResultView
        specialtyOrTitle={examDetail?.title || "MSRA Mock Exam"}
        overallAccuracy={overallAccuracy}
        questionsAttempted={answeredCount}
        totalQuestions={totalCount}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
        averageTime={averageTimeString}
        returnUrl="/dashboard/mock-exams"
        onRetake={() => {
          const activeUid = getCurrentUserId();
          clearMockSession(mockIdParam, activeUid);
          setUserAnswers({});
          setFlagged({});
          setExamSecondsLeft((examDetail?.durationMinutes || 120) * 60);
          setBreakSecondsLeft(300);
          setIsBreakActive(false);
          setCurrentIndex(0);
          setExamSubmitted(false);
        }}
        examType="Mock"
      />
    );
  }

  // Loading Skeleton
  if (loading || !currentQ) {
    return (
      <div className="min-h-screen bg-[#edf0f4] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading MSRA Mock Exam...</p>
      </div>
    );
  }

  // Break Countdown Circle Dimensions
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const breakStrokeDashoffset = circumference * (1 - breakSecondsLeft / 300);

  return (
    <div className="min-h-screen bg-[#edf0f4] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {feedbackMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#082138] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xl border border-cyan-500/40 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* 1. Header (Matching Screenshot 2) */}
      <header className="bg-[#082138] text-white border-b border-[#14324f] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Exit Link, Icon & Exam Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/mock-exams"
              className="p-1.5 rounded-lg bg-[#0E3456] hover:bg-[#154673] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Mock Exams Dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div className="w-8 h-8 rounded-lg bg-[#0E3456] border border-[#1A4B75] flex items-center justify-center text-cyan-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>

            <div>
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug">
                {examDetail?.title || "Mock Exam"}
              </h1>
              <span className="text-[11px] font-medium text-slate-400">
                {isBreakActive
                  ? "Section Break (5 minutes)"
                  : `${currentQ.section} • Question ${currentIndex + 1} of ${questions.length}`}
              </span>
            </div>
          </div>

          {/* Right: Section Timer & End Session Button */}
          <div className="flex items-center gap-3">
            {!isBreakActive && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
                  examSecondsLeft < 300
                    ? "bg-rose-950/80 border-rose-600 text-rose-400 animate-pulse"
                    : "bg-[#0E3456] border-[#1A4B75] text-cyan-300"
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatTimer(examSecondsLeft)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowEndSessionModal(true)}
              className="px-4 py-2 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            >
              End Session
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Exam Body with Left Navigator and Content */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Left Navigator Sidebar (Matching Screenshot 2) */}
        <aside className="w-full lg:w-[320px] bg-white rounded-2xl p-5 sm:p-6 border border-[#E0E4EA] shadow-xs shrink-0 max-h-[calc(100vh-120px)] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              NAVIGATOR FOR QUESTIONS
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              {answeredCount}/{questions.length}
            </span>
          </div>

          <div className="space-y-1.5 overflow-y-auto pr-1 pt-3 flex-1">
            {/* CPS Section Questions */}
            {cpsQuestions.map((q, idx) => {
              const isCurrent = !isBreakActive && currentIndex === idx;
              const isFlag = Boolean(flagged[q.id]);
              let isAns = false;
              if (q.questionType === "SBA") {
                isAns = Boolean(userAnswers[q.id]);
              } else if (q.questionType === "EMQ") {
                isAns = (q.cases || []).some((c) => Boolean(userAnswers[`${q.id}_case_${c.id || c.caseNumber}`]));
              }

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setIsBreakActive(false);
                    setCurrentIndex(idx);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none ${
                    isCurrent
                      ? "bg-[#E8EDF5] border border-[#B3C5DE] shadow-xs font-bold"
                      : "hover:bg-slate-100/70"
                  }`}
                >
                  <span className="w-6 h-6 rounded bg-[#E2E8F0] text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>

                  <span
                    className={`text-xs sm:text-[13px] truncate flex-1 ${
                      isCurrent ? "text-slate-950 font-bold" : "text-slate-700 font-medium"
                    }`}
                    title={q.subTopic || q.themeTitle || `Question ${idx + 1}`}
                  >
                    {q.themeTitle || q.subTopic || `Question ${idx + 1}`}
                  </span>

                  <div className="w-5 flex items-center justify-center shrink-0">
                    {isFlag ? (
                      <Flag className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ) : isAns ? (
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* 5-Minute Break Navigator Item (Matching Screenshot 2 item 11) */}
            <div
              onClick={() => setIsBreakActive(true)}
              className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all select-none my-2 ${
                isBreakActive
                  ? "bg-[#EFF6FF] border-2 border-[#3B82F6] text-[#1D4ED8] shadow-sm font-bold"
                  : "bg-[#F8FAFC] border border-[#E2E8F0] text-slate-700 hover:bg-[#F1F5F9]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-[#DBEAFE] text-[#1E40AF] font-bold text-xs flex items-center justify-center shrink-0">
                  <Coffee className="w-3.5 h-3.5 text-[#2563EB]" />
                </span>
                <span className="text-xs sm:text-[13.5px] font-bold">5 minute Break</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 font-mono">
                {isBreakActive ? formatTimer(breakSecondsLeft) : "5:00"}
              </span>
            </div>

            {/* PD Section Questions */}
            {pdQuestions.map((q, pIdx) => {
              const globalIdx = firstPdIndex + pIdx;
              const isCurrent = !isBreakActive && currentIndex === globalIdx;
              const isFlag = Boolean(flagged[q.id]);
              let isAns = false;
              if (q.questionType === "SELECT_3") {
                isAns = (userAnswers[q.id] || []).length > 0;
              } else if (q.questionType === "RANKING") {
                isAns = Boolean(userAnswers[q.id]);
              }

              return (
                <div
                  key={q.id}
                  onClick={() => {
                    setIsBreakActive(false);
                    setCurrentIndex(globalIdx);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none ${
                    isCurrent
                      ? "bg-[#E8EDF5] border border-[#B3C5DE] shadow-xs font-bold"
                      : "hover:bg-slate-100/70"
                  }`}
                >
                  <span className="w-6 h-6 rounded bg-[#E2E8F0] text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {globalIdx + 1}
                  </span>

                  <span
                    className={`text-xs sm:text-[13px] truncate flex-1 ${
                      isCurrent ? "text-slate-950 font-bold" : "text-slate-700 font-medium"
                    }`}
                    title={q.subTopic || `Case ${pIdx + 1}`}
                  >
                    {q.subTopic || `Case ${pIdx + 1}`}
                  </span>

                  <div className="w-5 flex items-center justify-center shrink-0">
                    {isFlag ? (
                      <Flag className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ) : isAns ? (
                      <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Main Screen: Break Screen OR Active Question Card */}
        <main className="flex-1 w-full min-w-0">
          {isBreakActive ? (
            /* ========================================================
               5-MINUTE BREAK PAGE (Exact Replica of Screenshot 2)
               ======================================================== */
            <div className="bg-transparent flex flex-col items-center justify-center py-6 sm:py-10 max-w-[860px] mx-auto text-center space-y-8 animate-in fade-in duration-300">
              {/* Green Success Badge */}
              <div className="w-20 h-20 rounded-full bg-[#10b981]/15 flex items-center justify-center shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-md">
                  <Check className="w-8 h-8 stroke-[3.5]" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-2 max-w-xl">
                <h2 className="text-2xl sm:text-[32px] font-bold text-[#141B25] tracking-tight leading-snug">
                  Clinical Problem Solving Submitted Successfully
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                  Your answers have been recorded. You now have an optional 5-minute break before the next section begins.
                </p>
              </div>

              {/* 2-Column Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-[760px] text-left">
                {/* Left Card: Circular Countdown Timer */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E4EA] shadow-xs flex items-center justify-center min-h-[220px]">
                  <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                      {/* Track */}
                      <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        stroke="#EDF2F7"
                        strokeWidth="10"
                        fill="none"
                      />
                      {/* Animated Progress Ring */}
                      <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        stroke="#1D82EB"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={breakStrokeDashoffset}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl font-bold text-[#141B25] tracking-tight font-mono">
                        {formatTimer(breakSecondsLeft)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Card: Next Section Preview */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E4EA] shadow-xs flex flex-col items-center justify-center text-center min-h-[220px] space-y-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#1D82EB] text-white flex items-center justify-center shadow-xs">
                    <Stethoscope className="w-6 h-6 stroke-[2.2]" />
                  </div>

                  <div>
                    <span className="text-xs sm:text-[13px] text-slate-500 font-medium">Next: </span>
                    <span className="text-sm sm:text-base font-bold text-[#141B25]">
                      Professional Dilemmas
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-600 bg-slate-100 px-3.5 py-1.5 rounded-full">
                    <span>50 questions</span>
                    <span>•</span>
                    <span>45 minutes</span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium leading-relaxed max-w-[260px]">
                    This section will start automatically when your break ends.
                  </p>
                </div>
              </div>

              {/* Bottom Instructions & Continue Button */}
              <div className="space-y-4 pt-2 flex flex-col items-center">
                <div className="space-y-1">
                  <h3 className="font-bold text-[#141B25] text-base sm:text-lg">5-minute break</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Take a moment to rest and reset before your next session.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleContinueFromBreak}
                  className="px-9 py-3 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>Continue Now</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================
               ACTIVE QUESTION VIEW (SBA, EMQ, SELECT_3, RANKING)
               ======================================================== */
            <div className="space-y-6">
              {/* Question Card Renderer based on QuestionType */}
              {currentQ.questionType === "SBA" && (
                <ClinicalSbaCard
                  question={{
                    id: currentQ.id as any,
                    itemType: "SBA",
                    badge: `CPS · Q.${currentIndex + 1}`,
                    topic: currentQ.subTopic || "Clinical Problem Solving",
                    subTopic: currentQ.subTopic || `SBA Question ${currentIndex + 1}`,
                    vignette: currentQ.vignette || currentQ.questionText,
                    question: currentQ.questionText,
                    options: (currentQ.options || []).map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const cleanLabel = opt.replace(/^[A-E]\.\s*/, "");
                      return { id: letter, label: cleanLabel };
                    }),
                    correctOption: currentQ.correctOption || "A",
                    explanation: currentQ.explanation || "",
                  }}
                  currentIndex={currentIndex}
                  totalQuestions={questions.length}
                  selectedAnswer={userAnswers[currentQ.id]}
                  isFlagged={Boolean(flagged[currentQ.id])}
                  onSelectOption={handleSelectSba}
                  onToggleFlag={handleToggleFlag}
                  onReportIssue={() => setShowReportModal(true)}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              )}

              {currentQ.questionType === "EMQ" && (
                <ClinicalEmqCard
                  theme={{
                    id: currentQ.id as any,
                    itemType: "EMQ",
                    themeNumber: currentQ.themeNumber || 1,
                    topic: currentQ.themeTitle || "Clinical Problem Solving",
                    subTopic: currentQ.subTopic || `EMQ Theme ${currentQ.themeNumber || 1}`,
                    title: currentQ.themeTitle || currentQ.questionText,
                    instruction: currentQ.vignette || "Select the single most appropriate option for each case.",
                    options: (currentQ.options || []).map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const cleanLabel = opt.replace(/^[A-Z]\.\s*/, "");
                      return { id: letter, label: cleanLabel };
                    }),
                    cases: (currentQ.cases || []).map((c) => ({
                      id: String(c.id || c.caseNumber),
                      caseNumber: c.caseNumber,
                      vignette: c.vignette,
                      correctOption: c.correctOption,
                      explanation: c.explanation,
                    })),
                  }}
                  currentIndex={currentIndex}
                  totalQuestions={questions.length}
                  answers={
                    Object.fromEntries(
                      Object.entries(userAnswers)
                        .filter(([k]) => k.startsWith(`${currentQ.id}_case_`))
                        .map(([k, v]) => [k.replace(`${currentQ.id}_case_`, ""), v])
                    )
                  }
                  isSubmitted={false}
                  isFlagged={Boolean(flagged[currentQ.id])}
                  onOpenOptionPicker={(caseId) => {
                    const cNum = (currentQ.cases || []).find((c) => String(c.id || c.caseNumber) === caseId)?.caseNumber || 1;
                    setActiveEmqCase({ id: caseId, caseNumber: cNum });
                    setOptionPickerOpen(true);
                  }}
                  onClearOption={handleClearEmqOption}
                  onToggleFlag={handleToggleFlag}
                  onReportIssue={() => setShowReportModal(true)}
                  onPrevious={handlePrevious}
                  onSubmitOrNext={handleNext}
                />
              )}

              {currentQ.questionType === "SELECT_3" && (
                <PDSelect3Card
                  question={{
                    id: currentQ.id as any,
                    domain: "Professional Dilemmas",
                    vignette: currentQ.vignette || currentQ.questionText,
                    instruction: "Select the 3 most appropriate actions to take in this situation.",
                    options: (currentQ.options || []).map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const cleanLabel = opt.replace(/^[A-H]\.\s*/, "");
                      return { id: letter, label: cleanLabel };
                    }),
                    type: "SELECT_3",
                    correctAnswers: currentQ.correctAnswers || ["A", "B", "C"],
                    explanation: currentQ.explanation || "",
                    subTopic: currentQ.subTopic || `Select 3 Case ${currentIndex + 1}`,
                  }}
                  currentIndex={currentIndex}
                  totalQuestions={questions.length}
                  selectedOptions={userAnswers[currentQ.id] || []}
                  isSubmitted={false}
                  isFlagged={Boolean(flagged[currentQ.id])}
                  onToggleOption={handleToggleSelect3}
                  onToggleFlag={handleToggleFlag}
                  onReportIssue={() => setShowReportModal(true)}
                  onPrevious={handlePrevious}
                  onSubmitOrNext={handleNext}
                />
              )}

              {currentQ.questionType === "RANKING" && (
                <PDRankingCard
                  question={{
                    id: currentQ.id as any,
                    domain: "Professional Dilemmas",
                    vignette: currentQ.vignette || currentQ.questionText,
                    instruction: "Rank the following actions from most appropriate (1) to least appropriate (5).",
                    options: (currentQ.options || []).map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const cleanLabel = opt.replace(/^[A-E]\.\s*/, "");
                      return { id: letter, label: cleanLabel };
                    }),
                    type: "RANKING",
                    idealOrder: currentQ.idealOrder || ["A", "B", "C", "D", "E"],
                    explanation: currentQ.explanation || "",
                    subTopic: currentQ.subTopic || `Ranking Case ${currentIndex + 1}`,
                  }}
                  currentIndex={currentIndex}
                  totalQuestions={questions.length}
                  currentRankOrder={userAnswers[currentQ.id] || ["A", "B", "C", "D", "E"]}
                  isSubmitted={false}
                  isFlagged={Boolean(flagged[currentQ.id])}
                  onDragStart={(e, id) => {
                    setDraggedOptionId(id);
                    e.dataTransfer.setData("text/plain", id);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDropRanking}
                  onMoveRank={handleMoveRankingRank}
                  onToggleFlag={handleToggleFlag}
                  onReportIssue={() => setShowReportModal(true)}
                  onPrevious={handlePrevious}
                  onSubmitOrNext={handleNext}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {/* 1. EMQ Option Picker Modal */}
      {currentQ?.questionType === "EMQ" && (
        <EmqOptionPickerModal
          isOpen={optionPickerOpen}
          onClose={() => {
            setOptionPickerOpen(false);
            setActiveEmqCase(null);
          }}
          options={(currentQ.options || []).map((opt, oIdx) => ({
            id: String.fromCharCode(65 + oIdx),
            label: opt.replace(/^[A-Z]\.\s*/, ""),
          }))}
          currentSelectedId={
            activeEmqCase ? userAnswers[`${currentQ.id}_case_${activeEmqCase.id}`] : undefined
          }
          onSelectOption={(optionId) => {
            if (activeEmqCase) {
              handleSelectEmqOption(activeEmqCase.id, optionId);
            }
          }}
          caseNumber={activeEmqCase?.caseNumber}
        />
      )}

      {/* 2. End Session Modal */}
      <EndSessionModal
        isOpen={showEndSessionModal}
        onClose={() => setShowEndSessionModal(false)}
        onConfirmEnd={handleFinalSubmit}
        answeredCount={answeredCount}
        totalCount={questions.length}
        examType="Mock"
      />

      {/* 3. Report Issue Modal */}
      <ReportIssueModal
        isOpen={showReportModal}
        title={`Report Issue: Question ${currentIndex + 1}`}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}

export default function MockExamPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#edf0f4] flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading MSRA Mock Exam...</p>
        </div>
      }
    >
      <MockExamPracticeContent />
    </Suspense>
  );
}
