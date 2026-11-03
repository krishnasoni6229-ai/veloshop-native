import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../context/StoreContext';

export interface ReleaseItem {
  id: string;
  title: string;
  imageUrl?: string;
  imageSource?: any;
  handle?: string;
}

export interface ReleasesCarouselProps {
  title?: string;
  releases?: ReleaseItem[];
  onReleasePress?: (release: ReleaseItem) => void;
  style?: ViewStyle;
}

export const DEFAULT_RELEASES: ReleaseItem[] = [
  {
    id: 'rel-softsense',
    title: 'SoftSense™',
    handle: 'softsense',
    imageSource: require('../../assets/release-softsense.jpg'),
  },
  {
    id: 'rel-adapt',
    title: 'Adapt Solid',
    handle: 'power',
    imageSource: require('../../assets/release-adapt.jpg'),
  },
  {
    id: 'rel-everyday',
    title: 'Everyday',
    handle: 'vengeance',
    imageSource: require('../../assets/release-everyday.jpg'),
  },
];

const ReleaseCardItem = React.memo(function ReleaseCardItem({
  item,
  onPress,
}: {
  item: ReleaseItem;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const imageSrc = item.imageSource || (item.imageUrl ? { uri: item.imageUrl } : undefined);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={[styles.imageWrap, { borderRadius: theme.borderRadius }]}>
        {imageSrc ? (
          <Image
            source={imageSrc}
            style={styles.image}
            contentFit="cover"
            cachePolicy="memory-disk"
            priority="high"
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <Text style={[styles.cardTitle, { color: theme.textColor }]} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
});

export const ReleasesCarousel = React.memo(function ReleasesCarousel({
  title = 'NEW RELEASES',
  releases = DEFAULT_RELEASES,
  onReleasePress,
  style,
}: ReleasesCarouselProps) {
  const theme = useTheme();
  const renderItem = useCallback(
    ({ item }: { item: ReleaseItem }) => (
      <ReleaseCardItem
        item={item}
        onPress={() => onReleasePress?.(item)}
      />
    ),
    [onReleasePress]
  );

  const keyExtractor = useCallback((item: ReleaseItem) => item.id, []);

  if (!releases || releases.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardColor }, style]}>
      {title ? <Text style={[styles.sectionTitle, { color: theme.textColor }]}>{title}</Text> : null}

      <FlatList
        data={releases}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
        renderItem={renderItem}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  card: {
    width: 144,
    marginRight: 10,
  },
  imageWrap: {
    width: 144,
    height: 180,
    backgroundColor: '#F3F1ED',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#EBEBEB',
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#111111',
    marginTop: 8,
    letterSpacing: -0.1,
  },
});
