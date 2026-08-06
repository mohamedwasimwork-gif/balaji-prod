'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import MobileMenu from '@/components/layout/MobileMenu';
import { NAV_LINKS } from '@/lib/nav';

/* Routes where the hero has a DARK background (logo + links start white) */
const DARK_HERO_ROUTES: string[] = ['/'];

interface NavigationProps {
  showLogo?: boolean;
}

export default function Navigation({ showLogo = true }: NavigationProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const heroIsDark = DARK_HERO_ROUTES.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Once mobile menu opens, force solid-white nav so the logo stays visible against any backdrop */
  const useLightText = !scrolled && heroIsDark && !menuOpen;

  const linkColor = useLightText
    ? 'text-white hover:text-white/70'
    : 'text-text hover:text-primary';
  const hamburgerColor = useLightText ? 'bg-white' : 'bg-text';

  const bgClass =
    scrolled || menuOpen
      ? 'bg-white/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]'
      : 'bg-transparent';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${bgClass}`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <nav
          className="flex w-full items-center justify-between px-4 py-3 desktop:px-10 desktop:py-4"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Balaji Group of Companies — home"
            className="flex-shrink-0 -m-2 p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm min-w-[140px] min-h-[36px] flex items-center"
          >
            {showLogo && (
              <motion.div
                layoutId="main-logo"
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 18,
                }}
                className="flex items-center gap-2.5"
              >
                {/* The old logo.png had the company name baked into the artwork,
                    so the emblem and the name are split: the mark stays an image
                    and the name is real text that can be edited and translated.
                    alt is empty because the adjacent text already names the brand. */}
                <Image
                  src="/logo-mark.png"
                  alt=""
                  width={512}
                  height={512}
                  className={`h-8 w-8 flex-shrink-0 object-contain desktop:h-9 desktop:w-9 transition-all duration-300 ${
                    useLightText ? 'brightness-0 invert' : ''
                  }`}
                  priority
                />
                <span
                  className={`font-karma font-medium whitespace-nowrap text-[15px] leading-none tracking-[-0.02em] transition-colors duration-300 desktop:text-[20px] ${
                    useLightText ? 'text-white' : 'text-text'
                  }`}
                >
                  Balaji Group of Companies
                </span>
              </motion.div>
            )}
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 tablet:flex desktop:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`type-body-sm font-medium transition-colors duration-150 ${linkColor} ${
                      isActive ? 'opacity-100 underline underline-offset-4' : 'opacity-80'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Hamburger — mobile only, 44x44 hit area */}
          <button
            type="button"
            className="hidden mobile:flex flex-col items-center justify-center gap-[5px] h-11 w-11 -mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block h-0.5 w-6 ${hamburgerColor}`} />
            <span className={`block h-0.5 w-6 ${hamburgerColor}`} />
            <span className={`block h-0.5 w-6 ${hamburgerColor}`} />
          </button>
        </nav>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </>
  );
}
