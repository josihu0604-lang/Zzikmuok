// src/components/landing/PocketCTA.tsx
// Pocket 템플릿의 CTA(Call-to-Action) 섹션 디자인

'use client';

import Link from 'next/link';
import { Container } from '@/components/pocket/Container';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export function PocketCTA() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900">
      {/* Pocket 스타일 배경 그라데이션 */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-pink-600/20" />
      <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] opacity-10" />
      
      {/* 애니메이션 배경 요소 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
        />
      </motion.div>

      <Container>
        <div className="py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-2xl text-center">
            {/* 배지 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 ring-1 ring-indigo-500/20 backdrop-blur"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              한정 기간 특별 혜택
            </motion.div>

            {/* 메인 타이틀 */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-5xl"
            >
              지금 시작하면
              <span className="block text-indigo-400">5,000 포인트 즉시 지급</span>
            </motion.h2>

            {/* 설명 텍스트 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg leading-8 text-gray-300"
            >
              매일 수천 개의 새로운 미션이 등록되고 있습니다.
              팔로워 100명만 있어도 시작할 수 있는 나노 크리에이터 플랫폼,
              지금 바로 수익 창출을 시작하세요.
            </motion.p>

            {/* 혜택 리스트 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8"
            >
              {[
                '가입비 무료',
                '수수료 첫 달 0%',
                '전담 매니저 배정',
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-5 w-5 text-indigo-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA 버튼 그룹 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6"
            >
              <Link
                href="/signup"
                className="group relative overflow-hidden rounded-md bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-100"
              >
                <span className="relative z-10 flex items-center gap-2">
                  무료로 시작하기
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href="/demo"
                className="rounded-md border border-white/20 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
              >
                데모 체험하기
              </Link>
            </motion.div>

            {/* 신뢰 지표 */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-16 flex items-center justify-center gap-x-6"
            >
              <div className="flex -space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 ring-2 ring-gray-900"
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-white">2,847+ 크리에이터</p>
                <p className="text-gray-400">이미 수익을 창출하고 있습니다</p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}