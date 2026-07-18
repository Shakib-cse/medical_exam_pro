import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Load Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // include common weights
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "VENDY",
  description: "Invoice and Billing Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={cn("font-sans", geist.variable)}
    >
      <body
        className={`${poppins.variable} font-sans antialiased bg-foreground/5 text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}