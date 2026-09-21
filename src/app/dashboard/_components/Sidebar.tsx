"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  Clock,
  Settings,
  Headphones,
  Stethoscope,
  Scale,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentType = searchParams.get("type");

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home, exact: true },
    {
      label: "Clinical Problem Solving",
      href: "/dashboard/clinical-problem-solving",
      icon: Stethoscope,
      match: () =>
        pathname.startsWith("/dashboard/clinical-problem-solving") ||
        (pathname.includes("/question-bank") && currentType === "Clinical"),
    },
    {
      label: "Professional Dilemmas",
      href: "/dashboard/professional-dilemmas",
      icon: Scale,
      match: () =>
        pathname.startsWith("/dashboard/professional-dilemmas") ||
        (pathname.includes("/question-bank") && currentType === "SJT"),
    },
    {
      label: "Mock Exams",
      href: "/dashboard/mock-exams",
      icon: Clock,
      match: () => pathname.startsWith("/dashboard/mock-exams"),
    },
  ];

  const bottomNavItems = [
    {
      label: "Help & Support",
      href: "/dashboard/support",
      icon: Headphones,
      match: () => pathname.startsWith("/dashboard/support"),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      match: () => pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-4 z-50 p-2 rounded-lg bg-[#0e2136] text-white shadow-md border border-slate-700 cursor-pointer"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#082138] text-[#97afc7] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-[#152e4a]/80 select-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Brand Logo Header */}
        <div className="h-16 pl-16 pr-6 lg:px-6 flex items-center border-b border-[#152e4a]/70">
          <Link href="/" className="flex items-center">
            <Image
              width={140}
              height={24}
              src="/images/commonLayout/headerlogo.png"
              alt="MedicalExamPro"
              priority
              className="h-auto w-auto max-h-7 object-contain"
            />
          </Link>
        </div>

        {/* Main Navigation Content */}
        <div className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto custom-scrollbar">
          <nav className="space-y-1.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.match
                ? item.match()
                : item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13.5px] transition-all duration-150",
                    isActive
                      ? "bg-[#144372] text-white font-semibold shadow-xs"
                      : "text-[#97afc7] hover:text-white hover:bg-white/[0.04] font-medium"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={cn(
                        "w-4.5 h-4.5 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-[#829bb5]"
                      )}
                      strokeWidth={1.8}
                    />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="p-3.5 border-t border-[#152e4a]/70 space-y-1.5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match ? item.match() : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch={true}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-[13.5px] transition-all duration-150",
                  isActive
                    ? "bg-[#144372] text-white font-semibold shadow-xs"
                    : "text-[#97afc7] hover:text-white hover:bg-white/[0.04] font-medium"
                )}
              >
                <Icon
                  className={cn(
                    "w-4.5 h-4.5 shrink-0 transition-colors",
                    isActive ? "text-white" : "text-[#829bb5]"
                  )}
                  strokeWidth={1.8}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 text-[11px] text-[#4e6f90] text-center">
            MedicalExamPro &copy; {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
}
