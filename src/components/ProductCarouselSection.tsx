import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Product } from '../api/types';
import { ProductCard } from './ProductCard';
import { useTheme } from '../context/StoreContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ProductCarouselSectionProps {
  title: string;
  products: Product[];
  onProductPress?: (product: Product) => void;
  onViewAllPress?: () => void;
  viewAllText?: string;
  showViewAll?: boolean;
  cardWidth?: number;
  style?: ViewStyle;
}

export function ProductCarouselSection({
  title,
  products,
  onProductPress,
  onViewAllPress,
  viewAllText = 'View All',
  showViewAll = true,
  cardWidth,
  style,
}: ProductCarouselSectionProps) {
  const theme = useTheme();

  if (!products || products.length === 0) {
    return null;
  }

  const effectiveCardWidth = cardWidth || Math.min(SCREEN_WIDTH * 0.72, 290);

  return (
    <View style={[styles.container, { backgroundColor: theme.cardColor }, style]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onViewAllPress}
          activeOpacity={onViewAllPress ? 0.7 : 1}
          disabled={!onViewAllPress}
        >
          <Text style={[styles.title, { color: theme.textColor }]}>{title}</Text>
        </TouchableOpacity>

        {showViewAll && onViewAllPress && (
          <TouchableOpacity
            onPress={onViewAllPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.viewAllText, { color: theme.textColor }]}>{viewAllText}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Carousel List */}
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            layout="carousel"
            cardWidth={effectiveCardWidth}
            onPress={() => onProductPress && onProductPress(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  viewAllText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#111111',
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 10,
  },
});

