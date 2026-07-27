import PrepareMsraHero from "@/components/prepareMsraLayouts/PrepareMsraHero";
import StructuredPreparationSection from "@/components/prepareMsraLayouts/StructuredPreparationSection";
import LearningThroughPractice from "@/components/prepareMsraLayouts/LearningThroughPractice";
import ClinicalKnowledgeSection from "@/components/prepareMsraLayouts/ClinicalKnowledgeSection";
import ProfessionalJudgementSection from "@/components/prepareMsraLayouts/ProfessionalJudgementSection";
import ConsistencySection from "@/components/prepareMsraLayouts/ConsistencySection";
import PrepareCTA from "@/components/prepareMsraLayouts/PrepareCTA";

export const metadata = {
  title: "How to Prepare for the MSRA | MedicalExamPro",
  description:
    "Learn effectively, practice efficiently, and master the Multi-Specialty Recruitment Assessment. Access high-yield clinical system questions and professional dilemma (SJT) cases designed to match the real exam.",
};

export default function PrepareMsraPage() {
  return (
    <main className="min-h-screen bg-background">
      <PrepareMsraHero />
      <StructuredPreparationSection />
      <LearningThroughPractice />
      <ClinicalKnowledgeSection />
      <ProfessionalJudgementSection />
      <ConsistencySection />
      <PrepareCTA />
    </main>
  );
}
