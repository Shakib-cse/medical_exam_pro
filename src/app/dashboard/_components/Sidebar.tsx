"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HelpCircle,
  FileCheck2,
  Bookmark,
  Settings,
  CreditCard,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navSections = [
    {
      title: "LEARNING",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Question Bank", href: "/dashboard/question-bank", icon: HelpCircle },
        { label: "Mock Exams", href: "/dashboard/mock-exams", icon: FileCheck2 },
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
        className="lg:hidden fixed top-3 left-4 z-50 p-2 rounded-lg bg-[#081726] text-white shadow-md border border-slate-700"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#081726] text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800/80 shadow-2xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Brand Logo Header with Responsive Left Padding */}
        <div className="h-16 pl-16 pr-6 lg:px-6 flex items-center gap-2.5 border-b border-slate-800/80">
          <div className="rounded-lg flex items-center justify-center">
            <Image width={140} height={20} src="/images/commonLayout/headerlogo.png" alt="logo" />
          </div>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 py-6 px-4 space-y-7 overflow-y-auto custom-scrollbar">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-2">
              <h4 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h4>
              <nav className="space-y-1">
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/dashboard");
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 group relative",
                        isActive
                          ? "bg-[#112a45] text-white font-semibold shadow-inner border border-slate-700/50"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400" />
                      )}
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                        )}
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
        <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          MedicalExamPro &copy; 2026
        </div>
      </aside>
    </>
  );
}
