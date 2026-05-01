import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  if (!loaded && !error) {
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
