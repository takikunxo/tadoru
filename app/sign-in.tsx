import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { isSignedIn } = useAuth();
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleOAuth } = useOAuth({ strategy: "oauth_apple" });
  const router = useRouter();

  React.useEffect(() => {
    if (isSignedIn) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [isSignedIn]);

  const onGoogleSignInPress = React.useCallback(async () => {
    try {
      console.log("Starting Google OAuth flow...");
      const { createdSessionId, setActive, signIn, signUp } = await startGoogleOAuth();

      console.log("Google OAuth flow result:", { createdSessionId, signIn, signUp });

      if (createdSessionId) {
        console.log("Setting active session:", createdSessionId);
        setActive!({ session: createdSessionId });
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      } else {
        console.log("No session created - likely cancelled by user");
        // セッションが作成されない場合は通常キャンセルなので何もしない
        return;
      }
    } catch (err: any) {
      console.log("Google OAuth error details:", err);
      console.log("Error message:", err.message);
      console.log("Error code:", err.code);
      
      // キャンセルの場合は何も表示しない
      if (err.message?.includes("cancelled") || 
          err.message?.includes("canceled") || 
          err.code === "user_cancelled" ||
          err.code === "cancelled" ||
          err.code === "canceled") {
        return;
      }
      
      let errorMessage = "Googleサインインに失敗しました。";
      
      if (err.message?.includes("OAuth")) {
        errorMessage += "\n\nOAuth設定に問題がある可能性があります。";
      } else if (err.message?.includes("network")) {
        errorMessage += "\n\nネットワーク接続を確認してください。";
      }
      
      Alert.alert("サインインエラー", errorMessage + "\n\nもう一度お試しください。");
    }
  }, [startGoogleOAuth, router]);

  const onAppleSignInPress = React.useCallback(async () => {
    try {
      console.log("Starting Apple OAuth flow...");
      const { createdSessionId, setActive, signIn, signUp } = await startAppleOAuth();

      console.log("Apple OAuth flow result:", { createdSessionId, signIn, signUp });

      if (createdSessionId) {
        console.log("Setting active session:", createdSessionId);
        setActive!({ session: createdSessionId });
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      } else {
        console.log("No session created - likely cancelled by user");
        // セッションが作成されない場合は通常キャンセルなので何もしない
        return;
      }
    } catch (err: any) {
      console.log("Apple OAuth error details:", err);
      console.log("Error message:", err.message);
      console.log("Error code:", err.code);
      console.log("Error errors:", err.errors);
      
      // キャンセルの場合は何も表示しない
      if (err.message?.includes("cancelled") || 
          err.message?.includes("canceled") || 
          err.code === "user_cancelled" ||
          err.code === "cancelled" ||
          err.code === "canceled") {
        return;
      }
      
      let errorMessage = "Appleサインインに失敗しました。";
      
      if (err.message?.includes("OAuth")) {
        errorMessage += "\n\nOAuth設定に問題がある可能性があります。";
      } else if (err.message?.includes("network")) {
        errorMessage += "\n\nネットワーク接続を確認してください。";
      }
      
      Alert.alert("サインインエラー", errorMessage + "\n\nもう一度お試しください。");
    }
  }, [startAppleOAuth, router]);

  return (
    <ImageBackground
      source={require("@/assets/images/background.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>tadoru へようこそ</Text>
          <Text style={styles.subtitle}>
            アプリを始めるには、まずサインインしてください
          </Text>

          <Pressable style={styles.appleButton} onPress={onAppleSignInPress}>
            <View style={styles.buttonContent}>
              <Ionicons name="logo-apple" size={20} color="#fff" />
              <Text style={styles.appleButtonText}>Appleでサインイン</Text>
            </View>
          </Pressable>

          <Pressable style={styles.googleButton} onPress={onGoogleSignInPress}>
            <View style={styles.buttonContent}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.googleButtonText}>Googleでサインイン</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#fff",
    lineHeight: 24,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  appleButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 50,
    minWidth: 240,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  googleButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 50,
    minWidth: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  appleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});
