'use client';

import { motion, useInView } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';

interface ScrollSpringInProps {
  children: ReactNode;
  /** Initial y offset in px (A4: scale, A5: y -80) */
  yOffset?: number;
  initialScale?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  delay?: number;
  className?: string;
  triggerOnMount?: boolean;
}

/**
 * A4/A5 — Spring enter animation.
 * A4 (About bg): scale 1.05→1, spring damping:36, mass:4, stiffness:120
 * A5 (Nav): y -80→0, spring damping:30, mass:1, stiffness:160
 */
export default function ScrollSpringIn({
  children,
  yOffset = 0,
  initialScale = 1,
  stiffness = 160,
  damping = 30,
  mass = 1,
  delay = 0,
  className = '',
  triggerOnMount = false,
}: ScrollSpringInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const shouldAnimate = triggerOnMount || inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: yOffset, scale: initialScale }}
      animate={shouldAnimate ? { y: 0, scale: 1 } : {}}
      transition={{ type: 'spring', stiffness, damping, mass, delay }}
    >
      {children}
    </motion.div>
  );
}
