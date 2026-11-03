import { StoreConfig } from './types';

/**
 * Veloshop — fictional cycling apparel store
 * Demonstrates full platform reuse with zero screen-component edits.
 * Blue/orange sport colourway.
 */
export const veloshopConfig: StoreConfig = {
  merchantId: 'veloshop',
  storeName: 'Veloshop',
  tagline: 'Ride faster. Look better.',
  shopifyDomain: 'veloshop-demo.myshopify.com',
  storefrontToken: 'VELOSHOP_STOREFRONT_TOKEN',
  defaultCollectionHandle: 'all',
  branding: {
    primaryColor: '#0057FF',
    secondaryColor: '#FF6B00',
    backgroundColor: '#F0F4FF',
    textColor: '#0A0A2E',
    cardColor: '#FFFFFF',
    borderRadius: 12,
  },
  features: {
    reviews: false,           // not installed for this merchant
    loyalty: false,           // loyalty disabled
    wishlist: false,
    recentlyViewed: false,
    search: 'disabled',
    notifications: false,
  },
  checkout: {
    mode: 'shopify_hosted',
    successRedirectPath: '/(shop)',
  },
};

