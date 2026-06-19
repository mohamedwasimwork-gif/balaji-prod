'use client';

import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import { WORKFLOW_STEPS } from '@/lib/solutions';

export default function ProcessSection() {
  return (
    <section
      id="process-section"
      className="w-full py-12 desktop:py-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-20 desktop:gap-[80px] mobile:gap-[60px]">
          {/* Header — centered alignment */}
          <div className="flex flex-col items-center text-center gap-5 max-w-3xl mx-auto desktop:max-w-[35%]">
            <BlurInWords
              text="How We Deliver Every Project"
              as="h2"
              className="type-h2 text-text justify-center"
              stagger={0.05}
            />
            <ParagraphBlurIn className="type-body-lg text-text-muted opacity-80" delay={0.15}>
              A clear workflow that ensures safe execution, consistent quality, and reliable results
              for all wind and solar projects.
            </ParagraphBlurIn>
          </div>

          {/* 4-step row — dashed connector visible only on desktop */}
          <div className="relative">
            {/* Dashed horizontal divider behind step squares */}
            <div
              className="hidden desktop:block absolute top-[22px] left-0 right-0"
              style={{
                borderTop: '1px dashed rgba(0,0,0,0.2)',
                height: 0,
              }}
              aria-hidden="true"
            />

            <div className="grid gap-[100px_32px] desktop:grid-cols-4 tablet:grid-cols-2 tablet:gap-[80px_56px] mobile:grid-cols-1 mobile:gap-[30px_56px]">
              {WORKFLOW_STEPS.map((step, i) => {
                const num = String(i + 1).padStart(2, '0');
                return (
                  <ScrollFadeUp key={step.title} delay={i * 0.15} distance={20}>
                    <div className="flex flex-col gap-[30px] mobile:gap-5">
                      {/* Olive green 44x44 square with white number */}
                      <div
                        className="relative z-10 flex h-11 w-11 items-center justify-center rounded-md"
                        style={{ backgroundColor: '#606c38' }}
                      >
                        <span className="text-white font-medium" style={{ fontSize: 16 }}>
                          {num}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h3 className="type-h4 font-medium text-text">{step.title}</h3>
                        <p className="type-body-sm text-text-muted opacity-80">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </ScrollFadeUp>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
