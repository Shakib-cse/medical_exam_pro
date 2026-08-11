"use client";

import React from "react";

export default function OurApproach() {
  const priorities = [
    {
      title: "Exam Relevance",
      description:
        "Every question and resource is designed to mirror the format and demands of real UK assessments not generic medical knowledge",
    },
    {
      title: "Strategic Preparation",
      description:
        "We encourage active, technique-driven revision over passive reading -building decision-making clarity under time pressure.",
    },
    {
      title: "Performance Improvement",
      description:
        "Structured practice with reflection. Track progress, identify weaknesses, and improve consistently through measurable feedback",
    },
    {
      title: "Scalable Platform",
      description:
        "Starting with MSRA, Medical Exam Pro is built to expand - adding examinations and interview formats as the platform grows.",
    },
  ];

  return (
    <section className="w-full bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 text-slate-900 border-t border-slate-200">
      <div className="container mx-auto px-4">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              OUR APPROACH
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              What we prioritise
            </h2>
          </div>

          <p className="text-slate-600 text-sm sm:text-base max-w-lg leading-relaxed">
            Our resources are built around the realities of how competitive UK specialty training has become. Clinical knowledge alone is not enough.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {priorities.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-start"
            >
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
