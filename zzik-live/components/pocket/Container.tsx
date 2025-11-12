// src/components/pocket/Container.tsx
// Pocket 템플릿의 Container 컴포넌트 - 일관된 레이아웃 유지

import { clsx } from 'clsx';

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  );
}