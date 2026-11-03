import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/StoreContext';

export interface ListingHeaderProps {
  title?: string;
  onBack?: () => void;
  showBack?: boolean;
  showActionButton?: boolean;
  onActionPress?: () => void;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

function ArrowLeftIcon({ color = '#111111', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export const ListingHeader = React.memo(function ListingHeader({
  title = 'NEW PRODUCT DROPS',
  onBack,
  showBack = true,
  showActionButton = true,
  onActionPress,
  rightElement,
  style,
}: ListingHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.cardColor }, style]}>
      {/* Left Back Arrow */}
      <View style={styles.leftContainer}>
        {showBack && onBack ? (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <ArrowLeftIcon color={theme.textColor} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      {/* Center Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.textColor }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Right Action / Green 3-Dots Button */}
      <View style={styles.rightContainer}>
        {rightElement ? (
          rightElement
        ) : showActionButton ? (
          <TouchableOpacity
            onPress={onActionPress}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.badgeRing}
          >
            <View style={styles.greenBadge}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 38 }} />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  badgeRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 2,
    backgroundColor: '#F5E6B8', // warm champagne/gold ring
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenBadge: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
    backgroundColor: '#27AE60', // vibrant green
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});

