import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const connectionString =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// @ts-ignore
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding Admin User...");

  const adminPhone = "08012345678";

  const existingAdmin = await prisma.user.findUnique({
    where: { phoneNumber: adminPhone },
  });

  if (existingAdmin) {
    console.log(`Admin with phone ${adminPhone} already exists!`);
    return;
  }

  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash("admin", 10);

  const admin = await prisma.user.create({
    data: {
      phoneNumber: adminPhone,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user created successfully!`);
  console.log(`   Phone Number: ${admin.phoneNumber}`);
  console.log(`   Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
