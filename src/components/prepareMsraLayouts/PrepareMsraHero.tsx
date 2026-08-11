"use client";

import Link from "next/link";
import Image from "next/image";

export default function PrepareMsraHero() {
  return (
    <section className="relative w-full bg-navy text-white pt-32 sm:pt-40 lg:pt-44 pb-16 lg:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              Guide
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              How to Prepare for the <span className="text-brand-orange">MSRA</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-xl">
              A structured approach to MSRA preparation focused on clinical knowledge, professional judgement, realistic practice, and exam performance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/auth/sign-up"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
              >
                Start Preparing
              </Link>

              <Link
                href="/resources/msra-question-bank"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-md active:scale-95"
              >
                Explore Question Bank
              </Link>
            </div>
          </div>

          {/* Right Dashboard Mockup Image */}
          <div className="lg:col-span-6 w-full flex justify-center items-center">
            <Image
              src="/images/commonLayout/howtopreparemsrabanner.png"
              alt="MedicalExamPro MSRA Dashboard Mockup"
              width={1400}
              height={880}
              priority
              quality={100}
              className="w-full h-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
