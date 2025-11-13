import { cn } from '@/lib/utils/cn';

export function IconButton({
  icon: Icon,
  label,
  pressed,
  onClick,
  variant = 'default',
}: {
  icon: any;
  label: string;
  pressed?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost';
}) {
  return (
    <button
      type="button"
      className={cn(
        'min-h-[48px] min-w-[48px] rounded-lg',
        'inline-flex items-center justify-center',
        'transition-colors duration-200',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--interactive-primary)]',
        // Variant styles
        variant === 'default' &&
          cn(
            pressed
              ? 'bg-[color:var(--bg-tertiary)]'
              : 'bg-transparent hover:bg-[color:var(--bg-secondary)]'
          ),
        variant === 'primary' &&
          cn(
            pressed
              ? 'bg-[color:var(--interactive-primary-active)] text-white'
              : 'bg-[color:var(--interactive-primary)] text-white hover:bg-[color:var(--interactive-primary-hover)]'
          ),
        variant === 'ghost' && 'bg-transparent hover:bg-[color:var(--bg-secondary)]'
      )}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
    >
      <Icon
        className={cn(
          'h-6 w-6',
          variant === 'primary' && pressed
            ? 'text-white'
            : 'text-[color:var(--text-primary)]'
        )}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </button>
  );
}
