/**
 * Format time ago in Korean
 * @param date Date or string (ISO 8601)
 */
export const timeAgo = (date: Date | string): string => {
  const diffSeconds = (Date.now() - new Date(date).getTime()) / 1000;

  if (diffSeconds < 60) return '방금';
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}분 전`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}시간 전`;
  if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 86400)}일 전`;
  if (diffSeconds < 31536000) return `${Math.floor(diffSeconds / 2592000)}개월 전`;
  return `${Math.floor(diffSeconds / 31536000)}년 전`;
};

/**
 * Format date to Korean locale
 * @param date Date or string
 */
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to Korean locale
 * @param date Date or string
 */
export const formatTime = (date: Date | string): string => {
  return new Date(date).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
