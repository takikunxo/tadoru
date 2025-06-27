import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace("/(tabs)");
      } else {
        router.replace("/sign-in");
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
