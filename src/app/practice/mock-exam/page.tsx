"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight, Flag, AlertTriangle, CheckCircle2, Trophy, HelpCircle } from "lucide-react";
import { mockExamApi } from "@/services/mockExamApi";

interface MockQuestion {
  id: number;
  section: "Professional Dilemmas" | "Clinical Problem Solving";
  badge: string;
  topic: string;
  subTopic: string;
  vignette: string;
  question: string;
  options: { id: string; label: string }[];
  correctOption: string;
  explanation: string;
}

const DEFAULT_MOCK_EXAM_QUESTIONS: MockQuestion[] = [
  // Section 1: Professional Dilemmas
  {
    id: 1,
    section: "Professional Dilemmas",
    badge: "PD · Q.1",
    topic: "Professional Integrity",
    subTopic: "Clinical Governance & Candour",
    vignette:
      "You inadvertently administer 100mg of Tramadol instead of 50mg to a postoperative patient. The patient is currently asymptomatic and their vital signs are completely normal.",
    question:
      "What is the most appropriate initial action according to the duty of candour?",
    options: [
      { id: "A", label: "Inform the patient promptly and apologise, notify the nurse in charge, and document the incident on Datix." },
      { id: "B", label: "Monitor the patient closely without mentioning anything unless side effects develop." },
      { id: "C", label: "Wait until the consultant ward round tomorrow morning before raising the issue." },
      { id: "D", label: "Advise the pharmacist to quietly alter the administration chart to avoid alarming the patient." },
    ],
    correctOption: "A",
    explanation:
      "The GMC and statutory Duty of Candour mandate openness and honesty when things go wrong. Doctors must inform patients promptly, explain what happened, offer an apology, and complete an incident report.",
  },
  {
    id: 2,
    section: "Professional Dilemmas",
    badge: "PD · Q.2",
    topic: "Coping with Pressure",
    subTopic: "Safe Escalation",
    vignette:
      "You are an FY2 on night duty. A postoperative patient suddenly develops acute stridor and severe respiratory distress. The surgical registrar on-call is scrubbed in emergency theatre and unavailable.",
    question:
      "What is the most appropriate immediate escalation step?",
    options: [
      { id: "A", label: "Call the emergency 2222 medical/anaesthetic crash team immediately." },
      { id: "B", label: "Wait outside the operating theatre for the surgical registrar to unscrub." },
      { id: "C", label: "Administer nebulised salbutamol and re-evaluate in 30 minutes." },
      { id: "D", label: "Attempt endotracheal intubation by yourself immediately." },
    ],
    correctOption: "A",
    explanation:
      "Acute stridor is a life-threatening airway emergency. When the immediate supervisor is scrubbed, the emergency crash team (2222) must be called without hesitation for immediate airway expertise.",
  },
  // Section 2: Clinical Problem Solving
  {
    id: 3,
    section: "Clinical Problem Solving",
    badge: "CPS · Q.3",
    topic: "Cardiology",
    subTopic: "Acute Coronary Syndromes",
    vignette:
      "A 58-year-old man presents with central crushing chest pain and ST-elevation in leads V1 to V4. Pulse is 88 bpm and blood pressure is 135/85 mmHg.",
    question:
      "Which coronary artery is most likely occluded?",
    options: [
      { id: "A", label: "Left Anterior Descending (LAD) Artery" },
      { id: "B", label: "Right Coronary Artery (RCA)" },
      { id: "C", label: "Left Circumflex Artery (LCx)" },
      { id: "D", label: "Left Main Stem" },
    ],
    correctOption: "A",
    explanation:
      "ST elevation in precordial leads V1-V4 represents an anterior / anteroseptal myocardial infarction, which is classically caused by occlusion of the Left Anterior Descending (LAD) coronary artery.",
  },
  {
    id: 4,
    section: "Clinical Problem Solving",
    badge: "CPS · Q.4",
    topic: "Respiratory",
    subTopic: "Pneumonia Management",
    vignette:
      "A 68-year-old woman presents with productive cough, fever, and right-sided pleuritic pain. She is confused (AMTS 6/10), respiratory rate is 32/min, blood pressure is 85/55 mmHg, and urea is 8.4 mmol/L.",
    question:
      "Calculating her CURB-65 score, what is the most appropriate care setting?",
    options: [
      { id: "A", label: "Urgent hospital admission and consideration of intensive care assessment" },
      { id: "B", label: "Outpatient management with oral amoxicillin" },
      { id: "C", label: "Discharge with ambulatory care follow-up in 48 hours" },
      { id: "D", label: "Observation unit for 4 hours and discharge if stable" },
    ],
    correctOption: "A",
    explanation:
      "The patient scores 4 on CURB-65 (Confusion, Resp rate ≥30, BP <90/60, Urea >7). CURB-65 scores of 3 to 5 denote severe community-acquired pneumonia requiring urgent inpatient admission and consideration of ITU / HDU care.",
  },
  {
    id: 5,
    section: "Clinical Problem Solving",
    badge: "CPS · Q.5",
    topic: "Neurology",
    subTopic: "Status Epilepticus",
    vignette:
      "A 24-year-old male with epilepsy is brought in with continuous tonic-clonic convulsions lasting 12 minutes without recovery of consciousness. Blood glucose is 5.4 mmol/L.",
    question:
      "What is the first-line intravenous pharmacological therapy to terminate seizures?",
    options: [
      { id: "A", label: "Intravenous Lorazepam 4mg bolus" },
      { id: "B", label: "Intravenous Sodium Valproate infusion" },
      { id: "C", label: "Intravenous Levetiracetam 60mg/kg" },
      { id: "D", label: "General anaesthesia with Propofol" },
    ],
    correctOption: "A",
    explanation:
      "Initial first-line therapy for convulsive status epilepticus in hospital with IV access is intravenous lorazepam (0.1 mg/kg, typically 4mg bolus), repeatable once after 10 minutes if seizures persist.",
  },
];

function MockExamPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockIdParam = searchParams.get("mockId") || "mock-1";

  const [questions, setQuestions] = useState<MockQuestion[]>(DEFAULT_MOCK_EXAM_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(120 * 60); // 120 minutes full MSRA timed mock
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (examSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemaining((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [examSubmitted]);

  // Load backend mock if available
  useEffect(() => {
    async function loadBackendMock() {
      try {
        const res = await mockExamApi.getMockExamById(mockIdParam);
        if (res?.data?.questions && res.data.questions.length > 0) {
          const mapped: MockQuestion[] = res.data.questions.map((q: any, i: number) => ({
            id: i + 1,
            section: (res.data.category === "SJT" ? "Professional Dilemmas" : "Clinical Problem Solving") as any,
            badge: `Q.${i + 1}`,
            topic: res.data.title || "MSRA Mock",
            subTopic: `Question ${i + 1}`,
            vignette: q.questionText,
            question: q.questionText,
            options: (q.options || []).map((opt: string, oIdx: number) => ({
              id: String.fromCharCode(65 + oIdx),
              label: opt,
            })),
            correctOption: String.fromCharCode(65 + (q.correctAnswer ?? 0)),
            explanation: q.explanation || "Official MSRA explanation.",
          }));
          setQuestions(mapped);
        }
      } catch (err) {
        console.warn("Using default mock exam questions:", err);
      }
    }
    loadBackendMock();
  }, [mockIdParam]);

  const currentQ = questions[currentIndex] || questions[0];
  const userAnswer = userAnswers[currentIndex];
  const isAnswered = Boolean(userAnswer);

  const formatCountdown = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSelectOption = (optId: string) => {
    if (examSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optId }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([idx, ans]) => ans === questions[parseInt(idx)]?.correctOption
  ).length;

  const scorePercent = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="min-h-screen bg-[#edf0f4] text-slate-800 flex flex-col font-sans">
      {/* 1. Official Exam Navigation Header (Matching Figma frame 7557:3568) */}
      <header className="bg-[#082138] text-white border-b border-[#152e4a] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1568px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Exit Link & Exam Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/mock-exams"
              className="p-1.5 rounded-lg bg-[#0d2a47] hover:bg-[#13375c] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Exit Exam"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug">
                MSRA Full Mock Exam • {currentQ.section}
              </h1>
              <span className="text-[11px] font-medium text-slate-400">
                Question {currentIndex + 1} of {questions.length} ({answeredCount} answered)
              </span>
            </div>
          </div>

          {/* Right: Real Exam Timer & Submit Button */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
              timeRemaining < 300
                ? "bg-rose-950/80 border-rose-600 text-rose-400 animate-pulse"
                : "bg-[#0d2a47] border-[#1a3f65] text-cyan-300"
            }`}>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatCountdown(timeRemaining)}</span>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </header>

      {/* 2. Full-Width Exam Interface (Real MSRA Standard View) */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Progress Strip */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 px-0.5">
          {questions.map((q, idx) => {
            const isCur = currentIndex === idx;
            const isAns = Boolean(userAnswers[idx]);
            const isFlg = Boolean(flagged[idx]);

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  isCur
                    ? "bg-[#1D82EB] text-white font-bold shadow-xs ring-2 ring-blue-300"
                    : isAns
                    ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] font-bold"
                    : "bg-white border border-[#E0E4EA] text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{idx + 1}</span>
                {isFlg && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Examination Question Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-9 border border-[#E0E4EA] shadow-xs space-y-7">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg bg-[#082138] text-white font-extrabold text-xs tracking-wide">
                {currentQ.badge}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {currentQ.section} • {currentQ.topic}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleFlag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                flagged[currentIndex]
                  ? "bg-amber-100 text-amber-800 border border-amber-300 font-bold"
                  : "bg-[#F1F3F6] text-slate-600 border border-[#E0E4EA] hover:bg-slate-200/70"
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{flagged[currentIndex] ? "Flagged for Review" : "Flag for Review"}</span>
            </button>
          </div>

          {/* Vignette & Question Stem */}
          <div className="space-y-4 text-slate-800 leading-relaxed font-medium">
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm sm:text-base font-normal">
              {currentQ.vignette}
            </div>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg pt-1">
              {currentQ.question}
            </h3>
          </div>

          {/* Radio Options */}
          <div className="space-y-3 pt-1">
            {currentQ.options.map((opt) => {
              const isSelected = userAnswer === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#1D82EB] bg-blue-50/70 text-slate-900 font-semibold ring-1 ring-[#1D82EB]"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? "bg-[#1D82EB] text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="text-xs sm:text-sm">{opt.label}</span>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-[#1D82EB] bg-[#1D82EB]" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>{currentIndex === questions.length - 1 ? "Review & Submit" : "Next Question"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Submit / Confirmation & Results Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 border border-[#E0E4EA] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {!examSubmitted ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Submit MSRA Mock Exam?
                    </h3>
                    <p className="text-xs text-slate-500">
                      You answered {answeredCount} of {questions.length} questions.
                    </p>
                  </div>
                </div>

                <div className="bg-[#F1F3F6] rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Answered:</span>
                    <span className="font-bold text-slate-900">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Unanswered:</span>
                    <span className="font-bold text-rose-600">
                      {questions.length - answeredCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Flagged for Review:</span>
                    <span className="font-bold text-amber-600">
                      {Object.values(flagged).filter(Boolean).length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Return to Exam
                  </button>
                  <button
                    type="button"
                    onClick={() => setExamSubmitted(true)}
                    className="flex-1 py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    Confirm Submission
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Mock Exam Results
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your full MSRA timed mock exam has been scored.
                  </p>
                </div>

                <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4 text-center space-y-1">
                  <span className="text-xs font-semibold text-[#059669]">Overall Score</span>
                  <div className="text-4xl font-extrabold text-[#059669]">{scorePercent}%</div>
                  <p className="text-xs text-slate-600 font-medium">
                    {correctCount} / {questions.length} correct
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href="/dashboard/mock-exams"
                    className="w-full py-3 rounded-full bg-[#1D82EB] hover:bg-[#1875d2] text-white font-bold text-xs sm:text-sm text-center block transition-all shadow-xs cursor-pointer"
                  >
                    Back to Mock Exams
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MockExamPracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading MSRA Mock Exam...</div>}>
      <MockExamPracticeContent />
    </Suspense>
  );
}
