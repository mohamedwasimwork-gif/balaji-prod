'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from './Navigation';
import Footer from './Footer';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Lock scrolling while loading
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  // If the path starts with /admin-login, it's the dashboard SPA.
  // Also skip Navigation and Footer if we are on the root / and want full-screen maintenance mode.
  const isDashboard = pathname?.startsWith('/admin-login');
  const isRoot = pathname === '/';

  if (isDashboard || isRoot) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          >
            <motion.div
              layoutId="main-logo"
              transition={{
                type: 'spring',
                stiffness: 75,
                damping: 18,
              }}
            >
              <Image
                src="/animation.png"
                alt="Balaji & Co logo"
                width={200}
                height={60}
                className="h-12 w-auto object-contain desktop:h-16"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navigation showLogo={!isLoading} />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
