# 🔧 GitHub Actions CI/CD 워크플로우 설정 가이드

## ⚠️ 현재 상황

GitHub App의 보안 정책으로 인해 `.github/workflows/` 디렉토리의 파일들은 자동으로 푸시할 수 없습니다. 
이는 GitHub의 보안 메커니즘으로, `workflows` 권한이 없는 GitHub App이 CI/CD 파이프라인을 임의로 수정하는 것을 방지합니다.

**에러 메시지:**
```
refusing to allow a GitHub App to create or update workflow 
`.github/workflows/ci.yml` without `workflows` permission
```

## ✅ 해결 방법

### 방법 1: GitHub 웹 UI에서 직접 파일 생성 (권장)

1. GitHub 저장소로 이동: https://github.com/josihu0604-lang/Zzikmuok

2. `.github/workflows/` 디렉토리 생성:
   - 저장소 루트에서 "Add file" → "Create new file" 클릭
   - 파일 이름에 `.github/workflows/ci.yml` 입력

3. 아래 워크플로우 내용을 복사하여 붙여넣기

4. "Commit new file" 클릭

### 방법 2: 로컬에서 다른 Git 클라이언트 사용

개인 GitHub 계정으로 직접 푸시:

```bash
# SSH 키 또는 개인 액세스 토큰 사용
git remote set-url origin git@github.com:josihu0604-lang/Zzikmuok.git
git push origin genspark_ai_developer
```

---

## 📄 CI/CD 워크플로우 파일 내용

**파일 경로:** `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, genspark_ai_developer]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
          cache-dependency-path: zzik-live/package-lock.json
      
      - name: Install dependencies
        working-directory: ./zzik-live
        run: npm ci
      
      - name: Run ESLint
        working-directory: ./zzik-live
        run: npm run lint
      
      - name: Run TypeScript check
        working-directory: ./zzik-live
        run: npx tsc --noEmit
      
      - name: Run unit tests
        working-directory: ./zzik-live
        run: npm test -- --passWithNoTests --testPathIgnorePatterns=e2e --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./zzik-live/coverage/lcov.info
          fail_ci_if_error: false

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: lint-and-test
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
          cache-dependency-path: zzik-live/package-lock.json
      
      - name: Install dependencies
        working-directory: ./zzik-live
        run: npm ci
      
      - name: Build application
        working-directory: ./zzik-live
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: zzik-live/.next
          retention-days: 7

  e2e-test:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'
          cache-dependency-path: zzik-live/package-lock.json
      
      - name: Install dependencies
        working-directory: ./zzik-live
        run: npm ci
      
      - name: Install Playwright browsers
        working-directory: ./zzik-live
        run: npx playwright install --with-deps chromium firefox webkit
      
      - name: Run E2E tests
        working-directory: ./zzik-live
        run: npx playwright test
      
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: zzik-live/playwright-report
          retention-days: 7
```

---

## 🎯 워크플로우 기능

### Job 1: Lint and Test (린트 및 테스트)
- ✅ ESLint 코드 품질 검사
- ✅ TypeScript 타입 체크
- ✅ Jest 단위 테스트 실행 (8개 테스트)
- ✅ 코드 커버리지 측정 및 Codecov 업로드

### Job 2: Build (빌드)
- ✅ Next.js 프로덕션 빌드
- ✅ 빌드 산출물을 아티팩트로 저장 (7일 보관)

### Job 3: E2E Test (E2E 테스트)
- ✅ Playwright 브라우저 설치 (Chromium, Firefox, WebKit)
- ✅ 모든 E2E 테스트 실행
- ✅ 테스트 리포트를 아티팩트로 저장

---

## 📊 예상 실행 결과

워크플로우가 설정되면 다음과 같은 동작을 합니다:

1. **Push to main/genspark_ai_developer**: 모든 job 자동 실행
2. **Pull Request to main**: 모든 job 자동 실행 (병합 전 검증)
3. **실행 시간**: 약 5-10분
4. **비용**: GitHub Actions 무료 tier 내에서 실행 가능

---

## ✅ 설정 확인 방법

워크플로우 파일을 추가한 후:

1. GitHub 저장소의 "Actions" 탭으로 이동
2. 워크플로우가 자동으로 실행되는지 확인
3. 각 job의 로그를 확인하여 문제 해결

---

## 📝 참고 사항

- 워크플로우 파일은 저장소 루트의 `.github/workflows/` 디렉토리에 위치해야 합니다
- 파일 이름은 `.yml` 또는 `.yaml` 확장자를 사용해야 합니다
- 첫 실행 시 GitHub Actions 사용 승인이 필요할 수 있습니다
- Codecov 통합을 위해서는 별도로 Codecov 계정 연동이 필요합니다 (선택사항)

---

## 🔗 관련 링크

- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Playwright 문서](https://playwright.dev/)
- [Codecov 문서](https://docs.codecov.io/)
- [Next.js CI/CD 가이드](https://nextjs.org/docs/deployment)

---

**작성일**: 2025-11-12  
**프로젝트**: ZZIK LIVE  
**저장소**: https://github.com/josihu0604-lang/Zzikmuok
