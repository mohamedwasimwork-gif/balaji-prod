import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import CertificationTabs from '@/components/ui/CertificationTabs';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { CERTIFICATIONS } from '@/lib/certifications';

export default function CertificationsSection() {
  const tabs = CERTIFICATIONS.map((c) => ({
    label: c.name,
    description: c.description,
    imageSrc: c.image,
    imageAlt: `${c.name} certification`,
  }));

  return (
    <SectionWrapper id="certifications-section" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-12">

        {/* Header — 2 column */}
        <div className="flex flex-col gap-8 desktop:flex-row desktop:items-start desktop:justify-between">
          {/* Left: eyebrow + heading */}
          <div className="flex flex-col gap-4 desktop:max-w-[48%]">
            <ScrollFadeUp>
              <span className="flex items-center gap-2 type-label text-text-muted">
                <span aria-hidden="true">—</span>
                Our Certifications
              </span>
            </ScrollFadeUp>
            <BlurInWords
              text="Accreditations & Standards"
              as="h2"
              className="type-h2 text-text"
              stagger={0.05}
            />
          </div>

          {/* Right: body + button */}
          <ScrollFadeUp delay={0.2} className="flex flex-col items-start gap-5 desktop:max-w-xs">
            <ParagraphBlurIn className="type-body text-text-muted" delay={0.1}>
              Operating under global quality, environmental, and safety standards for reliable,
              sustainable project delivery.
            </ParagraphBlurIn>
            <Button variant="secondary" href="/about">
              About Us
            </Button>
          </ScrollFadeUp>
        </div>

        {/* Image carousel + tab indicators */}
        <ScrollFadeUp delay={0.15}>
          <CertificationTabs tabs={tabs} />
        </ScrollFadeUp>

      </div>
    </SectionWrapper>
  );
}
