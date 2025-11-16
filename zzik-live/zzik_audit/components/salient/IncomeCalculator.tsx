// src/components/salient/IncomeCalculator.tsx
// Salient 템플릿 스타일의 수익 계산기 - 문서에서 요청한 정확한 구현

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Sparkles, ChevronUp } from 'lucide-react';

export default function IncomeCalculator() {
  const [frequency, setFrequency] = useState(2);
  const missionPrice = 15000; // 미션당 15,000원
  const weeklyIncome = frequency * missionPrice;
  const monthlyIncome = weeklyIncome * 4;
  const yearlyIncome = monthlyIncome * 12;

  // 빈도별 라벨
  const frequencyLabels = [
    '가끔 (주 1회)',
    '보통 (주 2회)', 
    '자주 (주 3회)',
    '열심히 (주 4회)',
    '풀타임 (주 5회)'
  ];

  return (
    <section id="calculator" className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-8"
          >
            <Calculator className="w-4 h-4 mr-2" />
            수익 계산기
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            내가 벌 수 있는 금액은?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-gray-600"
          >
            주당 미션 횟수를 선택하고 예상 수익을 확인하세요
          </motion.p>
        </div>

        {/* 계산기 본체 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 mx-auto max-w-3xl"
        >
          <div className="bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden">
            {/* 상단 그라데이션 바 */}
            <div className="h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500" />
            
            <div className="p-8">
              {/* 슬라이더 섹션 */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <label className="text-lg font-semibold text-gray-900">
                      주당 미션 횟수
                    </label>
                    <span className="text-3xl font-bold text-teal-600">{frequency}회</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-6">{frequencyLabels[frequency - 1]}</p>
                  
                  {/* 커스텀 슬라이더 */}
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, rgb(20 184 166) 0%, rgb(20 184 166) ${(frequency - 1) * 25}%, rgb(229 231 235) ${(frequency - 1) * 25}%, rgb(229 231 235) 100%)`
                      }}
                    />
                    
                    {/* 슬라이더 포인트 마커 */}
                    <div className="absolute inset-x-0 -bottom-6 flex justify-between px-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <span
                          key={num}
                          className={`text-xs ${
                            num <= frequency ? 'text-teal-600 font-medium' : 'text-gray-400'
                          }`}
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 수익 표시 카드 */}
              <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* 주간 수익 */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 text-center"
                >
                  <p className="text-sm font-medium text-gray-600 mb-2">주간 수익</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₩{weeklyIncome.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {frequency}회 × ₩15,000
                  </p>
                </motion.div>

                {/* 월간 수익 - 강조 */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl p-6 text-center text-white relative overflow-hidden"
                >
                  <Sparkles className="absolute top-2 right-2 w-4 h-4 opacity-50" />
                  <p className="text-sm font-medium mb-2 opacity-90">월간 수익</p>
                  <p className="text-3xl font-bold">
                    ₩{monthlyIncome.toLocaleString()}
                  </p>
                  <p className="text-xs mt-1 opacity-75">
                    주 ₩{weeklyIncome.toLocaleString()} × 4주
                  </p>
                </motion.div>

                {/* 연간 수익 */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-50 rounded-xl p-6 text-center"
                >
                  <p className="text-sm font-medium text-gray-600 mb-2">연간 수익</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₩{yearlyIncome.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    월 ₩{monthlyIncome.toLocaleString()} × 12
                  </p>
                </motion.div>
              </div>

              {/* 비교 섹션 */}
              <div className="mt-8 p-4 bg-teal-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <p className="text-sm text-teal-900">
                      <span className="font-semibold">알바 대비 {Math.round((missionPrice / 9860) * 100)}%</span> 시급
                    </p>
                  </div>
                  <p className="text-sm text-teal-700">
                    최저시급 ₩9,860 vs 미션당 ₩15,000
                  </p>
                </div>
              </div>

              {/* CTA 버튼 */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full bg-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-teal-500 transition-colors flex items-center justify-center gap-2 group"
              >
                지금 시작하기
                <ChevronUp className="w-5 h-5 rotate-90 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* 추가 정보 */}
              <p className="mt-4 text-xs text-center text-gray-500">
                * 실제 수익은 미션 수행 횟수와 지역에 따라 달라질 수 있습니다
              </p>
            </div>
          </div>
        </motion.div>

        {/* 하단 통계 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto"
        >
          {[
            { label: '평균 미션 시간', value: '10분' },
            { label: '최고 월 수익자', value: '₩450,000' },
            { label: '정산 소요 시간', value: '즉시' },
            { label: '활동 지역', value: '서울 전역' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CSS for custom slider thumb */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #14b8a6, #06b6d4);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
          border: 3px solid white;
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #14b8a6, #06b6d4);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
          border: 3px solid white;
        }
      `}</style>
    </section>
  );
}