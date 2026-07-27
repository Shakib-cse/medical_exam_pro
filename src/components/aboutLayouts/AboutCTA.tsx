"use client";

import Link from "next/link";
import Image from "next/image";

export default function AboutCTA() {
  return (
    <section className="w-full bg-[#F8FAFC] py-16 sm:py-20 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="bg-[#072438] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
                Founded on a clear understanding of UK medical training
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                Study smarter on-the-go with full access to the MedicalExamPro question bank directly from your mobile device. Practice clinical scenarios, monitor your performance, and stay exam-ready wherever your training takes you.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/auth/sign-up"
                  className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95"
                >
                  Start Free Sample
                </Link>

                <Link
                  href="/resources/msra-question-bank"
                  className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:scale-[1.02] active:scale-95"
                >
                  Explore Questions
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                <Image
                  src="/images/commonLayout/sectiontwo.png"
                  alt="MedicalExamPro Platform Preview"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
