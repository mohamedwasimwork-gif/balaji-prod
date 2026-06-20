import type { Metadata } from 'next';

import AboutSection from '@/components/sections/AboutSection';
import BuildCtaSection from '@/components/sections/BuildCtaSection';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Balaji & Co, civil contractors since 2005 with expertise in Wind Turbine Generator (WTG) construction and solar power EPC solutions across India.',
};

export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <BuildCtaSection />
    </>
  );
}
