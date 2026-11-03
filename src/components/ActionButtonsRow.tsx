import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/StoreContext';

export interface ActionButtonsRowProps {
  rating?: number;
  reviewCount?: number;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  onPressRating?: () => void;
  shareTitle?: string;
  shareMessage?: string;
}

export function ActionButtonsRow({
  rating = 5.0,
  reviewCount = 1,
  isWishlisted,
  onToggleWishlist,
  onPressRating,
  shareTitle,
  shareMessage,
}: ActionButtonsRowProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        title: shareTitle || 'Check this out',
        message: shareMessage || 'Check out this product on Gymshark!',
      });
    } catch {
      // share dismissed
    }
  };

  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* 1. Rating Pill */}
      <TouchableOpacity
        onPress={onPressRating}
        activeOpacity={0.7}
        style={[styles.ratingButton, { borderRadius: Math.max(2, theme.borderRadius / 2) }]}
      >
        <Svg width={14} height={14} viewBox="0 0 24 24" fill="#000000" style={styles.starIcon}>
          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </Svg>
        <Text style={styles.ratingText}>
          {rating.toFixed(1)} ({reviewCount})
        </Text>
      </TouchableOpacity>

      {/* 2. Wishlist Button */}
      <TouchableOpacity
        onPress={onToggleWishlist}
        activeOpacity={0.7}
        style={[styles.squareButton, { borderRadius: Math.max(2, theme.borderRadius / 2) }]}
        accessibilityLabel="Save to wishlist"
      >
        <Svg width={20} height={20} viewBox="0 0 24 24" fill={isWishlisted ? '#000000' : 'none'}>
          <Path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke="#000000"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      {/* 3. Share Button */}
      <TouchableOpacity
        onPress={handleShare}
        activeOpacity={0.7}
        style={styles.squareButton}
        accessibilityLabel="Share product"
      >
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
          {/* Tray */}
          <Path
            d="M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5"
            stroke="#000000"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow up */}
          <Path
            d="M12 3v13M12 3L7.5 7.5M12 3l4.5 4.5"
            stroke="#000000"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    marginBottom: 24,
  },
  ratingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  starIcon: {
    marginRight: 6,
  },
  ratingText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.2,
  },
  squareButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

