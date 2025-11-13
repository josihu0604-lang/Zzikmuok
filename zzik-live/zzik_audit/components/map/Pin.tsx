import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Point } from '@/lib/map/cluster';

export function Pin({
  point,
  selected,
  onClick,
}: {
  point: Point;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        'pin',
        'relative flex items-center justify-center',
        'w-9 h-9 rounded-[20px]',
        'transition-transform duration-150',
        'shadow-[0_2px_10px_rgba(0,0,0,0.25)]',
        selected && 'pin--selected scale-110'
      )}
      style={{
        background: point.cover
          ? `url(${point.cover}) center/cover`
          : 'var(--interactive-primary)',
      }}
      onClick={onClick}
      aria-label={point.name || `장소 ${point.id}`}
      aria-pressed={selected}
    >
      {!point.cover && (
        <MapPin className="h-5 w-5 text-white" aria-hidden />
      )}

      {/* New Badge - 24시간 이내 */}
      {point.isNew && (
        <span
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
          aria-label="신규"
        />
      )}

      {/* Selected Glow */}
      {selected && (
        <span
          className="absolute inset-0 rounded-[20px] ring-2 ring-white ring-offset-2"
          aria-hidden
        />
      )}
    </button>
  );
}
