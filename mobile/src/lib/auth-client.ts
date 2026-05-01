import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseUrl: process.env.API_BASE_URL as string
});
