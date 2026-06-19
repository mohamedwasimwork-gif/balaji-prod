'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';

export default function AboutSection() {
  return (
    <section
      id="about-section"
      className="relative flex min-h-[70vh] desktop:min-h-[90vh] flex-col justify-between overflow-hidden gap-12 py-16 desktop:gap-0 desktop:py-20"
      aria-label="About Us"
    >
      {/* Background image */}
      <FadeInScale className="absolute inset-0 z-0">
        <Image
          src="/images/about-factory.jpg"
          alt="Wind turbines and solar panels at sunset"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </FadeInScale>

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Top-left — eyebrow + heading */}
      <div className="relative z-20 mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-5 max-w-2xl">
          <ScrollFadeUp>
            <span className="flex items-center gap-2 type-label text-white/70">
              <span aria-hidden="true">—</span>
              About Us
            </span>
          </ScrollFadeUp>

          <BlurInWords
            text="Proven expertise powering large wind and solar developments."
            as="h2"
            className="type-h2 text-white"
            stagger={0.05}
            duration={0.8}
          />
        </div>
      </div>

      {/* Bottom-right — olive content card */}
      <div className="relative z-20 mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex justify-end">
          <ScrollFadeUp delay={0.2} className="w-full desktop:max-w-[52%]">
            <div className="bg-[#606c38] p-6 desktop:p-10 flex flex-col gap-5 desktop:gap-6">
              <p className="type-body text-white/90 leading-relaxed">
                Balaji &amp; Co has been operating as civil contractors since 2005, with strong
                expertise in Wind Turbine Generator (WTG) construction across India. We have
                successfully delivered complex wind projects, building a solid track record in the
                renewable energy sector.
              </p>
              <p className="type-body text-white/90 leading-relaxed">
                Today, we offer end-to-end services including land acquisition, approvals,
                foundations, power evacuation, 33kV lines, bay extensions, and pathway development.
                In 2021, we expanded into solar power projects, strengthening our position as a
                complete renewable energy service provider.
              </p>
            </div>
          </ScrollFadeUp>
        </div>
      </div>
    </section>
  );
}
