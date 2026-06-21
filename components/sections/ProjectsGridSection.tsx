'use client';

import { AnimatePresence, motion } from 'framer-motion';
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
  status?: 'completed' | 'ongoing';
  hero?: boolean;
}

function ProjectCard({ slug, title, category, date, image, status, hero }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className={`group block ${hero ? 'desktop:col-span-3' : ''}`}
    >
      {/* Image */}
      <div
        className={`relative w-full overflow-hidden ${
          hero ? 'aspect-[16/9] desktop:aspect-auto desktop:h-[500px]' : 'aspect-[1.5]'
        } rounded-xl`}
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
            {status === 'ongoing' && (
              <span className="bg-[#606c38] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-inter mr-1">
                Ongoing
              </span>
            )}
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
  const [activeTab, setActiveTab] = useState<'completed' | 'ongoing'>('completed');
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const handleTabChange = (tab: 'completed' | 'ongoing') => {
    setActiveTab(tab);
    setVisible(INITIAL_VISIBLE);
  };

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeTab === 'completed') {
      return p.status !== 'ongoing';
    }
    return p.status === 'ongoing';
  });

  const shown = filteredProjects.slice(0, visible);
  const hasMore = visible < filteredProjects.length;

  return (
    <section
      id="projects-grid"
      className="w-full py-12 desktop:py-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        
        {/* Toggle controls */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-neutral-100 dark:bg-neutral-800/60 p-1 rounded-full border border-neutral-200/50 dark:border-neutral-700/20 max-w-fit shadow-sm">
            <button
              onClick={() => handleTabChange('completed')}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full relative transition-colors duration-300 font-inter focus-visible:ring-0 focus-visible:outline-none"
            >
              {activeTab === 'completed' && (
                <motion.span
                  layoutId="active-project-tab"
                  className="absolute inset-0 bg-[#606c38] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === 'completed' ? 'text-white' : 'text-[#606c38] hover:text-[#4e5830]'}`}>
                Completed Projects
              </span>
            </button>
            <button
              onClick={() => handleTabChange('ongoing')}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full relative transition-colors duration-300 font-inter focus-visible:ring-0 focus-visible:outline-none"
            >
              {activeTab === 'ongoing' && (
                <motion.span
                  layoutId="active-project-tab"
                  className="absolute inset-0 bg-[#606c38] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === 'ongoing' ? 'text-white' : 'text-[#606c38] hover:text-[#4e5830]'}`}>
                Ongoing Projects
              </span>
            </button>
          </div>
        </div>

        {/* Section Intro Wording for Ongoing Tab (Optional but provides excellent context) */}
        {activeTab === 'ongoing' && (
          <ScrollFadeUp>
            <div className="max-w-2xl mb-12 bg-neutral-50 p-6 rounded-2xl border border-neutral-200/30">
              <h4 className="type-h3 text-[#606c38] mb-3">Summary of Ongoing Projects</h4>
              <p className="font-inter text-text-muted text-[15px] leading-[1.6em]">
                Balaji & Co. is currently involved in ongoing wind energy projects across India, supporting the growth of the country’s renewable energy infrastructure. These projects reflect our active role in advancing large-scale wind power development across multiple states.
              </p>
            </div>
          </ScrollFadeUp>
        )}

        {/* Grid — 3 cols desktop, 2 cols tablet, 1 col mobile, with hero card spanning */}
        <div className="grid gap-y-[100px] gap-x-6 tablet:gap-y-20 tablet:gap-x-5 mobile:gap-y-12 mobile:gap-x-0 desktop:grid-cols-3 tablet:grid-cols-2 grid-cols-1 pb-[120px] tablet:pb-[100px] mobile:pb-[100px]">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.div
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={i === 0 && activeTab === 'completed' ? 'desktop:col-span-3' : ''}
              >
                <ProjectCard
                  slug={p.slug}
                  title={p.title}
                  category={p.category}
                  date={p.date}
                  image={p.image}
                  status={p.status}
                  hero={i === 0 && activeTab === 'completed'}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More button */}
        {hasMore && (
          <ScrollFadeUp delay={0.1}>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => Math.min(v + STEP, filteredProjects.length))}
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
