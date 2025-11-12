# 🚀 ZZIK LIVE - GPS Triple Verification Full-Stack Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-Web-000020?logo=expo)](https://expo.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

**Enterprise-grade location-based mission platform with military-grade security**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Security Features](#-security-features)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

ZZIK LIVE는 GPS 기반 위치 검증, QR 코드 인증, 영수증 검증을 통합한 **삼중 보안 체크인 시스템**입니다.

### Key Features

- ✅ **GPS Triple Verification**: 위치, 타임스탬프, 속도 검증
- 🔐 **QR Code Challenge**: 5분 시간 제한 일회용 QR 토큰
- 📄 **Receipt Validation**: SHA-256 해시 기반 영수증 검증
- 🌐 **Multi-language**: 한국어, 日本語, 中文 지원
- 🛡️ **Rate Limiting**: In-memory IP 기반 요청 제한
- 📱 **Cross-platform**: Web + Mobile (Expo)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
│  ┌──────────────┐           ┌──────────────┐               │
│  │  Next.js 15  │           │  Expo Mobile │               │
│  │   (Web UI)   │           │     (PWA)    │               │
│  └──────────────┘           └──────────────┘               │
└────────────────────┬────────────────┬───────────────────────┘
                     │                │
                     ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js API Routes (Middleware + Rate Limiting)     │   │
│  │  /api/health  /api/consents  /api/submissions        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │  PostgreSQL Functions & Triggers                   │     │
│  │  • approve_mission_and_reward()                    │     │
│  │  • get_mission_distance_and_status()               │     │
│  │  • fn_validate_submission_on_approval()            │     │
│  └────────────────────────────────────────────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Supabase)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Missions │  │ Partners │  │  QR Tokens│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │Submissions│  │Receipts  │  │Franchise │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0.1** - React 19 서버 컴포넌트, App Router
- **TypeScript 5.0+** - Type-safe 개발
- **React 19.2.0** - 최신 React 기능
- **Expo** - 크로스 플랫폼 모바일

### Backend
- **Next.js API Routes** - RESTful API
- **Supabase PostgreSQL** - PostGIS 확장 지원
- **Row Level Security** - 데이터베이스 레벨 권한 관리

### Infrastructure
- **Vercel** - Serverless 배포 (권장)
- **Cloudflare Pages** - 글로벌 CDN
- **GitHub Actions** - CI/CD 파이프라인

---

## 📁 Project Structure

```
zzik-live/
├── landing/                      # Next.js 15 웹 애플리케이션
│   ├── app/
│   │   ├── [locale]/            # i18n 라우팅
│   │   │   └── layout.tsx       # 다국어 레이아웃
│   │   └── api/
│   │       ├── health/          # 헬스체크
│   │       ├── consents/        # 위치 동의
│   │       └── submissions/     # 체크인 제출
│   ├── middleware.ts            # Rate limiting + CORS
│   ├── next.config.mjs          # Next.js 설정
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── zzik-mobile-app/             # Expo 모바일 앱
│   └── app.json                 # Expo 설정
│
├── supabase_sql_pack/           # 데이터베이스 스키마
│   ├── 22_functions.sql         # 핵심 비즈니스 로직
│   ├── 27_mission_distance.sql  # GPS 거리 계산
│   ├── 29_submission_guards.sql # 삼중 검증 트리거
│   ├── 30_receipts.sql          # 영수증 관리
│   └── 31_franchise.sql         # 프랜차이즈 계약
│
├── .gitignore                   # Git 제외 파일
├── FINAL_RUNBOOK.md             # 복원 가이드
└── README.md                    # 이 문서
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.17+ (LTS 권장)
- **npm** 또는 **yarn**
- **Supabase** 프로젝트 (PostgreSQL + PostGIS)
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/zzik-live.git
cd zzik-live
```

### 2. Install Dependencies

```bash
cd landing
npm ci
```

### 3. Environment Setup

```bash
cp .env.example .env
```

**`.env` 파일 설정:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Database Migration

```bash
# Supabase CLI 설치
npm install -g supabase

# 데이터베이스 연결
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# SQL 마이그레이션 실행 (순서 중요!)
cd ../supabase_sql_pack
for f in 22_functions.sql 27_mission_distance.sql 29_submission_guards.sql 30_receipts.sql 31_franchise.sql; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done
```

### 5. Development Server

```bash
cd ../landing
npm run dev
```

🎉 **Open http://localhost:3000** - 서버가 실행됩니다!

### 6. Health Check

```bash
curl -sf http://localhost:3000/api/health | jq
# Expected: {"status":"healthy","ts":"2025-11-12T05:00:00.000Z"}
```

---

## 🌍 Deployment

### Vercel (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd landing
vercel --prod
```

**환경 변수 설정:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### Cloudflare Pages

```bash
cd landing
npm run build
npx wrangler pages deploy .next --project-name=zzik-live
```

---

## 🔒 Security Features

### 1. GPS Triple Verification

```typescript
// 50m 이내 거리 검증
ST_Distance(partner_location, user_location) <= 50

// 타임스탬프 검증 (5분 이내)
abs(extract(epoch from (submitted_at - qr_scanned_at))) <= 300

// QR 토큰 일회성 검증
qr_challenge.used_at IS NULL
```

### 2. Rate Limiting

- **10 requests / 10 seconds** per IP
- In-memory sliding window
- Automatic cleanup

### 3. Row Level Security

```sql
-- 사용자는 자신의 데이터만 조회
CREATE POLICY submissions_self_read ON mission_submissions
FOR SELECT USING (user_id = auth.uid());

-- 관리자는 모든 데이터 접근
CREATE POLICY submissions_admin_all ON mission_submissions
FOR ALL USING (
  EXISTS(SELECT 1 FROM users WHERE id=auth.uid() AND role='admin')
);
```

---

## 📚 API Documentation

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "ts": "2025-11-12T05:00:00.000Z"
}
```

### Location Consent

```http
POST /api/consents/location
Content-Type: application/json

{
  "user_id": "uuid",
  "granted": true,
  "device_info": "iOS 17.0"
}
```

### Mission Check-in

```http
POST /api/submissions/checkin
Content-Type: application/json

{
  "mission_id": "uuid",
  "user_id": "uuid",
  "latitude": 37.5665,
  "longitude": 126.9780,
  "timestamp": "2025-11-12T05:00:00.000Z",
  "qr_token": "challenge-token",
  "receipt_url": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "submission_id": "uuid",
  "status": "pending"
}
```

---

## 🗄️ Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | 사용자 정보 (balance, earnings) |
| `partners` | 파트너 매장 (GPS location) |
| `missions` | 미션 정보 (reward, deadline) |
| `mission_submissions` | 체크인 제출 (GPS + QR + Receipt) |
| `qr_challenges` | QR 토큰 (5분 유효기간) |
| `receipts` | 영수증 (SHA-256 해시) |
| `transactions` | 포인트 거래 내역 |

### Key Functions

- `approve_mission_and_reward(submission_id, reward_amount)` - 미션 승인 + 리워드 지급
- `get_mission_distance_and_status(mission_id, lat, lng)` - GPS 거리 계산
- `fn_validate_submission_on_approval()` - 삼중 검증 트리거

---

## 🤝 Contributing

### Git Workflow

```bash
# 새 기능 브랜치 생성
git checkout -b feature/user-profile

# 커밋 컨벤션
git commit -m "feat: Add user profile API endpoint"

# Pull Request 생성
git push origin feature/user-profile
```

### Commit Message Convention

| Prefix | Description |
|--------|-------------|
| `feat:` | 새 기능 추가 |
| `fix:` | 버그 수정 |
| `docs:` | 문서 변경 |
| `refactor:` | 코드 리팩토링 |
| `test:` | 테스트 추가/수정 |
| `chore:` | 빌드/설정 변경 |

---

## 📄 License

**Proprietary License** - All rights reserved.

이 프로젝트는 상용 소프트웨어이며, 무단 복제, 배포, 수정을 금지합니다.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR-USERNAME/zzik-live/issues)
- **Email**: support@zzik.live
- **Docs**: [Documentation](https://docs.zzik.live)

---

## 🔗 Links

- [Supabase Dashboard](https://app.supabase.io)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Expo Documentation](https://docs.expo.dev)

---

<div align="center">

**Built with ❤️ by ZZIK Team**

[Website](https://zzik.live) • [GitHub](https://github.com/zzik-live) • [Twitter](https://twitter.com/zzik_live)

</div>
