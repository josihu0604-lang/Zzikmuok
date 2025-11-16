# 🎨 Design Token System Migration - Deep Dive Analysis

**작성일**: 2025-11-13  
**분석자**: Claude (DEV/HYGIENE Sprint)  
**목적**: Tailwind UI Blocks 토큰 시스템을 ZZIK LIVE에 통합하기 위한 전략 수립

---

## 📊 1. 현황 분석 (As-Is)

### 1.1 현재 토큰 시스템 구조

**✅ 장점**:
- **이미 체계적인 토큰 시스템 존재** (`app/globals.css` 94줄~217줄)
- CSS 변수 기반 설계 (`:root`에 선언)
- WCAG AA 준수 명시
- 터치 타겟 가이드라인 (48px) 정의
- 애니메이션 키프레임 사전 정의
- 다크모드 준비 (`.dark` 선택자 구조 가능)

**현재 토큰 체계**:
```css
/* 텍스트 색상 */
--text-primary: #111827      /* gray-900 */
--text-secondary: #4B5563    /* gray-600 */
--text-tertiary: #6B7280     /* gray-500 */
--text-disabled: #9CA3AF     /* gray-400 */

/* 배경 색상 */
--bg-primary: #FFFFFF
--bg-secondary: #F9FAFB
--bg-tertiary: #F3F4F6

/* 인터랙티브 색상 */
--interactive-primary: #2563EB         /* blue-600 */
--interactive-primary-hover: #1D4ED8   /* blue-700 */
--interactive-primary-active: #1E40AF  /* blue-800 */

/* 브랜드 컬러 (Violet-Purple) */
--primary-500: #8B5CF6
--primary-600: #7C3AED
--primary-700: #6D28D9

/* 시맨틱 컬러 */
--success-500/600, --warning-500/600, --error-500/600, --info-500/600

/* 레이아웃 토큰 */
--radius-card: 16px
--radius-sheet: 24px
--radius-pin: 20px
--radius-button: 8px

/* 그림자 */
--elev-1: 0 4px 16px rgba(0,0,0,0.25)
--elev-2: 0 8px 24px rgba(0,0,0,0.3)
```

**⚠️ 문제점**:
- **Tailwind v4 네이티브 통합 안 됨** (config 파일 없음)
- **혼재된 네이밍 컨벤션**:
  - `--text-primary` vs `--fg` (제안된 시스템)
  - `--interactive-primary` vs `--brand-600`
  - `--bg-primary` vs `--bg` / `--surface`
- **부분적 다크모드 지원** (`.dark` 선택자 없음)
- **글로벌 CSS 클래스 오염** (`.btn`, `.badge`, `.card` - 278~349줄)

### 1.2 컴포넌트 사용 패턴

**현재 스타일 적용 방식**:
```tsx
// 1. CSS 변수 직접 사용 (장황함)
className="bg-[color:var(--bg-primary)]"
className="text-[color:var(--text-tertiary)]"

// 2. 글로벌 CSS 클래스
className="btn btn-primary"  // 안티패턴 (Tailwind와 충돌)

// 3. Lucide 아이콘 사용 중
<Search className="h-5 w-5" />  // 24px 표준과 불일치 (20px)
```

**컴포넌트 구조**:
- `components/ui/Button.tsx` - 이미 variant 시스템 존재
- `components/navigation/BottomTabBar.tsx` - 48px 터치 타겟 준수
- `app/(tabs)/explore/page.tsx` - CSS 변수 직접 사용

### 1.3 Tailwind 설정 현황

**❌ Tailwind config 파일 없음**:
- `tailwind.config.ts` 존재하지 않음
- Tailwind v4 CSS 기반 설정 (`@import "tailwindcss"`)
- PostCSS만 설정됨 (`@tailwindcss/postcss`)

**⚠️ 문제**:
- 사용자 정의 색상이 Tailwind 유틸리티 클래스로 노출 안 됨
- `text-brand-600`, `bg-surface` 같은 시맨틱 클래스 사용 불가
- 모든 커스텀 색상을 `bg-[color:var(--*)]` 형태로 써야 함 (장황함)

---

## 🎯 2. 제안된 시스템 분석 (To-Be)

### 2.1 Tailwind UI Blocks 토큰 구조

**제안된 네이밍**:
```css
/* 전경(Foreground) */
--fg: #111827          /* 기본 텍스트 */
--fg-muted: #4b5563    /* 보조 텍스트 */
--fg-subtle: #6b7280   /* 미세 텍스트 */
--fg-inverse: #f9fafb  /* 반전 (다크배경용) */

/* 배경(Background) */
--bg: #ffffff          /* 메인 배경 */
--surface: #ffffff     /* 카드/시트 */
--surface-muted: #f9fafb  /* 서브 영역 */
--overlay: rgba(17,24,39,0.7)  /* 모달 딤 */

/* 경계선 */
--border: #e5e7eb
--border-strong: #d1d5db
--ring: #93c5fd        /* 포커스 링 */

/* 브랜드 */
--brand-50 ~ --brand-800

/* 상태 */
--success, --warning, --danger, --info

/* 그림자 */
--shadow-sm/md/lg
```

**✅ 장점**:
1. **간결한 네이밍** (`--fg` vs `--text-primary`)
2. **역할 기반** (`--surface` = 카드/시트 전용)
3. **다크모드 네이티브 지원** (`.dark` 선택자로 스왑)
4. **Tailwind 확장 전제** (`text-fg`, `bg-surface` 유틸리티 생성)

**⚠️ 단점**:
1. **기존 코드와 호환성 없음** (전체 리팩토링 필요)
2. **학습 곡선** (팀원 모두가 새 네이밍 학습 필요)

### 2.2 Tailwind Config 확장 (제안)

```typescript
// tailwind.config.ts (신규 생성 필요)
export default {
  content: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 시맨틱 색상을 Tailwind 유틸리티로 노출
        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          inverse: 'var(--fg-inverse)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        brand: {
          50: 'var(--brand-50)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
        },
      },
      animation: {
        'pin-pulse': 'pin-pulse 600ms ease-out infinite',
        'sheet-in': 'sheet-in 200ms ease-out',
      },
      transitionDuration: {
        120: '120ms',
        180: '180ms',
        220: '220ms',
      },
    },
  },
} satisfies Config;
```

**효과**:
```tsx
// Before (장황함)
<div className="bg-[color:var(--bg-primary)]" />

// After (간결함)
<div className="bg-bg" />
<div className="text-fg-muted" />
<div className="border-border-strong" />
```

### 2.3 컴포넌트 프리셋 (제안)

```typescript
// lib/ui/presets.ts
const btnBase = "inline-flex items-center justify-center rounded-lg font-medium transition duration-150 focus-visible:ring-2 focus-visible:ring-brand-600/40";

export const btnPrimary = btnBase + " bg-brand-600 hover:bg-brand-700 text-white";
export const btnGhost = btnBase + " text-fg hover:bg-surface-muted";
export const btnOutline = btnBase + " border border-brand-600 text-brand-600";
```

**✅ 장점**:
- 일관성 강제 (모든 버튼이 동일한 transition/focus 스타일)
- 유지보수 용이 (한 곳에서 수정하면 전체 적용)

**⚠️ 단점**:
- Tailwind의 철학과 다소 상반 (유틸리티 우선주의)
- 기존 `components/ui/Button.tsx`와 중복

---

## 🚧 3. 마이그레이션 전략 (3단계 접근)

### 전략 A: 점진적 통합 (추천 ✅)

**Phase 1: 토큰 매핑 레이어 추가 (위험도: 낮음)**

```css
/* app/globals.css - 기존 토큰 유지하면서 신규 토큰 병행 */

:root {
  /* === 기존 토큰 (하위 호환성) === */
  --text-primary: #111827;
  --bg-primary: #FFFFFF;
  --interactive-primary: #2563EB;
  
  /* === 신규 토큰 (Tailwind UI Blocks 방식) === */
  --fg: var(--text-primary);          /* 매핑 */
  --fg-muted: var(--text-secondary);
  --fg-subtle: var(--text-tertiary);
  
  --bg: var(--bg-primary);
  --surface: var(--bg-primary);
  --surface-muted: var(--bg-secondary);
  
  --brand-600: var(--interactive-primary);
  --brand-700: var(--interactive-primary-hover);
  --brand-800: var(--interactive-primary-active);
  
  --border: var(--border-primary);
  --border-strong: var(--border-secondary);
}

.dark {
  /* 다크모드 토큰 추가 */
  --fg: #f9fafb;
  --bg: #0b1020;
  --surface: #0f172a;
  --brand-600: #6366f1;  /* 다크모드에서는 더 밝은 색상 */
}
```

**장점**:
- 기존 코드 깨지지 않음 (`--text-primary` 계속 작동)
- 신규 컴포넌트만 새 네이밍 사용 가능
- 점진적 마이그레이션 (컴포넌트별로 천천히 전환)

**Phase 2: Tailwind Config 생성**

```typescript
// tailwind.config.ts (신규)
import type { Config } from 'tailwindcss';

export default {
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 새 토큰을 Tailwind 유틸리티로 노출
        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        brand: {
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
      },
      spacing: {
        '1.5': '0.375rem',
        '4.5': '1.125rem',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      animation: {
        'pin-pulse': 'pin-pulse 600ms ease-out infinite',
        'badge-pop': 'badge-pop 180ms ease-out forwards',
        'sheet-in': 'sheet-in 200ms ease-out',
      },
      keyframes: {
        'pin-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
        'badge-pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'sheet-in': {
          '0%': { transform: 'translateY(8%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        120: '120ms',
        180: '180ms',
        220: '220ms',
      },
    },
  },
} satisfies Config;
```

**⚠️ 중요**: Tailwind v4는 CSS 기반 설정을 우선하지만, config 파일도 병행 사용 가능.

**Phase 3: 컴포넌트 점진적 마이그레이션**

```tsx
// Before
<button className="bg-[color:var(--interactive-primary)] text-white">

// After
<button className="bg-brand-600 text-white">
```

**마이그레이션 우선순위**:
1. `components/ui/*` (Button, Badge 등 기본 컴포넌트)
2. `components/navigation/BottomTabBar.tsx`
3. `app/(tabs)/*` (탐색, 피드 등 주요 화면)
4. 나머지 페이지들

---

### 전략 B: 전면 교체 (비추천 ❌)

**방법**: 기존 토큰 삭제 → 신규 토큰만 사용

**위험**:
- 모든 컴포넌트 동시 수정 필요 (100+ 파일)
- 테스트 범위 방대
- 롤백 어려움
- 배포 후 버그 발견 시 대응 곤란

**권장하지 않는 이유**: ZZIK LIVE는 이미 운영 중인 서비스로 추정. 전면 교체는 리스크가 너무 큼.

---

### 전략 C: 하이브리드 (중간 절충안)

**핵심 아이디어**: 
- CSS 변수는 신규 네이밍 채택 (--fg, --bg, --brand-*)
- 기존 변수는 alias로 유지 (1년 deprecation 기간)
- Tailwind config는 신규 토큰만 노출

```css
:root {
  /* 신규 토큰 (주력) */
  --fg: #111827;
  --bg: #ffffff;
  --brand-600: #2563EB;
  
  /* 레거시 alias (deprecated) */
  --text-primary: var(--fg);  /* ⚠️ deprecated, use --fg */
  --bg-primary: var(--bg);    /* ⚠️ deprecated, use --bg */
}
```

**장점**:
- 명확한 방향성 (신규 = --fg, 레거시 = --text-primary)
- 기존 코드 안정성 (alias로 계속 작동)
- 신규 개발은 무조건 새 네이밍 (팀 학습 강제)

---

## 🎨 4. 구체적 작업 항목

### 4.1 globals.css 개편

**Before** (현재 94줄~217줄):
```css
:root {
  --text-primary: #111827;
  --bg-primary: #FFFFFF;
  --interactive-primary: #2563EB;
}
```

**After** (하이브리드 접근):
```css
:root {
  /* === Primary Tokens (Tailwind UI Blocks Compatible) === */
  
  /* Foreground */
  --fg: #111827;
  --fg-muted: #4b5563;
  --fg-subtle: #6b7280;
  --fg-inverse: #f9fafb;
  
  /* Background */
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-muted: #f9fafb;
  --overlay: rgba(17, 24, 39, 0.7);
  
  /* Border */
  --border: #e5e7eb;
  --border-strong: #d1d5db;
  --ring: #93c5fd;
  
  /* Brand */
  --brand-50: #eef2ff;
  --brand-100: #e0e7ff;
  --brand-600: #2563eb;
  --brand-700: #1d4ed8;
  --brand-800: #1e40af;
  
  /* States */
  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #0ea5e9;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  
  /* === Legacy Aliases (Deprecated - Remove in v2.0) === */
  --text-primary: var(--fg);
  --text-secondary: var(--fg-muted);
  --text-tertiary: var(--fg-subtle);
  --bg-primary: var(--bg);
  --bg-secondary: var(--surface-muted);
  --interactive-primary: var(--brand-600);
  --interactive-primary-hover: var(--brand-700);
  --border-primary: var(--border);
}

.dark {
  --fg: #f9fafb;
  --fg-muted: #d1d5db;
  --fg-subtle: #9ca3af;
  --fg-inverse: #111827;
  
  --bg: #0b1020;
  --surface: #0f172a;
  --surface-muted: #0c1326;
  --overlay: rgba(0, 0, 0, 0.6);
  
  --border: #1f2a44;
  --border-strong: #26324e;
  --ring: #60a5fa;
  
  --brand-600: #6366f1;  /* 다크모드에서는 더 밝게 */
  --brand-700: #818cf8;
  --brand-800: #a5b4fc;
}
```

### 4.2 Tailwind Config 신규 생성

```bash
# Tailwind v4에서도 config 파일 지원 (선택적)
touch tailwind.config.ts
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',  // .dark 클래스로 다크모드 전환
  theme: {
    extend: {
      colors: {
        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          inverse: 'var(--fg-inverse)',
        },
        bg: {
          DEFAULT: 'var(--bg)',
          surface: 'var(--surface)',
          muted: 'var(--surface-muted)',
        },
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        state: {
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
          info: 'var(--info)',
        },
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        1.5: '0.375rem',
        4.5: '1.125rem',
        5.5: '1.375rem',
      },
      borderRadius: {
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pin-pulse': 'pin-pulse 600ms ease-out infinite',
        'badge-pop': 'badge-pop 180ms ease-out forwards',
        shimmer: 'shimmer 1.5s linear infinite',
        'sheet-in': 'sheet-in 200ms ease-out',
        'sheet-out': 'sheet-out 180ms ease-in',
      },
      keyframes: {
        'pin-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
        'badge-pop': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'sheet-in': {
          '0%': { transform: 'translateY(8%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'sheet-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(8%)', opacity: '0' },
        },
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.2, 0, 0.2, 1)',
        emphasized: 'cubic-bezier(0.2, 0, 0, 0.9)',
      },
      transitionDuration: {
        120: '120ms',
        180: '180ms',
        220: '220ms',
      },
      screens: {
        xs: '360px',
      },
      maxWidth: {
        'screen-xs': '360px',
      },
    },
  },
} satisfies Config;
```

### 4.3 컴포넌트 리팩토링 샘플

**BottomTabBar 마이그레이션**:

```tsx
// Before
className="bg-[color:var(--bg-primary)]/90"
className="border-[color:var(--border-primary)]"
className="text-[color:var(--interactive-primary)]"

// After
className="bg-bg/90"
className="border-border"
className="text-brand-600"
```

**Button 컴포넌트 리팩토링**:

```tsx
// components/ui/Button.tsx - After
const buttonVariants = {
  primary: "bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white",
  ghost: "text-fg hover:bg-surface-muted",
  outline: "border border-brand-600 text-brand-600 hover:bg-brand-600/10",
};

const buttonBase = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:ring-2 focus-visible:ring-brand-600/40 focus-visible:ring-offset-2 disabled:opacity-50";
```

### 4.4 아이콘 표준화

**현재**: Lucide 아이콘, 크기 불일치 (20px, 24px 혼재)

**개선**:
```tsx
// lib/ui/icon-config.ts
export const ICON_SIZES = {
  sm: 20,      // 보조 아이콘
  md: 24,      // 기본 (primary)
  lg: 28,      // CTA/강조
} as const;

// 사용
<Search className="size-6" />  {/* 24px (기본) */}
<MapPin className="size-5" />  {/* 20px (보조) */}
```

**스트로크 통일**:
```tsx
// 모든 Lucide 아이콘에 strokeWidth={1.5} 적용
<Search strokeWidth={1.5} className="size-6" />
```

### 4.5 글로벌 CSS 클래스 제거

**Before** (globals.css 278~349줄):
```css
.btn-primary { ... }  /* ❌ 안티패턴 */
.badge { ... }        /* ❌ */
.card { ... }         /* ❌ */
```

**After**: 컴포넌트로 대체
```tsx
// components/ui/Button.tsx 사용
<Button variant="primary">클릭</Button>

// components/ui/Badge.tsx 생성
<Badge variant="warning">임박</Badge>

// components/ui/Card.tsx 생성
<Card>내용</Card>
```

---

## 📋 5. 실행 계획 (Step-by-Step)

### Phase 1: 기반 구축 (1-2일)

**Step 1**: Tailwind config 생성
```bash
cd /home/user/webapp/zzik-live
cat > tailwind.config.ts << 'EOF'
[위의 config 내용]
EOF
```

**Step 2**: globals.css 리팩토링
- 신규 토큰 추가 (--fg, --bg, --brand-*)
- 레거시 alias 유지 (--text-primary 등)
- `.dark` 선택자 추가

**Step 3**: Design Sandbox 업데이트
- `/design-sandbox`에 새 토큰 showcase 추가
- 다크모드 토글 버튼 추가
- 컴포넌트 미리보기 (다크/라이트 모드)

**검증**:
```bash
npm run dev
# http://localhost:3005/design-sandbox 접속
# 토큰 showcase 확인
# 다크모드 토글 테스트
```

### Phase 2: UI 컴포넌트 마이그레이션 (2-3일)

**우선순위**:
1. `components/ui/Button.tsx` (이미 variant 시스템 있음 → 개선)
2. `components/ui/Badge.tsx` (신규 생성)
3. `components/ui/Card.tsx` (신규 생성)
4. `components/navigation/BottomTabBar.tsx` (토큰만 교체)

**템플릿 생성**:
```tsx
// components/ui/Badge.tsx
export const Badge = ({ variant, children }: BadgeProps) => (
  <span className={cn(
    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
    {
      "bg-surface-muted text-fg-muted": variant === "default",
      "bg-state-warning/10 text-state-warning": variant === "warning",
      "bg-state-success/10 text-state-success": variant === "success",
    }
  )}>
    {children}
  </span>
);
```

### Phase 3: 페이지 컴포넌트 마이그레이션 (3-5일)

**순서**:
1. `app/(tabs)/explore/page.tsx` (샘플 완성)
2. `app/(tabs)/feed/page.tsx`
3. 나머지 페이지들

**자동화 스크립트** (선택):
```bash
# CSS 변수 사용 패턴 찾기
grep -r "bg-\[color:var(--" app/ components/

# 일괄 치환 (주의: 수동 검토 필요)
find app/ -name "*.tsx" -exec sed -i 's/bg-\[color:var(--bg-primary)\]/bg-bg/g' {} +
```

### Phase 4: 글로벌 CSS 정리 (1일)

- `.btn`, `.badge`, `.card` 클래스 삭제
- 사용처 모두 컴포넌트로 교체
- `npm run lint:style` 통과 확인

### Phase 5: 다크모드 활성화 (1-2일)

```tsx
// components/ThemeToggle.tsx (신규)
export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };
  
  return <button onClick={toggle}>🌓</button>;
};
```

### Phase 6: 검증 및 문서화 (1일)

- 모든 페이지 스크린샷 (라이트/다크)
- 접근성 테스트 (터치 타겟, 대비비)
- 토큰 사용 가이드 문서 작성

---

## 🎯 6. 의견 및 권장 사항

### 6.1 즉시 시작 가능한 것 (Low Risk)

✅ **1. Tailwind config 생성**
- 현재 Tailwind v4 CSS 기반이지만 config 병행 가능
- 리스크: 없음 (기존 코드 안 깨짐)
- 효과: `text-brand-600` 같은 간결한 클래스 사용 가능

✅ **2. 다크모드 토큰 추가**
- `.dark` 선택자만 추가 (아직 활성화 안 해도 됨)
- 향후 다크모드 기능 추가 시 즉시 대응 가능

✅ **3. Design Sandbox 확장**
- 새 토큰 showcase 추가
- 팀원들이 신규 토큰 학습 가능

### 6.2 신중히 접근해야 할 것 (Medium Risk)

⚠️ **1. 기존 CSS 변수 이름 변경**
- `--text-primary` → `--fg` 전환
- 위험: 기존 코드 100+ 파일 영향
- 권장: alias 방식으로 1년간 병행 사용

⚠️ **2. 글로벌 CSS 클래스 제거**
- `.btn`, `.badge` 등 제거
- 위험: 레거시 페이지에서 스타일 깨짐 가능
- 권장: 점진적 마이그레이션 (신규 페이지부터)

### 6.3 보류 추천 (High Risk)

❌ **1. 전면 네이밍 변경**
- 모든 `--text-*` → `--fg-*` 일괄 변경
- 위험: 롤백 어려움, 테스트 범위 방대
- 대안: 하이브리드 방식 (alias 병행)

❌ **2. 컴포넌트 프리셋 강제**
- `btnPrimary` 같은 문자열 프리셋 의무화
- 위험: Tailwind 철학과 상반, 유연성 저하
- 대안: `components/ui/*` 컴포넌트만 사용

### 6.4 최종 권장 방향

**🎯 "점진적 하이브리드" 전략**:

1. **신규 토큰 추가** (--fg, --brand-*, 등)
2. **레거시 토큰 alias 유지** (--text-primary → var(--fg))
3. **Tailwind config 생성** (신규 유틸리티 활성화)
4. **신규 컴포넌트부터 적용** (기존 코드 안 건드림)
5. **6개월 후 레거시 토큰 deprecation** (경고 메시지)
6. **1년 후 레거시 토큰 제거** (v2.0 릴리즈)

**이유**:
- 리스크 최소화 (기존 서비스 안정성 유지)
- 학습 곡선 완화 (신규 팀원도 점진적 학습)
- 롤백 가능 (문제 발생 시 레거시로 복귀)
- 명확한 방향성 (미래는 --fg, 과거는 --text-primary)

---

## 🚀 7. 다음 단계 제안

### Option A: 즉시 시작 (추천)

**30분 작업**:
1. `tailwind.config.ts` 생성 (위의 템플릿 복사)
2. `globals.css`에 `.dark` 선택자 추가
3. `/design-sandbox`에 다크모드 토글 추가
4. 커밋 + 푸시

**효과**: 
- Tailwind 유틸리티 활성화 (`text-brand-600` 등)
- 다크모드 기반 마련
- 팀원들 새 토큰 확인 가능

### Option B: 파일럿 프로젝트

**1일 작업**:
1. `app/design-sandbox/page.tsx` 전면 리팩토링
   - 모든 CSS 변수를 신규 토큰으로 교체
   - `bg-[color:var(--*)]` → `bg-brand-600` 형태
2. 다크모드 완전 지원 (토글 버튼 + 모든 컴포넌트)
3. 성능/접근성 검증

**효과**: 
- 실제 적용 시 이슈 사전 발견
- 팀원들에게 "완성형" 보여주기
- 마이그레이션 가이드 작성 자료

### Option C: 전체 마이그레이션

**2주 작업**:
- Phase 1~6 전체 실행 (위의 실행 계획)
- 모든 페이지 + 컴포넌트 전환
- 레거시 토큰 제거 (alias도 삭제)

**비추천 이유**: 
- 리스크 너무 큼 (롤백 어려움)
- 테스트 범위 방대
- 현재 DEV/HYGIENE Sprint와 범위 안 맞음

---

## 📊 8. 요약 및 결론

### 현황
- ✅ 이미 체계적인 토큰 시스템 존재
- ⚠️ Tailwind config 없어서 유틸리티 활용 안 됨
- ⚠️ 네이밍 일관성 부족 (--text-primary vs --fg)
- ❌ 다크모드 미지원

### 제안 시스템 장점
- ✅ 간결한 네이밍 (--fg, --bg)
- ✅ Tailwind 네이티브 통합
- ✅ 다크모드 네이티브 지원
- ✅ 업계 표준 (Tailwind UI Blocks)

### 최적 전략
- 🎯 **점진적 하이브리드 방식**
- 신규 토큰 추가 + 레거시 alias 병행
- Tailwind config 생성 (유틸리티 활성화)
- 신규 컴포넌트부터 적용
- 6개월~1년 마이그레이션 기간

### 첫 단계 권장
1. Tailwind config 생성 (30분)
2. globals.css `.dark` 추가 (15분)
3. Design Sandbox 다크모드 추가 (30분)
4. 커밋 + PR 생성 (15분)

**총 작업 시간**: 1.5시간  
**리스크**: 거의 없음 (기존 코드 안 건드림)  
**효과**: 즉시 Tailwind 유틸리티 사용 가능

---

## 🤔 질문 리스트 (의사결정 필요)

1. **네이밍 선호도**: `--fg` vs `--text-primary` 중 팀 선호?
2. **마이그레이션 속도**: 점진적(6개월) vs 빠른 전환(1개월)?
3. **다크모드 우선순위**: 지금 당장 필요? vs 향후 대응?
4. **글로벌 CSS 클래스**: 완전 제거? vs 일부 유지?
5. **컴포넌트 프리셋**: 문자열 프리셋 사용? vs 컴포넌트만?
6. **레거시 지원 기간**: alias 언제까지 유지? (6개월? 1년?)

---

**작성 완료**. 의견 및 방향성 결정 후 즉시 작업 시작 가능합니다! 🚀
