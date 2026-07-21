"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      quote:
        '"The mock exams were incredibly realistic. The CPS rationales helped me understand exactly why I was getting questions wrong. Secured my first-choice GP post!"',
      author: "Dr. Sarah J.",
      role: "GP Trainee",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    },
    {
      quote:
        '"MedicalExamPro\'s SJT section is the best on the market. The scenarios accurately reflect the ambiguity of the real MSRA professional dilemmas."',
      author: "Dr. Ahmed M.",
      role: "Core Surgical Trainee",
      avatar:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    },
    {
      quote:
        '"I loved the analytics dashboard. It clearly highlighted my weakness in pharmacology, allowing me to focus my revision where it mattered most."',
      author: "Dr. Emily R.",
      role: "Radiology Trainee",
      avatar:
        "https://images.unsplash.com/photo-1594824813566-88855ce78996?auto=format&fit=crop&q=80&w=200",
    },
  ];

  return (
    <section className="w-full bg-navy text-white py-16 sm:py-20 lg:py-24 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-tight mb-3">
            Trusted by Future Doctors
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-normal">
            Join thousands of doctors who secured their top training posts.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-navy-card border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col justify-between transition-all hover:border-white/20"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1.5 mb-5 text-brand-orange">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-current text-brand-orange"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-200/90 italic font-normal leading-relaxed mb-6">
                  {item.quote}
                </p>
              </div>

              {/* Author Footer */}
              <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                <Image
                  src={item.avatar}
                  alt={item.author}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                />
                <div className="flex flex-col text-left">
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {item.author}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-300/80">
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
