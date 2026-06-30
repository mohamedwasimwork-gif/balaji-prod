'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden text-slate-100 font-sans">
      {/* Decorative backdrop gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-forest-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[35vw] h-[35vw] bg-forest-950/15 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/animation.png"
              alt="Balaji & Co Logo"
              width={180}
              height={54}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500"></span>
            </span>
            Scheduled System Updates
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-4 sm:text-4xl">
            We'll Be Back <span className="text-forest-400 font-bold">Shortly</span>
          </h1>

          {/* Subheading */}
          <p className="text-slate-400 text-base leading-relaxed max-w-md">
            We are currently performing scheduled system updates to improve performance and enhance security. We apologize for the temporary inconvenience.
          </p>

          {/* Footer branding */}
          <div className="border-t border-slate-800/60 w-full mt-8 pt-6">
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} Balaji & Co. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
