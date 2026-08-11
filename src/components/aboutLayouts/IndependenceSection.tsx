"use client";

import React from "react";

export default function IndependenceSection() {
  const cards = [
    {
      title: "Medical Excellence Group Limited",
      subtitle: "Registered in England and Wales",
    },
    {
      title: "Data Protection",
      subtitle: "Committed to protecting user data and privacy",
    },
    {
      title: "Educational Content",
      subtitle: "Independently developed for educational purposes only",
    },
  ];

  return (
    <section className="w-full bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 border-t border-slate-200">
      <div className="container mx-auto px-4 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          INDEPENDENCE
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          An independent <span className="text-brand-orange">educational</span> provider
        </h2>

        <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto mb-12 sm:mb-16">
          <p>
            Medical ExamPro is not affiliated with, endorsed by, or connected to the NHS, the General Medical Council, Health Education England (or successor bodies), or any official recruitment authority.
          </p>
          <p>
            All content is developed independently for educational purposes. We are committed to maintaining professional standards, protecting user data, and delivering content that reflects the seriousness and responsibility of medical education.
          </p>
        </div>

        {/* 3 Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-slate-200/60 rounded-xl p-6 text-left border border-slate-200 shadow-sm flex flex-col justify-start"
            >
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                {card.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
