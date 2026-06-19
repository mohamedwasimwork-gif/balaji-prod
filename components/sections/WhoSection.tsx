import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';

const WHO_SERVICES = [
  {
    id: 'wind',
    number: '01',
    heading: 'Wind Energy',
    description:
      'Full EPC solutions covering foundations, crane pads, electrical works, and complete commissioning.',
  },
  {
    id: 'solar',
    number: '02',
    heading: 'Solar Energy',
    description:
      'End-to-end solar development including MMS structures, cabling, civil works, and commissioning.',
  },
];

export default function WhoSection() {
  return (
    <SectionWrapper id="who-section" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-12 tablet:flex-row tablet:items-start tablet:gap-12 desktop:flex-row desktop:items-start desktop:gap-20">
        {/* Left — eyebrow + heading + body + CTA */}
        <div className="flex flex-col gap-6 tablet:max-w-sm desktop:max-w-md">
          <ScrollFadeUp>
            <span className="flex items-center gap-2 type-label text-text-muted">
              <span aria-hidden="true">—</span>
              Who We Help
            </span>
          </ScrollFadeUp>

          <BlurInWords
            text="Complete Wind & Solar Services"
            as="h2"
            className="type-h2 text-text"
            stagger={0.06}
            duration={0.8}
          />

          <ParagraphBlurIn className="type-body text-text-muted" delay={0.2}>
            We deliver reliable engineering, construction, and execution for utility-scale wind and
            solar projects.
          </ParagraphBlurIn>

          <ScrollFadeUp delay={0.3}>
            <Button variant="secondary" href="/solutions">
              Explore Services
            </Button>
          </ScrollFadeUp>
        </div>

        {/* Right — numbered service list with dividers */}
        <div className="flex flex-1 flex-col gap-8">
          {WHO_SERVICES.map((svc, i) => (
            <ScrollFadeUp key={svc.id} delay={i * 0.15} distance={40}>
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-[#606c38] text-sm font-medium text-white">
                    {svc.number}
                  </div>
                  <h3 className="type-h3 font-medium text-text">{svc.heading}</h3>
                </div>
                <p className="type-body text-text-muted">{svc.description}</p>
              </div>
            </ScrollFadeUp>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
