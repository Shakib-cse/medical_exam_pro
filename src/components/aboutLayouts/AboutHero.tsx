"use client";

import Link from "next/link";
import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative w-full bg-[#072438] text-white pt-32 sm:pt-40 lg:pt-44 pb-16 lg:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6">
              ABOUT US
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Built for the realities of competitive UK medical training
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed mb-8 max-w-xl">
              MedicalExamPro was created to give doctors the structured, exam-relevant preparation they need to succeed in high-stakes UK specialty recruitment — starting with MSRA.
            </p>

            <Link
              href="/resources/msra-question-bank"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
            >
              Explore Question Bank
            </Link>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#093554]/50">
              <Image
                src="/images/commonLayout/about_doctors.png"
                alt="UK Doctors Team"
                width={700}
                height={480}
                priority
                className="w-full h-100 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
