'use client';

import BlurInWords from '@/components/motion/BlurInWords';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';

const CARDS = [
  {
    title: 'Project Inquiries',
    email: 'support@balaji-co.com',
    description:
      'Considering your next renewable project with us? Contact us for detailed information about our solutions and financing options.',
  },
];

export default function ContactCardsSection() {
  return (
    <section
      id="contact-cards"
      className="w-full py-12 desktop:py-24"
    >
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-12">
          <BlurInWords
            text="Connect with us"
            as="h2"
            className="type-h2 text-text"
            stagger={0.05}
          />

          {/* Track the card count so a single card fills the row instead of
              leaving an empty second column. */}
          <ul
            className={`grid gap-6 mobile:grid-cols-1 list-none p-0 m-0 ${
              CARDS.length > 1 ? 'desktop:grid-cols-2' : 'desktop:grid-cols-1'
            }`}
          >
            {CARDS.map((card, i) => (
              <ScrollFadeUp key={card.title} delay={i * 0.12} distance={40}>
                <li
                  className="rounded-md p-8 desktop:p-10 flex flex-col gap-4 h-full"
                  style={{
                    backgroundColor: 'rgb(240, 240, 240)',
                    borderTop: '8px solid #606c38',
                  }}
                >
                  <h3 className="font-karma font-medium text-text text-[24px] leading-[1.3em] tracking-[-0.03em]">
                    {card.title}
                  </h3>
                  <a
                    href={`mailto:${card.email}`}
                    className="font-inter text-text text-[15px] underline underline-offset-4 hover:opacity-70 transition-opacity w-fit"
                  >
                    {card.email}
                  </a>
                  <p className="font-inter text-text-muted text-[15px] leading-[1.6em] opacity-80">
                    {card.description}
                  </p>
                </li>
              </ScrollFadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
