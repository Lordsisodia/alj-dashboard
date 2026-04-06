/** Single canonical chevron icon. Direction defaults to 'down'. */
export default function ChevronIcon({
  direction = 'down',
  size = 16,
  className,
}: {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: number;
  className?: string;
}) {
  const rotations = { down: 0, up: 180, right: -90, left: 90 };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: `rotate(${rotations[direction]}deg)`, transition: 'transform 200ms' }}
      className={className}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}
