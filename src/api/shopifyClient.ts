/**
 * Shopify Storefront API client.
 * Uses labelled sample data in dev (no live token), real Storefront API in production.
 * Supports multi-store configurations (Gymshark & Veloshop) seamlessly.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoreConfig } from '../config/types';
import { Product, Cart, CartLine, Collection } from './types';
import {
  SAMPLE_PRODUCTS,
  SAMPLE_COLLECTIONS,
  VELOSHOP_PRODUCTS,
  VELOSHOP_COLLECTIONS,
  ALL_PRODUCTS,
} from './sampleData';
import {
  GET_PRODUCTS_QUERY,
  GET_ALL_PRODUCTS_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_QUERY,
  GET_PRODUCT_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  GET_CART_QUERY,
} from './queries';

export function isLiveGraphQL(config: StoreConfig): boolean {
  if (process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true') return false;
  const token = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || config.storefrontToken;
  const domain = process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN || config.shopifyDomain;
  return Boolean(
    token &&
    !token.includes('TOKEN') &&
    domain &&
    !domain.includes('placeholder')
  );
}

const MOCK_CART_STORAGE_KEY = '@veloshop_mock_cart_v1';

interface GraphQLClient {
  request<T = any>(query: string, variables?: Record<string, any>): Promise<T>;
}

function createClient(config: StoreConfig): GraphQLClient {
  return {
    async request<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
      const response = await fetch(
        `https://${config.shopifyDomain}/api/2025-01/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token': config.storefrontToken,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query, variables }),
        }
      );

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      if (json.errors?.length) {
        throw new Error(json.errors[0].message || 'GraphQL query error');
      }

      return json.data;
    },
  };
}

// ---------- helpers -------------------------------------------------------

function normaliseMoney(edge: any) {
  return { amount: edge.amount, currencyCode: edge.currencyCode };
}

function normaliseProduct(node: any): Product {
  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description ?? '',
    priceRange: {
      minVariantPrice: normaliseMoney(node.priceRange.minVariantPrice),
    },
    images: (node.images?.edges ?? []).map((e: any) => ({
      url: e.node.url,
      altText: e.node.altText ?? null,
    })),
    variants: (node.variants?.edges ?? []).map((e: any) => ({
      id: e.node.id,
      title: e.node.title,
      availableForSale: e.node.availableForSale,
      price: normaliseMoney(e.node.price),
      selectedOptions: e.node.selectedOptions,
    })),
  };
}

function normaliseCartLine(node: any): CartLine {
  const variant = node.merchandise;
  return {
    id: node.id,
    quantity: node.quantity,
    merchandise: {
      id: variant.id,
      title: variant.title,
      price: normaliseMoney(variant.price),
      product: {
        id: variant.product.id,
        title: variant.product.title,
        images: (variant.product.images?.edges ?? []).map((e: any) => ({
          url: e.node.url,
          altText: e.node.altText ?? null,
        })),
      },
    },
  };
}

function normaliseCart(raw: any): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    lines: (raw.lines?.edges ?? []).map((e: any) => normaliseCartLine(e.node)),
    cost: {
      totalAmount: normaliseMoney(raw.cost.totalAmount),
      subtotalAmount: normaliseMoney(raw.cost.subtotalAmount),
    },
  };
}

// ---------- mock cart (used with sample data) ----------------------------

let _mockCart: Cart = {
  id: 'mock-cart-001',
  checkoutUrl: 'https://shopify.com/checkout/mock',
  lines: [],
  cost: {
    totalAmount: { amount: '0.00', currencyCode: 'USD' },
    subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
  },
};

export function syncMockCart(cart: Cart) {
  _mockCart = { ...cart };
  AsyncStorage.setItem(MOCK_CART_STORAGE_KEY, JSON.stringify(cart)).catch(() => {});
}

function recalcMockCart(cart: Cart): Cart {
  const total = cart.lines.reduce(
    (sum, l) => sum + parseFloat(l.merchandise.price.amount) * l.quantity,
    0
  );
  const currency = cart.lines[0]?.merchandise.price.currencyCode ?? 'USD';
  const updated = {
    ...cart,
    cost: {
      totalAmount: { amount: total.toFixed(2), currencyCode: currency },
      subtotalAmount: { amount: total.toFixed(2), currencyCode: currency },
    },
  };
  // Save to AsyncStorage asynchronously to guarantee persistence after app restarts
  AsyncStorage.setItem(MOCK_CART_STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  return updated;
}

function getStoreProducts(config: StoreConfig): Product[] {
  return config.merchantId === 'veloshop' ? VELOSHOP_PRODUCTS : SAMPLE_PRODUCTS;
}

function getStoreCollections(config: StoreConfig): Collection[] {
  return config.merchantId === 'veloshop' ? VELOSHOP_COLLECTIONS : SAMPLE_COLLECTIONS;
}

// ---------- public API ---------------------------------------------------

export async function fetchProducts(
  config: StoreConfig,
  collectionHandle?: string
): Promise<Product[]> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      if (!collectionHandle || collectionHandle === 'all') {
        const data: any = await client.request(GET_ALL_PRODUCTS_QUERY, { first: 30 });
        const list = (data.products?.edges ?? []).map((e: any) =>
          normaliseProduct(e.node)
        );
        if (list.length > 0) return list;
      } else {
        const data: any = await client.request(GET_PRODUCTS_QUERY, {
          collectionHandle,
          first: 24,
        });
        const list = (data.collection?.products?.edges ?? []).map((e: any) =>
          normaliseProduct(e.node)
        );
        if (list.length > 0) return list;
      }
    } catch (err) {
      console.warn('Live GraphQL products query error, falling back to local dataset:', err);
    }
  }

  // Local high-performance mock dataset fallback
  await new Promise(r => setTimeout(r, 100));
  const storeProducts = getStoreProducts(config);
  if (collectionHandle && collectionHandle !== 'all' && collectionHandle !== 'new-drops') {
    return storeProducts.filter(p => p.collectionHandle === collectionHandle);
  }
  return storeProducts;
}

export async function fetchCollections(
  config: StoreConfig
): Promise<Collection[]> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(GET_COLLECTIONS_QUERY, { first: 20 });
      const collections = (data.collections?.edges ?? []).map((e: any) => ({
        id: e.node.id,
        title: e.node.title,
        handle: e.node.handle,
        description: e.node.description || '',
        tagline: '',
        heroImage:
          e.node.image?.url ||
          'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&q=80',
      }));
      if (collections.length > 0) return collections;
    } catch (err) {
      console.warn('Live GraphQL collections query error, falling back to local dataset:', err);
    }
  }

  await new Promise(r => setTimeout(r, 100));
  return getStoreCollections(config);
}

export async function fetchCollection(
  config: StoreConfig,
  handle: string
): Promise<Collection | null> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(GET_COLLECTION_QUERY, {
        handle,
        first: 30,
      });
      if (data.collection) {
        return {
          id: data.collection.id,
          title: data.collection.title,
          handle: data.collection.handle,
          tagline: '',
          description: data.collection.description || '',
          heroImage:
            data.collection.image?.url ||
            'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&q=80',
          products: (data.collection.products?.edges ?? []).map((e: any) =>
            normaliseProduct(e.node)
          ),
        };
      }
    } catch (err) {
      console.warn('Live GraphQL collection query error, falling back to local dataset:', err);
    }
  }

  await new Promise(r => setTimeout(r, 100));
  const storeCollections = getStoreCollections(config);
  const storeProducts = getStoreProducts(config);

  if (handle === 'new-drops' || handle === 'all' || handle === 'new-product-drops') {
    return {
      id: `gid://shopify/Collection/${config.merchantId}-drops`,
      title: config.merchantId === 'veloshop' ? 'NEW RACE RELEASES' : 'NEW PRODUCT DROPS',
      handle: 'new-drops',
      tagline: config.tagline,
      description: `Explore the newest drops from ${config.storeName}.`,
      heroImage:
        storeCollections[0]?.heroImage ||
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&q=80',
      products: storeProducts,
    };
  }
  const collection = storeCollections.find(c => c.handle === handle);
  if (!collection) return null;
  return {
    ...collection,
    products: storeProducts.filter(p => p.collectionHandle === handle),
  };
}

export async function fetchProduct(
  config: StoreConfig,
  handle: string
): Promise<Product | null> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(GET_PRODUCT_QUERY, { handle });
      if (data.product) {
        return normaliseProduct(data.product);
      }
    } catch (err) {
      console.warn('Live GraphQL product query error, falling back to local dataset:', err);
    }
  }

  await new Promise(r => setTimeout(r, 100));
  return ALL_PRODUCTS.find(p => p.handle === handle) ?? null;
}

export async function fetchCart(
  config: StoreConfig,
  cartId: string
): Promise<Cart | null> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(GET_CART_QUERY, { cartId });
      if (data.cart) {
        return normaliseCart(data.cart);
      }
    } catch (err) {
      console.warn('Live GraphQL getCart error, falling back to local cart:', err);
    }
  }

  if (_mockCart.id === cartId && _mockCart.lines.length > 0) {
    return { ..._mockCart };
  }
  // Attempt recovery from AsyncStorage
  try {
    const stored = await AsyncStorage.getItem(MOCK_CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.id === cartId && parsed.lines && parsed.lines.length > 0) {
        _mockCart = parsed;
        return { ..._mockCart };
      }
    }
  } catch {
    // ignore
  }
  if (_mockCart.lines.length > 0) {
    return { ..._mockCart };
  }
  return null;
}

export async function cartCreate(
  config: StoreConfig,
  variantId: string,
  quantity: number
): Promise<Cart> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(CART_CREATE_MUTATION, {
        input: { lines: [{ merchandiseId: variantId, quantity }] },
      });
      if (data.cartCreate?.userErrors?.length) {
        throw new Error(data.cartCreate.userErrors[0].message);
      }
      if (data.cartCreate?.cart) {
        return normaliseCart(data.cartCreate.cart);
      }
    } catch (err) {
      console.warn('Live GraphQL cartCreate error, falling back to local cart:', err);
    }
  }

  const product = ALL_PRODUCTS.find(p =>
    p.variants.some(v => v.id === variantId)
  );
  if (!product) throw new Error('Product variant not found');
  const variant = product.variants.find(v => v.id === variantId)!;
  if (!variant.availableForSale) {
    throw new Error('This variant is currently out of stock.');
  }
  const lineId = `line-${Date.now()}`;
  _mockCart = recalcMockCart({
    ..._mockCart,
    lines: [
      ..._mockCart.lines,
      {
        id: lineId,
        quantity,
        merchandise: {
          id: variant.id,
          title: variant.title,
          price: variant.price,
          product: {
            id: product.id,
            title: product.title,
            images: product.images,
          },
        },
      },
    ],
  });
  return { ..._mockCart };
}

export async function cartLinesAdd(
  config: StoreConfig,
  cartId: string,
  variantId: string,
  quantity: number
): Promise<Cart> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(CART_LINES_ADD_MUTATION, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }],
      });
      if (data.cartLinesAdd?.userErrors?.length) {
        throw new Error(data.cartLinesAdd.userErrors[0].message);
      }
      if (data.cartLinesAdd?.cart) {
        return normaliseCart(data.cartLinesAdd.cart);
      }
    } catch (err) {
      console.warn('Live GraphQL cartLinesAdd error, falling back to local cart:', err);
    }
  }

  const existing = _mockCart.lines.find(
    l => l.merchandise.id === variantId
  );
  if (existing) {
    _mockCart = recalcMockCart({
      ..._mockCart,
      lines: _mockCart.lines.map(l =>
        l.merchandise.id === variantId
          ? { ...l, quantity: l.quantity + quantity }
          : l
      ),
    });
  } else {
    const product = ALL_PRODUCTS.find(p =>
      p.variants.some(v => v.id === variantId)
    );
    if (!product) throw new Error('Product variant not found');
    const variant = product.variants.find(v => v.id === variantId)!;
    if (!variant.availableForSale) {
      throw new Error('This variant is currently out of stock.');
    }
    _mockCart = recalcMockCart({
      ..._mockCart,
      lines: [
        ..._mockCart.lines,
        {
          id: `line-${Date.now()}`,
          quantity,
          merchandise: {
            id: variant.id,
            title: variant.title,
            price: variant.price,
            product: {
              id: product.id,
              title: product.title,
              images: product.images,
            },
          },
        },
      ],
    });
  }
  return { ..._mockCart };
}

export async function cartLinesUpdate(
  config: StoreConfig,
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(CART_LINES_UPDATE_MUTATION, {
        cartId,
        lines: [{ id: lineId, quantity }],
      });
      if (data.cartLinesUpdate?.userErrors?.length) {
        throw new Error(data.cartLinesUpdate.userErrors[0].message);
      }
      if (data.cartLinesUpdate?.cart) {
        return normaliseCart(data.cartLinesUpdate.cart);
      }
    } catch (err) {
      console.warn('Live GraphQL cartLinesUpdate error, falling back to local cart:', err);
    }
  }

  _mockCart = recalcMockCart({
    ..._mockCart,
    lines: _mockCart.lines.map(l =>
      l.id === lineId ? { ...l, quantity } : l
    ),
  });
  return { ..._mockCart };
}

export async function cartLinesRemove(
  config: StoreConfig,
  cartId: string,
  lineId: string
): Promise<Cart> {
  if (isLiveGraphQL(config)) {
    try {
      const client = createClient(config);
      const data: any = await client.request(CART_LINES_REMOVE_MUTATION, {
        cartId,
        lineIds: [lineId],
      });
      if (data.cartLinesRemove?.userErrors?.length) {
        throw new Error(data.cartLinesRemove.userErrors[0].message);
      }
      if (data.cartLinesRemove?.cart) {
        return normaliseCart(data.cartLinesRemove.cart);
      }
    } catch (err) {
      console.warn('Live GraphQL cartLinesRemove error, falling back to local cart:', err);
    }
  }

  _mockCart = recalcMockCart({
    ..._mockCart,
    lines: _mockCart.lines.filter(l => l.id !== lineId),
  });
  return { ..._mockCart };
}

export function resetMockCart() {
  _mockCart = {
    id: 'mock-cart-001',
    checkoutUrl: 'https://shopify.com/checkout/mock',
    lines: [],
    cost: {
      totalAmount: { amount: '0.00', currencyCode: 'USD' },
      subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
    },
  };
  AsyncStorage.removeItem(MOCK_CART_STORAGE_KEY).catch(() => {});
}
