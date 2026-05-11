import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/db/client";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

export { prisma };
