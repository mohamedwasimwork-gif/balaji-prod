import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BuildCtaSection from '@/components/sections/BuildCtaSection';
import ProjectDetailHero from '@/components/sections/ProjectDetailHero';
import RelatedProjectsSection from '@/components/sections/RelatedProjectsSection';
import { getProjectBySlug, PROJECTS } from '@/lib/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.overview,
    openGraph: {
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <ProjectDetailHero project={project} />
      <RelatedProjectsSection excludeSlug={slug} limit={3} />
      <BuildCtaSection />
    </>
  );
}
