import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "@better-auth/utils/password";
import { randomUUID } from "node:crypto";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "admin@example.com";
  const password = "admin1234";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists, updating account...`);

    // Clean up any old "credential" provider accounts
    await prisma.account.deleteMany({
      where: { userId: existing.id, providerId: "credential" },
    });

    const existingAccount = await prisma.account.findFirst({
      where: { userId: existing.id, providerId: "email" },
    });

    if (existingAccount) {
      const hashed = await hashPassword(password);
      await prisma.account.update({
        where: { id: existingAccount.id },
        data: { password: hashed },
      });
    } else {
      const hashed = await hashPassword(password);
      await prisma.account.create({
        data: {
          id: randomUUID(),
          accountId: existing.id,
          providerId: "email",
          userId: existing.id,
          password: hashed,
        },
      });
    }

    console.log(`Admin user updated: ${email} / ${password}`);
    return;
  }

  const userId = randomUUID();
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
      id: randomUUID(),
      accountId: userId,
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
