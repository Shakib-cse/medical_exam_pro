"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { mockExamApi } from "@/services/mockExamApi";
import { questionBankApi } from "@/services/questionBankApi";
import { overviewApi } from "@/services/overviewApi";
import { PracticeHeader } from "./_components/PracticeHeader";
import { PracticeQuestionCard, QuestionItem } from "./_components/PracticeQuestionCard";

const STORAGE_KEY = "medicalexampro_practice_session";

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id || user?.email || "guest";
  const examIdParam = searchParams.get("examId");
  const bankIdParam = searchParams.get("bankId");
  const topicIdParam = searchParams.get("topicId");
  const topicParam = searchParams.get("topic") || "Mock Practice Exam";

  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [activeTopic, setActiveTopic] = useState(topicParam);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingExam, setLoadingExam] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  // Timer Effect - Only start counting after loading is complete and questions are available
  useEffect(() => {
    if (loadingExam || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loadingExam, questions.length]);

  // Save session state to local storage
  useEffect(() => {
    if (!isLoaded) return;
    const sessionData = {
      currentIndex,
      userAnswers,
      bookmarked,
      flagged,
      timeElapsed,
      activeTopic,
      attemptId,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.error("Failed to save practice session:", e);
    }
  }, [currentIndex, userAnswers, bookmarked, flagged, timeElapsed, activeTopic, attemptId, isLoaded]);

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentIndex !== undefined) setCurrentIndex(parsed.currentIndex);
        if (parsed.userAnswers) setUserAnswers(parsed.userAnswers);
        if (parsed.bookmarked) setBookmarked(parsed.bookmarked);
        if (parsed.flagged) setFlagged(parsed.flagged);
        if (parsed.timeElapsed) setTimeElapsed(parsed.timeElapsed);
        if (parsed.activeTopic) setActiveTopic(parsed.activeTopic);
        if (parsed.attemptId) setAttemptId(parsed.attemptId);
      }
    } catch (e) {
      console.error("Failed to restore practice session:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Fetch dynamic questions from backend
  useEffect(() => {
    async function loadDynamicExam() {
      try {
        setLoadingExam(true);
        let targetExam: any = null;

        // Check Clinical Topics
        if (topicIdParam || (topicParam && !examIdParam && !bankIdParam)) {
          try {
            const overviewRes = await overviewApi.getOverviewContent();
            if (overviewRes?.data?.clinical_topics?.content) {
              const topicList: any[] = overviewRes.data.clinical_topics.content;
              const matchedTopic = topicList.find(
                (t) => t.id === topicIdParam || t.title.toLowerCase() === topicParam.toLowerCase()
              );

              if (matchedTopic && matchedTopic.questions?.length > 0) {
                targetExam = {
                  title: matchedTopic.title,
                  category: "Clinical Problem Solving",
                  difficultyBadge: "Moderate",
                  durationMinutes: matchedTopic.durationMinutes || 45,
                  questions: matchedTopic.questions,
                };
              }
            }
          } catch (overviewErr) {
            console.error("Failed to fetch clinical topic questions:", overviewErr);
          }
        }

        if (!targetExam && bankIdParam) {
          const res = await questionBankApi.getQuestionBankById(bankIdParam);
          if (res?.data) targetExam = res.data;
        } else if (!targetExam && examIdParam) {
          const res = await mockExamApi.getMockExamById(examIdParam);
          if (res?.data) targetExam = res.data;
        } else if (!targetExam) {
          const listRes = await mockExamApi.getMockExams();
          if (listRes?.data?.length > 0) {
            const matched = listRes.data.find(
              (e: any) => e.title.toLowerCase() === topicParam.toLowerCase() || e.id === topicParam
            ) || listRes.data[0];

            if (matched) {
              const res = await mockExamApi.getMockExamById(matched.id);
              if (res?.data) targetExam = res.data;
            }
          }
        }

        if (targetExam && targetExam.questions?.length > 0) {
          const dynamicQ: QuestionItem[] = targetExam.questions.map((q: any, idx: number) => ({
            id: idx + 1,
            backendId: q.id,
            badge: `Q.${idx + 1}`,
            topic: targetExam.category || "Mock Exam",
            subTopic: targetExam.title || `Question ${idx + 1}`,
            vignette: q.questionText,
            question: q.questionText,
            options: (q.options || []).map((optText: string, oIdx: number) => ({
              id: String.fromCharCode(65 + oIdx),
              label: optText,
            })),
            correctOption: String.fromCharCode(65 + (q.correctAnswer ?? 0)),
            explanation: q.explanation || "No explanation provided for this question.",
            difficulty: (targetExam.difficultyBadge || "Moderate") as any,
            frequency: `${targetExam.questions.length} Questions Module`,
          }));

          setQuestions(dynamicQ);
          setActiveTopic(targetExam.title);

          try {
            if (bankIdParam) {
              const startRes = await questionBankApi.startBankAttempt(targetExam.id);
              if (startRes?.data?.id) {
                setAttemptId(startRes.data.id);
              }
            } else {
              const startRes = await mockExamApi.startExam(targetExam.id);
              if (startRes?.data?.id) {
                setAttemptId(startRes.data.id);
              }
            }
          } catch (startErr) {
            console.error("Failed to start/resume exam attempt on backend:", startErr);
          }
        }
      } catch (err) {
        console.error("Failed to load real mock exam questions:", err);
      } finally {
        setLoadingExam(false);
      }
    }

    loadDynamicExam();
  }, [examIdParam, bankIdParam, topicIdParam, topicParam]);

  const handleSelectOption = (optionId: string) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    if (userAnswers[currentQ.id]) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const toggleBookmark = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setBookmarked((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const toggleFlag = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleFinishTest = async () => {
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q) => {
      const chosenLetter = userAnswers[q.id];
      if (chosenLetter) {
        if (chosenLetter === q.correctOption) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }
    });

    const attemptedTotal = correctCount + wrongCount;
    const accuracyPct = attemptedTotal > 0 ? Math.round((correctCount / attemptedTotal) * 100) : 0;
    const attemptsPct = questions.length > 0 ? Math.round((attemptedTotal / questions.length) * 100) : 100;

    if (attemptId) {
      try {
        const backendAnswers: Record<string, number> = {};
        questions.forEach((q) => {
          const chosenLetter = userAnswers[q.id];
          if (chosenLetter && q.backendId) {
            const charCodeIndex = chosenLetter.charCodeAt(0) - 65;
            backendAnswers[q.backendId] = charCodeIndex;
          }
        });

        if (bankIdParam) {
          await questionBankApi.submitBankAttempt(attemptId, {
            userAnswers: backendAnswers,
            timeTakenSeconds: timeElapsed,
          });
        } else {
          await mockExamApi.submitExam(attemptId, {
            userAnswers: backendAnswers,
            timeTakenSeconds: timeElapsed,
          });
        }
      } catch (submitErr) {
        console.error("Failed to submit exam attempt:", submitErr);
      }
    }

    if (typeof window !== "undefined") {
      const todayStr = new Date().toISOString().split("T")[0];
      const userPrefix = `user_${userId}_`;
      const prevDailyCount = parseInt(
        localStorage.getItem(`${userPrefix}daily_questions_count_${todayStr}`) ||
        localStorage.getItem(`daily_questions_count_${todayStr}`) ||
        "0",
        10
      );
      const newDailyCount = prevDailyCount + (attemptedTotal > 0 ? attemptedTotal : questions.length);
      localStorage.setItem(`${userPrefix}daily_questions_count_${todayStr}`, newDailyCount.toString());
      localStorage.setItem(`${userPrefix}last_goal_date`, todayStr);

      const lastAttemptData = {
        title: topicParam || activeTopic || "Topic Practice",
        correct: correctCount,
        wrong: wrongCount,
        attemptsPct,
        accuracyPct,
        totalQ: questions.length,
        timestamp: Date.now(),
      };
      if (topicIdParam) {
        localStorage.setItem(`${userPrefix}topic_last_attempt_${topicIdParam}`, JSON.stringify(lastAttemptData));
      }
      if (topicParam) {
        localStorage.setItem(`${userPrefix}topic_last_attempt_${topicParam}`, JSON.stringify(lastAttemptData));
      }
      if (bankIdParam) {
        localStorage.setItem(`${userPrefix}bank_last_attempt_${bankIdParam}`, JSON.stringify(lastAttemptData));
      }
      localStorage.removeItem(STORAGE_KEY);
    }
    router.push(topicIdParam ? "/dashboard" : bankIdParam ? "/dashboard/question-bank" : "/dashboard/mock-exams");
  };

  const handleNextOrFinish = () => {
    if (currentIndex >= questions.length - 1) {
      handleFinishTest();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loadingExam) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex flex-col text-slate-800">
        <PracticeHeader
          activeTopic={activeTopic}
          totalQuestions={0}
          answeredCount={0}
          timeElapsed={0}
          onFinishTest={() => {}}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6 animate-pulse">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-24" />
            </div>
            <div className="space-y-4">
              <div className="h-20 bg-slate-100 rounded-xl" />
              <div className="h-6 bg-slate-200 rounded w-2/3" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loadingExam && questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#072438] flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700 text-center space-y-4 shadow-xl">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Questions Available</h3>
          <p className="text-xs text-slate-400">
            There are no practice questions published for "{activeTopic}" yet. Configure questions from the Admin Dashboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-7 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md shadow-brand-orange/20 active:scale-95 cursor-pointer"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex] || questions[0];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col text-slate-800">
      {/* Header Bar */}
      <PracticeHeader
        activeTopic={activeTopic}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        timeElapsed={timeElapsed}
        onFinishTest={handleFinishTest}
      />

      {/* Main Content Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {currentQ && (
          <PracticeQuestionCard
            currentQ={currentQ}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            userAnswer={userAnswers[currentQ.id]}
            isBookmarked={Boolean(bookmarked[currentQ.id])}
            isFlagged={Boolean(flagged[currentQ.id])}
            onSelectOption={handleSelectOption}
            onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNextOrFinish={handleNextOrFinish}
            onToggleBookmark={toggleBookmark}
            onToggleFlag={toggleFlag}
          />
        )}
      </div>
    </div>
  );
}

export default function StandalonePracticePageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading exam session...</div>}>
      <PracticeContent />
    </Suspense>
  );
}
