// app/salient/page.tsx
// Salient 템플릿 디자인이 완전히 적용된 ZZIK LIVE 랜딩 페이지

import SalientHero from '@/components/salient/SalientHero';
import IncomeCalculator from '@/components/salient/IncomeCalculator';
import Testimonials from '@/components/salient/Testimonials';
import FAQ from '@/components/salient/FAQ';

// Salient 스타일 Features 섹션
function SalientFeatures() {
  const features = [
    {
      title: 'GPS 트리플 검증',
      description: '실제 방문만 인정되는 3단계 검증 시스템',
      icon: '📍',
      stats: '99.9% 정확도',
    },
    {
      title: '즉시 정산',
      description: '미션 완료 즉시 포인트 적립, 바로 출금 가능',
      icon: '⚡',
      stats: '평균 2분',
    },
    {
      title: '나노 크리에이터 특화',
      description: '팔로워 100명부터 시작 가능한 진짜 기회',
      icon: '🎯',
      stats: '100명부터 OK',
    },
    {
      title: '수수료 0%',
      description: '첫 달 수수료 완전 무료, 이후에도 단 10%',
      icon: '💰',
      stats: '첫달 무료',
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            왜 ZZIK LIVE인가요?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            나노 크리에이터를 위한 최고의 수익 창출 플랫폼
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-3xl">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              <p className="mt-3 text-xl font-bold text-teal-600">{feature.stats}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Salient 스타일 CTA 섹션
function SalientCTA() {
  return (
    <section className="bg-teal-600 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            지금 시작하면 5,000 포인트 즉시 지급!
          </h2>
          <p className="mt-4 text-xl text-teal-100">
            첫 미션 완료시 추가 10,000 포인트 보너스
          </p>
          
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/signup"
              className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-teal-600 shadow-lg hover:bg-gray-50 transition-colors"
            >
              무료로 시작하기 →
            </a>
            <a
              href="#calculator"
              className="rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-colors"
            >
              수익 계산해보기
            </a>
          </div>

          <p className="mt-8 text-sm text-teal-100">
            * 신용카드 불필요 · 언제든 취소 가능 · 숨겨진 비용 없음
          </p>
        </div>
      </div>
    </section>
  );
}

// Salient 스타일 How It Works 섹션  
function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: '앱 다운로드',
      description: '앱스토어에서 ZZIK LIVE 다운로드하고 인스타그램 계정 연결',
      time: '30초',
    },
    {
      step: '2',
      title: '미션 선택',
      description: '지도에서 가까운 미션을 선택하고 매장 방문',
      time: '1분',
    },
    {
      step: '3',
      title: '콘텐츠 업로드',
      description: 'GPS 체크인 후 30초 릴스나 사진 업로드',
      time: '5분',
    },
    {
      step: '4',
      title: '보상 받기',
      description: '즉시 15,000원 포인트 적립, 바로 출금 가능',
      time: '즉시',
    },
  ];

  return (
    <section id="how-it-works" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20 mb-4">
            간단한 4단계
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            어떻게 시작하나요?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            복잡한 과정 없이 바로 시작할 수 있어요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-teal-200 lg:block" />
              )}
              
              <div className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-center text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-center text-sm text-gray-600">
                  {item.description}
                </p>
                <p className="mt-3 text-center text-xs font-medium text-teal-600">
                  소요 시간: {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SalientPage() {
  return (
    <div className="relative bg-white">
      {/* Salient 스타일 Hero 섹션 */}
      <SalientHero />
      
      {/* Features 섹션 */}
      <SalientFeatures />
      
      {/* How It Works 섹션 */}
      <HowItWorks />
      
      {/* Income Calculator 섹션 */}
      <IncomeCalculator />
      
      {/* Testimonials 섹션 */}
      <Testimonials />
      
      {/* FAQ 섹션 */}
      <FAQ />
      
      {/* CTA 섹션 */}
      <SalientCTA />
    </div>
  );
}
