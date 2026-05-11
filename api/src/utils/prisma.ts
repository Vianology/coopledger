import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "@/config/env";
import { PrismaClient } from "@/db/client";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: env.DATABASE_URL }),
});

export { prisma };
