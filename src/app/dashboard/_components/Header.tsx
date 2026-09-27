"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, User, LogOut, Settings, ShieldCheck, HelpCircle, Zap, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";

export function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => (state as any).auth?.user);
  const [localUser, setLocalUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync stored user for client-side persistence and hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        setLocalUser(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const user = reduxUser || localUser;
  const isAdmin = Boolean(
    user?.role?.name === "admin" ||
    user?.role === "admin"
  );
  const isSubscribed = Boolean(user?.isSubscribed || isAdmin);

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
    dispatch(logout());
    if (typeof window !== "undefined") {
      localStorage.removeItem("medicalexampro_practice_session");
    }
    router.push("/auth/sign-in");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/question-bank?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 w-full bg-[#082138] border-b border-[#152e4a]/80 pl-14 sm:pl-16 lg:px-8 pr-4 sm:pr-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Brand / Title indicator */}
      <div className="flex items-center gap-2">
        {/* Placeholder for header breadcrumbs or view indicator */}
      </div>

      {/* Right Controls: Search + User Avatar */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-64 md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search systems, SJT, or questions..."
            className="w-full bg-[#0d2a47] text-slate-200 placeholder:text-slate-400 text-xs rounded-full py-2 pl-4 pr-9 border border-[#1a3f65] focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-all shadow-inner"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* User Profile Avatar with Dropdown Popup */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative p-0.5 rounded-full hover:ring-2 hover:ring-cyan-500/50 transition-all focus:outline-none cursor-pointer flex items-center justify-center bg-[#13375c] text-white w-9 h-9 border border-[#1e4a78]"
            aria-label="User profile menu"
          >
            <Avatar className="w-8 h-8 bg-transparent">
              <AvatarFallback className="bg-transparent text-white font-bold text-xs">
                {user?.firstName ? (
                  user.firstName.charAt(0).toUpperCase()
                ) : user?.displayName ? (
                  user.displayName.charAt(0).toUpperCase()
                ) : (
                  <User className="w-4 h-4 text-cyan-300" />
                )}
              </AvatarFallback>
            </Avatar>
          </button>

          {/* Profile Popup Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#082138] border border-[#183657] rounded-xl shadow-2xl z-50 p-2 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
              {/* Profile Header */}
              <div className="px-3 py-2.5 border-b border-[#183657] space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-white text-sm truncate max-w-[150px]">
                    {user?.firstName || user?.lastName
                      ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                      : user?.displayName || "User"}
                  </span>
                  {isAdmin ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-purple-600 text-white rounded-md shadow-xs tracking-wider shrink-0">
                      ADMIN
                    </span>
                  ) : isSubscribed ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#f97316] text-white rounded-md shadow-xs tracking-wider shrink-0">
                      PRO
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-700/80 text-slate-300 border border-slate-600/70 rounded-md shadow-xs tracking-wider shrink-0">
                      FREE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#97afc7] truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              {/* Free user upgrade prompt */}
              {!isSubscribed && (
                <div className="p-1.5 border-b border-[#183657]">
                  <Link
                    href="/dashboard/subscription"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#ea580c] to-[#f97316] hover:from-[#c2410c] hover:to-[#ea580c] text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-white shrink-0" />
                      <span>Upgrade to Pro</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                </div>
              )}

              {/* Menu Items */}
              <div className="py-1 space-y-0.5">
                <Link
                  href="/dashboard/subscription"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Subscription</span>
                </Link>
                <Link
                  href="/dashboard/support"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span>Help & Support</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              {/* Logout Action */}
              <div className="pt-1 border-t border-[#183657]">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2.5 transition-colors cursor-pointer"
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
