interface PillLabelProps {
  children: string;
  variant?: 'dark' | 'light';
  className?: string;
}

export default function PillLabel({ children, variant = 'dark', className = '' }: PillLabelProps) {
  const base =
    'inline-flex items-center gap-2 rounded-full px-4 py-1.5 type-label font-medium select-none';
  const variants = {
    dark: 'bg-bg-soft text-text border border-border',
    light: 'bg-white/15 text-white border border-white/20 backdrop-blur-sm',
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full flex-shrink-0 ${variant === 'dark' ? 'bg-text-muted' : 'bg-white'}`}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
