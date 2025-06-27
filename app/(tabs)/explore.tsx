import React from 'react';
import { Platform, StyleSheet, Pressable, Alert } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/sign-in');
            } catch (error) {
              console.error('ログアウトエラー:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="gear"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">設定</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">アカウント情報</ThemedText>
        <ThemedView style={styles.userInfo}>
          <ThemedText>ユーザー名: {user?.firstName || user?.emailAddresses[0]?.emailAddress || '未設定'}</ThemedText>
          <ThemedText>メール: {user?.emailAddresses[0]?.emailAddress || '未設定'}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <Pressable style={styles.logoutButton} onPress={handleSignOut}>
          <IconSymbol name="arrow.left.square" size={20} color="#fff" />
          <ThemedText style={styles.logoutText}>ログアウト</ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    marginVertical: 16,
  },
  userInfo: {
    marginTop: 8,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
