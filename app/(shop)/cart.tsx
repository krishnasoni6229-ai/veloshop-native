import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useCartStore, cartTotal } from '../../src/store/cartStore';
import { useTheme, useStore } from '../../src/context/StoreContext';
import { Button } from '../../src/components/Button';
import { EmptyCartIcon } from '../../src/components/TabIcons';
import { CartLine } from '../../src/api/types';
import { isTablet as checkIsTablet } from '../../src/responsive';

function getSafeImageSource(url: string | any) {
  if (!url) return { uri: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80' };
  if (typeof url === 'number') return url;
  if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
    return { uri: url };
  }
  return url;
}

function getCurrencySymbol(currencyCode: string) {
  if (currencyCode === 'GBP') return '£';
  if (currencyCode === 'EUR') return '€';
  return '$';
}

function CartLineItem({ line }: { line: CartLine }) {
  const theme = useTheme();
  const { updateQuantity, removeItem } = useCartStore();
  const image = line.merchandise.product.images[0];
  const price = line.merchandise.price;
  const lineTotal = (parseFloat(price.amount) * line.quantity).toFixed(2);
  const symbol = getCurrencySymbol(price.currencyCode);

  return (
    <View
      style={[
        styles.lineItem,
        { backgroundColor: theme.cardColor, borderRadius: theme.borderRadius },
      ]}
    >
      {image && (
        <Image
          source={getSafeImageSource(image.url)}
          style={[styles.lineImage, { borderRadius: theme.borderRadius }]}
          contentFit="cover"
        />
      )}

      <View style={styles.lineDetails}>
        <Text style={[styles.lineTitle, { color: theme.textColor }]} numberOfLines={2}>
          {line.merchandise.product.title}
        </Text>
        <Text style={[styles.lineVariant, { color: theme.textColor }]}>
          {line.merchandise.title}
        </Text>
        <Text style={[styles.linePrice, { color: theme.primaryColor }]}>
          {symbol}{lineTotal}
        </Text>

        {/* Quantity stepper */}
        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => updateQuantity(line.id, line.quantity - 1)}
            style={[styles.stepBtn, { borderColor: theme.primaryColor, borderRadius: theme.borderRadius / 2 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.stepBtnText, { color: theme.primaryColor }]}>−</Text>
          </TouchableOpacity>
          <Text style={[styles.quantityText, { color: theme.textColor }]}>
            {line.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => updateQuantity(line.id, line.quantity + 1)}
            style={[styles.stepBtn, { borderColor: theme.primaryColor, borderRadius: theme.borderRadius / 2 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.stepBtnText, { color: theme.primaryColor }]}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert('Remove item?', `Remove ${line.merchandise.product.title} from your cart?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeItem(line.id) },
              ])
            }
            style={styles.removeBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function CartScreen() {
  const theme = useTheme();
  const config = useStore();
  const { cart, loading, error, clearError, hydrateCart } = useCartStore();
  const isTablet = checkIsTablet();
  const total = cartTotal(cart);
  const symbol = getCurrencySymbol(total.currencyCode);
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);

  function handleCheckout() {
    setCheckoutModalVisible(true);
  }

  function handleProceedToShopify() {
    setCheckoutModalVisible(false);
    if (!cart?.checkoutUrl) return;
    Linking.openURL(cart.checkoutUrl).catch(() => {
      Alert.alert('Checkout URL', `Shopify Checkout Endpoint:\n${cart.checkoutUrl}`);
    });
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconContainer,
              {
                backgroundColor: theme.cardColor,
                borderColor: '#EAEAEA',
                borderRadius: theme.borderRadius * 4 || 48,
              },
            ]}
          >
            <EmptyCartIcon color={theme.primaryColor} size={50} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.textColor }]}>
            Your bag is empty
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textColor }]}>
            Explore our high-performance gear and add items to your bag.
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(shop)')}
            style={styles.emptyShopBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          My Bag
        </Text>
        <Text style={[styles.itemCount, { color: theme.textColor }]}>
          {cart.lines.reduce((s, l) => s + l.quantity, 0)} items
        </Text>
      </View>

      {/* Error state banner if any cart mutation failed */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity onPress={() => hydrateCart()} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearError} style={styles.dismissBtn}>
              <Text style={styles.dismissBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={cart.lines}
        keyExtractor={l => l.id}
        renderItem={({ item }) => <CartLineItem line={item} />}
        contentContainerStyle={[styles.list, isTablet && styles.tabletList]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View>
            {/* Order summary */}
            <View style={[styles.summaryCard, { backgroundColor: theme.cardColor, borderRadius: theme.borderRadius }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textColor }]}>Subtotal</Text>
                <Text style={[styles.summaryValue, { color: theme.textColor }]}>
                  {symbol}{parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textColor }]}>Shipping</Text>
                <Text style={[styles.summaryValue, { color: theme.textColor, opacity: 0.5 }]}>
                  Free standard shipping
                </Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: '#E5E5E5' }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabelBold, { color: theme.textColor }]}>Total</Text>
                <Text style={[styles.summaryValueBold, { color: theme.primaryColor }]}>
                  {symbol}{parseFloat(total.amount).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Checkout note */}
            <Text style={[styles.checkoutNote, { color: theme.textColor }]}>
              🔒 Secure checkout powered by Shopify Storefront API.
            </Text>

            <Button
              title="Proceed to Checkout"
              onPress={handleCheckout}
              loading={loading}
              style={styles.checkoutBtn}
            />
          </View>
        }
      />

      {/* Production Checkout Architecture Explanation Modal */}
      <Modal
        visible={checkoutModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { borderRadius: theme.borderRadius }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>SHOPIFY CHECKOUT FLOW</Text>
              <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              How checkout works in production for {config.storeName}:
            </Text>

            <View style={styles.flowList}>
              <View style={styles.flowStep}>
                <Text style={styles.stepNum}>1</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Cart Session Created</Text>
                  <Text style={styles.stepDesc}>
                    Shopify Storefront API generates a secure checkout session with ID {cart.id.slice(0, 15)}...
                  </Text>
                </View>
              </View>

              <View style={styles.flowStep}>
                <Text style={styles.stepNum}>2</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Buyer Identity Injection</Text>
                  <Text style={styles.stepDesc}>
                    Customer email, shipping address, and phone are pre-injected via GraphQL before opening the web sheet.
                  </Text>
                </View>
              </View>

              <View style={styles.flowStep}>
                <Text style={styles.stepNum}>3</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>One-Tap Payment</Text>
                  <Text style={styles.stepDesc}>
                    Apple Pay, Google Pay, and Shop Pay execute with biometric authorization inside an in-app browser sheet.
                  </Text>
                </View>
              </View>

              <View style={styles.flowStep}>
                <Text style={styles.stepNum}>4</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>Native Return & Webhooks</Text>
                  <Text style={styles.stepDesc}>
                    Post-purchase redirect returns to veloshop://checkout/success, clearing the cart and showing the receipt.
                  </Text>
                </View>
              </View>
            </View>

            <Button
              title="Open Checkout URL (Demo)"
              onPress={handleProceedToShopify}
              variant="primary"
              style={{ marginTop: 16 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '900', letterSpacing: 0.5 },
  itemCount: { fontSize: 14, opacity: 0.5 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  tabletList: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 6,
  },
  errorText: { fontSize: 13, color: '#B91C1C', flex: 1 },
  errorActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  retryBtn: { backgroundColor: '#DC2626', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  retryBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  dismissBtn: { padding: 4 },
  dismissBtnText: { color: '#B91C1C', fontSize: 14, fontWeight: '700' },
  loyaltyBanner: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  loyaltyText: { fontSize: 12, color: '#1E40AF' },
  lineItem: {
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  lineImage: { width: 90, height: 110, marginRight: 14 },
  lineDetails: { flex: 1 },
  lineTitle: { fontSize: 14, fontWeight: '700', marginBottom: 3, lineHeight: 20 },
  lineVariant: { fontSize: 12, opacity: 0.55, marginBottom: 4 },
  linePrice: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  stepBtn: {
    borderWidth: 1.5,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
    textAlign: 'center',
    includeFontPadding: false,
  },
  quantityText: { fontSize: 14, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  removeBtn: { marginLeft: 12, paddingVertical: 4, paddingHorizontal: 4 },
  removeBtnText: { fontSize: 12, color: '#888', textDecorationLine: 'underline' },
  summaryCard: {
    marginHorizontal: 0,
    width: '100%',
    padding: 18,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, opacity: 0.7 },
  summaryValue: { fontSize: 14 },
  summaryDivider: { height: 1, marginVertical: 10 },
  summaryLabelBold: { fontSize: 16, fontWeight: '700' },
  summaryValueBold: { fontSize: 18, fontWeight: '800' },
  checkoutNote: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.5,
    marginHorizontal: 0,
    marginBottom: 14,
    paddingHorizontal: 8,
  },
  checkoutBtn: {
    marginHorizontal: 0,
    width: '100%',
    marginBottom: 12,
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyTitle: { fontSize: 22, fontWeight: '900', letterSpacing: 0.3, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, opacity: 0.65, textAlign: 'center', lineHeight: 20, marginBottom: 26 },
  emptyShopBtn: { minWidth: 220 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  modalCloseText: { fontSize: 18, color: '#666', fontWeight: '700' },
  modalSubtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  flowList: { gap: 12 },
  flowStep: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepTitle: { fontSize: 13, fontWeight: '700', marginBottom: 2 },
  stepDesc: { fontSize: 12, color: '#666', lineHeight: 16 },
});
