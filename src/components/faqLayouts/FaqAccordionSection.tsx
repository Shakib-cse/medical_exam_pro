"use client";

import React, { useState } from "react";
import { ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  items: FaqItem[];
}

export default function FaqAccordionSection() {
  // Track open categories (default both open)
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({
    "General - FAQ": true,
    "MSRA - FAQ": true,
  });

  // Track open items per category
  const [openItems, setOpenItems] = useState<{ [key: string]: number | null }>({
    "General - FAQ": 1, // default item 1 open in mock
    "MSRA - FAQ": 1, // default item 1 open in mock
  });

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const toggleItem = (categoryTitle: string, id: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [categoryTitle]: prev[categoryTitle] === id ? null : id,
    }));
  };

  const categories: FaqCategory[] = [
    {
      title: "General - FAQ",
      items: [
        {
          id: 1,
          question: "1. Is payment on MedicalExamPro secure?",
          answer:
            "Yes. All transactions on MedicalExamPro are encrypted using industry-standard SSL technology. We use trusted, PCI-compliant payment gateways, and we never store your credit or debit card details on our servers.",
        },
        {
          id: 2,
          question: "2. What payment methods do you accept?",
          answer:
            "We accept all major credit and debit cards, including Visa, MasterCard, and American Express, as well as digital wallets like Apple Pay and Google Pay.",
        },
        {
          id: 3,
          question: "3. Will my personal or payment details be shared with third parties?",
          answer:
            "No. We treat your privacy with utmost seriousness. Your personal data and payment details are never sold, rented, or shared with third parties for marketing purposes.",
        },
        {
          id: 4,
          question: "4. What personal data does MedicalExamPro collect and why?",
          answer:
            "We collect basic personal data (such as name and email address) and performance data to manage your account, track your progress, and deliver a personalized learning experience.",
        },
        {
          id: 5,
          question: "5. Is my data stored securely and in line with UK data protection laws?",
          answer:
            "Yes. All data is stored securely in compliance with the UK GDPR and the Data Protection Act 2018.",
        },
        {
          id: 6,
          question: "6. Will my activity or performance data be visible to others?",
          answer:
            "No. Your activity, test scores, and performance analytics are strictly confidential and visible only to you within your personal account.",
        },
        {
          id: 7,
          question: "7. Will I receive unexpected charges or automatic renewals?",
          answer:
            "No. Our subscriptions are upfront single-payment purchases for fixed access periods. We do not automatically renew subscriptions without your explicit consent.",
        },
      ],
    },
    {
      title: "MSRA - FAQ",
      items: [
        {
          id: 1,
          question: "1. How closely do your MSRA questions reflect the real exam style and difficulty?",
          answer:
            "Our questions are written and reviewed by experienced UK doctors to closely match the structure, clinical scenarios, and professional dilemma decision-making required in the official MSRA exam blueprint.",
        },
        {
          id: 2,
          question: "2. Are the answers and explanations referenced to up-to-date UK guidance?",
          answer:
            "Yes. All explanations are aligned with current UK clinical guidelines, including NICE, SIGN, RCGP, and GMC professional guidelines.",
        },
        {
          id: 3,
          question: "3. Does the question bank cover CPS and PD in the correct MSRA proportion?",
          answer:
            "Yes. The question bank is balanced according to the official MSRA weighting, providing extensive coverage of both Clinical Problem Solving (CPS) and Professional Dilemmas (PD).",
        },
        {
          id: 4,
          question: "4. How is MedicalExamPro different from other MSRA question banks?",
          answer:
            "MedicalExamPro focuses on exam-realistic question quality, in-depth explanations that explain why incorrect choices are wrong, and targeted analytics to identify weak areas.",
        },
        {
          id: 5,
          question: "5. How should I use this question bank to maximise my MSRA score?",
          answer:
            "We recommend starting with system-by-system practice, reviewing explanations thoroughly, and taking full-length timed mock exams closer to test day.",
        },
        {
          id: 6,
          question: "6. Will using MedicalExamPro guarantee me a training number in my chosen specialty?",
          answer:
            "While no resource can guarantee exam results, MedicalExamPro is designed to optimize your preparation and maximize your potential score in the MSRA.",
        },
        {
          id: 7,
          question: "7. What MSRA score do I need to get into my chosen specialty?",
          answer:
            "Score cut-offs vary each recruitment cycle depending on competition ratios and specialty demand. Higher scores generally increase your chances for top-ranked posts.",
        },
        {
          id: 8,
          question: "8. What MSRA rank do I need to get GP training?",
          answer:
            "GP training competition varies annually. A solid score in both CPS and PD papers will position you well for a training post.",
        },
        {
          id: 9,
          question: "9. Can MedicalExamPro predict my MSRA score or ranking?",
          answer:
            "Our performance analytics provide detailed insight into your performance compared to benchmark performance metrics across candidate pools.",
        },
        {
          id: 10,
          question: "10. Is MedicalExamPro suitable for candidates aiming for highly competitive specialties?",
          answer:
            "Yes. Our questions cover challenging clinical scenarios and nuanced dilemma options essential for achieving high competitive ranks.",
        },
        {
          id: 11,
          question: "11. If I have failed MSRA before, can this question bank still help me?",
          answer:
            "Absolutely. The detailed explanations and performance tracking help identify baseline knowledge gaps and refine examination technique.",
        },
        {
          id: 12,
          question: "12. Does a larger question bank automatically mean a better MSRA score?",
          answer:
            "Quality and active reflection are more important than quantity. Focusing on high-yield, exam-aligned questions yields better results than passive question grinding.",
        },
        {
          id: 13,
          question: "13. Are the questions original, or are they repeated from other MSRA question banks?",
          answer:
            "All MedicalExamPro questions are original, written from scratch by UK medical authors.",
        },
        {
          id: 14,
          question: "14. How often is the question bank updated or reviewed?",
          answer:
            "Our medical editorial team continuously reviews and updates questions whenever UK guidelines or exam patterns change.",
        },
        {
          id: 15,
          question: "15. Is this question bank suitable for international medical graduates preparing for MSRA?",
          answer:
            "Yes. It is ideal for IMGs needing to familiarize themselves with UK NHS clinical practice guidelines and GMC ethical frameworks.",
        },
        {
          id: 16,
          question: "16. Can I use MedicalExamPro as my only MSRA resource, or do I need additional materials?",
          answer:
            "MedicalExamPro provides comprehensive question coverage, explanations, and mock exams for thorough single-resource preparation.",
        },
        {
          id: 17,
          question: "17. Do the professional dilemmas questions reflect real MSRA ranking behaviour rather than idealised ethics?",
          answer:
            "Yes. Our PD scenarios test realistic workplace priorities and situational judgment criteria expected in UK practice.",
        },
        {
          id: 18,
          question: "18. How many months of revision are usually needed for the MSRA exam?",
          answer:
            "Most candidates spend 2 to 4 months of consistent preparation, depending on clinical workload and baseline knowledge.",
        },
        {
          id: 19,
          question: "19. How many hours per day should I revise for MSRA?",
          answer:
            "Consistency is key. 1 to 2 hours of focused daily practice with thorough review is often more effective than sporadic cramming.",
        },
        {
          id: 20,
          question: "20. Can I track my progress and identify weak areas using the question bank?",
          answer:
            "Yes. Your dashboard features detailed subject breakdown metrics to highlight areas needing further revision.",
        },
        {
          id: 21,
          question: "21. Are the questions suitable for both first-time MSRA candidates and those resitting the exam?",
          answer:
            "Yes. The question bank caters to all levels of preparation and candidate backgrounds.",
        },
        {
          id: 22,
          question: "22. Do the questions reflect the time pressure of the real MSRA exam?",
          answer:
            "Yes. Timed mode and mock exams simulate the pacing required for the live test environment.",
        },
        {
          id: 23,
          question: "23. Is the question bank useful for candidates applying to multiple specialties?",
          answer:
            "Yes. The MSRA is a single exam used across General Practice, Psychiatry, Radiology, Ophthalmology, Obstetrics & Gynaecology, Anaesthetics, and more.",
        },
        {
          id: 24,
          question: "24. Will practising a large number of questions improve exam technique as well as knowledge?",
          answer:
            "Yes. Regular practice improves pacing, question interpretation, and elimination strategies.",
        },
        {
          id: 25,
          question: "25. Does practising MSRA questions early really make a difference to final performance?",
          answer:
            "Early practice allows ample time to build familiarity with situational judgment rules and clinical patterns.",
        },
        {
          id: 26,
          question: "26. Do I need to complete the entire question bank before sitting the MSRA exam?",
          answer:
            "While completing the full bank is beneficial, quality review of completed questions is more important than rushing through.",
        },
        {
          id: 27,
          question: "27. Is MSRA more about clinical knowledge or exam technique?",
          answer:
            "It requires both. Clinical knowledge forms the foundation, while decision-making technique and pacing are crucial for top scores.",
        },
        {
          id: 28,
          question: "28. Does MSRA preparation differ depending on whether I am applying for GP or hospital specialties?",
          answer:
            "The MSRA exam paper is identical regardless of the specialty you apply for.",
        },
        {
          id: 29,
          question: "29. Is the MSRA exam online, and do you sit it at home or in a test centre?",
          answer:
            "The MSRA is delivered via Pearson VUE test centres or online via remote proctoring depending on recruitment guidelines.",
        },
        {
          id: 30,
          question: "30. Can I sit the MSRA exam outside the UK?",
          answer:
            "Yes. Pearson VUE test centres worldwide host the MSRA exam.",
        },
        {
          id: 31,
          question: "31. How often is the MSRA exam held, and can you appeal your score?",
          answer:
            "The MSRA is held twice a year during recruitment windows (Round 1 and Round 2). Score appeals follow official recruitment office procedures.",
        },
      ],
    },
  ];

  return (
    <section className="w-full bg-[#F8FAFC] py-12 sm:py-16 lg:py-20 text-slate-900 min-h-screen">
      <div className="container mx-auto px-4 space-y-8">
        {categories.map((cat) => {
          const isCategoryOpen = !!openCategories[cat.title];
          const activeItemId = openItems[cat.title];

          return (
            <div
              key={cat.title}
              className="bg-[#EAEFF5] border border-slate-300/60 rounded-3xl p-5 sm:p-7 shadow-sm transition-all"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.title)}
                className="w-full flex items-center justify-between text-left focus:outline-none group pb-2"
              >
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#072438] tracking-tight">
                  {cat.title}
                </h2>
                <div className="p-1.5 rounded-full bg-white/60 group-hover:bg-white text-[#072438] transition-colors">
                  {isCategoryOpen ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </button>

              {/* Accordion Items List */}
              {isCategoryOpen && (
                <div className="mt-4 space-y-3">
                  {cat.items.map((item) => {
                    const isOpen = activeItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl transition-all border ${
                          isOpen
                            ? "bg-white border-slate-200 shadow-md p-5 sm:p-6"
                            : "bg-white/80 hover:bg-white border-slate-200/80 p-4 sm:p-5"
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(cat.title, item.id)}
                          className="w-full flex items-start justify-between gap-4 text-left focus:outline-none"
                        >
                          <span className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
                            {item.question}
                          </span>

                          <div className="shrink-0 mt-0.5 text-slate-600 hover:text-slate-900 transition-colors">
                            {isOpen ? (
                              <Minus size={20} className="stroke-[2.5]" />
                            ) : (
                              <Plus size={20} className="stroke-[2.5]" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="mt-3 pt-3 border-t border-slate-100 text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
