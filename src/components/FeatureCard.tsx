import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context/StoreContext';

export interface FeatureCardProps {
  title: string;
  subtitle: string;
  style?: ViewStyle;
}

export function FeatureCard({
  title,
  subtitle,
  style,
}: FeatureCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { borderRadius: theme.borderRadius, backgroundColor: theme.cardColor }, style]}>
      <Text style={[styles.title, { color: theme.textColor }]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 18,
  },
});

