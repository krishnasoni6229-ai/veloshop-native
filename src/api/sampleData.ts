/**
 * Sample product and collection data — mirrors Shopify Storefront API v2025-01.
 * High-definition Gymshark athletic apparel + Veloshop cycling apparel.
 *
 * NOTE: All items use Shopify Global IDs (gid://shopify/...) and match the
 * exact JSON shape returned by Storefront API queries.
 */
import { Product, Collection } from './types';

// ============================================================================
// 1. GYMSHARK ATHLETIC SAMPLE PRODUCTS
// ============================================================================
export const SAMPLE_PRODUCTS: Product[] = [
  // --- SOFTSENSE COLLECTION ---
  {
    id: 'gid://shopify/Product/softsense-1',
    title: 'SoftSense™ Mid-Rise Leggings',
    handle: 'softsense-mid-rise-leggings',
    rating: 5.0,
    tag: 'Made for the studio',
    fit: 'Regular',
    color: 'Soft Brown',
    collectionHandle: 'softsense',
    description:
      'Ultra-soft, weightless feel with studio-ready flexibility. Designed with a buttery-soft brushed fabric, a non-restrictive mid-rise waistband, and gentle support that moves with your body.',
    priceRange: {
      minVariantPrice: { amount: '70.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/release-softsense.jpg'),
        altText: 'SoftSense Mid-Rise Leggings - Front View',
      },
      {
        url: require('../../assets/taylor-daugherty-h1jFtAgDJbI-unsplash.jpg'),
        altText: 'SoftSense Mid-Rise Leggings - Full Length View',
      },
      {
        url: require('../../assets/release-adapt.jpg'),
        altText: 'SoftSense Mid-Rise Leggings - Angle View',
      },
      {
        url: require('../../assets/release-everyday.jpg'),
        altText: 'SoftSense Mid-Rise Leggings - Studio View',
      },
    ],
    variants: [
      // Soft Brown - Mid Rise (XXS and XXL are intentionally OUT OF STOCK to test unavailable state)
      ...['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({
        id: `gid://shopify/ProductVariant/ss1-sb-mid-${size.toLowerCase()}`,
        title: `${size} / Soft Brown / Mid`,
        availableForSale: size !== 'XXS' && size !== 'XXL', // XXS and XXL sold out
        price: { amount: '70.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: size },
          { name: 'Colour', value: 'Soft Brown' },
          { name: 'Rise', value: 'Mid' },
        ],
      })),
      // Soft Brown - High Rise (XL is sold out)
      ...['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({
        id: `gid://shopify/ProductVariant/ss1-sb-high-${size.toLowerCase()}`,
        title: `${size} / Soft Brown / High`,
        availableForSale: size !== 'XL',
        price: { amount: '74.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: size },
          { name: 'Colour', value: 'Soft Brown' },
          { name: 'Rise', value: 'High' },
        ],
      })),
      // Burgundy (XS is sold out)
      ...['XS', 'S', 'M', 'L'].map(size => ({
        id: `gid://shopify/ProductVariant/ss1-bur-${size.toLowerCase()}`,
        title: `${size} / Burgundy / Mid`,
        availableForSale: size !== 'XS',
        price: { amount: '70.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: size },
          { name: 'Colour', value: 'Burgundy' },
          { name: 'Rise', value: 'Mid' },
        ],
      })),
      // Slate Blue
      ...['XS', 'S', 'M', 'L'].map(size => ({
        id: `gid://shopify/ProductVariant/ss1-sb-${size.toLowerCase()}`,
        title: `${size} / Slate Blue / Mid`,
        availableForSale: true,
        price: { amount: '70.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: size },
          { name: 'Colour', value: 'Slate Blue' },
          { name: 'Rise', value: 'Mid' },
        ],
      })),
      // Black (XXL is sold out)
      ...['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({
        id: `gid://shopify/ProductVariant/ss1-blk-${size.toLowerCase()}`,
        title: `${size} / Black / Mid`,
        availableForSale: size !== 'XXL',
        price: { amount: '70.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: size },
          { name: 'Colour', value: 'Black' },
          { name: 'Rise', value: 'Mid' },
        ],
      })),
    ],
  },
  {
    id: 'gid://shopify/Product/softsense-2',
    title: 'SoftSense™ High-Rise Leggings',
    handle: 'softsense-high-rise-leggings',
    rating: 5.0,
    tag: 'made for the studio',
    fit: 'Regular',
    color: 'Soft Brown',
    collectionHandle: 'softsense',
    description:
      'Engineered for mindful movement and studio sessions. High-waisted coverage that never slips or pinches, crafted from four-way stretch SoftSense fabric.',
    priceRange: {
      minVariantPrice: { amount: '74.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/release-adapt.jpg'),
        altText: 'SoftSense High-Rise Leggings',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/ss2-s',
        title: 'S / Soft Brown',
        availableForSale: true,
        price: { amount: '74.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Colour', value: 'Soft Brown' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/ss2-m',
        title: 'M / Soft Brown',
        availableForSale: true,
        price: { amount: '74.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Colour', value: 'Soft Brown' },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Product/softsense-3',
    title: 'SoftSense™ Cropped Tank',
    handle: 'softsense-cropped-tank',
    rating: 4.9,
    tag: 'made for the studio',
    fit: 'Regular',
    color: 'Soft Brown',
    collectionHandle: 'softsense',
    description:
      'Minimalist cropped silhouette designed to pair flawlessly with high-rise bottoms. Lightweight, breathable, and sensationally smooth against your skin.',
    priceRange: {
      minVariantPrice: { amount: '48.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/taylor-daugherty-h1jFtAgDJbI-unsplash.jpg'),
        altText: 'SoftSense Cropped Tank',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/ss3-s',
        title: 'S / Soft Brown',
        availableForSale: true,
        price: { amount: '48.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Colour', value: 'Soft Brown' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/ss3-m',
        title: 'M / Soft Brown',
        availableForSale: true,
        price: { amount: '48.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Colour', value: 'Soft Brown' },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Product/softsense-4',
    title: 'SoftSense™ Bralette',
    handle: 'softsense-bralette',
    rating: 4.8,
    tag: 'made for the studio',
    fit: 'Regular',
    color: 'Soft Brown',
    collectionHandle: 'softsense',
    description:
      'Light support bralette with delicate strappy back detailing. Cloud-like softness that allows unhindered breathing and mobility.',
    priceRange: {
      minVariantPrice: { amount: '42.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/andre-tan-PNWQqed8J0s-unsplash.jpg'),
        altText: 'SoftSense Bralette',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/ss4-s',
        title: 'S / Soft Brown',
        availableForSale: true,
        price: { amount: '42.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Colour', value: 'Soft Brown' },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Product/softsense-5',
    title: 'SoftSense™ Flare Pants',
    handle: 'softsense-flare-pants',
    rating: 5.0,
    tag: 'made for the studio',
    fit: 'Regular',
    color: 'Espresso Brown',
    collectionHandle: 'softsense',
    description:
      'Elevate your studio flow with an elegant flare leg silhouette. Super soft waist and draping stretch fabric for unmatched versatility.',
    priceRange: {
      minVariantPrice: { amount: '78.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/release-softsense.jpg'),
        altText: 'SoftSense Flare Pants',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/ss5-s',
        title: 'S / Espresso Brown',
        availableForSale: true,
        price: { amount: '78.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Colour', value: 'Espresso Brown' },
        ],
      },
    ],
  },

  // --- VENGEANCE COLLECTION ---
  {
    id: 'gid://shopify/Product/vengeance-1',
    title: 'Vengeance Oversized T-Shirt',
    handle: 'vengeance-oversized-t-shirt',
    rating: 5.0,
    tag: 'Heavy cotton',
    fit: 'Oversized Fit',
    color: 'Washed Black',
    collectionHandle: 'vengeance',
    description:
      'Heavy cotton. Physique-maximising fits. Imposing presence. Crafted with 300gsm heavyweight brushed cotton, dropped shoulders, and a raw vintage wash built to dominate the gym floor.',
    priceRange: {
      minVariantPrice: { amount: '48.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/nate-johnston-WEfD8q8oz7U-unsplash.jpg'),
        altText: 'Vengeance Oversized T-Shirt',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/v1-s',
        title: 'S / Washed Black',
        availableForSale: true,
        price: { amount: '48.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Colour', value: 'Washed Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/v1-m',
        title: 'M / Washed Black',
        availableForSale: true,
        price: { amount: '48.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Colour', value: 'Washed Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/v1-l',
        title: 'L / Washed Black',
        availableForSale: true,
        price: { amount: '48.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Colour', value: 'Washed Black' },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Product/vengeance-2',
    title: 'Vengeance Heavyweight Hoodie',
    handle: 'vengeance-heavyweight-hoodie',
    rating: 5.0,
    tag: 'Heavy cotton',
    fit: 'Imposing Fit',
    color: 'Pitch Black',
    collectionHandle: 'vengeance',
    description:
      'Substantial 460gsm organic fleece hoodie with double-layer hood and structured ribbed trim. An uncompromising outer layer for lifters.',
    priceRange: {
      minVariantPrice: { amount: '80.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/ambitious-studio-rick-barrett-lPfKACLdX2c-unsplash.jpg'),
        altText: 'Vengeance Heavyweight Hoodie',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/v2-m',
        title: 'M / Pitch Black',
        availableForSale: true,
        price: { amount: '80.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Colour', value: 'Pitch Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/v2-l',
        title: 'L / Pitch Black',
        availableForSale: true,
        price: { amount: '80.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Colour', value: 'Pitch Black' },
        ],
      },
    ],
  },

  // --- POWER & LIFTING ---
  {
    id: 'gid://shopify/Product/power-1',
    title: 'Power Stringer',
    handle: 'power-stringer',
    rating: 4.9,
    tag: 'Built to lift',
    fit: 'Stringer Cut',
    color: 'Black',
    collectionHandle: 'power',
    description:
      'Engineered for maximum output and endurance. Classic Y-back stringer with thin shoulder straps and a curved hem designed for heavy lifts.',
    priceRange: {
      minVariantPrice: { amount: '36.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/hero-power-lifting.jpg'),
        altText: 'Power Stringer training',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/p1-m',
        title: 'M / Black',
        availableForSale: true,
        price: { amount: '36.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Colour', value: 'Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/p1-l',
        title: 'L / Black',
        availableForSale: true,
        price: { amount: '36.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Colour', value: 'Black' },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Product/power-2',
    title: 'Power 5" Training Shorts',
    handle: 'power-5-shorts',
    rating: 4.9,
    tag: 'Built to lift',
    fit: '5" Inseam',
    color: 'Graphite Grey',
    collectionHandle: 'power',
    description:
      'Reinforced seams and four-way stretch fabric that resists knurling friction. 5-inch inseam leaves your quads free for deep squats.',
    priceRange: {
      minVariantPrice: { amount: '44.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: require('../../assets/sadiq-abdulmalik-1bbKOXBPzpI-unsplash.jpg'),
        altText: 'Power 5 Shorts',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/p2-l',
        title: 'L / Graphite Grey',
        availableForSale: true,
        price: { amount: '44.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Colour', value: 'Graphite Grey' },
        ],
      },
    ],
  },
];

export const SAMPLE_COLLECTIONS: Collection[] = [
  {
    id: 'gid://shopify/Collection/new-drops',
    title: 'NEW PRODUCT DROPS',
    handle: 'new-drops',
    tagline: 'Fresh arrivals and limited edition drops.',
    description:
      'Explore the newest athletic performance wear and studio essentials.',
    heroImage:
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&q=80',
    products: SAMPLE_PRODUCTS,
  },
  {
    id: 'gid://shopify/Collection/vengeance',
    title: 'VENGEANCE',
    handle: 'vengeance',
    tagline: 'Heavy cotton. Physique-maximising fits. Imposing presence.',
    description:
      'Crafted with ultra-dense heavy cotton and sculpted cuts. Engineered for high-intensity lifting and unmistakable presence on the gym floor.',
    heroImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80',
    products: SAMPLE_PRODUCTS.filter(p => p.collectionHandle === 'vengeance'),
  },
  {
    id: 'gid://shopify/Collection/power',
    title: 'POWER & LIFTING',
    handle: 'power',
    tagline: 'Engineered for maximum output. Heavy duty performance.',
    description:
      'Built for relentless PRs and bar-bending sessions. Durable textiles that withstand heavy knurling, deep squats, and maximum output.',
    heroImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80',
    products: SAMPLE_PRODUCTS.filter(p => p.collectionHandle === 'power'),
  },
  {
    id: 'gid://shopify/Collection/softsense',
    title: 'SOFTSENSE™',
    handle: 'softsense',
    tagline: 'Made for the studio. Sensationally soft weightless touch.',
    description:
      'Feel nothing but flow. Premium buttery soft fabric with high-stretch recovery, brushed finish, and sculpting comfort for all studio disciplines.',
    heroImage: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1200&q=80',
    products: SAMPLE_PRODUCTS.filter(p => p.collectionHandle === 'softsense'),
  },
];

// ============================================================================
// 2. VELOSHOP CYCLING SAMPLE PRODUCTS (Fictional Store 2)
// Demonstrates identical data layer reuse with zero screen code changes.
// ============================================================================
export const VELOSHOP_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/velo-1',
    title: 'Aero Pro Speed Jersey',
    handle: 'aero-pro-speed-jersey',
    rating: 4.9,
    tag: 'Wind tunnel tested',
    fit: 'Race Aero Cut',
    color: 'Cobalt Blue',
    collectionHandle: 'aero',
    description:
      'Engineered for maximum velocity and thermal regulation. Micro-perforated Italian front panels reduce aerodynamic drag by 4.2 watts at 45km/h.',
    priceRange: {
      minVariantPrice: { amount: '110.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1000&q=80',
        altText: 'Aero Pro Speed Jersey - Race Cut',
      },
      {
        url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1000&q=80',
        altText: 'Aero Pro Speed Jersey - Detail',
      },
    ],
    variants: [
      // Size XXL is intentionally out of stock for testing unavailable variant
      ...['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({
        id: `gid://shopify/ProductVariant/velo-1-cb-${size.toLowerCase()}`,
        title: `${size} / Cobalt Blue / Race`,
        availableForSale: size !== 'XXL',
        price: { amount: '110.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: size },
          { name: 'Colour', value: 'Cobalt Blue' },
          { name: 'Rise', value: 'Race' },
        ],
      })),
      ...['S', 'M', 'L'].map(size => ({
        id: `gid://shopify/ProductVariant/velo-1-or-${size.toLowerCase()}`,
        title: `${size} / Signal Orange / Race`,
        availableForSale: true,
        price: { amount: '110.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: size },
          { name: 'Colour', value: 'Signal Orange' },
          { name: 'Rise', value: 'Race' },
        ],
      })),
    ],
  },
  {
    id: 'gid://shopify/Product/velo-2',
    title: 'Endurance Bib Shorts II',
    handle: 'endurance-bib-shorts',
    rating: 5.0,
    tag: '8-Hour Comfort',
    fit: 'Compression Fit',
    color: 'Midnight Black',
    collectionHandle: 'endurance',
    description:
      'Multi-density Elastic Interface® chamois delivers uncompromising comfort on 200km+ gravel and road rides. Seamless laser-cut bib straps eliminate shoulder pressure points.',
    priceRange: {
      minVariantPrice: { amount: '145.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1502744688674-c619d3864003?w=1000&q=80',
        altText: 'Endurance Bib Shorts',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/velo-2-s',
        title: 'S / Midnight Black',
        availableForSale: true,
        price: { amount: '145.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Colour', value: 'Midnight Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/velo-2-m',
        title: 'M / Midnight Black',
        availableForSale: true,
        price: { amount: '145.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Colour', value: 'Midnight Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/velo-2-l',
        title: 'L / Midnight Black',
        availableForSale: true,
        price: { amount: '145.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Colour', value: 'Midnight Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/velo-2-xl',
        title: 'XL / Midnight Black',
        availableForSale: false, // Out of stock demo
        price: { amount: '145.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'XL' },
          { name: 'Colour', value: 'Midnight Black' },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Product/velo-3',
    title: 'Windblock Thermal Gilet',
    handle: 'windblock-thermal-gilet',
    rating: 4.8,
    tag: 'Packable Protection',
    fit: 'Slim Fit',
    color: 'Signal Orange',
    collectionHandle: 'aero',
    description:
      'Featherlight 78g windproof membrane that packs into your jersey pocket. Dual two-way zipper allows effortless access to jersey pockets mid-descent.',
    priceRange: {
      minVariantPrice: { amount: '85.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&q=80',
        altText: 'Windblock Thermal Gilet',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/velo-3-m',
        title: 'M / Signal Orange',
        availableForSale: true,
        price: { amount: '85.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Colour', value: 'Signal Orange' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/velo-3-l',
        title: 'L / Signal Orange',
        availableForSale: true,
        price: { amount: '85.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Colour', value: 'Signal Orange' },
        ],
      },
    ],
  },
  {
    id: 'gid://shopify/Product/velo-4',
    title: 'Pro Carbon Road Shoes',
    handle: 'pro-carbon-road-shoes',
    rating: 5.0,
    tag: 'Stiffness Index 12',
    fit: 'Ergo Race Fit',
    color: 'Pure White',
    collectionHandle: 'endurance',
    description:
      'Unidirectional high-modulus carbon sole delivers direct wattage transfer to the pedals. Dual BOA® Li2 dials allow micro-adjustments on the fly.',
    priceRange: {
      minVariantPrice: { amount: '260.00', currencyCode: 'USD' },
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&q=80',
        altText: 'Pro Carbon Road Shoes',
      },
    ],
    variants: [
      {
        id: 'gid://shopify/ProductVariant/velo-4-42',
        title: '42 / Pure White',
        availableForSale: true,
        price: { amount: '260.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: '42' },
          { name: 'Colour', value: 'Pure White' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/velo-4-43',
        title: '43 / Pure White',
        availableForSale: true,
        price: { amount: '260.00', currencyCode: 'USD' },
        selectedOptions: [
          { name: 'Size', value: '43' },
          { name: 'Colour', value: 'Pure White' },
        ],
      },
    ],
  },
];

export const VELOSHOP_COLLECTIONS: Collection[] = [
  {
    id: 'gid://shopify/Collection/velo-drops',
    title: 'NEW RACE RELEASES',
    handle: 'new-drops',
    tagline: 'Engineered for speed, tested in the wind tunnel.',
    description: 'Precision aerodynamic cycling gear for modern cyclists.',
    heroImage:
      'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=1200&q=80',
    products: VELOSHOP_PRODUCTS,
  },
  {
    id: 'gid://shopify/Collection/velo-aero',
    title: 'AERO PERFORMANCE',
    handle: 'aero',
    tagline: 'Micro-drag fabrics for race-winning speed.',
    description: 'Developed alongside WorldTour riders for maximum wattage savings.',
    heroImage:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&q=80',
    products: VELOSHOP_PRODUCTS.filter(p => p.collectionHandle === 'aero'),
  },
  {
    id: 'gid://shopify/Collection/velo-endurance',
    title: 'ENDURANCE & GRAVEL',
    handle: 'endurance',
    tagline: 'Built for 200km+ epics across all surfaces.',
    description: 'Premium chamois engineering and abrasion-resistant fabrics.',
    heroImage:
      'https://images.unsplash.com/photo-1502744688674-c619d3864003?w=1200&q=80',
    products: VELOSHOP_PRODUCTS.filter(p => p.collectionHandle === 'endurance'),
  },
];

// Helper to look up any product across all stores
export const ALL_PRODUCTS = [...SAMPLE_PRODUCTS, ...VELOSHOP_PRODUCTS];

export const RECOMMENDED_PRODUCTS: Product[] = [
  SAMPLE_PRODUCTS[5], // Vengeance Oversized T-Shirt
  SAMPLE_PRODUCTS[7], // Power Stringer
  SAMPLE_PRODUCTS[2], // SoftSense Cropped Tank
  SAMPLE_PRODUCTS[8], // Power 5" Training Shorts
  SAMPLE_PRODUCTS[4], // SoftSense Flare Pants
];

export const RECENTLY_VIEWED_PRODUCTS: Product[] = [
  SAMPLE_PRODUCTS[0], // SoftSense Mid-Rise Leggings
  SAMPLE_PRODUCTS[6], // Vengeance Heavyweight Hoodie
  SAMPLE_PRODUCTS[1], // SoftSense High-Rise Leggings
  SAMPLE_PRODUCTS[3], // SoftSense Bralette
];
