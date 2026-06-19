'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface HoverImageZoomProps {
  children: ReactNode;
  className?: string;
}

/** A15 — scale 1→1.05 on hover, 400ms ease-out (wraps the image element) */
export default function HoverImageZoom({ children, className = '' }: HoverImageZoomProps) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
