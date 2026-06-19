'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';

export default function MidCtaBannerSection() {
  return (
    <section
      id="mid-cta-banner"
      className="relative w-full overflow-hidden py-20 desktop:py-28"
      aria-label="Build Your Renewable Energy Project"
    >
      {/* Background image — slight scale 1.05 (Ken Burns) */}
      <FadeInScale className="absolute inset-0 z-0">
        <Image
          src="https://framerusercontent.com/images/PE2Q4nZMGYEuJYrAk8d0swPrSY.webp"
          alt="Solar solution"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </FadeInScale>

      {/* Dark gradient overlay (bg_gradient) */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Centered content */}
      <div className="relative z-20 mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto py-12 desktop:py-16">
          <BlurInWords
            text="Build Your Renewable Energy Project"
            as="h2"
            className="type-h2 text-white justify-center"
            stagger={0.05}
            duration={0.8}
          />

          <ScrollFadeUp delay={0.2}>
            <p className="font-inter text-white/85 text-[15px] leading-[1.6em] max-w-xl">
              Partner with us for reliable wind and solar execution backed by strong engineering and
              experience.
            </p>
          </ScrollFadeUp>

          <ScrollFadeUp delay={0.35}>
            <div className="pt-2">
              <Button variant="primary-white" href="/contact">
                Contact Our Team
              </Button>
            </div>
          </ScrollFadeUp>
        </div>
      </div>
    </section>
  );
}
