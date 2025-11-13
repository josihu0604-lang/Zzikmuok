'use client';

import * as React from 'react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * BottomSheet Component - ZZIK LIVE Design System v1.0
 * 
 * Based on UXUI_SPECIFICATION.md Section 5.1
 * Draggable bottom drawer with snap points
 * Used for map overlay content
 */

export interface BottomSheetProps {
  /**
   * Sheet open state
   */
  open: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Sheet content
   */
  children: React.ReactNode;

  /**
   * Initial snap point
   * @default 'default'
   */
  initialSnap?: 'collapsed' | 'default' | 'expanded';

  /**
   * Enable snap points
   * @default true
   */
  enableSnap?: boolean;

  /**
   * Show drag handle
   * @default true
   */
  showHandle?: boolean;

  /**
   * Close on backdrop click
   * @default true
   */
  closeOnBackdrop?: boolean;

  /**
   * Custom snap points (in vh units)
   */
  snapPoints?: {
    collapsed?: number;
    default?: number;
    expanded?: number;
  };

  /**
   * Callback when snap point changes
   */
  onSnapChange?: (snap: 'collapsed' | 'default' | 'expanded') => void;
}

/**
 * BottomSheet Component
 * 
 * Draggable bottom drawer with three snap points:
 * - Collapsed: 20vh
 * - Default: 45vh
 * - Expanded: 80vh
 * 
 * @example
 * ```tsx
 * <BottomSheet
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   initialSnap="default"
 * >
 *   <h3>Location Details</h3>
 *   <PhotoGallery photos={photos} />
 * </BottomSheet>
 * ```
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  children,
  initialSnap = 'default',
  enableSnap = true,
  showHandle = true,
  closeOnBackdrop = true,
  snapPoints = {
    collapsed: 20,
    default: 45,
    expanded: 80,
  },
  onSnapChange,
}) => {
  const dragControls = useDragControls();

  const [currentSnap, setCurrentSnap] = React.useState<
    'collapsed' | 'default' | 'expanded'
  >(initialSnap);

  // Convert snap point to vh
  const snapToHeight = {
    collapsed: snapPoints.collapsed || 20,
    default: snapPoints.default || 45,
    expanded: snapPoints.expanded || 80,
  };

  // Current height in vh
  const [height, setHeight] = React.useState(snapToHeight[initialSnap]);

  // Prevent body scroll when sheet is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle drag
  const handleDrag = (event: any, info: PanInfo) => {
    const windowHeight = window.innerHeight;
    const deltaY = info.offset.y;
    const deltaVh = (deltaY / windowHeight) * 100;
    
    // Calculate new height (inverted because dragging down decreases height)
    const newHeight = Math.max(10, Math.min(90, height - deltaVh));
    setHeight(newHeight);
  };

  // Handle drag end - snap to nearest point
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!enableSnap) return;

    const velocity = info.velocity.y;
    const currentHeight = height;

    // Fast swipe down = collapse or close
    if (velocity > 500) {
      if (currentSnap === 'collapsed') {
        onClose();
      } else {
        snapTo('collapsed');
      }
      return;
    }

    // Fast swipe up = expand
    if (velocity < -500) {
      snapTo('expanded');
      return;
    }

    // Snap to nearest point
    const points = Object.entries(snapToHeight) as [
      keyof typeof snapToHeight,
      number
    ][];
    
    const nearest = points.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev[1] - currentHeight);
      const currDiff = Math.abs(curr[1] - currentHeight);
      return currDiff < prevDiff ? curr : prev;
    });

    snapTo(nearest[0]);
  };

  // Snap to specific height
  const snapTo = (snap: 'collapsed' | 'default' | 'expanded') => {
    const targetHeight = snapToHeight[snap];
    setHeight(targetHeight);
    setCurrentSnap(snap);
    onSnapChange?.(snap);
  };

  return (
    <>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[1200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Bottom Sheet */}
          <motion.div
            className={cn(
              'fixed bottom-0 left-0 right-0',
              'bg-white rounded-t-3xl shadow-2xl z-[1300]',
              'overflow-hidden flex flex-col'
            )}
            style={{
              height: `${height}vh`,
              touchAction: 'none',
            }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Drag Handle */}
            {showHandle && (
              <div
                className="w-full py-4 flex justify-center cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

// ============================================
// Map Drawer (Specialized BottomSheet)
// ============================================

export interface MapDrawerProps {
  /**
   * Drawer open state
   */
  open: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Selected location data
   */
  location?: {
    name: string;
    address: string;
    category: string;
    distance: string;
  };

  /**
   * Photos at this location
   */
  photos?: Array<{
    id: string;
    imageUrl: string;
    likes: number;
  }>;

  /**
   * Mission at this location
   */
  mission?: {
    id: string;
    reward: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };

  /**
   * View mission details handler
   */
  onViewMission?: () => void;
}

/**
 * Map Drawer Component
 * 
 * Specialized BottomSheet for map overlay
 * Shows location info, photos, and mission details
 * 
 * @example
 * ```tsx
 * <MapDrawer
 *   open={selectedLocation !== null}
 *   onClose={() => setSelectedLocation(null)}
 *   location={selectedLocation}
 *   photos={locationPhotos}
 *   mission={locationMission}
 *   onViewMission={() => navigate('/mission/1')}
 * />
 * ```
 */
export const MapDrawer: React.FC<MapDrawerProps> = ({
  open,
  onClose,
  location,
  photos = [],
  mission,
  onViewMission,
}) => {
  return (
    <BottomSheet open={open} onClose={onClose} initialSnap="default">
      {location && (
        <div className="space-y-6">
          {/* Location Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {location.name}
            </h2>
            <p className="text-gray-600 mb-1">{location.address}</p>
            <div className="flex items-center gap-3">
              <span className="inline-flex px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                {location.category}
              </span>
              <span className="text-gray-500 text-sm">{location.distance}</span>
            </div>
          </div>

          {/* Mission Info */}
          {mission && (
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  진행 가능한 미션
                </h3>
                <span className="text-2xl font-bold text-primary-600">
                  {mission.reward.toLocaleString()}원
                </span>
              </div>
              <button
                onClick={onViewMission}
                className={cn(
                  'w-full py-3 rounded-xl font-semibold',
                  'bg-primary-500 text-white',
                  'hover:bg-primary-600 transition-colors'
                )}
              >
                미션 시작하기
              </button>
            </div>
          )}

          {/* Photo Gallery */}
          {photos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                이 장소의 사진 ({photos.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative aspect-square">
                    <img
                      src={photo.imageUrl}
                      alt="Location photo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <span className="text-white text-xs font-medium">
                        {photo.likes}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
};

export default BottomSheet;
