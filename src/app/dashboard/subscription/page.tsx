"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Check,
  Download,
  Sparkles,
  Clock,
  Calendar,
  AlertCircle
} from "lucide-react";

interface BillingRow {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: "Paid" | "Pending" | "Refunded";
}

const billingHistory: BillingRow[] = [
  {
    id: "INV-2026-089",
    date: "Jul 24, 2026",
    plan: "MedicalExamPro Pro Pass (Monthly)",
    amount: "£49.00",
    status: "Paid",
  },
  {
    id: "INV-2026-042",
    date: "Jun 24, 2026",
    plan: "MedicalExamPro Pro Pass (Monthly)",
    amount: "£49.00",
    status: "Paid",
  },
  {
    id: "INV-2026-011",
    date: "May 24, 2026",
    plan: "MedicalExamPro Pro Pass (Monthly)",
    amount: "£49.00",
    status: "Paid",
  },
];

export default function SubscriptionPage() {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <div className="space-y-8 container mx-auto container">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Account & Subscription
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          Manage your MedicalExamPro active plan, billing details, and payment history.
        </p>
      </div>

      {/* Current Active Plan Card */}
      <div className="bg-[#07192b] text-white rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

          {/* Left Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                ACTIVE SUBSCRIPTION
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Auto-renews Oct 24, 2026
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Pro Access Pass</span>
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Unlimited access to 4,500+ MSRA clinical vignette questions, SJT modules, full-length timed mock exams, and analytics.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>4,500+ Questions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Timed Mock Exams</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span>Performance Analytics</span>
              </div>
            </div>
          </div>

          {/* Right Price & Actions */}
          <div className="shrink-0 bg-[#0c2642] p-5 rounded-xl border border-slate-700/80 space-y-3 text-center min-w-[220px]">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                £49.00
                <span className="text-xs font-semibold text-slate-400"> / month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Billed monthly</p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  const pricingSection = document.getElementById("pricing-plans");
                  pricingSection?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-2.5 px-4 rounded-full bg-[#f96302] hover:bg-[#ea5b00] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Change Plan
              </button>

              <button
                onClick={() => setShowCancelModal(!showCancelModal)}
                className="w-full py-1.5 px-4 text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Available Plans Section */}
      <div id="pricing-plans" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Available Subscription Plans</h3>
            <p className="text-xs text-slate-500">Choose the plan that fits your MSRA exam timeline.</p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 self-start sm:self-auto text-xs font-bold">
            <button
              onClick={() => setSelectedBillingCycle("monthly")}
              className={`px-4 py-1 rounded-full transition-all cursor-pointer ${selectedBillingCycle === "monthly"
                  ? "bg-[#07192b] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              Monthly Billed
            </button>
            <button
              onClick={() => setSelectedBillingCycle("yearly")}
              className={`px-4 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${selectedBillingCycle === "yearly"
                  ? "bg-[#07192b] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <span>Annual</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-black">
                SAVE 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Plan 1: 1 Month Basic Pass */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  1 MONTH PASS
                </span>
                <h4 className="text-lg font-bold text-slate-900">Starter Pass</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    {selectedBillingCycle === "monthly" ? "£29.00" : "£22.00"}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Access to 4,500+ Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Basic Explanations</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 line-through">
                  <Check className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Full Mock Exam Simulations</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer">
              Select Starter Pass
            </button>
          </div>

          {/* Plan 2: Pro Pass (Current Plan - Featured) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#f96302] shadow-md flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#f96302] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              CURRENT ACTIVE PLAN
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block mb-1">
                  MOST POPULAR
                </span>
                <h4 className="text-lg font-bold text-slate-900">Pro Access Pass</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">
                    {selectedBillingCycle === "monthly" ? "£49.00" : "£37.00"}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">/ month</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>4,500+ Clinical & SJT Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>Unlimited Timed Mock Simulations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>Weakest Topic Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3] shrink-0" />
                  <span>Priority Guideline Updates</span>
                </div>
              </div>
            </div>

            <button disabled className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold cursor-default">
              Current Active Plan
            </button>
          </div>

          {/* Plan 3: Ultimate Lifetime */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  LIFETIME ACCESS
                </span>
                <h4 className="text-lg font-bold text-slate-900">Ultimate Pass</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">£199.00</span>
                  <span className="text-xs text-slate-400 font-semibold">one-time</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Lifetime Access (No Renewal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All Future MSRA Question Bank Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1-on-1 SJT Tutoring Session Discount</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 px-4 rounded-xl bg-[#07192b] hover:bg-[#0a243e] text-white text-xs font-bold transition-all cursor-pointer">
              Upgrade to Ultimate
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
