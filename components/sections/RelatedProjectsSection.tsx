'use client';

import Image from 'next/image';
import Link from 'next/link';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import { PROJECTS } from '@/lib/projects';

interface RelatedProjectsSectionProps {
  excludeSlug?: string;
  limit?: number;
}

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

function ProjectCard({ slug, title, category, date, image }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group block">
      <div className="relative w-full aspect-[1.5] overflow-hidden rounded-md">
        <FadeInScale className="absolute inset-0">
          <Image
            src={image}
            alt={`${title} project`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw"
          />
        </FadeInScale>
      </div>
      <div className="pt-7 mobile:pt-5">
        <div className="flex flex-col gap-3">
          <h3 className="font-karma font-medium text-text text-[20px] leading-[1.4em]">{title}</h3>
          <div className="flex items-center gap-2 font-inter text-text text-[14px]">
            <span>{category}</span>
            <span className="opacity-60">|</span>
            <span className="opacity-80">{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function RelatedProjectsSection({
  excludeSlug,
  limit = 3,
}: RelatedProjectsSectionProps) {
  const cards = PROJECTS.filter((p) => p.slug !== excludeSlug).slice(0, limit);

  return (
    <section
      id="related-projects"
      className="w-full py-12 desktop:py-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-[60px] tablet:gap-[60px] mobile:gap-10">
          {/* Header row */}
          <div className="flex flex-col gap-6 desktop:flex-row desktop:items-end desktop:justify-between">
            <BlurInWords
              text="Recent Projects"
              as="h2"
              className="type-h2 text-text"
              stagger={0.05}
            />
            <ScrollFadeUp delay={0.2} className="hidden desktop:block">
              <Button variant="secondary" href="/projects">
                View All
              </Button>
            </ScrollFadeUp>
          </div>

          {/* 3-column grid (2-col tablet, 1-col mobile) */}
          <div className="grid gap-[100px_24px] desktop:grid-cols-3 tablet:grid-cols-2 mobile:grid-cols-1 mobile:gap-[50px_30px]">
            {cards.map((p, i) => (
              <ScrollFadeUp key={p.slug} delay={i * 0.1} distance={40}>
                <ProjectCard
                  slug={p.slug}
                  title={p.title}
                  category={p.category}
                  date={p.date}
                  image={p.image}
                />
              </ScrollFadeUp>
            ))}
          </div>

          {/* Mobile: View All button below the grid */}
          <ScrollFadeUp delay={0.1} className="desktop:hidden">
            <div className="flex justify-center">
              <Button variant="secondary" href="/projects" className="w-full">
                View All
              </Button>
            </div>
          </ScrollFadeUp>
        </div>
      </div>
    </section>
  );
}
