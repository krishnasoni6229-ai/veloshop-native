import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (productId: string) => {
        const current = get().wishlistIds;
        const exists = current.includes(productId);
        const updated = exists
          ? current.filter(id => id !== productId)
          : [...current, productId];
        set({ wishlistIds: updated });
      },
      isWishlisted: (productId: string) => {
        return get().wishlistIds.includes(productId);
      },
      clearWishlist: () => {
        set({ wishlistIds: [] });
      },
    }),
    {
      name: 'veloshop-wishlist-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
