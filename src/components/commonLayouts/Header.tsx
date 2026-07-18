"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "Industries", path: "/industries" },
    { name: "Pricing", path: "/pricing" },
    { name: "Resources", path: "/resources" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-lg">
      <div className="container mx-auto h-16 px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold text-primary tracking-tight"
        >
          VENDY
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.path);

            return (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button className="rounded-xl px-7 h-11 bg-primary hover:bg-primary/80 text-white">
            Log In
          </Button>

          <Button
            variant="outline"
            className="rounded-xl px-7 h-11 border-muted-foreground text-muted-foreground hover:bg-muted"
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(true)} className="lg:hidden">
          <Menu size={28} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-background z-50 shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b">
          <h2 className="font-semibold text-lg">Menu</h2>

          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg ${
                pathname.startsWith(link.path)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-6 flex flex-col gap-3">
            <Button className="w-full h-11 rounded-xl bg-primary hover:bg-primary/80">
              Log In
            </Button>

            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-muted-foreground text-muted-foreground hover:bg-muted"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
