'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import HoverImageZoom from '@/components/motion/HoverImageZoom';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';
import SectionWrapper from '@/components/ui/SectionWrapper';

const DIRECTORS = [
  {
    name: 'Victor Jebaponraj',
    role: 'Legal Director of Balaji Wind Energy Pvt Ltd',
    image: '/images/director-victor.png',
  },
  {
    name: 'Ramesh Shankkar Sanai',
    role: 'Technical Director of Balaji Wind Energy Pvt Ltd',
    image: '/images/director-ramesh.png',
  },
  {
    name: 'Sasi Kumar',
    role: 'Project Head, Balaji Groups',
    image: '/images/director-sasi.png',
  },
];

export default function DirectorsSection() {
  return (
    <SectionWrapper id="board-of-directors" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-14 desktop:gap-[70px]">
        {/* Header */}
        <div className="flex flex-col gap-5 max-w-[55%] mobile:max-w-full">
          <ScrollFadeUp>
            <BarLabel>Our Leadership</BarLabel>
          </ScrollFadeUp>
          <BlurInWords
            text="Board of Directors"
            as="h2"
            className="type-h2 text-text"
            stagger={0.05}
          />
          <ParagraphBlurIn className="type-body-lg text-text-muted opacity-80" delay={0.15}>
            Guided by veteran contracting pioneers and engineering experts committed to safety,
            quality execution, and India's transition to sustainable energy.
          </ParagraphBlurIn>
        </div>

        {/* Leadership Grid */}
        <div className="grid gap-8 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
          {DIRECTORS.map((director, i) => (
            <ScrollFadeUp key={director.name} delay={i * 0.1} distance={30}>
              <div className="flex flex-col gap-4 group">
                {/* Photo container with zoom on hover */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg-soft border border-black/5">
                  <HoverImageZoom className="h-full w-full">
                    <Image
                      src={director.image}
                      alt={`Portrait of ${director.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
                    />
                  </HoverImageZoom>
                </div>
                {/* Director details */}
                <div className="flex flex-col gap-1">
                  <h3 className="type-h4 font-semibold text-text group-hover:text-[#606c38] transition-colors">
                    {director.name}
                  </h3>
                  <p className="type-body-sm text-text-muted opacity-90">{director.role}</p>
                </div>
              </div>
            </ScrollFadeUp>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
