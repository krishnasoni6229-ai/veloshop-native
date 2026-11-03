import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/StoreContext';

export interface CheckoutPerksProps {
  onPressDeliveryInfo?: () => void;
}

export function CheckoutPerks({
  onPressDeliveryInfo,
}: CheckoutPerksProps) {
  const theme = useTheme();

  const handleDeliveryInfo = () => {
    if (onPressDeliveryInfo) {
      onPressDeliveryInfo();
    } else {
      Alert.alert(
        'Delivery Information',
        'Standard shipping is free on orders over $75. Orders under $75 are charged a flat rate. Express delivery typically arrives within 1-2 business days.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Also available at checkout:</Text>

      <View style={[styles.perksCard, { borderRadius: theme.borderRadius, backgroundColor: theme.cardColor }]}>
        {/* Perk 1: Delivery */}
        <TouchableOpacity
          onPress={handleDeliveryInfo}
          activeOpacity={0.7}
          style={styles.perkRow}
        >
          <View style={styles.iconWrap}>
            {/* Delivery truck icon */}
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"
                stroke="#000000"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M5.5 20.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 20.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                stroke="#000000"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.perkText}>
            Prices & thresholds vary. Refer to our delivery information
          </Text>
        </TouchableOpacity>

        {/* Perk 2: Express Delivery */}
        <View style={styles.perkRow}>
          <View style={styles.iconWrap}>
            {/* Stopwatch / Clock icon */}
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 21a9 9 0 100-18 9 9 0 000 18z"
                stroke="#000000"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 7v5l3 2M10 2h4"
                stroke="#000000"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.perkText}>Express Delivery Available</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
    marginBottom: 28,
  },
  heading: {
    fontSize: 13,
    color: '#71717A',
    marginBottom: 12,
    fontWeight: '400',
  },
  perksCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 16,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 26,
    paddingTop: 1,
    alignItems: 'flex-start',
  },
  perkText: {
    flex: 1,
    fontSize: 13,
    color: '#18181B',
    lineHeight: 18,
  },
  perkLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

