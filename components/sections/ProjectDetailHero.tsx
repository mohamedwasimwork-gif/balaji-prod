'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import type { Project } from '@/lib/projects';

interface ProjectDetailHeroProps {
  project: Project;
}

export default function ProjectDetailHero({ project }: ProjectDetailHeroProps) {
  return (
    <section
      id="project-detail-hero"
      className="w-full pt-28 pb-12 desktop:pt-40 desktop:pb-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-[70px] tablet:gap-[50px] mobile:gap-10">
          {/* Title wrapper — pill + h1 (max-w 55%) */}
          <div className="flex flex-col gap-6 desktop:max-w-[55%] tablet:max-w-[70%]">
            {/* Details row: category | date */}
            <ScrollFadeUp>
              <div className="flex items-center gap-3 font-inter text-text-muted text-[14px]">
                <span>{project.category}</span>
                <span className="opacity-60">|</span>
                <span className="opacity-80">{project.date}</span>
              </div>
            </ScrollFadeUp>

            {/* Heading */}
            <BlurInWords
              text={project.title}
              as="h1"
              className="type-hero text-text"
              stagger={0.05}
              duration={0.8}
            />
          </div>

          {/* Large hero image */}
          <div className="relative w-full overflow-hidden rounded-md aspect-[2.06545] mobile:aspect-[1.5]">
            <FadeInScale className="absolute inset-0">
              <Image
                src={project.image}
                alt={`${project.title} site photograph`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </FadeInScale>
          </div>

          {/* Body content — metadata + overview + scope + highlights */}
          <div className="desktop:max-w-[60%]">
            <ScrollFadeUp delay={0.1} distance={40}>
              <div className="flex flex-col gap-8 font-inter">
                {/* Metadata block */}
                <div className="flex flex-col gap-1.5 text-[15px] leading-[1.7em] text-text">
                  <p>
                    <strong className="font-semibold">Client:</strong> {project.client}
                  </p>
                  <p>
                    <strong className="font-semibold">Location:</strong> {project.location}
                  </p>
                  <p>
                    <strong className="font-semibold">Category:</strong> {project.category}
                  </p>
                </div>

                {/* Project Overview */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-karma font-medium text-text text-[24px] leading-[1.3em] tracking-[-0.03em]">
                    Project Overview
                  </h3>
                  <p className="text-[15px] leading-[1.7em] text-text-muted opacity-80">
                    {project.overview}
                  </p>
                </div>

                {/* Scope of Work */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-karma font-medium text-text text-[24px] leading-[1.3em] tracking-[-0.03em]">
                    Scope of Work
                  </h3>
                  <ul className="flex flex-col gap-2 list-disc pl-5">
                    {project.scope.map((item) => (
                      <li
                        key={item}
                        className="text-[15px] leading-[1.7em] text-text-muted opacity-90"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Highlights */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-karma font-medium text-text text-[24px] leading-[1.3em] tracking-[-0.03em]">
                    Key Highlights
                  </h3>
                  <ul className="flex flex-col gap-2 list-disc pl-5">
                    {project.highlights.map((item) => (
                      <li
                        key={item}
                        className="text-[15px] leading-[1.7em] text-text-muted opacity-90"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollFadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
