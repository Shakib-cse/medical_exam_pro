"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight, Flag, Bookmark, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { overviewApi } from "@/services/overviewApi";
import { questionBankApi } from "@/services/questionBankApi";
import { QuestionNavigator } from "../_components/QuestionNavigator";

interface ClinicalQuestion {
  id: number;
  badge: string;
  topic: string;
  subTopic: string;
  vignette: string;
  question: string;
  options: { id: string; label: string }[];
  correctOption: string;
  explanation: string;
}

const DEFAULT_CLINICAL_QUESTIONS: ClinicalQuestion[] = [
  {
    id: 1,
    badge: "Q.1",
    topic: "Cardiovascular Medicine",
    subTopic: "Myocardial Infarction",
    vignette:
      "A 65-year-old male presents to the emergency department with severe, crushing central chest pain radiating to his left jaw and shoulder for the past 45 minutes. He is diaphoresis and nauseous. His blood pressure is 142/88 mmHg, heart rate is 96 bpm, and oxygen saturation is 98% on room air.",
    question:
      "ECG demonstrates 3mm ST-segment elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. What is the most appropriate definitive management?",
    options: [
      { id: "A", label: "Immediate primary percutaneous coronary intervention (PPCI)" },
      { id: "B", label: "Intravenous thrombolysis with alteplase within 60 minutes" },
      { id: "C", label: "CT coronary angiography and urgent cardiology outpatient referral" },
      { id: "D", label: "Administer high-flow oxygen 15 L/min and oral bisoprolol" },
      { id: "E", label: "Sublingual glyceryl trinitrate and serial 6-hour high-sensitivity troponin" },
    ],
    correctOption: "A",
    explanation:
      "The clinical presentation and ECG findings indicate an acute inferior ST-elevation myocardial infarction (STEMI). Primary PCI is the treatment of choice for STEMI if delivered within 120 minutes of anticipated diagnosis time. High-flow oxygen is only indicated if hypoxaemic (SpO2 < 94%).",
  },
  {
    id: 2,
    badge: "Q.2",
    topic: "Respiratory Medicine",
    subTopic: "Pulmonary Embolism",
    vignette:
      "A 32-year-old woman presents with acute onset pleuritic chest pain and shortness of breath 10 days following a Caesarean section. On examination, she is tachypnoeic at 26 breaths/min, tachycardic at 112 bpm, and her right calf is swollen and tender.",
    question:
      "Her Wells score indicates high probability for pulmonary embolism. What is the most appropriate initial diagnostic investigation?",
    options: [
      { id: "A", label: "D-dimer assay" },
      { id: "B", label: "CT Pulmonary Angiogram (CTPA)" },
      { id: "C", label: "Transthoracic echocardiogram" },
      { id: "D", label: "Ventilation-perfusion (V/Q) SPECT scan" },
      { id: "E", label: "Bilateral lower limb venography" },
    ],
    correctOption: "B",
    explanation:
      "For patients with a high clinical probability of pulmonary embolism (Wells score > 4), CTPA is the definitive first-line diagnostic investigation. D-dimer has no utility in ruling out PE in high-probability patients and is frequently elevated postpartum.",
  },
  {
    id: 3,
    badge: "Q.3",
    topic: "Neurology",
    subTopic: "Acute Stroke",
    vignette:
      "A 71-year-old man is brought to the resuscitation room with sudden-onset left hemiparesis and facial weakness starting 75 minutes ago. His blood glucose is 6.2 mmol/L and blood pressure is 165/95 mmHg.",
    question:
      "Emergency non-contrast CT head scan excludes intracranial haemorrhage. What is the most appropriate immediate medical treatment?",
    options: [
      { id: "A", label: "Intravenous thrombolysis with recombinant tissue plasminogen activator (rt-PA)" },
      { id: "B", label: "Aspirin 300 mg orally immediately" },
      { id: "C", label: "Intravenous unfractionated heparin infusion" },
      { id: "D", label: "Intravenous labetalol to lower systolic blood pressure below 140 mmHg" },
      { id: "E", label: "Clopidogrel 300 mg loading dose and immediate mechanical thrombectomy only" },
    ],
    correctOption: "A",
    explanation:
      "In acute ischaemic stroke presenting within 4.5 hours of symptom onset with intracranial haemorrhage ruled out by CT, IV alteplase (rt-PA) is indicated. Aspirin is delayed until 24 hours post-thrombolysis after follow-up imaging.",
  },
  {
    id: 4,
    badge: "Q.4",
    topic: "Gastroenterology",
    subTopic: "Upper GI Bleeding",
    vignette:
      "A 54-year-old man with a history of alcohol-related liver cirrhosis presents with massive haematemesis and dizziness. On arrival, blood pressure is 88/50 mmHg, pulse is 125 bpm. He is pale and clammy.",
    question:
      "After initiating intravenous fluid resuscitation with 2 large-bore cannulae and activating the major haemorrhage protocol, what medical therapy should be started immediately before endoscopy?",
    options: [
      { id: "A", label: "Intravenous Terlipressin and prophylactic broad-spectrum antibiotics" },
      { id: "B", label: "High-dose oral omeprazole and tranexamic acid" },
      { id: "C", label: "Intravenous Vitamin K and fresh frozen plasma only" },
      { id: "D", label: "Intravenous Metoclopramide and Ranitidine" },
      { id: "E", label: "Barium swallow examination" },
    ],
    correctOption: "A",
    explanation:
      "In suspected variceal bleeding in a patient with cirrhosis, intravenous Terlipressin (splanchnic vasoconstrictor) and prophylactic IV antibiotics (e.g. ceftriaxone) should be started immediately prior to emergency endoscopy within 4 hours.",
  },
  {
    id: 5,
    badge: "Q.5",
    topic: "Endocrinology",
    subTopic: "Diabetic Ketoacidosis",
    vignette:
      "A 19-year-old woman with Type 1 diabetes presents with nausea, vomiting, abdominal pain, and deep sighing respirations. Blood glucose is 24.6 mmol/L, blood ketones are 4.8 mmol/L, venous blood gas shows pH 7.15 and bicarbonate 11 mmol/L.",
    question:
      "Alongside fixed-rate intravenous insulin infusion (0.1 units/kg/hr), what is the first fluid resuscitation prescription?",
    options: [
      { id: "A", label: "0.9% Sodium Chloride 1000 mL over 1 hour" },
      { id: "B", label: "5% Dextrose 500 mL over 2 hours" },
      { id: "C", label: "0.45% Sodium Chloride with 40 mmol KCl over 4 hours" },
      { id: "D", label: "Sodium Bicarbonate 1.26% 500 mL over 30 minutes" },
      { id: "E", label: "Hartmann's solution 2000 mL bolus over 15 minutes" },
    ],
    correctOption: "A",
    explanation:
      "National DKA guidelines mandate 0.9% sodium chloride 1000 mL over the first 1 hour as initial fluid resuscitation to restore circulatory volume. Potassium is typically added to subsequent bags unless hypokalaemia is already present.",
  },
];

function ClinicalPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const specialityParam = searchParams.get("speciality") || searchParams.get("topic") || "Clinical Problem Solving";

  const [questions, setQuestions] = useState<ClinicalQuestion[]>(DEFAULT_CLINICAL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real topics if available
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await overviewApi.getOverviewContent();
        if (res?.data?.clinical_topics?.content) {
          const list: any[] = res.data.clinical_topics.content;
          const matched = list.find(
            (t) => t.title.toLowerCase().includes(specialityParam.toLowerCase()) || specialityParam.toLowerCase().includes(t.title.toLowerCase())
          );
          if (matched && matched.questions?.length > 0) {
            const mapped: ClinicalQuestion[] = matched.questions.map((q: any, i: number) => ({
              id: i + 1,
              badge: `Q.${i + 1}`,
              topic: matched.title,
              subTopic: `Clinical Case ${i + 1}`,
              vignette: q.questionText,
              question: q.questionText,
              options: (q.options || []).map((opt: string, oIdx: number) => ({
                id: String.fromCharCode(65 + oIdx),
                label: opt,
              })),
              correctOption: String.fromCharCode(65 + (q.correctAnswer ?? 0)),
              explanation: q.explanation || "Detailed clinical rationale.",
            }));
            setQuestions(mapped);
          }
        }
      } catch (err) {
        console.warn("Using default clinical questions:", err);
      }
    }
    fetchQuestions();
  }, [specialityParam]);

  const currentQ = questions[currentIndex] || questions[0];
  const userAnswer = userAnswers[currentIndex];
  const isAnswered = Boolean(userAnswer);
  const isCorrect = isAnswered && userAnswer === currentQ.correctOption;

  const answeredMap: Record<number, boolean> = {};
  Object.keys(userAnswers).forEach((idxStr) => {
    answeredMap[parseInt(idxStr)] = true;
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSelectOption = (optId: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optId }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowExitModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scoreCount = Object.entries(userAnswers).filter(
    ([idx, ans]) => ans === questions[parseInt(idx)]?.correctOption
  ).length;

  return (
    <div className="min-h-screen bg-[#edf0f4] text-slate-800 flex flex-col font-sans">
      {/* 1. Header Bar */}
      <header className="bg-[#082138] text-white border-b border-[#152e4a] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1568px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Back Link & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/clinical-problem-solving"
              className="p-1.5 rounded-lg bg-[#0d2a47] hover:bg-[#13375c] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Exit Practice"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug">
                Clinical Problem Solving → {specialityParam}
              </h1>
              <span className="text-[11px] font-medium text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Right: Timer & Finish */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d2a47] border border-[#1a3f65] text-cyan-300 text-xs font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTime(timeElapsed)}</span>
            </div>

            <button
              onClick={() => setShowExitModal(true)}
              className="px-4 py-2 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Finish Session
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Practice Layout (2 Columns: Left Navigator + Right Question Card) */}
      <main className="flex-1 max-w-[1568px] w-full mx-auto p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Question Navigator (1 Col on Desktop) */}
          <div className="lg:col-span-1 space-y-4">
            <QuestionNavigator
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answeredIndices={answeredMap}
              flaggedIndices={flagged}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              title="CPS Question Navigator"
            />
          </div>

          {/* Right: Question Card (3 Cols on Desktop) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E4EA] shadow-xs space-y-6">
              {/* Question Meta Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-[#082138] text-white font-extrabold text-xs tracking-wide">
                    {currentQ.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentQ.topic} • {currentQ.subTopic}
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
                  <span>{flagged[currentIndex] ? "Flagged" : "Flag"}</span>
                </button>
              </div>

              {/* Vignette & Question Stem */}
              <div className="space-y-4 text-slate-800 leading-relaxed font-medium">
                <p className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm sm:text-base font-normal">
                  {currentQ.vignette}
                </p>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {currentQ.question}
                </h3>
              </div>

              {/* Multiple Choice Options (SBA) */}
              <div className="space-y-3 pt-1">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswer === opt.id;
                  const isCorrectOption = opt.id === currentQ.correctOption;

                  let optionStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800";

                  if (isAnswered) {
                    if (isCorrectOption) {
                      optionStyle = "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs";
                    } else if (isSelected) {
                      optionStyle = "border-rose-400 bg-rose-50/70 text-rose-950 font-semibold";
                    } else {
                      optionStyle = "border-slate-200 opacity-60 text-slate-600";
                    }
                  } else if (isSelected) {
                    optionStyle = "border-[#1D82EB] bg-blue-50/60 text-slate-900 font-semibold ring-1 ring-[#1D82EB]";
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isAnswered && isCorrectOption
                              ? "bg-emerald-500 text-white"
                              : isAnswered && isSelected
                              ? "bg-rose-500 text-white"
                              : isSelected
                              ? "bg-[#1D82EB] text-white"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span className="text-xs sm:text-sm">{opt.label}</span>
                      </div>

                      {isAnswered && isCorrectOption && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {isAnswered && isSelected && !isCorrectOption && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Box (Visible Once Answered) */}
              {isAnswered && (
                <div
                  className={`p-5 rounded-2xl border transition-all ${
                    isCorrect
                      ? "bg-emerald-50/80 border-emerald-200"
                      : "bg-rose-50/70 border-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <h4
                      className={`font-bold text-sm ${
                        isCorrect ? "text-emerald-950" : "text-rose-950"
                      }`}
                    >
                      {isCorrect ? "Correct Answer" : "Incorrect Answer"}
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{currentIndex === questions.length - 1 ? "Finish Test" : "Next Question"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Exit / Results Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 border border-[#E0E4EA] shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Session Completed!
            </h3>
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4 text-center space-y-1">
              <span className="text-xs font-semibold text-[#059669]">Your Score</span>
              <div className="text-3xl font-extrabold text-[#059669]">
                {Math.round((scoreCount / questions.length) * 100)}%
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {scoreCount} of {questions.length} questions answered correctly
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Link
                href="/dashboard/clinical-problem-solving"
                className="w-full py-3 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] text-white font-bold text-xs sm:text-sm text-center block transition-all shadow-xs cursor-pointer"
              >
                Return to Clinical Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setCurrentIndex(0);
                  setShowExitModal(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center block transition-colors cursor-pointer"
              >
                Retake Practice Session
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
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Clinical Practice...</div>}>
      <ClinicalPracticeContent />
    </Suspense>
  );
}
