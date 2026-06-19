'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInUpDelayedProps {
  children: ReactNode;
  className?: string;
}

/** A3 — opacity 0.001→1, delay 1.4s, dur 2.2s, ease [0.25,0.02,0.26,1.01] */
export default function FadeInUpDelayed({ children, className = '' }: FadeInUpDelayedProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.001 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.2, delay: 1.4, ease: [0.25, 0.02, 0.26, 1.01] }}
    >
      {children}
    </motion.div>
  );
}
