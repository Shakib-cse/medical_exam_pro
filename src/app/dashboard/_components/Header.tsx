"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, User, LogOut, Settings, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("medicalexampro_practice_session");
    }
    router.push("/");
  };

  return (
    <header className="h-16 w-full bg-[#07192b] border-b border-slate-800/90 pl-14 sm:pl-16 lg:px-8 pr-4 sm:pr-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Welcome Title */}
      <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight truncate">
        Welcome Back, Alex
      </h1>

      {/* Right Controls: Search + User Avatar */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* Search Bar */}
        {/* <div className="relative w-36 sm:w-64 lg:w-72">
          <input
            type="text"
            placeholder="Search systems, SJT..."
            className="w-full bg-[#0d263f] text-slate-200 placeholder:text-slate-400 text-xs rounded-full py-1.5 pl-3.5 pr-8 border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div> */}

        {/* User Profile Avatar with Dropdown Popup */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative p-0.5 rounded-full hover:ring-2 hover:ring-cyan-400/40 transition-all focus:outline-none cursor-pointer"
            aria-label="User profile menu"
          >
            <Avatar className="w-8 h-8 border border-slate-700 bg-slate-800">
              <AvatarFallback className="bg-slate-800 text-cyan-300">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </button>

          {/* Profile Popup Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#09223c] border border-slate-700/90 rounded-xl shadow-2xl z-50 p-2 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Header */}
              <div className="px-3 py-2.5 border-b border-slate-700/80 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Alex Morgan</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/80 rounded-md">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  alex.morgan@medicalexampro.co.uk
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1 space-y-0.5">
                <Link
                  href="/dashboard/subscription"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Account & Subscription</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout Action */}
              <div className="pt-1 border-t border-slate-700/80">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
