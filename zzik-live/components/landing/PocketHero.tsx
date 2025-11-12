// src/components/landing/PocketHero.tsx
// Pocket 템플릿의 실제 디자인을 정확히 구현한 Hero 섹션

'use client';

import Link from 'next/link';
import { Container } from '@/components/pocket/Container';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';

export function PocketHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
      {/* Pocket 템플릿의 시그니처 배경 패턴 */}
      <div 
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:left-0 xl:translate-x-0"
        aria-hidden="true"
      >
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      
      <Container>
        <div className="pb-24 pt-20 text-center sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:py-40 lg:text-left">
          <div className="mx-auto max-w-2xl lg:mx-0">
            {/* Pocket 스타일 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
            >
              <span className="font-semibold text-indigo-600">New</span>
              <span className="ml-2">지금 가입하면 5,000 포인트 즉시 지급</span>
            </motion.div>
            
            {/* 메인 타이틀 - Pocket 스타일 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
            >
              체크인하고
              <span className="block text-indigo-600">즉시 보상받는</span>
              나노 크리에이터 플랫폼
            </motion.h1>
            
            {/* 서브 텍스트 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-600"
            >
              팔로워 100명부터 시작 가능! GPS 인증으로 방문을 확인하고,
              30초 릴스를 올리면 즉시 포인트를 받으세요.
              복잡한 심사 없이 바로 현금화 가능합니다.
            </motion.p>
            
            {/* CTA 버튼 그룹 - Pocket 스타일 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start"
            >
              <Link
                href="/signup"
                className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                무료로 시작하기
              </Link>
              <Link
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                자세히 알아보기 <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
            
            {/* 통계 - Pocket 스타일 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-16 flex items-center gap-x-8 text-sm lg:mt-20"
            >
              <div className="flex -space-x-2 overflow-hidden">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                ))}
              </div>
              <div className="leading-6">
                <p className="font-semibold text-gray-900">2,847+ 크리에이터</p>
                <p className="text-gray-600">지난 30일간 ₩12.5M+ 리워드 지급</p>
              </div>
            </motion.div>
          </div>
          
          {/* 오른쪽 폰 목업 - Pocket 시그니처 스타일 */}
          <div className="mt-20 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto w-[22.875rem] max-w-full drop-shadow-2xl"
            >
              {/* 폰 프레임 */}
              <div className="relative mx-auto w-full">
                <div className="relative mx-auto max-w-[366px] rounded-[2.5rem] bg-gray-900 shadow-2xl">
                  {/* 노치 */}
                  <div className="absolute left-1/2 top-0 h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-gray-900" />
                  
                  {/* 스크린 */}
                  <div className="relative mx-2 mt-2 aspect-[9/19.5] overflow-hidden rounded-[2.3rem] bg-white">
                    {/* 앱 헤더 */}
                    <div className="bg-indigo-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">ZZIK LIVE</h3>
                        <div className="flex items-center gap-2 text-white">
                          <span className="text-sm">2,847</span>
                          <Users className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    
                    {/* 지도 영역 */}
                    <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MapPin className="h-12 w-12 text-indigo-600" />
                      </div>
                      
                      {/* 플로팅 미션 카드들 */}
                      {[
                        { top: '20%', left: '20%' },
                        { top: '40%', right: '25%' },
                        { bottom: '30%', left: '30%' },
                      ].map((pos, i) => (
                        <motion.div
                          key={i}
                          className="absolute"
                          style={pos}
                          animate={{
                            y: [0, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                          }}
                        >
                          <div className="rounded-lg bg-white p-2 shadow-lg">
                            <div className="text-xs font-semibold text-indigo-600">
                              +{50 + i * 10}P
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* 하단 미션 리스트 */}
                    <div className="p-4 space-y-3">
                      {['스타벅스 강남점', '올리브영 신촌점', '교보문고 광화문'].map((place, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500" />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{place}</p>
                              <p className="text-xs text-gray-500">{100 + i * 50}m · 릴스 미션</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-indigo-600">+{100 + i * 50}P</p>
                            <p className="text-xs text-gray-500">즉시 지급</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 홈 인디케이터 */}
                  <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-white/20" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}