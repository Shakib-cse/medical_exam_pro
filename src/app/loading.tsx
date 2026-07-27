import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md text-slate-900 transition-all duration-300">
      <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-white shadow-2xl border border-slate-100/80 max-w-sm w-full mx-4 text-center">
        {/* Pulsing Brand Logo Container */}
        <div className="relative mb-7 flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#1D82EB]/25 to-[#FF6B00]/25 blur-xl animate-pulse" />
          <Image
            src="/images/commonLayout/logo.png"
            alt="MedicalExamPro Logo"
            width={180}
            height={55}
            priority
            className="h-10 w-auto object-contain relative z-10"
          />
        </div>

        {/* Premium Dual-Ring Spinner */}
        <div className="relative w-11 h-11 mb-5">
          {/* Outer background track */}
          <div className="absolute inset-0 rounded-full border-3 border-slate-100" />
          {/* Animated gradient spinner */}
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-[#1D82EB] border-r-[#FF6B00] animate-spin" />
        </div>

        {/* Text indicator */}
        <p className="text-slate-500 font-semibold text-xs sm:text-sm tracking-wider uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}