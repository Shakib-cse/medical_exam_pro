"use client";

export function SideGoalWidget() {
  const weakestTopics = [
    { name: "Cranial Nerves", score: "32%" },
    { name: "Mental Health Act", score: "38%" },
    { name: "Paediatric Milestones", score: "41%" },
    { name: "Antenatal Screening", score: "44%" },
  ];

  return (
    <div className="space-y-6">
      {/* Widget 1: Current Goal Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-2xs space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block text-center">
          CURRENT GOAL PROGRESS
        </span>

        <div className="text-center space-y-1">
          <div className="text-4xl font-black text-[#f96302] tracking-tight">
            32<span className="text-xl text-[#f96302]/60 font-extrabold">/50</span>
          </div>
          <p className="text-xs font-semibold text-slate-400">Questions for today</p>
        </div>

        {/* Single Solid Smooth Progress Bar matching image */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
          <div className="bg-[#f96302] h-full rounded-full w-[64%] transition-all duration-300" />
        </div>
      </div>

      {/* Widget 2: Weakest Topics */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-2xs space-y-4">
        <h4 className="text-sm font-bold text-[#1e293b] tracking-tight">
          Weakest Topics
        </h4>

        <div className="divide-y divide-slate-100">
          {weakestTopics.map((topic, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 hover:bg-slate-50/60 px-1 rounded-md transition-colors"
            >
              <span className="text-xs font-medium text-slate-700">
                {topic.name}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#fecdd3] text-[#9f1239] text-[11px] font-extrabold">
                {topic.score}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
