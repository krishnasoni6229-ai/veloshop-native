import { Review } from '../api/types';
import { StoreConfig } from '../config/types';

// ─── Adapter interface ────────────────────────────────────────────────────────

export interface ReviewsAdapter {
  /** Returns true when the integration is fully configured */
  isAvailable(): boolean;
  /** Fetch reviews for a given Shopify product ID (GID) */
  getReviews(productId: string): Promise<Review[]>;
}

// ─── Mock / fallback adapter ──────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Jordan M.',
    rating: 5,
    title: 'Best quality I\'ve owned',
    body: 'Absolutely love this. Fits perfectly and the fabric feels premium. Will definitely be ordering more.',
    createdAt: '2024-09-12T10:30:00Z',
    verified: true,
  },
  {
    id: 'r2',
    author: 'Sam T.',
    rating: 4,
    title: 'Great but runs slightly large',
    body: 'Really happy with the purchase overall. The material is top-notch. Size down if you\'re between sizes.',
    createdAt: '2024-08-29T14:15:00Z',
    verified: true,
  },
  {
    id: 'r3',
    author: 'Alex R.',
    rating: 5,
    title: 'Gymshark never misses',
    body: 'Ordered three of these after my first one. The quality is consistent and delivery was fast.',
    createdAt: '2024-07-03T09:00:00Z',
    verified: false,
  },
];

export class MockReviewsAdapter implements ReviewsAdapter {
  isAvailable() {
    return true; // always available — shows mock data
  }
  async getReviews(_productId: string): Promise<Review[]> {
    await new Promise(r => setTimeout(r, 400)); // simulate network
    return MOCK_REVIEWS;
  }
}

// ─── Yotpo adapter (production) ──────────────────────────────────────────────

export class YotpoReviewsAdapter implements ReviewsAdapter {
  private readonly appKey: string;

  constructor(appKey: string) {
    this.appKey = appKey;
  }

  isAvailable() {
    return Boolean(this.appKey);
  }

  async getReviews(productId: string): Promise<Review[]> {
    // Docs: https://developers.yotpo.com/docs/retrieve-reviews
    const numericId = productId.split('/').pop();
    const url = `https://api.yotpo.com/v1/widget/${this.appKey}/products/${numericId}/reviews.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Yotpo ${res.status}`);
    const data = await res.json();
    return (data.response?.reviews ?? []).map((r: any) => ({
      id: String(r.id),
      author: r.user?.display_name ?? 'Anonymous',
      rating: r.score,
      title: r.title,
      body: r.content,
      createdAt: r.created_at,
      verified: r.verified_buyer,
    }));
  }
}

// ─── Unavailable adapter ──────────────────────────────────────────────────────

export class UnavailableReviewsAdapter implements ReviewsAdapter {
  isAvailable() {
    return false;
  }
  async getReviews(_productId: string): Promise<Review[]> {
    return [];
  }
}

// ─── Factory ──────────────────────────────────────────────────────────────────

const YOTPO_APP_KEY = process.env.EXPO_PUBLIC_YOTPO_APP_KEY ?? '';

export function createReviewsAdapter(config: StoreConfig): ReviewsAdapter {
  if (!config.features.reviews) {
    return new UnavailableReviewsAdapter();
  }
  if (YOTPO_APP_KEY) {
    return new YotpoReviewsAdapter(YOTPO_APP_KEY);
  }
  // Feature enabled but no live key → show mock data (dev / demo)
  return new MockReviewsAdapter();
}

