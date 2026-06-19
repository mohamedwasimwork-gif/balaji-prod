'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import PillLabel from '@/components/ui/PillLabel';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { ACHIEVEMENTS } from '@/lib/solutions';

const ACHIEVEMENT_IMAGES = [
  '/images/intro-foundations.jpg',
  '/images/intro-solar.jpg',
  '/images/intro-hybrid.jpg',
  '/images/cta-1.jpg',
  '/images/cta-2.jpg',
];

export default function AchievementsSection() {
  return (
    <SectionWrapper id="achievements-section" className="py-24 desktop:py-32">
      <div className="flex flex-col gap-16 desktop:gap-20">
        {/* Top: collage left + heading right */}
        <div className="grid gap-12 desktop:grid-cols-2 desktop:gap-16 items-center">
          {/* Left: collage with stat overlays */}
          <ScrollFadeUp distance={40}>
            <div className="relative w-full aspect-[4/5] desktop:aspect-[5/6]">
              {/* Main image */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <Image
                  src="/images/intro-foundations.jpg"
                  alt="Wind and solar project collage"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1199px) 100vw, 50vw"
                />
              </div>

              {/* Top-right stat box: 65% */}
              <div className="absolute top-6 right-6 bg-white rounded-xl p-5 shadow-lg flex flex-col items-center text-center min-w-[140px]">
                <span className="type-stat font-medium text-text">65%</span>
                <span className="type-body-sm text-text-muted mt-1">
                  Reduction in Electricity Costs
                </span>
              </div>

              {/* Bottom-left stat box: 90% */}
              <div className="absolute bottom-6 left-6 bg-white rounded-xl p-5 shadow-lg flex flex-col items-center text-center min-w-[140px]">
                <span className="type-stat font-medium text-text">90%</span>
                <span className="type-body-sm text-text-muted mt-1">
                  Energy Independence Achieved
                </span>
              </div>
            </div>
          </ScrollFadeUp>

          {/* Right: heading + founder quote + avatar */}
          <div className="flex flex-col gap-6">
            <ScrollFadeUp>
              <PillLabel>Our Values</PillLabel>
            </ScrollFadeUp>
            <BlurInWords
              text="Complete wind and solar solutions delivered with strong engineering and dependable execution."
              as="h2"
              className="type-h2 text-text"
              stagger={0.05}
            />

            {/* Founder's Note */}
            <ScrollFadeUp delay={0.2} distance={40}>
              <div className="flex flex-col gap-5 pt-4 border-t border-border mt-2">
                <PillLabel>Founder&apos;s Note</PillLabel>
                <p className="type-body text-text-muted italic">
                  &ldquo;We are committed to delivering reliable renewable projects with trust and
                  integrity. Our focus has always been strong engineering, timely execution, and
                  long-term value creation for every client we serve across the renewable energy
                  sector.&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full bg-bg-soft flex items-center justify-center">
                    <span className="type-label font-semibold text-text">B</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="type-body-sm font-semibold text-text">Balaji</span>
                    <span className="type-label text-text-muted">Founder &amp; Director</span>
                  </div>
                </div>
              </div>
            </ScrollFadeUp>
          </div>
        </div>

        {/* Achievements list — 5 cards */}
        <div className="flex flex-col gap-3">
          <ScrollFadeUp>
            <h3 className="type-h3 text-text mb-4">Our Achievements &amp; Strength</h3>
          </ScrollFadeUp>

          <div className="grid gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {ACHIEVEMENTS.map((item, i) => (
              <ScrollFadeUp key={item.title} delay={i * 0.1} distance={40}>
                <div className="flex flex-col gap-4 h-full p-6 rounded-2xl border border-border bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                    <Image
                      src={ACHIEVEMENT_IMAGES[i] || ACHIEVEMENT_IMAGES[0] || '/images/cta-1.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    />
                  </div>
                  <h4 className="type-h4 font-medium text-text">{item.title}</h4>
                  <p className="type-body-sm text-text-muted">{item.description}</p>
                </div>
              </ScrollFadeUp>
            ))}
          </div>

          <ScrollFadeUp delay={0.3} className="pt-6">
            <Button variant="primary" href="/contact">
              Contact Us
            </Button>
          </ScrollFadeUp>
        </div>
      </div>
    </SectionWrapper>
  );
}
