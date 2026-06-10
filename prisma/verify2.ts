import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword, verifyPassword } from "@better-auth/utils/password";

async function main() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({ adapter });

  const account = await prisma.account.findFirst({
    where: { providerId: "email" },
  });

  if (!account) {
    console.log("No email account found");
    return;
  }

  console.log("Stored password hash:", account.password);
  console.log("Password hash length:", account.password?.length);

  // Verify the password works
  const isValid = await verifyPassword(account.password!, "admin1234");
  console.log("Password verification result:", isValid);

  // Check if re-hashing produces same format
  const newHash = await hashPassword("admin1234");
  console.log("New hash:", newHash);
  console.log("New hash format matches:", newHash.includes(":"));
  console.log("Hash parts:", newHash.split(":")[0].length, newHash.split(":")[1].length);

  await prisma.$disconnect();
}

main().catch(console.error);
