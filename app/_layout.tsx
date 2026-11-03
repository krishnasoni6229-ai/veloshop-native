import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '../src/context/StoreContext';
import { storeConfig } from '../src/config';
import { useCartStore } from '../src/store/cartStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 2, // 2 min
    },
  },
});

function CartHydrator() {
  const hydrateCart = useCartStore(s => s.hydrateCart);
  useEffect(() => {
    hydrateCart();
  }, [hydrateCart]);
  return null;
}

export default function RootLayout() {
  const theme = storeConfig.branding;
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
      SplashScreen.hideAsync();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!splashDone) {
    return (
      <View style={splashStyles.container}>
        <StatusBar style="light" />
        <Image
          source={require('../assets/logo.png')}
          style={splashStyles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StoreProvider config={storeConfig}>
            <CartHydrator />
            <StatusBar style={theme.primaryColor === '#000000' ? 'dark' : 'light'} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(shop)" />
            </Stack>
          </StoreProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SPLASH_LOGO_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.28, 90), 125);

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: SPLASH_LOGO_SIZE,
    height: SPLASH_LOGO_SIZE,
  },
});
