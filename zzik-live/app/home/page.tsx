'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Bell, Search, ChevronDown, TrendingUp, Navigation as NavigationIcon, X } from 'lucide-react';
import { MissionCard } from '@/components/design-system';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import { PageWithNav } from '@/components/NavigationBar';
import { SearchBar, SearchFilter } from '@/components/SearchBar';
import { PullToRefresh } from '@/components/PullToRefresh';
import { InfiniteScroll } from '@/components/InfiniteScroll';

/**
 * Home Screen - ZZIK LIVE
 * 
 * Based on UXUI_SPECIFICATION.md Section 7.1
 * Features:
 * - Location bar with current position
 * - Category filter (horizontal scroll)
 * - Trending missions (horizontal carousel)
 * - Nearby missions (vertical list)
 * - Pull to refresh
 */

// Mock data types
interface Mission {
  id: string;
  name: string;
  category: string;
  reward: number;
  distance: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expiresAt: Date;
  trending?: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

// Mock data
const categories: Category[] = [
  { id: 'all', label: '전체', icon: '🎯' },
  { id: 'cafe', label: '카페', icon: '☕' },
  { id: 'restaurant', label: '레스토랑', icon: '🍽️' },
  { id: 'bar', label: '바', icon: '🍺' },
  { id: 'bakery', label: '베이커리', icon: '🥐' },
  { id: 'dessert', label: '디저트', icon: '🍰' },
];

const mockMissions: Mission[] = [
  {
    id: '1',
    name: '성수 카페 방문',
    category: 'cafe',
    reward: 15000,
    distance: '0.3km',
    imageUrl: '/images/placeholder-cafe.svg',
    difficulty: 'easy',
    expiresAt: new Date(Date.now() + 86400000 * 2),
    trending: true,
  },
  {
    id: '2',
    name: '홍대 레스토랑',
    category: 'restaurant',
    reward: 20000,
    distance: '0.8km',
    imageUrl: '/images/placeholder-restaurant.svg',
    difficulty: 'medium',
    expiresAt: new Date(Date.now() + 86400000 * 3),
    trending: true,
  },
  {
    id: '3',
    name: '강남 디저트 카페',
    category: 'dessert',
    reward: 18000,
    distance: '1.2km',
    imageUrl: '/images/placeholder-dessert.svg',
    difficulty: 'easy',
    expiresAt: new Date(Date.now() + 86400000),
    trending: true,
  },
  {
    id: '4',
    name: '이태원 브런치',
    category: 'restaurant',
    reward: 25000,
    distance: '1.5km',
    imageUrl: '/images/placeholder-cafe.svg',
    difficulty: 'hard',
    expiresAt: new Date(Date.now() + 86400000 * 4),
  },
  {
    id: '5',
    name: '압구정 베이커리',
    category: 'bakery',
    reward: 12000,
    distance: '0.5km',
    imageUrl: '/images/placeholder-dessert.svg',
    difficulty: 'easy',
    expiresAt: new Date(Date.now() + 86400000 * 2),
  },
  {
    id: '6',
    name: '청담 프렌치',
    category: 'restaurant',
    reward: 30000,
    distance: '2.0km',
    imageUrl: '/images/placeholder-french.svg',
    difficulty: 'hard',
    expiresAt: new Date(Date.now() + 86400000 * 5),
    trending: true,
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [location, setLocation] = useState({
    name: '성수동',
    nearbyCount: 12,
    radius: 2,
  });
  
  // Infinite scroll state
  const [displayedMissions, setDisplayedMissions] = useState<typeof mockMissions>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 6;

  const searchFilters: SearchFilter[] = [
    { id: 'nearby', label: '근처만', value: 'nearby', active: false },
    { id: 'easy', label: '쉬운 미션', value: 'easy', active: false },
    { id: 'high-reward', label: '고액 리워드', value: 'high-reward', active: false },
  ];

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter missions by category and search
  const filteredMissions = useMemo(() => {
    let filtered = mockMissions;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((m) => m.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  // Separate trending missions
  const trendingMissions = mockMissions.filter((m) => m.trending);
  
  // Initialize displayed missions
  useEffect(() => {
    const initialMissions = filteredMissions.slice(0, ITEMS_PER_PAGE);
    setDisplayedMissions(initialMissions);
    setHasMore(filteredMissions.length > ITEMS_PER_PAGE);
    setPage(1);
  }, [filteredMissions]);
  
  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    // Simulate API refresh (1 second delay)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Reset to first page
    const refreshedMissions = filteredMissions.slice(0, ITEMS_PER_PAGE);
    setDisplayedMissions(refreshedMissions);
    setHasMore(filteredMissions.length > ITEMS_PER_PAGE);
    setPage(1);
  }, [filteredMissions]);
  
  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (!hasMore) return false;
    
    // Simulate API call (500ms delay)
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newMissions = filteredMissions.slice(startIndex, endIndex);
    
    if (newMissions.length === 0) {
      setHasMore(false);
      return false;
    }
    
    setDisplayedMissions((prev) => [...prev, ...newMissions]);
    setPage(nextPage);
    const hasMoreItems = endIndex < filteredMissions.length;
    setHasMore(hasMoreItems);
    return hasMoreItems;
  }, [page, filteredMissions, hasMore]);

  return (
    <PageWithNav badges={{ missions: 3 }}>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600" />
            <span className="text-xl font-bold text-gray-900">ZZIK LIVE</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-700" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {showSearch ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Search className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-4">
                <SearchBar
                  onSearch={handleSearch}
                  suggestions={['성수 카페', '홍대 맛집', '강남 미션']}
                  recentSearches={['성수 카페', '강남역 미션']}
                  filters={searchFilters}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Bar */}
        <div className="px-6 py-3 bg-primary-50 border-t border-primary-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-900">
                현재 위치: {location.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <span className="text-sm text-gray-600">
              ↓ 반경 {location.radius}km 내 {location.nearbyCount}개 미션
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        {/* Category Filter */}
        <div className="sticky top-[120px] z-40 bg-white border-b border-gray-200">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 px-6 py-4 min-w-max">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <span className="mr-1.5">{category.icon}</span>
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Section */}
        {trendingMissions.length > 0 && (
          <section className="py-6">
            <div className="px-6 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-error-500" />
                <h2 className="text-xl font-bold text-gray-900">인기 미션</h2>
              </div>
              <button className="text-sm text-primary-600 font-medium hover:underline">
                전체보기
              </button>
            </div>

            {/* Horizontal Scroll */}
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 px-6 pb-2">
                {trendingMissions.map((mission, index) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-80"
                  >
                    <MissionCard
                      mission={mission}
                      onTap={() => console.log('Mission tapped:', mission.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Nearby Section */}
        <section className="py-6">
          <div className="px-6 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <NavigationIcon className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900">근처 미션</h2>
            </div>
            <span className="text-sm text-gray-500">
              {filteredMissions.length}개
            </span>
          </div>

          {/* Vertical List with Infinite Scroll */}
          <motion.div
            variants={staggerContainerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4 px-6"
          >
            {displayedMissions.map((mission) => (
              <motion.div key={mission.id} variants={staggerItemVariants}>
                <MissionCard
                  mission={mission}
                  onTap={() => console.log('Mission tapped:', mission.id)}
                />
              </motion.div>
            ))}
            
            {/* Infinite Scroll Trigger */}
            {displayedMissions.length > 0 && (
              <InfiniteScroll
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                threshold={500}
              />
            )}
          </motion.div>

          {/* Empty State */}
          {displayedMissions.length === 0 && (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                미션이 없습니다
              </h3>
              <p className="text-gray-500">
                다른 카테고리를 선택하거나 위치를 변경해보세요
              </p>
            </div>
          )}
        </section>
      </main>
      </div>
      </PullToRefresh>
    </PageWithNav>
  );
}

