<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Tech Stack
- **Framework**: Next.js 16.2.7 (Experimental/Custom)
- **Runtime**: React 19
- **Database**: MariaDB via Prisma 7.8
- **Auth**: `better-auth` (using `src/lib/auth.ts`)
- **State**: Zustand (`src/lib/cart-store.ts`)
- **Styling**: Tailwind CSS 4, shadcn/ui

## Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Key Architecture & Quirks
- **Prisma Client**: Generated to `generated/prisma` (non-standard). Imports should come from `../../generated/prisma/client`.
- **Path Aliases**: `@/*` maps to `src/*`.
- **Service Layer**: Business logic/API fetching in `src/services/`.
- **Shared Libs**: Utilities and configurations in `src/lib/`.
- **Database Adapter**: Specifically uses `@prisma/adapter-mariadb` in `src/lib/prisma.ts`.


## ข้อกำหนดหลัก
- แยก TypeScript Type ทุกอย่าง ออกไปที่โฟลเดอร์ src/types
- การตั้งชื่อไฟล์ Typescript (.ts) ให้ตั้งตามตัวอย่างนี้ คือ course-service.ts
- ห้ามใช้คำสั่ง npx prisma db push