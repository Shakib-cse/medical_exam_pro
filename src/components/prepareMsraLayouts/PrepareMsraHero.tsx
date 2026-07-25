"use client";

import Link from "next/link";
import Image from "next/image";

export default function PrepareMsraHero() {
  return (
    <section className="relative w-full bg-[#072438] text-white pt-32 sm:pt-40 lg:pt-44 pb-16 lg:pb-24 overflow-hidden">
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
              Learn effectively, practice efficiently, and master the Multi-Specialty Recruitment Assessment with our comprehensive platform.
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
                className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-lg hover:scale-[1.02] active:scale-95"
              >
                Explore Question Bank
              </Link>
            </div>
          </div>

          {/* Right Dashboard Mockup Image */}
          <div className="lg:col-span-6 w-full flex justify-center">


            <div className="relative w-full rounded-b-xl overflow-hidden aspect-[16/10]">
              <Image
                src="/images/commonLayout/howtopreparemsrabanner.png"
                alt="MedicalExamPro MSRA Dashboard Mockup"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 576px"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
