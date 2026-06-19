import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import PillLabel from '@/components/ui/PillLabel';
import SectionWrapper from '@/components/ui/SectionWrapper';
import ServiceCard from '@/components/ui/ServiceCard';
import { CORE_SERVICES } from '@/lib/solutions';

export default function OptionSection() {
  return (
    <SectionWrapper id="options-section" className="py-24 desktop:py-32">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <ScrollFadeUp>
            <PillLabel>Core Services</PillLabel>
          </ScrollFadeUp>
          <BlurInWords
            text="End-to-end solutions for safe, strong, and efficient renewable energy projects."
            as="h2"
            className="type-h2 text-text max-w-xl"
            stagger={0.05}
          />
        </div>

        {/* Service list */}
        <div className="flex flex-col divide-y divide-border">
          {CORE_SERVICES.map((service, i) => (
            <ScrollFadeUp key={service.id} delay={i * 0.1} distance={40}>
              <ServiceCard
                number={service.number}
                title={service.title}
                description={service.description}
              />
            </ScrollFadeUp>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
