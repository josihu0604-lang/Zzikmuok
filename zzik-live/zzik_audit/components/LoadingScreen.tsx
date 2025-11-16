'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Loading Screen Component
 * 
 * Displays a full-screen loading animation with ZZIK LIVE branding
 * Used as Suspense fallback for route-level code splitting
 */

interface LoadingScreenProps {
  /**
   * Text to display below the spinner
   * @default "로딩 중..."
   */
  message?: string;
  /**
   * If true, displays as inline loader instead of full screen
   * @default false
   */
  inline?: boolean;
}

export function LoadingScreen({ message = '로딩 중...', inline = false }: LoadingScreenProps) {
  if (inline) {
    return (
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          <p className="text-sm text-gray-600">{message}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }
          }}
          className="relative"
        >
          {/* Pulse Animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-white rounded-full blur-xl"
          />
          
          {/* Logo Circle */}
          <div className="relative w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center">
            <div className="text-4xl font-bold bg-gradient-to-br from-primary-500 to-purple-600 bg-clip-text text-transparent">
              Z
            </div>
          </div>
        </motion.div>

        {/* Spinner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              delay: 0.2,
            }
          }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <p className="text-white text-lg font-medium">{message}</p>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: {
              delay: 0.4,
            }
          }}
          className="text-white/90 text-sm font-medium tracking-wider"
        >
          ZZIK LIVE
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Page Loading Skeleton
 * 
 * Displays a skeleton layout while page content is loading
 * Used for route-level Suspense boundaries
 */
export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="w-32 h-8 bg-gray-200 rounded" />
          <div className="w-24 h-8 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="h-64 bg-white rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-white rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Component Loading Skeleton
 * 
 * Minimal skeleton for component-level suspense
 */
export function ComponentLoadingSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default LoadingScreen;
