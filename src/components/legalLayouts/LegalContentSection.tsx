"use client";

import React from "react";

export interface LegalSectionItem {
  id: number;
  title: string;
  content: string;
}

interface LegalContentSectionProps {
  sections: LegalSectionItem[];
}

export default function LegalContentSection({
  sections,
}: LegalContentSectionProps) {
  return (
    <section className="w-full bg-[#F8FAFC] py-16 sm:py-20 border-t border-slate-200">
      <div className="container mx-auto px-4 space-y-8">
        {sections.map((item) => (
          <div key={item.id} className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {item.id}. {item.title}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
