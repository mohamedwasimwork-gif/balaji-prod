'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';
import Button from '@/components/ui/Button';

interface AchievementCard {
  title: string;
  description: string;
  image: string;
}

const CARDS: AchievementCard[] = [
  {
    title: "India's Largest Turbine",
    description:
      "Delivered India's largest 4.2MW onsite wind turbine as a complete turnkey project for WEG Brazil.",
    image: 'https://framerusercontent.com/images/immMxFmRyMw1HaAhNQx1KR16KY.webp',
  },
  {
    title: 'Large-Scale Orders',
    description:
      'Successfully executed 300MW foundations, 110MW land acquisition, and 138MW WTG logistics for Sprng Energy.',
    image: 'https://framerusercontent.com/images/LZwZWc2RR4ub4v2doN9iaKQIW0.jpg',
  },
  {
    title: 'Proven Experience',
    description:
      'Since 2005, executed over 2000MW of wind turbine foundations across multiple platforms in India.',
    image: 'https://framerusercontent.com/images/yX7fRz0Y9mhztEYD2snkPDC6R0I.webp',
  },
  {
    title: 'International Presence',
    description:
      'First Indian developer to successfully execute wind turbine foundations in Sri Lanka with OEM Suzlon.',
    image: 'https://framerusercontent.com/images/XS2mjgEm7qmbFX2tekHUaHlDYM.jpg',
  },
  {
    title: 'Regulatory Leadership',
    description:
      'First developer to manage liaisoning under Tamil Nadu CDB Rules 2019 for wind electric generators.',
    image: 'https://framerusercontent.com/images/shn0Pai8ytDvo0JvLIJCUOY.webp',
  },
];

function AchievementCardItem({ card, index }: { card: AchievementCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      className="relative flex flex-col gap-[30px] pb-[30px] overflow-hidden"
    >
      {/* 4px olive green bar — slides in from -400px on scroll */}
      <motion.div
        className="absolute top-0 h-1"
        style={{ backgroundColor: '#606c38', width: 400 }}
        initial={{ left: -400 }}
        animate={inView ? { left: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />

      <div className="relative w-full aspect-[1.5] overflow-hidden rounded-md">
        <FadeInScale className="absolute inset-0">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw"
          />
        </FadeInScale>
      </div>

      <h3 className="type-h4 font-medium text-text">{card.title}</h3>
      <p className="type-body-sm text-text-muted opacity-80">{card.description}</p>
    </div>
  );
}

export default function AchievementsListSection() {
  const topCards = CARDS.slice(0, 2);
  const bottomCards = CARDS.slice(2);

  return (
    <section
      id="achievements-list"
      className="w-full py-12 desktop:py-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-20 desktop:gap-[80px]">
          {/* Header: pill + h2 on left, body + CTA on right */}
          <div className="grid gap-10 desktop:grid-cols-2 desktop:gap-[100px]">
            <div className="flex flex-col gap-5">
              <ScrollFadeUp>
                <BarLabel>Our Values</BarLabel>
              </ScrollFadeUp>
              <BlurInWords
                text="Our achievements & strength"
                as="h2"
                className="type-h2 text-text"
                stagger={0.05}
              />
            </div>
            <div className="flex flex-col gap-6 desktop:justify-end desktop:pb-2">
              <ParagraphBlurIn
                className="font-inter text-text text-[15px] leading-[1.6em] opacity-90"
                delay={0.15}
              >
                Complete wind and solar solutions delivered with strong engineering and dependable
                execution.
              </ParagraphBlurIn>
              <ScrollFadeUp delay={0.3}>
                <div className="self-start">
                  <Button variant="secondary" href="/contact">
                    Contact Us
                  </Button>
                </div>
              </ScrollFadeUp>
            </div>
          </div>

          {/* Cards: 2+3 layout */}
          <div className="flex flex-col gap-10">
            {/* Top row: 2 cards */}
            <div className="grid gap-x-6 gap-y-5 desktop:grid-cols-2">
              {topCards.map((card, i) => (
                <AchievementCardItem key={card.title} card={card} index={i} />
              ))}
            </div>

            {/* Bottom row: 3 cards */}
            <div className="grid gap-x-6 gap-y-5 desktop:grid-cols-3 tablet:grid-cols-2">
              {bottomCards.map((card, i) => (
                <AchievementCardItem key={card.title} card={card} index={i + 2} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
