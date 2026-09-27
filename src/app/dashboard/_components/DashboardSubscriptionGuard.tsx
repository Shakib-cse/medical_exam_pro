"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FreeSampleDashboard } from "./FreeSampleDashboard";
import { usePermissions } from "@/lib/permissions";

// Routes that unsubscribed (free) users are permitted to access within /dashboard
const FREE_EXACT_ROUTES = ["/dashboard"];
const FREE_PREFIX_ROUTES = [
  "/dashboard/subscription",
  "/dashboard/settings",
  "/dashboard/support",
  "/dashboard/flags",
  "/dashboard/free-sample",
];

export function isRouteAllowedForFree(pathname: string): boolean {
  if (FREE_EXACT_ROUTES.includes(pathname)) {
    return true;
  }
  return FREE_PREFIX_ROUTES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isRouteAllowedForPD(pathname: string): boolean {
  if (
    pathname.startsWith("/dashboard/clinical-problem-solving") ||
    pathname.startsWith("/dashboard/mock-exams")
  ) {
    return false;
  }
  return true;
}

export function DashboardSubscriptionGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const permissions = usePermissions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAllowedForFree = isRouteAllowedForFree(pathname);
  const isAllowedForPD = isRouteAllowedForPD(pathname);

  useEffect(() => {
    if (!mounted) return;

    // Free user trying to access paid-only route
    if (permissions.isFreeOnly && !isAllowedForFree) {
      router.replace("/dashboard");
      return;
    }

    // PD-only user trying to access Clinical or Mock Exam routes
    if (permissions.isPDOnly && !isAllowedForPD) {
      router.replace("/dashboard");
      return;
    }
  }, [
    mounted,
    permissions.isFreeOnly,
    permissions.isPDOnly,
    isAllowedForFree,
    isAllowedForPD,
    router,
  ]);

  // If free user on disallowed route
  if (mounted && permissions.isFreeOnly && !isAllowedForFree) {
    return <FreeSampleDashboard />;
  }

  // If PD user on disallowed route
  if (mounted && permissions.isPDOnly && !isAllowedForPD) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="w-10 h-10 border-4 border-[#1875d2] border-t-transparent rounded-full animate-spin" />
        <h3 className="text-lg font-bold text-slate-800">Redirecting to Dashboard...</h3>
        <p className="text-sm text-slate-500 max-w-md">
          This module is part of the Full MSRA Pass. Redirecting you to your active Professional Dilemmas dashboard.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
