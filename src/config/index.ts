/**
 * Active merchant is selected via MERCHANT_ID environment variable.
 * In production this is injected by the EAS build profile.
 * Default: gymshark (for local dev).
 */
import { gymsharkConfig } from './gymshark';
import { veloshopConfig } from './veloshop';
import { StoreConfig } from './types';

const configs: Record<string, StoreConfig> = {
  gymshark: gymsharkConfig,
  veloshop: veloshopConfig,
};

const merchantId = process.env.EXPO_PUBLIC_MERCHANT_ID ?? 'gymshark';

export const storeConfig: StoreConfig = configs[merchantId] ?? gymsharkConfig;
export { StoreConfig };

