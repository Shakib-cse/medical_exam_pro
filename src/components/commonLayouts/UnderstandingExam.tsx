"use client";

import Link from "next/link";
import { Laptop, ShieldCheck, Trophy, ChevronRight } from "lucide-react";

export default function UnderstandingExam() {
  const cards = [
    {
      icon: Laptop,
      text: "The MSRA is a computer-based exam used for selection into UK postgraduate training, including GP and specialty programmes, and is designed to assess how doctors make decisions in everyday clinical scenarios.",
    },
    {
      icon: ShieldCheck,
      text: "Questions are written to test safe prioritisation, investigation choice, and management decisions, rather than detailed factual recall.",
    },
    {
      icon: Trophy,
      text: "With increasing competition across most training pathways, including GP training, strong MSRA performance has become an important differentiator.",
    },
  ];

  return (
    <section className="w-full bg-navy text-white py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-tight mb-3">
            Understanding the <span className="text-brand-orange">MSRA</span> exam
          </h2>
          <div className="w-28 h-1 bg-gradient-to-r from-sky-400 to-transparent rounded-full" />
        </div>

        {/* 3 Cards Stack */}
        <div className="flex flex-col gap-4 sm:gap-5 w-full">
          {cards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-navy-card/80 hover:bg-navy-card border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6 shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#093554] border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm md:text-base text-slate-200/90 font-normal leading-relaxed text-center sm:text-left">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-8 flex justify-center sm:justify-start">
          <Link
            href="/resources/msra-exam-guide"
            className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-md shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
          >
            <span>Learn more about the MSRA exam</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
