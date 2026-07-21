import LegalHero from "@/components/legalLayouts/LegalHero";
import LegalContentSection, {
  LegalSectionItem,
} from "@/components/legalLayouts/LegalContentSection";

export const metadata = {
  title: "Privacy Policy | MedicalExamPro",
  description:
    "Privacy Policy for MedicalExamPro - Learn how we collect, protect, and handle your personal data.",
};

const privacySections: LegalSectionItem[] = [
  {
    id: 1,
    title: "Introduction",
    content:
      "This Privacy Policy explains how MedicalExamPro (\"we\", \"us\", or \"our\") collects, uses, stores, and protects your personal data when you visit or use our website, mobile application, and online medical education services. We are committed to safeguarding your privacy and protecting your personal data in accordance with UK Data Protection laws and the UK GDPR.",
  },
  {
    id: 2,
    title: "Company Details",
    content:
      "MedicalExamPro is owned and operated by Medical Excellence Group Limited, a company registered in England and Wales, with its registered office at Suite 7, Savant House, 63–65 Camden High Street, London, United Kingdom, NW1 7JL.",
  },
  {
    id: 3,
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us when creating an account, subscribing, or contacting support. This includes your name, email address, password, billing details, and communication preferences. We also collect automated performance data, including question responses, exam scores, study timing, and device/IP information.",
  },
  {
    id: 4,
    title: "How We Use Your Information",
    content:
      "We use your personal data to provide and maintain our services, process payments, deliver question bank functionality, generate personal study analytics, send administrative updates, and ensure platform security.",
  },
  {
    id: 5,
    title: "Legal Basis for Processing",
    content:
      "We process your personal data based on contractual necessity (to fulfill your subscription agreement), compliance with legal obligations, and our legitimate interests in operating and improving our platform.",
  },
  {
    id: 6,
    title: "Data Storage and Security",
    content:
      "All data is stored on secure, encrypted servers located in compliance with UK data protection regulations. We implement strict technical and organisational measures, including SSL encryption and restricted access protocols, to protect against unauthorised access or data breaches.",
  },
  {
    id: 7,
    title: "Third-Party Service Providers",
    content:
      "We do not sell or rent your personal data to third parties. We share data only with trusted third-party service providers (such as PCI-compliant payment processors and secure cloud hosts) who assist us in operating our platform under strict confidentiality agreements.",
  },
  {
    id: 8,
    title: "Your Data Protection Rights",
    content:
      "Under UK GDPR, you have the right to access your personal data, request correction of inaccurate data, request erasure of your data, object to or restrict processing, and request data portability. To exercise these rights, please contact our support team.",
  },
  {
    id: 9,
    title: "Cookies and Tracking",
    content:
      "We use essential cookies to maintain user sessions and secure account access. For detailed information regarding our use of cookies, please refer to our Cookie Policy.",
  },
  {
    id: 10,
    title: "Updates to This Policy",
    content:
      "We may update this Privacy Policy periodically to reflect changes in our practices or legal obligations. Any material changes will be communicated via our website or email.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <LegalHero
        title="Privacy Policy"
        description="This Privacy Policy outlines how MedicalExamPro collects, uses, protects, and handles your personal information when using our platform."
        lastUpdated="January 2026"
      />
      <LegalContentSection sections={privacySections} />
    </main>
  );
}
