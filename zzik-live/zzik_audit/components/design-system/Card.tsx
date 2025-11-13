'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Coins, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { OptimizedImage, Avatar } from '@/components/OptimizedImage';

/**
 * Card Components - ZZIK LIVE Design System v1.0
 * 
 * Based on UXUI_SPECIFICATION.md Section 6.2
 * Implements Mission Card and Photo Card with interactive animations
 */

// ============================================
// Mission Card
// ============================================

export interface MissionCardProps {
  mission: {
    id: string;
    name: string;
    category: string;
    reward: number;
    distance: string;
    imageUrl: string;
    difficulty: 'easy' | 'medium' | 'hard';
    expiresAt: Date;
  };
  onTap?: () => void;
}

/**
 * Mission Card Component
 * 
 * Displays mission information with image, category, difficulty, and reward
 * Includes hover and tap animations
 * 
 * @example
 * ```tsx
 * <MissionCard
 *   mission={{
 *     id: '1',
 *     name: '성수 카페 방문',
 *     category: '카페',
 *     reward: 15000,
 *     distance: '0.5km',
 *     imageUrl: '/images/cafe.jpg',
 *     difficulty: 'easy',
 *     expiresAt: new Date()
 *   }}
 *   onTap={() => navigate('/mission/1')}
 * />
 * ```
 */
export const MissionCard: React.FC<MissionCardProps> = ({ mission, onTap }) => {
  const difficultyColors = {
    easy: 'bg-success-100 text-success-700',
    medium: 'bg-warning-100 text-warning-700',
    hard: 'bg-error-100 text-error-700',
  };

  const difficultyLabels = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  };

  return (
    <motion.div
      className={cn(
        'bg-white rounded-2xl shadow-lg overflow-hidden',
        'border border-gray-100 cursor-pointer'
      )}
      onClick={onTap}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={mission.imageUrl}
          alt={mission.name}
          fill
          quality={75}
          className="object-cover"
        />

        {/* Difficulty Badge */}
        <div
          className={cn(
            'absolute top-3 right-3 px-3 py-1 rounded-full z-10',
            'text-xs font-semibold backdrop-blur-sm',
            difficultyColors[mission.difficulty]
          )}
        >
          {difficultyLabels[mission.difficulty]}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              'bg-white/90 backdrop-blur-sm text-gray-900'
            )}
          >
            {mission.category}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{mission.name}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Distance */}
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{mission.distance}</span>
            </div>

            {/* Time Remaining */}
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {formatDistanceToNow(mission.expiresAt, { locale: ko })}
              </span>
            </div>
          </div>

          {/* Reward */}
          <div className="flex items-center gap-1">
            <Coins className="w-5 h-5 text-warning-500" />
            <span className="text-lg font-bold text-gray-900">
              {mission.reward.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// Photo Card
// ============================================

export interface PhotoCardProps {
  photo: {
    id: string;
    imageUrl: string;
    views: string;
    likes: number;
    creator: {
      name: string;
      avatarUrl: string;
    };
    createdAt: Date;
  };
  onLike?: () => void;
}

/**
 * Photo Card Component
 * 
 * Displays user-generated photo with creator info and engagement stats
 * Used in map drawer and gallery views
 * 
 * @example
 * ```tsx
 * <PhotoCard
 *   photo={{
 *     id: '1',
 *     imageUrl: '/photos/photo1.jpg',
 *     views: '1.2K',
 *     likes: 45,
 *     creator: {
 *       name: '민지',
 *       avatarUrl: '/avatars/minji.jpg'
 *     },
 *     createdAt: new Date()
 *   }}
 *   onLike={() => handleLike('1')}
 * />
 * ```
 */
export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, onLike }) => {
  const [liked, setLiked] = React.useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    onLike?.();
  };

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer h-48"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <OptimizedImage
        src={photo.imageUrl}
        alt="Photo"
        fill
        quality={80}
        className="object-cover"
      />

      {/* Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t z-10',
          'from-black/60 via-black/20 to-transparent',
          'flex flex-col justify-end p-4'
        )}
      >
        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar
            src={photo.creator.avatarUrl}
            alt={photo.creator.name}
            size="sm"
            className="border-2 border-white"
          />
          <span className="text-white text-sm font-medium">
            {photo.creator.name}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Views */}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-white text-sm">{photo.views}</span>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-1">
              <Heart
                className={cn(
                  'w-4 h-4 transition-colors',
                  liked ? 'fill-red-500 text-red-500' : 'text-white'
                )}
              />
              <span className="text-white text-sm">{photo.likes}</span>
            </div>
          </div>

          {/* Time Ago */}
          <span className="text-white/80 text-xs">
            {formatDistanceToNow(photo.createdAt, {
              locale: ko,
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* Like Button */}
      <motion.button
        className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm"
        onClick={handleLikeClick}
        whileTap={{ scale: 0.85 }}
      >
        <Heart
          className={cn(
            'w-5 h-5 transition-colors',
            liked ? 'fill-red-500 text-red-500' : 'text-white'
          )}
        />
      </motion.button>
    </motion.div>
  );
};

// ============================================
// Base Card (for general use)
// ============================================

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Base Card Component
 * 
 * General purpose card with configurable padding and hover effects
 * 
 * @example
 * ```tsx
 * <Card padding="md" hoverable>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  onClick,
  hoverable = false,
}) => {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const Component = hoverable ? motion.div : 'div';

  const hoverProps = hoverable
    ? {
        whileHover: { scale: 1.02, y: -2 },
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Component
      className={cn(
        'bg-white rounded-2xl shadow-lg border border-gray-100',
        paddingStyles[padding],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  );
};

export default Card;
