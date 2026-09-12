"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle, ArrowUp, ArrowDown, CheckCircle2, RotateCcw } from "lucide-react";
import { QuestionNavigator } from "../_components/QuestionNavigator";

interface RankingOption {
  id: string;
  label: string;
  idealRank: number; // 1 to 5
}

interface DilemmaQuestion {
  id: number;
  badge: string;
  domain: string;
  subTopic: string;
  vignette: string;
  instruction: string;
  options: RankingOption[];
  explanation: string;
}

const DEFAULT_DILEMMA_QUESTIONS: DilemmaQuestion[] = [
  {
    id: 1,
    badge: "PD.1",
    domain: "Professional Integrity",
    subTopic: "Probity & Prescribing",
    vignette:
      "You are an FY2 doctor working on an acute medical ward. While in the doctor's mess during a busy weekend on-call shift, a senior surgical registrar who is off-duty approaches you and asks if you would quickly write and sign a private prescription for an antibiotic (Amoxicillin) for their partner, stating they have acute sinusitis and cannot reach their GP.",
    instruction:
      "Rank the following actions in order of appropriateness from 1 (Most appropriate) to 5 (Least appropriate):",
    options: [
      { id: "A", label: "Politely decline to prescribe, explaining that GMC guidance strictly advises against prescribing for colleagues' relatives except in emergencies.", idealRank: 1 },
      { id: "B", label: "Advise the registrar to direct their partner to an urgent care centre, walk-in clinic, or contact NHS 111 for assessment.", idealRank: 2 },
      { id: "C", label: "Offer to examine the partner in the emergency department if they attend as a registered patient.", idealRank: 3 },
      { id: "D", label: "Suggest the registrar write the prescription themselves if they are confident in the diagnosis.", idealRank: 4 },
      { id: "E", label: "Agree to sign the prescription on this occasion to maintain a supportive working relationship with a senior colleague.", idealRank: 5 },
    ],
    explanation:
      "GMC Good Medical Practice guidance clearly states doctors must not prescribe for family members or colleagues outside formal clinical care unless in exceptional emergencies. Option A directly and professionally addresses the request based on national probity rules. Option B offers constructive alternative routes. Option D improperly encourages GMC breach, while Option E directly violates professional standards.",
  },
  {
    id: 2,
    badge: "PD.2",
    domain: "Coping with Pressure",
    subTopic: "Prioritisation under Acute Workload",
    vignette:
      "You are the sole doctor covering 3 medical wards overnight. At 03:00, you are simultaneously paged to attend an acutely deteriorating septic patient with BP 82/45, requested to prescribe regular painkillers for a restless patient, and asked by a nurse to cannulate a stable patient whose cannula tissued.",
    instruction:
      "Rank the following actions in order of appropriateness from 1 (Most appropriate) to 5 (Least appropriate):",
    options: [
      { id: "A", label: "Immediately attend the septic patient and initiate the Sepsis 6 protocol while asking the nurse in charge to call the medical registrar.", idealRank: 1 },
      { id: "B", label: "Advise the ward nurse to give already-prescribed PRN analgesia to the restless patient while you prioritise the septic patient.", idealRank: 2 },
      { id: "C", label: "Defer non-urgent cannula insertion until the septic patient is stabilised and higher-priority duties are managed.", idealRank: 3 },
      { id: "D", label: "Quickly prescribe the painkillers first because it only takes two minutes, before reviewing the septic patient.", idealRank: 4 },
      { id: "E", label: "Attempt the cannula first so the daytime IV antibiotics are not missed, asking the ward sister to keep an eye on the septic patient.", idealRank: 5 },
    ],
    explanation:
      "Immediate threats to life always take absolute priority. A hypotensive septic patient is at severe risk of septic shock and organ failure requiring immediate bedside resuscitation (Option A). Delegation and triaging of stable tasks (B and C) ensure safe care across the hospital. Delaying resuscitation for routine analgesia or cannulation (D and E) severely endangers patient safety.",
  },
  {
    id: 3,
    badge: "PD.3",
    domain: "Empathy and Sensitivity",
    subTopic: "Patient-Centred Communication",
    vignette:
      "An 82-year-old patient with mild cognitive impairment is admitted with suspected bowel cancer. Her daughter, who holds lasting power of attorney for health, insists to you outside the room that her mother must NOT be told of the suspected diagnosis under any circumstances, as 'it would devastate her'.",
    instruction:
      "Rank the following actions in order of appropriateness from 1 (Most appropriate) to 5 (Least appropriate):",
    options: [
      { id: "A", label: "Explore the daughter's fears empathetically while explaining that patients with capacity have a legal right to be informed about their diagnosis.", idealRank: 1 },
      { id: "B", label: "Assess the patient's cognitive capacity and gently ask what she understands about her admission and how much detail she wishes to know.", idealRank: 2 },
      { id: "C", label: "Involve the consultant geriatrician and clinical nurse specialist to conduct a sensitive joint family discussion.", idealRank: 3 },
      { id: "D", label: "Immediately agree to the daughter's request to prevent upsetting the family dynamic.", idealRank: 4 },
      { id: "E", label: "Bluntly tell the patient the suspected cancer diagnosis immediately without addressing the family's concerns.", idealRank: 5 },
    ],
    explanation:
      "Patients with capacity have the fundamental right to information regarding their health. Collusion to withhold diagnosis compromises autonomy. Best medical practice entails validating family anxieties while assessing the patient's wishes and capacity with empathy (Options A and B). Submitting unconditionally to family concealment (D) or abrupt disclosure without preparation (E) are both poor practice.",
  },
];

function ProfessionalDilemmasPracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") || "Professional Integrity";
  const timerSetting = searchParams.get("timer") !== "off";

  const [questions, setQuestions] = useState<DilemmaQuestion[]>(DEFAULT_DILEMMA_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userRankings, setUserRankings] = useState<Record<number, string[]>>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes MSRA standard
  const [showExitModal, setShowExitModal] = useState(false);

  // Initialize rankings for current question
  useEffect(() => {
    if (!userRankings[currentIndex] && questions[currentIndex]) {
      setUserRankings((prev) => ({
        ...prev,
        [currentIndex]: questions[currentIndex].options.map((o) => o.id),
      }));
    }
  }, [currentIndex, questions, userRankings]);

  // Countdown timer if enabled
  useEffect(() => {
    if (!timerSetting) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSetting]);

  const currentQ = questions[currentIndex] || questions[0];
  const currentRankOrder = userRankings[currentIndex] || currentQ.options.map((o) => o.id);
  const isSubmitted = Boolean(submittedAnswers[currentIndex]);

  const moveOption = (index: number, direction: "up" | "down") => {
    if (isSubmitted) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentRankOrder.length) return;

    const updated = [...currentRankOrder];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setUserRankings((prev) => ({ ...prev, [currentIndex]: updated }));
  };

  const handleSubmitRanking = () => {
    setSubmittedAnswers((prev) => ({ ...prev, [currentIndex]: true }));
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

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const answeredMap: Record<number, boolean> = {};
  Object.keys(submittedAnswers).forEach((idxStr) => {
    answeredMap[parseInt(idxStr)] = true;
  });

  return (
    <div className="min-h-screen bg-[#edf0f4] text-slate-800 flex flex-col font-sans">
      {/* 1. Header Bar (Matching Figma frame 7522:3312) */}
      <header className="bg-[#082138] text-white border-b border-[#152e4a] sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1568px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Back link & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/professional-dilemmas"
              className="p-1.5 rounded-lg bg-[#0d2a47] hover:bg-[#13375c] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Exit Practice"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-white tracking-tight leading-snug">
                Professional Dilemmas → {topicParam}
              </h1>
              <span className="text-[11px] font-medium text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>
          </div>

          {/* Right: Timer & Finish */}
          <div className="flex items-center gap-3">
            {timerSetting && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d2a47] border border-[#1a3f65] text-cyan-300 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{formatCountdown(timeRemaining)}</span>
              </div>
            )}

            <button
              onClick={() => setShowExitModal(true)}
              className="px-4 py-2 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              End Session
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content (Left Navigator + Right Ranking Interface) */}
      <main className="flex-1 max-w-[1568px] w-full mx-auto p-4 sm:p-6 lg:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Question Navigator */}
          <div className="lg:col-span-1 space-y-4">
            <QuestionNavigator
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answeredIndices={answeredMap}
              flaggedIndices={flagged}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              title="PD Question Navigator"
            />
          </div>

          {/* Right: PD Ranking Question Card */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E0E4EA] shadow-xs space-y-6">
              {/* Meta & Flag Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-[#082138] text-white font-extrabold text-xs tracking-wide">
                    {currentQ.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentQ.domain} • {currentQ.subTopic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlagged((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }))}
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
              </div>

              {/* Scenario & Instruction */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-sm sm:text-base font-normal leading-relaxed">
                  {currentQ.vignette}
                </div>
                <div className="p-3 bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl flex items-center gap-2 text-xs font-bold text-[#059669]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{currentQ.instruction}</span>
                </div>
              </div>

              {/* Interactive Ranking List (1 Most Appropriate to 5 Least Appropriate) */}
              <div className="space-y-2.5 pt-1">
                {currentRankOrder.map((optId, rankIdx) => {
                  const opt = currentQ.options.find((o) => o.id === optId);
                  if (!opt) return null;

                  const isCorrectRank = isSubmitted && opt.idealRank === rankIdx + 1;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                        isSubmitted
                          ? isCorrectRank
                            ? "bg-emerald-50/70 border-emerald-300"
                            : "bg-amber-50/60 border-amber-200"
                          : "bg-white border-[#E0E4EA] hover:border-slate-300"
                      }`}
                    >
                      {/* Left: Rank Badge + Option Text */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div className="flex flex-col items-center justify-center shrink-0">
                          <span className="w-7 h-7 rounded-lg bg-[#082138] text-white font-extrabold text-xs flex items-center justify-center">
                            {rankIdx + 1}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">
                            {rankIdx === 0 ? "Most" : rankIdx === 4 ? "Least" : `Rank ${rankIdx + 1}`}
                          </span>
                        </div>

                        <span className="text-xs sm:text-sm text-slate-800 font-medium leading-snug">
                          {opt.label}
                        </span>
                      </div>

                      {/* Right: Move Up/Down Controls or Ideal Rank on Submit */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!isSubmitted ? (
                          <>
                            <button
                              type="button"
                              onClick={() => moveOption(rankIdx, "up")}
                              disabled={rankIdx === 0}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Rank Up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveOption(rankIdx, "down")}
                              disabled={rankIdx === currentRankOrder.length - 1}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Rank Down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
                            Ideal: {opt.idealRank}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* GMC Consensus Rationale (Appears Once Submitted) */}
              {isSubmitted && (
                <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[#1D82EB]">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <h4 className="font-bold text-sm text-[#0c4a6e]">
                      Official GMC Good Medical Practice Consensus & Rationale
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3">
                  {!isSubmitted ? (
                    <button
                      type="button"
                      onClick={handleSubmitRanking}
                      className="px-6 py-2.5 rounded-full bg-[#1D82EB] hover:bg-[#1875d2] active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Submit Ranking
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{currentIndex === questions.length - 1 ? "Complete Dilemma" : "Next Question"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
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
              Dilemma Session Finished
            </h3>
            <p className="text-xs text-slate-500">
              You reviewed {Object.keys(submittedAnswers).length} of {questions.length} ethical ranking scenarios in {topicParam}.
            </p>
            <div className="space-y-2 pt-2">
              <Link
                href="/dashboard/professional-dilemmas"
                className="w-full py-3 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] text-white font-bold text-xs sm:text-sm text-center block transition-all shadow-xs cursor-pointer"
              >
                Return to Dilemmas Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmittedAnswers({});
                  setCurrentIndex(0);
                  setShowExitModal(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center block transition-colors cursor-pointer"
              >
                Retry Scenarios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfessionalDilemmasPracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Professional Dilemmas Practice...</div>}>
      <ProfessionalDilemmasPracticeContent />
    </Suspense>
  );
}
