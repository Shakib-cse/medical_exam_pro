import Banner from "@/components/commonLayouts/Banner";
import WhyItWorks from "@/components/commonLayouts/WhyItWorks";
import UnderstandingExam from "@/components/commonLayouts/UnderstandingExam";
import StructuredPreparation from "@/components/commonLayouts/StructuredPreparation";
import Testimonials from "@/components/commonLayouts/Testimonials";
import PricingAndMobileApp from "@/components/commonLayouts/PricingAndMobileApp";

export default function Home() {
  return (
    <main>
      <Banner />
      <WhyItWorks />
      <UnderstandingExam />
      <StructuredPreparation />
      <Testimonials />
      <PricingAndMobileApp />
    </main>
  );
}

