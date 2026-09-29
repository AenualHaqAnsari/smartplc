import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const email = "admin@medievalarmors.com";

  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is required."
    );
  }

  if (password.length < 8) {
    throw new Error(
      "Admin password must be at least 8 characters."
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    12
  );

  const admin = await prisma.adminUser.upsert({
    where: {
      email,
    },

    update: {
      passwordHash,
    },

    create: {
      email,
      passwordHash,
      name: "Store Administrator",
    },
  });

  console.log(
    `Admin account ready: ${admin.email}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });