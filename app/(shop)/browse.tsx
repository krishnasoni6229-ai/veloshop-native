import React from 'react';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../src/context/StoreContext';
import { fetchProducts } from '../../src/api/shopifyClient';
import { ProductCatalogView } from '../../src/components/ProductCatalogView';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { ErrorView } from '../../src/components/ErrorView';
import { SAMPLE_PRODUCTS, VELOSHOP_PRODUCTS } from '../../src/api/sampleData';

export default function ShopScreen() {
  const config = useStore();
  const isVelo = config.merchantId === 'veloshop';
  const defaultCatalog = isVelo ? VELOSHOP_PRODUCTS : SAMPLE_PRODUCTS;

  const {
    data: products = defaultCatalog,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['browse-products', config.merchantId],
    queryFn: () => fetchProducts(config),
    initialData: () => defaultCatalog,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading && (!products || products.length === 0)) return <LoadingSpinner fullScreen />;
  if (isError && (!products || products.length === 0)) {
    return <ErrorView message="Could not load shop catalog." onRetry={refetch} />;
  }

  return (
    <ProductCatalogView
      title={isVelo ? 'VELOSHOP COLLECTION' : 'GYMSHARK ALL DROPS'}
      products={products}
      recommendedProducts={products.slice(0, 4)}
      recentlyViewedProducts={products.slice(2, 6)}
      showBack={false}
      onProductPress={product =>
        router.push({
          pathname: '/(shop)/product/[handle]',
          params: { handle: product.handle },
        })
      }
      onReleasePress={release =>
        router.push({
          pathname: '/(shop)/collection/[handle]',
          params: { handle: release.handle || 'softsense' },
        })
      }
      refreshing={isLoading}
      onRefresh={refetch}
    />
  );
}
