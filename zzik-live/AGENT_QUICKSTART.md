# 🚀 Claude Agent 빠른 설정 가이드

## 1단계: API 키 발급 (2분)

1. https://console.anthropic.com/ 접속
2. 회원가입/로그인
3. "API Keys" 메뉴에서 "Create Key" 클릭
4. 키 복사 (sk-ant-api03-...)

## 2단계: 환경 변수 설정 (1분)

`.env.local` 파일 생성:

```bash
cd zzik-live
echo "ANTHROPIC_API_KEY=sk-ant-api03-your_key_here" > .env.local
```

**또는** 직접 파일 생성:

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-your_actual_key_here
```

## 3단계: 실행 (1분)

```bash
# 의존성 설치 (이미 완료됨)
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 열기:
```
http://localhost:3000/agent
```

## 테스트 대화 예시

### 기본 대화
```
User: 안녕?
Agent: 안녕하세요! ZZIK 에이전트입니다. 무엇을 도와드릴까요?
```

### 위치 기반 검색 (위치 공유 필요)
```
User: 근처 카페 추천해줘
Agent: [search_places 도구 실행]
      성수 카페거리를 추천합니다. 거리: 0.2km
      감성 카페가 모여있는 성수동 대표 촬영 스팟입니다.
```

### 촬영 조언
```
User: 야경 촬영 팁 알려줘
Agent: 야경 촬영 팁을 알려드릴게요:
      1. 골든아워(일몰 1시간 전) 활용
      2. ISO 낮게, 삼각대 사용
      3. RAW 포맷으로 촬영
```

### 북마크 저장
```
User: 성수 카페거리 북마크해줘
Agent: [save_bookmark 도구 실행]
      '성수 카페거리'을(를) 북마크에 저장했습니다.
```

## 트러블슈팅

### "ANTHROPIC_API_KEY is not configured"
→ `.env.local` 파일 확인 및 개발 서버 재시작

### "응답을 생성할 수 없습니다"
→ API 키 유효성 확인 (console.anthropic.com)
→ 인터넷 연결 확인

### 위치 공유 안 됨
→ 브라우저 설정에서 위치 권한 허용
→ HTTPS 환경 필요 (localhost는 예외)

## 다음 단계

1. **실제 데이터 연동**: `lib/agent/tools.ts`의 `demoPlaces`를 DB로 교체
2. **사용자 인증**: NextAuth.js 추가
3. **대화 기록**: 세션 저장소 구현
4. **스트리밍**: SSE로 실시간 응답

자세한 내용: `AGENT_README.md` 참조

---

**준비 완료!** 이제 `/agent` 페이지에서 AI와 대화하세요! 🎉
