import type { Metadata } from 'next';

import BuildCtaSection from '@/components/sections/BuildCtaSection';
import ContactCardsSection from '@/components/sections/ContactCardsSection';
import ContactHeroSection from '@/components/sections/ContactHeroSection';
import FaqSection from '@/components/sections/FaqSection';

export const metadata: Metadata = {
  title: 'Contact Balaji & Co',
  description:
    'Get in touch for wind and solar project inquiries, proposals, partnerships, or execution support across India.',
};

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactCardsSection />
      <FaqSection />
      <BuildCtaSection />
    </>
  );
}
