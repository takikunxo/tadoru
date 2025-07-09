import { useAuth, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function SettingsScreen() {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();




  const handleSignOut = () => {
    Alert.alert("ログアウト", "ログアウトしますか？", [
      {
        text: "キャンセル",
        style: "cancel",
      },
      {
        text: "ログアウト",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/sign-in");
          } catch (error) {
            console.error(error);
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "アカウントを削除",
      "アカウントを削除すると、すべてのデータが完全に削除され、復元できません。本当に削除しますか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            try {
              await user?.delete();
              router.replace("/(tabs)");
            } catch (error) {
              console.error("アカウント削除エラー:", error);
              Alert.alert("エラー", "アカウントの削除に失敗しました。もう一度お試しください。");
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >

          <ThemedView style={styles.settingsCard}>
            <ThemedView style={styles.cardHeader}>
              <IconSymbol name="person.circle" size={24} color="#007AFF" />
              <ThemedText style={styles.cardTitle}>アカウント</ThemedText>
            </ThemedView>

            <ThemedView style={styles.userInfoCard}>
              <ThemedView style={styles.userInfoRow}>
                <ThemedText style={styles.userInfoLabel}>ユーザー名</ThemedText>
                <ThemedText style={styles.userInfoValue}>
                  {isSignedIn ? (
                    user?.firstName && user?.lastName
                      ? `${user.lastName} ${user.firstName}`
                      : user?.firstName ||
                        user?.lastName ||
                        user?.emailAddresses[0]?.emailAddress ||
                        "未設定"
                  ) : (
                    "ゲストアカウント"
                  )}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.userInfoRow}>
                <ThemedText style={styles.userInfoLabel}>
                  メールアドレス
                </ThemedText>
                <ThemedText style={styles.userInfoValue}>
                  {isSignedIn ? (
                    user?.emailAddresses[0]?.emailAddress || "未設定"
                  ) : (
                    "未登録"
                  )}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.logoutCard}>
            <Pressable 
              style={styles.logoutButton} 
              onPress={isSignedIn ? handleSignOut : () => router.push("/sign-in")}
            >
              <ThemedView style={styles.logoutContent}>
                <IconSymbol
                  name={isSignedIn ? "arrow.left.square" : "person.circle"}
                  size={20}
                  color={isSignedIn ? "#FF3B30" : "#007AFF"}
                />
                <ThemedText style={[styles.logoutText, { color: isSignedIn ? "#FF3B30" : "#007AFF" }]}>
                  {isSignedIn ? "ログアウト" : "サインイン"}
                </ThemedText>
              </ThemedView>
              <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
            </Pressable>
          </ThemedView>

          {isSignedIn && (
            <ThemedView style={styles.deleteAccountCard}>
              <Pressable style={styles.deleteAccountButton} onPress={handleDeleteAccount}>
                <ThemedView style={styles.deleteAccountContent}>
                  <IconSymbol
                    name="trash"
                    size={20}
                    color="#FF3B30"
                  />
                  <ThemedText style={styles.deleteAccountText}>アカウントを削除</ThemedText>
                </ThemedView>
                <IconSymbol name="chevron.right" size={16} color="#C7C7CC" />
              </Pressable>
            </ThemedView>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: "column",
    gap: 8,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  settingsCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    minHeight: 60,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingDetails: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingHint: {
    fontSize: 13,
    opacity: 0.7,
  },
  divider: {
    height: 1,
    backgroundColor: "#F2F2F7",
    marginHorizontal: 20,
  },
  userInfoCard: {
    padding: 20,
  },
  userInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  userInfoLabel: {
    fontSize: 17,
    fontWeight: "500",
  },
  userInfoValue: {
    fontSize: 17,
    opacity: 0.7,
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
  logoutCard: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    minHeight: 60,
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 12,
  },
  timerPicker: {
    flexDirection: "row",
    gap: 8,
  },
  timerOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    minWidth: 50,
    alignItems: "center",
  },
  timerOptionActive: {
    backgroundColor: "#007AFF",
  },
  timerOptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    opacity: 0.7,
  },
  timerOptionTextActive: {
    color: "#fff",
    opacity: 1,
  },
  deleteAccountCard: {
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  deleteAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    minHeight: 60,
  },
  deleteAccountContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deleteAccountText: {
    color: "#FF3B30",
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 12,
  },
});
