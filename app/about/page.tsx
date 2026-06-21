import type { Metadata } from 'next';

import AboutHeroSection from '@/components/sections/AboutHeroSection';
import AboutSection from '@/components/sections/AboutSection';
import BuildCtaSection from '@/components/sections/BuildCtaSection';
import CompaniesSection from '@/components/sections/CompaniesSection';
import DirectorsSection from '@/components/sections/DirectorsSection';
import FounderStatsSection from '@/components/sections/FounderStatsSection';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Balaji & Co, civil contractors since 2005 with expertise in Wind Turbine Generator (WTG) construction and solar power EPC solutions across India.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <AboutSection />
      <CompaniesSection />
      <FounderStatsSection />
      <DirectorsSection />
      <BuildCtaSection />
    </>
  );
}
