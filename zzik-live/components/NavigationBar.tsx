'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, MapIcon, ClipboardList, Gift, User } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navigation Bar Component - ZZIK LIVE
 * 
 * Mobile bottom navigation with 5 main sections
 * Features:
 * - Active state with animation
 * - Haptic feedback (vibration)
 * - Badge notifications
 * - Smooth transitions
 */

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: '홈',
    icon: Home,
    path: '/home',
  },
  {
    id: 'map',
    label: '지도',
    icon: MapIcon,
    path: '/map',
  },
  {
    id: 'missions',
    label: '미션',
    icon: ClipboardList,
    path: '/missions',
  },
  {
    id: 'rewards',
    label: '리워드',
    icon: Gift,
    path: '/rewards',
  },
  {
    id: 'profile',
    label: '프로필',
    icon: User,
    path: '/profile',
  },
];

interface NavigationBarProps {
  /**
   * Show badge on specific nav item
   * @example { missions: 3, rewards: 1 }
   */
  badges?: Record<string, number>;
}

export function NavigationBar({ badges = {} }: NavigationBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    // Haptic feedback on mobile devices
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    router.push(path);
  };

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white border-t border-gray-200',
        'safe-area-inset-bottom'
      )}
    >
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const badge = badges[item.id];

            return (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'relative flex flex-col items-center justify-center',
                  'min-w-[60px] h-14 px-2 rounded-xl',
                  'transition-colors duration-200',
                  isActive
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-50 rounded-xl"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                {/* Icon Container */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="relative">
                    <Icon
                      className={cn(
                        'w-6 h-6 transition-all duration-200',
                        isActive ? 'scale-110' : 'scale-100'
                      )}
                    />

                    {/* Badge */}
                    {badge && badge > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          'absolute -top-1 -right-1',
                          'min-w-[18px] h-[18px] px-1',
                          'flex items-center justify-center',
                          'bg-error-500 text-white',
                          'text-[10px] font-bold rounded-full',
                          'border-2 border-white'
                        )}
                      >
                        {badge > 99 ? '99+' : badge}
                      </motion.div>
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-xs font-medium transition-all duration-200',
                      isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                    )}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Safe Area for iPhone X+ */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </motion.nav>
  );
}

/**
 * Page Container with Navigation Bar
 * 
 * Wraps page content and adds bottom padding for navigation bar
 */
interface PageWithNavProps {
  children: React.ReactNode;
  badges?: Record<string, number>;
  className?: string;
}

export function PageWithNav({ children, badges, className }: PageWithNavProps) {
  return (
    <>
      <div className={cn('min-h-screen pb-20', className)}>
        {children}
      </div>
      <NavigationBar badges={badges} />
    </>
  );
}

export default NavigationBar;
