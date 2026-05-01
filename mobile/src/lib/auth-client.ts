import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
    baseURL: process.env.API_BASE_URL as string,
    plugins: [
        expoClient({
            scheme: "mobile",
            storagePrefix: "coopledger",
            storage: SecureStore,
        })
    ]
});
