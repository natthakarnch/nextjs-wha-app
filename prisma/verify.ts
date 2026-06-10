import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany();
  console.log("Users:", JSON.stringify(users, null, 2));

  const accounts = await prisma.account.findMany({
    select: { id: true, accountId: true, providerId: true, userId: true },
  });
  console.log("Accounts:", JSON.stringify(accounts, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
