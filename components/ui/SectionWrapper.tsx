import type { ReactNode } from 'react';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'header' | 'article';
  id?: string;
  contained?: boolean;
}

export default function SectionWrapper({
  children,
  className = '',
  as: Tag = 'section',
  id,
  contained = true,
}: SectionWrapperProps) {
  return (
    <Tag id={id} className={`w-full ${className}`}>
      {contained ? (
        <div className="mx-auto w-full max-w-container px-4 tablet:px-6 desktop:px-8">{children}</div>
      ) : (
        children
      )}
    </Tag>
  );
}
