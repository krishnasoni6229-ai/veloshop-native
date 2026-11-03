import React, { useState, useCallback, useReducer, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';

import { useStore } from '../../../src/context/StoreContext';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { ErrorView } from '../../../src/components/ErrorView';
import { Button } from '../../../src/components/Button';
import { SocialProofBadge } from '../../../src/components/SocialProofBadge';
import { ActionButtonsRow } from '../../../src/components/ActionButtonsRow';
import { ColorSwatchPicker, ColorOption } from '../../../src/components/ColorSwatchPicker';
import { SegmentedPicker } from '../../../src/components/SegmentedPicker';
import { SizePicker } from '../../../src/components/SizePicker';
import { FeatureCard } from '../../../src/components/FeatureCard';
import { CheckoutPerks } from '../../../src/components/CheckoutPerks';
import { ReviewsSection } from '../../../src/components/ReviewsSection';

import { fetchProduct } from '../../../src/api/shopifyClient';
import { useCartStore } from '../../../src/store/cartStore';
import { useWishlistStore } from '../../../src/store/wishlistStore';
import { ProductVariant } from '../../../src/api/types';
import { wp, hp, isTablet as checkIsTablet } from '../../../src/responsive';

type OptionsAction =
  | { type: 'set_option'; name: string; value: string }
  | { type: 'reset'; options: Record<string, string> };

function optionsReducer(
  state: Record<string, string>,
  action: OptionsAction
): Record<string, string> {
  if (action.type === 'set_option') {
    return { ...state, [action.name]: action.value };
  }
  if (action.type === 'reset') {
    return action.options;
  }
  return state;
}

function getSafeImageSource(url: string | any) {
  if (!url) {
    return {
      uri: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80',
    };
  }
  if (typeof url === 'number') return url;
  if (
    typeof url === 'string' &&
    (url.startsWith('http://') || url.startsWith('https://'))
  ) {
    return { uri: url };
  }
  return url;
}

// Available color thumbnails for model swatches
const COLOR_SWATCHES: ColorOption[] = [
  {
    id: 'Soft Brown',
    name: 'Soft Brown',
    image: require('../../../assets/release-softsense.jpg'),
  },
  {
    id: 'Burgundy',
    name: 'Burgundy',
    image: require('../../../assets/taylor-daugherty-h1jFtAgDJbI-unsplash.jpg'),
  },
  {
    id: 'Slate Blue',
    name: 'Slate Blue',
    image: require('../../../assets/release-adapt.jpg'),
  },
  {
    id: 'Black',
    name: 'Black',
    image: require('../../../assets/release-everyday.jpg'),
  },
];

const ALL_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const RISE_OPTIONS = ['Mid', 'High'];

export default function ProductScreen() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const config = useStore();

  const addToCart = useCartStore(s => s.addToCart);
  const cartLoading = useCartStore(s => s.loading);

  const wishlistIds = useWishlistStore(s => s.wishlistIds);
  const toggleWishlist = useWishlistStore(s => s.toggleWishlist);

  const width = wp(100);
  const isTablet = checkIsTablet();
  const imageHeight = Math.min(Math.max(hp(55), 400), 620);

  const [selectedOptions, dispatchOptions] = useReducer(optionsReducer, {
    Size: 'S',
    Colour: 'Soft Brown',
    Rise: 'Mid',
  });

  const [activeImage, setActiveImage] = useState(0);
  const [sizeGuideVisible, setSizeGuideVisible] = useState(false);
  const initialisedForRef = useRef<string | null>(null);

  // Single Add-To-Bag transition animation:
  // dockAnim: 0 = sticky bar at bottom; 1 = docked into in-page position above "Buy now"
  const [isDocked, setIsDocked] = useState(false);
  const isDockedRef = useRef(false);
  const [dockAnim] = useState(() => new Animated.Value(0));
  const scrollViewHeight = useRef(0);
  const detailsLayoutY = useRef(0);
  const inPageButtonY = useRef(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollY = e.nativeEvent.contentOffset.y;
      const viewportH = scrollViewHeight.current || 600;
      const targetY = inPageButtonY.current;

      if (targetY > 0) {
        // Dock when user has scrolled down to the in-page button area
        const shouldDock = scrollY + viewportH - 80 >= targetY;
        if (shouldDock !== isDockedRef.current) {
          isDockedRef.current = shouldDock;
          setIsDocked(shouldDock);
          Animated.spring(dockAnim, {
            toValue: shouldDock ? 1 : 0,
            useNativeDriver: true,
            friction: 7,
            tension: 45,
          }).start();
        }
      }
    },
    [dockAnim]
  );

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', config.merchantId, handle],
    queryFn: () => fetchProduct(config, handle || 'softsense-mid-rise-leggings'),
    enabled: true,
    select: data => {
      if (data && initialisedForRef.current !== data.id) {
        const firstAvailable = data.variants.find(v => v.availableForSale);
        if (firstAvailable) {
          const defaults: Record<string, string> = {
            Size: 'S',
            Colour: 'Soft Brown',
            Rise: 'Mid',
          };
          firstAvailable.selectedOptions.forEach(o => {
            defaults[o.name] = o.value;
          });
          initialisedForRef.current = data.id;
          setTimeout(
            () => dispatchOptions({ type: 'reset', options: defaults }),
            0
          );
        }
      }
      return data;
    },
  });

  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  const selectedVariant: ProductVariant | undefined =
    product?.variants.find(v =>
      v.selectedOptions.every(o => selectedOptions[o.name] === o.value)
    ) || product?.variants[0];

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) return;
    if (!selectedVariant.availableForSale) {
      Alert.alert('Out of Stock', 'This option is currently unavailable.');
      return;
    }
    await addToCart(selectedVariant.id, 1);
    Alert.alert(
      'Added to Bag',
      `${product?.title} (${selectedOptions.Size} / ${selectedOptions.Colour}) has been added to your bag.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Bag', onPress: () => router.push('/(shop)/cart') },
      ]
    );
  }, [selectedVariant, product, addToCart, selectedOptions]);

  const handleBuyNow = useCallback(async () => {
    if (!selectedVariant) return;
    if (!selectedVariant.availableForSale) {
      Alert.alert('Out of Stock', 'This option is currently unavailable.');
      return;
    }
    await addToCart(selectedVariant.id, 1);
    router.push('/(shop)/cart');
  }, [selectedVariant, addToCart]);

  const formatPrice = (amount: string, currency: string) => {
    if (currency === 'USD') {
      const num = parseFloat(amount);
      return `$${num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)} USD`;
    }
    const symbol = currency === 'GBP' ? '£' : currency;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
  };

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !product) {
    return <ErrorView message="Could not load product." onRetry={refetch} />;
  }

  const isUnavailable = selectedVariant ? !selectedVariant.availableForSale : false;
  const currentPrice = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
      );

  // Compute which sizes are out of stock for the selected color/rise
  const unavailableSizes = ALL_SIZES.filter(size => {
    const v = product?.variants.find(
      variant =>
        variant.selectedOptions.some(o => o.name === 'Size' && o.value === size) &&
        (!selectedOptions.Colour || variant.selectedOptions.some(o => o.name === 'Colour' && o.value === selectedOptions.Colour)) &&
        (!selectedOptions.Rise || variant.selectedOptions.some(o => o.name === 'Rise' && o.value === selectedOptions.Rise))
    );
    return v ? !v.availableForSale : true;
  });

  const imagesToDisplay =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: require('../../../assets/release-softsense.jpg'), altText: null }];

  const currentRise = selectedOptions.Rise || 'Mid';
  const waistbandTitle =
    currentRise.toUpperCase() === 'HIGH'
      ? 'SMOOTH, SUPPORTIVE HIGH-RISE WAISTBAND'
      : 'SMOOTH, MINIMAL MID-RISE WAISTBAND';

  // Animation values for in-page button: fades and slides into its position above "Buy now"
  const inPageOpacity = dockAnim.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.4, 1],
  });

  const inPageTranslateY = dockAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const inPageScale = dockAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });

  // Animation values for sticky bar: slides down and fades out when docked
  const stickyTranslateY = dockAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const stickyOpacity = dockAnim.interpolate({
    inputRange: [0, 0.6, 1],
    outputRange: [1, 0.3, 0],
  });

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: '#FFFFFF' }]}
    >
      {/* 1. Header Bar without green button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerIconButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Go back"
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title.toUpperCase()}
        </Text>

        {/* Placeholder to keep header title perfectly centered */}
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onLayout={e => {
          scrollViewHeight.current = e.nativeEvent.layout.height;
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* 2. Image Gallery with Overlays */}
        <View style={[styles.imageContainer, { width, height: imageHeight }]}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const offsetX = e.nativeEvent.contentOffset.x;
              setActiveImage(Math.round(offsetX / width));
            }}
          >
            {imagesToDisplay.map((img, i) => (
              <Image
                key={i}
                source={getSafeImageSource(img.url)}
                style={[styles.productImage, { width, height: imageHeight }]}
                contentFit="cover"
                transition={200}
              />
            ))}
          </ScrollView>

          {/* Social Proof Badge Overlay (Bottom Center) */}
          <View style={styles.overlayContainer}>
            <SocialProofBadge
              icon="🔥"
              count="1K"
              label="people viewed this in the last 24 hours"
              style={styles.socialProof}
            />

            {/* Pagination Indicators */}
            {imagesToDisplay.length > 1 && (
              <View style={styles.dotsRow}>
                {imagesToDisplay.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === activeImage ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 3. Product Details */}
        <View
          onLayout={e => {
            detailsLayoutY.current = e.nativeEvent.layout.y;
          }}
          style={[styles.details, isTablet && styles.tabletDetails]}
        >
          {/* Badge: Made for the studio */}
          <View style={styles.tagWrap}>
            <Text style={styles.tagText}>
              {product.tag || 'Made for the studio'}
            </Text>
          </View>

          {/* Product Title */}
          <Text style={styles.productTitle}>
            {product.title.toUpperCase()}
          </Text>

          {/* Fit */}
          <Text style={styles.fitText}>{product.fit || 'Regular'}</Text>

          {/* Price */}
          <Text style={styles.priceText}>{currentPrice}</Text>

          {/* Action Buttons Row: Rating, Wishlist, Share */}
          <ActionButtonsRow
            rating={product.rating || 5.0}
            reviewCount={1}
            isWishlisted={isWishlisted}
            onToggleWishlist={() => toggleWishlist(product.id)}
            onPressRating={() => {
              Alert.alert(
                'Customer Reviews',
                `Rated ${product.rating || 5.0} out of 5 stars based on verified buyer reviews.`
              );
            }}
            shareTitle={product.title}
            shareMessage={`Check out ${product.title} - ${currentPrice}`}
          />

          {/* Color Swatches */}
          <ColorSwatchPicker
            colors={COLOR_SWATCHES}
            selectedColorId={selectedOptions.Colour || 'Soft Brown'}
            onSelectColor={col => {
              dispatchOptions({
                type: 'set_option',
                name: 'Colour',
                value: col.name,
              });
            }}
          />

          {/* Rise Selector: Mid / High */}
          <SegmentedPicker
            label="Rise"
            options={RISE_OPTIONS}
            selectedOption={selectedOptions.Rise || 'Mid'}
            onSelectOption={val => {
              dispatchOptions({
                type: 'set_option',
                name: 'Rise',
                value: val,
              });
            }}
          />

          {/* Size Selector: XXS - XXL + Size Guide */}
          <SizePicker
            sizes={ALL_SIZES}
            selectedSize={selectedOptions.Size || 'S'}
            unavailableSizes={unavailableSizes}
            onSelectSize={sz => {
              dispatchOptions({
                type: 'set_option',
                name: 'Size',
                value: sz,
              });
            }}
            onPressSizeGuide={() => setSizeGuideVisible(true)}
          />

          {/* Out of Stock Alert Banner if selected variant is unavailable */}
          {isUnavailable && (
            <View style={styles.soldOutBanner}>
              <Text style={styles.soldOutIcon}>⚠️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.soldOutTitle}>Option Currently Sold Out</Text>
                <Text style={styles.soldOutText}>
                  {selectedOptions.Size} / {selectedOptions.Colour} is temporarily out of stock. Choose another size or color to add to bag.
                </Text>
              </View>
            </View>
          )}

          {/* Waistband Callout Banner Card */}
          <FeatureCard
            title={waistbandTitle}
            subtitle="Comfy and it sits flush to your body for zero distractions"
          />

          {/* Action Buttons Section */}
          <View
            onLayout={e => {
              inPageButtonY.current =
                detailsLayoutY.current + e.nativeEvent.layout.y;
            }}
            style={styles.inPageButtonsWrapper}
          >
            {/* Animated In-Page "Add to bag": only visible & active when user reached Buy Now */}
            <Animated.View
              style={[
                styles.animatedAtcSlot,
                {
                  opacity: inPageOpacity,
                  transform: [
                    { translateY: inPageTranslateY },
                    { scale: inPageScale },
                  ],
                },
              ]}
              pointerEvents={isDocked ? 'auto' : 'none'}
            >
              <Button
                title={
                  isUnavailable
                    ? 'Sold Out'
                    : cartLoading
                    ? 'Adding...'
                    : 'Add to bag'
                }
                onPress={handleAddToCart}
                disabled={isUnavailable}
                loading={cartLoading}
                variant="primary"
                style={styles.atcButton}
              />
            </Animated.View>

            {/* Buy now Button */}
            <Button
              title="Buy now"
              onPress={handleBuyNow}
              disabled={isUnavailable}
              variant="primary"
              style={styles.buyNowButton}
            />
          </View>

          {/* Checkout Perks: Exclusive Rewards, Delivery Info, Express */}
          <CheckoutPerks />

          {/* Third-Party Integrations: Reviews */}
          <View style={styles.integrationsContainer}>
            <ReviewsSection productId={product.id} />
          </View>
        </View>
      </ScrollView>

      {/* 4. Sticky Bottom "Add to Bag" Bar: only shows when NOT reached Buy now */}
      <Animated.View
        style={[
          styles.stickyBottomBar,
          {
            opacity: stickyOpacity,
            transform: [{ translateY: stickyTranslateY }],
          },
        ]}
        pointerEvents={isDocked ? 'none' : 'auto'}
      >
        <Button
          title={
            isUnavailable
              ? 'Sold Out'
              : cartLoading
              ? 'Adding...'
              : 'Add to bag'
          }
          onPress={handleAddToCart}
          disabled={isUnavailable}
          loading={cartLoading}
          variant="primary"
          style={styles.stickyButton}
        />
      </Animated.View>

      {/* 5. Size Guide Modal */}
      <Modal
        visible={sizeGuideVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSizeGuideVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SIZE GUIDE</Text>
              <TouchableOpacity
                onPress={() => setSizeGuideVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Measurements in inches (fits true to size):
            </Text>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Size</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Waist</Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell]}>Hips</Text>
              </View>
              {[
                { s: 'XXS', w: '24"', h: '34"' },
                { s: 'XS', w: '26"', h: '36"' },
                { s: 'S', w: '28"', h: '38"' },
                { s: 'M', w: '30"', h: '40"' },
                { s: 'L', w: '32"', h: '42"' },
                { s: 'XL', w: '34"', h: '44"' },
                { s: 'XXL', w: '36"', h: '46"' },
              ].map(row => (
                <View key={row.s} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { fontWeight: '700' }]}>
                    {row.s}
                  </Text>
                  <Text style={styles.tableCell}>{row.w}</Text>
                  <Text style={styles.tableCell}>{row.h}</Text>
                </View>
              ))}
            </View>

            <Button
              title="Got It"
              onPress={() => setSizeGuideVisible(false)}
              variant="primary"
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14.5,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  headerRightPlaceholder: {
    width: 36,
    height: 36,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    backgroundColor: '#F3F4F6',
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  socialProof: {
    alignSelf: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    height: 3.5,
  },
  dotActive: {
    width: 24,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 4,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  tabletDetails: {
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  tagWrap: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 2,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.2,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.6,
    lineHeight: 28,
    marginBottom: 4,
  },
  fitText: {
    fontSize: 14,
    color: '#71717A',
    marginBottom: 6,
    fontWeight: '400',
  },
  priceText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.2,
  },
  inPageButtonsWrapper: {
    marginTop: 4,
    marginBottom: 6,
  },
  animatedAtcSlot: {
    marginBottom: 10,
  },
  atcButton: {
    marginBottom: 0,
  },
  buyNowButton: {
    marginTop: 0,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 12 : 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8,
  },
  stickyButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 24,
    width: '100%',
    maxWidth: 420,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#71717A',
    fontWeight: '600',
  },
  modalSub: {
    fontSize: 13,
    color: '#71717A',
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableHeaderRow: {
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#18181B',
  },
  tableHeaderCell: {
    fontWeight: '700',
    color: '#71717A',
  },
  soldOutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  soldOutIcon: {
    fontSize: 20,
  },
  soldOutTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#991B1B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  soldOutText: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 16,
  },
  integrationsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
});
