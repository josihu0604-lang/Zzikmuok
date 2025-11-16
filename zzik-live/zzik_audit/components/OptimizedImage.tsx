'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * OptimizedImage Component
 * 
 * Optimized image loading with:
 * - Next.js Image optimization
 * - Lazy loading
 * - Blur placeholder
 * - Loading states
 * - Error handling
 * - Responsive sizing
 */

export interface OptimizedImageProps {
  /**
   * Image source URL
   */
  src: string;

  /**
   * Alt text for accessibility
   */
  alt: string;

  /**
   * Image width
   */
  width?: number;

  /**
   * Image height
   */
  height?: number;

  /**
   * Fill container
   * @default false
   */
  fill?: boolean;

  /**
   * Object fit style
   * @default 'cover'
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Priority loading (disable lazy load)
   * @default false
   */
  priority?: boolean;

  /**
   * Image quality (1-100)
   * @default 75
   */
  quality?: number;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Show loading animation
   * @default true
   */
  showLoading?: boolean;

  /**
   * Fallback image on error
   */
  fallbackSrc?: string;

  /**
   * Aspect ratio
   */
  aspectRatio?: '1/1' | '4/3' | '16/9' | '3/2' | '21/9';
}

/**
 * OptimizedImage Component
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/photo.jpg"
 *   alt="Mission photo"
 *   width={800}
 *   height={600}
 *   quality={85}
 * />
 * 
 * <OptimizedImage
 *   src="/avatar.jpg"
 *   alt="User avatar"
 *   fill
 *   aspectRatio="1/1"
 * />
 * ```
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  objectFit = 'cover',
  priority = false,
  quality = 75,
  className,
  showLoading = true,
  fallbackSrc = '/placeholder-image.jpg',
  aspectRatio,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const imageSrc = hasError ? fallbackSrc : src;

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        aspectRatio && `aspect-[${aspectRatio.replace('/', '-')}]`,
        className
      )}
      style={
        aspectRatio
          ? { aspectRatio: aspectRatio.replace('/', ' / ') }
          : undefined
      }
    >
      {/* Loading Skeleton */}
      {isLoading && showLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"
        />
      )}

      {/* Image */}
      <Image
        src={imageSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={src.endsWith('.svg')}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down'
        )}
        sizes={
          fill
            ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            : undefined
        }
      />
    </div>
  );
};

/**
 * Avatar Component
 * 
 * Optimized circular avatar image
 */
export interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  fallback = '/avatar-default.jpg',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size], className)}>
      <OptimizedImage
        src={src || fallback}
        alt={alt}
        fill
        objectFit="cover"
        quality={90}
      />
    </div>
  );
};

export default OptimizedImage;
