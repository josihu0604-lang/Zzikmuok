'use client';

import { useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Infinite Scroll Component - ZZIK LIVE
 * 
 * Implements infinite scrolling pagination
 * Features:
 * - Intersection Observer API
 * - Loading state
 * - End of list detection
 * - Error handling
 * - Retry mechanism
 */

interface InfiniteScrollProps<T> {
  /**
   * Array of items to render (optional - can be used as trigger only)
   */
  items?: T[];
  /**
   * Render function for each item (optional - can be used as trigger only)
   */
  renderItem?: (item: T, index: number) => ReactNode;
  /**
   * Function to load more items
   * Should return true if there are more items, false if end reached (optional return)
   */
  onLoadMore: () => Promise<boolean | void>;
  /**
   * Loading state from parent
   */
  isLoading?: boolean;
  /**
   * Has more items to load
   */
  hasMore?: boolean;
  /**
   * Error state
   */
  error?: Error | null;
  /**
   * Threshold in pixels from bottom to trigger load
   */
  threshold?: number;
  /**
   * Loading skeleton component
   */
  loadingComponent?: ReactNode;
  /**
   * End of list component
   */
  endComponent?: ReactNode;
  /**
   * Container className
   */
  className?: string;
}

export function InfiniteScroll<T>({
  items,
  renderItem,
  onLoadMore,
  isLoading = false,
  hasMore = true,
  error = null,
  threshold = 200,
  loadingComponent,
  endComponent,
  className = '',
}: InfiniteScrollProps<T>) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalHasMore, setInternalHasMore] = useState(hasMore);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !internalHasMore) return;
    
    isLoadingRef.current = true;
    setInternalLoading(true);

    try {
      const more = await onLoadMore();
      if (more !== undefined) {
        setInternalHasMore(more);
      }
    } catch (error) {
      console.error('Failed to load more items:', error);
    } finally {
      setInternalLoading(false);
      isLoadingRef.current = false;
    }
  }, [onLoadMore, internalHasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && !internalLoading && internalHasMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: `${threshold}px`,
        threshold: 0,
      }
    );

    observer.observe(target);

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [threshold, isLoading, internalLoading, internalHasMore, loadMore]);

  // Update internal state when props change
  useEffect(() => {
    setInternalHasMore(hasMore);
  }, [hasMore]);

  const showLoading = isLoading || internalLoading;

  return (
    <div className={className}>
      {/* Items */}
      {items && renderItem && items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}

      {/* Loading Indicator */}
      {showLoading && (
        <div className="py-8">
          {loadingComponent || <DefaultLoadingComponent />}
        </div>
      )}

      {/* Error State */}
      {error && !showLoading && (
        <ErrorComponent error={error} onRetry={loadMore} />
      )}

      {/* End of List */}
      {!internalHasMore && !showLoading && items.length > 0 && (
        <div className="py-8">
          {endComponent || <DefaultEndComponent />}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && !showLoading && (
        <EmptyComponent />
      )}

      {/* Observer Target */}
      <div ref={observerTarget} className="h-4" />
    </div>
  );
}

/**
 * Default Loading Component
 */
function DefaultLoadingComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-3"
    >
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        더 많은 미션을 불러오는 중...
      </p>
    </motion.div>
  );
}

/**
 * Default End Component
 */
function DefaultEndComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="inline-block px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          🎉 모든 미션을 확인했습니다
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Error Component
 */
interface ErrorComponentProps {
  error: Error;
  onRetry: () => void;
}

function ErrorComponent({ error, onRetry }: ErrorComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4 py-8"
    >
      <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-900/20 flex items-center justify-center">
        <span className="text-2xl">😕</span>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          미션을 불러올 수 없습니다
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {error.message || '네트워크 연결을 확인해주세요'}
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRetry}
        className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
      >
        다시 시도
      </motion.button>
    </motion.div>
  );
}

/**
 * Empty Component
 */
function EmptyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-16"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <span className="text-3xl">🔍</span>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          미션이 없습니다
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          다른 카테고리나 위치를 선택해보세요
        </p>
      </div>
    </motion.div>
  );
}

/**
 * useInfiniteScroll hook for managing pagination state
 */
interface UseInfiniteScrollOptions<T> {
  initialItems?: T[];
  pageSize?: number;
  fetchPage: (page: number) => Promise<T[]>;
}

export function useInfiniteScroll<T>({
  initialItems = [],
  pageSize = 10,
  fetchPage,
}: UseInfiniteScrollOptions<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async (): Promise<boolean> => {
    if (isLoading || !hasMore) return false;

    setIsLoading(true);
    setError(null);

    try {
      const newItems = await fetchPage(page);
      
      if (newItems.length === 0 || newItems.length < pageSize) {
        setHasMore(false);
      }

      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);

      return newItems.length > 0;
    } catch (err) {
      const error = err as Error;
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, isLoading, hasMore, fetchPage]);

  const reset = useCallback(() => {
    setItems(initialItems);
    setPage(1);
    setHasMore(true);
    setIsLoading(false);
    setError(null);
  }, [initialItems]);

  return {
    items,
    hasMore,
    isLoading,
    error,
    loadMore,
    reset,
  };
}

export default InfiniteScroll;
