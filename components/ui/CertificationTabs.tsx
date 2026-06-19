'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

interface CertTab {
  label: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

interface CertificationTabsProps {
  tabs: CertTab[];
  intervalMs?: number;
}

export default function CertificationTabs({ tabs, intervalMs = 5000 }: CertificationTabsProps) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimers();
    setProgress(0);
    const step = 100 / (intervalMs / 90);

    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + step, 100));
    }, 90);

    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % tabs.length;
        stopTimers();
        setProgress(0);
        const innerStep = 100 / (intervalMs / 90);
        progressRef.current = setInterval(() => {
          setProgress((p) => Math.min(p + innerStep, 100));
        }, 90);
        return next;
      });
    }, intervalMs);
  }, [tabs.length, intervalMs, stopTimers]);

  useEffect(() => {
    startTimer();
    return stopTimers;
  }, [startTimer, stopTimers]);

  const handleSelect = (i: number) => {
    setActive(i);
    startTimer();
  };

  return (
    <div className="flex flex-col">
      {/* Large image */}
      <div className="relative h-[340px] overflow-hidden rounded-2xl tablet:h-[440px] desktop:h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={tabs[active]?.imageSrc ?? ''}
              alt={tabs[active]?.imageAlt ?? ''}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab indicators below image — stack on mobile, 3-col on tablet+ */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 tablet:gap-0 mt-8 desktop:mt-10">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="flex flex-col items-start gap-3 desktop:gap-4 text-left min-h-[48px] py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              aria-pressed={isActive}
            >
              {/* Progress line */}
              <div className="relative h-[2px] w-full bg-border">
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-[#606c38]"
                    style={{ width: `${progress}%` }}
                    aria-hidden="true"
                  />
                )}
              </div>
              {/* Cert name */}
              <span
                className={`type-h4 desktop:type-h3 font-medium transition-colors duration-300 ${
                  isActive ? 'text-text' : 'text-text-muted'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
