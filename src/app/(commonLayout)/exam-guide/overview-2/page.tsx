import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "MSRA Exam Format and Content | MedicalExamPro",
  description:
    "Detailed insights into the structure, paper breakdown (CPS & PD), clinical categories, and topic coverage of the MSRA examination.",
};

export default function MSRAOverviewPage2() {
  const cpsCategories = [
    "Cardiovascular medicine",
    "Respiratory medicine",
    "Gastroenterology and hepatology",
    "Neurology",
    "Endocrinology and diabetes",
    "Renal medicine and urology",
    "Musculoskeletal and rheumatology",
    "Infectious diseases",
    "Psychiatry",
    "Dermatology",
    "Ophthalmology",
    "Ear, nose and throat (ENT)",
  ];

  const cpsAssesses = [
    "Diagnosis and differential diagnosis",
    "Appropriate investigations and interpretation",
    "Initial and definitive management",
    "Prescribing and therapeutics",
    "Recognition of emergency and complications",
    "Escalation and patient safety",
  ];

  const pdAssesses = [
    "Professionalism and integrity",
    "Communication and teamwork",
    "Confidentiality and consent",
    "Proactive stance and duty of candour",
    "Prioritisation and workload management",
    "Patient safety and accountability",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-[#072438] text-white pt-36 sm:pt-44 lg:pt-48 pb-20 lg:pb-24 overflow-hidden text-center">
        {/* Background radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            MSRA exam format<br />and content
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-wider mb-2">
            MSRA Exam Format and Content
          </p>
          <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Detailed Insights into the Structure and Topics Covered in the MSRA Examination
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">

          {/* Section 1: Overall structure */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight mb-2">
                Overall structure
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The MSRA is a clinical assessment primarily in two papers completed in the same sitting.
              </p>
            </div>

            {/* Side by side cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Clinical Problem Solving */}
              <div className="bg-[#EAF4FD]/70 border border-[#BEE0F8] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#072438] mb-3">
                    Clinical Problem Solving
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    The Clinical Problem Solving paper assesses the ability to apply clinical knowledge to make clinical decisions expected of doctors in Foundation-level practice.
                  </p>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <p>
                    <strong className="font-bold text-[#072438]">Number of questions:</strong> 97 questions, including a small number of pilot items (unscored).
                  </p>
                  <p>
                    <strong className="font-bold text-[#072438]">Question formats:</strong> Single Best Answer (SBA) · Extended Matching Questions (EMQ)
                  </p>
                </div>
              </div>

              {/* Card 2: Professional Dilemmas */}
              <div className="bg-[#E6F7F0]/70 border border-[#A8E6CF] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#072438] mb-3">
                    Professional Dilemmas
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    The PD paper assesses judgement in realistic professional work scenarios. Official MSRA guidance states it contains 50 questions across 95 minutes, designed to test decision-making under pressure.
                  </p>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <p>
                    <strong className="font-bold text-[#072438]">Question styles:</strong> Ranking questions · Multiple choice / Action selection styles
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm italic text-slate-500">
              There is a scheduled break between the two papers. The exam is delivered on a computer-based assessment system at a Pearson VUE test center or via remote proctoring where offered.
            </p>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 2: CPS clinical categories */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight mb-2">
                CPS clinical categories
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                CPS questions are drawn from 12 clinical domains:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cpsCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D446B] text-white flex items-center gap-3 p-4 sm:p-5 rounded-2xl shadow-sm"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1D82EB] shrink-0" />
                  <span className="font-semibold text-sm sm:text-base leading-snug">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 3: What CPS Assesses & What PD Assesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* What CPS Assesses */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight mb-2">
                  What CPS Assesses
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  CPS questions commonly assess:
                </p>
              </div>

              <div className="space-y-2.5">
                {cpsAssesses.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-[#E2E8F0] bg-white p-3.5 px-4 rounded-xl flex items-center gap-3 text-slate-700 text-xs sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  >
                    <ChevronRight className="w-4 h-4 text-[#1D82EB] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What PD Assesses */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight mb-2">
                  What PD Assesses
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  PD questions assess professional behaviour in areas including:
                </p>
              </div>

              <div className="space-y-2.5">
                {pdAssesses.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-[#E2E8F0] bg-white p-3.5 px-4 rounded-xl flex items-center gap-3 text-slate-700 text-xs sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  >
                    <ChevronRight className="w-4 h-4 text-[#1D82EB] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 4: PD question styles you will see */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
              PD question styles you will see
            </h2>

            <div className="space-y-3">
              <div className="border border-[#E2E8F0] bg-white p-4 px-5 rounded-xl text-slate-700 text-xs sm:text-sm">
                <strong className="font-bold text-[#072438] mr-2">Ranking questions:</strong>
                <span>Put responses in order of appropriateness</span>
              </div>
              <div className="border border-[#E2E8F0] bg-white p-4 px-5 rounded-xl text-slate-700 text-xs sm:text-sm">
                <strong className="font-bold text-[#072438] mr-2">Multiple choice / Action selection styles:</strong>
                <span>Select the most appropriate actions within the scenario format</span>
              </div>
            </div>
          </div>

          {/* Section 5: Why candidates often find PD harder than expected */}
          <div className="mt-10 sm:mt-12 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
              Why candidates often find PD harder than expected
            </h2>

            <div className="bg-[#EAF4FD]/90 border border-[#BEE0F8] rounded-2xl p-5 sm:p-6 text-slate-700 text-xs sm:text-base leading-relaxed">
              PD is not about memorising rules. It is about applying professional principles consistently under pressure, especially around prioritisation, communication, raising concerns, confidentiality, and patient safety; exactly the skills being tested in the scenarios.
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 sm:mt-16">
            <Link
              href="/exam-guide/overview-1"
              className="w-full sm:w-auto text-center border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition-all"
            >
              &lt; Format &amp; Content
            </Link>

            <Link
              href="/exam-guide/overview-3"
              className="w-full sm:w-auto text-center bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
            >
              MSRA for GP training, exam day and outcomes &gt;
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
