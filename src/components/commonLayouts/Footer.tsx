"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy text-slate-300 py-12 md:py-16 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 w-full pb-12 text-center sm:text-left">
          {/* Logo & Description */}
          <div className="flex flex-col items-center sm:items-start">
            <Link href="/" className="inline-block">
              <Image
                src="/images/commonLayout/headerlogo.png"
                alt="MedicalExamPro Logo"
                width={200}
                height={60}
                className="h-auto w-auto max-h-11 object-contain"
              />
            </Link>

            <p className="mt-4 text-xs sm:text-sm text-slate-300/80 leading-relaxed max-w-sm text-center sm:text-left">
              The premium platform for MSRA preparation. Built by UK doctors,
              for future doctors.
            </p>

            {/* Social Icons */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
              <Link
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-slate-200" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </Link>

              <Link
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors"
              >
                <svg className="w-4 h-4 fill-current text-slate-200" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>

              <Link
                href="#"
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-200 transition-colors"
              >
                <Mail size={16} />
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-4">
              Resources
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link
                  href="/resources/exams"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  Exams
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/interviews"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  Interviews Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-4">
              Support
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h3 className="text-white font-semibold text-sm sm:text-base mb-4">
              Legal
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refunds"
                  className="text-slate-300/80 hover:text-white transition-colors"
                >
                  Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-slate-400/90 font-normal">
            © 2026 MedicalExamPro. All rights reserved. Medical Excellence Group
            Limited, England &amp; Wales.
          </p>
        </div>
      </div>
    </footer>
  );
}

