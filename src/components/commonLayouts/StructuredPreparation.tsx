"use client";

import Link from "next/link";
import { GraduationCap, Scale, Brain, ChevronRight } from "lucide-react";

export default function StructuredPreparation() {
  const steps = [
    {
      icon: GraduationCap,
      title: "1. Practise by clinical system",
      description:
        "Work through questions organised by clinical systems to build safe, exam-relevant decision-making.",
    },
    {
      icon: Scale,
      title: "2. Develop exam-ready judgement",
      description:
        "Use mixed question sessions and professional dilemma cases to practise prioritisation and clinical judgement under exam conditions.",
    },
    {
      icon: Brain,
      title: "3. Sit full mock exams",
      description:
        "Prepare for timing, pacing, and exam pressure with full-length MSRA-style mock exams.",
    },
  ];

  return (
    <section className="w-full bg-background py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-foreground tracking-tight leading-[1.18] mb-4">
              A structured way to prepare for the{" "}
              <span className="text-brand-orange">MSRA</span>
            </h2>

            <div className="w-28 h-1 bg-gradient-to-r from-sky-400 to-transparent rounded-full mb-6" />

            <p className="text-muted-foreground text-sm sm:text-base font-normal leading-relaxed max-w-md mb-8">
              The Multi-Specialty Recruitment Assessment (MSRA) evaluates your
              clinical knowledge and situational judgement under intense
              pressure.
            </p>

            <Link
              href="/resources/start-sample"
              className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-md shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
            >
              <span>Start free sample questions</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Right Cards Column */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 w-full">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-navy-card border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 shadow-xl text-center sm:text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-bold text-white text-base sm:text-lg mb-1">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                      {step.description}
                    </p>
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
