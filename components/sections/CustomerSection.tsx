import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import PillLabel from '@/components/ui/PillLabel';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { SOLAR_SOLUTION,WIND_SOLUTION } from '@/lib/solutions';

export default function CustomerSection() {
  const solutions = [WIND_SOLUTION, SOLAR_SOLUTION];

  return (
    <SectionWrapper id="customer-section" className="py-24 desktop:py-32">
      <div className="flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <ScrollFadeUp>
            <PillLabel>Our Solutions</PillLabel>
          </ScrollFadeUp>
          <BlurInWords
            text="We deliver complete engineering, civil, and electrical execution for utility-scale renewable projects."
            as="h2"
            className="type-h2 text-text max-w-2xl"
            stagger={0.05}
          />
        </div>

        {/* Solution panels */}
        <div className="grid gap-6 tablet:grid-cols-2">
          {solutions.map((sol, i) => (
            <ScrollFadeUp key={sol.title} delay={i * 0.15}>
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-bg-soft p-8">
                <h3 className="type-h3 font-medium text-text">{sol.title}</h3>
                <ul className="flex flex-col gap-3">
                  {sol.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      <span className="type-body text-text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollFadeUp>
          ))}
        </div>

        {/* Founder's note */}
        <ScrollFadeUp delay={0.2}>
          <blockquote className="rounded-2xl border border-border bg-white p-8 desktop:p-10">
            <p className="type-body-lg text-text-muted italic mb-6">
              &ldquo;We are committed to delivering reliable renewable projects with trust and
              integrity. Our focus has always been strong engineering, timely execution, and
              long-term value creation for every client we serve across the renewable energy
              sector.&rdquo;
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="type-label font-semibold text-primary">B</span>
              </div>
              <div>
                <p className="type-body-sm font-semibold text-text">Balaji</p>
                <p className="type-label text-text-muted">Founder &amp; Director</p>
              </div>
            </footer>
          </blockquote>
        </ScrollFadeUp>
      </div>
    </SectionWrapper>
  );
}
