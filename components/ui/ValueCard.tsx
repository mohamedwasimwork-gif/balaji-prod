import type { ReactNode } from 'react';

interface ValueCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function ValueCard({ icon, title, description, className = '' }: ValueCardProps) {
  return (
    <div className={`flex flex-col gap-4 rounded-2xl bg-bg-soft p-6 ${className}`}>
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-soft text-text">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="type-h4 font-medium text-text">{title}</h3>
        <p className="type-body-sm text-text-muted">{description}</p>
      </div>
    </div>
  );
}
