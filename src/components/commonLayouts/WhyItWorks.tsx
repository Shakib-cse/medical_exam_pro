"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function WhyItWorks() {
  return (
    <section className="w-full bg-background py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-foreground tracking-tight leading-[1.2] mb-6 sm:mb-8">
              Why MedicalExamPro Works
            </h2>

            <div className="space-y-5 sm:space-y-6 text-foreground/80 text-sm sm:text-base font-normal leading-relaxed max-w-xl mb-8">
              <p>
                Written by UK doctors with a clear understanding of how the
                MSRA is assessed and what candidates are expected to demonstrate.
              </p>

              <p>
                Questions aligned with the real MSRA exam and its blueprint,
                focusing on safe, realistic clinical decision-making rather
                than obscure facts.
              </p>

              <p>
                Clear, structured explanations that explain not only the correct
                answer, but why other options are less appropriate in an exam
                context.
              </p>

              <p>
                Designed for doctors applying to UK postgraduate training,
                including GP and specialty training programmes.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href="/resources/msra-question-bank"
              className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition-all shadow-md shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
            >
              <span>Learn more about the MSRA question bank</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Right Image Preview */}
          <div className="lg:col-span-7 w-full flex justify-center">
            <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
              <Image
                src="/images/commonLayout/sectiontwo.png"
                alt="Why MedicalExamPro Works - Dashboard Preview"
                width={1200}
                height={750}
                priority
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
