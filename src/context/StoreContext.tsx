import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Platform,
  UIManager,
  LayoutAnimation,
  Animated,
  Text,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { StoreConfig, BrandingConfig, FeatureFlags } from '../config/types';
import { gymsharkConfig } from '../config/gymshark';
import { veloshopConfig } from '../config/veloshop';
import { storeConfig as defaultStoreConfig } from '../config';

// Enable native LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ACTIVE_MERCHANT_KEY = '@veloshop_active_merchant_v1';

const storeConfigs: Record<string, StoreConfig> = {
  gymshark: gymsharkConfig,
  veloshop: veloshopConfig,
};

export interface StoreContextValue extends StoreConfig {
  activeMerchantId: 'gymshark' | 'veloshop';
  switchStore: (merchantId: 'gymshark' | 'veloshop') => Promise<void>;
  availableStores: { id: 'gymshark' | 'veloshop'; name: string; tagline: string }[];
}

const StoreContext = createContext<StoreContextValue>({
  ...defaultStoreConfig,
  activeMerchantId: (defaultStoreConfig.merchantId as 'gymshark' | 'veloshop') || 'gymshark',
  switchStore: async () => {},
  availableStores: [
    { id: 'gymshark', name: 'Gymshark', tagline: 'Be a visionary.' },
    { id: 'veloshop', name: 'Veloshop', tagline: 'Ride faster. Look better.' },
  ],
});

export function StoreProvider({
  children,
  config = defaultStoreConfig,
}: {
  children: React.ReactNode;
  config?: StoreConfig;
}) {
  const [activeMerchantId, setActiveMerchantId] = useState<'gymshark' | 'veloshop'>(
    (config.merchantId as 'gymshark' | 'veloshop') || 'gymshark'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastAnim] = useState(() => new Animated.Value(0));

  // Pre-warm hero images for instant display on store change
  useEffect(() => {
    Image.prefetch([
      'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1200&q=80',
      'https://images.unsplash.com/photo-1502744688674-c619d3864003?w=1200&q=80',
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80',
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80',
    ]);
  }, []);

  // Restore merchant preference from local storage if saved
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(ACTIVE_MERCHANT_KEY);
        if (saved && (saved === 'gymshark' || saved === 'veloshop')) {
          setActiveMerchantId(saved);
        }
      } catch {
        // use default
      }
    })();
  }, []);

  const switchStore = useCallback(async (merchantId: 'gymshark' | 'veloshop') => {
    if (merchantId === activeMerchantId) return;

    // Trigger butter-smooth native layout animation
    LayoutAnimation.configureNext({
      duration: 320,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });

    setActiveMerchantId(merchantId);

    // Show smooth floating confirmation pill
    const targetStore = storeConfigs[merchantId];
    setToastMessage(`Switched to ${targetStore.storeName}`);
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.spring(toastAnim, {
        toValue: 1,
        tension: 90,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.delay(1800),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastMessage(null);
    });

    try {
      await AsyncStorage.setItem(ACTIVE_MERCHANT_KEY, merchantId);
    } catch {
      // ignore
    }
  }, [activeMerchantId, toastAnim]);

  const currentConfig: StoreConfig = storeConfigs[activeMerchantId] || config;

  const value: StoreContextValue = {
    ...currentConfig,
    activeMerchantId,
    switchStore,
    availableStores: [
      { id: 'gymshark', name: 'Gymshark', tagline: 'Be a visionary.' },
      { id: 'veloshop', name: 'Veloshop', tagline: 'Ride faster. Look better.' },
    ],
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toastMessage && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.floatingToast,
            {
              backgroundColor: currentConfig.branding.primaryColor,
              borderRadius: currentConfig.branding.borderRadius * 3 || 24,
              opacity: toastAnim,
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
                {
                  scale: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.92, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.floatingToastText, { color: currentConfig.branding.secondaryColor }]}>
            ✦ {toastMessage}
          </Text>
        </Animated.View>
      )}
    </StoreContext.Provider>
  );
}

const styles = StyleSheet.create({
  floatingToast: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 38,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 12,
    zIndex: 999999,
  },
  floatingToastText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export function useStore(): StoreContextValue {
  return useContext(StoreContext);
}

export function useTheme(): BrandingConfig {
  const context = useContext(StoreContext);
  return context.branding;
}

export function useFeatures(): FeatureFlags {
  const context = useContext(StoreContext);
  return context.features;
}
