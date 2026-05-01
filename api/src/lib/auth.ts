import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db } from "@/db/config";
import * as schema from "@/db/schema";

export const auth = betterAuth({
		database: drizzleAdapter(db, { provider: "pg", schema }),
		baseURL: process.env.BETTER_AUTH_URL as string,
		plugins: [expo()],
		emailAndPassword: { enabled: true },
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID as string,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			},
		},
		trustedOrigins: ["mobile://", "exp://*"],
	});
