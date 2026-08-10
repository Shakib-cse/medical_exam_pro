"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, HelpCircle, ChevronRight } from "lucide-react";
import { overviewApi, DilemmaCardData } from "@/services/overviewApi";

export function ProfessionalDilemmas() {
  const [dilemmaCards, setDilemmaCards] = useState<DilemmaCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDilemmas() {
      try {
        setLoading(true);
        const res = await overviewApi.getOverviewContent();
        if (res?.data?.professional_dilemmas?.content && Array.isArray(res.data.professional_dilemmas.content)) {
          setDilemmaCards(res.data.professional_dilemmas.content);
        } else {
          setDilemmaCards([]);
        }
      } catch (err) {
        console.error("Failed to load professional dilemmas:", err);
        setDilemmaCards([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDilemmas();
  }, []);

  if (!loading && dilemmaCards.length === 0) {
    return null; // Hide cleanly if no dilemma cards exist yet
  }

  return (
    <div className="bg-[#e3e8ee] rounded-2xl p-5 sm:p-6 border border-slate-300/70 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          Professional Dilemmas
        </h3>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dilemmaCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden group cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
              <Image
                src={card.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80"}
                alt={card.title}
                fill
                unoptimized
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
