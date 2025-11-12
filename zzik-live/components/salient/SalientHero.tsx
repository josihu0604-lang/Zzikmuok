// src/components/salient/SalientHero.tsx
// Salient 템플릿 스타일의 Hero 섹션 - SaaS 랜딩에 최적화

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Users, MapPin, TrendingUp } from 'lucide-react';

export default function SalientHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-white pt-20 pb-28">
      {/* Salient 스타일 배경 패턴 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.teal.100),white)] opacity-20" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-teal-600/10 ring-1 ring-teal-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          {/* 왼쪽 콘텐츠 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none"
          >
            {/* 뱃지 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20"
            >
              <span className="mr-2">🔥</span>
              이미 500명이 활동 중 · 평균 월 6만원
            </motion.div>

            {/* 메인 헤드라인 */}
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              카페 가서 사진만 찍으면
              <span className="block text-teal-600 mt-2">15,000원 받아요</span>
            </h1>

            {/* 서브 헤드라인 */}
            <p className="mt-6 text-lg leading-8 text-gray-600">
              팔로워 100명 이상이면 누구나 가능
              <br />
              성수동, 이태원, 홍대에서 시작하세요
            </p>

            {/* CTA 버튼 */}
            <div className="mt-10 flex items-center gap-x-6">
              <motion.a
                href="#download"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg bg-teal-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-teal-500 transition-colors flex items-center gap-2 group"
              >
                지금 무료로 시작하기
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
                어떻게 작동하나요? <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* 신뢰 지표 */}
            <div className="mt-12 flex items-center gap-x-8 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                GPS 검증으로 안전
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                즉시 정산
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                수수료 0%
              </span>
            </div>

            {/* 활동 중인 크리에이터 */}
            <div className="mt-12 flex items-center gap-x-5">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {i}K
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">500+ 활동 크리에이터</p>
                <p className="text-xs text-gray-500">지난 30일간 2,400개 미션 완료</p>
              </div>
            </div>
          </motion.div>

          {/* 오른쪽 비주얼 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 lg:mt-0"
          >
            <div className="relative">
              {/* 메인 카드 - 수익 대시보드 */}
              <div className="relative mx-auto max-w-md">
                <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">이번 주 수익</h3>
                    <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded-full">실시간</span>
                  </div>
                  
                  {/* 수익 그래프 */}
                  <div className="space-y-4">
                    {['월', '화', '수', '목', '금'].map((day, i) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-8">{day}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(i + 1) * 20}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-end pr-3"
                          >
                            <span className="text-xs font-bold text-white">₩{15000 * (i === 2 ? 2 : 1)}</span>
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-gray-600">총 수익</p>
                        <p className="text-2xl font-bold text-gray-900">₩75,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">미션 5개 완료</p>
                        <p className="text-sm font-medium text-teal-600">+15,000원/미션</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 플로팅 카드들 */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium">스타벅스 성수점</span>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium">팔로워 250명</span>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 -right-12 transform translate-y-1/2"
              >
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full p-3 shadow-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}