import { z } from "zod/mini";

const envSchema = z.object({
  NODE_ENV: z._default(
    z.enum(["development", "test", "production"]),
    "development",
  ),
  API_BASE_URL: z._default(z.string(), "https://coopledger-api.onrender.com"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables");
  console.error(_env.error.issues.map((issue) => issue.message).join("\n"));
}

export const env = _env.data;
