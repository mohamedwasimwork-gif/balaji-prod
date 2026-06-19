interface BarLabelProps {
  children: string;
  variant?: 'dark' | 'light';
  className?: string;
}

/** 12×3 colored bar + label text — olive green (#606c38) brand accent for dark variant */
export default function BarLabel({ children, variant = 'dark', className = '' }: BarLabelProps) {
  const barColorStyle =
    variant === 'light' ? { backgroundColor: 'rgb(255,255,255)' } : { backgroundColor: '#606c38' };
  const textColor = variant === 'light' ? 'text-white' : 'text-text-muted';

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        className="inline-block h-[3px] w-3 flex-shrink-0"
        style={barColorStyle}
        aria-hidden="true"
      />
      <span className={`type-label font-medium ${textColor}`}>{children}</span>
    </span>
  );
}
