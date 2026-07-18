import Footer from "@/components/commonLayouts/Footer";
import Header from "@/components/commonLayouts/Header";
import React from "react";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
