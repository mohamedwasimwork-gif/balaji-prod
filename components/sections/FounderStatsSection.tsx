'use client';

import Image from 'next/image';

import BlurInWords from '@/components/motion/BlurInWords';
import FadeInScale from '@/components/motion/FadeInScale';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';

export default function FounderStatsSection() {
  return (
    <section id="founder-stats" className="w-full py-12 desktop:py-24">
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col desktop:flex-row gap-[70px] desktop:gap-[100px] items-center">
          {/* Left: founder image with dashed border overlay + stat boxes */}
          <div className="relative w-full desktop:flex-1 desktop:max-w-[518px]">
            {/* 20%-black offset rectangle behind */}
            <div
              className="absolute -top-4 -left-4 right-4 bottom-4 desktop:-bottom-8 desktop:-right-8"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 1 }}
              aria-hidden="true"
            />

            {/* Founder image with Ken Burns scale-in */}
            <ScrollFadeUp distance={40} className="relative">
              <div className="relative w-full aspect-[0.822] overflow-hidden" style={{ zIndex: 2 }}>
                <FadeInScale className="absolute inset-0">
                  <Image
                    src="https://framerusercontent.com/images/shn0Pai8ytDvo0JvLIJCUOY.webp"
                    alt="Wind and solar project collage"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1199px) 100vw, 50vw"
                  />
                </FadeInScale>

                {/* 2.5px white dashed border container with stat boxes inside */}
                <div
                  className="absolute inset-6 desktop:inset-10 flex flex-col items-center justify-center gap-6"
                  style={{ border: '2.5px dashed rgb(255,255,255)', padding: '24px' }}
                >
                  {/* Stat 1: 65% */}
                  <div
                    className="flex flex-col items-center text-center rounded-md p-6 desktop:p-[30px] min-w-[140px] mobile:p-5 mobile:min-w-[120px]"
                    style={{ zIndex: 3, backgroundColor: 'rgb(240, 240, 240)' }}
                  >
                    <span className="type-h2 font-medium text-text leading-none">65%</span>
                    <span className="type-body-sm text-text-muted opacity-80 mt-2">
                      Reduction in Electricity Costs
                    </span>
                  </div>
                  {/* Stat 2: 90% */}
                  <div
                    className="flex flex-col items-center text-center rounded-md p-6 desktop:p-[30px] min-w-[140px] mobile:p-5 mobile:min-w-[120px]"
                    style={{ zIndex: 3, backgroundColor: 'rgb(240, 240, 240)' }}
                  >
                    <span className="type-h2 font-medium text-text leading-none">90%</span>
                    <span className="type-body-sm text-text-muted opacity-80 mt-2">
                      Energy Independence Achieved
                    </span>
                  </div>
                </div>
              </div>
            </ScrollFadeUp>
          </div>

          {/* Right: founder note */}
          <div className="flex flex-col gap-5 desktop:flex-1">
            <ScrollFadeUp>
              <BarLabel>Founder&apos;s Note</BarLabel>
            </ScrollFadeUp>

            <BlurInWords
              text="We are committed to delivering reliable renewable projects with trust and integrity."
              as="p"
              className="font-karma text-text font-medium text-[24px] leading-[1.3em] tracking-[-0.03em] desktop:text-[28px]"
              stagger={0.04}
            />

            <ParagraphBlurIn
              className="font-inter text-text-muted text-[15px] leading-[1.6em] opacity-80"
              delay={0.2}
            >
              Our focus has always been strong engineering, timely execution, and long-term value
              creation for every client we serve across the renewable energy sector.
            </ParagraphBlurIn>

            <ScrollFadeUp delay={0.3}>
              <div className="flex items-center gap-4 pt-4">
                <div className="relative h-[52px] w-[52px] mobile:h-10 mobile:w-10 overflow-hidden rounded-full flex-shrink-0">
                  <Image
                    src="https://framerusercontent.com/images/btHCzx2hdyQWWxyPoY0KpkOuEQ.jpg"
                    alt="Balaji portrait"
                    fill
                    className="object-cover"
                    sizes="52px"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="font-inter font-semibold text-text text-[16px] leading-tight">
                    Balakrishnan P
                  </span>
                  <span className="font-inter text-text-muted text-[14px] leading-tight opacity-80">
                    Founder &amp; MD of Balaji Groups
                  </span>
                </div>
              </div>
            </ScrollFadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
