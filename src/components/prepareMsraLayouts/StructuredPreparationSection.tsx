"use client";

import {
  Users,
  TrendingUp,
  Award,
  Glasses,
  Pen,
  Zap
} from "lucide-react";

export default function StructuredPreparationSection() {
  const pathwaySteps = [
    {
      icon: Glasses,
      title: "Knowledge",
      description: "Systematic clinical coverage across all MSRA domains",
    },
    {
      icon: Pen,
      title: "Practice",
      description: "Question-based learning with realistic exam conditions",
    },
    {
      icon: Zap,
      title: "Confidence",
      description: "Pattern recognition and decision-making fluency",
    },
    {
      icon: TrendingUp,
      title: "Performance",
      description: "Optimal national ranking and specialty selection",
    },
  ];

  return (
    <section className="w-full bg-white text-slate-800 py-16 sm:py-20 lg:py-24 border-t border-slate-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#072438] tracking-tight leading-[1.18] mb-6">
              Structured preparation is the difference between ranking and missing out
            </h2>

            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed mb-4 max-w-xl">
              The MSRA is not simply a test of clinical knowledge. Performance depends equally on exam technique, professional judgement, decision-making under time pressure, and the ability to recognise patterns across complex scenarios
            </p>

            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed mb-8 max-w-xl">
              Candidates who prepare systematically building both clinical understanding and professional dilemma skills consistently achieve higher national rankings than those who rely on knowledge alone.
            </p>

            {/* List of 3 Highlighted Stats Pills */}
            <div className="space-y-3.5 w-full max-w-xl">
              {/* Row 1 */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/40 rounded-xl px-4 py-3.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-slate-600 text-xs sm:text-sm font-medium">
                  <span className="text-brand-blue font-bold">~7,000</span> Applicants compete annually for specialty training posts
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/40 rounded-xl px-4 py-3.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-slate-600 text-xs sm:text-sm font-medium">
                  <span className="text-brand-blue font-bold">Top 25%</span> Score required to be competitive for most programmes
                </span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/40 rounded-xl px-4 py-3.5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shrink-0 shadow-sm">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-slate-600 text-xs sm:text-sm font-medium">
                  <span className="text-brand-blue font-bold">100%</span> Assessment-based selection no interview for many specialties
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (The Preparation Pathway timeline card) */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="w-full bg-gradient-to-br from-[#ebf3fc] to-[#f4f7fd] rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg relative overflow-hidden">

              {/* Title & Subtitle */}
              <div className="text-center mb-8">
                <h3 className="font-extrabold text-[#072438] text-lg sm:text-xl mb-1">The Preparation Pathway</h3>
                <p className="text-slate-500 text-xs sm:text-sm">Four pillars of MSRA success</p>
              </div>

              {/* Steps with Timeline Connector Line */}
              <div className="relative py-2">
                {/* Vertical Connector Line - positioned exactly in the center of the w-10 icon container */}
                <div className="absolute left-[20px] top-5 bottom-5 w-[2px] bg-slate-200/70 pointer-events-none"></div>

                <div className="space-y-8 relative z-10">
                  {pathwaySteps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div key={idx} className="relative flex gap-5 items-start pl-14">
                        {/* Timeline Icon Container positioned directly over the connector line */}
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm z-20">
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h4 className="font-extrabold text-slate-800 text-sm sm:text-base mb-1">{step.title}</h4>
                          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
