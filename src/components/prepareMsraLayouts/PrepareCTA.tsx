"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export default function PrepareCTA() {
  const benefits = [
    "Over 2,000+ MSRA questions",
    "Clinical & SJT paper coverage",
    "Performance tracking dashboard",
    "High-yield guideline summaries",
    "Expert UK clinician content",
  ];

  return (
    <section className="w-full bg-[#f1f5f9] py-16 sm:py-20 lg:py-24 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="w-full bg-[#08283F] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Prepare with Confidence!
              </h2>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                Start practicing today with our comprehensive MSRA question bank. Designed by UK doctors for future UK specialty trainees.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/auth/sign-up"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
                >
                  Start Preparing
                </Link>

                <Link
                  href="/resources/msra-question-bank"
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white border border-white/10 font-semibold px-6 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95"
                >
                  Explore Question Bank
                </Link>
              </div>
            </div>

            {/* Right Checklist */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end">
              <div className="space-y-3.5 w-full max-w-sm">
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider mb-2 text-center lg:text-left">
                  Everything included in your preparation:
                </div>
                
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                    </div>
                    <span className="text-slate-200 text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
