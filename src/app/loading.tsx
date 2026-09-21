import React from "react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="h-1 w-full bg-gradient-to-r from-[#1D82EB] via-[#FF6B00] to-[#1D82EB] animate-pulse shadow-xs" />
    </div>
  );
}