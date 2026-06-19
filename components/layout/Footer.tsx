import Link from 'next/link';

import LinkedInIcon from '@/components/icons/LinkedInIcon';
import XIcon from '@/components/icons/XIcon';
import YouTubeIcon from '@/components/icons/YouTubeIcon';

const CONTACT = {
  email: 'hello@balaji-co.com',
  phone: '+91 9876543210',
  address: '11/17, East Street, Shree Ranganarayanapuram, Therumanal, Tirunelveli, Tamil Nadu, 627106, India',
};

/* Footer-specific link order — matches reference */
const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Contact', href: '/contact' },
  { label: 'Projects', href: '/projects' },
];

const SOCIALS = [
  { href: 'https://x.com', label: 'X (formerly Twitter)', Icon: XIcon },
  { href: 'https://www.linkedin.com', label: 'LinkedIn', Icon: LinkedInIcon },
  { href: 'https://youtube.com', label: 'YouTube', Icon: YouTubeIcon },
];

export default function Footer() {
  return (
    <footer
      aria-label="Site footer"
      className="bg-bg-soft"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-container px-4 py-12 tablet:px-6 tablet:py-16 desktop:px-8 desktop:py-20">
        {/* 3-column grid */}
        <div className="grid grid-cols-1 gap-12 tablet:grid-cols-2 desktop:grid-cols-3 desktop:gap-16">
          {/* Col 1 — brand + description */}
          <div className="flex flex-col gap-5">
            <Link
              href="/"
              className="type-h3 font-medium text-text hover:opacity-80 transition-opacity w-fit"
            >
              Balaji &amp; Co.
            </Link>
            <p className="font-inter text-text-muted text-[15px] leading-[1.6em] max-w-sm">
              Balaji &amp; Co delivers reliable wind and solar infrastructure with strong
              engineering, multi-state execution experience, and end-to-end project support for
              large renewable developments.
            </p>
          </div>

          {/* Col 2 — nav links */}
          <div className="flex flex-col gap-4 desktop:pt-1">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-inter text-text hover:text-text-muted transition-colors duration-150 w-fit text-[15px]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — address + email + phone + socials */}
          <div className="flex flex-col gap-4">
            <p className="font-inter text-text-muted text-[15px] leading-[1.6em]">
              {CONTACT.address}
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="font-inter text-text text-[15px] underline underline-offset-4 hover:text-text-muted transition-colors duration-150 w-fit"
            >
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
              className="font-inter text-text text-[15px] underline underline-offset-4 hover:text-text-muted transition-colors duration-150 w-fit"
            >
              {CONTACT.phone}
            </a>

            {/* Social icons — dark rounded squares */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-text text-white hover:opacity-80 transition-opacity duration-150"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 desktop:mt-20 flex flex-col gap-2 tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="font-inter text-text-muted text-[14px]">
            Balaji &amp; Co. &copy; All rights reserved 2025
          </p>
          <a
            href="https://zerocodes.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter text-text-muted text-[14px] underline underline-offset-4 hover:text-text transition-colors duration-150 w-fit"
          >
            Made with{' '}
            <span role="img" aria-label="love">
              ❤️
            </span>{' '}
            by Zerocodes.io
          </a>
        </div>
      </div>
    </footer>
  );
}
