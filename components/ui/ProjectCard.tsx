import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  slug: string;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  imageAlt: string;
  status?: 'completed' | 'ongoing';
}

export default function ProjectCard({
  slug,
  title,
  category,
  date,
  imageSrc,
  imageAlt,
  status,
}: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`} className="group flex flex-col">
      {/* Image */}
      <div className="relative h-[240px] overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 33vw"
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border mt-5" />

      {/* Text */}
      <div className="flex flex-col gap-2 pt-5">
        <h3 className="type-h3 font-medium text-text">{title}</h3>
        <p className="type-body-sm text-text-muted flex flex-wrap items-center">
          {status === 'ongoing' && (
            <span className="bg-[#606c38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mr-2">
              Ongoing
            </span>
          )}
          <span>{category}</span>
          <span className="mx-2 opacity-40" aria-hidden="true">|</span>
          <span>{date}</span>
        </p>
      </div>
    </Link>
  );
}
