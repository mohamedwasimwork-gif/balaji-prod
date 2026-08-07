'use client';

import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';
import SectionWrapper from '@/components/ui/SectionWrapper';

const DIRECTORS = [
  {
    name: 'Victor Jebaponraj',
    role: 'Legal Director of Balaji Wind Energy Pvt Ltd',
  },
  {
    name: 'Ramesh Shankkar Sanai',
    role: 'Technical Director of Balaji Wind Energy Pvt Ltd',
  },
  {
    name: 'Sasi Kumar',
    role: 'Project Head, Balaji Groups',
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
            quality execution, and India&apos;s transition to sustainable energy.
          </ParagraphBlurIn>
        </div>

        {/* Leadership Grid — name cards, no portraits */}
        <ul className="grid gap-6 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 list-none p-0 m-0">
          {DIRECTORS.map((director, i) => (
            <ScrollFadeUp key={director.name} delay={i * 0.1} distance={30}>
              <li className="group flex h-full flex-col gap-2 rounded-xl border border-black/5 bg-bg-soft p-8 desktop:p-10">
                <h3 className="type-h4 font-semibold text-text transition-colors group-hover:text-[#606c38]">
                  {director.name}
                </h3>
                <p className="type-body-sm text-text-muted opacity-90">{director.role}</p>
              </li>
            </ScrollFadeUp>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
}
