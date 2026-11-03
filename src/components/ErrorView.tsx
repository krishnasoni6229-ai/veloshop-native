import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { useTheme } from '../context/StoreContext';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorView({
  message = 'Something went wrong.',
  onRetry,
}: ErrorViewProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.emoji]}>⚠️</Text>
      <Text style={[styles.title, { color: theme.textColor }]}>
        Oops!
      </Text>
      <Text style={[styles.message, { color: theme.textColor }]}>
        {message}
      </Text>
      {onRetry && (
        <Button title="Retry" onPress={onRetry} style={styles.btn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.65,
    marginBottom: 24,
    lineHeight: 22,
  },
  btn: { minWidth: 140 },
});

