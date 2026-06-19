'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import type { NavLink } from '@/lib/nav';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

/** A17 — full-screen drawer slides in from right; body scroll lock, focus trap, Esc + swipe close */
export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  /* Body scroll lock */
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  /* Esc key + remember trigger for focus restoration */
  useEffect(() => {
    if (!isOpen) return;
    triggerRef.current = document.activeElement as HTMLElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      triggerRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  /* Focus first link when drawer opens */
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      const first = drawerRef.current?.querySelector<HTMLElement>('a, button');
      first?.focus();
    }, 250);
    return () => clearTimeout(t);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer — slides from right, supports swipe-to-close */}
          <motion.nav
            ref={drawerRef}
            id="mobile-menu"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[320px] flex-col bg-white shadow-2xl"
            style={{
              paddingTop: 'max(env(safe-area-inset-top), 16px)',
              paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
              paddingLeft: '20px',
              paddingRight: 'max(env(safe-area-inset-right), 20px)',
              overscrollBehavior: 'contain',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80 || info.velocity.x > 400) onClose();
            }}
            aria-label="Mobile navigation"
            role="dialog"
            aria-modal="true"
          >
            {/* Close button — 44x44 hit area */}
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={onClose}
                className="h-11 w-11 flex items-center justify-center text-text hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <ul className="flex flex-col gap-2 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center min-h-[48px] rounded-lg px-4 py-3 type-body-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive
                          ? 'text-white'
                          : 'text-text hover:bg-bg-soft hover:text-primary'
                      }`}
                      style={isActive ? { backgroundColor: '#606c38' } : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
