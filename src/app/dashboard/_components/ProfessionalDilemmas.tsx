"use client";

import Image from "next/image";

interface DilemmaCard {
  title: string;
  subtitle: string;
  image: string;
}

const dilemmaCards: DilemmaCard[] = [
  {
    title: "Professional Integrity",
    subtitle: "Probity, safety and candour",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Coping with Pressure",
    subtitle: "Prioritisation under stress",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80",
  },
  {
    title: "Empathy and Sensitivity",
    subtitle: "Patient-centred judgement",
    image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&auto=format&fit=crop&q=80",
  },
];

export function ProfessionalDilemmas() {
  return (
    <div className="bg-[#e3e8ee] rounded-2xl p-5 sm:p-6 border border-slate-300/70 shadow-xs space-y-4">
      <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
        Professional Dilemmas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dilemmaCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Body */}
            <div className="p-3.5 space-y-0.5">
              <h4 className="font-bold text-slate-900 text-sm">
                {card.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
