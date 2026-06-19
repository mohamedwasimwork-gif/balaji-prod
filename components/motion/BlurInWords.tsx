'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface BlurInWordsProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  stagger?: number;
  duration?: number;
}

/**
 * A6 — Splits text by word, each word fades + blurs + rises 10px.
 * Stagger ~0.05–0.08s, tween dur ~0.8s, triggered by scroll IntersectionObserver.
 */
export default function BlurInWords({
  text,
  className = '',
  as: Tag = 'h2',
  stagger = 0.06,
  duration = 0.8,
}: BlurInWordsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const words = text.split(' ');

  return (
    <div ref={ref} aria-label={text}>
      <Tag className={`flex flex-wrap gap-x-[0.3em] ${className}`} aria-hidden="true">
        {words.map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.001, filter: 'blur(5px)', y: 10 }}
            animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
            transition={{ duration, delay: i * stagger, ease: 'easeOut' }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}
