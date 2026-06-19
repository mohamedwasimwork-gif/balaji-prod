'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'primary-white' | 'alternate' | 'big' | 'small' | 'secondary';

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  disabled?: boolean;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  rel?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover type-btn px-5 py-3 rounded-lg transition-colors duration-200',
  'primary-white':
    'bg-white text-text hover:bg-neutral-100 type-btn px-5 py-3 rounded-lg transition-colors duration-200',
  alternate:
    'border border-white text-white hover:bg-white/10 type-btn px-5 py-3 rounded-lg transition-colors duration-200',
  big: 'bg-primary text-white hover:bg-primary-hover type-btn px-7 py-4 rounded-lg text-base transition-colors duration-200',
  small:
    'bg-primary text-white hover:bg-primary-hover type-btn px-4 py-2.5 rounded-md text-xs transition-colors duration-200',
  secondary:
    'bg-[#606c38] text-white hover:bg-[#4e5830] type-btn px-5 py-3 rounded-lg transition-colors duration-200',
};

export default function Button({
  children,
  variant = 'primary',
  href,
  className = '',
  onClick,
  type = 'button',
  disabled,
  target,
  rel,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 font-medium leading-none whitespace-nowrap ${variantClasses[variant]} ${className}`;

  if (href) {
    const isExternal = href.startsWith('http');
    return (
      <Link
        href={href}
        className={classes}
        target={isExternal ? '_blank' : target}
        rel={isExternal ? 'noopener noreferrer' : rel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
