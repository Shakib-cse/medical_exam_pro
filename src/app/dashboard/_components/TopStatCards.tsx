"use client";

interface TopStatCardsProps {
  attempted?: number;
  totalQuestions?: number;
  overallAccuracy?: number;
  averageTime?: string;
}

export function TopStatCards({
  attempted = 2145,
  totalQuestions = 11007,
  overallAccuracy = 68,
  averageTime = "1m 12s",
}: TopStatCardsProps) {
  const percentage = totalQuestions > 0 ? Math.round((attempted / totalQuestions) * 100) : 0;

  // Radial chart calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallAccuracy / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Questions Attempted */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500">Questions Attempted</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {attempted.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-400">
              / {totalQuestions.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1875d2] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Current Progress</span>
            <span className="text-slate-700 font-bold">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Card 2: Overall Accuracy */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500">Overall Accuracy</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {overallAccuracy}%
          </div>
        </div>

        {/* Circular Progress Ring with inner gap padding */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
            {/* Inner soft filled disc with white gap margin */}
            <circle cx="40" cy="40" r="23.5" fill="#F1F5F9" />
            {/* Background Track Circle */}
            <circle
              cx="40"
              cy="40"
              r="33"
              stroke="#EDF2F7"
              strokeWidth="6.5"
              fill="none"
            />
            {/* Progress Circle */}
            <circle
              cx="40"
              cy="40"
              r="33"
              stroke="#1D82EB"
              strokeWidth="6.5"
              strokeDasharray={2 * Math.PI * 33}
              strokeDashoffset={(2 * Math.PI * 33) * (1 - overallAccuracy / 100)}
              strokeLinecap="butt"
              fill="none"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">
              {overallAccuracy}%
            </span>
          </div>
        </div>
      </div>

      {/* Card 3: Average Time / Question */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500">Average Time/ Question</p>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {averageTime}
          </div>
        </div>

        {/* Stopwatch / Clock Icon Graphic */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-14 h-14 text-[#1875d2]" viewBox="0 0 48 48" fill="none">
            {/* Top crown / button */}
            <path
              d="M21 4H27M24 4V8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Side button */}
            <path
              d="M37 11L39 9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Outer dotted/circular ring */}
            <circle
              cx="24"
              cy="26"
              r="17"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              strokeLinecap="round"
            />
            {/* Inner Clock Hands */}
            <path
              d="M24 26V18M24 26L31 26"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="26" r="2.5" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
