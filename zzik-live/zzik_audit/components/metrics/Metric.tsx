import { Eye, Heart, MessageCircle, Share2, Bookmark, Star, MapPin, Users } from 'lucide-react';
import { formatMetric } from '@/lib/utils/format';

type Kind =
  | 'views'
  | 'likes'
  | 'comments'
  | 'shares'
  | 'bookmarks'
  | 'rating'
  | 'visits'
  | 'reviews';

const ICONS: Record<Kind, any> = {
  views: Eye,
  likes: Heart,
  comments: MessageCircle,
  shares: Share2,
  bookmarks: Bookmark,
  rating: Star,
  visits: Users,
  reviews: MessageCircle,
};

const LABELS: Record<Kind, string> = {
  views: '조회',
  likes: '좋아요',
  comments: '댓글',
  shares: '공유',
  bookmarks: '저장',
  rating: '평점',
  visits: '방문',
  reviews: '리뷰',
};

export default function Metric({
  kind,
  value,
  labelHidden = false,
  iconOnly = false,
}: {
  kind: Kind;
  value?: number;
  labelHidden?: boolean;
  iconOnly?: boolean;
}) {
  const Icon = ICONS[kind];
  const label = LABELS[kind];
  const formattedValue = formatMetric(value);

  if (iconOnly) {
    return (
      <div
        className="inline-flex items-center justify-center"
        aria-label={`${label} ${value ?? 0}`}
      >
        <Icon className="h-4 w-4 opacity-80" aria-hidden />
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1"
      aria-label={`${label} ${value ?? 0}`}
    >
      <Icon className="h-4 w-4 opacity-80" aria-hidden />
      <span className="text-sm font-medium text-[color:var(--text-primary)]">
        {formattedValue}
      </span>
      {!labelHidden && (
        <span className="text-xs opacity-70 text-[color:var(--text-tertiary)]">
          {label}
        </span>
      )}
    </div>
  );
}
