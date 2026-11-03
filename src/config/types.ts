
export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardColor: string;
  fontFamily?: string;
  borderRadius: number;
}

export interface FeatureFlags {
  reviews: boolean;
  loyalty: boolean;
  wishlist: boolean;
  recentlyViewed: boolean;
  search: 'native' | 'algolia' | 'disabled';
  notifications: boolean;
}

export interface CheckoutConfig {
  mode: 'shopify_hosted' | 'shopify_headless';
  successRedirectPath: string;
}

export interface StoreConfig {
  merchantId: string;
  storeName: string;
  tagline: string;
  shopifyDomain: string;
  storefrontToken: string;
  defaultCollectionHandle: string;
  branding: BrandingConfig;
  features: FeatureFlags;
  checkout: CheckoutConfig;
}

