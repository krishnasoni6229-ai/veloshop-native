import { StoreConfig } from './types';

/**
 * Gymshark store configuration
 * Visual reference: gymshark.com — black/white athletic brand
 */
export const gymsharkConfig: StoreConfig = {
  merchantId: 'gymshark',
  storeName: 'Gymshark',
  tagline: 'Be a visionary.',
  // In production: real myshopify domain + storefront token
  shopifyDomain: 'gymshark.myshopify.com',
  storefrontToken: 'GYMSHARK_STOREFRONT_TOKEN', // env-injected at build time
  defaultCollectionHandle: 'all',
  branding: {
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    backgroundColor: '#F5F5F5',
    textColor: '#111111',
    cardColor: '#FFFFFF',
    fontFamily: undefined, // uses system default (SF Pro / Roboto)
    borderRadius: 4,
  },
  features: {
    reviews: true,
    loyalty: false,
    wishlist: true,
    recentlyViewed: true,
    search: 'native',
    notifications: true,
  },
  checkout: {
    mode: 'shopify_hosted',
    successRedirectPath: '/(shop)',
  },
};

