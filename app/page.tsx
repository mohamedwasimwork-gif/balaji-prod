import AboutSection from '@/components/sections/AboutSection';
import BenefitSection from '@/components/sections/BenefitSection';
import BuildCtaSection from '@/components/sections/BuildCtaSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import FactSection from '@/components/sections/FactSection';
import FaqSection from '@/components/sections/FaqSection';
import HeroSection from '@/components/sections/HeroSection';
import IntroductionSection from '@/components/sections/IntroductionSection';
import ResourcesSection from '@/components/sections/ResourcesSection';
import WhoSection from '@/components/sections/WhoSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhoSection />
      <IntroductionSection />
      <ResourcesSection limit={6} showViewAll />
      <BenefitSection />
      <FactSection />
      <AboutSection />
      <FaqSection />
      <CertificationsSection />
      <BuildCtaSection />
    </>
  );
}
