import type { Metadata } from 'next';

import BuildCtaSection from '@/components/sections/BuildCtaSection';
import ProjectsGridSection from '@/components/sections/ProjectsGridSection';
import ProjectsHeroSection from '@/components/sections/ProjectsHeroSection';

export const metadata: Metadata = {
  title: 'Completed Renewable Projects',
  description:
    'View our successfully delivered wind and solar projects with strong engineering, reliable construction, and multi-state execution.',
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHeroSection />
      <ProjectsGridSection />
      <BuildCtaSection />
    </>
  );
}
