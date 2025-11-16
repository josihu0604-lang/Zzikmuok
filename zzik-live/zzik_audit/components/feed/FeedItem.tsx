'use client';

import { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin } from 'lucide-react';
import type { FeedItemData } from './VerticalFeed';
import { track } from '@/lib/analytics/client';
import { markPostVisible, flushActive } from '@/lib/analytics/flushOnHide';

export function FeedItem({
  item,
  active,
}: {
  item: FeedItemData;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Post view lifecycle tracking
  useEffect(() => {
    if (active) {
      markPostVisible(item.id, item.placeId, 'feed');
    } else {
      flushActive();
    }
  }, [active, item.id, item.placeId]);

  // Video playback tracking
  useEffect(() => {
    if (item.type !== 'video') return;

    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      track('perf_web_vitals', {
        name: 'video_play',
        value: video.currentTime,
        id: `${item.id}-play-${Date.now()}`,
      });
    };

    const handlePause = () => {
      track('perf_web_vitals', {
        name: 'video_pause',
        value: video.currentTime,
        id: `${item.id}-pause-${Date.now()}`,
      });
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [item.type, item.id]);

  // Auto-play/pause based on active state
  useEffect(() => {
    if (item.type !== 'video') return;

    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.play().catch((err) => {
        console.warn('Auto-play failed:', err);
      });
    } else {
      video.pause();
    }
  }, [active, item.type]);

  return (
    <div className="relative w-full h-full bg-black">
      {/* Media */}
      {item.type === 'video' ? (
        <video
          ref={videoRef}
          src={item.mediaUrl}
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
          aria-label={item.caption || '동영상 콘텐츠'}
        />
      ) : (
        <img
          src={item.mediaUrl}
          alt={item.caption || '이미지 콘텐츠'}
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay Content */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top: Author Info */}
        {item.author && (
          <div className="absolute top-safe left-4 right-4 pt-4 pointer-events-auto">
            <div className="flex items-center gap-2">
              {item.author.avatar && (
                <img
                  src={item.author.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white"
                />
              )}
              <span className="text-white font-semibold drop-shadow-lg">
                {item.author.name}
              </span>
            </div>
          </div>
        )}

        {/* Bottom: Actions & Caption */}
        <div className="absolute bottom-safe left-4 right-20 pb-8 pointer-events-auto">
          {/* Caption */}
          {item.caption && (
            <p className="text-white text-sm mb-4 drop-shadow-lg line-clamp-2">
              {item.caption}
            </p>
          )}

          {/* Place Link */}
          {item.placeId && item.placeName && (
            <button
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4"
              aria-label={`${item.placeName} 장소 보기`}
            >
              <MapPin className="h-4 w-4 text-white" aria-hidden />
              <span className="text-white text-xs font-medium">
                {item.placeName}
              </span>
            </button>
          )}
        </div>

        {/* Right: Action Stack */}
        <div className="absolute bottom-safe right-4 pb-8 flex flex-col gap-6 pointer-events-auto">
          <ActionButton
            icon={Heart}
            label="좋아요"
            count="1.2K"
            active={isLiked}
            onClick={() => {
              const newState = !isLiked;
              setIsLiked(newState);
              track('like_toggle', {
                target: 'post',
                id: item.id,
                active: newState,
                source: 'feed',
              });
            }}
          />
          <ActionButton
            icon={MessageCircle}
            label="댓글"
            count="234"
            active={false}
            onClick={() => {
              console.log('Comments not implemented yet');
            }}
          />
          <ActionButton
            icon={Share2}
            label="공유"
            active={false}
            onClick={() => {
              console.log('Share not implemented yet');
            }}
          />
          <ActionButton
            icon={Bookmark}
            label="저장"
            active={isSaved}
            onClick={() => {
              const newState = !isSaved;
              setIsSaved(newState);
              track('save_toggle', {
                target: 'post',
                id: item.id,
                active: newState,
                source: 'feed',
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: any;
  label: string;
  count?: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className="flex flex-col items-center gap-1"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
    >
      <div
        className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
          active
            ? 'bg-[color:var(--interactive-primary)] text-white'
            : 'bg-white/20 backdrop-blur-sm text-white'
        }`}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      {count && (
        <span className="text-white text-xs font-medium drop-shadow-lg">
          {count}
        </span>
      )}
    </button>
  );
}
