"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Info, Play, ArrowLeft } from "lucide-react";
import { overviewApi } from "@/services/overviewApi";

export interface DomainDetailConfig {
  id: string;
  title: string;
  subtitle: string;
  attempted: number;
  totalQuestions: number;
  overallAccuracy: number;
  progressPercent: number;
  averageTime: string;
  topics: string[];
}

const DEFAULT_DOMAIN_CONFIGS: Record<string, DomainDetailConfig> = {
  "professional-integrity": {
    id: "professional-integrity",
    title: "Professional Integrity",
    subtitle: "Practice professional integrity questions.",
    attempted: 325,
    totalQuestions: 2505,
    overallAccuracy: 66,
    progressPercent: 20,
    averageTime: "1m 26s",
    topics: [
      "Ethical Dilemmas in Clinical Trials",
      "Informed Consent in Medical Research",
      "Balancing Patient Privacy and Care",
      "Conflicts of Interest in Healthcare",
      "End-of-Life Care Decisions",
      "Resource Allocation in Emergency Medicine",
      "Telemedicine and Patient Autonomy",
      "Cultural Sensitivity in Patient Care",
      "Maintaining Professional Boundaries in Therapy",
    ],
  },
  "coping-with-pressure": {
    id: "coping-with-pressure",
    title: "Coping with Pressure",
    subtitle: "Practice coping with pressure questions.",
    attempted: 290,
    totalQuestions: 2505,
    overallAccuracy: 70,
    progressPercent: 18,
    averageTime: "1m 22s",
    topics: [
      "Prioritisation Under Acute Workload",
      "Delegation and Escalation in Emergencies",
      "Managing Fatigue and Sleep Deprivation",
      "Handling Multiple Critically Ill Patients",
      "Time Management in High-Volume Clinics",
      "Stress Inoculation and Team Resilience",
      "Coping with Unexpected Clinical Complications",
      "Workplace Conflict Under Stress",
      "Maintaining Composure in Challenging Consultations",
    ],
  },
  "empathy-and-sensitivity": {
    id: "empathy-and-sensitivity",
    title: "Empathy and Sensitivity",
    subtitle: "Practice empathy and sensitivity questions.",
    attempted: 310,
    totalQuestions: 2505,
    overallAccuracy: 74,
    progressPercent: 22,
    averageTime: "1m 18s",
    topics: [
      "Breaking Bad News with Compassion",
      "Navigating Challenging Family Dynamics",
      "Managing Anxious and Agitated Patients",
      "Cross-Cultural Communication and Beliefs",
      "Supporting Bereaved Relatives",
      "Shared Decision-Making with Vulnerable Patients",
      "Recognising Hidden Emotional Distress",
      "Non-Verbal Communication and Active Listening",
      "Respecting Patient Autonomy and Refusal of Treatment",
    ],
  },
};

export default function ProfessionalDilemmaDomainPage() {
  const router = useRouter();
  const params = useParams();
  const rawDomainId = (params?.domainId as string) || "professional-integrity";
  const normalizedId = rawDomainId.toLowerCase();

  // Find or generate domain config
  const initialConfig: DomainDetailConfig =
    DEFAULT_DOMAIN_CONFIGS[normalizedId] || {
      id: normalizedId,
      title: rawDomainId
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      subtitle: `Practice ${rawDomainId.replace(/-/g, " ")} questions.`,
      attempted: 325,
      totalQuestions: 2505,
      overallAccuracy: 66,
      progressPercent: 20,
      averageTime: "1m 26s",
      topics: [
        "Ethical Dilemmas in Clinical Trials",
        "Informed Consent in Medical Research",
        "Balancing Patient Privacy and Care",
        "Conflicts of Interest in Healthcare",
        "End-of-Life Care Decisions",
        "Resource Allocation in Emergency Medicine",
        "Telemedicine and Patient Autonomy",
        "Cultural Sensitivity in Patient Care",
        "Maintaining Professional Boundaries in Therapy",
      ],
    };

  const [domain, setDomain] = useState<DomainDetailConfig>(initialConfig);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [questionType, setQuestionType] = useState<"Ranking" | "Select - 3" | "Both">("Ranking");
  const [topicMode, setTopicMode] = useState<"all" | "choose">("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialConfig.topics);

  // Dynamic fetch to support future custom backend topics
  useEffect(() => {
    async function loadDynamicDomain() {
      try {
        const res = await overviewApi.getOverviewContent();
        if (
          res?.data?.professional_dilemmas?.content &&
          Array.isArray(res.data.professional_dilemmas.content)
        ) {
          const matched = res.data.professional_dilemmas.content.find(
            (c: any) =>
              c.id === normalizedId ||
              c.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === normalizedId ||
              c.title?.toLowerCase() === normalizedId.replace(/-/g, " ")
          );

          if (matched) {
            setDomain((prev) => {
              const updatedTopics =
                Array.isArray(matched.topics) && matched.topics.length > 0
                  ? matched.topics
                  : prev.topics;

              setSelectedTopics(updatedTopics);
              return {
                ...prev,
                title: matched.title || prev.title,
                subtitle: matched.subtitle
                  ? `Practice ${matched.subtitle.toLowerCase()}`
                  : prev.subtitle,
                topics: updatedTopics,
              };
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch dynamic domain content:", err);
      }
    }

    loadDynamicDomain();
  }, [normalizedId]);

  const toggleTopic = (topic: string) => {
    setTopicMode("choose");
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSelectAllTopics = () => {
    setTopicMode("all");
    setSelectedTopics([...domain.topics]);
  };

  const handleChooseTopics = () => {
    setTopicMode("choose");
  };

  const practiceQuery = new URLSearchParams({
    topic: domain.title,
    speciality: "Professional Dilemmas",
    type: questionType === "Both" ? "SJT" : questionType,
    timer: timerEnabled ? "on" : "off",
    topics: selectedTopics.join(","),
  });

  return (
    <div className="space-y-6 sm:space-y-7 pb-10 w-full">
      {/* Back button & Page Header */}
      <div className="space-y-2">
        <Link
          href="/dashboard/professional-dilemmas"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Professional Dilemmas</span>
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-[32px] lg:text-[38px] font-bold text-[#141B25] tracking-tight leading-tight">
            {domain.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-[16px] font-normal">
            {domain.subtitle}
          </p>
        </div>
      </div>

      {/* 1. Top Stats (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
        {/* Card 1: Questions Attempted */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[160px] space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Questions Attempted
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#141B25] tracking-tight">
                {domain.attempted.toLocaleString()} / {domain.totalQuestions.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="text-[#64748B] font-normal">Current Progress</span>
              <span className="text-[#141B25] font-bold">{domain.progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#F1F3F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2589D0] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${domain.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between min-h-[160px]">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Overall Accuracy
            </p>
            <div className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#141B25] tracking-tight">
              {domain.overallAccuracy}%
            </div>
          </div>

          {/* Radial Accuracy Gauge with inner gap padding and disc */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="23.5" fill="#F1F5F9" />
              <circle
                cx="40"
                cy="40"
                r="33"
                stroke="#EDF2F7"
                strokeWidth="6.5"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="33"
                stroke="#1D82EB"
                strokeWidth="6.5"
                strokeDasharray={2 * Math.PI * 33}
                strokeDashoffset={(2 * Math.PI * 33) * (1 - domain.overallAccuracy / 100)}
                strokeLinecap="butt"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] sm:text-xs font-bold text-[#0F172A]">
                {domain.overallAccuracy}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Time/ Question */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex items-center justify-between min-h-[160px]">
          <div className="space-y-1.5">
            <p className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Average Time/ Question
            </p>
            <div className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#141B25] tracking-tight">
              {domain.averageTime}
            </div>
          </div>

          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#2589D0]"
            >
              <path
                d="M89.5317 74.3518C87.8007 73.0641 85.3538 73.4236 84.0661 75.1543C83.3544 76.1105 82.6029 77.0365 81.8136 77.9297C80.3849 79.5459 80.5366 82.0146 82.1528 83.4436C82.8657 84.0757 83.7858 84.4243 84.7386 84.4232C85.819 84.4232 86.8948 83.9773 87.6667 83.1041C88.6015 82.0463 89.4915 80.9497 90.3343 79.8172C91.622 78.0865 91.2628 75.6393 89.5317 74.3518ZM96.0646 56.0324C93.9579 55.5736 91.8757 56.9105 91.4169 59.0184C91.1635 60.1818 90.8608 61.334 90.5095 62.4717C89.8726 64.533 91.0272 66.7201 93.0884 67.357C93.4726 67.4756 93.8608 67.532 94.2429 67.532C95.9108 67.532 97.4554 66.4551 97.9737 64.7777C98.3907 63.4277 98.75 62.0606 99.0507 60.6801C99.5095 58.5723 98.1726 56.4914 96.0646 56.0324ZM70.7296 86.8621C69.6889 87.4427 68.6241 87.9792 67.5382 88.4701C65.572 89.358 64.698 91.6717 65.5858 93.6379C66.2382 95.0824 67.6599 95.9373 69.1481 95.9373C69.6856 95.9373 70.2319 95.8258 70.7536 95.5902C72.0414 95.0081 73.3041 94.3719 74.5382 93.6832C76.422 92.6316 77.0964 90.252 76.0444 88.3684C74.9931 86.485 72.6134 85.8105 70.7296 86.8621ZM46.0931 18.75V48.382L31.769 62.7059C30.2437 64.2314 30.2437 66.7047 31.769 68.2301C32.1313 68.5934 32.5619 68.8816 33.036 69.0779C33.51 69.2743 34.0182 69.375 34.5313 69.3742C35.0444 69.3749 35.5526 69.2741 36.0267 69.0778C36.5007 68.8814 36.9313 68.5933 37.2937 68.2301L52.7616 52.7621C53.4941 52.0295 53.9056 51.036 53.9056 50V18.75C53.9056 16.5926 52.1567 14.8438 49.9993 14.8438C47.8419 14.8438 46.0931 16.5926 46.0931 18.75Z"
                fill="currentColor"
              />
              <path
                d="M96.0938 8.39844C93.9363 8.39844 92.1875 10.1473 92.1875 12.3047V23.1516C83.0953 8.89219 67.217 0 50 0C36.6445 0 24.0885 5.20098 14.6445 14.6445C5.20098 24.0885 0 36.6445 0 50C0 63.3555 5.20098 75.9115 14.6445 85.3555C24.0885 94.799 36.6445 100 50 100C50.033 100 50.0648 99.9959 50.0977 99.9951C50.1305 99.9959 50.1623 100 50.1953 100C51.6031 100 53.0248 99.9406 54.4213 99.8238C56.5711 99.6437 58.168 97.7551 57.9881 95.6053C57.8078 93.4555 55.9217 91.8578 53.7693 92.0387C52.5889 92.1373 51.3865 92.1875 50.1953 92.1875C50.1623 92.1875 50.1305 92.1916 50.0977 92.1924C50.0648 92.1916 50.033 92.1875 50 92.1875C26.7377 92.1875 7.8125 73.2623 7.8125 50C7.8125 26.7377 26.7377 7.8125 50 7.8125C64.9918 7.8125 78.7807 15.8033 86.3156 28.5156H75.5748C73.4174 28.5156 71.6686 30.2645 71.6686 32.4219C71.6686 34.5793 73.4174 36.3281 75.5748 36.3281H87.5C89.7936 36.3309 92.0431 35.6986 93.9994 34.5014C94.1203 34.4327 94.2374 34.3576 94.3502 34.2764C97.7498 32.0398 100 28.1928 100 23.8281V12.3047C100 10.1473 98.2512 8.39844 96.0938 8.39844Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid (Practice Settings + Session) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 w-full">
        {/* Left: Practice Settings Container (2 Columns on Desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-6">
          <h2 className="text-lg font-bold text-[#141B25]">Practice Settings</h2>

          {/* Setting 1: Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F6]">
            <span className="text-xs sm:text-[13.5px] font-medium text-[#64748B]">
              Timer
            </span>
            <div className="flex items-center gap-2.5">
              <span
                className={`text-xs font-medium cursor-pointer ${
                  !timerEnabled ? "text-[#141B25] font-bold" : "text-slate-400"
                }`}
                onClick={() => setTimerEnabled(false)}
              >
                Off
              </span>
              <button
                type="button"
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                  timerEnabled ? "bg-[#1D82EB]" : "bg-slate-300"
                }`}
                aria-label="Toggle timer"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    timerEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-medium cursor-pointer ${
                  timerEnabled ? "text-[#141B25] font-bold" : "text-slate-400"
                }`}
                onClick={() => setTimerEnabled(true)}
              >
                On
              </span>
            </div>
          </div>

          {/* Setting 2: Question Type */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F6] gap-4">
            <span className="text-xs sm:text-[13.5px] font-medium text-[#64748B] shrink-0">
              Question Type
            </span>
            <div className="flex items-center gap-2 overflow-x-auto">
              {(["Ranking", "Select - 3", "Both"] as const).map((type) => {
                const isActive = questionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setQuestionType(type)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                      isActive
                        ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs font-bold"
                        : "bg-[#F1F3F6] text-slate-600 border border-[#E0E4EA] hover:bg-slate-200/70"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Setting 3: Topics Mode */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs sm:text-[13.5px] font-medium text-[#64748B] shrink-0">
              Topics
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllTopics}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                  topicMode === "all"
                    ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs font-bold"
                    : "bg-[#F1F3F6] text-slate-600 border border-[#E0E4EA] hover:bg-slate-200/70"
                }`}
              >
                All Topics
              </button>
              <button
                type="button"
                onClick={handleChooseTopics}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                  topicMode === "choose"
                    ? "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0] shadow-2xs font-bold"
                    : "bg-[#F1F3F6] text-slate-600 border border-[#E0E4EA] hover:bg-slate-200/70"
                }`}
              >
                Choose Topics
              </button>
            </div>
          </div>

          {/* Topics Checkbox List */}
          <div className="space-y-3 pt-2">
            {domain.topics.map((topic) => {
              const isChecked = selectedTopics.includes(topic);
              return (
                <label
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className="flex items-center gap-3 cursor-pointer select-none group"
                >
                  <div
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-all shrink-0 ${
                      isChecked
                        ? "bg-[#1D82EB] text-white"
                        : "border border-slate-300 bg-white group-hover:border-slate-400"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs sm:text-[13.5px] font-medium transition-colors ${
                      isChecked ? "text-[#141B25]" : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  >
                    {topic}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Right: Session Container (1 Column on Desktop) */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E4EA] shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#141B25]">Session</h2>

            {/* Previous Session Found Notice */}
            <div className="bg-[#ecfdf5] border border-[#a7f3d0] rounded-xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-[#059669]">
                <Info className="w-4 h-4 shrink-0 stroke-[2.5]" />
                <span className="text-xs sm:text-[13px] font-bold">
                  Previous session found
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-bold text-[#141B25] leading-snug tracking-wide uppercase">
                {questionType === "Both" ? "RANKING · SELECT - 3" : questionType.toUpperCase()} ·{" "}
                {topicMode === "all"
                  ? "All Topics"
                  : `${selectedTopics.length} Topics Selected`}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continue where you left off.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Link
              href={`/practice/professional-dilemmas?${practiceQuery.toString()}&mode=resume`}
              className="w-full py-3.5 rounded-xl bg-[#1D82EB] hover:bg-[#1875d2] active:scale-[0.99] text-white font-bold text-xs sm:text-sm text-center shadow-xs shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Resume Session</span>
              <Play className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5]" />
            </Link>

            <Link
              href={`/practice/professional-dilemmas?${practiceQuery.toString()}&mode=new`}
              className="w-full py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] active:scale-[0.99] text-white font-bold text-xs sm:text-sm text-center shadow-xs shadow-orange-500/20 flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Start New Session</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
