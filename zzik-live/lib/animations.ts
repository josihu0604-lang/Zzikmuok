/**
 * Animation Utilities - ZZIK LIVE Design System v1.0
 * 
 * Based on UXUI_SPECIFICATION.md Section 5.2
 * Framer Motion animation presets and variants
 * 
 * @version 1.0.0
 * @author ZZIK Design System Team
 * @date 2025-11-12
 */

import { Variants, Transition } from 'framer-motion';

// ============================================
// 1. PAGE TRANSITIONS
// ============================================

/**
 * Page transition variants - Fade + Slide Up
 * 
 * @example
 * ```tsx
 * <motion.div
 *   variants={pageVariants}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * >
 *   <PageContent />
 * </motion.div>
 * ```
 */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier easing
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Slide in from right (for navigation)
 */
export const slideInRightVariants: Variants = {
  initial: {
    x: '100%',
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Slide in from bottom (for modals/sheets)
 */
export const slideInBottomVariants: Variants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: '100%',
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// 2. LIST ANIMATIONS
// ============================================

/**
 * Staggered list container
 * 
 * @example
 * ```tsx
 * <motion.ul
 *   variants={staggerContainerVariants}
 *   initial="hidden"
 *   animate="show"
 * >
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItemVariants}>
 *       <ItemCard item={item} />
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // 0.1 second between each item
      delayChildren: 0.2, // Wait 0.2s before starting
    },
  },
};

/**
 * Staggered list item
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

/**
 * Fast stagger (for grids)
 */
export const fastStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// ============================================
// 3. COMPONENT ANIMATIONS
// ============================================

/**
 * Button tap animation
 */
export const buttonTapAnimation = {
  scale: 0.95,
};

/**
 * Button hover animation
 */
export const buttonHoverAnimation = {
  scale: 1.02,
};

/**
 * Card hover animation
 */
export const cardHoverAnimation = {
  scale: 1.02,
  y: -4,
};

/**
 * Card tap animation
 */
export const cardTapAnimation = {
  scale: 0.98,
};

// ============================================
// 4. MICRO-INTERACTIONS
// ============================================

/**
 * Like button animation
 * 
 * @example
 * ```tsx
 * <motion.div
 *   animate={{
 *     scale: liked ? [1, 1.3, 1] : 1,
 *     rotate: liked ? [0, -10, 10, 0] : 0
 *   }}
 *   transition={likeButtonTransition}
 * >
 *   <Heart />
 * </motion.div>
 * ```
 */
export const likeButtonTransition: Transition = {
  duration: 0.4,
  ease: 'easeInOut',
};

/**
 * Success checkmark animation
 */
export const checkmarkVariants: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
};

/**
 * Loading spinner animation
 */
export const spinnerAnimation = {
  rotate: 360,
};

export const spinnerTransition: Transition = {
  duration: 1,
  repeat: Infinity,
  ease: 'linear',
};

// ============================================
// 5. TOAST/NOTIFICATION ANIMATIONS
// ============================================

/**
 * Toast notification variants
 * 
 * @example
 * ```tsx
 * <AnimatePresence>
 *   {showToast && (
 *     <motion.div
 *       variants={toastVariants}
 *       initial="initial"
 *       animate="animate"
 *       exit="exit"
 *     >
 *       Toast content
 *     </motion.div>
 *   )}
 * </AnimatePresence>
 * ```
 */
export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// 6. PROGRESS/LOADING ANIMATIONS
// ============================================

/**
 * Progress bar animation
 */
export const progressBarVariants: Variants = {
  initial: {
    scaleX: 0,
    originX: 0,
  },
  animate: (progress: number) => ({
    scaleX: progress / 100,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

/**
 * Verification step indicator
 */
export const verificationStepVariants: Variants = {
  inactive: {
    scale: 1,
    opacity: 0.5,
  },
  active: {
    scale: 1.1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  complete: {
    scale: 1,
    opacity: 1,
    rotate: 360,
    transition: {
      duration: 0.5,
    },
  },
};

// ============================================
// 7. MODAL/BACKDROP ANIMATIONS
// ============================================

/**
 * Backdrop fade animation
 */
export const backdropVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Modal scale animation
 */
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// 8. DRAWER/SHEET ANIMATIONS
// ============================================

/**
 * Bottom drawer slide up
 */
export const drawerVariants: Variants = {
  initial: {
    y: '100%',
  },
  animate: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: '100%',
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================
// 9. SPRING CONFIGURATIONS
// ============================================

/**
 * Common spring configurations
 */
export const springConfig = {
  // Gentle bounce
  gentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 20,
  },

  // Snappy response
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 17,
  },

  // Bouncy
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 10,
  },

  // Smooth
  smooth: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
};

// ============================================
// 10. EASING FUNCTIONS
// ============================================

/**
 * Custom easing curves
 */
export const easings = {
  // Material Design easing
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],

  // Custom curves
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

// ============================================
// 11. HELPER FUNCTIONS
// ============================================

/**
 * Create stagger delay for index
 */
export const staggerDelay = (index: number, baseDelay: number = 0.1): number => {
  return baseDelay * index;
};

/**
 * Calculate progress percentage
 */
export const calculateProgress = (
  current: number,
  total: number
): number => {
  return Math.min(100, Math.max(0, (current / total) * 100));
};

/**
 * Create fade in animation with custom delay
 */
export const createFadeIn = (delay: number = 0): Variants => ({
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay,
    },
  },
});

/**
 * Create slide in animation from direction
 */
export const createSlideIn = (
  direction: 'left' | 'right' | 'up' | 'down',
  distance: number = 20
): Variants => {
  const offsets = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    up: { x: 0, y: -distance },
    down: { x: 0, y: distance },
  };

  return {
    initial: {
      opacity: 0,
      ...offsets[direction],
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };
};

export default {
  pageVariants,
  slideInRightVariants,
  slideInBottomVariants,
  staggerContainerVariants,
  staggerItemVariants,
  fastStaggerContainerVariants,
  buttonTapAnimation,
  buttonHoverAnimation,
  cardHoverAnimation,
  cardTapAnimation,
  likeButtonTransition,
  checkmarkVariants,
  spinnerAnimation,
  spinnerTransition,
  toastVariants,
  progressBarVariants,
  verificationStepVariants,
  backdropVariants,
  modalVariants,
  drawerVariants,
  springConfig,
  easings,
  staggerDelay,
  calculateProgress,
  createFadeIn,
  createSlideIn,
};
