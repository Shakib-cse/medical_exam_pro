"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CurrentSubscriptionData } from "@/services/subscriptionApi";

export interface UserPermissions {
  isSubscribed: boolean;
  isPDOnly: boolean;
  isFullMSRA: boolean;
  isFreeOnly: boolean;
  hasCPSAccess: boolean;
  hasPDAccess: boolean;
  hasMockAccess: boolean;
  planName: string;
}

/**
 * Resolves permissions and accessible modules based on user and subscription data
 */
export function getUserPermissions(
  user?: any,
  subData?: CurrentSubscriptionData | null
): UserPermissions {
  const isAdmin = Boolean(
    user?.role?.name === "admin" ||
    user?.role === "admin"
  );

  // Administrator has unrestricted full MSRA access
  if (isAdmin) {
    return {
      isSubscribed: true,
      isPDOnly: false,
      isFullMSRA: true,
      isFreeOnly: false,
      hasCPSAccess: true,
      hasPDAccess: true,
      hasMockAccess: true,
      planName: "Administrator (Full Access)",
    };
  }

  // If subData is not explicitly provided, attempt reading from cached localStorage if available
  let activeSubData = subData;
  if (!activeSubData && typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("auth_subscription");
      if (cached) {
        activeSubData = JSON.parse(cached);
      }
    } catch {}
  }

  // 1. Check detailed subscription data if present
  if (activeSubData) {
    if (!activeSubData.isSubscribed || activeSubData.unlockedFeatures?.isSampleOnly) {
      return {
        isSubscribed: false,
        isPDOnly: false,
        isFullMSRA: false,
        isFreeOnly: true,
        hasCPSAccess: false,
        hasPDAccess: false,
        hasMockAccess: false,
        planName: activeSubData.activePlan?.name || "Free Sample Plan",
      };
    }

    const subCategory =
      activeSubData.activePlan?.category ||
      activeSubData.subscription?.planType ||
      "";
    const subPlanId =
      activeSubData.activePlan?.id ||
      activeSubData.subscription?.planId ||
      "";

    const isFull = Boolean(
      activeSubData.unlockedFeatures?.hasFullMSRA ||
      subCategory === "FULL_MSRA" ||
      subPlanId.startsWith("msra_")
    );

    const isPD = Boolean(
      (activeSubData.unlockedFeatures?.hasPD && !isFull) ||
      subCategory === "PD" ||
      subPlanId.startsWith("pd_")
    );

    if (isPD && !isFull) {
      return {
        isSubscribed: true,
        isPDOnly: true,
        isFullMSRA: false,
        isFreeOnly: false,
        hasCPSAccess: false,
        hasPDAccess: true,
        hasMockAccess: false,
        planName: activeSubData.activePlan?.name || "Professional Dilemmas",
      };
    }

    return {
      isSubscribed: true,
      isPDOnly: false,
      isFullMSRA: true,
      isFreeOnly: false,
      hasCPSAccess: true,
      hasPDAccess: true,
      hasMockAccess: true,
      planName: activeSubData.activePlan?.name || "Full MSRA Pass",
    };
  }

  // 2. Fallback to user object (Redux / auth_user)
  const now = new Date();
  const activeSubFromList = user?.subscriptions?.find(
    (s: any) =>
      s.status === "ACTIVE" &&
      (!s.currentPeriodEnd || new Date(s.currentPeriodEnd) > now)
  );
  const activeSub = user?.activeSubscription || activeSubFromList;

  const planType = activeSub?.planType || user?.planType || "";
  const planId = activeSub?.planId || user?.planId || "";
  const planName = activeSub?.planName || user?.planName || "";

  const isSubscribed = Boolean(
    user?.isSubscribed ||
    (activeSub && activeSub.status === "ACTIVE")
  );

  if (!isSubscribed) {
    return {
      isSubscribed: false,
      isPDOnly: false,
      isFullMSRA: false,
      isFreeOnly: true,
      hasCPSAccess: false,
      hasPDAccess: false,
      hasMockAccess: false,
      planName: "Free Sample Plan",
    };
  }

  const isFullMSRA =
    planType === "FULL_MSRA" ||
    planId.startsWith("msra_") ||
    planName.toLowerCase().includes("full msra");

  const isPDOnly =
    !isFullMSRA &&
    (planType === "PD" ||
      planId.startsWith("pd_") ||
      planName.toLowerCase().includes("dilemma"));

  if (isPDOnly) {
    return {
      isSubscribed: true,
      isPDOnly: true,
      isFullMSRA: false,
      isFreeOnly: false,
      hasCPSAccess: false,
      hasPDAccess: true,
      hasMockAccess: false,
      planName: planName || "Professional Dilemmas",
    };
  }

  // Default subscribed fallback is Full MSRA
  return {
    isSubscribed: true,
    isPDOnly: false,
    isFullMSRA: true,
    isFreeOnly: false,
    hasCPSAccess: true,
    hasPDAccess: true,
    hasMockAccess: true,
    planName: planName || "Full MSRA Pass",
  };
}

/**
 * Custom React hook to dynamically read and react to user permissions & subscriptions
 */
export function usePermissions(): UserPermissions {
  const reduxUser = useSelector((state: RootState) => (state as any).auth?.user);
  const [localUser, setLocalUser] = useState<any>(null);
  const [subData, setSubData] = useState<CurrentSubscriptionData | null>(null);

  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const u = localStorage.getItem("auth_user");
        if (u) setLocalUser(JSON.parse(u));
        const s = localStorage.getItem("auth_subscription");
        if (s) setSubData(JSON.parse(s));
      } catch {}
    };

    syncFromStorage();

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("subscription_update", syncFromStorage);
    window.addEventListener("practice_session_update", syncFromStorage);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("subscription_update", syncFromStorage);
      window.removeEventListener("practice_session_update", syncFromStorage);
    };
  }, []);

  const currentUser = reduxUser || localUser;

  return useMemo(() => {
    return getUserPermissions(currentUser, subData);
  }, [currentUser, subData]);
}
