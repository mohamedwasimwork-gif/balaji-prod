export default function CheckBadgeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1L12.5 4H16V7.5L19 10L16 12.5V16H12.5L10 19L7.5 16H4V12.5L1 10L4 7.5V4H7.5L10 1ZM14 8L9 13L6.5 10.5L7.5 9.5L9 11L13 7L14 8Z"
        fill="currentColor"
      />
    </svg>
  );
}
