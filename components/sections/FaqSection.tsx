import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';
import FaqAccordion from '@/components/ui/FaqAccordion';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { FAQS } from '@/lib/faqs';

export default function FaqSection() {
  return (
    <SectionWrapper id="faq-section" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-12 desktop:flex-row desktop:items-start desktop:gap-[100px]">
        {/* Left — eyebrow + heading + subtitle */}
        <div className="flex flex-col gap-5 desktop:w-[38%] desktop:flex-shrink-0">
          <ScrollFadeUp>
            <BarLabel>Help Center</BarLabel>
          </ScrollFadeUp>

          <BlurInWords
            text="Frequently Asked Questions"
            as="h2"
            className="type-h2 text-text"
            stagger={0.05}
          />

          <ParagraphBlurIn
            className="font-inter text-text-muted text-[15px] leading-[1.6em] opacity-80"
            delay={0.2}
          >
            Browse answers to frequently asked questions about Balaji &amp; Co solutions.
          </ParagraphBlurIn>
        </div>

        {/* Right — accordion */}
        <div className="flex-1">
          <ScrollFadeUp delay={0.15}>
            <FaqAccordion items={FAQS} />
          </ScrollFadeUp>
        </div>
      </div>
    </SectionWrapper>
  );
}
