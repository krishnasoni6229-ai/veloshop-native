import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../context/StoreContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface HeroBannerProps {
  title: string;
  subtitle: string;
  buttonText?: string;
  imageUrl: string | any;
  fallbackImage?: any;
  onPress: () => void;
  height?: number;
}

export function HeroBanner({
  title,
  subtitle,
  buttonText = 'Shop now',
  imageUrl,
  fallbackImage,
  onPress,
  height = SCREEN_HEIGHT * 0.58,
}: HeroBannerProps) {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);

  // Normalize remote URL or local asset
  const imageSource = useMemo(() => {
    if (hasError && fallbackImage) return fallbackImage;
    if (!imageUrl) return fallbackImage;
    if (typeof imageUrl === 'string') {
      return { uri: imageUrl };
    }
    return imageUrl;
  }, [imageUrl, fallbackImage, hasError]);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={[styles.container, { height }]}
      onPress={onPress}
    >
      {/* Background Fitness Image */}
      {imageSource ? (
        <Image
          source={imageSource}
          placeholder={fallbackImage}
          placeholderContentFit="cover"
          style={styles.image}
          contentFit="cover"
          transition={250}
          priority="high"
          cachePolicy="memory-disk"
          onError={() => setHasError(true)}
        />
      ) : null}

      {/* Dark overlay for high contrast & readable white text */}
      <View style={styles.overlay} />

      {/* Content Block — pinned to bottom-left */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={[styles.button, { borderRadius: theme.borderRadius }]}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#1E1E1E',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  // Dark overlay ensuring text stands out against any athletic photo
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  // Text content pinned to bottom-left
  content: {
    position: 'absolute',
    bottom: 32,
    left: 18,
    right: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    maxWidth: '90%',
    marginBottom: 20,
    opacity: 0.95,
  },
  // Solid white button with black text (matches screenshot 1)
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 26,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
    includeFontPadding: false,
    textAlign: 'center',
  },
});
