import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/StoreContext';
import { useCartStore, cartItemCount } from '../../src/store/cartStore';
import {
  HomeTabIcon,
  CartTabIcon as SvgCartTabIcon,
  WishlistTabIcon,
  AccountTabIcon,
  ShopSearchTabIcon,
} from '../../src/components/TabIcons';

function CartTabWithBadge({ color, focused }: { color: any; focused: boolean }) {
  const theme = useTheme();
  const cart = useCartStore((s: any) => s.cart);
  const count = cartItemCount(cart);

  return (
    <View style={styles.iconWrap}>
      <SvgCartTabIcon color={color} focused={focused} size={25} />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.primaryColor || '#000000' }]}>
          <Text style={[styles.badgeText, { color: theme.secondaryColor || '#FFFFFF' }]}>
            {count > 9 ? '9+' : count}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function ShopLayout() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  // Bottom inset clearance to prevent bottom tabs from touching the bottom on Android
  // On Android with 3-button navigation, insets.bottom is typically 32-48dp.
  // On iOS, insets.bottom is typically 34dp (with home indicator) or 0dp (SE).
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 14);
  const tabHeight = (Platform.OS === 'ios' ? 56 : 58) + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primaryColor || '#000000',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          marginTop: -2,
          marginBottom: Platform.OS === 'android' ? 4 : 0,
        },
        tabBarStyle: {
          backgroundColor: theme.cardColor || '#FFFFFF',
          borderTopColor: '#EBEBEB',
          borderTopWidth: 1,
          height: tabHeight,
          paddingTop: 8,
          paddingBottom: bottomInset,
          elevation: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        },
      }}
    >
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <HomeTabIcon color={color} focused={focused} size={24} />
          ),
        }}
      />

      {/* 2. Browse / Shop */}
      <Tabs.Screen
        name="browse"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <ShopSearchTabIcon color={color} focused={focused} size={24} />
          ),
        }}
      />

      {/* 3. Shopping Bag */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Bag',
          tabBarIcon: ({ color, focused }) => (
            <CartTabWithBadge color={color} focused={focused} />
          ),
        }}
      />

      {/* 4. Wishlist */}
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, focused }) => (
            <WishlistTabIcon color={color} focused={focused} size={24} />
          ),
        }}
      />

      {/* 5. Account */}
      <Tabs.Screen
        name="more"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <AccountTabIcon color={color} focused={focused} size={24} />
          ),
        }}
      />

      {/* Product Detail - hidden from tab bar */}
      <Tabs.Screen
        name="product/[handle]"
        options={{
          href: null,
        }}
      />

      {/* Collection Detail - hidden from tab bar */}
      <Tabs.Screen
        name="collection/[handle]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#000000',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
