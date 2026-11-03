import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/StoreContext';
import { Product } from '../api/types';
import { ProductCard } from './ProductCard';
import { ListingHeader } from './ListingHeader';
import { ListingControlBar, ViewMode } from './ListingControlBar';
import { ReleasesCarousel, ReleaseItem, DEFAULT_RELEASES } from './ReleasesCarousel';
import { ProductCarouselSection } from './ProductCarouselSection';

export interface ProductCatalogViewProps {
  title?: string;
  products: Product[];
  productCount?: number;
  releases?: ReleaseItem[];
  recommendedProducts?: Product[];
  recentlyViewedProducts?: Product[];
  onProductPress: (product: Product) => void;
  onReleasePress?: (release: ReleaseItem) => void;
  onBack?: () => void;
  showHeader?: boolean;
  showBack?: boolean;
  showControlBar?: boolean;
  showReleases?: boolean;
  showFilter?: boolean;
  initialViewMode?: ViewMode;
  headerRightElement?: React.ReactNode;
  onActionPress?: () => void;
  ListEmptyComponent?: React.ReactElement | null;
  ListFooterComponent?: React.ReactElement | null;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function ProductCatalogView({
  title = 'NEW PRODUCT DROPS',
  products,
  productCount,
  releases = DEFAULT_RELEASES,
  recommendedProducts,
  recentlyViewedProducts,
  onProductPress,
  onReleasePress,
  onBack,
  showHeader = true,
  showBack = true,
  showControlBar = true,
  showReleases = true,
  showFilter = true,
  initialViewMode = 'grid',
  headerRightElement,
  onActionPress,
  ListEmptyComponent,
  ListFooterComponent,
  refreshing = false,
  onRefresh,
}: ProductCatalogViewProps) {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const gridListRef = useRef<FlatList<Product>>(null);
  const singleListRef = useRef<FlatList<Product>>(null);
  const scrollYRef = useRef(0);

  // When in 2-column grid view, never show a single orphaned item in the last row
  const gridProducts = React.useMemo(() => {
    if (products.length > 1 && products.length % 2 !== 0) {
      return products.slice(0, products.length - 1);
    }
    return products;
  }, [products]);

  const displayCount = productCount !== undefined ? productCount : products.length;

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollYRef.current = e.nativeEvent.contentOffset.y;
  }, []);

  const handleViewModeChange = useCallback(
    (newMode: ViewMode) => {
      if (newMode === viewMode) return;
      setViewMode(newMode);

      // Seamlessly sync scroll position without any visual glitch
      requestAnimationFrame(() => {
        if (newMode === 'single') {
          singleListRef.current?.scrollToOffset({
            offset: scrollYRef.current,
            animated: false,
          });
        } else {
          gridListRef.current?.scrollToOffset({
            offset: scrollYRef.current,
            animated: false,
          });
        }
      });
    },
    [viewMode]
  );

  const renderGridItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        layout="grid"
        onPress={() => onProductPress(item)}
      />
    ),
    [onProductPress]
  );

  const renderSingleItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        layout="single"
        onPress={() => onProductPress(item)}
      />
    ),
    [onProductPress]
  );

  const keyExtractor = useCallback((item: Product) => item.id, []);

  // Header content that scrolls with products: Count + New Releases
  const renderListHeader = useCallback(() => {
    return (
      <View style={styles.headerSection}>
        {/* Product Count (e.g. 351 products) */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{displayCount} products</Text>
        </View>

        {/* Horizontal New Releases Carousel */}
        {showReleases ? (
          <ReleasesCarousel
            releases={releases}
            onReleasePress={onReleasePress}
          />
        ) : null}
      </View>
    );
  }, [displayCount, showReleases, releases, onReleasePress]);

  const renderListFooter = useCallback(() => {
    const hasFooterContent =
      (recommendedProducts && recommendedProducts.length > 0) ||
      (recentlyViewedProducts && recentlyViewedProducts.length > 0) ||
      ListFooterComponent;

    if (!hasFooterContent) {
      return <View style={styles.footerSpacing} />;
    }

    return (
      <View style={styles.footerSection}>
        {recommendedProducts && recommendedProducts.length > 0 && (
          <ProductCarouselSection
            title="RECOMMENDED FOR YOU"
            products={recommendedProducts}
            showViewAll={true}
            onProductPress={onProductPress}
          />
        )}
        {recentlyViewedProducts && recentlyViewedProducts.length > 0 && (
          <ProductCarouselSection
            title="RECENTLY VIEWED"
            products={recentlyViewedProducts}
            showViewAll={true}
            onProductPress={onProductPress}
          />
        )}
        {ListFooterComponent}
        <View style={styles.footerSpacing} />
      </View>
    );
  }, [recommendedProducts, recentlyViewedProducts, ListFooterComponent, onProductPress]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.cardColor }]} edges={['top']}>
      {/* 1. Top Navigation Header */}
      {showHeader ? (
        <ListingHeader
          title={title}
          onBack={onBack}
          showBack={showBack}
          rightElement={headerRightElement}
          onActionPress={onActionPress}
        />
      ) : null}

      {/* 2. Control Bar (Grid vs Single + Filter) — Fixed under header for instant switching without remounting */}
      {showControlBar ? (
        <ListingControlBar
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          showFilter={showFilter}
        />
      ) : null}

      {/* 3. Dual-Layer Lists: Both remain mounted in GPU memory for instantaneous, 0ms lag-free switching */}
      <View style={styles.listsContainer}>
        {/* 2-Column Grid List */}
        <View
          style={[
            styles.listLayer,
            viewMode === 'grid' ? styles.activeLayer : styles.inactiveLayer,
          ]}
          pointerEvents={viewMode === 'grid' ? 'auto' : 'none'}
        >
          <FlatList
            ref={gridListRef}
            data={gridProducts}
            keyExtractor={keyExtractor}
            numColumns={2}
            ListHeaderComponent={renderListHeader}
            ListFooterComponent={renderListFooter}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContainer, styles.gridContainer]}
            columnWrapperStyle={styles.columnWrapper}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ) : undefined
            }
            renderItem={renderGridItem}
          />
        </View>

        {/* 1-Column Single List */}
        <View
          style={[
            styles.listLayer,
            viewMode === 'single' ? styles.activeLayer : styles.inactiveLayer,
          ]}
          pointerEvents={viewMode === 'single' ? 'auto' : 'none'}
        >
          <FlatList
            ref={singleListRef}
            data={products}
            keyExtractor={keyExtractor}
            numColumns={1}
            ListHeaderComponent={renderListHeader}
            ListFooterComponent={renderListFooter}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContainer, styles.singleContainer]}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'android'}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ) : undefined
            }
            renderItem={renderSingleItem}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listsContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  listLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  activeLayer: {
    opacity: 1,
    zIndex: 1,
  },
  inactiveLayer: {
    opacity: 0,
    zIndex: 0,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 2,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
    letterSpacing: -0.1,
  },
  listContainer: {
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
  },
  gridContainer: {
    paddingHorizontal: 0,
  },
  singleContainer: {
    paddingHorizontal: 0,
  },
  columnWrapper: {
    paddingHorizontal: 11,
    justifyContent: 'space-between',
  },
  footerSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  footerSpacing: {
    height: 48,
  },
});
