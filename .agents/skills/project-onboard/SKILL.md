---
name: project-onboard
description: >
  Use this skill when a new developer asks about the project structure, how to
  get started, what tech stack is used, or how different parts of the codebase
  connect. Triggers on: "how does this project work", "explain the structure",
  "what is X in this project", "how do I set up", "where do I put X",
  "onboard me", or any orientation question from someone unfamiliar with the
  codebase.
---

# Project Onboarding Guide

## Tech Stack at a Glance

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Framework   | Next.js 16.2.7 + React 19.2.7 (App Router)   |
| Database    | MariaDB 11.8 via Docker + Prisma v7           |
| Auth        | better-auth 1.6.11 (email/password)           |
| UI          | Shadcn UI (radix-luma) + Tailwind CSS v4      |
| Icons       | Remixicon (`ri-*` class names)                |
| State       | Zustand (cart only)                           |
| Language    | Thai — UI text, comments, error messages      |

## App Structure

```
src/app/
  (front)/          ← หน้าหลัก + navbar (layout มี <html><body>)
    layout.tsx      ← root layout พร้อม <Navbar /> ครอบด้วย <Suspense>
    page.tsx        ← หน้า home
    product/        ← รายการสินค้าจาก DB (dynamic, Prisma)
    course/         ← รายการคอร์สจาก external API
    cart/           ← ตะกร้าสินค้า (Zustand)
    contact/        ← ฟอร์มติดต่อ (ส่ง email ผ่าน nodemailer)
    components/     ← component เฉพาะ (front) group
  (auth)/           ← login/signup (layout มี <html><body> ของตัวเอง)
    login/
    signup/
  api/
    auth/[...all]/  ← better-auth handler
    contact/        ← POST send email
src/components/     ← shared components (navbar, hero, logo, ฯลฯ)
src/components/ui/  ← Shadcn components
src/lib/
  prisma.ts         ← Prisma singleton (driver adapter)
  auth.ts           ← better-auth server config
  auth-client.ts    ← better-auth client
  cart-store.ts     ← Zustand store
  utils.ts          ← cn() helper
  validations/      ← Zod schemas
src/services/       ← external API fetchers (course-service.ts)
src/types/          ← TypeScript types ทั้งหมดแยกไว้ที่นี่
```

## Critical Architecture Points

**สอง layout แยกกันสนิท** — ไม่มี `src/app/layout.tsx` ระดับ root
- `(front)/layout.tsx` → หน้าหลักทั้งหมด มี navbar
- `(auth)/layout.tsx` → login/signup ไม่มี navbar

**Prisma ต้องใช้ driver adapter** — ไม่ใช่ datasource URL ตรง:
```typescript
// src/lib/prisma.ts
const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })
```

**Import path ของ Prisma Client**:
```typescript
import { PrismaClient } from "../../generated/prisma/client"
// ไม่ใช่ "@prisma/client"
```

## First-Time Setup

```bash
# 1. Install dev
npm install  # แก้ DATABASE_URL, BETTER_AUTH_SECRET

# 2. Copy env
cp .env.example .env  # แก้ DATABASE_URL, BETTER_AUTH_SECRET

# 3. Pull DB Schema (Prisma ORM)
npx prisma db pull

# 3. Generate Prisma client (หลัง DB พร้อม)
npx prisma generated

# 4. Check Code and Lint
npm run lint
```

## Gotchas

- Next.js 16 มี breaking changes — อ่าน `node_modules/next/dist/docs/` ก่อนเขียน code
- `cacheComponents: true` ใน `next.config.ts` — เปิด experimental cache
- `await connection()` ต้องใส่ใน Server Component ที่ต้องการ dynamic rendering
- Model ชื่อ snake_case (`products` ไม่ใช่ `Product`) — ห้าม rename
