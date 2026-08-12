"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { overviewApi, DilemmaCardData } from "@/services/overviewApi";

const CACHE_KEY = "cached_professional_dilemmas";

export function ProfessionalDilemmas() {
  const [dilemmaCards, setDilemmaCards] = useState<DilemmaCardData[]>([]);
  const [loading, setLoading] = useState(false);

  // Load from local storage cache instantly on mount for 0ms render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDilemmaCards(parsed);
          } else {
            setLoading(true);
          }
        } catch (e) {
          setLoading(true);
        }
      } else {
        setLoading(true);
      }
    }
  }, []);

  // Fetch latest data from backend in background asynchronously
  useEffect(() => {
    async function fetchDilemmas() {
      try {
        const res = await overviewApi.getOverviewContent();
        if (
          res?.data?.professional_dilemmas?.content &&
          Array.isArray(res.data.professional_dilemmas.content)
        ) {
          const content = res.data.professional_dilemmas.content;
          setDilemmaCards(content);
          if (typeof window !== "undefined") {
            localStorage.setItem(CACHE_KEY, JSON.stringify(content));
          }
        }
      } catch (err) {
        console.error("Failed to load professional dilemmas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDilemmas();
  }, []);

  if (!loading && dilemmaCards.length === 0) {
    return null; // Return null cleanly if no dilemma cards exist
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
                src={card.image}
                alt={card.title}
                fill
                unoptimized
                priority={idx < 3}
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
