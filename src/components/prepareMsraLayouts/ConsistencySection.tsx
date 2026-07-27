"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function ConsistencySection() {
  const [systemCards, setSystemCards] = useState([
    {
      week: "Week 1",
      subtitle: "Clinical Foundations",
      tags: ["Cardiology 40Q", "Respiratory 40Q", "Review errors"],
      checks: [true, true, true],
    },
    {
      week: "Week 2",
      subtitle: "Expanding Coverage",
      tags: ["Gastro 40Q", "Neurology 40Q", "Prof. Dilemmas 20Q"],
      checks: [true, true, true],
    },
    {
      week: "Week 3",
      subtitle: "Targeted Practice",
      tags: ["Weak areas", "Mixed questions", "Timed sets"],
      checks: [true, true, false],
    },
    {
      week: "Week 4",
      subtitle: "Mock & Refine",
      tags: ["Full mock exam", "Score analysis", "Final revision"],
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

          {/* Left Side (Text info) */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#072438] tracking-tight leading-[1.18] mb-6">
              Consistency Builds Ranking — Not Cramming
            </h2>

            <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed max-w-md">
              Research consistently shows that spaced repetition and regular practice outperform intensive last-minute study. A 30–40 minute daily session over 6–8 weeks is more effective than cramming in the final days.
            </p>
          </div>

          {/* Right Side (Week Performance Cards) */}
          <div className="lg:col-span-7 w-full space-y-4">
            {systemCards.map((card, idx) => {
              const activeCount = card.checks.filter(Boolean).length;
              const progressPercent = activeCount === 3 ? 100 : Math.round((activeCount / 3) * 100);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col gap-3"
                >
                  {/* Top Row: Title + Subtitle + Interactive Check Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#072438] text-sm sm:text-base">{card.week}</span>
                      <span className="text-slate-400 text-xs sm:text-sm font-normal">{card.subtitle}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {card.checks.map((checked, cIdx) => (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => toggleCheck(idx, cIdx)}
                          title="Toggle completion state"
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all cursor-pointer ${checked
                              ? "bg-[#10B981] text-white"
                              : "bg-slate-200 text-transparent hover:bg-slate-300"
                            }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtitle Tags */}
                  <div className="flex flex-wrap gap-2 text-[11px] sm:text-xs font-medium text-slate-500">
                    {card.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-[#F1F5F9] border border-slate-200/60 rounded-full px-3 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
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
