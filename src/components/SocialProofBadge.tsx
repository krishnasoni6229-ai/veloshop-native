import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

export interface SocialProofBadgeProps {
  icon?: string;
  count?: string;
  label?: string;
  style?: ViewStyle;
}

export function SocialProofBadge({
  icon = '🔥',
  count = '1K',
  label = 'people viewed this in the last 24 hours',
  style,
}: SocialProofBadgeProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.text}>
        <Text style={styles.count}>{count} </Text>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  text: {
    fontSize: 12.5,
    color: '#71717A',
    fontWeight: '400',
  },
  count: {
    fontWeight: '700',
    color: '#18181B',
  },
});

