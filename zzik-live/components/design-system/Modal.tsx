'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Modal Component - ZZIK LIVE Design System v1.0
 * 
 * Accessible modal dialog with backdrop and animations
 * Supports different sizes and custom headers/footers
 */

export interface ModalProps {
  /**
   * Modal open state
   */
  open: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title?: string;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Close on backdrop click
   * @default true
   */
  closeOnBackdrop?: boolean;

  /**
   * Custom footer content
   */
  footer?: React.ReactNode;

  /**
   * Prevent body scroll when open
   * @default true
   */
  preventScroll?: boolean;
}

/**
 * Modal Component
 * 
 * Accessible modal dialog with smooth animations
 * 
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="미션 상세"
 *   footer={
 *     <Button onClick={handleSubmit}>
 *       시작하기
 *     </Button>
 *   }
 * >
 *   <p>미션 내용...</p>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  footer,
  preventScroll = true,
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (preventScroll && open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, preventScroll]);

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Size styles
  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1300]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[1400] p-4">
            <motion.div
              ref={modalRef}
              className={cn(
                'bg-white rounded-2xl shadow-2xl',
                'w-full overflow-hidden',
                sizeStyles[size]
              )}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  {title && (
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className={cn(
                        'p-2 rounded-lg text-gray-500',
                        'hover:bg-gray-100 hover:text-gray-700',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500'
                      )}
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============================================
// Confirm Modal (Specialized)
// ============================================

export interface ConfirmModalProps {
  /**
   * Modal open state
   */
  open: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Confirm handler
   */
  onConfirm: () => void;

  /**
   * Modal title
   */
  title: string;

  /**
   * Confirmation message
   */
  message: string;

  /**
   * Confirm button text
   * @default '확인'
   */
  confirmText?: string;

  /**
   * Cancel button text
   * @default '취소'
   */
  cancelText?: string;

  /**
   * Confirm button variant
   * @default 'primary'
   */
  confirmVariant?: 'primary' | 'danger';

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;
}

/**
 * Confirm Modal Component
 * 
 * Pre-built confirmation dialog
 * 
 * @example
 * ```tsx
 * <ConfirmModal
 *   open={showConfirm}
 *   onClose={() => setShowConfirm(false)}
 *   onConfirm={handleDelete}
 *   title="미션 삭제"
 *   message="정말로 이 미션을 삭제하시겠습니까?"
 *   confirmVariant="danger"
 *   confirmText="삭제"
 * />
 * ```
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  confirmVariant = 'primary',
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className={cn(
              'px-6 py-3 rounded-xl font-semibold',
              'text-gray-700 bg-gray-100',
              'hover:bg-gray-200',
              'transition-colors duration-200',
              'disabled:opacity-50'
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-6 py-3 rounded-xl font-semibold',
              'text-white transition-colors duration-200',
              'disabled:opacity-50',
              confirmVariant === 'primary' &&
                'bg-primary-500 hover:bg-primary-600',
              confirmVariant === 'danger' && 'bg-error-500 hover:bg-error-600'
            )}
          >
            {loading ? '처리 중...' : confirmText}
          </button>
        </div>
      }
    >
      <p className="text-gray-700 leading-relaxed">{message}</p>
    </Modal>
  );
};

export default Modal;
