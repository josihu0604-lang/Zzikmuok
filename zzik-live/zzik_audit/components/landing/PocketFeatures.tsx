// src/components/landing/PocketFeatures.tsx
// Pocket 템플릿의 실제 Features 디자인을 ZZIK LIVE에 맞게 적용

'use client';

import { Container } from '@/components/pocket/Container';
import { motion } from 'framer-motion';
import {
  MapPin,
  Zap,
  Shield,
  Users,
  Camera,
  BarChart,
  Smartphone,
  Globe,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    name: 'GPS 트리플 검증',
    description: '3단계 위치 검증으로 실제 방문을 확인합니다. 허위 체크인은 원천 차단되어 신뢰할 수 있는 리워드를 보장합니다.',
    icon: MapPin,
  },
  {
    name: '즉시 리워드 지급',
    description: '체크인 즉시 포인트가 적립됩니다. 복잡한 심사 과정 없이 바로 현금화할 수 있어 빠른 수익 창출이 가능합니다.',
    icon: Zap,
  },
  {
    name: '간편한 콘텐츠 제작',
    description: '30초 릴스 템플릿과 AI 자동 편집 기능을 제공합니다. 전문적인 편집 기술 없이도 퀄리티 높은 콘텐츠를 만들 수 있습니다.',
    icon: Camera,
  },
  {
    name: '나노 크리에이터 특화',
    description: '팔로워 100명부터 시작 가능합니다. 대형 인플루언서와의 경쟁 없이 자신만의 영역에서 수익을 창출하세요.',
    icon: Users,
  },
  {
    name: '안전한 정산 시스템',
    description: 'PG사 연동으로 자동 정산이 이루어집니다. 투명한 수수료 구조와 안전한 거래로 믿고 사용할 수 있습니다.',
    icon: Shield,
  },
  {
    name: '실시간 분석 대시보드',
    description: '방문자 트래픽, 전환율, ROI를 한눈에 확인하세요. 데이터 기반의 스마트한 마케팅 의사결정이 가능합니다.',
    icon: BarChart,
  },
];

export function PocketFeatures() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <Container>
        {/* 섹션 헤더 - Pocket 스타일 */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10"
          >
            <CheckCircle className="mr-2 h-4 w-4 text-indigo-600" />
            <span className="font-semibold text-indigo-600">강력한 기능</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            성공적인 크리에이터 활동을 위한
            <span className="text-indigo-600"> 완벽한 도구</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            ZZIK LIVE는 나노 크리에이터와 로컬 비즈니스를 연결하는
            혁신적인 기능들을 제공합니다.
          </motion.p>
        </div>

        {/* Features 그리드 - Pocket 스타일 카드 */}
        <div className="mx-auto mt-20 max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* 호버 효과 배경 */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                
                {/* 카드 컨텐츠 */}
                <div className="relative">
                  {/* 아이콘 컨테이너 - Pocket 스타일 */}
                  <dt>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="mt-6 text-lg font-semibold leading-8 text-gray-900">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* 추가 기능 인디케이터 - Pocket 스타일 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 flex justify-center"
        >
          <div className="inline-flex items-center gap-x-8 rounded-full bg-gray-50 px-8 py-4 ring-1 ring-gray-200">
            <div className="flex items-center gap-x-2">
              <Smartphone className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">모바일 최적화</span>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-x-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">다국어 지원</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}