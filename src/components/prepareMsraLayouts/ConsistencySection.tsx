"use client";

import { useState } from "react";
import { Flame, Check } from "lucide-react";

export default function ConsistencySection() {
  const daysOfWeek = [
    { label: "Mon", active: true },
    { label: "Tue", active: true },
    { label: "Wed", active: true },
    { label: "Thu", active: true },
    { label: "Fri", active: true },
    { label: "Sat", active: true },
    { label: "Sun", active: false },
  ];

  const [systemCards, setSystemCards] = useState([
    {
      title: "System Performance",
      tags: ["Cardiovascular", "Respiratory", "Neurology"],
      checks: [true, true, true],
    },
    {
      title: "Clinical Knowledge",
      tags: ["Prescribing", "Investigations", "Management"],
      checks: [true, true, true],
    },
    {
      title: "Professional Dilemmas",
      tags: ["Prioritisation", "Communication", "Patient Safety"],
      checks: [true, true, false],
    },
    {
      title: "Mock Exam Average",
      tags: ["Full Mock 1", "Full Mock 2", "Full Mock 3"],
      checks: [true, false, false],
    },
  ]);

  const toggleCheck = (cardIdx: number, checkIdx: number) => {
    setSystemCards((prev) =>
      prev.map((card, cIdx) => {
        if (cIdx !== cardIdx) return card;
        const newChecks = [...card.checks];
        newChecks[checkIdx] = !newChecks[checkIdx];
        return { ...card, checks: newChecks };
      })
    );
  };

  return (
    <section className="w-full bg-white text-slate-800 py-16 sm:py-20 lg:py-24 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side (Streak tracker info) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#072438] tracking-tight leading-[1.18] mb-6">
              Consistency Builds Ranking — Not Cramming
            </h2>
            
            <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-md">
              Long-term performance tracking is proven to improve exam outcomes. Our dashboard tracks your progress continuously so you always know where to focus next.
            </p>

            {/* Streak Widget Box */}
            <div className="w-full max-w-md bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] relative overflow-hidden mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  🔥
                </div>
                <div>
                  <h3 className="font-extrabold text-[#072438] text-base leading-tight">30 Days Streak</h3>
                  <p className="text-slate-400 text-xs font-medium mt-0.5">Keep it going!</p>
                </div>
              </div>

              <hr className="border-slate-100 my-3" />

              {/* Custom keyframes for vibrant bumping background animation */}
              <style>{`
                @keyframes bumpingPill {
                  0%, 100% {
                    background-color: #E2E8F0;
                    border-color: #CBD5E1;
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(255, 107, 0, 0);
                  }
                  50% {
                    background-color: #FFEAD5;
                    border-color: #FF6B00;
                    transform: scale(1.08);
                    box-shadow: 0 0 12px 2px rgba(255, 107, 0, 0.3);
                  }
                }
                .animate-bumping-pill {
                  animation: bumpingPill 1.4s infinite ease-in-out;
                }
              `}</style>

              {/* 7 blocks with checkmarks for first 6, high-visibility bumping animated 7th block */}
              <div className="grid grid-cols-7 gap-2 text-center py-1">
                {[true, true, true, true, true, true, false].map((active, idx) => (
                  <div 
                    key={idx}
                    className={`h-9 rounded-xl flex items-center justify-center transition-all ${
                      active 
                        ? "bg-brand-orange text-white shadow-sm shadow-brand-orange/20" 
                        : "animate-bumping-pill border"
                    }`}
                  >
                    {active ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-brand-orange/80 animate-ping" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Green status banner */}
            <div className="w-full max-w-md bg-[#10B981] text-white rounded-2xl p-3.5 px-4 flex items-center gap-3 shadow-md">
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold leading-snug">
                You have answered 47 questions this week — ahead of target
              </span>
            </div>
          </div>

          {/* Right Side (Performance Cards) */}
          <div className="lg:col-span-7 w-full space-y-4">
            {systemCards.map((card, idx) => {
              const activeCount = card.checks.filter(Boolean).length;
              const progressPercent = activeCount === 3 ? 100 : Math.round((activeCount / 3) * 100);

              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3"
                >
                  {/* Top Row: Title + Interactive Check Buttons */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#072438] text-sm sm:text-base">{card.title}</span>
                    <div className="flex items-center gap-1.5">
                      {card.checks.map((checked, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => toggleCheck(idx, cIdx)}
                          title="Toggle completion state"
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                            checked
                              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                              : "bg-slate-200 text-slate-400 hover:bg-slate-300"
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtitle Tags */}
                  <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-400">
                    {card.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-slate-50 border border-slate-200/60 rounded-md px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic Progress Bar (100% when 3 buttons checked) */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <div 
                      className="bg-[#1D82EB] h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
