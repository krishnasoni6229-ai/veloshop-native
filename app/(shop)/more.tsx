import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useStore, useTheme, useFeatures } from '../../src/context/StoreContext';
import { Button } from '../../src/components/Button';
import { AccountTabIcon } from '../../src/components/TabIcons';

export default function AccountScreen() {
  const { storeName, tagline, activeMerchantId, switchStore, availableStores } = useStore();
  const theme = useTheme();
  const features = useFeatures();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardColor }]}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>ACCOUNT</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardColor, borderRadius: theme.borderRadius }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primaryColor }]}>
            <AccountTabIcon color={theme.secondaryColor} focused={true} size={28} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.textColor }]}>
              {activeMerchantId === 'gymshark' ? 'Gymshark Athlete' : `${storeName} Pro Rider`}
            </Text>
            <Text style={styles.profileEmail}>athlete@{activeMerchantId}.com</Text>
            <Text style={[styles.profileTagline, { color: theme.primaryColor }]}>{tagline}</Text>
          </View>
        </View>

        {/* Loyalty Perk Banner if feature enabled */}
        {features.loyalty && (
          <View style={[styles.loyaltyCard, { borderRadius: theme.borderRadius }]}>
            <Text style={styles.loyaltyTitle}>⭐ {storeName} Rewards Member</Text>
            <Text style={styles.loyaltySubtitle}>You have 450 points available for checkout discounts.</Text>
          </View>
        )}

        {/* Store Switcher (White-Label Platform Feature) */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardColor, borderRadius: theme.borderRadius }]}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>ACTIVE STORE ENVIRONMENT</Text>
          <Text style={styles.sectionSubtitle}>
            Switch merchant profiles dynamically to preview theme tokens and catalogs with instant 60fps transitions:
          </Text>

          <View style={styles.storeCardsColumn}>
            {availableStores.map(store => {
              const isActive = store.id === activeMerchantId;
              const isVeloStore = store.id === 'veloshop';
              return (
                <TouchableOpacity
                  key={store.id}
                  activeOpacity={0.8}
                  onPress={() => switchStore(store.id)}
                  style={[
                    styles.storeCard,
                    {
                      borderColor: isActive ? theme.primaryColor : '#E5E7EB',
                      borderWidth: isActive ? 2 : 1,
                      backgroundColor: isActive ? (isVeloStore ? '#F0F4FF' : '#F9FAFB') : '#FFFFFF',
                      borderRadius: theme.borderRadius,
                    },
                  ]}
                >
                  <View style={styles.storeCardLeft}>
                    <Text style={styles.storeIcon}>{isVeloStore ? '🚴' : '⚡'}</Text>
                    <View style={styles.storeTextWrapper}>
                      <Text style={[styles.storeCardName, { color: theme.textColor }]}>
                        {store.name}
                      </Text>
                      <Text style={styles.storeCardDesc}>
                        {isVeloStore ? 'Speed Blue & Orange · Pro Cycling' : 'Monochrome Athletic · Be a visionary'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.activeBadge,
                      {
                        backgroundColor: isActive ? theme.primaryColor : '#F3F4F6',
                        borderRadius: theme.borderRadius / 2 || 4,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.activeBadgeText,
                        { color: isActive ? theme.secondaryColor : '#6B7280' },
                      ]}
                    >
                      {isActive ? '✓ ACTIVE' : 'SWITCH →'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Account Menu Items */}
        <View style={[styles.sectionCard, { backgroundColor: theme.cardColor, borderRadius: theme.borderRadius }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/(shop)/wishlist')}
          >
            <Text style={[styles.menuItemText, { color: theme.textColor }]}>My Wishlist</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Orders', 'No previous orders found for this test account.')}
          >
            <Text style={[styles.menuItemText, { color: theme.textColor }]}>Order History & Tracking</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Delivery Addresses', 'Default address: 123 Athletic Way, Birmingham, UK.')}
          >
            <Text style={[styles.menuItemText, { color: theme.textColor }]}>Delivery Addresses</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Shopify Integration', 'Storefront API v2025-01 is configured and active.')}
          >
            <Text style={[styles.menuItemText, { color: theme.textColor }]}>Shopify GraphQL Sync</Text>
            <Text style={[styles.statusBadge, { color: '#059669' }]}>v2025-01 Active</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          variant="outline"
          onPress={() => Alert.alert('Sign Out', 'You have been signed out.')}
          style={styles.signOutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#111111',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  profileTagline: {
    fontSize: 12,
    fontWeight: '600',
  },
  loyaltyCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    marginBottom: 16,
  },
  loyaltyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  loyaltySubtitle: {
    fontSize: 12,
    color: '#3B82F6',
  },
  sectionCard: {
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
    lineHeight: 18,
  },
  storeCardsColumn: {
    gap: 10,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  storeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  storeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  storeTextWrapper: {
    flex: 1,
  },
  storeCardName: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  storeCardDesc: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  activeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  menuChevron: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  signOutBtn: {
    marginTop: 8,
  },
});
