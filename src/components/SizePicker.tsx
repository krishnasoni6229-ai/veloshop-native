import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/StoreContext';

export interface SizePickerProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onPressSizeGuide?: () => void;
  unavailableSizes?: string[];
}

export function SizePicker({
  sizes,
  selectedSize,
  onSelectSize,
  onPressSizeGuide,
  unavailableSizes = [],
}: SizePickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Size</Text>
        <TouchableOpacity
          onPress={onPressSizeGuide}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.sizeGuideLink, { color: theme.primaryColor }]}>Size Guide</Text>
        </TouchableOpacity>
      </View>

      {/* Size Box */}
      <View style={[styles.sizeBox, { borderRadius: theme.borderRadius }]}>
        {sizes.map(size => {
          const isSelected = size === selectedSize;
          const isUnavailable = unavailableSizes.includes(size);

          return (
            <TouchableOpacity
              key={size}
              onPress={() => onSelectSize(size)}
              activeOpacity={0.7}
              style={[
                styles.sizeItem,
                { borderRadius: Math.max(2, theme.borderRadius / 2) },
                isSelected && (isUnavailable ? styles.sizeItemSelectedSoldOut : [styles.sizeItemSelected, { backgroundColor: theme.primaryColor }]),
                isUnavailable && !isSelected && styles.sizeItemUnavailable,
              ]}
            >
              <Text
                style={[
                  styles.sizeText,
                  isSelected && [styles.sizeTextSelected, { color: theme.secondaryColor }],
                  isUnavailable && !isSelected && styles.sizeTextUnavailable,
                ]}
              >
                {size}
              </Text>
              {isUnavailable && (
                <View style={[styles.strikeLine, isSelected && styles.strikeLineSelected]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {unavailableSizes.length > 0 && (
        <Text style={styles.unavailableHint}>
          Sizes with a line ({unavailableSizes.join(', ')}) are currently out of stock.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    color: '#71717A',
    fontWeight: '400',
  },
  sizeGuideLink: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  sizeBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 6,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  sizeItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    position: 'relative',
  },
  sizeItemSelected: {
    backgroundColor: '#000000',
  },
  sizeItemSelectedSoldOut: {
    backgroundColor: '#71717A',
  },
  sizeItemUnavailable: {
    backgroundColor: '#F4F4F5',
  },
  sizeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    letterSpacing: 0.2,
  },
  sizeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sizeTextUnavailable: {
    color: '#A1A1AA',
  },
  strikeLine: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 1.5,
    backgroundColor: '#A1A1AA',
  },
  strikeLineSelected: {
    backgroundColor: '#FFFFFF',
  },
  unavailableHint: {
    fontSize: 11,
    color: '#71717A',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
