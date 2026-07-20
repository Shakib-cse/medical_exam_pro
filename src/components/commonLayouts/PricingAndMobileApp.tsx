"use client";

import Link from "next/link";
import Image from "next/image";
import { Check, Star } from "lucide-react";

export default function PricingAndMobileApp() {
  return (
    <section className="w-full bg-background py-16 sm:py-20 lg:py-24 border-t border-border overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Pricing Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-foreground tracking-tight leading-tight mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base font-normal">
            Choose the plan that fits your exam timeline.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end max-w-5xl mx-auto mb-20">
          {/* Card 1: Sample questions (Free) */}
          <div className="bg-card text-card-foreground border border-border rounded-[32px] p-7 sm:p-8 flex flex-col justify-between shadow-sm text-left min-h-[450px]">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-foreground block mb-1">
                Sample questions
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                Free
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                Access a selection of sample questions covering both clinical
                problem-solving and professional dilemma scenarios to explore the
                style, depth, and quality of the question bank.
              </p>
            </div>
            <Link
              href="/auth/sign-up"
              className="w-full py-3 rounded-full border border-border text-foreground hover:bg-muted font-semibold text-xs sm:text-sm transition-colors text-center block"
            >
              Start Free
            </Link>
          </div>

          {/* Card 2: MSRA full question bank (Most Popular) */}
          <div className="bg-navy text-white border border-navy rounded-[32px] p-7 sm:p-8 md:py-10 flex flex-col justify-between shadow-2xl relative text-left my-2 md:my-0 min-h-[520px] z-10">
            <span className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-md">
              MOST POPULAR
            </span>

            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200 block mb-1 pt-2">
                MSRA full question bank
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                £24.99
              </h3>
              <span className="text-xs text-slate-300/70 block mb-6">
                Ideal for structured preparation
              </span>

              <ul className="space-y-3.5 text-xs text-slate-200 mb-8 text-left">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    Full access to more than{" "}
                    <strong className="text-brand-orange font-semibold">
                      10,000
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    MSRA-style questions, including over{" "}
                    <strong className="text-brand-orange font-semibold">
                      8,000
                    </strong>{" "}
                    problem-solving questions,
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-brand-orange font-semibold">
                      2,500+
                    </strong>{" "}
                    professional dilemma cases
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    access to{" "}
                    <strong className="text-brand-orange font-semibold">
                      10
                    </strong>{" "}
                    full mock exams
                  </span>
                </li>
              </ul>
            </div>

            <Link
              href="/checkout/full-bank"
              className="w-full py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-orange/25 text-center block"
            >
              Choose Plan
            </Link>
          </div>

          {/* Card 3: Standalone professional dilemmas */}
          <div className="bg-card text-card-foreground border border-border rounded-[32px] p-7 sm:p-8 flex flex-col justify-between shadow-sm text-left min-h-[420px]">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-foreground block mb-1">
                Standalone professional dilemmas
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                £8.99
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                Dedicated access to professional dilemma cases only, designed for
                focused situational judgement practice.
              </p>
            </div>
            <Link
              href="/checkout/dilemmas"
              className="w-full py-3 rounded-full border border-border text-foreground hover:bg-muted font-semibold text-xs sm:text-sm transition-colors text-center block"
            >
              Choose Plan
            </Link>
          </div>
        </div>

        {/* Mobile App Banner Card */}
        <div className="bg-navy text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 shadow-2xl max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white leading-[1.15] mb-5">
                <span className="block">Try Our</span>
                <span className="relative inline-block text-brand-orange my-1">
                  Mobile App
                  <svg
                    className="absolute left-0 -bottom-2.5 w-full h-3 text-[#ffc299]"
                    viewBox="0 0 200 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 7C55 3 145 3 197 7"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="block">today</span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-normal leading-relaxed max-w-lg mb-8">
                Study smarter on the go with full access to the MedicalExamPro
                question bank directly from your mobile device. Practise
                clinical scenarios, monitor your performance, and stay
                exam-ready wherever your training takes you.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8">
                {/* App Store */}
                <Link
                  href="#"
                  className="bg-[#0b3352] hover:bg-[#0f3e63] border border-white/20 px-5 py-2.5 rounded-xl flex items-center gap-3 transition-colors text-white"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.97.99-3.12-.98.04-2.18.66-2.88 1.48-.63.73-1.19 1.91-1.04 3.03 1.1.09 2.25-.56 2.93-1.39z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase text-slate-300 leading-tight">
                      Available on
                    </span>
                    <span className="text-xs sm:text-sm font-semibold leading-tight">
                      App Store
                    </span>
                  </div>
                </Link>

                {/* Google Play Store */}
                <Link
                  href="#"
                  className="bg-[#0b3352] hover:bg-[#0f3e63] border border-white/20 px-5 py-2.5 rounded-xl flex items-center gap-3 transition-colors text-white"
                >
                  <svg className="w-6 h-6 shrink-0" viewBox="0 0 512 512">
                    <path fill="#00D2FF" d="M38.8 11.2c-4.4 4.5-7.1 11.6-7.1 20.8V480c0 9.2 2.7 16.3 7.1 20.8l1.3 1.2L282.8 259.3V252.7L40.1 10z" />
                    <path fill="#00F076" d="M363.3 339.8l-80.5-80.5V252.7l80.5-80.5 1.4.8 95.3 54.2c27.2 15.4 27.2 40.7 0 56.2l-95.3 54.2-1.4 2.2z" />
                    <path fill="#FF3A44" d="M364.7 337.6L282.8 256 40.1 498.7c8.9 9.5 23.6 10.7 40.1 1.4l284.5-162.5z" />
                    <path fill="#FFA000" d="M364.7 174.4L80.2 11.9C63.7 2.6 49 3.8 40.1 13.3L282.8 256l81.9-81.6z" />
                  </svg>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase text-slate-300 leading-tight">
                      Available on
                    </span>
                    <span className="text-xs sm:text-sm font-semibold leading-tight">
                      Play Store
                    </span>
                  </div>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-navy">
                    A
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-navy">
                    S
                  </div>
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-navy">
                    M
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center border-2 border-navy">
                    +2k
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sky-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current text-sky-400" />
                  ))}
                </div>

                <span className="text-xs text-slate-300 font-normal">
                  Loved by 1M+ medical students
                </span>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <Image
                src="/images/commonLayout/mobile.png"
                alt="MedicalExamPro Mobile App Preview"
                width={700}
                height={550}
                priority
                className="w-full max-w-md h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
