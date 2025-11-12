'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Badge Component - ZZIK LIVE Design System v1.0
 * 
 * Small status indicators and labels
 * Supports multiple variants and sizes
 */

export interface BadgeProps {
  /**
   * Badge variant
   * @default 'default'
   */
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'outline';

  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Badge content
   */
  children: React.ReactNode;

  /**
   * Icon element (optional)
   */
  icon?: React.ReactNode;

  /**
   * Rounded pill style
   * @default true
   */
  pill?: boolean;

  /**
   * Additional className
   */
  className?: string;

  /**
   * Animation on mount
   * @default false
   */
  animate?: boolean;
}

/**
 * Badge Component
 * 
 * Status indicators and labels with multiple variants
 * 
 * @example
 * ```tsx
 * <Badge variant="success">검증 완료</Badge>
 * <Badge variant="warning" icon={<Clock />}>대기 중</Badge>
 * <Badge variant="error">검증 실패</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  children,
  icon,
  pill = true,
  className,
  animate = false,
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    info: 'bg-info-100 text-info-700',
    outline: 'bg-transparent border-2 border-gray-300 text-gray-700',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const Component = animate ? motion.span : 'span';

  const animationProps = animate
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold',
        pill ? 'rounded-full' : 'rounded-lg',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...animationProps}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </Component>
  );
};

// ============================================
// Status Badge (Specialized)
// ============================================

export interface StatusBadgeProps {
  /**
   * Status type
   */
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed';

  /**
   * Show pulsing dot indicator
   * @default true
   */
  showDot?: boolean;

  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Status Badge Component
 * 
 * Specialized badge for mission/submission status
 * Includes animated dot indicator
 * 
 * @example
 * ```tsx
 * <StatusBadge status="pending" />
 * <StatusBadge status="approved" showDot={false} />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showDot = true,
  size = 'md',
}) => {
  const statusConfig = {
    pending: {
      label: '대기 중',
      variant: 'warning' as const,
      dotColor: 'bg-warning-500',
    },
    processing: {
      label: '검증 중',
      variant: 'info' as const,
      dotColor: 'bg-info-500',
    },
    approved: {
      label: '승인됨',
      variant: 'success' as const,
      dotColor: 'bg-success-500',
    },
    rejected: {
      label: '거부됨',
      variant: 'error' as const,
      dotColor: 'bg-error-500',
    },
    completed: {
      label: '완료',
      variant: 'success' as const,
      dotColor: 'bg-success-500',
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size={size} animate>
      {showDot && (
        <motion.span
          className={cn('w-2 h-2 rounded-full', config.dotColor)}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      {config.label}
    </Badge>
  );
};

// ============================================
// Difficulty Badge (Specialized)
// ============================================

export interface DifficultyBadgeProps {
  /**
   * Difficulty level
   */
  difficulty: 'easy' | 'medium' | 'hard';

  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Difficulty Badge Component
 * 
 * Specialized badge for mission difficulty
 * 
 * @example
 * ```tsx
 * <DifficultyBadge difficulty="easy" />
 * <DifficultyBadge difficulty="hard" size="lg" />
 * ```
 */
export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  size = 'md',
}) => {
  const difficultyConfig = {
    easy: {
      label: '쉬움',
      variant: 'success' as const,
    },
    medium: {
      label: '보통',
      variant: 'warning' as const,
    },
    hard: {
      label: '어려움',
      variant: 'error' as const,
    },
  };

  const config = difficultyConfig[difficulty];

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};

// ============================================
// Category Badge (Specialized)
// ============================================

export interface CategoryBadgeProps {
  /**
   * Category name
   */
  category: string;

  /**
   * Category icon (optional)
   */
  icon?: React.ReactNode;

  /**
   * Badge size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Category Badge Component
 * 
 * Badge for content categories (카페, 레스토랑, etc.)
 * 
 * @example
 * ```tsx
 * <CategoryBadge category="카페" icon={<Coffee />} />
 * <CategoryBadge category="레스토랑" />
 * ```
 */
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  icon,
  size = 'md',
}) => {
  return (
    <Badge variant="default" size={size} icon={icon}>
      {category}
    </Badge>
  );
};

export default Badge;
