"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Flag,
  Search,
  ArrowLeft,
  ListFilter,
  ChevronDown,
  BookOpen,
  Check,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  getFlaggedQuestions,
  saveFlaggedQuestions,
  saveQuestionReport,
  FlaggedQuestionItem,
  getCurrentUserId,
} from "@/lib/practiceSession";

function getCategoryBadgeClasses(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("cardio")) {
    return "bg-[#E8F8F3] text-[#129A71] border-[#B9EEDB]";
  }
  if (cat.includes("pulmon") || cat.includes("resp")) {
    return "bg-[#FFF3E8] text-[#E07912] border-[#FCD4AF]";
  }
  if (cat.includes("gastro")) {
    return "bg-[#FDECEC] text-[#E14343] border-[#F8BDBD]";
  }
  if (cat.includes("psych")) {
    return "bg-[#EBF5FC] text-[#2980B9] border-[#BDDEF6]";
  }
  if (cat.includes("immun") || cat.includes("derm") || cat.includes("allergy")) {
    return "bg-[#FFF2E2] text-[#E08A1E] border-[#FBD6A8]";
  }
  if (cat.includes("coping") || cat.includes("pressure") || cat.includes("dilemma") || cat.includes("integrity") || cat.includes("empathy") || cat.includes("sensitivity")) {
    return "bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]";
  }
  return "bg-slate-100 text-slate-700 border-slate-200";
}

function FlaggedQuestionsContent() {
  const user = useSelector((state: RootState) => state.auth.user);
  const searchParams = useSearchParams();

  const [questions, setQuestions] = useState<FlaggedQuestionItem[]>(() => {
    if (typeof window !== "undefined") {
      const activeUserId = getCurrentUserId();
      return getFlaggedQuestions(activeUserId);
    }
    return [];
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Review mode state
  const [reviewingQuestionId, setReviewingQuestionId] = useState<string | null>(() => {
    const paramId = searchParams.get("id");
    const isReview = searchParams.get("review") === "true";
    if (paramId) return paramId;
    if (isReview && questions.length > 0) return questions[0].id;
    return null;
  });

  const [noteText, setNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadQuestions = useCallback(() => {
    const activeUserId = user?.id || getCurrentUserId();
    setQuestions(getFlaggedQuestions(activeUserId));
  }, [user?.id]);

  useEffect(() => {
    loadQuestions();
    window.addEventListener("storage", loadQuestions);
    window.addEventListener("flagged_questions_update", loadQuestions);
    return () => {
      window.removeEventListener("storage", loadQuestions);
      window.removeEventListener("flagged_questions_update", loadQuestions);
    };
  }, [loadQuestions]);

  // Click outside to close category dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const defaultCategories = ["All", "Cardiovascular", "Pulmonology", "Gastroenterology", "Psychiatry", "Immunology", "Dermatology"];
  const dynamicCategories = Array.from(new Set(questions.map((q) => q.category).filter(Boolean)));
  const categories = Array.from(new Set([...defaultCategories, ...dynamicCategories]));

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchesCategory = selectedCategory === "All" || q.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        q.prompt.toLowerCase().includes(search.toLowerCase()) ||
        q.category.toLowerCase().includes(search.toLowerCase()) ||
        (q.questionNumber && q.questionNumber.toLowerCase().includes(search.toLowerCase())) ||
        (q.speciality && q.speciality.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [questions, selectedCategory, search]);

  // Active question in review mode
  const activeQuestionIndex = useMemo(() => {
    if (!reviewingQuestionId) return 0;
    const idx = questions.findIndex((q) => q.id === reviewingQuestionId);
    return idx >= 0 ? idx : 0;
  }, [questions, reviewingQuestionId]);

  const activeQuestion: FlaggedQuestionItem | undefined = questions[activeQuestionIndex];

  // Sync draft note text when active question changes
  useEffect(() => {
    if (activeQuestion) {
      setNoteText(activeQuestion.notes || "");
    }
  }, [activeQuestion?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleRemove = (id: string) => {
    const activeUserId = user?.id || getCurrentUserId();
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveFlaggedQuestions(updated, activeUserId);
    showToast("Question removed from flags");

    if (reviewingQuestionId === id) {
      if (updated.length > 0) {
        const nextIdx = Math.min(activeQuestionIndex, updated.length - 1);
        setReviewingQuestionId(updated[nextIdx].id);
      } else {
        setReviewingQuestionId(null);
      }
    }
  };

  const handleNoteChange = (val: string) => {
    setNoteText(val);
    if (!activeQuestion) return;
    const activeUserId = user?.id || getCurrentUserId();
    const updated = questions.map((q) => {
      if (q.id === activeQuestion.id) {
        return {
          ...q,
          notes: val,
        };
      }
      return q;
    });
    setQuestions(updated);
    saveFlaggedQuestions(updated, activeUserId);

    // Save as Question Report visible only to the Admin
    if (val.trim().length > 0) {
      saveQuestionReport({
        questionId: activeQuestion.id,
        questionNumber: activeQuestion.questionNumber,
        prompt: activeQuestion.prompt,
        category: activeQuestion.category,
        speciality: activeQuestion.speciality,
        userId: activeUserId || "anonymous",
        userEmail: user?.email || "user@example.com",
        userName: user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Candidate",
        notes: val.trim(),
      });
    }
  };

  const handleNextFlag = () => {
    if (questions.length <= 1) return;
    const nextIdx = (activeQuestionIndex + 1) % questions.length;
    setReviewingQuestionId(questions[nextIdx].id);
  };

  // Toast floating notification
  const toastElement = toastMessage ? (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <Check className="w-4 h-4 text-emerald-400" />
      <span>{toastMessage}</span>
    </div>
  ) : null;

  // ----------------------------------------------------
  // REVIEW MODE (SCREENSHOT 2)
  // ----------------------------------------------------
  if (reviewingQuestionId && activeQuestion) {
    // Determine 40 grid buttons to display
    const totalSlots = Math.max(40, questions.length);
    const gridNumbers = Array.from({ length: totalSlots }, (_, i) => i + 1);

    return (
      <div className="space-y-6 pb-12">
        {toastElement}

        {/* Back Button */}
        <div>
          <button
            onClick={() => setReviewingQuestionId(null)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Review Flagged Question
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Review the question you flagged and decide whether it still needs attention.
          </p>
        </div>

        {/* Main Grid: Left Navigator & Right Question Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Numbered Grid Navigator */}
          <div className="lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <div className="grid grid-cols-4 gap-2.5">
              {gridNumbers.map((num) => {
                const questionAtIndex = questions[num - 1];
                const isActive = questionAtIndex && questionAtIndex.id === activeQuestion.id;
                const hasQuestion = Boolean(questionAtIndex);

                return (
                  <button
                    key={num}
                    type="button"
                    disabled={!hasQuestion}
                    onClick={() => {
                      if (questionAtIndex) {
                        setReviewingQuestionId(questionAtIndex.id);
                      }
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                      isActive
                        ? "bg-[#E8F8F3] border-2 border-[#10B981] text-[#059669] shadow-2xs cursor-pointer"
                        : hasQuestion
                        ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer"
                        : "bg-slate-50/40 border border-slate-100 text-slate-300 cursor-not-allowed"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Question Content & Notes & Actions */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Question Details Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-5">
              {/* Badges */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EBF5FC] text-[#1D82EB] border border-[#BDDEF6]">
                  {activeQuestion.questionNumber || `Q${activeQuestionIndex + 1}`}
                </span>
                <span
                  className={`px-3.5 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeClasses(
                    activeQuestion.category
                  )}`}
                >
                  {activeQuestion.category}
                </span>
              </div>

              {/* Clinical Vignette */}
              <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
                {activeQuestion.vignette || activeQuestion.prompt}
              </p>

              {/* Specific Question Prompt */}
              {activeQuestion.question && activeQuestion.question !== activeQuestion.vignette && (
                <p className="text-slate-900 text-xs sm:text-sm font-bold pt-1">
                  {activeQuestion.question}
                </p>
              )}

              {/* Options */}
              <div className="space-y-3 pt-2">
                {activeQuestion.options && activeQuestion.options.length > 0 ? (
                  activeQuestion.options.map((opt) => {
                    const isCorrect = opt.isCorrect === true;
                    const isUserSelected = opt.isUserSelected === true;
                    const isIncorrectSelection = isUserSelected && !isCorrect;

                    let rowStyle = "border-slate-200 bg-white text-slate-800 hover:border-slate-300";
                    let badgeStyle = "bg-slate-200 text-slate-600";
                    let radioIndicator = (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    );

                    if (isCorrect) {
                      rowStyle = "border-[#A7F3D0] bg-[#D1FAE5]/60 text-[#047857]";
                      badgeStyle = "bg-[#10B981] text-white";
                      radioIndicator = (
                        <div className="w-4 h-4 rounded-full border-2 border-[#10B981] flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                        </div>
                      );
                    } else if (isIncorrectSelection) {
                      rowStyle = "border-[#F8B4B4] bg-[#FDE8E8]/60 text-[#DC2626]";
                      badgeStyle = "bg-[#E54D42] text-white";
                      radioIndicator = (
                        <div className="w-4 h-4 rounded-full border-2 border-[#E54D42] flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-[#E54D42]" />
                        </div>
                      );
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`rounded-xl p-3.5 border transition-all flex items-center justify-between gap-3 ${rowStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${badgeStyle}`}
                          >
                            {opt.label}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                        </div>
                        {radioIndicator}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    No multiple-choice options recorded for this question.
                  </div>
                )}
              </div>
            </div>

            {/* Note Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-3">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                Add a note (optional)
              </h3>
              <textarea
                value={noteText}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="Explain what you think is incorrect or what should be improved..."
                className="w-full h-24 rounded-xl border border-slate-200 p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none transition-all"
              />
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <button
                  type="button"
                  onClick={() => handleRemove(activeQuestion.id)}
                  className="px-5 py-2.5 rounded-full border border-rose-400 hover:bg-rose-50 text-rose-500 font-bold text-xs transition-colors cursor-pointer"
                >
                  Remove Flag
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextFlag}
                disabled={questions.length <= 1}
                className="px-6 py-2.5 rounded-full bg-[#EE6C19] hover:bg-[#db5f12] disabled:opacity-50 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                Next Flag
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LIST VIEW (SCREENSHOT 1)
  // ----------------------------------------------------
  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {toastElement}

      {/* 1. Header with Title & Flag Count Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Flagged Questions
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Review the questions you&apos;ve marked for later and strengthen the areas that need more practice.
          </p>
        </div>

        {/* Top Right Counter Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF9F3] border border-[#F4C179] text-[#C46E14] text-xs sm:text-sm font-bold shrink-0 self-start sm:self-auto shadow-2xs">
          <Flag className="w-4 h-4 text-[#D97706]" />
          <span>{questions.length} Flagged Questions</span>
        </div>
      </div>

      {/* Admin Notice Banner (Visible Only to Admin) */}
      {(user?.role?.name === "admin" || user?.email === "admin@example.com") && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-sky-900 font-medium">
            <ShieldAlert className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Admin Access:</strong> You are viewing personal flags. Question feedback reports submitted by candidates are kept private and accessible only in the Admin Portal.
            </span>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-3.5 py-1.5 rounded-lg bg-[#082138] hover:bg-[#103456] text-white font-bold text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open Admin Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 2. Unified Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shadow-2xs">
        {/* Category Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-700 bg-slate-50/70 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-between sm:justify-start gap-2.5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-slate-500" />
              <span>{selectedCategory === "All" ? "All Categories" : selectedCategory}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                categoryDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {categoryDropdownOpen && (
            <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCategoryDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    selectedCategory === cat ? "text-[#1D82EB] font-bold bg-sky-50/50" : "text-slate-700"
                  }`}
                >
                  <span>{cat === "All" ? "All Categories" : cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-[#1D82EB]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />

        {/* Search Input */}
        <div className="relative flex-1 flex items-center px-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-transparent border-none text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none py-1.5 pl-2.5 pr-2"
          />
        </div>
      </div>

      {/* 3. Questions List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200/80 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No Flagged Questions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || selectedCategory !== "All"
              ? "No questions match your current search or category filter."
              : "When practicing questions, click the Flag button to bookmark difficult cases for later review."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((q, idx) => {
            const questionNumber = q.questionNumber || `Q${idx + 1}`;
            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all"
              >
                {/* Left Side: Number Box & Prompt with Category */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Square Box for Q Number */}
                  <div className="w-14 h-14 rounded-xl border border-slate-200/90 bg-white flex items-center justify-center font-bold text-slate-800 text-sm shrink-0 shadow-2xs">
                    {questionNumber}
                  </div>

                  {/* Text & Badge */}
                  <div className="space-y-2 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed max-w-3xl">
                      {q.prompt}
                    </p>
                    <div>
                      <span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold border ${getCategoryBadgeClasses(
                          q.category
                        )}`}
                      >
                        {q.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Actions (Blue Flag, Review, Remove) */}
                <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                  {/* Flag Icon */}
                  <button
                    type="button"
                    title="Flagged"
                    className="p-2 text-[#1D82EB] hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Flag className="w-4 h-4 text-[#1D82EB]" />
                  </button>

                  {/* Review Button */}
                  <button
                    type="button"
                    onClick={() => setReviewingQuestionId(q.id)}
                    className="px-6 py-2 rounded-full bg-[#1D82EB] hover:bg-[#1872ce] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Review
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(q.id)}
                    className="px-5 py-2 rounded-full border border-rose-300 hover:bg-rose-50 text-rose-500 text-xs font-bold transition-all cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FlaggedQuestionsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Flagged Questions...</div>}>
      <FlaggedQuestionsContent />
    </Suspense>
  );
}
