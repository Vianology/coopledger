import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseUrl: process.env.API_BASE_URL as string,
  storage: {
    getItem: async (key) => {
      return await SecureStore.getItemAsync(key);
    },
    setItem: async (key, value) => {
      await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key) => {
      await SecureStore.deleteItemAsync(key);
    },
  },
});
