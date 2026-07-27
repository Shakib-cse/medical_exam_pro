"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  Flag,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from "lucide-react";

interface Question {
  id: number;
  badge: string;
  topic: string;
  subTopic: string;
  vignette: string;
  question: string;
  options: { id: string; label: string }[];
  correctOption: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Moderate" | "Hard";
  frequency: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    badge: "Q.1",
    topic: "Cardiology",
    subTopic: "Heart Failure",
    vignette:
      "A 68-year-old male presents with worsening dyspnoea on exertion and ankle swelling over the past 3 weeks. On examination, his blood pressure is 138/84 mmHg, heart rate is 78 bpm, jugular venous pressure (JVP) is elevated at +4 cm, and bilateral basal crackles are heard on lung auscultation. Echocardiogram reveals an ejection fraction (LFEF) of 32%.",
    question:
      "Which medication combination is recommended as first-line prognosis-modifying therapy for this patient?",
    options: [
      { id: "A", label: "Furosemide alone" },
      { id: "B", label: "Digoxin and Diltiazem" },
      { id: "C", label: "ACE inhibitor (or ARNI), Beta-blocker, MRA, and SGLT2 inhibitor" },
      { id: "D", label: "Amlodipine and Nitrates" },
      { id: "E", label: "Isosorbide mononitrate and Bendroflumethiazide" },
    ],
    correctOption: "C",
    explanation:
      "In heart failure with reduced ejection fraction (HFrEF), four foundational prognostic medical therapies ('fantastic four') are recommended: an ACE inhibitor/ARNI, a evidence-based beta-blocker (e.g. Bisoprolol), a mineralocorticoid receptor antagonist (MRA like Spironolactone), and an SGLT2 inhibitor (e.g. Dapagliflozin/Empagliflozin). Furosemide provides symptom control but does not improve long-term survival.",
    difficulty: "Moderate",
    frequency: "High-yield topic",
  },
  {
    id: 2,
    badge: "Q.2",
    topic: "Cardiology",
    subTopic: "Rhythm disorders",
    vignette:
      "A 72-year-old woman with a history of hypertension attends the clinic for routine review. She reports occasional palpitations over the last month. 12-lead ECG demonstrates irregular rhythm with absent P waves and variable ventricular rate averaging 110 bpm.",
    question:
      "According to NICE guidelines, what is the initial step for stroke risk assessment in this patient?",
    options: [
      { id: "A", label: "HAS-BLED score" },
      { id: "B", label: "CHA2DS2-VASc score" },
      { id: "C", label: "Grace score" },
      { id: "D", label: "Wells score" },
      { id: "E", label: "Framingham risk score" },
    ],
    correctOption: "B",
    explanation:
      "For patients with newly diagnosed atrial fibrillation, NICE recommends using the CHA2DS2-VASc score to assess stroke risk and guide anticoagulation decisions. HAS-BLED is used to assess bleeding risk before initiating anticoagulation.",
    difficulty: "Medium",
    frequency: "High-yield topic",
  },
  {
    id: 3,
    badge: "Q.3",
    topic: "Cardiology",
    subTopic: "Coronary artery disease",
    vignette:
      "A 65-year-old woman with type-2 diabetes presents to the emergency department with central crushing chest discomfort lasting for 45 minutes radiating to her left jaw. ECG shows ST-segment elevation of 3 mm in leads V1-V4.",
    question:
      "What is the definitive first-line emergency management if available within 120 minutes?",
    options: [
      { id: "A", label: "Immediate thrombolysis with Tenecteplase" },
      { id: "B", label: "Primary Percutaneous Coronary Intervention (PCI)" },
      { id: "C", label: "Dual antiplatelet therapy alone and outpatient follow-up" },
      { id: "D", label: "Continuous infusion of Heparin for 48 hours" },
      { id: "E", label: "Elective coronary artery bypass grafting (CABG)" },
    ],
    correctOption: "B",
    explanation:
      "For STEMI presenting within 12 hours of onset, Primary Percutaneous Coronary Intervention (pPCI) is the gold-standard treatment provided it can be delivered within 120 minutes of medical contact. Thrombolysis is reserved when pPCI cannot be delivered within target time.",
    difficulty: "Medium",
    frequency: "High-yield topic",
  },
  {
    id: 4,
    badge: "Q.4",
    topic: "Cardiology",
    subTopic: "Valvular heart disease",
    vignette:
      "An 80-year-old man presents with exhalation syncope and exertional chest tightness. On examination, a crescendo-decrescendo ejection systolic murmur is loudest at the right upper sternal border, radiating to the carotid arteries. Pulse volume is low and slow-rising (pulsus parvus et tardus).",
    question:
      "What is the most likely underlying diagnosis?",
    options: [
      { id: "A", label: "Mitral regurgitation" },
      { id: "B", label: "Aortic regurgitation" },
      { id: "C", label: "Aortic stenosis" },
      { id: "D", label: "Tricuspid stenosis" },
      { id: "E", label: "Mitral valve prolapse" },
    ],
    correctOption: "C",
    explanation:
      "Severe calcific aortic stenosis classically presents with the triad of Angina, Syncope, and Heart failure (SAD). Key physical findings include an ejection systolic murmur radiating to carotids, slow-rising pulse, and narrow pulse pressure.",
    difficulty: "Medium",
    frequency: "High-yield topic",
  },
  {
    id: 5,
    badge: "Q.5",
    topic: "Renal / Urology",
    subTopic: "Acute Kidney Injury",
    vignette:
      "A 75-year-old male is admitted with sepsis secondary to pneumonia. Blood results show serum creatinine has risen from 90 µmol/L baseline to 280 µmol/L. Serum potassium is 6.8 mmol/L with ECG showing tall peaked T waves.",
    question:
      "What is the immediate priority medical treatment to prevent lethal arrhythmia?",
    options: [
      { id: "A", label: "Oral calcium polystyrene sulfonate" },
      { id: "B", label: "Intravenous Calcium Gluconate (10%)" },
      { id: "C", label: "Intravenous Furosemide 80 mg" },
      { id: "D", label: "Nebulised Salbutamol 5 mg" },
      { id: "E", label: "Emergency haemodialysis" },
    ],
    correctOption: "B",
    explanation:
      "In severe hyperkalaemia with ECG changes (peaked T waves, broadened QRS), the immediate emergency treatment is IV Calcium Gluconate (10%) to stabilize the myocardial membrane. Insulin-dextrose and salbutamol shift potassium intracellularly but take 15–30 mins.",
    difficulty: "Hard",
    frequency: "High-yield topic",
  },
  {
    id: 6,
    badge: "Q.6",
    topic: "Respiratory",
    subTopic: "COPD Exacerbation",
    vignette:
      "A 64-year-old smoker with severe COPD presents with severe breathlessness and increased sputum purulence. Arterial Blood Gas (ABG) on room air shows: pH 7.28, PaCO2 7.8 kPa, PaO2 6.9 kPa, HCO3- 29 mmol/L.",
    question:
      "Following controlled oxygen therapy and nebulisers, what is the next most appropriate intervention?",
    options: [
      { id: "A", label: "High-flow nasal cannula at 60 L/min" },
      { id: "B", label: "Intensive care invasive endotracheal intubation" },
      { id: "C", label: "Non-Invasive Ventilation (NIV / BiPAP)" },
      { id: "D", label: "Intravenous Aminophylline infusion" },
      { id: "E", label: "Hyperbaric oxygen therapy" },
    ],
    correctOption: "C",
    explanation:
      "In acute exacerbations of COPD with respiratory acidosis (pH < 7.35 and PaCO2 > 6.0 kPa) despite optimal medical therapy, Non-Invasive Ventilation (NIV / BiPAP) is the first-line treatment of choice.",
    difficulty: "Moderate",
    frequency: "High-yield topic",
  },
  {
    id: 7,
    badge: "Q.7",
    topic: "Respiratory",
    subTopic: "Acute Asthma",
    vignette:
      "A 24-year-old woman presents to ED with acute asthma. She is unable to complete sentences in one breath. Respiratory rate is 32/min, heart rate 125 bpm, and PEFR is 40% of predicted.",
    question:
      "Which feature would classify this asthma presentation as 'Life-Threatening' rather than 'Severe'?",
    options: [
      { id: "A", label: "Heart rate > 110 bpm" },
      { id: "B", label: "Peak Expiratory Flow (PEFR) < 33% of predicted" },
      { id: "C", label: "Respiratory rate > 25/min" },
      { id: "D", label: "Inability to complete sentences" },
      { id: "E", label: "Widespread wheeze" },
    ],
    correctOption: "B",
    explanation:
      "NICE/BTS guidelines classify Acute Asthma as Life-Threatening if any of the following are present: PEFR < 33%, Silent chest, Cyanosis, Poor respiratory effort, Bradycardia, Hypotension, Exhaustion, or Normal/High PaCO2.",
    difficulty: "Medium",
    frequency: "High-yield topic",
  },
  {
    id: 8,
    badge: "Q.8",
    topic: "Endocrinology",
    subTopic: "Type 2 Diabetes",
    vignette:
      "A 52-year-old male with type 2 diabetes has an HbA1c of 64 mmol/mol (8.0%) despite Metformin 1g BD. He has established ischemic heart disease. BMI is 31 kg/m².",
    question:
      "What is the recommended add-on second-line therapy according to NICE guidelines?",
    options: [
      { id: "A", label: "Sulfonylurea (Gliclazide)" },
      { id: "B", label: "SGLT2 inhibitor or GLP-1 receptor agonist with proven CV benefit" },
      { id: "C", label: "Basal Insulin regimen" },
      { id: "D", label: "Pioglitazone" },
      { id: "E", label: "Acarbose" },
    ],
    correctOption: "B",
    explanation:
      "NICE guidelines mandate that for adults with T2DM and established cardiovascular disease (CVD), an SGLT2 inhibitor (e.g. Empagliflozin, Dapagliflozin) or GLP-1 RA should be offered early alongside Metformin.",
    difficulty: "Medium",
    frequency: "High-yield topic",
  },
  {
    id: 9,
    badge: "Q.9",
    topic: "Neurology",
    subTopic: "Acute Stroke",
    vignette:
      "A 62-year-old man presents with sudden right-sided hemiparesis and expressive aphasia starting 90 minutes ago. Non-contrast head CT scan rules out intracranial hemorrhage.",
    question:
      "What is the definitive immediate intervention indicated for thrombolysis?",
    options: [
      { id: "A", label: "Intravenous Alteplase (rt-PA) within 4.5 hours of onset" },
      { id: "B", label: "Oral Clopidogrel 300 mg" },
      { id: "C", label: "Intravenous Heparin bolus" },
      { id: "D", label: "Therapeutic hypothermia" },
      { id: "E", label: "Carotid endarterectomy" },
    ],
    correctOption: "A",
    explanation:
      "In acute ischemic stroke, IV Alteplase (rt-PA) is indicated within 4.5 hours of symptom onset once intracranial hemorrhage is ruled out by non-contrast CT.",
    difficulty: "Moderate",
    frequency: "High-yield topic",
  },
  {
    id: 10,
    badge: "Q.10",
    topic: "Pharmacology",
    subTopic: "Therapeutics",
    vignette:
      "A 45-year-old patient taking Warfarin for a mechanical prosthetic heart valve presents with hematuria. INR is measured at 8.2 with no major overt life-threatening bleeding.",
    question:
      "What is the recommended management step according to UK prescribing guidelines?",
    options: [
      { id: "A", label: "Immediate Prothrombin Complex Concentrate (PCC) 50 units/kg" },
      { id: "B", label: "Withhold Warfarin, give Oral Vitamin K (1-5 mg)" },
      { id: "C", label: "Continue Warfarin at half dose" },
      { id: "D", label: "Intravenous protamine sulfate" },
      { id: "E", label: "Fresh Frozen Plasma (FFP) 15 ml/kg" },
    ],
    correctOption: "B",
    explanation:
      "For INR > 8.0 with minor bleeding (e.g. hematuria), NICE/BNF guidelines advise withholding Warfarin and administering oral Vitamin K (1-5 mg). PCC is reserved for major life-threatening bleeding.",
    difficulty: "Hard",
    frequency: "High-yield topic",
  },
];

const STORAGE_KEY = "medicalexampro_practice_session";

function PracticeContent() {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic") || "Cardiology & Respiratory Focus";
  const modeParam = searchParams.get("mode");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeElapsed, setTimeElapsed] = useState(0); // Starts at 0 seconds
  const [activeTopic, setActiveTopic] = useState(topicParam);
  const [isLoaded, setIsLoaded] = useState(false);

  // Read / Resume session from localStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSessionStr = localStorage.getItem(STORAGE_KEY);
      if (savedSessionStr) {
        try {
          const saved = JSON.parse(savedSessionStr);

          if (modeParam === "resume") {
            // Resume exact test session
            if (typeof saved.currentIndex === "number") setCurrentIndex(saved.currentIndex);
            if (typeof saved.timeElapsed === "number") setTimeElapsed(saved.timeElapsed);
            if (saved.userAnswers) setUserAnswers(saved.userAnswers);
            if (saved.bookmarked) setBookmarked(saved.bookmarked);
            if (saved.flagged) setFlagged(saved.flagged);
            if (saved.topic) setActiveTopic(saved.topic);
          } else if (searchParams.get("topic")) {
            // New topic selected from dashboard - start at 0
            setCurrentIndex(0);
            setTimeElapsed(0);
            setUserAnswers({});
            setActiveTopic(topicParam);
          } else if (typeof saved.currentIndex === "number") {
            // Default resume if existing session exists
            setCurrentIndex(saved.currentIndex);
            if (typeof saved.timeElapsed === "number") setTimeElapsed(saved.timeElapsed);
            if (saved.userAnswers) setUserAnswers(saved.userAnswers);
            if (saved.topic) setActiveTopic(saved.topic);
          }
        } catch (e) {
          console.error("Failed to parse saved session", e);
        }
      }
      setIsLoaded(true);
    }
  }, [modeParam, topicParam, searchParams]);

  // Live Elapsed Timer counting UP from 0
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoaded]);

  // Continuously sync session state to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    if (typeof window !== "undefined") {
      const sessionData = {
        currentIndex,
        timeElapsed,
        userAnswers,
        bookmarked,
        flagged,
        topic: activeTopic,
        totalQuestions: sampleQuestions.length,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    }
  }, [currentIndex, timeElapsed, userAnswers, bookmarked, flagged, activeTopic, isLoaded]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQ = sampleQuestions[currentIndex] || sampleQuestions[0];
  const selectedOption = userAnswers[currentQ.id] || null;
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correctOption;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optionId }));
  };

  const toggleBookmark = () => {
    setBookmarked((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#edf0f4] text-slate-600 font-bold">
        Loading test session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#edf0f4]">
      {/* Top Header Navigation */}
      <header className="h-16 w-full bg-[#07192b] text-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <Image
            src="/images/commonLayout/headerlogo.png"
            alt="MedicalExamPro"
            width={140}
            height={20}
            className="object-contain"
          />
          <span className="hidden sm:inline-block text-slate-500">|</span>
          <span className="font-bold text-sm sm:text-base text-slate-200">
            {activeTopic}
          </span>
        </div>

        {/* Elapsed Timer Pill starting from 0 */}
        <div className="flex items-center gap-2 bg-[#0c243b] border border-slate-700/80 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>{formatTimer(timeElapsed)}</span>
        </div>

        {/* Question Counter & End Session Button */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-sm font-semibold text-slate-300">
            Question <span className="text-white font-bold">{currentIndex + 1}</span> of {sampleQuestions.length}
          </span>
          <Link
            href="/dashboard"
            className="px-4 py-1.5 rounded-md bg-[#f96302] hover:bg-[#ea5b00] text-white text-xs font-bold transition-all shadow-xs"
          >
            End Session
          </Link>
        </div>
      </header>

      {/* Main Practice Workspace */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1536px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar: Question Navigator */}
        <aside className="lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            QUESTION NAVIGATOR
          </h4>

          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {sampleQuestions.map((q, idx) => {
              const qAnswered = userAnswers[q.id];
              const isQCorrect = qAnswered === q.correctOption;
              const isActive = idx === currentIndex;

              return (
                <div
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "border-2 border-blue-600 bg-blue-50/80 text-blue-950 font-bold"
                      : "text-slate-700 hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-slate-400 text-[11px] font-bold shrink-0">
                      {q.id}
                    </span>
                    <span className="truncate">{q.subTopic}</span>
                  </div>

                  {qAnswered && isQCorrect && (
                    <Check className="w-4 h-4 text-emerald-500 stroke-[3] shrink-0" />
                  )}
                  {qAnswered && !isQCorrect && (
                    <X className="w-4 h-4 text-rose-500 stroke-[3] shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Main Question Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Question Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
            
            {/* Question Badge */}
            <div>
              <span className="inline-block bg-[#091b2c] text-white font-extrabold text-xs px-3 py-1 rounded-md shadow-xs">
                {currentQ.badge}
              </span>
            </div>

            {/* Vignette Paragraph */}
            <p className="text-slate-700 text-sm leading-relaxed font-normal">
              {currentQ.vignette}
            </p>

            {/* Question Statement */}
            <h3 className="font-bold text-[#1e293b] text-base leading-snug">
              {currentQ.question}
            </h3>

            {/* Multiple Choice Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOption = opt.id === currentQ.correctOption;

                let optionStyles = "border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800";

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyles = "border-2 border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs cursor-default";
                  } else if (isSelected && !isCorrect) {
                    optionStyles = "border-2 border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-xs cursor-default";
                  } else {
                    optionStyles = "border border-slate-200 opacity-60 text-slate-500 cursor-default";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 text-xs sm:text-sm transition-all ${
                      isAnswered ? "cursor-default" : "cursor-pointer"
                    } ${optionStyles}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 font-bold text-xs ${
                        isAnswered && isCorrectOption
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : isAnswered && isSelected && !isCorrect
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-slate-300 text-slate-500"
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="flex-1 font-medium leading-relaxed">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Explanation Card */}
          {isAnswered && (
            <div
              className={`rounded-2xl p-6 border shadow-2xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
                isCorrect
                  ? "bg-[#ecfdf5] border-emerald-300/80"
                  : "bg-[#fff1f2] border-rose-200/90"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <h4
                    className={`font-bold text-base ${
                      isCorrect ? "text-emerald-900" : "text-rose-900"
                    }`}
                  >
                    {isCorrect ? `Correct Answer: ${currentQ.correctOption}` : `Wrong Answer: ${selectedOption}`}
                  </h4>
                </div>
                <p
                  className={`text-xs font-bold pl-7 ${
                    isCorrect ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {currentQ.options.find((o) => o.id === (isCorrect ? currentQ.correctOption : selectedOption))?.label}
                </p>
              </div>

              {/* Explanation Text */}
              <div className="space-y-2 border-t border-slate-200/60 pt-3">
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                  <span className="font-bold text-slate-900">Explanation: </span>
                  {currentQ.explanation}
                </p>
              </div>

              {/* Metadata Tags */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-200/60 text-[11px]">
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-tight">
                    TOPIC
                  </span>
                  <span className="font-bold text-slate-800">
                    {currentQ.topic} - {currentQ.subTopic}
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-tight">
                    DIFFICULTY
                  </span>
                  <span className={`font-bold ${isCorrect ? "text-emerald-600" : "text-amber-600"}`}>
                    {currentQ.difficulty}
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-tight">
                    EXAM FREQUENCY
                  </span>
                  <span className="font-bold text-slate-800">
                    {currentQ.frequency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#091b2c] text-white text-xs font-bold hover:bg-[#061422] transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  bookmarked[currentQ.id]
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked[currentQ.id] ? "fill-current text-blue-600" : "text-slate-500"}`} />
                <span>Bookmark</span>
              </button>

              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                  flagged[currentQ.id]
                    ? "bg-amber-50 border-amber-300 text-amber-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Flag className={`w-4 h-4 ${flagged[currentQ.id] ? "fill-current text-amber-600" : "text-slate-500"}`} />
                <span>Flag for Review</span>
              </button>
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % sampleQuestions.length)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#f96302] hover:bg-[#ea5b00] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>{currentIndex === sampleQuestions.length - 1 ? "Finish Test" : "Next Question"}</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </main>
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
