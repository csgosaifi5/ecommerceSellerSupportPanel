import ChooseUsSection from "@/components/shared/choose-us-section";
import HeroSection from "@/components/shared/hero-section";
import InfoSection from "@/components/shared/info-section";
import StatsSection from "@/components/shared/stats-section";
import StepsSection from "@/components/shared/steps-section";
import Testimonials from "@/components/shared/testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <InfoSection />
      <StepsSection />
      <StatsSection size="lg" />
      <ChooseUsSection />
      <Testimonials />
    </>
  );
}
