import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../../src/context/StoreContext';
import { fetchCollection, fetchProducts } from '../../../src/api/shopifyClient';
import {
  RECOMMENDED_PRODUCTS,
  RECENTLY_VIEWED_PRODUCTS,
} from '../../../src/api/sampleData';
import { ProductCatalogView } from '../../../src/components/ProductCatalogView';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { ErrorView } from '../../../src/components/ErrorView';

export default function CollectionScreen() {
  const { handle } = useLocalSearchParams<{ handle: string }>();
  const config = useStore();

  const {
    data: collection,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['collection', config.merchantId, handle],
    queryFn: () => fetchCollection(config, handle || 'softsense'),
    enabled: !!handle,
  });

  const { data: allProducts } = useQuery({
    queryKey: ['products', config.merchantId],
    queryFn: () => fetchProducts(config),
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !collection) {
    return <ErrorView message="Could not find collection." onRetry={refetch} />;
  }

  // Recommended products: products from other collections or top picks
  const otherProducts = (allProducts || []).filter(
    p => p.collectionHandle !== collection.handle
  );
  const recommendedProducts =
    otherProducts.length > 0
      ? otherProducts.slice(0, 5)
      : allProducts && allProducts.length > 0
      ? allProducts.slice(0, 5)
      : RECOMMENDED_PRODUCTS;

  // Recently viewed: sample recently viewed or popular items
  const recentlyViewedCandidates = (allProducts || []).filter(
    p => !recommendedProducts.some(r => r.id === p.id)
  );
  const recentlyViewedProducts =
    recentlyViewedCandidates.length > 0
      ? recentlyViewedCandidates.slice(0, 4)
      : RECENTLY_VIEWED_PRODUCTS;

  return (
    <ProductCatalogView
      title={collection.title}
      products={collection.products}
      recommendedProducts={recommendedProducts}
      recentlyViewedProducts={recentlyViewedProducts}
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
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/(shop)');
        }
      }}
      refreshing={isLoading}
      onRefresh={refetch}
    />
  );
}
