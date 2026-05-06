import { z } from "zod/mini";

const envSchema = z.object({
  NODE_ENV: z._default(
    z.enum(["development", "test", "production"]),
    "development",
  ),
  PORT: z._default(z.transform(Number), 3000),
  API_BASE_URL: z.string(),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  ENCRYPTION_KEY: z.string().check(z.minLength(12), z.maxLength(64), z.trim()),
  POLYGON_RPC_URL: z.url(),
  GOWA_API_URL: z.url(),
  GOWA_API_BASIC_AUTH: z.string(),
  GOWA_API_DEVICE_ID: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  SYSTEM_PRIVATE_KEY: z.string(),
  FEDAPAY_SECRET_KEY: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables");
  console.error(_env.error.issues.map((issue) => issue.message).join("\n"));
  process.exit(1);
}

export const env = _env.data;
