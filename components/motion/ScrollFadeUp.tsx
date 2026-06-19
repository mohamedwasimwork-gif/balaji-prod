'use client';

import { motion, useInView } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';

interface ScrollFadeUpProps {
  children: ReactNode;
  /** Distance in px to travel (40, 100, or 200) */
  distance?: number;
  /** Whether to start opacity at 0 (false = start at 1, animate position only) */
  fadeOpacity?: boolean;
  className?: string;
  delay?: number;
}

/**
 * A7/A8/A9 — Scroll-triggered fade-up.
 * A7: opacity 0→1, y 40→0 (Introduction cards, Fact heading)
 * A8: opacity 1,   y 200→0 (About body text)
 * A9: opacity 1,   y 100→0 (CTA bottom images)
 */
export default function ScrollFadeUp({
  children,
  distance = 40,
  fadeOpacity = true,
  className = '',
  delay = 0,
}: ScrollFadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: fadeOpacity ? 0 : 1, y: distance }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}
