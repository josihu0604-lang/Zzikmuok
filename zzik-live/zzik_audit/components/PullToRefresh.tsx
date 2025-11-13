'use client';

import { useState, useRef, useCallback, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

/**
 * Pull to Refresh Component - ZZIK LIVE
 * 
 * Mobile-optimized pull-to-refresh functionality
 * Features:
 * - Touch gesture detection
 * - Loading state with spinner
 * - Customizable threshold
 * - Haptic feedback
 * - Smooth animations
 */

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  maxPull = 150,
  disabled = false,
  className = '',
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pullDistance = useMotionValue(0);
  
  // Transform pull distance to rotation for spinner
  const rotate = useTransform(pullDistance, [0, threshold], [0, 360]);
  const scale = useTransform(pullDistance, [0, threshold], [0.5, 1]);
  const opacity = useTransform(pullDistance, [0, threshold / 2], [0, 1]);

  const handleDragStart = useCallback(() => {
    if (disabled || isRefreshing) return false;
    
    // Only allow pull if at top of scroll
    const container = containerRef.current;
    if (container && container.scrollTop > 0) {
      return false;
    }
    
    return true;
  }, [disabled, isRefreshing]);

  const handleDrag = useCallback(
    (event: any, info: PanInfo) => {
      if (disabled || isRefreshing) return;
      
      const distance = Math.max(0, Math.min(info.offset.y, maxPull));
      pullDistance.set(distance);
      
      // Set can refresh flag
      if (distance >= threshold && !canRefresh) {
        setCanRefresh(true);
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      } else if (distance < threshold && canRefresh) {
        setCanRefresh(false);
      }
    },
    [disabled, isRefreshing, threshold, maxPull, canRefresh, pullDistance]
  );

  const handleDragEnd = useCallback(
    async (event: any, info: PanInfo) => {
      if (disabled || isRefreshing) {
        pullDistance.set(0);
        return;
      }
      
      const distance = pullDistance.get();
      
      if (distance >= threshold) {
        // Trigger refresh
        setIsRefreshing(true);
        setCanRefresh(false);
        
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
          pullDistance.set(0);
        }
      } else {
        // Reset to initial state
        pullDistance.set(0);
        setCanRefresh(false);
      }
    },
    [disabled, isRefreshing, threshold, onRefresh, pullDistance]
  );

  return (
    <div ref={containerRef} className={`relative overflow-auto ${className}`}>
      {/* Pull Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center"
        style={{
          height: pullDistance,
        }}
      >
        <motion.div
          style={{
            rotate: isRefreshing ? undefined : rotate,
            scale,
            opacity,
          }}
          animate={
            isRefreshing
              ? {
                  rotate: 360,
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }
              : undefined
          }
          className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg"
        >
          <RefreshCw
            className={`w-6 h-6 ${
              canRefresh ? 'text-primary-600' : 'text-gray-400'
            }`}
          />
        </motion.div>
      </motion.div>

      {/* Content with drag gesture */}
      <motion.div
        drag="y"
        dragDirectionLock
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        dragConstraints={{ top: 0, bottom: 0 }}
        style={{
          y: pullDistance,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Simple Refresh Button (fallback for desktop)
 */
interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
  className?: string;
}

export function RefreshButton({ onRefresh, className = '' }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      disabled={isRefreshing}
      className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
    >
      <motion.div
        animate={
          isRefreshing
            ? {
                rotate: 360,
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }
            : { rotate: 0 }
        }
      >
        <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </motion.div>
    </motion.button>
  );
}

export default PullToRefresh;
