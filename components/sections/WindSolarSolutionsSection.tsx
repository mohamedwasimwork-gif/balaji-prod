'use client';

import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';

const SOLUTIONS = [
  {
    title: 'Wind Solutions',
    description:
      'Complete wind project development with strong foundations, electrical systems, and site execution.',
    items: [
      'Precision-engineered WTG foundations',
      'Heavy-duty crane pad construction',
      'HT line and DP yard works',
    ],
  },
  {
    title: 'Solar Solutions',
    description:
      'Quality solar installations delivering efficient generation and long-term project reliability.',
    items: [
      'Ground-mount structure installation',
      'DC and AC electrical works',
      'Inverter, SCADA, and monitoring setup',
    ],
  },
];

/* Exact checkmark SVG path from framer reference */
function CheckmarkIcon() {
  return (
    <svg
      width="14"
      height="11"
      viewBox="0 0 30 30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 21.742 1.503 L 7.663 15.582 C 7.498 15.748 7.274 15.84 7.04 15.84 C 6.807 15.84 6.583 15.748 6.418 15.582 L 0.258 9.423 C -0.086 9.079 -0.086 8.521 0.258 8.178 C 0.602 7.834 1.159 7.834 1.503 8.178 L 7.04 13.716 L 20.497 0.258 C 20.841 -0.086 21.398 -0.086 21.742 0.258 C 22.086 0.602 22.086 1.159 21.742 1.503 Z"
        fill="rgb(0, 0, 0)"
        transform="translate(3.5 7.08)"
      />
    </svg>
  );
}

export default function WindSolarSolutionsSection() {
  return (
    <section id="wind-solar-solutions" className="w-full py-12 desktop:py-24">
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-14 desktop:gap-[70px]">
          {/* Header */}
          <div className="flex flex-col gap-5 max-w-[55%] mobile:max-w-full">
            <ScrollFadeUp>
              <BarLabel>Core Services</BarLabel>
            </ScrollFadeUp>
            <BlurInWords
              text="Building Reliable Wind and Solar Infrastructure"
              as="h2"
              className="type-h2 text-text"
              stagger={0.05}
            />
            <ParagraphBlurIn className="type-body-lg text-text-muted opacity-80" delay={0.15}>
              End-to-end solutions for safe, strong, and efficient renewable energy projects.
            </ParagraphBlurIn>
          </div>

          {/* Two solution cards — 2x1 grid (stacked on mobile) */}
          <div className="grid gap-[100px_56px] desktop:grid-cols-2 tablet:gap-[60px_56px] mobile:gap-y-[60px]">
            {SOLUTIONS.map((sol, i) => (
              <ScrollFadeUp key={sol.title} delay={i * 0.15} distance={40}>
                <div className="flex flex-col gap-6 h-full">
                  {/* Title with bottom solid border */}
                  <div className="pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.2)' }}>
                    <h3 className="type-h3 font-medium text-text">{sol.title}</h3>
                  </div>

                  <p className="type-body text-text-muted opacity-80">{sol.description}</p>

                  <ul className="flex flex-col gap-4 pt-2">
                    {sol.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-4"
                        style={{ opacity: 0.9 }}
                      >
                        <span
                          className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: 'rgb(240, 240, 240)' }}
                        >
                          <CheckmarkIcon />
                        </span>
                        <span className="type-body text-text">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollFadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
