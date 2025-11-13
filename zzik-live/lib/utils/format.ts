/**
 * Format metrics for display
 * - < 1,000: Display as-is (e.g., 523)
 * - >= 1,000: Display with K (e.g., 1.5K)
 * - >= 1,000,000: Display with M (e.g., 1.2M)
 */
export const formatMetric = (n?: number): string => {
  if (n == null) return '0';
  if (n < 1_000) return String(n);
  if (n < 1_000_000) {
    const k = Math.round((n / 100)) / 10;
    return `${k}K`.replace('.0K', 'K');
  }
  const m = Math.round((n / 100_000)) / 10;
  return `${m}M`.replace('.0M', 'M');
};
