import Link from "next/link";

export const metadata = {
  title: "MSRA Myths and Misconceptions That Cost Marks | MedicalExamPro",
  description:
    "Common misconceptions, pitfalls, and poor strategies that lead to lost marks on the MSRA exam, and how to avoid them.",
};

export default function MSRAOverviewPage4() {
  const myths = [
    "A common myth is that extensive guideline reading is the most efficient preparation strategy. While familiarity with guidelines provides context, MSRA questions rarely reward verbatim recall. Instead, they test whether candidates can apply guidance in realistic and ambiguous scenarios under time pressure. Candidates who prioritize high-volume question practice and in-depth error analysis far outperform those who rely on passive reading.",
    "Another widespread misconception is that Professional Dilemmas questions are subjective or based on personal opinion. In reality, PD questions follow a consistent internal logic centered on patient safety, respect, team communication, and accountability. Candidates who rely on instinct rather than structured reasoning frequently miss nuanced options that appear subtle but are actually decisive.",
    "Many candidates believe that an average score is sufficient to secure a training post. This belief fails to account for rising competition ratios. As applicant numbers increase, relative ranking becomes decisive. Scores that may have been competitive in previous years can fall short of shortlisting or interview thresholds in current cycles.",
    "There is a common belief that strong clinical experience compensates for limited exam preparation. In practice, experienced clinicians often overthink simple questions, introduce unnecessary complexity, or assume management steps that are appropriate in real clinical care but not in the exam format. Success requires mastering the specific format and logic of the MSRA rather than comprehensive management plans.",
    "A particularly damaging myth is that CPS performance matters far more than PD in overall recruitment outcomes. Both papers contribute equally to ranking. Candidates who neglect PD preparation frequently lose marks through avoidable ranking errors, even when CPS performance is strong.",
    "Some candidates assume that all MSRA-style question banks are interchangeable. Differences in question volume, alignment with exam style, and explanation quality significantly influence preparation effectiveness. Limited exposure to realistic question formats increases the risk of exam-day surprises.",
    "Another misconception is that preparation can be compressed into a short, intensive period. While short-term study may increase familiarity, it rarely allows sufficient time to build stability across core domains. Candidates who prepare over a longer period show far greater resilience and consistency in test performance.",
    "A common belief is that recording incorrect answers indicates poor potential. In reality, early mistakes often highlight areas of weakness far clearer than prior knowledge. Candidates who actively analyse errors and adjust reasoning typically show the greatest overall improvement.",
    "Candidates sometimes believe that PD answers must always emphasize immediate escalation. Over-escalation is often penalized when issues can be resolved locally and proportionally. Understanding when not to escalate is as important as recognizing when escalation is mandatory.",
    "Another frequent error is assuming that documentation alone resolves professional concerns. In PD scenarios, documentation usually supports action rather than replacing it. Failure to act when action is required commonly results in lower rankings.",
    "There is a common misconception that MSRA preparation is identical regardless of specialty. Although the exam is shared, the strategic value of scores differs between GP and specialty recruitment. Candidates who tailored their target scores according to their chosen specialty perform more effectively.",
    "Some candidates believe that failing a mock test predicts future failure. Mock test performance is simply a diagnostic tool to focus revise strategies. Many candidates achieved substantial improvements when they shifted to targeted, question-led focused preparation.",
    "Finally, there is a misconception that success depends primarily on natural aptitude or luck. In practice, MSRA performance correlates most strongly with familiarity with question style, disciplined review of errors, and realistic benchmarking against the applicant pool.",
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
            MSRA myths and<br />misconceptions that<br />cost marks
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm lg:text-base font-semibold uppercase tracking-wider mb-2">
            Common Misconceptions, Pitfalls, and Poor Strategies That Lead to Lost Marks on the MSRA
          </p>
          <p className="text-slate-300 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Detailed Insights into How to Avoid Unnecessary Mistakes Across the CPS and PD Papers
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="w-full py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4">

          {/* 13 Stacked Myth Cards */}
          <div className="space-y-4 container mx-auto px-4">
            {myths.map((text, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/70 border-l-[5px] border-l-[#1D82EB] p-6 sm:p-7 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] text-slate-800 text-sm sm:text-base leading-relaxed font-normal"
              >
                {text}
              </div>
            ))}

            <p className="text-sm sm:text-base italic text-slate-700 font-medium text-center pt-4 max-w-3xl mx-auto">
              By recognizing and correcting these common misconceptions, candidates can replace counterproductive study habits with structured, high-yield preparation that protects marks and maximizes exam-day performance.
            </p>
          </div>

          <hr className="border-slate-200 my-10 sm:my-12" />

          {/* Key points to remember */}
          <div className="space-y-6 mx-auto container px-4">
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
                  <p className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex justify-start mx-auto mt-12 sm:mt-16 container px-4">
            <Link
              href="/exam-guide/overview-3"
              className="text-center border border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm transition-all"
            >
              &lt; MSRA myths and misconceptions that cost marks
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
