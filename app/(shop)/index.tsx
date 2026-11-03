import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeroBanner } from '../../src/components/HeroBanner';
import { ProductCarouselSection } from '../../src/components/ProductCarouselSection';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { ErrorView } from '../../src/components/ErrorView';
import { useStore, useTheme } from '../../src/context/StoreContext';
import { fetchProducts } from '../../src/api/shopifyClient';
import {
  SAMPLE_PRODUCTS,
  VELOSHOP_PRODUCTS,
  RECOMMENDED_PRODUCTS,
  RECENTLY_VIEWED_PRODUCTS,
} from '../../src/api/sampleData';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Exact same height for both hero banners (matching screenshot: ~58% of viewport)
const HERO_BANNER_HEIGHT = Math.round(SCREEN_HEIGHT * 0.58);

// High-resolution Unsplash athletic fitness photography
const VENGEANCE_HERO_IMAGE =
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80';
const POWER_HERO_IMAGE =
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80';

// Clean text-free fitness photo fallbacks (bundled locally so they show instantly)
const VENGEANCE_FALLBACK = require('../../assets/welcome-bg.jpg');
const POWER_FALLBACK = require('../../assets/hero-power-lifting.jpg');

export default function HomeScreen() {
  const config = useStore();
  const theme = useTheme();

  // Filter SoftSense products for Gymshark, or top products for Veloshop
  const isVelo = config.merchantId === 'veloshop';
  const defaultCatalog = isVelo ? VELOSHOP_PRODUCTS : SAMPLE_PRODUCTS;

  const {
    data: products = defaultCatalog,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', config.merchantId],
    queryFn: () => fetchProducts(config),
    initialData: () => defaultCatalog,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading && (!products || products.length === 0)) return <LoadingSpinner fullScreen />;
  if (isError && (!products || products.length === 0)) return <ErrorView message="Could not load products." onRetry={refetch} />;

  const banner1Title = isVelo ? 'AERO PERFORMANCE' : 'VENGEANCE';
  const banner1Sub = isVelo
    ? 'Wind tunnel tested. Micro-drag fabrics for race-winning speed.'
    : 'Heavy cotton. Physique-maximising fits. Imposing presence.';
  const banner1Img = isVelo
    ? 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1200&q=80'
    : VENGEANCE_HERO_IMAGE;
  const banner1Handle = isVelo ? 'aero' : 'vengeance';

  const banner2Title = isVelo ? 'ENDURANCE & GRAVEL' : 'POWER & LIFTING';
  const banner2Sub = isVelo
    ? 'Built for 200km+ epics across all road and gravel surfaces.'
    : 'Engineered for maximum output. Heavy duty performance.';
  const banner2Img = isVelo
    ? 'https://images.unsplash.com/photo-1502744688674-c619d3864003?w=1200&q=80'
    : POWER_HERO_IMAGE;
  const banner2Handle = isVelo ? 'endurance' : 'power';

  const carousel1Title = isVelo ? 'FEATURED RELEASES' : 'SOFTSENSE™';
  const carousel1Products = isVelo
    ? (products || [])
    : products?.filter(p => p.collectionHandle === 'softsense') || [];

  // Recommended products
  const recommendedProducts =
    products && products.length >= 4
      ? products.slice(0, 5)
      : RECOMMENDED_PRODUCTS;

  // Recently viewed
  const recentlyViewedProducts =
    products && products.length >= 4
      ? products.slice(1, 5)
      : RECENTLY_VIEWED_PRODUCTS;

  const carouselCardWidth = Math.min(SCREEN_WIDTH * 0.72, 290);

  const navigateToCollection = (handle: string) => {
    router.push({
      pathname: '/(shop)/collection/[handle]',
      params: { handle },
    });
  };

  const navigateToProduct = (handle: string) => {
    router.push({
      pathname: '/(shop)/product/[handle]',
      params: { handle },
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* 1. TOP HEADER */}
      <View style={[styles.topHeader, { backgroundColor: theme.cardColor }]}>
        <View style={styles.headerTextGroup}>
          <Text style={[styles.headerLoginText, { color: theme.textColor }]}>
            Log in or create an account
          </Text>
          <Text style={styles.headerLoyaltyText}>
            {isVelo ? 'Sign Up to Veloshop Club' : 'Sign Up to Gymshark Loyalty'}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. HERO BANNER 1 */}
        <HeroBanner
          title={banner1Title}
          subtitle={banner1Sub}
          buttonText="Shop now"
          imageUrl={banner1Img}
          fallbackImage={VENGEANCE_FALLBACK}
          height={HERO_BANNER_HEIGHT}
          onPress={() => navigateToCollection(banner1Handle)}
        />

        {/* 3. HERO BANNER 2 */}
        <View style={styles.heroBannerGap}>
          <HeroBanner
            title={banner2Title}
            subtitle={banner2Sub}
            buttonText="Shop now"
            imageUrl={banner2Img}
            fallbackImage={POWER_FALLBACK}
            height={HERO_BANNER_HEIGHT}
            onPress={() => navigateToCollection(banner2Handle)}
          />
        </View>

        {/* 4. PRIMARY HORIZONTAL CAROUSEL */}
        <ProductCarouselSection
          title={carousel1Title}
          products={carousel1Products}
          cardWidth={carouselCardWidth}
          onProductPress={p => navigateToProduct(p.handle)}
          onViewAllPress={() => navigateToCollection(banner1Handle)}
        />

        {/* 5. RECOMMENDED FOR YOU HORIZONTAL CAROUSEL */}
        <ProductCarouselSection
          title="RECOMMENDED FOR YOU"
          products={recommendedProducts}
          cardWidth={carouselCardWidth}
          showViewAll={true}
          onProductPress={p => navigateToProduct(p.handle)}
        />

        {/* 6. RECENTLY VIEWED HORIZONTAL CAROUSEL */}
        <ProductCarouselSection
          title="RECENTLY VIEWED"
          products={recentlyViewedProducts}
          cardWidth={carouselCardWidth}
          showViewAll={true}
          onProductPress={p => navigateToProduct(p.handle)}
        />

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Top Header (Clean, without green button)
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    backgroundColor: '#FFFFFF',
  },
  headerTextGroup: {
    flex: 1,
  },
  headerLoginText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: -0.2,
  },
  headerLoyaltyText: {
    fontSize: 13,
    color: '#767676',
    marginTop: 2,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  // Gap between the two hero banners
  heroBannerGap: {
    marginTop: 4,
  },
});
