export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductImage {
  url: string | any;
  altText: string | null;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: SelectedOption[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: Money;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  rating?: number;
  tag?: string;
  fit?: string;
  color?: string;
  collectionHandle?: string;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  tagline?: string;
  description: string;
  heroImage: string;
  products: Product[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: Money;
    product: {
      id: string;
      title: string;
      images: ProductImage[];
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
  };
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
}

