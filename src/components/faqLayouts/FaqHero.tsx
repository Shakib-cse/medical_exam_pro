"use client";

import React from "react";

export default function FaqHero() {
  return (
    <section className="relative w-full bg-[#072438] text-white pt-32 sm:pt-40 lg:pt-44 pb-16 lg:pb-20 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Find clear answers to common questions about MedicalExamPro, MSRA preparation, subscriptions, and platform features.
        </p>
      </div>
    </section>
  );
}
