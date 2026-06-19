import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';

interface CtaSectionProps {
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  bgSrc?: string;
}

export default function CtaSection({
  heading = 'Partner with us for reliable wind and solar execution backed by strong engineering and experience.',
  ctaLabel = 'Contact Our Team',
  ctaHref = '/contact',
  bgSrc = '/images/cta-1.jpg',
}: CtaSectionProps) {
  return (
    <SectionWrapper id="cta" contained={false} className="relative overflow-hidden">
      {/* Background — A9 scroll fade */}
      <ScrollFadeUp distance={100} fadeOpacity={false} className="absolute inset-0">
        <Image
          src={bgSrc}
          alt="Renewable energy infrastructure"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dark-1/80" />
      </ScrollFadeUp>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-container px-6 py-24 desktop:px-8 desktop:py-32">
        <div className="flex flex-col gap-8 tablet:flex-row tablet:items-end tablet:justify-between">
          <BlurInWords
            text={heading}
            as="h2"
            className="type-h2 text-white max-w-2xl"
            stagger={0.05}
          />
          <ScrollFadeUp delay={0.3} className="flex-shrink-0">
            <Button variant="primary-white" href={ctaHref}>
              {ctaLabel}
            </Button>
          </ScrollFadeUp>
        </div>
      </div>
    </SectionWrapper>
  );
}
