"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, FileText, Scale, Timer } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-28 sm:pt-36 lg:pt-40 pb-10 sm:pb-14 text-white overflow-hidden">
      {/* High-quality optimized background image using Next.js Image component */}
      <Image
        src="/images/commonLayout/banner_opt.png"
        alt="MSRA Hero Banner"
        fill
        priority
        unoptimized
        className="object-cover object-[80%_center] sm:object-[75%_center] md:object-center pointer-events-none select-none"
      />


      {/* Gradient overlay for text contrast while keeping doctor picture visible */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent md:from-slate-950/85 md:via-slate-950/55 md:to-transparent pointer-events-none z-0" />
      {/* Soft dark radial glow directly behind the hero text content for maximum subtitle readability */}
      <div className="absolute top-16 left-0 w-[600px] h-[400px] bg-slate-950/60 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="container mx-auto px-4 relative z-10 flex flex-col justify-start gap-10 lg:gap-20">
        {/* Main Hero Left Content */}
        <div className="max-w-4xl pt-6 sm:pt-10 md:pt-14">
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-bold tracking-tight text-white leading-[1.12] mb-6">
            Prepare your strongest performance on the{" "}
            <span className="text-brand-orange">MSRA</span>
          </h1>

          <p className="text-slate-100 text-base sm:text-md lg:text-lg font-medium leading-relaxed max-w-xl mb-8 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.8)] [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
            Thousands of carefully written questions by UK doctors, tailored to
            the real MSRA and UK training applications
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="#"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-lg shadow-brand-orange/25 hover:scale-[1.02] active:scale-95"
            >
              Start Free Sample
            </Link>

            <Link
              href="/how-to-prepare/msra"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-md active:scale-95"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Bottom Stats Card */}
        <div className="w-full max-w-3xl mt-4 lg:mt-8">
          <div className="bg-[#093554]/85 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl p-3.5 sm:p-4 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-3 divide-y md:divide-y-0 md:divide-x divide-white/15">
              {/* Stat 1 */}
              <div className="flex flex-col items-start pt-1 md:pt-0 md:pr-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1D82EB]/30 border border-[#1D82EB]/30 flex items-center justify-center text-[#38BDF8] mb-2">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  10,000+
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-normal mt-0.5">
                  Questions
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-start pt-3 md:pt-0 md:px-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1D82EB]/30 border border-[#1D82EB]/30 flex items-center justify-center text-[#38BDF8] mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  8,000+
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-normal mt-0.5">
                  Clinical problem questions
                </span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-start pt-3 md:pt-0 md:px-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1D82EB]/30 border border-[#1D82EB]/30 flex items-center justify-center text-[#38BDF8] mb-2">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  2,500+
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-normal mt-0.5">
                  Professional dilemma cases
                </span>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-start pt-3 md:pt-0 md:pl-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1D82EB]/30 border border-[#1D82EB]/30 flex items-center justify-center text-[#38BDF8] mb-2">
                  <Timer className="w-5 h-5" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  10
                </span>
                <span className="text-[11px] sm:text-xs text-slate-300 font-normal mt-0.5">
                  Full mock exams
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

