import { cn } from '@/lib/utils/cn';

export function ClusterMarker({
  count,
  onClick,
}: {
  count: number;
  onClick?: () => void;
}) {
  // Size based on count
  const size = count < 10 ? 32 : count < 100 ? 40 : 48;

  return (
    <button
      className={cn(
        'cluster',
        'inline-flex items-center justify-center',
        'rounded-full',
        'font-semibold text-white',
        'transition-transform duration-150',
        'hover:scale-110',
        'shadow-[0_2px_10px_rgba(0,0,0,0.25)]'
      )}
      style={{
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        background: 'color-mix(in srgb, var(--interactive-primary) 90%, black 0%)',
      }}
      onClick={onClick}
      aria-label={`${count}개 장소 클러스터`}
    >
      {count}
    </button>
  );
}
