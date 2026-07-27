"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export default function PrepareCTA() {
  const benefits = [
    "Comprehensive Question Bank",
    "Clinical Problem Solving Practice",
    "Professional Dilemmas Practice",
    "Full Mock Examinations",
    "Performance Tracking",
  ];

  return (
    <section className="w-full bg-secondary py-16 sm:py-20 lg:py-24 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="w-full bg-navy text-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                Prepare with Confidence
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                Access a structured MSRA preparation platform designed to help candidates improve performance through realistic practice and focused learning.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/auth/sign-up"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-7 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-md shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
                >
                  Start Your Preparation
                </Link>

                <Link
                  href="/dashboard/subscription"
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white border border-white/10 font-semibold px-7 py-3.5 rounded-full text-xs sm:text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95"
                >
                  View Subscription Plans
                </Link>
              </div>
            </div>

            {/* Right Checklist Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-navy-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-lg space-y-4">
                <h3 className="font-bold text-white text-base sm:text-lg mb-4">
                  Everything included in your preparation
                </h3>

                <div className="space-y-3.5">
                  {benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-slate-100 text-xs sm:text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
