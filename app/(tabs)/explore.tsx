import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, Pressable, Alert, Switch } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [annotationsEnabled, setAnnotationsEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const voice = await AsyncStorage.getItem('voiceEnabled');
      const annotations = await AsyncStorage.getItem('annotationsEnabled');
      
      if (voice !== null) {
        setVoiceEnabled(JSON.parse(voice));
      }
      if (annotations !== null) {
        setAnnotationsEnabled(JSON.parse(annotations));
      }
    } catch (error) {
      console.error('設定の読み込みエラー:', error);
    }
  };

  const saveVoiceSetting = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('voiceEnabled', JSON.stringify(value));
      setVoiceEnabled(value);
    } catch (error) {
      console.error('音声設定の保存エラー:', error);
    }
  };

  const saveAnnotationsSetting = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('annotationsEnabled', JSON.stringify(value));
      setAnnotationsEnabled(value);
    } catch (error) {
      console.error('注釈設定の保存エラー:', error);
    }
  };


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
        <ThemedText type="subtitle">カメラ設定</ThemedText>
        
        <ThemedView style={styles.settingItem}>
          <ThemedView style={styles.settingText}>
            <ThemedText style={styles.settingTitle}>音声ガイド</ThemedText>
            <ThemedText style={styles.settingDescription}>カウントダウンと撮影案内の音声</ThemedText>
          </ThemedView>
          <Switch
            value={voiceEnabled}
            onValueChange={saveVoiceSetting}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={voiceEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </ThemedView>

        <ThemedView style={styles.settingItem}>
          <ThemedView style={styles.settingText}>
            <ThemedText style={styles.settingTitle}>撮影ガイド</ThemedText>
            <ThemedText style={styles.settingDescription}>画面上の撮影ガイドと注釈</ThemedText>
          </ThemedView>
          <Switch
            value={annotationsEnabled}
            onValueChange={saveAnnotationsSetting}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={annotationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          />
        </ThemedView>

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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    marginTop: 8,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
});
