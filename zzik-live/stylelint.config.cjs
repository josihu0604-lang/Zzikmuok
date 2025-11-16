/**
 * Stylelint Configuration
 * 
 * Enforces CSS best practices and Tailwind compatibility
 * 
 * Phase: DEV/HYGIENE Sprint
 */

module.exports = {
  extends: [
    'stylelint-config-standard',
  ],
  rules: {
    // Note: Duplicate selectors should be fixed, but not blocking for now
    'no-duplicate-selectors': null,
    
    // No named colors (use tokens/hex)
    'color-named': 'never',
    
    // Note: !important discouraged but not enforced (existing usage)
    'declaration-no-important': null,
    
    // Allow Tailwind @apply directives and @theme (v4)
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer', 'theme'],
      },
    ],
    
    // Allow CSS custom properties (tokens)
    'custom-property-pattern': null,
    
    // Allow empty sources (for component-level styles)
    'no-empty-source': null,
    
    // Tailwind v4 compatibility rules
    'custom-property-empty-line-before': null,
    'color-hex-length': null, // Allow both #fff and #ffffff
    'import-notation': null, // Tailwind v4 uses string notation
    'color-function-notation': null,
    'alpha-value-notation': null,
    'color-function-alias-notation': null, // Allow rgba/rgb
    
    // Disable overly strict rules for existing codebase
    'value-keyword-case': null,
    'keyframes-name-pattern': null,
    'rule-empty-line-before': null,
    'font-family-name-quotes': null,
    'media-feature-range-notation': null,
    'property-no-vendor-prefix': null, // iOS compatibility
    'property-no-deprecated': null,
    'no-descending-specificity': null,
    'declaration-property-value-no-unknown': null, // iOS safe-area
    'length-zero-no-unit': null,
  },
};
