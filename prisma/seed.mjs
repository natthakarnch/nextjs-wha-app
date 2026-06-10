import { PrismaClient } from "../generated/prisma/client/index.js";
import { hashPassword } from "@better-auth/utils/dist/password.node.mjs";
import { randomUUID } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const password = "admin1234";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists`);
    return;
  }

  const userId = randomUUID();
  const accountId = randomUUID();
  const hashed = await hashPassword(password);

  await prisma.user.create({
    data: {
      id: userId,
      name: "Admin",
      email,
      emailVerified: true,
      role: "admin",
    },
  });

  await prisma.account.create({
    data: {
      id: accountId,
      accountId: email,
      providerId: "email",
      userId,
      password: hashed,
    },
  });

  console.log(`Admin user created: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
