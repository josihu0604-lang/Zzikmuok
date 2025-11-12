// src/components/landing/FeaturesSection.tsx - Core Features Grid
// This component showcases the platform's key features using glass morphism cards
// Each feature is designed to communicate value quickly while maintaining visual hierarchy

'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Camera, 
  DollarSign, 
  Shield, 
  Zap, 
  Users,
  BarChart3,
  Smartphone,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Feature data structure for maintainability and localization readiness
const features = [
  {
    id: 'gps-verification',
    icon: MapPin,
    title: 'GPS 트리플 검증',
    description: '실제 방문을 3단계 위치 검증으로 확인. 허위 체크인 원천 차단으로 신뢰성 보장',
    gradient: 'from-violet-500 to-purple-500',
    delay: 0,
  },
  {
    id: 'instant-rewards',
    icon: Zap,
    title: '즉시 리워드',
    description: '체크인 즉시 포인트 적립. 복잡한 심사 없이 바로 현금화 가능',
    gradient: 'from-amber-500 to-orange-500',
    delay: 0.1,
  },
  {
    id: 'content-creation',
    icon: Camera,
    title: '간편한 콘텐츠 제작',
    description: '30초 릴스 템플릿 제공. AI 자동 편집으로 누구나 쉽게 콘텐츠 생성',
    gradient: 'from-rose-500 to-pink-500',
    delay: 0.2,
  },
  {
    id: 'nano-creator-focused',
    icon: Users,
    title: '나노 크리에이터 특화',
    description: '팔로워 100명부터 시작 가능. 대형 인플루언서와 경쟁 없이 수익 창출',
    gradient: 'from-emerald-500 to-teal-500',
    delay: 0.3,
  },
  {
    id: 'secure-payment',
    icon: Shield,
    title: '안전한 정산',
    description: 'PG사 연동 자동 정산. 투명한 수수료 구조로 신뢰할 수 있는 거래',
    gradient: 'from-blue-500 to-cyan-500',
    delay: 0.4,
  },
  {
    id: 'real-time-analytics',
    icon: BarChart3,
    title: '실시간 분석',
    description: '방문자 트래픽, 전환율, ROI를 한눈에. 데이터 기반 마케팅 의사결정',
    gradient: 'from-indigo-500 to-purple-500',
    delay: 0.5,
  },
];

// Container animation variants for staggered reveal effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Individual card animation variants for smooth entrance
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background pattern for visual texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with gradient text effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              강력한 기능
            </span>
            <span className="text-slate-900">으로 성공을 보장</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ZZIK LIVE는 나노 크리에이터와 로컬 비즈니스를 위한 
            최적화된 기능을 제공합니다
          </p>
        </motion.div>

        {/* Features grid with responsive layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              className="group relative"
            >
              {/* Hover effect gradient background */}
              <div 
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
                  `bg-gradient-to-r ${feature.gradient}`
                )}
                style={{ transform: 'scale(0.95)' }}
              />
              
              {/* Glass morphism card */}
              <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Icon container with gradient background */}
                <div className="mb-6">
                  <div className={cn(
                    "inline-flex p-3 rounded-xl bg-gradient-to-r",
                    feature.gradient,
                    "bg-opacity-10"
                  )}>
                    <feature.icon className="w-6 h-6 text-slate-800" />
                  </div>
                </div>

                {/* Feature title */}
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                {/* Feature description */}
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Interactive hover indicator */}
                <div className="mt-6 flex items-center text-sm font-medium text-slate-500 group-hover:text-violet-600 transition-colors">
                  <span>자세히 보기</span>
                  <motion.span
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional features indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-full border border-violet-200/50">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-700">모바일 최적화</span>
            </div>
            <div className="w-px h-4 bg-violet-200" />
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-700">다국어 지원</span>
            </div>
            <div className="w-px h-4 bg-violet-200" />
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-700">투명한 수수료</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}