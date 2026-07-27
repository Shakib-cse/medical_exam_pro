import Link from "next/link";
import { Check } from "lucide-react";

export const metadata = {
  title: "MSRA for GP Training, Exam Day & Outcomes | MedicalExamPro",
  description:
    "A comprehensive overview of the MSRA exam for GP specialty training, test day checklist, scoring, results, appeals, and key takeaways.",
};

export default function MSRAOverviewPage3() {
  const checklistItems = [
    "Confirm your exam date, time, and delivery method (test centre or remote)",
    "Bring valid photo ID that exactly matches your booking details",
    "Arrive early or check in early if sitting remotely",
    "Familiarise yourself with the two-paper structure and the scheduled break",
    "Leave all unauthorised items (phones, watches, notes) outside the exam room",
    "Manage your time carefully during each paper",
    "Follow all invigilator or remote proctor instructions",
    "Report any technical or exam-day issues immediately",
  ];

  const keyPoints = [
    "The MSRA is a high-stakes national assessment",
    "It is used by multiple specialties in UK recruitment",
    "Both CPS and PD contribute to overall performance",
    "Understanding the timeline, format, and scope of the exam is essential",
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
            MSRA for GP training,<br />exam day and outcomes
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl mx-auto">
            A Comprehensive Overview of the MSRA Exam: What to Expect on Test Day and Beyond
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">

          {/* Section 1: MSRA and General Practice Specialty Training */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
              MSRA and General Practice Specialty Training
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              For applicants to General Practice Specialty Training, the MSRA has a particularly significant role.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The MSRA is mandatory for GP applicants and is used to rank candidates nationally. Training offers are made in rank order, taking candidate preferences into account.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Because GP recruitment is highly competitive and nationally coordinated, MSRA performance directly affects whether an applicant receives an offer and how likely they are to secure a preferred training location.
            </p>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 2: Exam day checklist */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight mb-2">
                Exam day checklist
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                For applicants to General Practice Specialty Training, the MSRA has a particularly significant role.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2">
                The MSRA is mandatory for GP applicants and is used to rank candidates nationally. Training offers are made in rank order, taking candidate preferences into account.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mt-2">
                Because GP recruitment is highly competitive and nationally coordinated, MSRA performance directly affects whether an applicant receives an offer and how likely they are to secure a preferred training location.
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-3 pt-2">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-[#E2E8F0] bg-white p-3.5 px-4 rounded-xl flex items-center gap-3.5 text-slate-700 text-xs sm:text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 3: Results and scoring & Appeals and reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Results and scoring */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
                Results and scoring
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                MSRA scores are standardised across the candidate cohort. Candidates must meet a minimum acceptable standard in both papers to progress.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Scores are used according to specialty-specific recruitment rules and are released through the national recruitment system in line with the published timeline.
              </p>
            </div>

            {/* Appeals and reviews */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
                Appeals and reviews
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Appeals and review processes follow nationally published guidance. Candidates should consult official recruitment documentation for details on eligibility, deadlines, and procedures.
              </p>
            </div>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 4: Key points to remember */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
              Key points to remember
            </h2>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/80 border-l-[4px] border-l-[#1D82EB] p-5 sm:p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center min-h-[120px]"
                >
                  <p className="font-semibold text-slate-800 text-sm sm:text-base leading-snug">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 sm:mt-16">
            <Link
              href="/exam-guide/overview-2"
              className="w-full sm:w-auto text-center border border-slate-300 text-slate-600 hover:bg-slate-50 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition-all"
            >
              &lt; MSRA exam format and content
            </Link>

            <Link
              href="/exam-guide/overview-4"
              className="w-full sm:w-auto text-center bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-lg shadow-brand-orange/20 hover:scale-[1.02] active:scale-95"
            >
              MSRA myths and misconceptions that cost marks &gt;
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
