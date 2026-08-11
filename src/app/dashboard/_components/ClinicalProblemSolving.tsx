"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Loader2, HelpCircle } from "lucide-react";
import { overviewApi } from "@/services/overviewApi";

interface Topic {
  id: string;
  title: string;
  image: string;
  totalQ: number;
  correct: number;
  wrong: number;
  attemptsPct: number;
  accuracyPct: number;
  category: "all" | "weakest" | "inProgress";
  hasAttempted: boolean;
}

const CACHE_KEY = "cached_clinical_topics";

function formatTitle(str: string): string {
  if (!str) return str;
  let formatted = str.charAt(0).toUpperCase() + str.slice(1);
  return formatted.replace(/:\s*([a-z])/g, (_, l) => `: ${l.toUpperCase()}`);
}

function parseTopicItem(t: any): Topic {
  const topicId = t.id || t.title?.toLowerCase().replace(/\s+/g, "-") || `topic-${Math.random()}`;
  let correct = 0;
  let wrong = 0;
  let totalQ = t.questions?.length || t.totalQ || 1;
  let attemptsPct = 0;
  let accuracyPct = 0;
  let hasAttempted = false;

  if (typeof window !== "undefined") {
    const savedAttemptStr =
      localStorage.getItem(`topic_last_attempt_${topicId}`) ||
      localStorage.getItem(`topic_last_attempt_${t.title}`);

    if (savedAttemptStr) {
      try {
        const saved = JSON.parse(savedAttemptStr);
        correct = saved.correct ?? 0;
        wrong = saved.wrong ?? 0;
        totalQ = saved.totalQ || totalQ;
        attemptsPct = saved.attemptsPct ?? 0;
        accuracyPct = saved.accuracyPct ?? 0;
        hasAttempted = true;
      } catch (e) {
        console.error("Error parsing saved attempt:", e);
      }
    }
  }

  return {
    id: topicId,
    title: formatTitle(t.title),
    image: t.image,
    totalQ,
    correct,
    wrong,
    attemptsPct,
    accuracyPct,
    category: t.category || "all",
    hasAttempted,
  };
}

export function ClinicalProblemSolving() {
  const [activeFilter, setActiveFilter] = useState<"all" | "weakest" | "inProgress">("all");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  // Load from local storage cache instantly on mount for 0ms render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const parsedRaw = JSON.parse(cached);
          if (Array.isArray(parsedRaw)) {
            const parsed = parsedRaw.map(parseTopicItem);
            setTopics(parsed);
          }
        } catch (e) {
          console.error("Error loading cached topics:", e);
        }
      } else {
        setLoading(true);
      }
    }
  }, []);

  // Fetch latest data from backend in background asynchronously
  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await overviewApi.getOverviewContent();
        if (res?.data?.clinical_topics?.content && Array.isArray(res.data.clinical_topics.content)) {
          const dynamicTopics: Topic[] = res.data.clinical_topics.content.map(parseTopicItem);
          setTopics(dynamicTopics);
          if (typeof window !== "undefined") {
            localStorage.setItem(CACHE_KEY, JSON.stringify(res.data.clinical_topics.content));
          }
        }
      } catch (err) {
        console.error("Failed to load clinical topics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  const filteredTopics = topics.filter((t) => {
    if (activeFilter === "all") return true;

    if (activeFilter === "weakest") {
      // Show cards where user has attempted test AND has below 50% marks (< 50% accuracy)
      return t.hasAttempted && t.accuracyPct < 50;
    }

    if (activeFilter === "inProgress") {
      // Show cards that have NOT been started at any time (0% attempts / unattempted)
      return !t.hasAttempted || t.attemptsPct === 0;
    }

    return true;
  });

  return (
    <div className="bg-[#e2e7ec] rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-300/60 space-y-6 w-full max-w-full overflow-hidden">
      {/* Section Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl sm:text-2xl font-bold text-[#1c2833] tracking-tight">
            Clinical Problem Solving
          </h3>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />}
        </div>

        {/* Filter Capsule */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200/60 shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 sm:px-4 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${activeFilter === "all"
              ? "bg-[#072438] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 bg-transparent font-semibold"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("weakest")}
            className={`px-3 sm:px-4 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${activeFilter === "weakest"
              ? "bg-[#072438] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 bg-transparent font-semibold"
              }`}
          >
            Weakest
          </button>
          <button
            onClick={() => setActiveFilter("inProgress")}
            className={`px-3 sm:px-4 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${activeFilter === "inProgress"
              ? "bg-[#072438] text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 bg-transparent font-semibold"
              }`}
          >
            In Progress
          </button>
        </div>
      </div>

      {/* Grid of Topic Cards */}
      {filteredTopics.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200/80 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">
            {activeFilter === "weakest"
              ? "No Weak Topics (<50% marks)"
              : activeFilter === "inProgress"
                ? "No Unstarted Topics"
                : "No Clinical Topics Available"}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {activeFilter === "weakest"
              ? "None of your attempted topic tests have scored below 50% marks."
              : activeFilter === "inProgress"
                ? "All available clinical topics have been started."
                : "No clinical problem solving topics have been published yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTopics.map((topic, idx) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group min-w-0 w-full overflow-hidden"
            >
              <div className="space-y-3 min-w-0">
                {/* Image Container */}
                <div className="relative w-full h-40 sm:h-44 bg-slate-100 rounded-xl overflow-hidden">
                  <Image
                    src={topic.image || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&auto=format&fit=crop&q=80"}
                    alt={topic.title}
                    fill
                    unoptimized
                    priority={idx < 6}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>

                {/* Title */}
                <div className="pt-1 pb-2 border-b border-slate-100 min-h-[46px] flex items-center">
                  <h4 className="font-bold text-[#1c2833] text-sm sm:text-base leading-snug truncate">
                    {topic.title}
                  </h4>
                </div>

                {/* Responsive Metrics Table with Last Test Data */}
                <div className="grid grid-cols-5 gap-0.5 sm:gap-1 text-center items-center py-2 w-full overflow-hidden">
                  <div className="min-w-0 px-0.5">
                    <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                      Total Q.
                    </span>
                    <span className="font-black text-[#1c2833] text-xs sm:text-sm md:text-base block truncate">
                      {topic.totalQ}
                    </span>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                      Correct
                    </span>
                    <span className="inline-flex items-center justify-center w-full py-1 rounded-md bg-[#c6f6d5] text-[#10b981] font-black text-xs sm:text-sm md:text-base truncate">
                      {topic.correct}
                    </span>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                      Wrong
                    </span>
                    <span className="inline-flex items-center justify-center w-full py-1 rounded-md bg-[#fecdd3] text-[#f43f5e] font-black text-xs sm:text-sm md:text-base truncate">
                      {topic.wrong}
                    </span>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                      Attempts
                    </span>
                    <span className="font-black text-[#1c2833] text-xs sm:text-sm md:text-base block truncate">
                      {topic.attemptsPct}%
                    </span>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <span className="block text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate mb-1">
                      Acc
                    </span>
                    <span className="font-black text-[#1c2833] text-xs sm:text-sm md:text-base block truncate">
                      {topic.accuracyPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <Link
                  href={`/practice?topicId=${encodeURIComponent(topic.id)}&topic=${encodeURIComponent(topic.title)}`}
                  className="w-full py-2.5 sm:py-3 px-4 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-brand-orange/20 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Start Practicing</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
