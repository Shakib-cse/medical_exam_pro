"use client";

function RadialProgress({ percentage }: { percentage: number }) {
  const radius = 22;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-13 h-13 flex items-center justify-center shrink-0">
      <svg className="w-13 h-13 transform -rotate-90">
        <circle
          cx="26"
          cy="26"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="26"
          cy="26"
          r={radius}
          stroke="#00a8e8"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-[11px] font-extrabold text-slate-800">
        {percentage}%
      </span>
    </div>
  );
}

export function StatCards() {
  const stats = [
    {
      title: "QUESTIONS ATTEMPTED",
      value: "428 / 1,200",
      subtext: "36% completed",
      percentage: 36,
      type: "radial",
    },
    {
      title: "ACCURACY",
      value: "318 / 428",
      subtext: "74% correct",
      percentage: 74,
      type: "radial",
    },
    {
      title: "AVERAGE ANSWERING TIME",
      value: "82 sec",
      subtext: "Per attempted question",
      type: "text",
    },
    {
      title: "WEAKEST AREAS",
      value: "Renal, Ethics",
      subtext: "42 questions to revisit",
      type: "text",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between transition-all hover:shadow-md"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {stat.title}
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {stat.value}
            </div>
            <p className="text-xs text-slate-500 font-medium">{stat.subtext}</p>
          </div>

          {stat.type === "radial" && typeof stat.percentage === "number" && (
            <RadialProgress percentage={stat.percentage} />
          )}
        </div>
      ))}
    </div>
  );
}
