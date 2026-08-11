"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function OurStory() {
  return (
    <section className="w-full bg-[#072438] py-16 sm:py-20 lg:py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              OUR STORY
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.2] mb-6">
              Founded on a clear understanding of UK medical training
            </h2>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                Securing a training number in many specialties now requires not only clinical knowledge, but examination technique, decision-making clarity, and performance under time pressure. Medical ExamPro was built around these realities.
              </p>

              <p>
                Our long-term vision is to provide a centralised, structured preparation environment for doctors navigating competitive UK medical training pathways starting with the MSRA and expanding to additional examinations and interview formats over time.
              </p>
            </div>
          </div>

          {/* Right Side Stacked Cards */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Card 1 - Current Focus */}
            <div className="bg-[#0B3A5C] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] mb-2">
                CURRENT FOCUS
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Multi-Specialty Recruitment Assessment (MSRA)
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                A high-stakes assessment used across General Practice and multiple specialty training pathways. Our platform provides a structured question bank, realistic mock examinations, and targeted preparation resources.
              </p>
            </div>

            {/* Card 2 - Coming Soon */}
            <div className="bg-[#0B3A5C]/80 border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                COMING SOON
              </span>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2.5 text-sm sm:text-base text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Additional specialty examinations</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm sm:text-base text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Interview preparation resources</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm sm:text-base text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Portfolio & application support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
