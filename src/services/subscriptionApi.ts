import { api } from "@/lib/api";

export interface SubscriptionPlanItem {
  id: string; // e.g. "free", "pd_1m", "pd_3m", "pd_6m", "msra_1m", "msra_3m", "msra_6m"
  name: string;
  category: "FREE" | "PD" | "FULL_MSRA";
  durationMonths: number;
  priceGBP: number;
  currency: string;
  casesCount: number;
  mockExamsCount: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isBestValue?: boolean;
}

export interface CurrentSubscriptionData {
  isSubscribed: boolean;
  activePlan: SubscriptionPlanItem;
  subscription: {
    id: string;
    userId: string;
    planId: string;
    planName: string;
    planType: string;
    status: string;
    amount: number;
    currency: string;
    durationMonths: number;
    isOneOff: boolean;
    currentPeriodEnd: string;
    createdAt: string;
  } | null;
  daysRemaining: number;
  expiresAt: string | null;
  unlockedFeatures: {
    hasFullMSRA: boolean;
    hasPD: boolean;
    hasMocks: boolean;
    isSampleOnly: boolean;
  };
}

export interface CheckoutResponse {
  checkoutUrl?: string;
  sessionId?: string;
  isDev: boolean;
  message?: string;
}

export const subscriptionApi = {
  getPlans: async () => {
    const res = await api.get<{ success: boolean; data: SubscriptionPlanItem[] }>("/subscription/plans");
    return res.data;
  },

  getCurrentSubscription: async () => {
    const res = await api.get<{ success: boolean; data: CurrentSubscriptionData }>("/subscription/current");
    return res.data;
  },

  createCheckoutSession: async (planId: string, couponCode?: string) => {
    const res = await api.post<{ success: boolean; data: CheckoutResponse }>("/subscription/checkout", {
      planId,
      couponCode: couponCode ? couponCode.trim() : undefined,
    });
    return res.data;
  },

  activateDevSubscription: async (planId: string, sessionId?: string, couponCode?: string) => {
    const res = await api.post<{ success: boolean; data: any; message: string }>("/subscription/activate-dev", {
      planId,
      sessionId,
      couponCode,
    });
    return res.data;
  },
};
