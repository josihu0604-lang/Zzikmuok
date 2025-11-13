'use client';

import { useEffect, useRef } from 'react';
import { useNavStore } from '@/lib/store/navigation-store';
import Empty from '@/components/states/Empty';
import { Camera } from 'lucide-react';

export default function FeedPage() {
  const listRef = useRef<HTMLDivElement>(null);
  const { feed, setFeed } = useNavStore();

  useEffect(() => {
    // 스크롤 위치 복원
    if (feed.scrollY && listRef.current) {
      listRef.current.scrollTo({ top: feed.scrollY, behavior: 'auto' });
    }

    return () => {
      // 스크롤 위치 저장
      if (listRef.current) {
        setFeed({ scrollY: listRef.current.scrollTop });
      }
    };
  }, []);

  return (
    <div
      ref={listRef}
      className="h-[calc(100dvh-64px)] overflow-y-auto px-4 py-4 bg-[color:var(--bg-primary)]"
    >
      {/* 임시 빈 상태 */}
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
