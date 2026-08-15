"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Play, Loader2, HelpCircle } from "lucide-react";
import { questionBankApi, QuestionBankItemData } from "@/services/questionBankApi";
import { mockExamApi, MockExamHistoryRow } from "@/services/mockExamApi";

function formatDaysAgo(dateInput?: Date | string | number): string {
  if (!dateInput) return "Recently";
  if (typeof dateInput === "string") {
    const lower = dateInput.trim().toLowerCase();
    if (lower === "today") return "Today";
    if (lower.endsWith("ago")) return dateInput;
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return typeof dateInput === "string" ? dateInput : "Recently";

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const attemptMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const diffMs = todayMidnight - attemptMidnight;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "1 day ago";
  } else {
    return `${diffDays} days ago`;
  }
}

export default function QuestionBankPage() {
  const router = useRouter();

  const [bankItems, setBankItems] = useState<QuestionBankItemData[]>([]);
  const [history, setHistory] = useState<MockExamHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [systemFilter, setSystemFilter] = useState("All");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [banksRes, historyRes] = await Promise.allSettled([
          questionBankApi.getQuestionBanks(),
          mockExamApi.getExamHistory(),
        ]);

        if (banksRes.status === "fulfilled" && banksRes.value?.data) {
          setBankItems(banksRes.value.data);
          if (banksRes.value.data.length > 0) {
            setSelectedId(banksRes.value.data[0].id);
          }
        }

        if (historyRes.status === "fulfilled" && historyRes.value?.data) {
          setHistory(historyRes.value.data);
        }
      } catch (err) {
        console.error("Failed to load question banks dynamically:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredItems = bankItems.filter((item) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        item.specialty?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);
      if (!matchSearch) return false;
    }

    if (typeFilter !== "All") {
      const isPDItem = item.type === "SJT" || item.type === "Professional Dilemmas" || item.category === "SJT" || item.category === "Professional Dilemmas";
      if (typeFilter === "SJT" && !isPDItem) return false;
      if (typeFilter === "Clinical" && isPDItem) return false;
    }

    if (difficultyFilter !== "All" && item.difficultyBadge?.toUpperCase() !== difficultyFilter.toUpperCase()) {
      return false;
    }

    if (systemFilter !== "All") {
      const targetSys = systemFilter.toLowerCase();
      const itemSpec = (item.specialty || "").toLowerCase();
      const itemCat = (item.category || "").toLowerCase();
      if (!itemSpec.includes(targetSys) && !itemCat.includes(targetSys)) {
        return false;
      }
    }

    return true;
  });

  const selectedItem = bankItems.find((item) => item.id === selectedId) || filteredItems[0] || bankItems[0];
  const currentQCount = selectedItem
    ? (selectedItem.questions && selectedItem.questions.length > 0
      ? selectedItem.questions.length
      : (selectedItem.questionCount || 0))
    : 0;

  const handleStartSession = () => {
    if (selectedItem) {
      router.push(`/practice?bankId=${selectedItem.id}&topic=${encodeURIComponent(selectedItem.title)}`);
    } else {
      router.push("/practice");
    }
  };

  const totalQuestions = bankItems.reduce((acc, curr) => acc + (curr.questionCount || 0), 0);

  // Deduplicate recently practiced tests so each test card appears at most ONCE
  const recentlyPracticed = history.reduce<MockExamHistoryRow[]>((acc, row) => {
    const key = row.mockExamId || row.examType;
    const exists = acc.some(
      (item) => (item.mockExamId && item.mockExamId === key) || item.examType === key
    );
    if (!exists) {
      acc.push(row);
    }
    return acc;
  }, []).slice(0, 4);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by keyword, condition or guideline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200/80 px-3 py-2 pr-8 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
            >
              <option value="All">Difficulty: All</option>
              <option value="MODERATE">Moderate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="CLINICAL">Clinical</option>
              <option value="STANDARD">Standard</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200/80 px-3 py-2 pr-8 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
            >
              <option value="All">Type: All</option>
              <option value="Clinical">Clinical Problem Solving</option>
              <option value="SJT">Professional Dilemmas</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={systemFilter}
              onChange={(e) => setSystemFilter(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200/80 px-3 py-2 pr-8 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none"
            >
              <option value="All">System: All</option>
              <option value="Cardiology">Cardiovascular Medicine</option>
              <option value="Respiratory">Respiratory Medicine</option>
              <option value="Gastroenterology">Gastroenterology & Hepatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Endocrinology">Endocrinology & Diabetes</option>
              <option value="Renal">Renal Medicine & Urology</option>
              <option value="Musculoskeletal">Musculoskeletal & Rheumatology</option>
              <option value="Infectious">Infectious Diseases</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Ophthalmology">Ophthalmology</option>
              <option value="ENT">Ear, Nose & Throat (ENT)</option>
              <option value="Obstetrics">Obstetrics & Gynaecology</option>
              <option value="Paediatrics">Paediatrics</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Question Modules (8 cols) + Right Sidebar Panels (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Column: Question Cards List */}
        <div className="lg:col-span-8 space-y-3.5">
          {loading ? (
            <div className="space-y-3.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 border border-slate-200/80 bg-white shadow-2xs animate-pulse flex items-center justify-between gap-5"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="h-5 bg-slate-200 rounded-md w-3/4 sm:w-1/2" />
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <div className="h-5 bg-slate-100 rounded-md w-32" />
                      <div className="h-5 bg-slate-100 rounded-md w-24" />
                      <div className="h-4 bg-slate-100 rounded-md w-20" />
                    </div>
                  </div>
                  <div className="bg-slate-100 rounded-xl px-4 py-2.5 w-[76px] h-12 shrink-0 border border-slate-200/60 animate-pulse" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-slate-200/80 text-center space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Question Modules Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Question modules published for this clinical domain will automatically appear here.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isSelected = selectedId === item.id;
              const isPD = item.type === "SJT" || item.type === "Professional Dilemmas" || item.category === "Professional Dilemmas" || item.category === "SJT";

              let displayIsUnattempted = item.isUnattempted ?? true;
              let displayLastAttempted = item.lastAttempted ? formatDaysAgo(item.lastAttempted) : undefined;
              let displayAvgAcc = item.avgAcc || "N/A";

              // Check localStorage for local attempt fallback using unique bank ID
              if (typeof window !== "undefined" && item.id) {
                try {
                  let foundAttempt: any = null;
                  const bankKey = `bank_last_attempt_${item.id}`;

                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.endsWith(bankKey)) {
                      const val = localStorage.getItem(key);
                      if (val) {
                        try {
                          const parsed = JSON.parse(val);
                          if (parsed.timestamp) {
                            foundAttempt = parsed;
                            break;
                          }
                        } catch (_) { }
                      }
                    }
                  }
                  if (foundAttempt && foundAttempt.timestamp) {
                    displayIsUnattempted = false;
                    displayLastAttempted = formatDaysAgo(foundAttempt.timestamp);
                    if ((!displayAvgAcc || displayAvgAcc === "N/A") && foundAttempt.accuracyPct !== undefined) {
                      displayAvgAcc = `${foundAttempt.accuracyPct}%`;
                    }
                  }
                } catch (_) { }
              }

              if (displayIsUnattempted) {
                displayAvgAcc = "N/A";
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer flex items-center justify-between gap-5 ${isSelected
                    ? "bg-[#fff6f0] border-[#f96302] shadow-sm ring-1 ring-[#f96302]/30"
                    : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs"
                    }`}
                >
                  <div className="space-y-3.5 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      <span
                        className={`px-2.5 py-0.5 rounded-md font-extrabold ${isPD
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {isPD ? "Professional Dilemmas" : (item.type || "Clinical Problem Solving")}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-bold text-slate-700">
                        {item.specialty || item.category}
                      </span>
                      {displayIsUnattempted ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-800 font-semibold text-[11px]">
                          Unattempted
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px]">
                          • Last attempted: {displayLastAttempted}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Average Accuracy Metric Box */}
                  <div className="bg-slate-100/80 rounded-xl px-4 py-2.5 text-center min-w-[76px] shrink-0 border border-slate-200/60">
                    <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                      {displayAvgAcc || "N/A"}
                    </div>

                    <div className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase mt-0.5">
                      AVG ACC.
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Custom Session & Recently Practiced Panels */}
        <div className="lg:col-span-4 space-y-6">

          {/* Panel 1: Create Custom Session */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider">
                Create Custom Session
              </span>
              <h4 className="font-bold text-slate-900 text-base leading-snug truncate">
                {selectedItem ? selectedItem.title : "Select a Question Module"}
              </h4>
            </div>

            <div className="space-y-2 border-y border-slate-100 py-3 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Selected Questions</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {currentQCount} {currentQCount === 1 ? "Question" : "Questions"}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Est. Completion Time</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {currentQCount > 0
                    ? `${(selectedItem?.durationMinutes && selectedItem.durationMinutes !== 15)
                        ? selectedItem.durationMinutes
                        : Math.max(1, Math.ceil(currentQCount * 1.5))} mins`
                    : "0 mins"}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleStartSession}
                className="w-full py-3 px-4 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs shadow-md shadow-brand-orange/20 transition-all active:scale-95 cursor-pointer text-center"
              >
                Start Practice Session
              </button>
            </div>
          </div>

          {/* Panel 2: Recently Practiced */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <h4 className="font-bold text-slate-900 text-base">
              Recently Practiced
            </h4>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 animate-pulse gap-2"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                  </div>
                ))}
              </div>
            ) : recentlyPracticed.length === 0 ? (
              <div className="text-xs text-slate-400 py-3 text-center italic border border-dashed border-slate-200 rounded-xl">
                No tests practiced recently. Take a practice exam to see your history here!
              </div>
            ) : (
              <div className="space-y-3">
                {recentlyPracticed.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors gap-2"
                  >
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h5 className="font-bold text-slate-800 text-xs truncate">
                        {rec.examType}
                      </h5>
                      <p className="text-[11px] font-medium text-slate-400">
                        {rec.timeTaken} • <span className="font-bold text-emerald-600">{rec.score} Score</span>
                      </p>
                    </div>

                    <Link
                      href={`/practice?topic=${encodeURIComponent(rec.examType)}`}
                      className="w-8 h-8 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white flex items-center justify-center shadow-md shadow-brand-orange/20 hover:scale-105 transition-all shrink-0 cursor-pointer"
                      title="Practice Again"
                    >
                      <Play className="w-3.5 h-3.5 fill-current stroke-none ml-0.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
