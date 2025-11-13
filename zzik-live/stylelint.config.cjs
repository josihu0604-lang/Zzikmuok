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
    // Prevent duplicate selectors
    'no-duplicate-selectors': true,
    
    // No named colors (use tokens/hex)
    'color-named': 'never',
    
    // Discourage !important (use specificity)
    'declaration-no-important': true,
    
    // Allow Tailwind @apply directives
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'],
      },
    ],
    
    // Allow CSS custom properties (tokens)
    'custom-property-pattern': null,
    
    // Allow empty sources (for component-level styles)
    'no-empty-source': null,
  },
};
