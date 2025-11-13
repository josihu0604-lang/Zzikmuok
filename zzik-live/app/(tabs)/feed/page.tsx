'use client';

import VerticalFeed, { type FeedItemData } from '@/components/feed/VerticalFeed';
import Empty from '@/components/states/Empty';
import { Camera } from 'lucide-react';

// Demo data (향후 API로 대체)
const DEMO_ITEMS: FeedItemData[] = [
  {
    id: '1',
    type: 'image',
    mediaUrl: '/screenshot-mobile-redesign.png',
    author: { name: 'ZZIK User', avatar: undefined },
    caption: '서울의 숨은 명소를 찾아서 📍 #여행 #서울',
    placeId: '1',
    placeName: '경복궁',
  },
  {
    id: '2',
    type: 'image',
    mediaUrl: '/screenshot-enhanced.png',
    author: { name: 'Travel Seoul', avatar: undefined },
    caption: '이 카페 분위기 정말 좋아요 ☕️',
    placeId: '2',
    placeName: '성수동 카페거리',
  },
  {
    id: '3',
    type: 'image',
    mediaUrl: '/screenshot-map-design.png',
    author: { name: 'Explorer', avatar: undefined },
    caption: '야경이 아름다운 곳 🌃',
    placeId: '3',
    placeName: 'N서울타워',
  },
];

export default function FeedPage() {
  // 데모 데이터가 없으면 Empty 상태 표시
  if (DEMO_ITEMS.length === 0) {
    return (
      <div className="h-[calc(100dvh-64px)] flex items-center justify-center bg-[color:var(--bg-primary)]">
        <Empty
          title="피드가 비어 있습니다"
          description="팔로우한 사용자의 포스트가 여기에 표시됩니다"
          action={
            <button className="min-h-[48px] px-6 py-2 bg-[color:var(--interactive-primary)] hover:bg-[color:var(--interactive-primary-hover)] text-white rounded-lg transition-colors flex items-center gap-2">
              <Camera className="h-5 w-5" />
              첫 포스트 작성하기
            </button>
          }
        />
      </div>
    );
  }

  return <VerticalFeed items={DEMO_ITEMS} />;
}
