import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { authClient } from "@/utils/auth-client";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);
  const [loaded, error] = useFonts({
    "GoogleSansText-Regular": require("@/assets/fonts/GoogleSansText-Regular.ttf"),
    "GoogleSansText-Medium": require("@/assets/fonts/GoogleSansText-Medium.ttf"),
    "GoogleSansText-Bold": require("@/assets/fonts/GoogleSansText-Bold.ttf"),
    "GoogleSansText-Italic": require("@/assets/fonts/GoogleSansText-Italic.ttf"),
    "GoogleSansText-BoldItalic": require("@/assets/fonts/GoogleSansText-BoldItalic.ttf"),
    "GoogleSansText-MediumItalic": require("@/assets/fonts/GoogleSansText-MediumItalic.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (!loaded || error) return;

    const checkAuth = async () => {
      const session = await authClient.getSession();
      const user = session.data;

      const inAuthGroup = segments[0] === "(tabs)";

      if (!user) {
        if (inAuthGroup) {
          router.replace("/login");
        }
      } else {
        // if (!user.isWhatsappVerified) {
        //   router.replace("/verify-whatsapp");
        // } else
        if (!inAuthGroup) {
          router.replace("/(tabs)");
        }
      }
      setIsReady(true);
    };

    checkAuth();
  }, [loaded, error, segments]);

  if (!loaded && !error) {
    return null;
  }

  if (!isReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
