import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/StoreContext';

export interface SegmentedPickerProps {
  label?: string;
  options: string[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
}

export function SegmentedPicker({
  label,
  options,
  selectedOption,
  onSelectOption,
}: SegmentedPickerProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.pickerBox, { borderRadius: theme.borderRadius }]}>
        {options.map(option => {
          const isSelected = option === selectedOption;
          return (
            <TouchableOpacity
              key={option}
              activeOpacity={0.8}
              onPress={() => onSelectOption(option)}
              style={[
                styles.segment,
                { borderRadius: Math.max(1, theme.borderRadius / 2) },
                isSelected && [styles.segmentSelected, { backgroundColor: theme.primaryColor }],
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  isSelected && [styles.segmentTextSelected, { color: theme.secondaryColor }],
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#71717A',
    marginBottom: 8,
    fontWeight: '400',
  },
  pickerBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
    backgroundColor: 'transparent',
  },
  segmentSelected: {
    backgroundColor: '#000000',
  },
  segmentText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#000000',
  },
  segmentTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

