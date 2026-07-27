"use client";

import Image from "next/image";
import { Zap, Layers, Eye, Target } from "lucide-react";

export default function LearningThroughPractice() {
  const stats = [
    { value: "2,400+", label: "Questions" },
    { value: "18", label: "Specialties" },
    { value: "98%", label: "Exam Relevance" },
    { value: "4.9★", label: "Exam Relevance" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Active Learning",
      description:
        "Engage with material through application rather than passive reading. Each question demands recall, analysis, and clinical reasoning.",
    },
    {
      icon: Layers,
      title: "Knowledge Application",
      description:
        "Translate theoretical understanding into practical decision-making, mirroring real MSRA exam scenarios precisely.",
    },
    {
      icon: Eye,
      title: "Pattern Recognition",
      description:
        "Repeated exposure to question formats trains rapid identification of clinical presentations and professional scenarios.",
    },
    {
      icon: Target,
      title: "Exam Familiarity",
      description:
        "Reduce exam-day anxiety by practising in conditions identical to the real MSRA. Timing, format, and difficulty matched.",
    },
  ];

  return (
    <section className="w-full bg-secondary text-slate-800 py-16 sm:py-20 lg:py-24 border-t border-border">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-navy tracking-tight mb-4">
            Learning Through Practice
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The most effective MSRA preparation is built on consistent question practice. Our structured question bank develops the clinical reasoning and professional judgement needed to excel.
          </p>
        </div>

        {/* Clean Mockup Image */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <Image
            src="/images/commonLayout/sectiontwo.png"
            alt="MedicalExamPro Practice Question Screen Mockup"
            width={1600}
            height={1000}
            priority
            quality={100}
            className="w-full h-auto rounded-2xl object-contain"
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mx-auto mb-12 sm:mb-16">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 text-center shadow-sm">
              <span className="block text-3xl sm:text-4xl font-bold text-brand-blue tracking-tight mb-1">{stat.value}</span>
              <span className="block text-slate-500 text-xs sm:text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col items-start text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
