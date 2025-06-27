import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSignIn, useAuth, useOAuth } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { isSignedIn } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();

  React.useEffect(() => {
    if (isSignedIn) {
      router.replace('/(tabs)');
    }
  }, [isSignedIn]);

  const onSignInPress = React.useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.log('OAuth error', err);
    }
  }, [startOAuthFlow, router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tadoru へようこそ</Text>
        <Text style={styles.subtitle}>
          ポーズドローイングを始めるには、まずサインインしてください
        </Text>
        
        <Pressable style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Googleでサインイン</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});