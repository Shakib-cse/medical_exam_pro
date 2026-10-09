/**
 * Centralized Tracking & Conversion Analytics Module
 * Configured for:
 * - Google Analytics 4 (GA4): G-MDB0HGJBB9
 * - Google Ads: AW-18500329112
 * - Meta Pixel: 3207242139667023
 *
 * Implements strict purchase deduplication to prevent duplicate conversion fires across:
 * - React StrictMode double mounts
 * - Page refreshes with ?status=success query parameters
 * - Back-button or multi-tab replays
 */

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID || "G-MDB0HGJBB9";

export const GOOGLE_ADS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18500329112";

export const GOOGLE_ADS_CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || "";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "3207242139667023";

const DEDUPLICATION_STORAGE_KEY = "mep_tracked_purchases";

// In-memory cache to catch instantaneous synchronous re-triggers within same tick
const inMemoryTrackedPurchases = new Set<string>();

// Global Window interface extensions for TypeScript
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    __MEP_TRACKING__?: any;
  }
}

export interface PurchaseEventParams {
  transactionId: string;
  value: number;
  currency?: string;
  planId: string;
  planName: string;
  couponCode?: string;
  discountAmount?: number;
}

export interface CheckoutEventParams {
  planId: string;
  planName: string;
  value: number;
  currency?: string;
}

/**
 * Checks if a purchase with the given transactionId has already been tracked.
 */
export function isPurchaseTracked(transactionId: string): boolean {
  if (!transactionId) return false;
  if (inMemoryTrackedPurchases.has(transactionId)) return true;

  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    try {
      const stored = window.localStorage.getItem(DEDUPLICATION_STORAGE_KEY);
      if (stored) {
        const list: string[] = JSON.parse(stored);
        if (Array.isArray(list) && list.includes(transactionId)) {
          inMemoryTrackedPurchases.add(transactionId);
          return true;
        }
      }
    } catch (e) {
      console.warn("[Analytics] Could not read purchase deduplication storage:", e);
    }
  }

  return false;
}

/**
 * Marks a transactionId as tracked in both in-memory cache and localStorage.
 */
export function markPurchaseAsTracked(transactionId: string): void {
  if (!transactionId) return;
  inMemoryTrackedPurchases.add(transactionId);

  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    try {
      const stored = window.localStorage.getItem(DEDUPLICATION_STORAGE_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(transactionId)) {
        list.push(transactionId);
        // Keep the latest 100 transactions to manage storage footprint
        if (list.length > 100) {
          list.splice(0, list.length - 100);
        }
        window.localStorage.setItem(DEDUPLICATION_STORAGE_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.warn("[Analytics] Could not write purchase deduplication storage:", e);
    }
  }
}

/**
 * Get all tracked purchases (useful for debugging/testing)
 */
export function getTrackedPurchases(): string[] {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return Array.from(inMemoryTrackedPurchases);
  }
  try {
    const stored = window.localStorage.getItem(DEDUPLICATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : Array.from(inMemoryTrackedPurchases);
  } catch {
    return Array.from(inMemoryTrackedPurchases);
  }
}

/**
 * Clear tracked purchases (for development/testing purposes)
 */
export function clearTrackedPurchases(): void {
  inMemoryTrackedPurchases.clear();
  if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    try {
      window.localStorage.removeItem(DEDUPLICATION_STORAGE_KEY);
      console.log("[Analytics] Cleared purchase deduplication history.");
    } catch (e) {
      console.warn("[Analytics] Failed to clear tracked purchases:", e);
    }
  }
}

/**
 * Track PageView event across GA4 and Meta Pixel
 */
export function trackPageView(url?: string): void {
  if (typeof window === "undefined") return;

  const pagePath = url || window.location.pathname;

  // GA4 Page View
  if (typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
    window.gtag("event", "page_view", {
      page_path: pagePath,
    });
  }

  // Meta Pixel Page View
  if (typeof window.fbq === "function" && META_PIXEL_ID) {
    window.fbq("track", "PageView");
  }
}

/**
 * Track Purchase Conversion across Google Ads, GA4, and Meta Pixel.
 * Strictly guarantees no duplicate events are sent for the same transactionId.
 *
 * @returns boolean - true if successfully tracked, false if skipped due to deduplication or missing ID
 */
export function trackPurchase(params: PurchaseEventParams): boolean {
  const {
    transactionId,
    value,
    currency = "GBP",
    planId,
    planName,
    couponCode,
  } = params;

  if (!transactionId) {
    console.warn("[Analytics] ⚠️ Purchase event skipped: Missing transactionId.");
    return false;
  }

  // Strictly prevent duplicate purchase tracking
  if (isPurchaseTracked(transactionId)) {
    console.warn(
      `[Analytics] 🛡️ Duplicate Purchase blocked for transaction ID: ${transactionId}`
    );
    return false;
  }

  // Mark as tracked immediately before firing external network tags
  markPurchaseAsTracked(transactionId);

  const numericValue = Number(value) || 0;

  console.log("🚀 [Analytics] Tracking Purchase Conversion:", {
    transactionId,
    value: numericValue,
    currency,
    planId,
    planName,
    couponCode,
  });

  if (typeof window !== "undefined") {
    // 1. GA4 Ecommerce Purchase Event
    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", "purchase", {
          transaction_id: transactionId,
          value: numericValue,
          currency,
          coupon: couponCode || undefined,
          items: [
            {
              item_id: planId,
              item_name: planName,
              price: numericValue,
              quantity: 1,
            },
          ],
        });
      } catch (err) {
        console.error("[Analytics] Error sending GA4 purchase event:", err);
      }

      // 2. Google Ads Purchase Conversion Event
      if (GOOGLE_ADS_ID) {
        try {
          const sendTo = GOOGLE_ADS_CONVERSION_LABEL
            ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
            : GOOGLE_ADS_ID;

          window.gtag("event", "conversion", {
            send_to: sendTo,
            value: numericValue,
            currency,
            transaction_id: transactionId,
          });
        } catch (err) {
          console.error("[Analytics] Error sending Google Ads conversion event:", err);
        }
      }
    }

    // 3. Meta Pixel (Facebook) Purchase Event with eventID for deduplication
    if (typeof window.fbq === "function" && META_PIXEL_ID) {
      try {
        window.fbq(
          "track",
          "Purchase",
          {
            value: numericValue,
            currency,
            content_name: planName,
            content_ids: [planId],
            content_type: "product",
            num_items: 1,
          },
          {
            eventID: transactionId, // Deduplication key for Meta Conversions API & browser pixel
          }
        );
      } catch (err) {
        console.error("[Analytics] Error sending Meta Pixel purchase event:", err);
      }
    }
  }

  return true;
}

/**
 * Track Initiate Checkout / begin_checkout
 */
export function trackInitiateCheckout(params: CheckoutEventParams): void {
  const { planId, planName, value, currency = "GBP" } = params;
  const numericValue = Number(value) || 0;

  if (typeof window === "undefined") return;

  // GA4 begin_checkout
  if (typeof window.gtag === "function") {
    window.gtag("event", "begin_checkout", {
      value: numericValue,
      currency,
      items: [
        {
          item_id: planId,
          item_name: planName,
          price: numericValue,
          quantity: 1,
        },
      ],
    });
  }

  // Meta Pixel InitiateCheckout
  if (typeof window.fbq === "function" && META_PIXEL_ID) {
    window.fbq("track", "InitiateCheckout", {
      value: numericValue,
      currency,
      content_name: planName,
      content_ids: [planId],
      content_type: "product",
      num_items: 1,
    });
  }
}

/**
 * Track Sign Up / CompleteRegistration
 */
export function trackSignUp(method: string = "email"): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", "sign_up", { method });
  }

  if (typeof window.fbq === "function" && META_PIXEL_ID) {
    window.fbq("track", "CompleteRegistration", {
      content_name: "User Registration",
      status: true,
    });
  }
}

/**
 * Track Sign In / login
 */
export function trackLogin(method: string = "email"): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", "login", { method });
  }
}

// Expose on window in browser for runtime verification and testing
if (typeof window !== "undefined") {
  window.__MEP_TRACKING__ = {
    GA_MEASUREMENT_ID,
    GOOGLE_ADS_ID,
    META_PIXEL_ID,
    trackPurchase,
    trackInitiateCheckout,
    trackSignUp,
    trackLogin,
    trackPageView,
    isPurchaseTracked,
    getTrackedPurchases,
    clearTrackedPurchases,
  };
}
