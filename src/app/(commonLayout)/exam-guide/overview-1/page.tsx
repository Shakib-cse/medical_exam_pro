import Link from "next/link";

export const metadata = {
  title: "MSRA Exam Overview | MedicalExamPro",
  description:
    "A comprehensive guide to the Multi-Specialty Recruitment Assessment (MSRA) exam process, timeline, and the medical specialties that require it.",
};

export default function MSRAOverviewPage1() {
  const timelineSteps = [
    {
      date: "October to November",
      text: "Applications open and close via the national recruitment system (Oriel)",
    },
    {
      date: "December",
      text: "Longlisting takes place and eligible candidates are invited to book the MSRA",
    },
    {
      date: "January to February",
      text: "MSRA testing windows open and candidates sit both papers",
    },
    {
      date: "February to March",
      text: "Scores are processed and released",
    },
    {
      date: "March to April",
      text: "Rankings and training offers are issued, depending on specialty",
    },
  ];

  const specialties = [
    "General Practice",
    "Anaesthetics",
    "Acute Care Common Stem - Anaesthetics (ACCS Anaesthetics)",
    "Core Psychiatry Training",
    "Obstetrics and Gynaecology",
    "Ophthalmology",
    "Radiology",
    "Clinical Radiology",
    "Nuclear Medicine",
    "Public Health (in specific recruitment contexts)",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-[#072438] text-white pt-36 sm:pt-44 lg:pt-48 pb-20 lg:pb-24 overflow-hidden text-center">
        {/* Background radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
            MSRA exam<br />overview
          </h1>
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg font-medium max-w-xl mx-auto">
            A Comprehensive Guide to the MSRA Exam Process
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">

          {/* Section 1: What is the MSRA */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
              What is the MSRA
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The Multi-Specialty Recruitment Assessment (MSRA) is a national, computer-based assessment used in UK postgraduate medical recruitment. It is designed to assess applied clinical knowledge and professional dilemma judgment expected of doctors entering specialty training.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The MSRA is centrally delivered as part of various recruitment processes and is used by multiple specialties to support standard and selection of applicants.
            </p>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 2: Why the MSRA matters */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight">
              Why the MSRA matters
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              The MSRA is one of the most important assessments in UK specialty recruitment.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              It provides a consistent national benchmark that allows comparison between candidates from different medical schools, training backgrounds, and career pathways. In competitive recruitment cycles, MSRA performance often determines whether a candidate progresses, how they are ranked, and where they ultimately work.
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              For some specialties, particularly General Practice, MSRA performance plays a decisive role in allocation of training posts.
            </p>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 3: MSRA recruitment timeline */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight mb-2">
                MSRA recruitment timeline
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Although exact dates vary slightly each year and by specialty, the overall recruitment cycle follows a predictable pattern.
              </p>
            </div>

            {/* Timeline container */}
            <div className="relative border border-[#E2E8F0] bg-white rounded-2xl p-4 sm:p-8 lg:p-10">
              <div className="space-y-6">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="flex flex-row items-center gap-2 sm:gap-6 relative">
                    {/* Left Date (Left-aligned blue text) */}
                    <div className="w-[105px] sm:w-[180px] lg:w-[200px] shrink-0 text-[#1D82EB] font-bold text-xs sm:text-base leading-snug">
                      {step.date}
                    </div>

                    {/* Timeline Dot & Line Segment */}
                    <div className="w-8 sm:w-12 shrink-0 flex items-center justify-center relative self-stretch">
                      {/* Vertical line segments */}
                      {idx > 0 && (
                        <div className="absolute top-0 bottom-1/2 left-1/2 -translate-x-1/2 w-[2px] bg-[#E2E8F0]" />
                      )}
                      {idx < timelineSteps.length - 1 && (
                        <div className="absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[#E2E8F0]" />
                      )}

                      {/* Concentric Circle Dot */}
                      <div className="w-6 h-6 rounded-full bg-[#E8EDF2] border border-[#CBD5E1]/40 flex items-center justify-center z-10 shrink-0">
                        <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1D82EB]" />
                        </div>
                      </div>
                    </div>

                    {/* Right Description */}
                    <div className="flex-1 text-slate-600 text-xs sm:text-base py-2.5 leading-relaxed">
                      {step.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm italic text-slate-500">
              Candidates should always check official recruitment guidance for exact dates relevant to their specialty.
            </p>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Section 4: Specialties that use the MSRA */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072438] tracking-tight mb-2">
                Specialties that use the MSRA
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The MSRA is used in recruitment for the following UK specialty training programmes. The way it is used (shortlisting, ranking, or selection) may vary by specialty and recruitment round.
              </p>
            </div>

            {/* Specialties grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {specialties.map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D446B] text-white flex items-center gap-3 p-4 sm:p-5 rounded-2xl shadow-sm"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1D82EB] shrink-0" />
                  <span className="font-semibold text-sm sm:text-base leading-snug">{spec}</span>
                </div>
              ))}
            </div>

            <p className="text-xs sm:text-sm text-slate-500">
              Applicants should refer to specialty-specific recruitment guidance to understand how the MSRA is applied in their chosen programme.
            </p>
          </div>

          {/* Bottom Right CTA */}
          <div className="flex justify-end mt-12 sm:mt-16">
            <Link
              href="/exam-guide/overview-2"
              className="bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold px-6 py-3 rounded-full text-sm sm:text-base transition-all shadow-lg shadow-brand-orange/20 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
            >
              Format & Content
              <span className="font-bold">&gt;</span>
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
