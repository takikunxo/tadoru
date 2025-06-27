import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import Constants from "expo-constants";

import { useColorScheme } from "@/hooks/useColorScheme";

const publishableKey = Constants.expoConfig?.extra?.clerkPublishableKey;

if (!publishableKey) {
  throw new Error("Missing Publishable Key. Please set clerkPublishableKey in app.json extra field");
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ClerkLoaded>
        <ThemeProvider value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}>
          <Slot />
          <StatusBar style="auto" />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
