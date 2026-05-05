import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
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
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      scope: ["profile", "email"],
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string[]",
        input: false,
        required: true,
        defaultValue: ["FARMER"],
      },
      publicKey: {
        type: "string",
        input: false,
        required: false,
        unique: true,
      },
      encryptedPrivateKey: {
        type: "string",
        input: false,
        required: false,
      },
    },
  },
  trustedOrigins: ["coopledger://"],
});
