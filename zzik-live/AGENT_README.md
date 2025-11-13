# 🤖 ZZIK Claude Agent - 사용 가이드

## 개요

ZZIK Claude Agent는 Anthropic의 Claude 3.5 Sonnet을 기반으로 한 위치 인식 AI 어시스턴트입니다.

### 주요 기능

1. **🗺️ 장소 검색** - 사용자 위치 기반 촬영 스팟 추천
2. **💡 촬영 조언** - 구도, 시간대, 설정 등 실용적 팁 제공
3. **📚 북마크 관리** - 관심 장소 저장 및 메모 추가
4. **🎯 컨텍스트 인식** - 대화 흐름을 이해하고 적절한 도구 선택

---

## 🚀 빠른 시작

### 1. API 키 설정

`.env.local` 파일을 생성하고 Anthropic API 키를 추가하세요:

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-...your_key_here
```

> API 키는 [Anthropic Console](https://console.anthropic.com/)에서 발급받을 수 있습니다.

### 2. 의존성 설치

```bash
cd zzik-live
npm install
```

필요한 패키지:
- `@anthropic-ai/sdk` ^0.20.0
- `zod` ^3.23.8

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/agent` 접속

---

## 📁 파일 구조

```
zzik-live/
├── lib/
│   └── agent/
│       ├── prompt.ts           # 시스템 프롬프트 정의
│       └── tools.ts             # 도구 스키마 및 실행 로직
├── components/
│   └── agent/
│       └── AgentChat.tsx        # 채팅 UI 컴포넌트
├── app/
│   ├── agent/
│   │   └── page.tsx            # 에이전트 페이지
│   └── api/
│       └── agent/
│           └── route.ts        # API 라우트 핸들러
└── .env.local                   # 환경 변수 (git 제외)
```

---

## 🛠️ 도구 (Tools)

### 1. search_places

위치 기반으로 촬영 스팟을 검색합니다.

**입력 파라미터:**
```typescript
{
  q?: string,        // 검색 키워드 (예: "카페", "야경")
  lat: number,       // 중심 위도
  lng: number,       // 중심 경도
  radius_m?: number, // 검색 반경 (기본: 1500m, 최대: 5000m)
  limit?: number     // 최대 결과 개수 (기본: 10, 최대: 50)
}
```

**출력 예시:**
```json
{
  "success": true,
  "items": [
    {
      "id": "plc_seongsu_cafe_01",
      "name": "성수 카페거리",
      "lat": 37.5447,
      "lng": 127.0557,
      "distance_m": 235,
      "distance_km": "0.2",
      "tags": ["카페", "핫플레이스", "인스타"],
      "description": "감성 카페가 모여있는 성수동 대표 촬영 스팟",
      "popularity": 0.95
    }
  ],
  "total": 5
}
```

### 2. save_bookmark

장소를 북마크에 저장합니다.

**입력 파라미터:**
```typescript
{
  place_id: string,  // 장소 ID (search_places 결과에서 획득)
  note?: string      // 사용자 메모 (선택)
}
```

**출력 예시:**
```json
{
  "success": true,
  "place_id": "plc_seongsu_cafe_01",
  "place_name": "성수 카페거리",
  "note": "주말에 방문 예정",
  "total_bookmarks": 3,
  "message": "'성수 카페거리'을(를) 북마크에 저장했습니다."
}
```

---

## 🔧 커스터마이징

### 시스템 프롬프트 수정

`lib/agent/prompt.ts`에서 AI의 성격과 행동을 조정할 수 있습니다:

```typescript
export const SYSTEM_PROMPT = `
역할: ZZIK 제품의 위치 기반 가이드...

원칙:
- 한국어 기본. 돌려 말하지 말고 핵심만.
- ...
`;
```

### 도구 추가

`lib/agent/tools.ts`에 새로운 도구를 추가할 수 있습니다:

1. **스키마 정의:**
```typescript
export const toolSchemas = [
  // ... existing tools
  {
    name: "get_weather",
    description: "현재 날씨 정보를 가져옵니다.",
    input_schema: {
      type: "object",
      properties: {
        location: { type: "string" }
      },
      required: ["location"]
    }
  }
] as const;
```

2. **실행 로직 추가:**
```typescript
export async function runTool(block: ToolUseBlock, userId = "demo-user") {
  const { name, input } = block;
  
  if (name === "get_weather") {
    const schema = z.object({ location: z.string() });
    const args = schema.parse(input);
    
    // Weather API 호출
    const weather = await fetchWeatherAPI(args.location);
    
    return {
      success: true,
      temperature: weather.temp,
      condition: weather.condition
    };
  }
  
  // ... other tools
}
```

---

## 🔄 Tool Use 프로토콜

Claude의 Tool Use는 다음과 같이 동작합니다:

```
1. User → Agent: "근처 카페 추천해줘"
2. Agent → Claude API: 초기 메시지 전송
3. Claude → Agent: tool_use 블록 반환 (search_places 호출 요청)
4. Agent: runTool() 실행
5. Agent → Claude API: tool_result 전송
6. Claude → Agent: 최종 텍스트 응답
7. Agent → User: "성수 카페거리를 추천합니다..."
```

**중요:** 
- `tool_use` 블록을 받으면 **반드시** `tool_result`로 결과를 돌려줘야 합니다
- 여러 도구를 한 번에 호출할 수 있습니다 (병렬 실행)
- 최대 5번까지 tool loop를 반복합니다 (무한 루프 방지)

---

## 🗄️ 데이터베이스 연동

현재는 데모용 인메모리 저장소를 사용하고 있습니다. 실제 서비스에서는 다음과 같이 교체하세요:

### Supabase PostGIS 예시

```typescript
// lib/agent/tools.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function runTool(block: ToolUseBlock, userId: string) {
  if (name === "search_places") {
    const { lat, lng, radius_m, q } = args;
    
    // PostGIS 쿼리
    const { data, error } = await supabase.rpc('search_places_nearby', {
      center_lat: lat,
      center_lng: lng,
      radius_meters: radius_m,
      search_query: q || ''
    });
    
    if (error) throw error;
    
    return {
      success: true,
      items: data,
      total: data.length
    };
  }
}
```

### SQL 함수 예시

```sql
CREATE OR REPLACE FUNCTION search_places_nearby(
  center_lat FLOAT,
  center_lng FLOAT,
  radius_meters INT,
  search_query TEXT
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  lat FLOAT,
  lng FLOAT,
  distance_m INT,
  tags TEXT[],
  description TEXT,
  popularity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    ST_Y(p.geom::geometry) as lat,
    ST_X(p.geom::geometry) as lng,
    ST_Distance(
      p.geom::geography,
      ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography
    )::INT as distance_m,
    p.tags,
    p.description,
    p.popularity
  FROM places p
  WHERE 
    ST_DWithin(
      p.geom::geography,
      ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography,
      radius_meters
    )
    AND (
      search_query = '' OR
      p.name ILIKE '%' || search_query || '%' OR
      p.tags && ARRAY[search_query]
    )
  ORDER BY distance_m ASC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔐 보안 고려사항

### 1. API 키 보호

- ✅ `.env.local`은 절대 Git에 커밋하지 마세요
- ✅ Vercel/서버 환경에서는 Environment Variables로 설정
- ✅ 클라이언트 사이드에서 API 키 노출 금지

### 2. Rate Limiting

프로덕션에서는 반드시 레이트 리밋을 추가하세요:

```typescript
// app/api/agent/route.ts
import { ratelimit } from '@/lib/redis';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' },
      { status: 429 }
    );
  }
  
  // ... rest of handler
}
```

### 3. 입력 검증

모든 사용자 입력은 Zod로 검증됩니다:

```typescript
const schema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius_m: z.number().int().min(100).max(5000)
});

const args = schema.parse(input); // Throws if invalid
```

---

## 📊 모니터링

### 토큰 사용량 추적

```typescript
// 응답에 포함됨
{
  "text": "...",
  "usage": {
    "input_tokens": 1234,
    "output_tokens": 567
  },
  "model": "claude-3-5-sonnet-20241022"
}
```

### 로깅

서버 로그를 확인하여 도구 실행 과정을 모니터링할 수 있습니다:

```
[Agent] Starting conversation with 3 messages
[Agent] Round 1: Executing 1 tool(s)
[Agent] Executing tool: search_places
[Agent] Tool result: {"success":true,"items":[...]...
[Agent] No more tools to execute. Finished in 2 rounds.
[Agent] Conversation completed. Response length: 456
```

---

## 🐛 트러블슈팅

### "ANTHROPIC_API_KEY is not configured"

**원인:** 환경 변수가 설정되지 않음

**해결:**
1. `.env.local` 파일 존재 확인
2. `ANTHROPIC_API_KEY=sk-ant-...` 형식으로 키 입력
3. 개발 서버 재시작

### "응답을 생성할 수 없습니다"

**원인:** Claude API 오류 또는 네트워크 문제

**해결:**
1. API 키 유효성 확인
2. Anthropic 서비스 상태 확인 (status.anthropic.com)
3. 네트워크 방화벽 설정 확인

### "Tool execution error"

**원인:** 도구 입력 값 검증 실패

**해결:**
1. 서버 로그에서 Zod 에러 확인
2. 도구 스키마와 입력 값 일치 여부 확인
3. 필요시 스키마 수정

---

## 📚 추가 자료

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Tool Use Guide](https://docs.anthropic.com/claude/docs/tool-use)
- [Best Practices](https://docs.anthropic.com/claude/docs/best-practices)
- [Next.js App Router](https://nextjs.org/docs/app)

---

## 🎯 다음 단계

### 단기 개선 사항
- [ ] 실제 데이터베이스 연동 (Supabase PostGIS)
- [ ] 사용자 인증 및 세션 관리
- [ ] 대화 히스토리 저장
- [ ] 스트리밍 응답 지원

### 중기 개선 사항
- [ ] 이미지 분석 (Vision API)
- [ ] 음성 입력/출력
- [ ] 다국어 지원
- [ ] A/B 테스트 및 성능 최적화

### 장기 개선 사항
- [ ] RAG (Retrieval-Augmented Generation)
- [ ] 파인튜닝 모델
- [ ] 멀티모달 지원
- [ ] 에이전트 체인 (Agent Chain)

---

**Made with ❤️ by ZZIK Team**

문의: support@zziklive.com
