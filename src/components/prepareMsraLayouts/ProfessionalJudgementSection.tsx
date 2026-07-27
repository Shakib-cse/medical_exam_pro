"use client";

import {
  ShieldCheck,
  Handshake,
  Users,
  ShieldAlert,
  Scale,
  Briefcase,
  Glasses,
  Pen,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function ProfessionalJudgementSection() {
  const scenarios = [
    {
      title: "Professionalism",
      description: "Maintaining standards, boundaries, and conduct under pressure",
      icon: ShieldCheck,
    },
    {
      title: "Communication",
      description: "Clarity, empathy, and effectiveness with patients and colleagues",
      icon: Handshake,
    },
    {
      title: "Teamwork",
      description: "Collaboration, hierarchy, and constructive conflict resolution",
      icon: Users,
    },
    {
      title: "Patient Safety",
      description: "Risk identification, escalation pathways, and duty of care",
      icon: ShieldAlert,
    },
    {
      title: "Ethical Judgement",
      description: "Applying GMC principles to complex ethical scenarios",
      icon: Scale,
    },
    {
      title: "Workplace Behaviour",
      description: "Appropriate responses to colleague performance concerns",
      icon: Briefcase,
    },
  ];

  const pillars = [
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
    <section className="w-full bg-secondary text-slate-800 py-16 sm:py-20 lg:py-24 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-navy tracking-tight mb-4">
            Developing Professional Judgement
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Half of your MSRA score comes from the Professional Dilemmas paper. Structured preparation in ethical and professional scenarios is as critical as clinical knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch mx-auto">
          {/* Left Grid (6 cards) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {scenarios.map((scen, idx) => {
              const Icon = scen.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col items-start justify-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-700 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1.5">{scen.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {scen.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Blueprint Card */}
          <div className="lg:col-span-5 flex items-stretch">
            <div className="w-full bg-white bg-gradient-to-br from-accent-blue/60 via-white via-50% to-accent-blue/40 rounded-[28px] p-7 sm:p-9 border border-slate-200/70 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-center">
              {/* Soft background radial glows */}
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-9">
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl mb-1">
                    The Preparation Pathway
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm">Four pillars of MSRA success</p>
                </div>

                {/* Vertical Timeline Items */}
                <div className="flex flex-col">
                  {pillars.map((pillar, idx) => {
                    const Icon = pillar.icon;
                    const isLast = idx === pillars.length - 1;

                    return (
                      <div key={idx} className="flex flex-col">
                        <div className="flex gap-4 sm:gap-5 items-start">
                          {/* Left Icon Box */}
                          <div className="w-12 h-12 rounded-xl bg-slate-100/80 border border-slate-200/50 flex items-center justify-center text-slate-800 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                            <Icon className="w-5 h-5 stroke-[2]" />
                          </div>

                          {/* Right Content */}
                          <div className="pt-1">
                            <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
                              {pillar.title}
                            </h4>
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                              {pillar.description}
                            </p>
                          </div>
                        </div>

                        {/* Connector Line between icons */}
                        {!isLast && (
                          <div className="w-12 flex justify-center py-1.5">
                            <div className="w-[3px] h-7 sm:h-8 bg-slate-200 rounded-full" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PD question styles section */}
        <div className="mt-16 sm:mt-20">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mb-6">
            PD question styles you will see
          </h3>

          <div className="space-y-3.5">
            <div className="w-full bg-white border border-slate-200/80 rounded-xl px-5 py-4 shadow-sm text-slate-500 text-sm sm:text-base">
              <span className="text-slate-400 font-semibold mr-2">–</span>
              <strong className="font-bold text-slate-900 mr-1.5">Ranking questions:</strong>
              <span>put responses in order of appropriateness</span>
            </div>

            <div className="w-full bg-white border border-slate-200/80 rounded-xl px-5 py-4 shadow-sm text-slate-500 text-sm sm:text-base">
              <span className="text-slate-400 font-semibold mr-2">–</span>
              <strong className="font-bold text-slate-900 mr-1.5">Multiple-choice / action selection styles:</strong>
              <span>select the most appropriate actions within the scenario format</span>
            </div>
          </div>
        </div>

        {/* Why candidates find PD harder section */}
        <div className="mt-12 sm:mt-16">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy tracking-tight mb-6">
            Why candidates often find PD harder than expected
          </h3>

          <div className="w-full bg-accent-blue border border-accent-blue-border rounded-xl p-5 sm:p-6 text-slate-600 text-sm sm:text-base leading-relaxed shadow-sm">
            PD is not about memorising rules. It is about applying professional principles consistently under pressure, especially around prioritisation, communication, raising concerns, confidentiality, and patient safety; exactly the skills being tested in the scenarios.
          </div>
        </div>

      </div>
    </section>
  );
}
