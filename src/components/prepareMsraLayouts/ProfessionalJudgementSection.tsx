"use client";

import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Lock, 
  Sliders, 
  AlertTriangle,
  Glasses,
  Pen,
  Zap,
  TrendingUp
} from "lucide-react";

export default function ProfessionalJudgementSection() {
  const scenarios = [
    {
      title: "Patient Safety",
      description: "Prioritise patient safety above all else",
      icon: ShieldCheck,
    },
    {
      title: "Consent & Capacity",
      description: "Understand informed consent and capacity assessment",
      icon: UserCheck,
    },
    {
      title: "Teamwork",
      description: "Work effectively within multidisciplinary teams",
      icon: Users,
    },
    {
      title: "Duty of Candour",
      description: "Be open and honest when things go wrong",
      icon: Lock,
    },
    {
      title: "Workplace Management",
      description: "Manage workload and recognise limits of competence",
      icon: Sliders,
    },
    {
      title: "Raising Concerns",
      description: "Know when and how to raise safety concerns",
      icon: AlertTriangle,
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
    <section className="w-full bg-[#f1f5f9] text-slate-800 py-16 sm:py-20 lg:py-24 border-t border-slate-200">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#072438] tracking-tight mb-4">
            Developing Professional Judgement
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The Professional Dilemmas paper tests your situational judgment. Learn how to approach SJT scenarios using official GMC guidance and core ethical principles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Grid (6 cards) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {scenarios.map((scen, idx) => {
              const Icon = scen.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start justify-center"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 mb-4 shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">{scen.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{scen.description}</p>
                </div>
              );
            })}
          </div>

          {/* Right Blueprint Card */}
          <div className="lg:col-span-5 flex items-stretch">
            <div className="w-full bg-gradient-to-br from-[#ebf3fc] to-[#f4f7fd] rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg flex flex-col justify-between relative overflow-hidden text-slate-800">
              <div>
                <div className="text-center mb-8">
                  <h3 className="font-extrabold text-[#072438] text-lg sm:text-xl mb-1">The Preparation Pathway</h3>
                  <p className="text-slate-500 text-xs sm:text-sm">Four pillars of MSRA success</p>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  {pillars.map((pillar, idx) => {
                    const Icon = pillar.icon;
                    return (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="pt-0.5">
                          <h4 className="font-extrabold text-slate-800 text-sm sm:text-base mb-1">{pillar.title}</h4>
                          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{pillar.description}</p>
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
