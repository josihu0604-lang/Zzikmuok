/**
 * ZZIK LIVE Design Tokens v1.0
 * 
 * Type-safe design tokens based on UXUI_SPECIFICATION.md
 * All values follow 8pt grid system and WCAG 2.1 AA standards
 * 
 * @version 1.0.0
 * @author ZZIK Design System Team
 * @date 2025-11-12
 */

// ============================================
// 1. COLOR SYSTEM
// ============================================

export const colors = {
  // Primary Colors - Violet-Purple Gradient (브랜드 아이덴티티)
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',  // Main Brand Color
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Blue Accent - 위치 기반 서비스 연상
  blue: {
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Semantic Colors
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    600: '#059669',
  },

  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },

  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },

  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Neutral Colors - Gray Scale
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Gradient Presets
  gradients: {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    map: 'linear-gradient(135deg, #3B4C85 0%, #7B4FA8 50%, #A855C2 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    card: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 100%)',
  },
} as const;

// ============================================
// 2. TYPOGRAPHY SYSTEM
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    monospace: "'SF Mono', 'Consolas', 'Monaco', monospace",
  },

  // Font Sizes - 8pt Grid 기반
  fontSize: {
    // Display - 히어로 섹션
    displayLg: '48px',
    displayMd: '36px',
    displaySm: '30px',

    // Heading - 섹션 제목
    headingXl: '24px',
    headingLg: '20px',
    headingMd: '18px',
    headingSm: '16px',

    // Body - 본문 텍스트
    bodyLg: '18px',
    bodyMd: '16px',
    bodySm: '14px',

    // Label - 버튼, 입력 라벨
    labelLg: '16px',
    labelMd: '14px',
    labelSm: '12px',

    // Caption - 보조 텍스트
    captionLg: '14px',
    captionMd: '12px',
    captionSm: '10px',
  },

  // Line Heights
  lineHeight: {
    displayLg: '56px',
    displayMd: '44px',
    displaySm: '38px',

    headingXl: '32px',
    headingLg: '28px',
    headingMd: '26px',
    headingSm: '24px',

    bodyLg: '28px',
    bodyMd: '24px',
    bodySm: '20px',

    labelLg: '24px',
    labelMd: '20px',
    labelSm: '16px',

    captionLg: '20px',
    captionMd: '16px',
    captionSm: '14px',
  },

  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.01em',
  },
} as const;

// ============================================
// 3. SPACING SYSTEM (8pt Grid)
// ============================================

export const spacing = {
  0: '0px',
  1: '4px',    // 0.5 unit
  2: '8px',    // 1 unit - Base
  3: '12px',   // 1.5 units
  4: '16px',   // 2 units - Default gap
  5: '20px',   // 2.5 units
  6: '24px',   // 3 units - Section spacing
  8: '32px',   // 4 units - Large gap
  10: '40px',  // 5 units
  12: '48px',  // 6 units - Extra large
  16: '64px',  // 8 units - Hero spacing
  20: '80px',  // 10 units
  24: '96px',  // 12 units - Section margin
} as const;

// ============================================
// 4. BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
} as const;

// ============================================
// 5. SHADOW SYSTEM
// ============================================

export const shadows = {
  // Elevation Levels
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.06)',
  md: '0 4px 8px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.10)',
  xl: '0 12px 24px rgba(0, 0, 0, 0.12)',
  '2xl': '0 16px 32px rgba(0, 0, 0, 0.15)',

  // Colored Shadows
  primary: '0 8px 24px rgba(139, 92, 246, 0.3)',
  success: '0 8px 24px rgba(16, 185, 129, 0.3)',
  error: '0 8px 24px rgba(239, 68, 68, 0.3)',
} as const;

// ============================================
// 6. BREAKPOINTS (Mobile-First)
// ============================================

export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '390px',   // iPhone 12/13/14 (baseline)
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large desktop
} as const;

// Media Query Helpers
export const media = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
} as const;

// ============================================
// 7. Z-INDEX SYSTEM
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
} as const;

// ============================================
// 8. ANIMATION TIMINGS
// ============================================

export const animation = {
  // Duration
  duration: {
    fastest: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slowest: '500ms',
  },

  // Easing Functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  },

  // Preset Transitions
  transition: {
    default: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    slow: 'all 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    spring: 'all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================
// 9. COMPONENT-SPECIFIC TOKENS
// ============================================

export const components = {
  // Button Sizes
  button: {
    sm: {
      padding: `${spacing[2]} ${spacing[4]}`,
      fontSize: typography.fontSize.labelSm,
      lineHeight: typography.lineHeight.labelSm,
    },
    md: {
      padding: `${spacing[3]} ${spacing[6]}`,
      fontSize: typography.fontSize.labelMd,
      lineHeight: typography.lineHeight.labelMd,
    },
    lg: {
      padding: `${spacing[4]} ${spacing[8]}`,
      fontSize: typography.fontSize.labelLg,
      lineHeight: typography.lineHeight.labelLg,
    },
  },

  // Card Padding
  card: {
    sm: { padding: spacing[4] },
    md: { padding: spacing[6] },
    lg: { padding: spacing[8] },
  },

  // Input Sizes
  input: {
    sm: {
      padding: `${spacing[2]} ${spacing[3]}`,
      fontSize: typography.fontSize.bodySm,
      lineHeight: typography.lineHeight.bodySm,
    },
    md: {
      padding: `${spacing[3]} ${spacing[4]}`,
      fontSize: typography.fontSize.bodyMd,
      lineHeight: typography.lineHeight.bodyMd,
    },
    lg: {
      padding: `${spacing[4]} ${spacing[5]}`,
      fontSize: typography.fontSize.bodyLg,
      lineHeight: typography.lineHeight.bodyLg,
    },
  },

  // Bottom Navigation
  bottomNav: {
    height: '64px',
    iconSize: '24px',
    fontSize: typography.fontSize.captionMd,
    activeColor: colors.primary[500],
    inactiveColor: colors.gray[400],
  },

  // Drawer Heights
  drawer: {
    collapsed: '20%',
    default: '45%',
    expanded: '80%',
  },
} as const;

// ============================================
// 10. ACCESSIBILITY TOKENS
// ============================================

export const a11y = {
  // Touch Target Sizes (WCAG 2.1 AA)
  touchTarget: {
    min: '44px',      // Minimum touch target
    comfortable: '48px', // Recommended
  },

  // Focus Styles
  focus: {
    outline: `2px solid ${colors.primary[500]}`,
    outlineOffset: '2px',
  },

  // Color Contrast Ratios (WCAG 2.1 AA)
  contrast: {
    normal: 4.5,   // Normal text
    large: 3.0,    // Large text (18pt+ or 14pt+ bold)
    ui: 3.0,       // UI components
  },
} as const;

// ============================================
// 11. MOTION PREFERENCES
// ============================================

export const motion = {
  // Reduced Motion Support
  reducedMotion: {
    duration: '0ms',
    easing: 'linear',
  },

  // Standard Motion
  standard: {
    duration: animation.duration.normal,
    easing: animation.easing.smooth,
  },
} as const;

// ============================================
// 12. UTILITY EXPORTS
// ============================================

// Type-safe token access
export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type BreakpointToken = keyof typeof breakpoints;
export type ZIndexToken = keyof typeof zIndex;

// Helper function to get CSS variable syntax
export const cssVar = (token: string) => `var(--${token})`;

// Helper function to convert tokens to CSS variables
export const toCssVars = () => {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(colors.primary).forEach(([key, value]) => {
    vars[`--color-primary-${key}`] = value;
  });

  Object.entries(colors.gray).forEach(([key, value]) => {
    vars[`--color-gray-${key}`] = value;
  });

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value;
  });

  // Typography
  vars['--font-family-primary'] = typography.fontFamily.primary;
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    vars[`--font-size-${key}`] = value;
  });

  return vars;
};

// Export all tokens
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  media,
  zIndex,
  animation,
  components,
  a11y,
  motion,
  cssVar,
  toCssVars,
} as const;
