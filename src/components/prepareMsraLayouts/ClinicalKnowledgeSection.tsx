"use client";

import { Eye } from "lucide-react";

export default function ClinicalKnowledgeSection() {
  const specialties = [
    { name: "Cardiology", progress: 58 },
    { name: "Respiratory", progress: 58 },
    { name: "Gastroenterology", progress: 58 },
    { name: "Endocrinology", progress: 58 },
    { name: "Neurology", progress: 58 },
    { name: "Renal Medicine", progress: 58 },
    { name: "Dermatology", progress: 58 },
    { name: "Psychiatry", progress: 58 },
    { name: "ENT", progress: 58 },
    { name: "Ophthalmology", progress: 58 },
  ];

  return (
    <section className="w-full bg-white text-slate-800 py-16 sm:py-20 lg:py-24 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#072438] tracking-tight leading-[1.18] mb-6">
              Build Comprehensive clinical<br className="hidden sm:inline" /> knowledge
            </h2>
            
            <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed mb-4 max-w-lg">
              The MSRA Clinical Problem Solving paper tests knowledge across ten core medical specialties. Our structured curriculum ensures coverage is complete, connected, and exam-focused.
            </p>
            <p className="text-slate-500 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-lg">
              Each specialty pathway includes condition-level questions, investigation interpretation, management priorities, and clinical reasoning mirroring the exact demands of the MSRA format.
            </p>

            {/* Capsules / Legend */}
            <div className="space-y-3 w-full max-w-md">
              <div className="bg-[#E2E8F0]/50 text-slate-700 text-xs sm:text-sm font-medium py-3 px-4 rounded-xl">
                75%+ coverage - Strong performance level
              </div>
              <div className="bg-[#E2E8F0]/50 text-slate-700 text-xs sm:text-sm font-medium py-3 px-4 rounded-xl">
                50-74% coverage Building proficiency
              </div>
              <div className="bg-[#E2E8F0]/50 text-slate-700 text-xs sm:text-sm font-medium py-3 px-4 rounded-xl">
                Below 50% - Priority revision area
              </div>
            </div>
          </div>

          {/* Right Specialty Grid */}
          <div className="lg:col-span-7 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {specialties.map((spec, idx) => {
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0]/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#94A3B8] shrink-0">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">{spec.name}</span>
                    </div>

                    <div className="w-full bg-[#E2E8F0] h-[7px] rounded-full overflow-hidden">
                      <div 
                        className="bg-[#1D82EB] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${spec.progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
