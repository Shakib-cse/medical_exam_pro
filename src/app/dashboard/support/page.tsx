"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Send, CheckCircle2, LifeBuoy, Mail, MessageSquare, AlertCircle } from "lucide-react";

export default function SupportPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !email.trim() || !description.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("http://localhost:3030/api/v1/overview/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          email: email.trim(),
          description: description.trim(),
          userId: user?.id || "",
          userName:
            user?.displayName ||
            (user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Candidate"),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send support message");
      }

      setSubmitted(true);
      setSubject("");
      setDescription("");
    } catch (err: any) {
      console.error("Support submit error:", err);
      setErrorMessage("Could not send message to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 max-w-4xl">
      {/* 1. Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Help &amp; Support
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm font-medium">
          Need help with something? Send us a message and our support team will help.
        </p>
      </div>

      {/* 2. Contact Support Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs space-y-6">
        {submitted ? (
          <div className="p-8 text-center space-y-3 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Message Sent Successfully!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out. Our support team will review your inquiry and respond to <strong>{email}</strong> within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What do you need help with?"
                  className="w-full bg-slate-50/70 text-slate-800 placeholder:text-slate-400 text-xs rounded-xl py-3 px-4 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full bg-slate-50/70 text-slate-800 placeholder:text-slate-400 text-xs rounded-xl py-3 px-4 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Description</label>
              <textarea
                rows={6}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="w-full bg-slate-50/70 text-slate-800 placeholder:text-slate-400 text-xs rounded-xl p-4 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all resize-y"
              />
            </div>

            {/* Bottom Row */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                <LifeBuoy className="w-3.5 h-3.5 text-slate-400" />
                Our support team will get back to you as soon as possible.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-brand-orange hover:bg-brand-orange/90 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-brand-orange/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? "Sending..." : "Send Message"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
