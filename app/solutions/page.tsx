import type { Metadata } from 'next';

import AchievementsListSection from '@/components/sections/AchievementsListSection';
import BuildCtaSection from '@/components/sections/BuildCtaSection';
import ProcessSection from '@/components/sections/ProcessSection';
import SolutionsHeroSection from '@/components/sections/SolutionsHeroSection';
import WindSolarSolutionsSection from '@/components/sections/WindSolarSolutionsSection';

export const metadata: Metadata = {
  title: 'Renewable Energy Solutions',
  description:
    'Explore our wind and solar EPC services, including foundations, electrical works, land development, logistics, and project execution.',
};

export default function SolutionsPage() {
  return (
    <>
      <SolutionsHeroSection />
      <WindSolarSolutionsSection />
      <AchievementsListSection />
      <ProcessSection />
      <BuildCtaSection />
    </>
  );
}

