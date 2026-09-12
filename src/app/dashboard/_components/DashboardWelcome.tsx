"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, RotateCcw } from "lucide-react";
import { ResetProgressModal } from "./ResetProgressModal";

interface DashboardWelcomeProps {
  userName?: string;
  subscriptionDaysLeft?: number;
  onResetProgress?: () => void;
}

export function DashboardWelcome({
  userName = "Alex",
  subscriptionDaysLeft = 42,
  onResetProgress,
}: DashboardWelcomeProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Left Welcome Text */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {userName}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Stay focused, track progress, and build confidence for the MSRA.
          </p>
        </div>

        {/* Right Badges & Actions */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Subscription Badge */}
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Subscription:{" "}
              <strong className="font-bold text-amber-500">
                {subscriptionDaysLeft} days left
              </strong>
            </span>
          </Link>

          {/* Reset Progress Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-orange hover:bg-brand-orange/90 active:scale-95 text-white text-xs font-bold transition-all shadow-xs shadow-brand-orange/20 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ResetProgressModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (onResetProgress) onResetProgress();
        }}
      />
    </>
  );
}
