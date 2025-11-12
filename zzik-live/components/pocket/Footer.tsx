// src/components/pocket/Footer.tsx
// Pocket 템플릿의 Footer 디자인

import Link from 'next/link';
import { Container } from '@/components/pocket/Container';

const navigation = {
  product: [
    { name: '기능', href: '#features' },
    { name: '요금제', href: '#pricing' },
    { name: 'API 문서', href: '#' },
    { name: '업데이트', href: '#' },
  ],
  company: [
    { name: '회사 소개', href: '#' },
    { name: '채용', href: '#' },
    { name: '파트너', href: '#' },
    { name: '뉴스', href: '#' },
  ],
  support: [
    { name: '도움말 센터', href: '#' },
    { name: '문의하기', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: '서비스 상태', href: '#' },
  ],
  legal: [
    { name: '이용약관', href: '#' },
    { name: '개인정보처리방침', href: '#' },
    { name: '쿠키 정책', href: '#' },
    { name: '라이선스', href: '#' },
  ],
};

const social = [
  { name: 'Instagram', href: '#' },
  { name: 'Twitter', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'LinkedIn', href: '#' },
];

export function PocketFooter() {
  return (
    <footer className="bg-gray-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container>
        <div className="pb-8 pt-16 sm:pt-24 lg:pb-12 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            {/* 브랜드 섹션 */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ZZIK LIVE
                </h3>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  나노 크리에이터와 로컬 비즈니스를 연결하는
                  혁신적인 위치 기반 리워드 플랫폼
                </p>
              </div>
              {/* 앱 다운로드 버튼 */}
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="flex h-10 w-32 items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  <span className="text-xs">App Store</span>
                </Link>
                <Link
                  href="#"
                  className="flex h-10 w-32 items-center justify-center rounded-lg bg-black text-white hover:bg-gray-800"
                >
                  <span className="text-xs">Google Play</span>
                </Link>
              </div>
            </div>
            
            {/* 링크 섹션 */}
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    제품
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.product.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm leading-6 text-gray-600 hover:text-indigo-600"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    회사
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.company.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm leading-6 text-gray-600 hover:text-indigo-600"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    지원
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.support.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm leading-6 text-gray-600 hover:text-indigo-600"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm font-semibold leading-6 text-gray-900">
                    법적 고지
                  </h3>
                  <ul role="list" className="mt-6 space-y-4">
                    {navigation.legal.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="text-sm leading-6 text-gray-600 hover:text-indigo-600"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* 하단 섹션 */}
          <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="text-xs leading-5 text-gray-500">
                &copy; 2025 ZZIK LIVE. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {social.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-indigo-600"
                  >
                    <span className="sr-only">{item.name}</span>
                    <span className="text-xs">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}