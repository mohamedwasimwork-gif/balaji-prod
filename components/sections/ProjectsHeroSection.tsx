'use client';

import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';

export default function ProjectsHeroSection() {
  return (
    <section
      id="projects-hero"
      className="w-full pt-28 pb-12 desktop:pt-40 desktop:pb-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-6 desktop:max-w-[55%]">
          <ScrollFadeUp>
            <BarLabel>Resources</BarLabel>
          </ScrollFadeUp>
          <BlurInWords
            text="Our Completed Renewable Projects"
            as="h1"
            className="type-hero text-text"
            stagger={0.05}
            duration={0.8}
          />
          <ParagraphBlurIn
            className="font-inter text-text-muted text-[15px] leading-[1.6em] opacity-80 max-w-md"
            delay={0.2}
          >
            Proven delivery of wind and solar projects with consistent performance.
          </ParagraphBlurIn>
        </div>
      </div>
    </section>
  );
}
