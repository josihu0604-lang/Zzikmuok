/**
 * ZZIK Analytics ESLint Plugin
 * 
 * Custom rules for enforcing analytics best practices
 */

module.exports = {
  rules: {
    'no-pii-in-analytics': require('./rules/no-pii-in-analytics'),
  },
};
