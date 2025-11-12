// app/pocket/page.tsx
// Pocket 템플릿 디자인이 완전히 적용된 ZZIK LIVE 앱 다운로드 페이지

import { PocketHero } from '@/components/landing/PocketHero';
import { PocketFeatures } from '@/components/landing/PocketFeatures';
import { PocketHeader } from '@/components/pocket/Header';
import { PocketCTA } from '@/components/landing/PocketCTA';
import { PocketFooter } from '@/components/pocket/Footer';

export default function PocketPage() {
  return (
    <div className="relative bg-white">
      {/* Pocket 스타일 헤더 */}
      <PocketHeader user={null} />
      
      {/* Pocket 스타일 Hero 섹션 */}
      <main>
        <PocketHero />
        
        {/* Pocket 스타일 Features 섹션 */}
        <PocketFeatures />
        
        {/* Pocket 스타일 CTA 섹션 */}
        <PocketCTA />
      </main>
      
      {/* Pocket 스타일 Footer */}
      <PocketFooter />
    </div>
  );
}
