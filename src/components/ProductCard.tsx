import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/StoreContext';
import { Product } from '../api/types';
import { useWishlistStore } from '../store/wishlistStore';

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
  layout?: 'grid' | 'carousel' | 'single';
  cardWidth?: number;
  showWishlist?: boolean;
}

function HeartIcon({
  filled,
  color = '#111111',
  size = 20,
}: {
  filled: boolean;
  color?: string;
  size?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function formatPriceDisplay(amount: string, currencyCode: string = 'USD'): string {
  const num = parseFloat(amount);
  const formatted = num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  if (currencyCode === 'USD') {
    return `$${formatted} USD`;
  }
  if (currencyCode === 'GBP') {
    return `£${formatted}`;
  }
  return `${currencyCode} ${formatted}`;
}

export const ProductCard = React.memo(function ProductCard({
  product,
  onPress,
  layout = 'grid',
  cardWidth,
}: ProductCardProps) {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);
  const image = product.images[0];
  const price = product.priceRange.minVariantPrice;
  const allUnavailable = product.variants.length > 0 && product.variants.every(v => !v.availableForSale);

  const isWishlisted = useWishlistStore(s => s.wishlistIds.includes(product.id));
  const toggleWishlist = useWishlistStore(s => s.toggleWishlist);

  const isCarousel = layout === 'carousel';
  const isSingle = layout === 'single';

  // Reliable bundled fallback image to ensure products never appear blank
  const defaultFallback = isSingle
    ? require('../../assets/release-softsense.jpg')
    : require('../../assets/release-adapt.jpg');

  const imageSource = hasError || !image?.url
    ? defaultFallback
    : typeof image.url === 'string' && (image.url.startsWith('http://') || image.url.startsWith('https://'))
    ? { uri: image.url }
    : image.url;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[
        styles.card,
        { backgroundColor: theme.cardColor, borderRadius: theme.borderRadius },
        isCarousel
          ? { width: cardWidth || 270, marginRight: 14 }
          : isSingle
          ? styles.singleCard
          : styles.gridCard,
      ]}
    >
      {/* Image Container */}
      <View
        style={[
          styles.imageWrap,
          { borderRadius: theme.borderRadius },
          isCarousel
            ? styles.carouselImageWrap
            : isSingle
            ? styles.singleImageWrap
            : styles.gridImageWrap,
        ]}
      >
        <Image
          source={imageSource}
          style={styles.image}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
          onError={() => setHasError(true)}
        />

        {/* Wishlist Heart Button - top right */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.wishlistBtn}
        >
          <HeartIcon filled={isWishlisted} color={isWishlisted ? '#000000' : '#111111'} size={21} />
        </TouchableOpacity>

        {/* Tag / Badge - bottom left inside image */}
        {product.tag ? (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{product.tag}</Text>
          </View>
        ) : null}

        {allUnavailable && (
          <View style={styles.soldOutBadge}>
            <Text style={styles.soldOutText}>Sold Out</Text>
          </View>
        )}
      </View>

      {/* Product Details (Identical UI across Home & Drops: rating, title, fit, color, price) */}
      <View style={[styles.info, isSingle && styles.singleInfo]}>
        {/* Rating */}
        {product.rating ? (
          <View style={styles.ratingRow}>
            <Text style={styles.starIcon}>★</Text>
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          </View>
        ) : null}

        {/* Title */}
        <Text
          style={[styles.title, isSingle && styles.singleTitle, { color: theme.textColor }]}
          numberOfLines={1}
        >
          {product.title}
        </Text>

        {/* Fit */}
        {product.fit ? (
          <Text style={styles.fitText} numberOfLines={1}>
            {product.fit}
          </Text>
        ) : null}

        {/* Color */}
        {product.color ? (
          <Text style={styles.colorText} numberOfLines={1}>
            {product.color}
          </Text>
        ) : null}

        {/* Price */}
        <Text
          style={[
            styles.priceText,
            isSingle && styles.singlePriceText,
            { color: theme.textColor },
          ]}
        >
          {formatPriceDisplay(price.amount, price.currencyCode)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
  },
  gridCard: {
    flex: 1,
    maxWidth: '48%',
    marginHorizontal: 5,
    marginBottom: 20,
  },
  singleCard: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  imageWrap: {
    width: '100%',
    backgroundColor: '#F3F1ED',
    position: 'relative',
    overflow: 'hidden',
  },
  carouselImageWrap: {
    aspectRatio: 0.78,
  },
  gridImageWrap: {
    aspectRatio: 0.8,
  },
  singleImageWrap: {
    aspectRatio: 0.82,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 2,
    zIndex: 5,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: 0.2,
  },
  soldOutBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 2,
  },
  soldOutText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    paddingTop: 8,
    paddingHorizontal: 2,
  },
  singleInfo: {
    paddingTop: 10,
    paddingHorizontal: 0,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  starIcon: {
    fontSize: 12,
    color: '#111111',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#111111',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  singleTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  fitText: {
    fontSize: 13,
    color: '#717171',
    marginBottom: 1,
  },
  colorText: {
    fontSize: 13,
    color: '#717171',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  singlePriceText: {
    fontSize: 15.5,
    marginTop: 3,
  },
});
