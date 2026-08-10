"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StandalonePracticePageWrapper from "@/app/practice/page";

export default function DashboardPracticePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Loading Practice Module...</div>}>
      <StandalonePracticePageWrapper />
    </Suspense>
  );
}
