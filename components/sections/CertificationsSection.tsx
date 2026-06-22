'use client';

import { Award, HeartPulse, Leaf, ShieldCheck, Check } from 'lucide-react';

import BlurInWords from '@/components/motion/BlurInWords';
import ParagraphBlurIn from '@/components/motion/ParagraphBlurIn';
import ScrollFadeUp from '@/components/motion/ScrollFadeUp';
import SectionWrapper from '@/components/ui/SectionWrapper';

const CERTIFICATIONS = [
  {
    code: 'ISO 9001:2015',
    title: 'Quality Management System (QMS)',
    description: 'Ensuring excellence in engineering, quality control, and continuous process optimization.',
    icon: ShieldCheck,
  },
  {
    code: 'ISO 14001:2015',
    title: 'Environmental Management (EMS)',
    description: 'Minimizing environmental footprint through sustainable methods and resource efficiency.',
    icon: Leaf,
  },
  {
    code: 'ISO 45001:2018',
    title: 'Occupational Health & Safety (OHSMS)',
    description: 'Maintaining a strict safe work culture with zero-harm goals across all project locations.',
    icon: HeartPulse,
  },
];

const COMPLIANCE_AREAS = [
  'Quality Assurance & Continuous Improvement',
  'Environmental Management & Sustainability',
  'Occupational Health & Workplace Safety',
  'Regulatory & Statutory Compliance',
  'Risk Management & Operational Excellence',
];

export default function CertificationsSection() {
  return (
    <SectionWrapper id="certifications-section" className="py-12 desktop:py-24 bg-bg-soft">
      <div className="mx-auto w-full max-w-container px-4 desktop:px-8">
        <div className="flex flex-col gap-12 desktop:gap-16">
          
          {/* Header */}
          <div className="flex flex-col gap-5 max-w-3xl">
            <ScrollFadeUp>
              <span className="flex items-center gap-2 type-label text-text-muted">
                <span aria-hidden="true">—</span>
                Compliance & Quality
              </span>
            </ScrollFadeUp>
            <BlurInWords
              text="ISO Certified Civil Engineering"
              as="h2"
              className="type-h2 text-text"
              stagger={0.04}
            />
            <ParagraphBlurIn className="type-body-lg text-text-muted opacity-80" delay={0.15}>
              BALAJI & CO is an ISO-certified civil engineering and construction company based in
              Tirunelveli, Tamil Nadu, India. These certifications demonstrate our commitment to
              delivering high-quality construction services while maintaining environmental responsibility,
              workplace safety, and internationally recognized management standards.
            </ParagraphBlurIn>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-1 tablet:grid-cols-3">
            {CERTIFICATIONS.map((cert, i) => {
              const Icon = cert.icon;
              return (
                <ScrollFadeUp key={cert.code} delay={i * 0.12} distance={30}>
                  <div className="group relative flex flex-col gap-5 bg-white border border-black/10 rounded-2xl p-6 desktop:p-8 hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-[#606c38] transition-colors duration-300 group-hover:bg-[#606c38] group-hover:text-white" style={{ backgroundColor: 'rgba(96, 108, 56, 0.1)' }}>
                      <Icon size={24} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-manrope text-sm font-semibold tracking-wider text-[#606c38] uppercase">
                        {cert.code}
                      </span>
                      <h3 className="type-h4 font-medium text-text group-hover:text-[#606c38] transition-colors duration-300">
                        {cert.title}
                      </h3>
                      <p className="type-body-sm text-text-muted opacity-90 leading-relaxed mt-1">
                        {cert.description}
                      </p>
                    </div>
                  </div>
                </ScrollFadeUp>
              );
            })}
          </div>

          {/* Bottom Split Section */}
          <div className="grid gap-8 desktop:grid-cols-12 desktop:items-stretch">
            {/* Scope & Authority Details (Left Column) */}
            <ScrollFadeUp className="desktop:col-span-5 flex flex-col justify-between bg-[#606c38] text-white p-8 rounded-2xl gap-8 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                    <Award size={20} />
                  </div>
                  <span className="font-inter font-semibold uppercase tracking-wider text-xs text-white/80">
                    Accreditation Scope
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-white/60 text-xs uppercase tracking-wider font-medium">
                    Certified Scope
                  </span>
                  <p className="font-manrope text-lg font-semibold leading-snug">
                    Civil Engineering Services / Civil Construction Services
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-white/60 text-xs uppercase tracking-wider font-medium">
                    Certifying Authority
                  </span>
                  <p className="font-manrope text-lg font-semibold leading-snug">
                    Breakthrough Management Quality Registrar (BMQR)
                  </p>
                </div>
              </div>
              <p className="text-white/70 text-xs leading-relaxed border-t border-white/10 pt-4">
                These credentials verify compliance with global management systems, managed and audited independently.
              </p>
            </ScrollFadeUp>

            {/* Compliance Areas Checklist (Right Column) */}
            <ScrollFadeUp className="desktop:col-span-7 flex flex-col justify-center bg-white border border-black/10 rounded-2xl p-8 gap-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="font-manrope text-xs font-semibold tracking-wider text-[#606c38] uppercase">
                  Continuous Improvement
                </span>
                <h3 className="type-h3 font-medium text-text">
                  Key Compliance Areas
                </h3>
              </div>
              
              <ul className="flex flex-col gap-4 list-none p-0 m-0">
                {COMPLIANCE_AREAS.map((area, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#606c38]/10 text-[#606c38] mt-0.5">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="font-inter text-text text-[15px] leading-relaxed font-medium">
                      {area}
                    </span>
                  </li>
                ))}
              </ul>
            </ScrollFadeUp>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
