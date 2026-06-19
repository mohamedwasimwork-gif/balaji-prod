'use client';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import Button from '@/components/ui/Button';

function DashedCross({ className = '' }: { className?: string }) {
  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Horizontal bar rectangle */}
      <rect
        x="1"
        y="61"
        width="178"
        height="58"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        strokeDasharray="6 5"
        fill="none"
      />
      {/* Vertical bar rectangle */}
      <rect
        x="61"
        y="1"
        width="58"
        height="178"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        strokeDasharray="6 5"
        fill="none"
      />
    </svg>
  );
}

function DashedRect({ className = '' }: { className?: string }) {
  return (
    <svg
      width="140"
      height="100"
      viewBox="0 0 140 100"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="138"
        height="98"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1"
        strokeDasharray="6 5"
        fill="none"
      />
    </svg>
  );
}

export default function BuildCtaSection() {
  return (
    <section
      id="build-cta"
      className="relative w-full overflow-hidden py-12 desktop:py-24"
      style={{ backgroundColor: '#4a5c2a' }}
    >
      {/* Corner decorations */}
      {/* Top-left cross */}
      <div className="absolute -top-6 -left-6 pointer-events-none">
        <DashedCross />
      </div>
      {/* Top-right rect */}
      <div className="absolute -top-4 -right-4 pointer-events-none">
        <DashedRect />
      </div>
      {/* Bottom-right cross */}
      <div className="absolute -bottom-6 -right-6 pointer-events-none">
        <DashedCross />
      </div>
      {/* Bottom-right secondary rect offset */}
      <div className="absolute bottom-8 right-24 pointer-events-none">
        <DashedRect />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <BlurInWords
            text="Build Your Renewable Energy Project"
            as="h2"
            className="type-h2 desktop:type-hero text-white max-w-3xl justify-center"
            stagger={0.04}
            duration={0.7}
          />
          <ScrollFadeUp delay={0.2}>
            <p className="type-body-lg text-white/75 max-w-lg">
              Partner with us for reliable wind and solar execution backed by strong engineering and
              experience.
            </p>
          </ScrollFadeUp>
          <ScrollFadeUp delay={0.35}>
            <div className="flex flex-wrap items-center justify-center gap-3 desktop:gap-4 pt-2">
              <Button variant="primary-white" href="/contact">
                Contact Us
              </Button>
              <Button variant="alternate" href="/solutions">
                Explore Solutions
              </Button>
            </div>
          </ScrollFadeUp>
        </div>
      </div>
    </section>
  );
}
