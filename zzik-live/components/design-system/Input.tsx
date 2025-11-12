'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Input Component - ZZIK LIVE Design System v1.0
 * 
 * Based on UXUI_SPECIFICATION.md Section 6.3
 * Implements accessible form input with animations, icons, and error states
 */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input type
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

  /**
   * Label text
   */
  label?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Input value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text (shown when no error)
   */
  helperText?: string;

  /**
   * Icon element to display on the left
   */
  icon?: React.ReactNode;

  /**
   * Required field indicator
   * @default false
   */
  required?: boolean;

  /**
   * Input size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Input Component
 * 
 * Accessible form input with focus animations, error states, and icon support
 * 
 * @example
 * ```tsx
 * <Input
 *   label="닉네임"
 *   placeholder="사용할 닉네임을 입력하세요"
 *   value={nickname}
 *   onChange={setNickname}
 *   icon={<User className="w-5 h-5" />}
 *   required
 *   error={nicknameError}
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      icon,
      helperText,
      required = false,
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);

    const sizeStyles = {
      sm: {
        input: 'px-3 py-2 text-sm',
        icon: 'left-3',
      },
      md: {
        input: 'px-4 py-3 text-base',
        icon: 'left-4',
      },
      lg: {
        input: 'px-5 py-4 text-lg',
        icon: 'left-5',
      },
    };

    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-gray-400',
                'pointer-events-none',
                sizeStyles[size].icon
              )}
            >
              {icon}
            </div>
          )}

          {/* Input Field */}
          <motion.input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              'w-full rounded-xl',
              'border-2 transition-all duration-200',
              'text-gray-900 placeholder:text-gray-400',
              'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60',
              sizeStyles[size].input,
              icon && 'pl-12',

              // Focus state
              focused && !error && 'border-primary-500 ring-4 ring-primary-100',

              // Default state
              !focused && !error && 'border-gray-200',

              // Error state
              error && 'border-error-500 ring-4 ring-error-100',

              className
            )}
            animate={{
              scale: focused ? 1.01 : 1,
            }}
            transition={{ duration: 0.2 }}
            {...props}
          />
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-sm',
              error ? 'text-error-600' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================
// Textarea Component
// ============================================

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text
   */
  label?: string;

  /**
   * Textarea value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Rows (height)
   * @default 4
   */
  rows?: number;
}

/**
 * Textarea Component
 * 
 * Multi-line text input with same styling as Input component
 * 
 * @example
 * ```tsx
 * <Textarea
 *   label="미션 설명"
 *   value={description}
 *   onChange={setDescription}
 *   rows={6}
 *   required
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      required = false,
      disabled = false,
      rows = 4,
      className,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);

    return (
      <div className="flex flex-col gap-2">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <motion.textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'w-full px-4 py-3 rounded-xl',
            'border-2 transition-all duration-200',
            'text-gray-900 placeholder:text-gray-400',
            'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60',
            'resize-vertical',

            // Focus state
            focused && !error && 'border-primary-500 ring-4 ring-primary-100',

            // Default state
            !focused && !error && 'border-gray-200',

            // Error state
            error && 'border-error-500 ring-4 ring-error-100',

            className
          )}
          animate={{
            scale: focused ? 1.01 : 1,
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-sm',
              error ? 'text-error-600' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
