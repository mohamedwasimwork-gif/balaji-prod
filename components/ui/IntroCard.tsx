import type { ReactNode } from 'react';

import BgImage from './BgImage';

interface IntroCardProps {
  imageSrc?: string;
  imageAlt?: string;
  caption: string;
  icon?: ReactNode;
  accent?: boolean;
  stat?: string;
  className?: string;
}

export default function IntroCard({
  imageSrc,
  imageAlt = '',
  caption,
  icon,
  accent = false,
  stat,
  className = '',
}: IntroCardProps) {
  if (accent) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#606c38] p-6 text-center ${className}`}
      >
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
            {icon}
          </div>
        )}
        {stat && <p className="text-stat font-bold text-white">{stat}</p>}
        <p className="type-body-lg font-medium text-white">{caption}</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {imageSrc && (
        <>
          <BgImage src={imageSrc} alt={imageAlt} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      )}
      <div className="relative flex h-full flex-col justify-end p-6">
        {icon && (
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white">
            {icon}
          </div>
        )}
        <p className="type-h4 font-medium text-white">{caption}</p>
      </div>
    </div>
  );
}
