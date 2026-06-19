import './globals.css';

import { MotionConfig } from 'framer-motion';
import type { Metadata } from 'next';
import {
  DM_Sans,
  Fragment_Mono,
  Geist,
  Host_Grotesk,
  Inter,
  Karma,
  Manrope,
} from 'next/font/google';

import PublicShell from '@/components/layout/PublicShell';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-host-grotesk',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const karma = Karma({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-karma',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-manrope',
  display: 'swap',
});

const fragmentMono = Fragment_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-fragment-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Balaji & Co',
  url: 'https://balaji-co.com',
  logo: 'https://balaji-co.com/images/logo-dark.png',
  description:
    'Balaji & Co delivers reliable wind and solar EPC solutions with strong engineering, quality construction, and proven multi-state project execution across India.',
  telephone: '+919876543210',
  email: 'hello@balaji-co.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '11/17, East Street, Shree Ranganarayanapuram, Therumanal',
    addressLocality: 'Tirunelveli',
    addressRegion: 'Tamil Nadu',
    postalCode: '627106',
    addressCountry: 'IN',
  },
  sameAs: ['https://x.com', 'https://www.linkedin.com', 'https://youtube.com'],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  themeColor: '#606c38',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://balaji-co.com'),
  title: {
    template: '%s | Balaji & Co',
    default: 'Balaji & Co — Wind & Solar EPC Contractors',
  },
  description:
    'Balaji & Co delivers reliable wind and solar EPC solutions with strong engineering, quality construction, and proven multi-state project execution across India.',
  openGraph: {
    type: 'website',
    siteName: 'Balaji & Co',
    images: [{ url: '/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontClasses = [
    dmSans.variable,
    hostGrotesk.variable,
    geist.variable,
    karma.variable,
    manrope.variable,
    fragmentMono.variable,
    inter.variable,
  ].join(' ');

  return (
    <html lang="en" className={fontClasses}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <MotionConfig reducedMotion="user">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-text focus:px-4 focus:py-3 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-primary"
          >
            Skip to content
          </a>
          <PublicShell>{children}</PublicShell>
        </MotionConfig>
      </body>
    </html>
  );
}
