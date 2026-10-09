"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchCurrentUser } from "@/redux/slices/authSlice";
import {
  subscriptionApi,
  CurrentSubscriptionData,
  SubscriptionPlanItem,
} from "@/services/subscriptionApi";
import { couponApi, ValidatedCouponInfo } from "@/services/couponApi";
import {
  trackPurchase,
  trackInitiateCheckout,
  isPurchaseTracked,
} from "@/lib/analytics";

const PLAN_CATALOG: Record<string, { name: string; price: number }> = {
  free: { name: "Free Sample Plan", price: 0 },
  pd_1m: { name: "Professional Dilemmas - 1 Month", price: 24 },
  pd_3m: { name: "Professional Dilemmas - 3 Months", price: 39 },
  pd_6m: { name: "Professional Dilemmas - 6 Months", price: 49 },
  msra_1m: { name: "Full MSRA - 1 Month", price: 39 },
  msra_3m: { name: "Full MSRA - 3 Months", price: 69 },
  msra_6m: { name: "Full MSRA - 6 Months", price: 89 },
};
import {
  Check,
  Zap,
  Sparkles,
  Shield,
  CreditCard,
  Clock,
  Calendar,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  X,
  Loader2,
  ExternalLink,
  Ticket,
  Tag,
} from "lucide-react";

function SubscriptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => (state as any).auth?.user);

  // Duration toggle: 1 month, 3 months, 6 months
  const [selectedDuration, setSelectedDuration] = useState<1 | 3 | 6>(3);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [currentSubData, setCurrentSubData] = useState<CurrentSubscriptionData | null>(null);

  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);

  // Coupon code states
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCouponInfo | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  const statusParam = searchParams.get("status");
  const planIdParam = searchParams.get("plan_id");

  // Ref to prevent duplicate processing within React Strict Mode mount lifecycle
  const handledPurchaseRef = React.useRef<string | null>(null);

  // Load current subscription details from backend
  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const res = await subscriptionApi.getCurrentSubscription();
      if (res.data) {
        setCurrentSubData(res.data);
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_subscription", JSON.stringify(res.data));
          window.dispatchEvent(new Event("subscription_update"));
        }
      }
    } catch (err) {
      console.warn("Could not load current subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionData();
  }, [user?.id]);

  // Handle post-checkout redirect (e.g. ?status=success) with robust conversion tracking and deduplication
  useEffect(() => {
    if (statusParam === "success") {
      const isFreeCoupon = searchParams.get("free_coupon") === "true";
      const sessionId = searchParams.get("session_id") || undefined;
      const couponCode =
        searchParams.get("coupon_code") ||
        (typeof window !== "undefined" ? localStorage.getItem("pending_coupon_code") : null) ||
        appliedCoupon?.coupon?.code ||
        undefined;

      // Unique transaction identifier for deduplication (Stripe session ID or unique free key)
      const transactionId =
        sessionId ||
        (isFreeCoupon
          ? `free_${planIdParam || "plan"}_${user?.id || Date.now()}`
          : `sub_${planIdParam || "plan"}_${Date.now()}`);

      // Check both React ref and persistent storage to strictly prevent duplicate tracking
      if (
        handledPurchaseRef.current === transactionId ||
        isPurchaseTracked(transactionId)
      ) {
        console.log(
          `[Subscription] Purchase ${transactionId} already tracked. Skipping duplicate.`
        );
        return;
      }
      handledPurchaseRef.current = transactionId;

      const triggerPurchaseTracking = (activatedSub?: any) => {
        const planInfo = planIdParam ? PLAN_CATALOG[planIdParam] : null;
        const purchaseValue = isFreeCoupon
          ? 0
          : activatedSub?.amount != null
          ? Number(activatedSub.amount)
          : planInfo?.price ?? 0;
        const planName =
          activatedSub?.planName || planInfo?.name || "Medical Exam Pro Plan";

        // Fires GA4, Google Ads (AW-18500329112), and Meta Pixel (3207242139667023)
        trackPurchase({
          transactionId,
          value: purchaseValue,
          currency: "GBP",
          planId: planIdParam || "unknown",
          planName,
          couponCode,
        });

        // Clean query parameters from URL so that browser refreshes do not re-run tracking
        if (typeof window !== "undefined") {
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      };

      if (planIdParam && !isFreeCoupon) {
        // Activate subscription in backend and record coupon redemption
        subscriptionApi
          .activateDevSubscription(planIdParam, sessionId, couponCode)
          .then((res) => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("pending_coupon_code");
            }
            dispatch(fetchCurrentUser());
            loadSubscriptionData();
            setActionSuccessMessage(
              "Payment verified successfully! Your new subscription is now active."
            );
            triggerPurchaseTracking(res?.data);
          })
          .catch((e) => {
            console.error(e);
            triggerPurchaseTracking();
          });
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("pending_coupon_code");
        }
        dispatch(fetchCurrentUser());
        loadSubscriptionData();
        setActionSuccessMessage(
          isFreeCoupon
            ? "🎉 100% Free Coupon Applied! Your subscription has been activated successfully without charge."
            : "Payment successful! Your account has been upgraded."
        );
        triggerPurchaseTracking();
      }
    }
  }, [statusParam, planIdParam, dispatch, user?.id]);

  // Pricing Matrix based on Client specifications:
  // Professional Dilemmas: 1m: £24, 3m: £39, 6m: £49
  // Full MSRA: 1m: £39, 3m: £69, 6m: £89
  const getPlanDetails = (category: "PD" | "FULL_MSRA", duration: 1 | 3 | 6) => {
    if (category === "PD") {
      if (duration === 1) {
        return {
          id: "pd_1m",
          price: 24,
          monthlyEquivalent: "£24.00",
          savings: null,
          casesCount: "2,505",
        };
      }
      if (duration === 3) {
        return {
          id: "pd_3m",
          price: 39,
          monthlyEquivalent: "£13.00",
          savings: "SAVE 45%",
          casesCount: "2,505",
        };
      }
      return {
        id: "pd_6m",
        price: 49,
        monthlyEquivalent: "£8.17",
        savings: "SAVE 66%",
        casesCount: "2,505",
      };
    } else {
      // FULL_MSRA
      if (duration === 1) {
        return {
          id: "msra_1m",
          price: 39,
          monthlyEquivalent: "£39.00",
          savings: null,
          casesCount: "11,007",
        };
      }
      if (duration === 3) {
        return {
          id: "msra_3m",
          price: 69,
          monthlyEquivalent: "£23.00",
          savings: "SAVE 41%",
          casesCount: "11,007",
        };
      }
      return {
        id: "msra_6m",
        price: 89,
        monthlyEquivalent: "£14.83",
        savings: "SAVE 62%",
        casesCount: "11,007",
      };
    }
  };

  const pdDetails = getPlanDetails("PD", selectedDuration);
  const msraDetails = getPlanDetails("FULL_MSRA", selectedDuration);

  // Apply Coupon Handler
  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = couponCodeInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon or promo code.");
      return;
    }

    setCouponError(null);
    setCouponSuccess(null);
    setValidatingCoupon(true);

    try {
      const res = await couponApi.validateCoupon(code, msraDetails.id);
      setAppliedCoupon(res);
      const discountLabel =
        res.coupon.discountType === "PERCENTAGE"
          ? `${res.coupon.discountValue}% OFF`
          : `£${res.coupon.discountValue} OFF`;
      setCouponSuccess(`Promo code "${res.coupon.code}" applied! (${discountLabel})`);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Invalid coupon code. It may be expired, inactive, or not valid for this account.";
      setCouponError(msg);
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    setCouponError(null);
    setCouponSuccess(null);
  };

  // Helper to compute discounted price for any plan price
  const getDiscountedPrice = (originalPrice: number, planId: string) => {
    if (!appliedCoupon) {
      return { finalPrice: originalPrice, discountAmount: 0, isFree: false };
    }

    // If coupon is restricted to specific plans, verify
    if (
      appliedCoupon.coupon &&
      (appliedCoupon as any).coupon.applicablePlans &&
      Array.isArray((appliedCoupon as any).coupon.applicablePlans) &&
      (appliedCoupon as any).coupon.applicablePlans.length > 0
    ) {
      if (!(appliedCoupon as any).coupon.applicablePlans.includes(planId)) {
        return { finalPrice: originalPrice, discountAmount: 0, isFree: false };
      }
    }

    const discountVal = Number(appliedCoupon.coupon.discountValue);
    let discount = 0;
    if (appliedCoupon.coupon.discountType === "PERCENTAGE") {
      discount = (originalPrice * discountVal) / 100;
    } else {
      discount = discountVal;
    }

    discount = Math.min(originalPrice, Math.max(0, discount));
    const finalPrice = Math.max(0, Math.round((originalPrice - discount) * 100) / 100);

    return {
      finalPrice,
      discountAmount: Math.round(discount * 100) / 100,
      isFree: finalPrice === 0,
    };
  };

  const pdDiscounted = getDiscountedPrice(pdDetails.price, pdDetails.id);
  const msraDiscounted = getDiscountedPrice(msraDetails.price, msraDetails.id);

  // Handle plan purchase button click -> Redirects to real Stripe Checkout (Test Mode) or Free Activation
  const handleSelectPlan = async (planId: string) => {
    setActionErrorMessage(null);
    setActionSuccessMessage(null);

    // Track InitiateCheckout / begin_checkout event across GA4 and Meta Pixel
    const planInfo = PLAN_CATALOG[planId];
    if (planInfo) {
      const discounted = getDiscountedPrice(planInfo.price, planId);
      trackInitiateCheckout({
        planId,
        planName: planInfo.name,
        value: discounted.finalPrice,
        currency: "GBP",
      });
    }

    try {
      setCheckoutLoading(planId);
      if (appliedCoupon?.coupon?.code && typeof window !== "undefined") {
        localStorage.setItem("pending_coupon_code", appliedCoupon.coupon.code);
      }
      const res = await subscriptionApi.createCheckoutSession(
        planId,
        appliedCoupon ? appliedCoupon.coupon.code : undefined
      );

      if (res.data?.checkoutUrl) {
        // Redirect directly to real hosted Stripe Checkout page or instant free coupon activation
        window.location.href = res.data.checkoutUrl;
      } else {
        throw new Error(
          (res as any)?.message || "Stripe did not return a checkout session URL."
        );
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to connect to Stripe. Please make sure your STRIPE_SECRET_KEY is configured in kawan-backend/.env.";
      setActionErrorMessage(msg);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const isSubscribed = Boolean(currentSubData?.isSubscribed);
  const activePlanName = currentSubData?.activePlan?.name || "Free Sample Plan";
  const daysRemaining = currentSubData?.daysRemaining ?? 0;

  return (
    <div className="space-y-8 mx-auto pb-16 font-sans">
      {/* Success Notification Alert */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Notification Alert */}
      {actionErrorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-sm font-semibold">{actionErrorMessage}</span>
          </div>
          <button
            onClick={() => setActionErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>One-Off Payment • No Auto-Renewal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082138] tracking-tight">
          Subscription &amp; Access Plans
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Select your study timeline for MedicalExamPro. All plans are transparent one-off payments
          with no surprise rebilling. Access expires automatically after your chosen period.
        </p>
      </div>

      {/* 2. Current Subscription Status Banner */}
      <div className="bg-[#09223a] text-white rounded-2xl p-6 sm:p-7 border border-[#14375b] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isSubscribed
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {isSubscribed ? "ACTIVE PLAN" : "FREE TIER"}
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {isSubscribed
                  ? `One-Off Access (${daysRemaining} days remaining)`
                  : "Limited Sample Access (40 Questions)"}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{activePlanName}</span>
              {isSubscribed && <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isSubscribed
                ? `You have full access to ${currentSubData?.activePlan?.casesCount?.toLocaleString()} cases. No automatic recurring payments will be charged.`
                : "You currently have limited sample access to 40 questions across 3 CPS specialties & 1 PD domain. Choose a full access plan below to unlock all content."}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>One-off fee (No recurring renewal)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>Stripe Checkout (Cards, Apple/Google Pay, PayPal)</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-[#0e2c4a] p-5 rounded-2xl border border-[#1e4875] text-center min-w-[220px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isSubscribed ? "Status" : "Upgrade"}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {isSubscribed ? (
                <span className="text-emerald-400">Active</span>
              ) : (
                <span>Sample</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isSubscribed
                ? `Expires in ${daysRemaining} days`
                : "No payment required for sample"}
            </p>

            {!isSubscribed && (
              <button
                onClick={() => {
                  document.getElementById("plan-selection-grid")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full mt-3 py-2 px-4 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Choose Upgrade Plan ↓
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Promo Code & Referral Voucher Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">Have a Promo or Referral Code?</h3>
                {appliedCoupon && (
                  <span className="text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Apply your promotional code to enjoy discounted rates on any subscription tier.
              </p>
            </div>
          </div>

          {/* Input or Applied State */}
          {!appliedCoupon ? (
            <form onSubmit={handleApplyCoupon} className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => {
                    setCouponCodeInput(e.target.value.toUpperCase());
                    setCouponError(null);
                    setCouponSuccess(null);
                  }}
                  placeholder="e.g. MSRA-PROMO"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-mono uppercase bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={validatingCoupon || !couponCodeInput.trim()}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer disabled:cursor-not-allowed"
              >
                {validatingCoupon ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Apply Code</span>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end bg-emerald-950/40 border border-emerald-500/30 rounded-2xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  {appliedCoupon.coupon.code}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  ({appliedCoupon.coupon.discountType === "PERCENTAGE"
                    ? `${appliedCoupon.coupon.discountValue}% OFF`
                    : `£${appliedCoupon.coupon.discountValue} OFF`})
                </span>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 hover:underline cursor-pointer ml-2"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>

        {/* Feedback messages */}
        {couponError && (
          <div className="mt-3 text-xs text-rose-400 flex items-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{couponError}</span>
          </div>
        )}
        {couponSuccess && (
          <div className="mt-3 text-xs text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{couponSuccess}</span>
          </div>
        )}
      </div>

      {/* 4. Duration Selector (1 Month / 3 Months / 6 Months) */}
      <div id="plan-selection-grid" className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Select Your Access Period
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose the duration that fits your MSRA exam revision schedule.
            </p>
          </div>

          {/* 3-Way Access Period Pills (Landing page style) */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200/80 shadow-xs text-xs font-semibold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSelectedDuration(1)}
              className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer ${
                selectedDuration === 1
                  ? "bg-navy text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              1 Month
            </button>
            <button
              type="button"
              onClick={() => setSelectedDuration(3)}
              className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDuration === 3
                  ? "bg-navy text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <span>3 Months</span>
              <span className="text-[9px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                POPULAR
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedDuration(6)}
              className={`px-4 sm:px-5 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedDuration === 6
                  ? "bg-navy text-white shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <span>6 Months</span>
              <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                BEST VALUE
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards matching landing page aesthetic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end mx-auto pt-4">
          {/* Card 1: Sample questions (Free) */}
          <div className="bg-card text-card-foreground border border-border rounded-[32px] p-7 sm:p-8 flex flex-col justify-between shadow-sm text-left min-h-[450px]">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-foreground block mb-1">
                Sample questions
              </span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
                Free
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                Access a selection of sample questions covering both clinical
                problem-solving and professional dilemma scenarios to explore the
                style, depth, and quality of the question bank.
              </p>
            </div>
            <button
              disabled
              className="w-full py-3 rounded-full border border-border text-foreground hover:bg-muted font-semibold text-xs sm:text-sm transition-colors text-center block cursor-default opacity-80"
            >
              {!isSubscribed ? "Current Plan" : "Included Free"}
            </button>
          </div>

          {/* Card 2: MSRA full question bank (Most Popular) */}
          <div className="bg-navy text-white border border-navy rounded-[32px] p-7 sm:p-8 md:py-10 flex flex-col justify-between shadow-2xl relative text-left my-2 md:my-0 min-h-[520px] z-10">
            <span className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full absolute -top-3.5 left-1/2 -translate-x-1/2 shadow-md">
              MOST POPULAR
            </span>

            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200 block mb-1 pt-2">
                MSRA full question bank
              </span>

              {msraDiscounted.discountAmount > 0 ? (
                <div className="mb-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                      {msraDiscounted.isFree ? "FREE" : `£${msraDiscounted.finalPrice}`}
                    </h3>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      £{msraDetails.price}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Save £{msraDiscounted.discountAmount}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                    £{msraDetails.price}
                  </h3>
                  {msraDetails.savings && (
                    <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                      {msraDetails.savings}
                    </span>
                  )}
                </div>
              )}

              <span className="text-xs text-slate-300/70 block mb-6">
                Ideal for structured preparation {selectedDuration > 1 && `(${msraDetails.monthlyEquivalent}/mo)`}
              </span>

              <ul className="space-y-3.5 text-xs text-slate-200 mb-8 text-left">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    Full access to more than{" "}
                    <strong className="text-brand-orange font-semibold">
                      10,000
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    MSRA-style questions, including over{" "}
                    <strong className="text-brand-orange font-semibold">
                      8,000
                    </strong>{" "}
                    problem-solving questions,
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-brand-orange font-semibold">
                      2,500+
                    </strong>{" "}
                    professional dilemma cases
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>
                    access to{" "}
                    <strong className="text-brand-orange font-semibold">
                      10
                    </strong>{" "}
                    full mock exams
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(msraDetails.id)}
              disabled={checkoutLoading === msraDetails.id}
              className="w-full py-3.5 rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-brand-orange/25 text-center block cursor-pointer disabled:opacity-50"
            >
              {checkoutLoading === msraDetails.id ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting to Checkout...</span>
                </div>
              ) : (
                <span>
                  {currentSubData?.subscription?.planId === msraDetails.id
                    ? "Current Active Plan"
                    : msraDiscounted.isFree
                    ? "Claim Free MSRA Pass (100% OFF)"
                    : msraDiscounted.discountAmount > 0
                    ? `Get Full MSRA (£${msraDiscounted.finalPrice})`
                    : "Choose Plan"}
                </span>
              )}
            </button>
          </div>

          {/* Card 3: Standalone professional dilemmas */}
          <div className="bg-card text-card-foreground border border-border rounded-[32px] p-7 sm:p-8 flex flex-col justify-between shadow-sm text-left min-h-[420px]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-semibold text-foreground block">
                  Standalone professional dilemmas
                </span>
                {pdDetails.savings && (
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                    {pdDetails.savings}
                  </span>
                )}
              </div>

              {pdDiscounted.discountAmount > 0 ? (
                <div className="mb-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                      {pdDiscounted.isFree ? "FREE" : `£${pdDiscounted.finalPrice}`}
                    </h3>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      £{pdDetails.price}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Save £{pdDiscounted.discountAmount}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    £{pdDetails.price}
                  </h3>
                  {selectedDuration > 1 && (
                    <span className="text-xs text-muted-foreground font-medium">
                      ({pdDetails.monthlyEquivalent}/mo)
                    </span>
                  )}
                </div>
              )}

              <span className="text-xs text-muted-foreground block mb-4">
                {selectedDuration === 1 ? "1 month dedicated access" : `${selectedDuration} months access`}
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
                Dedicated access to professional dilemma cases only, designed for
                focused situational judgement practice.
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan(pdDetails.id)}
              disabled={checkoutLoading === pdDetails.id}
              className="w-full py-3 rounded-full border border-border text-foreground hover:bg-muted font-semibold text-xs sm:text-sm transition-colors text-center block cursor-pointer disabled:opacity-50"
            >
              {checkoutLoading === pdDetails.id ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Checkout...</span>
                </div>
              ) : (
                <span>
                  {currentSubData?.subscription?.planId === pdDetails.id
                    ? "Current Active Plan"
                    : pdDiscounted.isFree
                    ? "Claim Free PD Pass (100% OFF)"
                    : pdDiscounted.discountAmount > 0
                    ? `Get PD Pass (£${pdDiscounted.finalPrice})`
                    : "Choose Plan"}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Payment Security & Payment Methods Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Payment &amp; Gateway Details</h3>
            <p className="text-xs text-slate-500">
              Transparent, secure payments powered by Stripe Checkout.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Cards, Apple Pay &amp; Google Pay</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Accepting Visa, Mastercard, American Express, Apple Pay, and Google Pay with 1-click
              checkout.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>PayPal Enabled</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              PayPal is supported via our UK Stripe integration for seamless payment.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Strictly No Auto-Renewal</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your chosen plan automatically expires after 1, 3, or 6 months. No surprise recurring
              charges.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <SubscriptionPageContent />
    </Suspense>
  );
}
