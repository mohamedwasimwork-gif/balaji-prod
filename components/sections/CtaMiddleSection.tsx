import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';

interface CtaMiddleSectionProps {
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function CtaMiddleSection({
  heading = 'Complete wind and solar solutions delivered with strong engineering and dependable execution.',
  ctaLabel = 'Contact Us',
  ctaHref = '/contact',
}: CtaMiddleSectionProps) {
  return (
    <SectionWrapper id="cta-middle" className="bg-primary py-20 desktop:py-24">
      <div className="flex flex-col gap-8 tablet:flex-row tablet:items-center tablet:justify-between">
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
    </SectionWrapper>
  );
}
