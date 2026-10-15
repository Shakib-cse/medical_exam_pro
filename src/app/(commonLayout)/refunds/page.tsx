import LegalHero from "@/components/legalLayouts/LegalHero";
import LegalContentSection, {
  LegalSectionItem,
} from "@/components/legalLayouts/LegalContentSection";

export const metadata = {
  title: "Refund Policy | MedicalExamPro",
  description:
    "Refund and Cancellation Policy for MedicalExamPro - Information regarding subscriptions, cooling-off periods, and digital content access under UK law.",
};

const refundSections: LegalSectionItem[] = [
  {
    id: 1,
    title: "Overview",
    content:
      "This Refund Policy governs subscriptions and purchases made on MedicalExamPro, operated by Medical Excellence Group Limited. We are committed to providing transparent, fair pricing with straightforward one-off payments and no recurring auto-renewal surprises.",
  },
  {
    id: 2,
    title: "Nature of Digital Educational Content",
    content:
      "MedicalExamPro provides immediate access to digital revision materials, question banks, simulated mock exams, and proprietary answer rationales upon successful payment. All subscription fees are paid in advance for the selected access period.",
  },
  {
    id: 3,
    title: "Statutory Right of Cancellation (Cooling-off Period)",
    content:
      "Under the UK Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have the right to cancel your digital subscription within 14 days of purchase without giving any reason, provided you have not yet accessed, viewed, or attempted any digital question bank content or mock exams.",
  },
  {
    id: 4,
    title: "Loss of Right to Cancel Upon Digital Access",
    content:
      "By purchasing a subscription and accessing, viewing questions, or starting practice sessions on the platform, you expressly request and consent to immediate delivery of digital content and acknowledge that your statutory right of cancellation is thereby waived in accordance with UK consumer law.",
  },
  {
    id: 5,
    title: "Exceptional Circumstances & Technical Faults",
    content:
      "If you experience verified technical faults or platform downtime that persistently prevents you from accessing your paid subscription, and our technical support team is unable to resolve the issue within a reasonable period, we will offer a pro-rata extension or refund at our discretion.",
  },
  {
    id: 6,
    title: "No Recurring Billing",
    content:
      "All MedicalExamPro plans are one-off purchases for fixed durations (such as 1 month, 3 months, or 6 months). Your card will never be automatically billed or auto-renewed at the end of the term.",
  },
  {
    id: 7,
    title: "Requesting Assistance or Inquiries",
    content:
      "To request assistance regarding a payment, subscription issue, or cancellation, please email our billing team at support@medicalexampro.co.uk with your registered email address and transaction reference.",
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <LegalHero
        title="Refund Policy"
        description="Clear information on our cancellation terms, digital educational content access, and billing policies under UK Consumer Regulations."
        lastUpdated="January 2026"
      />
      <LegalContentSection sections={refundSections} />
    </main>
  );
}
