import FaqHero from "@/components/faqLayouts/FaqHero";
import FaqAccordionSection from "@/components/faqLayouts/FaqAccordionSection";

export const metadata = {
  title: "FAQs | MedicalExamPro",
  description:
    "Frequently Asked Questions about MedicalExamPro, MSRA preparation, subscriptions, and platform features.",
};

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <FaqHero />
      <FaqAccordionSection />
    </main>
  );
}
