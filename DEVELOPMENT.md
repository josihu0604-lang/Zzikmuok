# 🛠️ ZZIK LIVE Development Guide

## 📋 Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD](#cicd)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or later
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/josihu0604-lang/Zzikmuok.git
cd Zzikmuok/zzik-live

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
zzik-live/
├── app/                    # Next.js 16 App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── salient/           # Salient template
│   └── pocket/            # Pocket template
├── components/            # React components
│   ├── salient/          # Salient-specific components
│   ├── pocket/           # Pocket-specific components
│   ├── landing/          # Landing page components
│   └── ui/               # UI primitives
├── lib/                   # Utilities
│   └── utils.ts          # Helper functions
├── __tests__/            # Unit tests
├── e2e/                  # E2E tests (Playwright)
├── public/               # Static assets
├── jest.config.ts        # Jest configuration
├── playwright.config.ts  # Playwright configuration
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies
```

---

## 🔧 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (http://localhost:3000)

# Building
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npx tsc --noEmit       # TypeScript type checking

# Testing
npm test               # Run unit tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report

# E2E Testing
npm run test:e2e       # Run Playwright tests
npm run test:e2e:ui    # Run with UI mode
npm run test:e2e:headed # Run in headed mode
```

### Development Best Practices

1. **Always run linter before commit**
   ```bash
   npm run lint
   ```

2. **Write tests for new components**
   ```bash
   # Unit test
   __tests__/components/YourComponent.test.tsx
   
   # E2E test
   e2e/your-feature.spec.ts
   ```

3. **Follow commit convention**
   ```bash
   feat: Add new feature
   fix: Fix bug
   docs: Update documentation
   test: Add tests
   chore: Update dependencies
   ```

---

## 🧪 Testing

### Unit Tests (Jest + Testing Library)

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# UI mode (interactive)
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed
```

### Writing Tests

**Unit Test Example:**
```typescript
// __tests__/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

test('renders button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

**E2E Test Example:**
```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading')).toBeVisible()
})
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_APP_URL
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

---

## 🤖 CI/CD

### GitHub Actions

Automatic CI/CD pipeline runs on:
- Push to `main` or `genspark_ai_developer`
- Pull requests to `main`

**Pipeline Steps:**
1. Lint code (ESLint)
2. Type check (TypeScript)
3. Run unit tests
4. Build application
5. Upload coverage

**Configuration:** `.github/workflows/ci.yml`

### Local CI Verification

```bash
# Run full CI locally
npm run lint && \
npx tsc --noEmit && \
npm test -- --coverage && \
npm run build
```

---

## 📊 Performance Optimization

### Next.js Image Optimization

```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // for above-the-fold images
/>
```

### Code Splitting

```tsx
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>
})
```

---

## 🔒 Security

### Headers

Security headers are configured in `next.config.ts`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Environment Variables

Never commit sensitive data. Use `.env.local` for secrets:

```bash
# .env.local (gitignored)
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Playwright Documentation](https://playwright.dev)
- [Jest Documentation](https://jestjs.io)

---

## 🆘 Troubleshooting

### Common Issues

**Issue:** Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Issue:** TypeScript errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Issue:** Tests failing
```bash
# Clear Jest cache
npx jest --clearCache
npm test
```

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/josihu0604-lang/Zzikmuok/issues)
- **Documentation:** This file and README.md
- **Team Chat:** (Add your team chat link)

---

**Last Updated:** 2025-11-12  
**Version:** 1.0.0
