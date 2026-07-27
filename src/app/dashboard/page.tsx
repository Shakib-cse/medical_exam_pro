import { HeroBanner } from "./_components/HeroBanner";
import { StatCards } from "./_components/StatCards";
import { ClinicalProblemSolving } from "./_components/ClinicalProblemSolving";
import { SideGoalWidget } from "./_components/SideGoalWidget";
import { ProfessionalDilemmas } from "./_components/ProfessionalDilemmas";
import { MockExamsSection } from "./_components/MockExamsSection";

export const metadata = {
  title: "Dashboard | MedicalExamPro",
  description: "Medical exam preparation dashboard with question banks, mock exams, and analytics.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Performance Stats Cards */}
      <StatCards />

      {/* Main Section: Clinical Problem Solving (Left 8 cols) + Goal Widget (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ClinicalProblemSolving />
        </div>
        <div className="lg:col-span-4">
          <SideGoalWidget />
        </div>
      </div>

      {/* Professional Dilemmas */}
      <ProfessionalDilemmas />

      {/* Mock Exams Grid */}
      <MockExamsSection />
    </div>
  );
}
