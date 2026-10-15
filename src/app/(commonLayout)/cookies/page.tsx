import LegalHero from "@/components/legalLayouts/LegalHero";
import LegalContentSection, {
  LegalSectionItem,
} from "@/components/legalLayouts/LegalContentSection";

export const metadata = {
  title: "Cookie Policy | MedicalExamPro",
  description:
    "Cookie Policy for MedicalExamPro - Details on how we use essential cookies, preferences, and security tokens to provide our MSRA revision platform.",
};

const cookieSections: LegalSectionItem[] = [
  {
    id: 1,
    title: "Introduction",
    content:
      "This Cookie Policy explains how MedicalExamPro (\"we\", \"us\", or \"our\") uses cookies and similar tracking technologies when you access our online medical education platform. By continuing to use our website, you agree to the use of cookies as outlined in this policy.",
  },
  {
    id: 2,
    title: "What Are Cookies?",
    content:
      "Cookies are small text files placed on your computer or mobile device when you visit websites. They are widely used to make websites work efficiently, provide secure authentication, remember preferences, and offer customized revision experiences.",
  },
  {
    id: 3,
    title: "Essential Cookies We Use",
    content:
      "Essential cookies are strictly necessary for the operation of MedicalExamPro. These include authentication tokens, session identifiers, and CSRF protection tokens that verify your login state and keep your revision progress secure across study sessions.",
  },
  {
    id: 4,
    title: "Functional & Preference Cookies",
    content:
      "Functional cookies enable our platform to remember your selected preferences, such as practice exam mode, question timer settings, and dashboard layouts. These cookies enhance your studying efficiency without tracking you across external websites.",
  },
  {
    id: 5,
    title: "Performance & Analytics Cookies",
    content:
      "We may use anonymized analytics cookies to understand how candidates navigate our platform, identify broken links or sluggish question loading times, and measure feature usage to continuously improve our MSRA question bank.",
  },
  {
    id: 6,
    title: "Third-Party Services",
    content:
      "When you make a payment on our platform, our payment processor (such as Stripe) may place security and fraud-prevention cookies necessary to securely process transactions in accordance with PCI-DSS standards.",
  },
  {
    id: 7,
    title: "Managing Your Cookie Preferences",
    content:
      "Most web browsers allow you to control or block cookies through browser settings. Please note that disabling essential cookies will prevent you from logging into your account, tracking your practice sessions, or completing mock exams.",
  },
  {
    id: 8,
    title: "Contact Us Regarding Cookies",
    content:
      "If you have questions or concerns about our use of cookies or personal data, please contact our Data Protection team at support@medicalexampro.co.uk or write to Suite 7, Savant House, 63–65 Camden High Street, London, NW1 7JL.",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <LegalHero
        title="Cookie Policy"
        description="Learn how MedicalExamPro uses cookies and local browser storage to keep your account secure and track your MSRA practice performance."
        lastUpdated="January 2026"
      />
      <LegalContentSection sections={cookieSections} />
    </main>
  );
}
