'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import FadeInScale from '@/components/motion/FadeInScale';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import { PROJECTS } from '@/lib/projects';

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  hero?: boolean;
}

function ProjectCard({ slug, title, category, date, image, hero }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={`group block ${hero ? 'desktop:col-span-3' : ''}`}
    >
      {/* Image */}
      <div
        className={`relative w-full overflow-hidden ${
          hero ? 'aspect-[16/9] desktop:aspect-auto desktop:h-[500px]' : 'aspect-[1.5]'
        }`}
      >
        <FadeInScale className="absolute inset-0">
          <Image
            src={image}
            alt={`${title} project site`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes={hero ? '100vw' : '(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw'}
          />
        </FadeInScale>
      </div>

      {/* Content block */}
      <div className={`relative ${hero ? 'pt-10' : 'pt-7'} mobile:pt-5`}>
        {/* Title + meta */}
        <div
          className={`flex flex-col gap-6 ${
            hero ? 'desktop:flex-row desktop:justify-between desktop:items-end' : ''
          }`}
        >
          <h3
            className={`font-karma font-medium text-text ${
              hero
                ? 'text-[36px] desktop:text-[48px] leading-[1.1em] tracking-[-0.03em] desktop:max-w-[55%]'
                : 'text-[20px] leading-[1.4em]'
            }`}
          >
            {title}
          </h3>

          <div
            className={`flex items-center gap-2 font-inter text-text text-[14px] ${
              hero ? 'desktop:flex-col desktop:items-start desktop:gap-2 desktop:flex-shrink-0' : ''
            }`}
          >
            <span>{category}</span>
            <span className={hero ? 'desktop:hidden' : ''}>|</span>
            <span className="opacity-80">{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const INITIAL_VISIBLE = 4;
const STEP = 3;

export default function ProjectsGridSection() {
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const shown = PROJECTS.slice(0, visible);
  const hasMore = visible < PROJECTS.length;

  return (
    <section
      id="projects-grid"
      className="w-full py-12 desktop:py-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        {/* Grid — 3 cols desktop, 2 cols tablet, 1 col mobile, with hero card spanning */}
        <div className="grid gap-y-[100px] gap-x-6 tablet:gap-y-20 tablet:gap-x-5 mobile:gap-y-12 mobile:gap-x-0 desktop:grid-cols-3 tablet:grid-cols-2 grid-cols-1 pb-[120px] tablet:pb-[100px] mobile:pb-[100px]">
          {shown.map((p, i) => (
            <ProjectCard
              key={p.slug}
              slug={p.slug}
              title={p.title}
              category={p.category}
              date={p.date}
              image={p.image}
              hero={i === 0}
            />
          ))}
        </div>

        {/* Load More button */}
        {hasMore && (
          <ScrollFadeUp delay={0.1}>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => Math.min(v + STEP, PROJECTS.length))}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-md text-white font-inter font-medium text-[14px] hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#606c38' }}
              >
                Load More
              </button>
            </div>
          </ScrollFadeUp>
        )}
      </div>
    </section>
  );
}
