'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import FadeInUpDelayed from '@/components/motion/FadeInUpDelayed';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  /** Heading override for sub-pages */
  heading?: string;
  /** Subtitle override */
  subtitle?: string;
  /** CTA button href */
  ctaHref?: string;
  /** CTA button label */
  ctaLabel?: string;
  /** Show subtitle CTA row */
  showCta?: boolean;
  /** Background image src */
  bgSrc?: string;
  /** Small hero variant (less padding) for inner pages */
  compact?: boolean;
}

export default function HeroSection({
  heading = "From Wind to Solar — We Engineer India's Clean Energy Future !",
  subtitle = 'We deliver reliable wind and solar EPC solutions with strong engineering, on-time execution, and proven expertise across large-scale renewable energy projects.',
  ctaHref = '/solutions',
  ctaLabel = 'Explore Solutions',
  showCta = true,
  bgSrc = '/images/intro-foundations.jpg',
  compact = false,
}: HeroSectionProps) {
  return (
    <section
      id="hero-section"
      className={`relative flex w-full flex-col items-center justify-end overflow-hidden ${
        compact
          ? 'min-h-[55vh] mobile:min-h-[60vh] pb-12 desktop:pb-16'
          : 'min-h-[90vh] mobile:min-h-[85vh] desktop:min-h-screen pb-16 desktop:pb-20'
      }`}
      aria-label="Hero"
    >
      {/* Background image — A1, brightness-[0.7] = 30% darker */}
      <FadeInScale className="absolute inset-0 z-0">
        <Image
          src={bgSrc}
          alt="Wind and solar energy infrastructure"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </FadeInScale>

      {/* Gradient overlay — A2 */}
      <FadeInScale targetOpacity={0.7} className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-black" />
      </FadeInScale>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-container px-4 desktop:px-8 pt-24">
        {compact ? (
          /* Compact (inner pages): single column, left-aligned */
          <div className="flex flex-col gap-6 max-w-xl">
            <BlurInWords
              text={heading}
              as="h1"
              className="text-white type-h2"
              stagger={0.05}
              duration={0.8}
            />
            {showCta && (
              <FadeInUpDelayed>
                <div className="flex flex-col gap-4">
                  <p className="type-body-lg text-white/80">{subtitle}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button variant="primary-white" href={ctaHref}>
                      {ctaLabel}
                    </Button>
                  </div>
                </div>
              </FadeInUpDelayed>
            )}
          </div>
        ) : (
          /* Full hero: all content centred */
          <div className="flex flex-col items-center gap-6 desktop:gap-8 text-center">
            <BlurInWords
              text={heading}
              as="h1"
              className="text-white type-hero max-w-3xl justify-center"
              stagger={0.05}
              duration={0.8}
            />
            {showCta && (
              <FadeInUpDelayed>
                <div className="flex flex-col items-center gap-4 max-w-xl w-full">
                  <p className="type-body-lg text-white/80">{subtitle}</p>
                  <Button variant="primary-white" href={ctaHref}>
                    {ctaLabel}
                  </Button>
                </div>
              </FadeInUpDelayed>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
