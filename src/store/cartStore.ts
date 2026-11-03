import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cart } from '../api/types';
import { storeConfig } from '../config';
import {
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  fetchCart,
  syncMockCart,
} from '../api/shopifyClient';

interface CartState {
  cart: Cart | null;
  cartId: string | null;
  loading: boolean;
  error: string | null;
  // Actions
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  hydrateCart: () => Promise<void>;
  clearCart: () => void;
  clearError: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      cartId: null,
      loading: false,
      error: null,

      addToCart: async (variantId: string, quantity = 1) => {
        set({ loading: true, error: null });
        try {
          const { cartId } = get();
          let cart: Cart;
          if (!cartId) {
            cart = await cartCreate(storeConfig, variantId, quantity);
          } else {
            cart = await cartLinesAdd(storeConfig, cartId, variantId, quantity);
          }
          syncMockCart(cart);
          set({ cart, cartId: cart.id, loading: false });
        } catch (e: any) {
          set({ loading: false, error: e.message ?? 'Failed to add item to cart' });
        }
      },

      updateQuantity: async (lineId: string, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return;
        set({ loading: true, error: null });
        try {
          if (quantity <= 0) {
            const cart = await cartLinesRemove(storeConfig, cartId, lineId);
            syncMockCart(cart);
            set({ cart, loading: false });
          } else {
            const cart = await cartLinesUpdate(storeConfig, cartId, lineId, quantity);
            syncMockCart(cart);
            set({ cart, loading: false });
          }
        } catch (e: any) {
          set({ loading: false, error: e.message ?? 'Failed to update quantity' });
        }
      },

      removeItem: async (lineId: string) => {
        const { cartId } = get();
        if (!cartId) return;
        set({ loading: true, error: null });
        try {
          const cart = await cartLinesRemove(storeConfig, cartId, lineId);
          syncMockCart(cart);
          set({ cart, loading: false });
        } catch (e: any) {
          set({ loading: false, error: e.message ?? 'Failed to remove item' });
        }
      },

      hydrateCart: async () => {
        const { cartId, cart } = get();
        // If cart is already hydrated from persistent local storage, sync the mock client
        if (cart) {
          syncMockCart(cart);
        }
        if (!cartId) return;
        try {
          const freshCart = await fetchCart(storeConfig, cartId);
          if (freshCart && freshCart.lines.length > 0) {
            syncMockCart(freshCart);
            set({ cart: freshCart });
          } else if (cart && cart.lines.length > 0) {
            syncMockCart(cart);
          }
        } catch {
          // silently keep the local persisted cart in offline or mock mode
          if (cart) {
            syncMockCart(cart);
          }
        }
      },

      clearCart: () => {
        set({
          cart: {
            id: 'mock-cart-001',
            checkoutUrl: 'https://shopify.com/checkout/mock',
            lines: [],
            cost: {
              totalAmount: { amount: '0.00', currencyCode: 'USD' },
              subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
            },
          },
          cartId: 'mock-cart-001',
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: `veloshop-cart-v2`,
      storage: createJSONStorage(() => AsyncStorage),
      // Crucial for Cart persistence after restarting the app:
      // Persist BOTH cart and cartId so lines and totals restore instantly on launch
      partialize: state => ({ cartId: state.cartId, cart: state.cart }),
    }
  )
);

// Derived helpers
export const cartItemCount = (cart: Cart | null) =>
  cart?.lines.reduce((sum, l) => sum + l.quantity, 0) ?? 0;

export const cartTotal = (cart: Cart | null) =>
  cart?.cost.totalAmount ?? { amount: '0.00', currencyCode: 'USD' };
