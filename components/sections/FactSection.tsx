'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';

interface ProjectDataType {
  label: string;
  fullLabel: string;
  mw: number;
}

// 1. COMPLETED PROJECTS BY LOCATION
const COMPLETED_BY_LOCATION: ProjectDataType[] = [
  { label: 'Tamil Nadu', fullLabel: 'Tamil Nadu', mw: 1444.8 },
  { label: 'Karnataka', fullLabel: 'Karnataka', mw: 454 },
  { label: 'Madhya Pradesh', fullLabel: 'Madhya Pradesh', mw: 150 },
  { label: 'Andhra Pradesh', fullLabel: 'Andhra Pradesh', mw: 112 },
  { label: 'Maharashtra', fullLabel: 'Maharashtra', mw: 32 },
  { label: 'Sri Lanka', fullLabel: 'Sri Lanka', mw: 10 },
];

// 2. ONGOING PROJECTS BY LOCATION
const ONGOING_BY_LOCATION: ProjectDataType[] = [
  { label: 'Karnataka', fullLabel: 'Karnataka (Jindal Projects)', mw: 454 },
  { label: 'Gujarat', fullLabel: 'Gujarat (Adani Projects)', mw: 180 },
  { label: 'Tamil Nadu', fullLabel: 'Tamil Nadu (Sprng & Tata Power Projects)', mw: 1 },
];

// 3. COMPLETED PROJECTS BY COMPANY
const COMPLETED_BY_COMPANY: ProjectDataType[] = [
  { label: 'Suzlon', fullLabel: 'Suzlon', mw: 1000 },
  { label: 'Regen', fullLabel: 'Regen', mw: 500 },
  { label: 'Nordex', fullLabel: 'Nordex', mw: 300 },
  { label: 'Siemens Gamesa', fullLabel: 'Siemens Gamesa', mw: 250 },
  { label: 'Renew Power', fullLabel: 'Renew Power', mw: 250 },
  { label: 'Tata Power', fullLabel: 'Tata Power', mw: 90 },
  { label: 'Sprng Energy', fullLabel: 'Sprng Energy', mw: 52.8 },
  { label: 'Senok', fullLabel: 'Senok', mw: 10 },
];

// 4. ONGOING PROJECTS BY COMPANY
const ONGOING_BY_COMPANY: ProjectDataType[] = [
  { label: 'Sprng Energy', fullLabel: 'Sprng Energy', mw: 300 },
  { label: 'Tata Power (WTG)', fullLabel: 'Tata Power (WTG Foundation Work)', mw: 246.6 },
  { label: 'Adani', fullLabel: 'Adani', mw: 180 },
  { label: 'Jindal Renewables', fullLabel: 'Jindal Renewables', mw: 155 },
  { label: 'Tata Power (BOP)', fullLabel: 'Tata Power (Balance of Plant - BOP Work)', mw: 83.6 },
  { label: 'Tata Power (PSS)', fullLabel: 'Tata Power (PSS Work)', mw: 1 },
];

const BAR_COLORS = [
  'rgb(40, 54, 24)',   // Dark Forest Green
  'rgb(96, 108, 56)',   // Olive Green
  'rgb(188, 108, 37)',  // Ochre/Brown
  'rgb(221, 161, 94)',  // Sandy Gold
  'rgb(173, 193, 120)', // Sage Green
  'rgb(107, 112, 92)',  // Artichoke Green
  'rgb(142, 125, 101)', // Taupe
  'rgb(156, 102, 68)',  // Sienna / Earthy Red
];

const getColor = (index: number): string => BAR_COLORS[index % BAR_COLORS.length] ?? 'rgb(40, 54, 24)';

function VerticalBar({
  label,
  fullLabel,
  value,
  maxValue,
  color,
  delay,
}: {
  label: string;
  fullLabel: string;
  value: number;
  maxValue: number;
  color: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const MIN_BAR_HEIGHT = 110;
  const MAX_BAR_HEIGHT = 500;

  const scaledHeight = Math.sqrt(value / maxValue) * MAX_BAR_HEIGHT;
  const finalHeight = Math.max(scaledHeight, MIN_BAR_HEIGHT);

  const heightRatio = (finalHeight - MIN_BAR_HEIGHT) / (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);

  const valueFontSize = `clamp(11px, calc(0.65rem + ${heightRatio * 1.0}vw), ${12 + heightRatio * 14}px)`;
  const labelFontSize = `clamp(9px, calc(0.55rem + ${heightRatio * 0.75}vw), ${10 + heightRatio * 7}px)`;
  const dividerWidth = `${Math.max(16, 16 + heightRatio * 24)}px`;

  return (
    <motion.div
      ref={ref}
      layout
      className="flex flex-1 min-w-0 flex-col justify-between px-1 py-4 sm:px-2.5 sm:py-5 tablet:px-3 desktop:px-4 border-r border-white/5 last:border-0"
      style={{ backgroundColor: color }}
      initial={{ height: 0, opacity: 0 }}
      animate={inView ? { height: finalHeight, opacity: 1 } : { height: 0, opacity: 0 }}
      exit={{ height: 0, opacity: 0, width: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.44, 0, 0.56, 1] }}
      title={`${fullLabel}: ${value.toLocaleString()} MW`}
    >
      {/* Top: value + separator line */}
      <div className="flex flex-col gap-2">
        <p 
          className="font-manrope font-bold text-white leading-tight transition-all duration-300"
          style={{ fontSize: valueFontSize }}
        >
          {value.toLocaleString()} MW
        </p>
        <div 
          className="h-px bg-white/40 transition-all duration-300" 
          style={{ width: dividerWidth }}
        />
      </div>

      {/* Bottom: state/company name */}
      <p 
        className="font-manrope font-medium text-white truncate transition-all duration-300"
        style={{ fontSize: labelFontSize }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export default function FactSection() {
  const [view, setView] = useState<'location' | 'company'>('location');
  const [status, setStatus] = useState<'completed' | 'ongoing'>('completed');

  const getActiveData = () => {
    if (view === 'location') {
      return status === 'completed' ? COMPLETED_BY_LOCATION : ONGOING_BY_LOCATION;
    } else {
      return status === 'completed' ? COMPLETED_BY_COMPANY : ONGOING_BY_COMPANY;
    }
  };

  const rawData = getActiveData();
  const activeData = rawData.map((item, index) => ({
    ...item,
    color: getColor(index),
  }));

  const maxMw = Math.max(...activeData.map((d) => d.mw), 1);
  const totalMw = activeData.reduce((sum, item) => sum + item.mw, 0);

  const headingText = status === 'completed'
    ? `Reliable delivery backed by ${totalMw.toLocaleString()} MW of completed projects.`
    : `Growing portfolio with ${totalMw.toLocaleString()} MW of ongoing projects.`;

  return (
    <SectionWrapper id="Fact" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-12 desktop:gap-16">

        {/* Header — 2 column */}
        <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start desktop:justify-between">
          {/* Left: eyebrow + heading */}
          <div className="flex flex-col gap-4 desktop:max-w-[55%]">
            <ScrollFadeUp>
              <span className="flex items-center gap-2 type-label text-text-muted">
                <span aria-hidden="true">—</span>
                Our Achievements
              </span>
            </ScrollFadeUp>
            <BlurInWords
              key={headingText}
              text={headingText}
              as="h2"
              className="type-h2 text-text"
              stagger={0.03}
            />
          </div>

          {/* Right: body + button */}
          <ScrollFadeUp delay={0.2} className="flex flex-col items-start gap-5 desktop:max-w-xs w-full desktop:w-auto">
            <p className="type-body text-text-muted">
              Our team focuses on{' '}
              <strong className="font-semibold text-text">
                quality, safety, and consistent project delivery
              </strong>
              . We support clients with clear communication, dependable timelines and engineering
              standards across every wind and solar project.
            </p>
            <Button variant="secondary" href="/projects">
              View All
            </Button>
          </ScrollFadeUp>
        </div>

        {/* Dynamic Controls Bar */}
        <ScrollFadeUp delay={0.1} className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full bg-neutral-50/80 dark:bg-neutral-800/20 p-3 sm:p-4 rounded-2xl border border-neutral-200/30 dark:border-neutral-700/10">
            {/* Left Toggle Group: Location / Company */}
            <div className="flex bg-neutral-200/50 dark:bg-neutral-800/60 p-1 rounded-full border border-neutral-300/20 dark:border-neutral-700/20 max-w-fit">
              <button
                onClick={() => setView('location')}
                className={`px-5 py-2 text-xs font-semibold rounded-full relative transition-colors duration-300 font-inter ${
                  view === 'location' ? 'text-white' : 'text-[#606c38] hover:text-[#4e5830]'
                }`}
              >
                {view === 'location' && (
                  <motion.span
                    layoutId="active-view-tab"
                    className="absolute inset-0 bg-[#606c38] rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                Location
              </button>
              <button
                onClick={() => setView('company')}
                className={`px-5 py-2 text-xs font-semibold rounded-full relative transition-colors duration-300 font-inter ${
                  view === 'company' ? 'text-white' : 'text-[#606c38] hover:text-[#4e5830]'
                }`}
              >
                {view === 'company' && (
                  <motion.span
                    layoutId="active-view-tab"
                    className="absolute inset-0 bg-[#606c38] rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                Company
              </button>
            </div>

            {/* Dynamic Sum display */}
            <div className="flex flex-col items-start sm:items-center justify-center pl-2 sm:pl-0">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted">Dynamic Capacity</span>
              <span className="text-xl font-bold font-manrope text-[#606c38]">{totalMw.toLocaleString()} MW</span>
            </div>

            {/* Right Toggle Group: Completed / Ongoing */}
            <div className="flex bg-neutral-200/50 dark:bg-neutral-800/60 p-1 rounded-full border border-neutral-300/20 dark:border-neutral-700/20 max-w-fit self-start sm:self-auto">
              <button
                onClick={() => setStatus('completed')}
                className={`px-5 py-2 text-xs font-semibold rounded-full relative transition-colors duration-300 font-inter ${
                  status === 'completed' ? 'text-white' : 'text-[#606c38] hover:text-[#4e5830]'
                }`}
              >
                {status === 'completed' && (
                  <motion.span
                    layoutId="active-status-tab"
                    className="absolute inset-0 bg-[#606c38] rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                Completed
              </button>
              <button
                onClick={() => setStatus('ongoing')}
                className={`px-5 py-2 text-xs font-semibold rounded-full relative transition-colors duration-300 font-inter ${
                  status === 'ongoing' ? 'text-white' : 'text-[#606c38] hover:text-[#4e5830]'
                }`}
              >
                {status === 'ongoing' && (
                  <motion.span
                    layoutId="active-status-tab"
                    className="absolute inset-0 bg-[#606c38] rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                Ongoing
              </button>
            </div>
          </div>
        </ScrollFadeUp>

        {/* Vertical bar chart container */}
        <div
          className="flex items-end gap-0 overflow-hidden rounded-2xl h-[550px] bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-700/10 shadow-inner"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {activeData.map((stat, i) => (
              <VerticalBar
                key={`${view}-${status}-${stat.label}`} // Composite key ensures animation when dataset changes
                label={stat.label}
                fullLabel={stat.fullLabel}
                value={stat.mw}
                maxValue={maxMw}
                color={stat.color}
                delay={i * 0.03}
              />
            ))}
          </AnimatePresence>
        </div>

      </div>
    </SectionWrapper>
  );
}
