'use client';

import { Coins, History, Users } from 'lucide-react';
import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';

function WindmillIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="10" r="1.2" />
      <path d="M12 8.8 L12 3" />
      <path d="M13.05 10.6 L18.1 13.5" />
      <path d="M10.95 10.6 L5.9 13.5" />
      <path d="M11.3 11 L10.5 21" />
      <path d="M12.7 11 L13.5 21" />
      <path d="M8.5 21 L15.5 21" />
    </svg>
  );
}

const SERVICE_CARDS = [
  {
    id: 'site-selection',
    title: 'Site Selection',
    description:
      'Conducting thorough technical assessments and detailed load flow studies to ensure safe, efficient, and compliant project planning outcomes.',
    icon: <Coins size={22} strokeWidth={1.75} />,
  },
  {
    id: 'government-approvals',
    title: 'Government Approvals',
    description:
      'Facilitating project registration and obtaining all required approvals, including Minister NOC, until successful project commissioning.',
    icon: <Users size={22} strokeWidth={1.75} />,
  },
  {
    id: 'land-acquisition',
    title: 'Land Acquisition',
    description:
      'Securing land with clear titles, including cleaning, soil testing, contour surveys, and preparation for construction activities onsite.',
    icon: <WindmillIcon size={22} />,
  },
  {
    id: 'civil-foundations',
    title: 'Civil Foundations',
    description:
      'Developing civil foundations, crane pads, access pathways, and supporting infrastructure required for smooth turbine installation operations.',
    icon: <History size={22} strokeWidth={1.75} />,
  },
];

export default function SolutionsHeroSection() {
  return (
    <section id="solutions-hero" className="w-full pt-28 pb-12 desktop:pt-40 desktop:pb-24">
      <div className="flex flex-col gap-14 desktop:gap-[70px]">
        {/* Top: heading + paragraph */}
        <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
          <div className="grid gap-8 desktop:grid-cols-2 desktop:gap-[63px] desktop:items-end">
            <BlurInWords
              text="End-to-End Solutions for Wind & Solar Projects"
              as="h1"
              className="type-hero text-text"
              stagger={0.05}
              duration={0.8}
            />
            <ParagraphBlurIn
              className="type-body-lg text-text-muted opacity-80 max-w-md"
              delay={0.15}
            >
              We deliver complete engineering, civil, and electrical execution for utility-scale
              renewable projects, ensuring safe, reliable, and timely delivery across India.
            </ParagraphBlurIn>
          </div>
        </div>

        {/* Center: hero image — contained within max-width container, Ken Burns scale-in */}
        <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
          <div className="relative w-full overflow-hidden rounded-md aspect-[2.06545] mobile:aspect-[1.5]">
            <FadeInScale className="absolute inset-0">
              <Image
                src="https://framerusercontent.com/images/yX7fRz0Y9mhztEYD2snkPDC6R0I.webp"
                alt="Wind and solar project field"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1199px) 100vw, 1200px"
              />
            </FadeInScale>
          </div>
        </div>

        {/* Bottom: 4 service preview cards — plain grey 44x44 placeholder squares (no icons) */}
        <div className="mx-auto w-full max-w-container px-4 desktop:px-8 pt-5">
          <div className="grid gap-[100px_30px] tablet:grid-cols-2 desktop:grid-cols-4 desktop:gap-[100px_30px] mobile:gap-y-[25px]">
            {SERVICE_CARDS.map((card, i) => (
              <ScrollFadeUp key={card.id} delay={i * 0.12} distance={20}>
                <div className="flex flex-col gap-[30px] mobile:gap-5">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-md text-text"
                    style={{ backgroundColor: 'rgb(240, 240, 240)' }}
                  >
                    {card.icon}
                  </div>
                  <h2 className="type-h4 font-medium text-text">{card.title}</h2>
                  <p className="type-body-sm text-text-muted opacity-80">{card.description}</p>
                </div>
              </ScrollFadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
