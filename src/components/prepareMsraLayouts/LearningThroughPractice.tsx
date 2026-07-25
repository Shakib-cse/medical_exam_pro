"use client";

import Image from "next/image";
import { BookOpen, Target, Filter, Sliders } from "lucide-react";

export default function LearningThroughPractice() {
  const stats = [
    { value: "2,000+", label: "Questions" },
    { value: "12", label: "Specialties" },
    { value: "98%", label: "Syllabus Coverage" },
    { value: "SBA", label: "& EMQ Formats" },
  ];

  const features = [
    {
      icon: BookOpen,
      title: "Active Recall",
      description: "Test your knowledge with condition-specific questions that mirror the real exam style.",
    },
    {
      icon: Target,
      title: "Clinical Application",
      description: "Apply clinical guidelines to realistic patient presentations, from presentation to management.",
    },
    {
      icon: Filter,
      title: "Pattern Recognition",
      description: "Train yourself to identify key diagnostic clues, investigation priorities, and red flags quickly.",
    },
    {
      icon: Sliders,
      title: "Domain Mastery",
      description: "Strengthen your performance across high-yield topics with detailed explanations and guidance.",
    },
  ];

  return (
    <section className="w-full bg-[#f1f5f9] text-slate-800 py-16 sm:py-20 lg:py-24 border-t border-slate-200">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#072438] tracking-tight mb-4">
            Learning Through Practice
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We believe active recall through question practice is the most effective way to prepare for the MSRA. Our questions are crafted by expert UK clinicians to reflect the exact exam format.
          </p>
        </div>

        {/* Large Mockup Image inside a Browser Frame */}
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-2 border border-slate-200 shadow-2xl relative overflow-hidden mb-16 transition-all duration-300 hover:shadow-indigo-100/10">
          {/* Browser window top bar decoration */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-slate-50 rounded-t-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            <div className="flex-1 max-w-[240px] bg-slate-100 rounded-md h-5 mx-auto border border-slate-200/60 flex items-center justify-center text-[9px] text-slate-400 font-medium">
              medicalexampro.co.uk/practice/msra-question-bank
            </div>
          </div>

          <div className="relative w-full rounded-b-xl overflow-hidden bg-slate-900 aspect-[16/10]">
            <Image
              src="/images/commonLayout/sectiontwo.png"
              alt="MedicalExamPro Practice Question Screen Mockup"
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-auto mb-16 sm:mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center shadow-sm">
              <span className="block text-2xl sm:text-3xl font-extrabold text-brand-blue tracking-tight">{stat.value}</span>
              <span className="block text-slate-500 text-xs sm:text-sm font-semibold mt-1 uppercase tracking-wider">{stat.label}</span>
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
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-4 shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#072438] text-base mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
