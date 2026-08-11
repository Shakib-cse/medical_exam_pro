"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  Settings,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

// Question Bank Icon matching the exact rounded document / list icon in the image
function QuestionBankIcon({ className, strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <line x1="8" y1="8.5" x2="16" y2="8.5" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="15.5" x2="16" y2="15.5" />
    </svg>
  );
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navSections = [
    {
      title: "LEARNING",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Question Bank", href: "/dashboard/question-bank", icon: QuestionBankIcon },
        { label: "Mock Exams", href: "/dashboard/mock-exams", icon: Clock },
      ],
    },
    {
      title: "PERSONAL",
      items: [
        { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
      ],
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
          "fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#0d2035] text-[#97afc7] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-[#152e4a]/80 select-none",
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

        {/* Navigation Content */}
        <div className="flex-1 py-6 px-3.5 space-y-6 overflow-y-auto custom-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <h4 className="px-3.5 text-[11px] font-bold text-[#4e6f90] uppercase tracking-[0.14em]">
                {section.title}
              </h4>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-[14px] transition-all duration-150",
                        isActive
                          ? "bg-[#184877] text-white font-semibold shadow-xs"
                          : "text-[#97afc7] hover:text-white hover:bg-white/[0.04] font-medium"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors",
                          isActive ? "text-white" : "text-[#97afc7]"
                        )}
                        strokeWidth={1.8}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Footer/Version Info */}
        <div className="p-4 border-t border-[#152e4a]/70 text-[11px] text-[#4e6f90] text-center">
          MedicalExamPro &copy; {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
}
