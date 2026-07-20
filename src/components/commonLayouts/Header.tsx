"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Exams & Interviews Resources",
      path: "/resources",
      highlighted: true,
    },
    {
      name: "Exam Guide",
      path: "/exam-guide",
      hasDropdown: true,
      options: ["MSRA Overview", "Exam Format", "Scoring & Weighting"],
    },
    {
      name: "How to Prepare",
      path: "/how-to-prepare",
      hasDropdown: true,
      options: ["Revision Plan", "Practice Questions", "Mock Exams"],
    },
    { name: "About", path: "/about" },
    { name: "FAQs", path: "/faqs" },
  ];

  return (
    <header className="absolute top-4 sm:top-6 left-0 right-0 z-50 container mx-auto px-4">
      <div className="w-full bg-[#093352]/80 backdrop-blur-md border border-white/10 rounded-full py-2.5 px-5 sm:px-7 shadow-xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-row items-center justify-center">
          <Image
            src="/images/commonLayout/headerlogo.png"
            alt="MedicalExamPro Logo"
            width={180}
            height={50}
            priority
            className="h-auto w-auto max-h-7 sm:max-h-8 md:max-h-9 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => {
            if (link.highlighted) {
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className="text-xs sm:text-sm font-medium text-brand-orange hover:text-brand-orange/90 transition-colors"
                >
                  {link.name}
                </Link>
              );
            }

            if (link.hasDropdown) {
              return (
                <div
                  key={link.name}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-colors py-1">
                    {link.name}
                    <ChevronDown
                      size={14}
                      className="text-white/70 group-hover:text-white transition-transform group-hover:rotate-180"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === link.name && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#093352]/95 border border-white/10 rounded-xl shadow-xl py-2 z-50 backdrop-blur-lg animate-in fade-in slide-in-from-top-2 duration-150">
                      {link.options?.map((option) => (
                        <Link
                          key={option}
                          href="#"
                          className="block px-4 py-2 text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {option}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.path}
                className="text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Buttons */}
        <div className="hidden lg:flex items-center gap-5">
          <Link
            href="/auth/sign-in"
            className="text-xs sm:text-sm font-medium text-white/90 hover:text-white transition-colors"
          >
            Log In
          </Link>

          <Link
            href="/auth/sign-up"
            className="bg-brand-orange hover:bg-brand-orange/90 text-white text-xs sm:text-sm font-semibold rounded-full px-5 py-2 transition-all shadow-md hover:shadow-brand-orange/20"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden text-white p-1 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-[#093352] text-white z-50 shadow-2xl transition-transform duration-300 lg:hidden border-l border-white/10 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/images/commonLayout/headerlogo.png"
              alt="MedicalExamPro Logo"
              width={140}
              height={40}
              className="h-auto w-auto max-h-7 object-contain"
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-lg text-white"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-base font-medium ${link.highlighted ? "text-brand-orange" : "text-white/90 hover:text-white"
                }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-white/10">
            <Link
              href="/auth/sign-in"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 text-center rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-colors text-sm"
            >
              Log In
            </Link>

            <Link
              href="/auth/sign-up"
              onClick={() => setIsOpen(false)}
              className="w-full py-2.5 text-center rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold shadow-md transition-colors text-sm"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

