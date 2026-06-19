'use client';

import { HeartPulse, Sparkles, Target, TrendingUp } from 'lucide-react';

import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import IntroCard from '@/components/ui/IntroCard';
import SectionWrapper from '@/components/ui/SectionWrapper';

export default function IntroductionSection() {
  return (
    <SectionWrapper id="Introduction" className="py-12 desktop:py-24">
      {/* Desktop: 3-column bento grid */}
      <div className="hidden desktop:grid desktop:grid-cols-3 desktop:gap-4">
        {/* Col 1 — large wind card */}
        <ScrollFadeUp delay={0} distance={40} className="h-[560px]">
          <IntroCard
            imageSrc="/images/intro-foundations.jpg"
            imageAlt="Wind turbine foundation construction site"
            caption="Strong foundations for powerful wind projects."
            icon={<Sparkles size={18} />}
            className="h-full"
          />
        </ScrollFadeUp>

        {/* Col 2 — two stacked cards */}
        <div className="flex h-[560px] flex-col gap-4">
          <ScrollFadeUp delay={0.1} distance={40} className="flex-1 min-h-0">
            <IntroCard
              imageSrc="/images/intro-hybrid.jpg"
              imageAlt="Hybrid wind and solar energy installation"
              caption="Hybrid energy for peak performance."
              icon={<HeartPulse size={18} />}
              className="h-full"
            />
          </ScrollFadeUp>
          <ScrollFadeUp delay={0.2} distance={40} className="flex-1 min-h-0">
            <IntroCard
              caption="Designed for efficiency and dependable results."
              icon={<TrendingUp size={18} />}
              stat="25%"
              accent
              className="h-full"
            />
          </ScrollFadeUp>
        </div>

        {/* Col 3 — large solar card */}
        <ScrollFadeUp delay={0.3} distance={40} className="h-[560px]">
          <IntroCard
            imageSrc="/images/intro-solar.jpg"
            imageAlt="Solar panel installation project"
            caption="Efficient, reliable solar systems."
            icon={<Target size={18} />}
            className="h-full"
          />
        </ScrollFadeUp>
      </div>

      {/* Mobile / tablet: 2-col simple grid */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:hidden">
        <ScrollFadeUp delay={0} distance={40}>
          <IntroCard
            imageSrc="/images/intro-foundations.jpg"
            imageAlt="Wind turbine foundation construction site"
            caption="Strong foundations for powerful wind projects."
            icon={<Sparkles size={18} />}
            className="h-[280px]"
          />
        </ScrollFadeUp>
        <ScrollFadeUp delay={0.1} distance={40}>
          <IntroCard
            imageSrc="/images/intro-hybrid.jpg"
            imageAlt="Hybrid wind and solar energy installation"
            caption="Hybrid energy for peak performance."
            icon={<HeartPulse size={18} />}
            className="h-[280px]"
          />
        </ScrollFadeUp>
        <ScrollFadeUp delay={0.2} distance={40}>
          <IntroCard
            caption="Designed for efficiency and dependable results."
            icon={<TrendingUp size={18} />}
            stat="25%"
            accent
            className="h-[280px]"
          />
        </ScrollFadeUp>
        <ScrollFadeUp delay={0.3} distance={40}>
          <IntroCard
            imageSrc="/images/intro-solar.jpg"
            imageAlt="Solar panel installation project"
            caption="Efficient, reliable solar systems."
            icon={<Target size={18} />}
            className="h-[280px]"
          />
        </ScrollFadeUp>
      </div>
    </SectionWrapper>
  );
}
