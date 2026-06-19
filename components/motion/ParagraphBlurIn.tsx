'use client';

import { motion, useInView } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef } from 'react';

interface ParagraphBlurInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** A10 — subtitle paragraph: opacity 0.001→1, blur 5px→0, y 10→0, tween */
export default function ParagraphBlurIn({
  children,
  className = '',
  delay = 0,
}: ParagraphBlurInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref}>
      <motion.p
        className={className}
        initial={{ opacity: 0.001, filter: 'blur(5px)', y: 10 }}
        animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      >
        {children}
      </motion.p>
    </div>
  );
}
