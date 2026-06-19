'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const PHOTOS = [
  {
    src: 'https://framerusercontent.com/images/HMLilDT8OVWhgIQHKvgb3S7J2gw.jpg',
    alt: 'Wind turbine at sunset with solar panels',
  },
  {
    src: 'https://framerusercontent.com/images/EGprxWBupmsG38b8hHxhm6DAk.jpg',
    alt: 'Mountain landscape with solar rooftop house',
  },
  {
    src: 'https://framerusercontent.com/images/shn0Pai8ytDvo0JvLIJCUOY.webp',
    alt: 'Aerial view of solar panels on green field',
  },
  {
    src: 'https://framerusercontent.com/images/7nneOn1QEgQcom6NcWmKaNb2S4.jpg',
    alt: 'Rooftop solar panels against blue sky',
  },
];

/* Spring configs from reference */
const SPRING_A = { type: 'spring' as const, damping: 30, mass: 1, stiffness: 160 };
const SPRING_B = { type: 'spring' as const, damping: 36, mass: 4, stiffness: 120 };

function PhotoItem({ photo, index }: { photo: (typeof PHOTOS)[0]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const delay = index < 2 ? 0.1 : 0.2;
  const spring = index < 2 ? SPRING_A : SPRING_B;

  return (
    <motion.li
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: 480, willChange: 'transform' }}
      initial={{ y: 100 }}
      animate={inView ? { y: 0 } : {}}
      transition={{ ...spring, delay }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover"
        sizes="25vw"
      />
    </motion.li>
  );
}

export default function PhotoGridSection() {
  return (
    <section id="photo-grid" className="w-full overflow-hidden">
      {/* Olive green top bar matching reference #606c38 */}
      <div className="w-full h-2" style={{ backgroundColor: '#606c38' }} />

      <ul
        className="grid w-full list-none m-0 p-0"
        style={{ gridTemplateColumns: 'repeat(4, minmax(50px, 1fr))' }}
      >
        {PHOTOS.map((photo, i) => (
          <PhotoItem key={photo.src} photo={photo} index={i} />
        ))}
      </ul>
    </section>
  );
}
