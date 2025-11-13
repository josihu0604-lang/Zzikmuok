'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  User,
  Settings,
  Bell,
  MapPin,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Award,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Button, Badge } from '@/components/design-system';
import { PageWithNav } from '@/components/NavigationBar';

// Dynamic import ThemeToggle to avoid SSR issues
const ThemeToggle = dynamic(
  () => import('@/components/ThemeProvider').then((mod) => mod.ThemeToggle),
  { ssr: false }
);

/**
 * Profile Screen - ZZIK LIVE
 * 
 * User profile and settings:
 * - User info and stats
 * - Settings menu
 * - Account management
 */

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const user = {
    name: '민지',
    email: 'minji@example.com',
    avatarUrl: '/avatar-default.jpg',
    level: 5,
    joinedAt: new Date('2024-01-15'),
    stats: {
      totalMissions: 24,
      completionRate: 92,
      totalEarned: 360000,
    },
  };

  const menuSections = [
    {
      title: '계정',
      items: [
        { icon: User, label: '프로필 편집', href: '/profile/edit' },
        { icon: CreditCard, label: '결제 정보', href: '/profile/payment' },
        { icon: Bell, label: '알림 설정', href: '/profile/notifications' },
      ],
    },
    {
      title: '서비스',
      items: [
        { icon: MapPin, label: '위치 권한', href: '/profile/location' },
        { icon: Settings, label: '앱 설정', href: '/profile/settings' },
        { icon: HelpCircle, label: '고객 지원', href: '/profile/support' },
      ],
    },
  ];

  return (
    <PageWithNav>
      <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-500 to-purple-600 text-white pt-12 pb-16 px-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
            <p className="text-white/80">{user.email}</p>
          </div>
          <Badge variant="primary" size="md">
            Level {user.level}
          </Badge>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-lg border-4 border-white flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-warning-500 rounded-full border-4 border-white flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/80 text-sm">
            {new Date(user.joinedAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
            })}{' '}
            가입
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Calendar className="w-4 h-4 text-primary-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {user.stats.totalMissions}
              </div>
              <div className="text-xs text-gray-500">완료 미션</div>
            </div>

            <div className="text-center border-l border-r border-gray-200">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="w-4 h-4 text-success-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {user.stats.completionRate}%
              </div>
              <div className="text-xs text-gray-500">완료율</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Award className="w-4 h-4 text-warning-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(user.stats.totalEarned / 1000).toFixed(0)}K
              </div>
              <div className="text-xs text-gray-500">총 수익</div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <main className="px-6 space-y-6">
        {menuSections.map((section, index) => (
          <div key={index}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {section.title}
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={itemIndex}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                    itemIndex < section.items.length - 1
                      ? 'border-b border-gray-100'
                      : ''
                  }`}
                  onClick={() => console.log('Navigate to:', item.href)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {/* Theme Toggle */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            테마
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  다크 모드
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  어두운 배경으로 눈의 피로를 줄여보세요
                </p>
              </div>
              <ThemeToggle showLabel={false} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-4">
          <Button
            variant="ghost"
            size="lg"
            fullWidth
            icon={<LogOut className="w-5 h-5" />}
            className="text-error-600 hover:bg-error-50"
            onClick={() => console.log('Logout')}
          >
            로그아웃
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center pb-8">
          <p className="text-sm text-gray-400">ZZIK LIVE v1.0.0</p>
        </div>
      </main>
      </div>
    </PageWithNav>
  );
}
