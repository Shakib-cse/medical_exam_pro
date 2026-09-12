"use client";

import Link from "next/link";
import { RotateCw, Sparkles } from "lucide-react";

export interface WeakAreaItem {
  id: string;
  topic: string;
  speciality: string;
  accuracy: number;
}

interface WeakAreasTableProps {
  items?: WeakAreaItem[];
}

const defaultWeakAreas: WeakAreaItem[] = [
  {
    id: "1",
    topic: "Arrhythmias",
    speciality: "Cardiology",
    accuracy: 32,
  },
  {
    id: "2",
    topic: "Epilepsy",
    speciality: "Neurology",
    accuracy: 26,
  },
  {
    id: "3",
    topic: "Interstitial Lung Disease",
    speciality: "Respiratory",
    accuracy: 36,
  },
];

export function WeakAreasTable({ items = defaultWeakAreas }: WeakAreasTableProps) {
  const displayItems = items.length > 0 ? items : defaultWeakAreas;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        Weak Areas
      </h2>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">Topic</th>
                <th className="py-4 px-6 font-bold">Speciality</th>
                <th className="py-4 px-6 font-bold">Accuracy</th>
                <th className="py-4 px-6 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/60 transition-colors group"
                >
                  {/* Topic */}
                  <td className="py-4 px-6 font-bold text-slate-800 text-xs sm:text-sm">
                    {item.topic}
                  </td>

                  {/* Speciality */}
                  <td className="py-4 px-6 font-medium text-slate-500 text-xs">
                    {item.speciality}
                  </td>

                  {/* Accuracy */}
                  <td className="py-4 px-6">
                    <span className="font-extrabold text-amber-500 text-xs sm:text-sm">
                      {item.accuracy}%
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/practice?topic=${encodeURIComponent(
                        item.topic
                      )}&speciality=${encodeURIComponent(item.speciality)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-amber-400/90 text-amber-600 hover:bg-amber-500 hover:text-white font-bold text-xs transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                      <span>Repractice</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
