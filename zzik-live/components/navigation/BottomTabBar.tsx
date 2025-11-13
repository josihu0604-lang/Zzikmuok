'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Map, MapPin, LayoutGrid } from 'lucide-react';
import { memo, useCallback } from 'react';
import clsx from 'clsx';

type TabId = 'explore' | 'feed';

const TABS: Array<{
  id: TabId;
  label: string;
  icon: React.ElementType;
  activeIcon?: React.ElementType;
  href: string;
}> = [
  { id: 'explore', label: '탐색', icon: Map, activeIcon: MapPin, href: '/explore' },
  { id: 'feed', label: '피드', icon: LayoutGrid, href: '/feed' },
];

export default memo(function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const go = useCallback(
    (href: string) => {
      router.push(href);
      // 안드로이드만 진동 허용
      if ('vibrate' in navigator) (navigator as any).vibrate?.(10);
    },
    [router]
  );

  return (
    <nav
      role="tablist"
      aria-label="메인 네비게이션"
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50',
        'backdrop-blur-sm',
        'bg-[color:var(--bg-primary)]/90 dark:bg-[color:var(--bg-primary)]/90',
        'border-t border-[color:var(--border-primary)]'
      )}
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), constant(safe-area-inset-bottom), 0px)',
      }}
    >
      <ul className="mx-auto grid max-w-screen-sm grid-cols-2">
        {TABS.map(({ id, label, icon: Icon, activeIcon: ActiveIcon, href }) => {
          const active = pathname?.startsWith(href);
          const Ico = active && ActiveIcon ? ActiveIcon : Icon;
          return (
            <li key={id}>
              <button
                role="tab"
                aria-selected={active}
                aria-current={active ? 'page' : undefined}
                onClick={() => go(href)}
                className={clsx(
                  'relative',
                  'flex min-h-[48px] min-w-[80px] w-full flex-col items-center justify-center px-4 py-2',
                  'transition-all duration-200',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--interactive-primary)]'
                )}
              >
                <Ico
                  className={clsx(
                    'h-6 w-6 mb-1 transition-opacity',
                    active ? 'opacity-100 text-[color:var(--interactive-primary)]' : 'opacity-70 text-[color:var(--text-tertiary)]'
                  )}
                />
                <span
                  className={clsx(
                    'text-xs transition-all',
                    active ? 'font-semibold text-[color:var(--interactive-primary)]' : 'font-medium text-[color:var(--text-tertiary)]'
                  )}
                >
                  {label}
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className={clsx(
                      'absolute bottom-0 left-1/2 -translate-x-1/2',
                      'h-0.5 w-16 rounded-full',
                      'bg-[color:var(--interactive-primary)]'
                    )}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
});
