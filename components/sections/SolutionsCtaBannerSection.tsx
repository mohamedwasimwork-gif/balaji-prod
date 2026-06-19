'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import PillLabel from '@/components/ui/PillLabel';

export default function SolutionsCtaBannerSection() {
  return (
    <section
      id="solutions-cta-banner"
      className="relative w-full overflow-hidden py-28 desktop:py-36"
      aria-label="Build Your Renewable Energy Project"
    >
      {/* Background image with slow zoom-in (scale 1.05 → 1) */}
      <FadeInScale className="absolute inset-0 z-0">
        <Image
          src="/images/cta-3.webp"
          alt="Solar panel field"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </FadeInScale>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Centered content */}
      <div className="relative z-20 mx-auto w-full max-w-container px-6 desktop:px-8">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <ScrollFadeUp>
            <PillLabel variant="light">Contact Us</PillLabel>
          </ScrollFadeUp>

          <BlurInWords
            text="Build Your Renewable Energy Project"
            as="h2"
            className="type-h2 text-white justify-center"
            stagger={0.05}
            duration={0.8}
          />

          <ScrollFadeUp delay={0.2}>
            <p className="type-body-lg text-white/80 max-w-xl">
              Partner with us for reliable wind and solar execution backed by strong engineering and
              experience.
            </p>
          </ScrollFadeUp>

          <ScrollFadeUp delay={0.35}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button variant="primary-white" href="/contact">
                Contact Our Team
              </Button>
              <Button variant="alternate" href="/">
                Learn About Us
              </Button>
            </div>
          </ScrollFadeUp>
        </div>
      </div>
    </section>
  );
}
