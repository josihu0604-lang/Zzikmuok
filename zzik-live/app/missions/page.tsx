'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, TrendingUp, Calendar } from 'lucide-react';
import { MissionCard, StatusBadge } from '@/components/design-system';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import { PageWithNav } from '@/components/NavigationBar';

/**
 * Missions Screen - ZZIK LIVE
 * 
 * Shows user's mission progress:
 * - Ongoing missions
 * - Completed missions
 * - Daily/Weekly missions
 * - Progress tracking
 */

interface Mission {
  id: string;
  name: string;
  category: string;
  reward: number;
  distance: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expiresAt: Date;
  status: 'ongoing' | 'completed' | 'pending';
  progress?: number;
  completedAt?: Date;
}

const mockMissions: Mission[] = [
  {
    id: '1',
    name: '성수 카페 방문',
    category: 'cafe',
    reward: 15000,
    distance: '0.3km',
    imageUrl: '/placeholder-cafe.jpg',
    difficulty: 'easy',
    expiresAt: new Date(Date.now() + 86400000),
    status: 'ongoing',
    progress: 66,
  },
  {
    id: '2',
    name: '홍대 레스토랑',
    category: 'restaurant',
    reward: 20000,
    distance: '0.8km',
    imageUrl: '/placeholder-restaurant.jpg',
    difficulty: 'medium',
    expiresAt: new Date(Date.now() + 86400000 * 2),
    status: 'pending',
  },
  {
    id: '3',
    name: '강남 디저트 카페',
    category: 'dessert',
    reward: 18000,
    distance: '1.2km',
    imageUrl: '/placeholder-dessert.jpg',
    difficulty: 'easy',
    expiresAt: new Date(Date.now() - 3600000),
    status: 'completed',
    completedAt: new Date(Date.now() - 3600000),
  },
];

export default function MissionsPage() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

  const ongoingMissions = mockMissions.filter((m) => m.status !== 'completed');
  const completedMissions = mockMissions.filter((m) => m.status === 'completed');

  const missions = activeTab === 'ongoing' ? ongoingMissions : completedMissions;

  // Calculate stats
  const stats = {
    total: mockMissions.length,
    completed: completedMissions.length,
    totalEarned: completedMissions.reduce((sum, m) => sum + m.reward, 0),
  };

  return (
    <PageWithNav badges={{ missions: ongoingMissions.length }}>
      <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">내 미션</h1>
          <p className="text-sm text-gray-600 mt-1">
            진행 중인 미션을 완료하고 보상을 받으세요
          </p>
        </div>

        {/* Stats Cards */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-primary-600" />
                <span className="text-xs text-primary-600 font-medium">전체</span>
              </div>
              <div className="text-2xl font-bold text-primary-700">
                {stats.total}
              </div>
            </div>

            <div className="bg-success-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-success-600" />
                <span className="text-xs text-success-600 font-medium">완료</span>
              </div>
              <div className="text-2xl font-bold text-success-700">
                {stats.completed}
              </div>
            </div>

            <div className="bg-warning-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-warning-600" />
                <span className="text-xs text-warning-600 font-medium">획득</span>
              </div>
              <div className="text-xl font-bold text-warning-700">
                {(stats.totalEarned / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-gray-200">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'ongoing'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            진행 중 ({ongoingMissions.length})
            {activeTab === 'ongoing' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'completed'
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            완료됨 ({completedMissions.length})
            {activeTab === 'completed' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
              />
            )}
          </button>
        </div>
      </header>

      {/* Mission List */}
      <main className="p-6">
        <motion.div
          key={activeTab}
          variants={staggerContainerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {missions.map((mission) => (
            <motion.div key={mission.id} variants={staggerItemVariants}>
              <div className="relative">
                <MissionCard
                  mission={mission}
                  onTap={() => console.log('Mission:', mission.id)}
                />

                {/* Progress Overlay for Ongoing */}
                {mission.status === 'ongoing' && mission.progress && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-full px-3 py-1 shadow-lg flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-semibold text-gray-900">
                        {mission.progress}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Status Badge for Completed */}
                {mission.status === 'completed' && (
                  <div className="absolute top-4 right-4">
                    <StatusBadge status="completed" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {missions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              {activeTab === 'ongoing' ? (
                <Clock className="w-8 h-8 text-gray-400" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'ongoing'
                ? '진행 중인 미션이 없습니다'
                : '완료된 미션이 없습니다'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'ongoing'
                ? '홈에서 새로운 미션을 찾아보세요'
                : '미션을 완료하면 여기에 표시됩니다'}
            </p>
          </div>
        )}
      </main>
      </div>
    </PageWithNav>
  );
}
