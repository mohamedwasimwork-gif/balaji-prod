'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // If the path starts with /admin-login, it's the dashboard SPA.
  // We want to skip the marketing Navigation and Footer entirely.
  const isDashboard = pathname?.startsWith('/admin-login');

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
