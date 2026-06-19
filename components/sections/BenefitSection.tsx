import Image from 'next/image';
import { Landmark, LayoutGrid } from 'lucide-react';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';
import SectionWrapper from '@/components/ui/SectionWrapper';

const VALUES = [
  {
    id: 'mission',
    title: 'Our Core Mission',
    description:
      'We build world-class infrastructure with strong professionalism, ethics, quality, and service to support renewable energy growth.',
    icon: <Landmark size={20} />,
  },
  {
    id: 'vision',
    title: 'Vision for Tomorrow',
    description:
      'We aim to shape a cleaner India through renewable energy leadership and valuable, future-focused sustainable power solutions.',
    icon: <LayoutGrid size={20} />,
  },
];

export default function BenefitSection() {
  return (
    <SectionWrapper id="benefit-section" className="py-12 desktop:py-24">
      <div className="flex flex-col gap-12 desktop:flex-row desktop:items-stretch desktop:gap-16">

        {/* Left — tall image */}
        <div className="relative overflow-hidden rounded-2xl mobile:h-[360px] tablet:h-[500px] desktop:h-auto desktop:min-h-[600px] desktop:w-[45%] desktop:flex-shrink-0">
          <Image
            src="/images/about-factory.jpg"
            alt="Aerial view of solar panel installation"
            fill
            className="object-cover"
            sizes="(max-width: 1199px) 100vw, 45vw"
          />
        </div>

        {/* Right — content */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Eyebrow */}
          <ScrollFadeUp>
            <span className="flex items-center gap-2 type-label text-text-muted">
              <span aria-hidden="true">—</span>
              Our Values
            </span>
          </ScrollFadeUp>

          {/* Heading */}
          <BlurInWords
            text="Foundation of Our Guiding Principles"
            as="h2"
            className="type-h2 text-text"
            stagger={0.05}
          />

          {/* CTA */}
          <ScrollFadeUp delay={0.2}>
            <Button variant="secondary" href="/about">
              About Us
            </Button>
          </ScrollFadeUp>

          {/* Value items */}
          <div className="flex flex-col">
            {VALUES.map((val, i) => (
              <ScrollFadeUp key={val.id} delay={i * 0.15}>
                <div className="flex items-start gap-5 py-8 last:pb-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-bg-soft text-text">
                    {val.icon}
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="type-h4 font-medium text-text">{val.title}</h3>
                    <p className="type-body text-text-muted">{val.description}</p>
                  </div>
                </div>
              </ScrollFadeUp>
            ))}
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
