"use client";

import { useState } from "react";
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

interface QuestionNav {
  id: number;
  topic: string;
  status?: "correct" | "wrong";
  active?: boolean;
}

export default function PracticePage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const correctOption = "C";

  const questionNavigators: QuestionNav[] = [
    { id: 1, topic: "Heart Failure", status: "correct" },
    { id: 2, topic: "Rhythm disorders", status: "correct" },
    { id: 3, topic: "Coronary artery disease", status: "wrong" },
    { id: 4, topic: "Coronary artery disease", status: "wrong" },
    { id: 5, topic: "Valvular heart disease", status: "wrong" },
    { id: 6, topic: "Heart Failure", status: "wrong" },
    { id: 7, topic: "Valvular heart disease", status: "correct" },
    { id: 8, topic: "Heart Failure", status: "wrong" },
    { id: 9, topic: "Coronary artery disease", status: "wrong" },
    { id: 10, topic: "Coronary artery disease", active: true },
    { id: 11, topic: "Coronary artery disease", status: "wrong" },
  ];

  const options = [
    { id: "A", label: "Immediate thrombolysis with Tenecteplase" },
    { id: "B", label: "Primary Percutaneous Coronary Intervention (PCI) within 90 minutes" },
    { id: "C", label: "Dual antiplatelet therapy and risk assessment using the GRACE score" },
    { id: "D", label: "Aspirin 300mg and discharge with urgent outpatient follow-up" },
    { id: "E", label: "Continuous infusion of Heparin for 48 hours" },
  ];

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === correctOption;

  return (
    <div className="min-h-screen flex flex-col bg-[#edf0f4]">
      {/* Top Navigation Header */}
      <header className="h-16 w-full bg-[#07192b] text-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-md">
        {/* Left: Brand Logo & Topic Name */}
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
            Cardiology & Respiratory Focus
          </span>
        </div>

        {/* Center: Timer Pill */}
        <div className="flex items-center gap-2 bg-[#0c243b] border border-slate-700/80 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-inner">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>42:15</span>
        </div>

        {/* Right: Question Count & End Session Button */}
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-sm font-semibold text-slate-300">
            Question <span className="text-white font-bold">23</span> of 50
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

          <div className="space-y-1">
            {questionNavigators.map((q) => (
              <div
                key={q.id}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  q.active
                    ? "border-2 border-blue-600 bg-blue-50/80 text-blue-950 font-bold"
                    : "text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-slate-400 text-[11px] font-bold">
                    {q.id}
                  </span>
                  <span>{q.topic}</span>
                </div>

                {q.status === "correct" && (
                  <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
                )}
                {q.status === "wrong" && (
                  <X className="w-4 h-4 text-rose-500 stroke-[3]" />
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Right Main Question Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Main Question Card Container */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
            
            {/* Question Badge */}
            <div>
              <span className="inline-block bg-[#091b2c] text-white font-extrabold text-xs px-3 py-1 rounded-md shadow-xs">
                Q.10
              </span>
            </div>

            {/* Vignette Paragraph */}
            <p className="text-slate-700 text-sm leading-relaxed font-normal">
              A 65-year-old woman with type-2 diabetes was seen in the clinic for management of her cardiovascular risk. She had no history of cardiovascular disease and did not smoke. Her BMI was 25 kg/m² and her blood pressure was 125/80 mmHg. She had normal renal function and had no proteinuria. Her haemoglobin A1c was 6.5% (48 mmol/mol) and serum LDL cholesterol was 2.1 mmol/L (81 mg/dL). She was taking enalapril 10 mg daily, amlodipine 5 mg daily, gliclazide 80 mg twice daily and metformin 500 mg three times daily.
            </p>

            {/* Question Statement */}
            <h3 className="font-bold text-[#1e293b] text-base leading-snug">
              What is the most appropriate change to her treatment to reduce her cardiovascular risk?
            </h3>

            {/* Multiple Choice Options List */}
            <div className="space-y-3 pt-2">
              {options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrectOption = opt.id === correctOption;

                let optionStyles = "border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 text-slate-800";

                if (isAnswered) {
                  if (isCorrectOption) {
                    // Correct option is always highlighted green once answered
                    optionStyles = "border-2 border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold shadow-xs";
                  } else if (isSelected && !isCorrect) {
                    // Selected wrong option gets highlighted orange/red
                    optionStyles = "border-2 border-amber-500 bg-amber-50/80 text-amber-950 font-semibold shadow-xs";
                  } else {
                    optionStyles = "border border-slate-200 opacity-60 text-slate-500";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-4 text-xs sm:text-sm transition-all cursor-pointer ${optionStyles}`}
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

          {/* Feedback & Explanation Card (Appears after answer selection) */}
          {isAnswered && (
            <div
              className={`rounded-2xl p-6 border shadow-2xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ${
                isCorrect
                  ? "bg-[#ecfdf5] border-emerald-300/80"
                  : "bg-[#fff1f2] border-rose-200/90"
              }`}
            >
              {/* Feedback Title */}
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
                    {isCorrect ? `Correct Answer: ${correctOption}` : `Wrong Answer: ${selectedOption}`}
                  </h4>
                </div>
                <p
                  className={`text-xs font-bold pl-7 ${
                    isCorrect ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {options.find((o) => o.id === (isCorrect ? correctOption : selectedOption))?.label}
                </p>
              </div>

              {/* Explanation Text */}
              <div className="space-y-2 border-t border-slate-200/60 pt-3">
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                  <span className="font-bold text-slate-900">Explanation: </span>
                  This patient presents with NSTEMI (Non-ST-elevation myocardial infarction) as evidenced by ST depression in V4-V6 and elevated troponins. The correct management pathway involves dual antiplatelet therapy (aspirin plus P2Y12 inhibitor) combined with risk stratification using the GRACE score to determine need for invasive management. Primary PCI is only indicated for STEMI within 90 minutes, and thrombolysis is contraindicated in NSTEMI. The GRACE score helps identify high-risk patients who benefit from early coronary angiography.
                </p>
              </div>

              {/* Metadata Tags */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-200/60 text-[11px]">
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-tight">
                    TOPIC
                  </span>
                  <span className="font-bold text-slate-800">
                    Cardiology - ACS Management
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-tight">
                    DIFFICULTY
                  </span>
                  <span className={`font-bold ${isCorrect ? "text-emerald-600" : "text-amber-600"}`}>
                    Medium
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400 uppercase tracking-tight">
                    EXAM FREQUENCY
                  </span>
                  <span className="font-bold text-slate-800">
                    High-yield topic
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer">
                <Bookmark className="w-4 h-4 text-slate-500" />
                <span>Bookmark</span>
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-2xs cursor-pointer">
                <Flag className="w-4 h-4 text-slate-500" />
                <span>Flag for Review</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedOption(null)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#f96302] hover:bg-[#ea5b00] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
