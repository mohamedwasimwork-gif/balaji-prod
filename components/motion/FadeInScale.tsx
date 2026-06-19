'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface FadeInScaleProps {
  children: ReactNode;
  /** Target opacity (0.7 for gradients, 1 for images/content) */
  targetOpacity?: number;
  className?: string;
}

/** A1/A2 — opacity 0.001→targetOpacity, scale 1.07→1, dur 1.6s, ease [0.44,0,0.56,1] */
export default function FadeInScale({
  children,
  targetOpacity = 1,
  className = '',
}: FadeInScaleProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.001, scale: 1.07 }}
      animate={{ opacity: targetOpacity, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.44, 0, 0.56, 1] }}
    >
      {children}
    </motion.div>
  );
}
