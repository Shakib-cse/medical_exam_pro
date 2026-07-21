import AboutHero from "@/components/aboutLayouts/AboutHero";
import OurApproach from "@/components/aboutLayouts/OurApproach";
import OurStory from "@/components/aboutLayouts/OurStory";
import IndependenceSection from "@/components/aboutLayouts/IndependenceSection";
import AboutCTA from "@/components/aboutLayouts/AboutCTA";

export const metadata = {
  title: "About Us | MedicalExamPro",
  description:
    "Learn about MedicalExamPro - built for the realities of competitive UK medical training with exam-relevant resources for MSRA and specialty recruitment.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <AboutHero />
      <OurApproach />
      <OurStory />
      <IndependenceSection />
      <AboutCTA />
    </main>
  );
}
