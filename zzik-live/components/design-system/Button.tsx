'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colors, components } from '@/lib/design-tokens';

/**
 * Button Component - ZZIK LIVE Design System v1.0
 * 
 * Based on UXUI_SPECIFICATION.md Section 6.1
 * Implements 5 variants with Framer Motion animations
 * Supports loading states, icons, and full-width layouts
 */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  
  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Loading state with spinner
   * @default false
   */
  loading?: boolean;
  
  /**
   * Icon element (React node)
   */
  icon?: React.ReactNode;
  
  /**
   * Icon position
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  
  /**
   * Button content
   */
  children: React.ReactNode;
}

/**
 * Button Component
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" fullWidth icon={<MapPin />}>
 *   미션 시작하기
 * </Button>
 * 
 * <Button variant="outline" size="md" loading>
 *   검증 중...
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = cn(
      'font-semibold rounded-xl transition-all duration-200',
      'flex items-center justify-center gap-2',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      fullWidth && 'w-full'
    );

    // Variant styles
    const variantStyles = {
      primary: cn(
        'bg-gradient-to-r from-primary-600 to-primary-500',
        'text-white shadow-lg',
        'hover:shadow-[0_8px_24px_rgba(139,92,246,0.3)]',
        'focus:ring-primary-400'
      ),
      secondary: cn(
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200 active:bg-gray-300',
        'focus:ring-gray-400'
      ),
      outline: cn(
        'border-2 border-primary-500 text-primary-600 bg-transparent',
        'hover:bg-primary-50 active:bg-primary-100',
        'focus:ring-primary-400'
      ),
      ghost: cn(
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 active:bg-gray-200',
        'focus:ring-gray-400'
      ),
      danger: cn(
        'bg-error-500 text-white shadow-lg',
        'hover:bg-error-600 active:bg-error-700',
        'hover:shadow-[0_8px_24px_rgba(239,68,68,0.3)]',
        'focus:ring-error-400'
      ),
    };

    // Size styles
    const sizeStyles = {
      sm: 'px-4 py-2 text-sm h-9',
      md: 'px-6 py-3 text-base h-11',
      lg: 'px-8 py-4 text-lg h-14',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        onClick={onClick}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17,
        }}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="w-5 h-5" />
          </motion.div>
        )}

        {/* Left Icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span className="inline-flex">{icon}</span>
        )}

        {/* Button Text */}
        {!loading && <span>{children}</span>}

        {/* Right Icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="inline-flex">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
