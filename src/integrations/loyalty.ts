import { StoreConfig } from '../config/types';

export interface LoyaltyPoints {
  balance: number;
  currency: string;
  nextReward: { pointsNeeded: number; rewardValue: string } | null;
}

export interface LoyaltyAdapter {
  isAvailable(): boolean;
  getPoints(customerId: string): Promise<LoyaltyPoints>;
}

export class UnavailableLoyaltyAdapter implements LoyaltyAdapter {
  isAvailable() { return false; }
  async getPoints(_customerId: string): Promise<LoyaltyPoints> {
    return { balance: 0, currency: 'GBP', nextReward: null };
  }
}

export class MockLoyaltyAdapter implements LoyaltyAdapter {
  isAvailable() { return true; }
  async getPoints(_customerId: string): Promise<LoyaltyPoints> {
    await new Promise(r => setTimeout(r, 300));
    return {
      balance: 1250,
      currency: 'GBP',
      nextReward: { pointsNeeded: 250, rewardValue: '£5 off' },
    };
  }
}

export function createLoyaltyAdapter(config: StoreConfig): LoyaltyAdapter {
  if (!config.features.loyalty) return new UnavailableLoyaltyAdapter();
  return new MockLoyaltyAdapter();
}

