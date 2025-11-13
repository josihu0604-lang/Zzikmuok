'use client';

import { useEffect } from 'react';
import { Map, MapPin, Search } from 'lucide-react';
import { useNavStore } from '@/lib/store/navigation-store';
import Empty from '@/components/states/Empty';

export default function ExplorePage() {
  const { explore, setExplore } = useNavStore();

  useEffect(() => {
    // 상태 복원 로직
    console.log('Explore state:', explore);
    
    // 지도 초기화 로직 (향후 구현)
    // if (explore.center) {
    //   map.setCenter(explore.center);
    //   map.setZoom(explore.zoom || 14);
    // }

    return () => {
      // 상태 저장 로직
      // setExplore({ center: map.getCenter(), zoom: map.getZoom() });
    };
  }, []);

  return (
    <div className="h-[calc(100dvh-64px)] overflow-hidden">
      {/* 임시 헤더 */}
      <div className="bg-[color:var(--bg-primary)] border-b border-[color:var(--border-primary)] p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-[color:var(--bg-secondary)] rounded-lg px-4 py-2 min-h-[48px]">
            <Search className="h-5 w-5 text-[color:var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="장소를 검색하세요"
              className="flex-1 bg-transparent border-none outline-none text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)]"
            />
          </div>
        </div>
      </div>

      {/* 지도 영역 (향후 구현) */}
      <div className="relative h-full bg-[color:var(--bg-secondary)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <Empty
            title="주변 장소 탐색"
            description="지도에서 주변의 흥미로운 장소를 찾아보세요"
            action={
              <button className="min-h-[48px] px-6 py-2 bg-[color:var(--interactive-primary)] hover:bg-[color:var(--interactive-primary-hover)] text-white rounded-lg transition-colors flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                내 위치로 이동
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
