"use client";
import Link from "next/link";

const quickLinks = [
  { name: "Features", href: "#" },
  { name: "Industries", href: "#" },
  { name: "Pricing", href: "#" },
  { name: "Resources", href: "#" },
  { name: "Contact", href: "#" },
];

const socialLinks = [
  { name: "LinkedIn", href: "#" },
  { name: "Twitter (X)", href: "#" },
  { name: "Facebook", href: "#" },
  { name: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <h1 className="text-2xl font-bold text-primary">VENDY</h1>

            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Powering Modern Businesses in Angola.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">Quick Links</h3>

            <ul className="space-y-4">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition hover:text-background"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">Social</h3>

            <ul className="space-y-4">
              {socialLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition hover:text-background"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-semibold">Contact</h3>

            <ul className="space-y-4 text-muted-foreground">
              <li>J. Roya Ubud No.70, Ubud - Bali</li>
              <li>+09 012-345-6789</li>
              <li>hello@vendy.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-background/10 pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VENDY reserved the all rights.
          </p>
        </div>
      </div>
    </footer>
  );
}
