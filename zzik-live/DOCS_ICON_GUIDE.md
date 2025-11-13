# 아이콘 사용 가이드

이 문서는 ZZIK 프로젝트에서 **일관된 아이콘 사용**을 보장하기 위한 표준입니다.

---

## 📚 **아이콘 라이브러리**

- **Lucide React**: `lucide-react` 패키지 사용
- **버전**: ^0.460.0
- **스타일**: 라인 아이콘 (일관성 유지)

---

## 🎨 **표준 아이콘 매핑**

### **액션 (Actions)**

| 액션 | 아이콘 컴포넌트 | 설명 |
|------|----------------|------|
| 좋아요 | `Heart` | 활성 시 Accent 색상 |
| 저장 | `Bookmark` | 활성 시 Primary 색상 |
| 공유 | `Share2` | 공유하기 기능 |
| 댓글 | `MessageCircle` | 댓글 달기/보기 |
| 조회 | `Eye` | 조회수 표시 (읽기 전용) |
| 방문 | `Users` | 장소 방문 횟수 |
| 평점 | `Star` | 별점 표시 |

### **네비게이션 (Navigation)**

| 항목 | 아이콘 컴포넌트 | 사용 위치 |
|------|----------------|----------|
| 탐색 (비활성) | `Map` | Bottom Tab Bar |
| 탐색 (활성) | `MapPin` | Bottom Tab Bar (selected) |
| 피드 | `LayoutGrid` | Bottom Tab Bar |
| 검색 | `Search` | Explore 헤더 |
| 프로필 | `User` | 프로필 페이지 |
| 설정 | `Settings` | 설정 페이지 |

### **상태 (States)**

| 상태 | 아이콘 컴포넌트 | 사용 위치 |
|------|----------------|----------|
| 로딩 | `Loader2` | 로딩 상태 (회전 애니메이션) |
| 오류 | `AlertCircle` | 일반 오류 |
| 성공 | `CheckCircle` | 성공 메시지 |
| 경고 | `AlertTriangle` | 경고 메시지 |
| 정보 | `Info` | 정보 메시지 |
| 오프라인 | `WifiOff` | 네트워크 연결 없음 |
| 서버 오류 | `ServerCrash` | 서버 장애 |
| 404 | `SearchX` | 페이지 없음 |
| 권한 없음 | `Lock` | 인증 필요 |

### **미디어 (Media)**

| 항목 | 아이콘 컴포넌트 | 설명 |
|------|----------------|------|
| 카메라 | `Camera` | 사진/동영상 촬영 |
| 이미지 | `Image` | 이미지 콘텐츠 |
| 비디오 | `Video` | 동영상 콘텐츠 |
| 재생 | `Play` | 동영상 재생 |
| 정지 | `Pause` | 동영상 일시정지 |

---

## 🎨 **색상 규칙**

### **기본 색상**

```tsx
// 비활성 상태
className="text-[color:var(--text-tertiary)]"

// 활성 상태
className="text-[color:var(--text-primary)]"
```

### **액션별 색상**

```tsx
// 좋아요 (활성)
className="text-red-500"

// 저장 (활성)
className="text-[color:var(--interactive-primary)]"

// 기타 액션 (활성)
className="text-[color:var(--interactive-primary)]"
```

---

## ⚡ **사용 예제**

### **1. 기본 아이콘 버튼**

```tsx
import { Heart } from 'lucide-react';

<button aria-label="좋아요" aria-pressed={isLiked}>
  <Heart className={isLiked ? 'text-red-500' : 'text-[color:var(--text-tertiary)]'} />
</button>
```

### **2. IconButton 컴포넌트 사용**

```tsx
import { IconButton } from '@/components/ui/IconButton';
import { Bookmark } from 'lucide-react';

<IconButton
  icon={Bookmark}
  label="저장"
  pressed={isSaved}
  onClick={handleSave}
  variant="primary"
/>
```

### **3. 메트릭 표시**

```tsx
import Metric from '@/components/metrics/Metric';

<Metric kind="likes" value={1234} />
<Metric kind="views" value={5678} labelHidden />
```

---

## 🚫 **금지 사항**

1. **아이콘 중복**: 같은 의미에 다른 아이콘 사용 금지
   - ❌ `ThumbsUp` + `Heart` 혼용
   - ✅ `Heart` 통일

2. **의미 불일치**: 아이콘과 레이블이 맞지 않는 경우
   - ❌ `Share` 아이콘에 "다운로드" 레이블
   - ✅ `Download` 아이콘에 "다운로드" 레이블

3. **접근성 누락**: `aria-label` 없는 아이콘 버튼
   - ❌ `<button><Heart /></button>`
   - ✅ `<button aria-label="좋아요"><Heart /></button>`

4. **크기 불일치**: 표준 크기 외 사용
   - ❌ `className="h-3 w-3"` (너무 작음)
   - ✅ `className="h-4 w-4"` (표준 메트릭)
   - ✅ `className="h-6 w-6"` (표준 버튼)

---

## 📏 **표준 크기**

| 용도 | 크기 | Tailwind Class |
|------|------|----------------|
| 메트릭 | 16×16px | `h-4 w-4` |
| 버튼 | 24×24px | `h-6 w-6` |
| 대형 액션 | 32×32px | `h-8 w-8` |
| Empty State | 64×64px | `h-16 w-16` |

---

## 🔄 **애니메이션**

### **로딩 (회전)**

```tsx
import { Loader2 } from 'lucide-react';

<Loader2 className="h-6 w-6 animate-spin" />
```

### **펄스 (신규)**

```tsx
import { MapPin } from 'lucide-react';

<MapPin className="h-6 w-6 animate-pulse" />
```

---

## ✅ **체크리스트**

- [ ] 모든 아이콘 버튼에 `aria-label` 존재
- [ ] 활성/비활성 상태가 색상으로 명확히 구분
- [ ] 표준 크기 사용 (h-4 w-4, h-6 w-6)
- [ ] 의미 중복 없음 (한 가지 액션 = 한 가지 아이콘)
- [ ] 툴팁은 데스크톱 환경만 (모바일은 레이블 표시)

---

**업데이트**: 2025-11-13  
**버전**: 1.0.0
