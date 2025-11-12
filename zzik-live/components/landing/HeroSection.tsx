// src/components/landing/HeroSection.tsx - Hero Section with Glass Morphism Design
// This component serves as the primary entry point for user engagement,
// implementing the Pocket template's signature glass morphism aesthetic

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sparkles, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  activeMissionsCount: number;
}

export default function HeroSection({ activeMissionsCount }: HeroSectionProps) {
  // Rotating text display for dynamic engagement
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const rotatingTexts = [
    '체크인하고 즉시 보상받기',
    '나노 크리에이터를 위한 플랫폼',
    '로컬 비즈니스와 함께 성장',
    'GPS로 검증된 리얼 리워드'
  ];

  // Cycle through rotating texts every 3 seconds for visual interest
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Statistics for social proof and credibility
  const stats = [
    { icon: Users, label: '활성 크리에이터', value: '2,847+', color: 'from-violet-500 to-purple-500' },
    { icon: MapPin, label: '제휴 매장', value: '1,234+', color: 'from-amber-500 to-orange-500' },
    { icon: TrendingUp, label: '누적 리워드', value: '₩12.5M+', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Animated background gradient for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-amber-600/10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
      </div>

      {/* Floating orbs animation for dynamic background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(139, 92, 246, 0.15)' : 'rgba(251, 146, 60, 0.15)'
              } 0%, transparent 70%)`,
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
            }}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            initial={{
              left: `${i * 20}%`,
              top: `${i * 15}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content section with main messaging */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            {/* Badge for highlighting active opportunities */}
            {activeMissionsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-medium text-violet-900">
                  지금 {activeMissionsCount}개 미션 활성화 중
                </span>
              </motion.div>
            )}

            {/* Main headline with gradient text effect */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                위치 기반 실시간
              </span>
              <br />
              <span className="text-slate-900">릴스 리워드 플랫폼</span>
            </h1>

            {/* Rotating subheadline for engagement */}
            <div className="mt-6 h-12">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentTextIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-slate-600"
                >
                  {rotatingTexts[currentTextIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Call-to-action buttons with hover effects */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>지금 시작하기</span>
                  <motion.span
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>

              <Link href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  어떻게 작동하나요?
                </motion.button>
              </Link>
            </div>

            {/* Statistics for credibility */}
            <div className="mt-16 grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                      '--tw-gradient-from': stat.color.split(' ')[1],
                      '--tw-gradient-to': stat.color.split(' ')[3],
                    } as React.CSSProperties}
                  />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-slate-200/50">
                    <stat.icon className="w-5 h-5 text-slate-600 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-600">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side interactive map preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glass card container for the map preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-amber-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/60 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
                {/* Placeholder for interactive map component */}
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-violet-600 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-slate-900">인터랙티브 맵</p>
                    <p className="text-sm text-slate-600 mt-2">주변 미션을 실시간으로 확인하세요</p>
                  </div>
                </div>

                {/* Floating mission cards overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    { top: '20%', left: '15%', delay: 0 },
                    { top: '60%', right: '20%', delay: 0.5 },
                    { bottom: '25%', left: '25%', delay: 1 },
                  ].map((position, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={position}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 3,
                        delay: position.delay,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    >
                      <div className="bg-white/90 backdrop-blur-xl rounded-lg p-2 shadow-lg border border-violet-200">
                        <div className="text-xs font-semibold text-violet-600">+50 포인트</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}