import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useWishlistStore } from '../../src/store/wishlistStore';
import { useStore, useTheme } from '../../src/context/StoreContext';
import { ALL_PRODUCTS } from '../../src/api/sampleData';
import { fetchProducts } from '../../src/api/shopifyClient';
import { ProductCard } from '../../src/components/ProductCard';
import { Button } from '../../src/components/Button';
import { EmptyWishlistIcon } from '../../src/components/TabIcons';

export default function WishlistScreen() {
  const config = useStore();
  const theme = useTheme();
  const wishlistIds = useWishlistStore(s => s.wishlistIds);

  const isVelo = config.merchantId === 'veloshop';
  const defaultCatalog = isVelo ? ALL_PRODUCTS.filter(p => p.collectionHandle === 'aero' || p.collectionHandle === 'endurance') : ALL_PRODUCTS;

  const { data: remoteProducts = defaultCatalog } = useQuery({
    queryKey: ['products', config.merchantId],
    queryFn: () => fetchProducts(config),
    initialData: () => defaultCatalog,
    staleTime: 1000 * 60 * 5,
  });

  const allAvailable = React.useMemo(() => {
    const map = new Map();
    ALL_PRODUCTS.forEach(p => map.set(p.id, p));
    if (remoteProducts) {
      remoteProducts.forEach(p => map.set(p.id, p));
    }
    return Array.from(map.values());
  }, [remoteProducts]);

  const wishlistedProducts = allAvailable.filter(p => wishlistIds.includes(p.id));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardColor }]}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>WISHLIST</Text>
        <Text style={styles.headerSubtitle}>
          {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'item' : 'items'} saved
        </Text>
      </View>

      {wishlistedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconContainer,
              {
                backgroundColor: theme.cardColor,
                borderColor: '#EAEAEA',
                borderRadius: theme.borderRadius * 4 || 48,
              },
            ]}
          >
            <EmptyWishlistIcon color={theme.primaryColor} size={50} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.textColor }]}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Save your favorite studio sets and gym gear by tapping the heart icon on any product.
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(shop)')}
            style={styles.exploreBtn}
          />
        </View>
      ) : (
        <FlatList
          data={wishlistedProducts}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              layout="grid"
              onPress={() =>
                router.push({
                  pathname: '/(shop)/product/[handle]',
                  params: { handle: item.handle },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  headerSubtitle: {
    fontSize: 13,
    color: '#767676',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 11,
    paddingTop: 12,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.3,
    color: '#111111',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
  },
  exploreBtn: {
    minWidth: 220,
  },
});
