---
name: project-onboarding
description: Use when new developer asks about setup project, how to get start project, andwhat tech stack is used. Triggers on "Project นี้ตั้งค่าอย่างไร", "จะเริ่มต้นกับ Project นี้ยังไงดี" or any orentation question from someone unfamiliar with with the codebase.
compatibility: Use Node.js 22+
license: MIT
metadata: 
  authors: Natthakarn Chaiyotmanon
  version: "1.0"
---

## First-Times Setup

```bash
# 1. Install Deps
npm install

# 2. Copy env
cp .env.example .env

# 3. Pull DB Schema (Prisma ORM)
npx prisma db pull

# 4. Generate Prisma Client
npx prisma generate

# 5. Check lint
npm run lint
---

## Gotchas

- ต้องติดตั้ง และปิด Docker Desktop ไว่
- ให้อธิบายการรันโปรเจค และให้ใช้คำสั่ง npm run dev

## Output

- ถ้าถามการ Setup ให้ตอบในรูปแบบของตาราง และอ่านง่าย
