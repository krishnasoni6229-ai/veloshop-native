import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../context/StoreContext';

export interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  uppercase?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export function Button({
  onPress,
  title,
  disabled,
  loading,
  variant = 'primary',
  size = 'md',
  uppercase = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {
  const theme = useTheme();

  const isPrimary = variant === 'primary' || variant === 'dark';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  const bgColor = isPrimary
    ? theme.primaryColor
    : isSecondary
    ? (theme.backgroundColor || '#F3F4F6')
    : 'transparent';

  const txtColor = isPrimary
    ? theme.secondaryColor
    : isSecondary
    ? theme.textColor
    : theme.textColor;

  const minHeight = size === 'sm' ? 40 : size === 'lg' ? 56 : 52;
  const paddingVertical = size === 'sm' ? 10 : size === 'lg' ? 16 : 14;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: bgColor,
          borderRadius: theme.borderRadius,
          borderWidth: isOutline ? 1.5 : 0,
          borderColor: isOutline ? theme.primaryColor : 'transparent',
          minHeight,
          paddingVertical,
          opacity: disabled || loading ? 0.45 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              styles.text,
              {
                color: txtColor,
                fontFamily: theme?.fontFamily,
                textTransform: uppercase ? 'uppercase' : 'none',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

