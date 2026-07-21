import LegalHero from "@/components/legalLayouts/LegalHero";
import LegalContentSection, {
  LegalSectionItem,
} from "@/components/legalLayouts/LegalContentSection";

export const metadata = {
  title: "Terms and Conditions | MedicalExamPro",
  description:
    "Terms and Conditions outlining rights, responsibilities, and rules for using the MedicalExamPro platform.",
};

const termsSections: LegalSectionItem[] = [
  {
    id: 1,
    title: "Introduction",
    content:
      "These Terms and Conditions govern all access to and use of MedicalExamPro, an online medical education platform. By accessing, registering, subscribing, or using any part of the Platform, you agree to be legally bound by these Terms in full. These Terms apply to all users, including visitors, registered users, subscribers, and any individual accessing content via any device.",
  },
  {
    id: 2,
    title: "Company Details",
    content:
      "MedicalExamPro is owned and operated by Medical Excellence Group Limited, a company registered in England and Wales, with its registered office at Suite 7, Savant House, 63–65 Camden High Street, London, United Kingdom, NW1 7JL.",
  },
  {
    id: 3,
    title: "Educational Purpose",
    content:
      "The Platform provides subscription-based access to digital educational content for examination preparation only. Nothing on the Platform constitutes medical advice or clinical guidance.",
  },
  {
    id: 4,
    title: "No Guarantee of Outcomes",
    content:
      "MedicalExamPro makes no guarantees regarding examination results, rankings, interviews, or career outcomes.",
  },
  {
    id: 5,
    title: "Accounts and Security",
    content:
      "Users are responsible for safeguarding login credentials and all activity under their account. Account sharing is strictly prohibited.",
  },
  {
    id: 6,
    title: "Subscriptions",
    content:
      "Subscriptions provide immediate, time-limited access to paid content upon payment. Subscriptions expire automatically at the end of the stated period.",
  },
  {
    id: 7,
    title: "Payments and Refunds",
    content:
      "All payments are made in advance. No refunds are provided once access to digital content has been granted, except where required by law.",
  },
  {
    id: 8,
    title: "Acceptable Use",
    content:
      "Users must not copy, reproduce, redistribute, scrape, or commercially exploit any content on the Platform.",
  },
  {
    id: 9,
    title: "Intellectual Property",
    content:
      "All content is protected by intellectual property laws. Unauthorised use may result in legal action.",
  },
  {
    id: 10,
    title: "Governing Law",
    content: "These Terms are governed by the laws of England and Wales.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <LegalHero
        title="Terms and Conditions"
        description="These Terms and Conditions outline your rights, responsibilities, and the rules that apply when using the MedicalExamPro platform."
        lastUpdated="January 2026"
      />
      <LegalContentSection sections={termsSections} />
    </main>
  );
}
