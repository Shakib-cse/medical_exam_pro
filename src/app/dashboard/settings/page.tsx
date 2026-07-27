"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Stethoscope,
  Calendar,
  ShieldCheck,
  KeyRound,
  Save,
  Check,
  Camera
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@medicalexampro.co.uk");
  const [grade, setGrade] = useState("FY2 Doctor (Foundation Year 2)");
  const [targetExam, setTargetExam] = useState("MSRA January 2027");
  const [bio, setBio] = useState("Preparing for the MSRA exam with focus on Clinical Problem Solving and SJT modules.");

  // Success Toast state
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 container mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Account Settings
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm">
          Manage your personal profile details and security settings.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-[#07192b] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-[#07192b] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl p-4 flex items-center justify-between text-xs font-semibold shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>Your settings have been updated successfully!</span>
          </div>
        </div>
      )}

      {/* TAB 1: Profile Details Form */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Profile Photo Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Profile Picture</h3>
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-slate-200 bg-slate-800">
                  <AvatarFallback className="bg-slate-800 text-cyan-300 text-xl font-bold">
                    {fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 p-1 bg-[#f96302] text-white rounded-full shadow-md hover:bg-[#ea5b00] transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">{fullName}</h4>
                <p className="text-xs text-slate-400">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>
          </div>

          {/* Personal Information Inputs */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email Address (Disabled & Unchangeable) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    disabled
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-500 cursor-not-allowed opacity-80 select-none"
                  />
                </div>
              </div>

              {/* Target Exam */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 block">Target Exam</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bio / Preparation Notes */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 block">Preparation Notes / Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#f96302] hover:bg-[#ea5b00] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Security & Password */}
      {activeTab === "security" && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Change Password
          </h3>

          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#f96302] hover:bg-[#ea5b00] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2 pt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
