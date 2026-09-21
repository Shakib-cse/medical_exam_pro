"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
  Search,
  ArrowLeft,
  Flag,
  MessageSquare,
  FileQuestion,
  Filter,
} from "lucide-react";
import {
  getAdminQuestionReports,
  updateReportStatus,
  deleteReport,
  getAllUsersFlaggedQuestions,
  QuestionReport,
  AdminFlaggedOverviewItem,
} from "@/lib/practiceSession";

export default function AdminDashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role?.name === "admin" || user?.email === "admin@example.com";

  const [activeTab, setActiveTab] = useState<"reports" | "flags">("reports");
  const [reports, setReports] = useState<QuestionReport[]>([]);
  const [flags, setFlags] = useState<AdminFlaggedOverviewItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "reviewed" | "resolved">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = useCallback(() => {
    setReports(getAdminQuestionReports());
    setFlags(getAllUsersFlaggedQuestions());
  }, []);

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    window.addEventListener("admin_reports_update", loadData);
    window.addEventListener("flagged_questions_update", loadData);
    return () => {
      window.removeEventListener("storage", loadData);
      window.removeEventListener("admin_reports_update", loadData);
      window.removeEventListener("flagged_questions_update", loadData);
    };
  }, [loadData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleStatusChange = (reportId: string, newStatus: "pending" | "reviewed" | "resolved") => {
    updateReportStatus(reportId, newStatus);
    loadData();
    showToast(`Report updated to ${newStatus}`);
  };

  const handleDeleteReport = (reportId: string) => {
    deleteReport(reportId);
    loadData();
    showToast("Report deleted");
  };

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesSearch =
        r.notes.toLowerCase().includes(search.toLowerCase()) ||
        r.prompt.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase()) ||
        r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
        (r.questionNumber && r.questionNumber.toLowerCase().includes(search.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [reports, statusFilter, search]);

  const filteredFlags = useMemo(() => {
    return flags.filter((f) => {
      return (
        f.prompt.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase()) ||
        (f.questionNumber && f.questionNumber.toLowerCase().includes(search.toLowerCase()))
      );
    });
  }, [flags, search]);

  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const resolvedCount = reports.filter((r) => r.status === "resolved").length;

  // Non-admin restricted access guard
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Admin Access Required</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Question feedback reports and clinical quality review are only visible to system administrators.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082138] hover:bg-[#103456] text-white text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin Quality Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              Admin Only
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Review question reports submitted by candidates and monitor flagged questions platform-wide.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/flags"
            prefetch={true}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Flag className="w-3.5 h-3.5 text-amber-500" />
            <span>My Flags</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Reports
            </span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{reports.length}</p>
          <span className="text-[11px] text-slate-400">Feedback from candidates</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pending Review
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
          <span className="text-[11px] text-slate-400">Needs clinical audit</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Resolved
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{resolvedCount}</p>
          <span className="text-[11px] text-slate-400">Approved & updated</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Platform Flags
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600">{flags.length}</p>
          <span className="text-[11px] text-slate-400">Across all user accounts</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "reports"
              ? "bg-[#082138] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Question Reports & Notes ({reports.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("flags")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "flags"
              ? "bg-[#082138] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>All Flagged Questions ({flags.length})</span>
        </button>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-2.5 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-2xs">
        <div className="relative flex-1 flex items-center px-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "reports"
                ? "Search notes, question, candidate email..."
                : "Search flagged questions, category..."
            }
            className="w-full bg-transparent border-none text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none py-1 pl-2 pr-2"
          />
        </div>

        {activeTab === "reports" && (
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(["all", "pending", "reviewed", "resolved"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#1D82EB] text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Content Views */}
      {activeTab === "reports" ? (
        filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Reports Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Candidate feedback submitted via &quot;Add a note&quot; or &quot;Report Issue&quot; will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const statusColors = {
                pending: "bg-amber-50 text-amber-700 border-amber-200",
                reviewed: "bg-sky-50 text-sky-700 border-sky-200",
                resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
              };

              return (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-all space-y-4"
                >
                  {/* Top line: Question number, Category, Reporter, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-[#082138] text-white text-xs font-bold">
                        {report.questionNumber || "Question"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                        {report.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        Reported by <strong className="text-slate-700">{report.userName}</strong> ({report.userEmail}) &bull; {report.reportedAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                          statusColors[report.status] || "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {report.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteReport(report.id)}
                        title="Delete Report"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                    {report.prompt}
                  </p>

                  {/* The Candidate's Note / Feedback Content */}
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                      Candidate Feedback / Issue Description:
                    </span>
                    <p className="text-xs sm:text-sm text-amber-950 font-medium whitespace-pre-wrap leading-relaxed">
                      &quot;{report.notes}&quot;
                    </p>
                  </div>

                  {/* Actions for Admin to change status */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-400 font-medium">Update status:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(report.id, "pending")}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          report.status === "pending"
                            ? "bg-amber-600 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        Pending
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(report.id, "reviewed")}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          report.status === "reviewed"
                            ? "bg-sky-600 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        Mark Reviewed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(report.id, "resolved")}
                        className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          report.status === "resolved"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Tab 2: All Flagged Questions Platform-Wide */
        filteredFlags.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200/90 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Flag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Flagged Questions Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Questions bookmarked by candidates will appear here for platform difficulty auditing.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlags.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 font-bold text-slate-800 text-sm flex items-center justify-center shrink-0">
                    {item.questionNumber || `Q${idx + 1}`}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {item.prompt}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.speciality} &bull; Flagged: {item.flaggedDate || "Recent"} &bull; User ID: {item.userId || "anonymous"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  <Link
                    href={`/dashboard/flags?review=true&id=${item.id}`}
                    prefetch={true}
                    className="px-4 py-2 rounded-full bg-[#1D82EB] hover:bg-[#1872ce] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
                  >
                    <span>Inspect</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
