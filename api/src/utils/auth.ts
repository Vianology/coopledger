import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/config/env";
import { prisma } from "./prisma";

export const auth = betterAuth({
  appName: "CoopLedger",
  plugins: [expo()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
    transaction: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      scope: ["profile", "email"],
    },
  },
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        input: true,
        required: true,
      },
      role: {
        type: "string",
        input: true,
        required: true,
      },
    },
  },
  trustedOrigins: ["coopledger://"],
});
