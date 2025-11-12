// src/components/pocket/Header.tsx
// Pocket 템플릿의 정확한 헤더 디자인

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/pocket/Container';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const navigation = [
  { name: '기능', href: '#features' },
  { name: '작동 방식', href: '#how-it-works' },
  { name: '요금제', href: '#pricing' },
  { name: '고객 후기', href: '#testimonials' },
];

export function PocketHeader({ user }: { user?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <Container>
        <nav className="flex items-center justify-between py-6" aria-label="Global">
          {/* 로고 - Pocket 스타일 */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ZZIK LIVE
              </span>
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">메뉴 열기</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* 데스크톱 네비게이션 */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* 로그인/가입 버튼 - Pocket 스타일 */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            {user ? (
              <div className="flex items-center gap-x-4">
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
                >
                  대시보드
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  무료 시작하기
                </Link>
              </>
            )}
          </div>
        </nav>
      </Container>

      {/* 모바일 메뉴 - Pocket 스타일 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* 모바일 메뉴 패널 */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ZZIK LIVE
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">메뉴 닫기</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="py-6">
                    {user ? (
                      <Link
                        href="/dashboard"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        대시보드
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                        >
                          로그인
                        </Link>
                        <Link
                          href="/signup"
                          className="mt-4 block w-full rounded-md bg-indigo-600 px-3 py-2.5 text-center text-base font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                          무료 시작하기
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}