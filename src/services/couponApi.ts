import { api } from "@/lib/api";

export interface ValidatedCouponInfo {
  isValid: boolean;
  discountAmount: number;
  finalPrice: number;
  coupon: {
    id: string;
    code: string;
    description?: string | null;
    discountType: "PERCENTAGE" | "FIXED_AMOUNT";
    discountValue: number;
  };
}

export const couponApi = {
  validateCoupon: async (code: string, planId?: string): Promise<ValidatedCouponInfo> => {
    const res = await api.post<{ success: boolean; data: ValidatedCouponInfo }>("/coupons/validate", {
      code: code.trim().toUpperCase(),
      planId,
    });
    return res.data.data;
  },
};
