import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../context/StoreContext';

export interface ColorOption {
  id: string;
  name: string;
  image: any;
}

export interface ColorSwatchPickerProps {
  colors: ColorOption[];
  selectedColorId: string;
  onSelectColor: (color: ColorOption) => void;
}

export function ColorSwatchPicker({
  colors,
  selectedColorId,
  onSelectColor,
}: ColorSwatchPickerProps) {
  const theme = useTheme();
  const selectedColor = colors.find(c => c.id === selectedColorId) || colors[0];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {colors.map(color => {
          const isSelected = color.id === selectedColorId;
          return (
            <TouchableOpacity
              key={color.id}
              activeOpacity={0.8}
              onPress={() => onSelectColor(color)}
              style={[
                styles.swatchCard,
                { borderRadius: Math.max(2, theme.borderRadius / 2) },
                isSelected && [styles.swatchCardSelected, { borderColor: theme.primaryColor }],
              ]}
            >
              <Image
                source={color.image}
                style={styles.thumbnail}
                contentFit="cover"
                transition={150}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Color Name */}
      {selectedColor && (
        <Text style={styles.colorName}>{selectedColor.name}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollList: {
    flexDirection: 'row',
    gap: 10,
  },
  swatchCard: {
    width: 60,
    height: 76,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    backgroundColor: '#F3F4F6',
  },
  swatchCardSelected: {
    borderColor: '#000000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  colorName: {
    fontSize: 13.5,
    color: '#71717A',
    marginTop: 10,
    fontWeight: '400',
  },
});

