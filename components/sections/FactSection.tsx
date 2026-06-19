'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';

const STATS = [
  { state: 'Karnataka',      mw: 454,  color: 'rgb(96, 108, 56)'  },
  { state: 'Andhra Pradesh', mw: 112,  color: 'rgb(188, 108, 37)' },
  { state: 'Tamilnadu',      mw: 1302, color: 'rgb(40, 54, 24)'   },
  { state: 'Maharastra',     mw: 150,  color: 'rgb(221, 161, 94)' },
  { state: 'Madhya Pradesh', mw: 32,   color: 'rgb(173, 193, 120)'},
];

const MAX_MW = 1302;

function VerticalBar({
  state,
  mw,
  color,
  delay,
}: {
  state: string;
  mw: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const heightPct = (mw / MAX_MW) * 100;

  return (
    <motion.div
      ref={ref}
      className="flex flex-1 min-w-0 flex-col justify-between px-2.5 py-4 tablet:px-3 desktop:px-4 desktop:py-5"
      style={{ backgroundColor: color }}
      initial={{ height: '0%' }}
      animate={inView ? { height: `${heightPct}%` } : { height: '0%' }}
      transition={{ duration: 0.9, delay, ease: [0.44, 0, 0.56, 1] }}
    >
      {/* Top: value + separator line */}
      <div className="flex flex-col gap-2">
        <p className="font-manrope text-base tablet:text-lg desktop:text-xl font-bold text-white leading-tight">
          {mw.toLocaleString()} MW
        </p>
        <div className="h-px w-8 desktop:w-10 bg-white/40" />
      </div>

      {/* Bottom: state name */}
      <p className="font-manrope text-[11px] tablet:text-xs desktop:text-sm font-medium text-white truncate">
        {state}
      </p>
    </motion.div>
  );
}

export default function FactSection() {
  return (
    <SectionWrapper id="Fact" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-16">

        {/* Header — 2 column */}
        <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start desktop:justify-between">
          {/* Left: eyebrow + heading */}
          <div className="flex flex-col gap-4 desktop:max-w-[52%]">
            <ScrollFadeUp>
              <span className="flex items-center gap-2 type-label text-text-muted">
                <span aria-hidden="true">—</span>
                Our Achievements
              </span>
            </ScrollFadeUp>
            <BlurInWords
              text="Reliable delivery backed by 2060 MW of completed projects."
              as="h2"
              className="type-h2 text-text"
              stagger={0.05}
            />
          </div>

          {/* Right: body + button */}
          <ScrollFadeUp delay={0.2} className="flex flex-col items-start gap-5 desktop:max-w-xs w-full desktop:w-auto">
            <p className="type-body text-text-muted">
              Our team focuses on{' '}
              <strong className="font-semibold text-text">
                quality, safety, and consistent project delivery
              </strong>
              . We support clients with clear communication, dependable timelines engineering
              standards across every wind and solar project.
            </p>
            <Button variant="secondary" href="/projects">
              View All
            </Button>
          </ScrollFadeUp>
        </div>

        {/* Vertical bar chart — shorter on mobile */}
        <div
          className="flex items-end gap-0 overflow-hidden rounded-2xl h-[320px] desktop:h-[420px]"
        >
          {STATS.map((stat, i) => (
            <VerticalBar
              key={stat.state}
              state={stat.state}
              mw={stat.mw}
              color={stat.color}
              delay={i * 0.1}
            />
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
}
