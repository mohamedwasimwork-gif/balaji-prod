'use client';

import { Building2, Compass, Sun } from 'lucide-react';

import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import BarLabel from '@/components/ui/BarLabel';
import SectionWrapper from '@/components/ui/SectionWrapper';

const COMPANIES = [
  {
    id: 'civil-contractors',
    title: 'Balaji & Co',
    description:
      'Our signature founding division specializing in high-complexity heavy civil engineering, wind turbine generator (WTG) foundations, crane platform development, internal site access roads, and comprehensive land preparation for utility-scale green projects.',
    icon: <Building2 size={24} strokeWidth={1.75} />,
  },
  {
    id: 'renewable-energy',
    title: 'Balaji Wind Energy Pvt.LTD',
    description:
      'The dedicated wind project execution arm of the group, focused on complete turnkey wind energy EPC installations, grid synchronization, transmission line setups, and structural engineering compliance for modern multi-megawatt turbine installations.',
    icon: <Sun size={24} strokeWidth={1.75} />,
  },
  {
    id: 'green-infrastructures',
    title: 'Balaji Agencies',
    description:
      'Providing crucial auxiliary and support functions including land coordination and statutory liaisoning, machinery and equipment leasing, raw materials logistics management, and securing approvals from state and central electricity boards.',
    icon: <Compass size={24} strokeWidth={1.75} />,
  },
];

export default function CompaniesSection() {
  return (
    <SectionWrapper id="our-companies" className="py-12 desktop:py-24 bg-bg-soft">
      <div className="flex flex-col gap-14 desktop:gap-[70px]">
        {/* Header */}
        <div className="flex flex-col gap-5 max-w-[55%] mobile:max-w-full">
          <ScrollFadeUp>
            <BarLabel>Our Companies</BarLabel>
          </ScrollFadeUp>
          <BlurInWords
            text="The Balaji Group of Companies"
            as="h2"
            className="type-h2 text-text"
            stagger={0.05}
          />
          <ParagraphBlurIn className="type-body-lg text-text-muted opacity-80" delay={0.15}>
            Our specialized business divisions collaborate seamlessly to deliver reliable civil,
            electrical, and logistical solutions for utility-scale green energy developments.
          </ParagraphBlurIn>
        </div>

        {/* 3 Companies Grid */}
        <div className="grid gap-[40px_30px] tablet:grid-cols-3 desktop:grid-cols-3 mobile:gap-y-[30px]">
          {COMPANIES.map((company, i) => (
            <ScrollFadeUp key={company.id} delay={i * 0.15} distance={30}>
              <div className="bg-white border border-black/10 rounded-xl p-6 desktop:p-8 flex flex-col gap-6 h-full shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-[#606c38]"
                  style={{ backgroundColor: 'rgba(96, 108, 56, 0.1)' }}
                >
                  {company.icon}
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="type-h4 font-medium text-text">{company.title}</h3>
                  <p className="type-body-sm text-text-muted opacity-90 leading-relaxed">
                    {company.description}
                  </p>
                </div>
              </div>
            </ScrollFadeUp>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
