import Image from 'next/image';

interface BgImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  quality?: number;
}

export default function BgImage({
  src,
  alt,
  priority = false,
  className = '',
  quality = 85,
}: BgImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={quality}
      className={`object-cover ${className}`}
      sizes="100vw"
    />
  );
}
