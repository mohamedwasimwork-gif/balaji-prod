'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';
import Button from '@/components/ui/Button';

function DashedGrid({ className = '' }: { className?: string }) {
  return (
    <svg
      width="280"
      height="200"
      viewBox="0 0 280 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="160"
        height="100"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        strokeDasharray="6 5"
        fill="none"
      />
      <rect
        x="80"
        y="50"
        width="160"
        height="100"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        strokeDasharray="6 5"
        fill="none"
      />
      <rect
        x="160"
        y="100"
        width="120"
        height="80"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
        strokeDasharray="6 5"
        fill="none"
      />
    </svg>
  );
}

export default function FinalCtaSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(imageRef, { once: true, margin: '-100px' });

  return (
    <section
      id="cta"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#606c38' }}
      aria-label="Build Your Renewable Energy Project"
    >
      {/* Top-left dashed grid decoration */}
      <div className="absolute -top-6 -left-6 pointer-events-none z-0">
        <DashedGrid />
      </div>

      {/* Bottom-right dashed grid decoration */}
      <div className="absolute -bottom-6 -right-6 pointer-events-none z-0">
        <DashedGrid className="rotate-180" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-container px-4 desktop:px-8 pt-24 desktop:pt-28">
        <div className="grid gap-12 desktop:grid-cols-2 desktop:gap-16">
          {/* LEFT column — empty top, image at bottom */}
          <div className="flex flex-col justify-end order-2 desktop:order-1 desktop:pt-24">
            <motion.div
              ref={imageRef}
              className="relative w-full"
              initial={{ y: 100, opacity: 0.001 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full aspect-[4/3] desktop:aspect-[1.346] overflow-hidden rounded-md">
                <Image
                  src="https://framerusercontent.com/images/FtoWOGjx9SGmu6mwrre7CXFsTL8.webp"
                  alt="Solar panel installation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1199px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>

          {/* RIGHT column — content at top */}
          <div className="flex flex-col gap-6 order-1 desktop:order-2 desktop:pb-20">
            <ScrollFadeUp>
              <BarLabel variant="light">Contact Us</BarLabel>
            </ScrollFadeUp>

            <BlurInWords
              text="Build Your Renewable Energy Project"
              as="h2"
              className="type-h2 text-white"
              stagger={0.05}
              duration={0.8}
            />

            <ScrollFadeUp delay={0.2}>
              <p className="font-inter text-white/85 text-[15px] leading-[1.6em] max-w-xl">
                Partner with us for reliable wind and solar execution backed by strong engineering
                and experience.
              </p>
            </ScrollFadeUp>

            <ScrollFadeUp delay={0.35}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button variant="primary-white" href="/contact">
                  Contact Us
                </Button>
                <Button variant="alternate" href="/#about">
                  Learn About Us
                </Button>
              </div>
            </ScrollFadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
