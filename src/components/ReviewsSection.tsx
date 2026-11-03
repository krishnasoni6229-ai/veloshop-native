import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme, useStore } from '../context/StoreContext';
import { LoadingSpinner } from './LoadingSpinner';
import { createReviewsAdapter } from '../integrations/reviews';
import { Review } from '../api/types';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <Text key={i} style={{ fontSize: 13, color: i <= rating ? '#F5A623' : '#DDD' }}>
          ★
        </Text>
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const theme = useTheme();
  const date = new Date(review.createdAt).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={[styles.reviewCard, { backgroundColor: theme.cardColor, borderRadius: theme.borderRadius }]}>
      <View style={styles.reviewHeader}>
        <StarRating rating={review.rating} />
        {review.verified && (
          <Text style={styles.verifiedBadge}>✓ Verified</Text>
        )}
      </View>
      <Text style={[styles.reviewTitle, { color: theme.textColor }]}>{review.title}</Text>
      <Text style={[styles.reviewBody, { color: theme.textColor }]}>{review.body}</Text>
      <View style={styles.reviewFooter}>
        <Text style={[styles.reviewAuthor, { color: theme.textColor }]}>{review.author}</Text>
        <Text style={[styles.reviewDate, { color: theme.textColor }]}>{date}</Text>
      </View>
    </View>
  );
}

interface ReviewsSectionProps {
  productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const theme = useTheme();
  const config = useStore();
  const [expanded, setExpanded] = useState(false);

  const adapter = createReviewsAdapter(config);

  const { data: reviews, isLoading, isError } = useQuery({
    queryKey: ['reviews', config.merchantId, productId],
    queryFn: () => adapter.getReviews(productId),
    enabled: adapter.isAvailable(),
    staleTime: 1000 * 60 * 10,
  });

  // Integration unavailable state
  if (!adapter.isAvailable()) {
    return (
      <View style={styles.unavailableContainer}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Reviews</Text>
        <View style={[styles.unavailableBanner, { borderRadius: theme.borderRadius }]}>
          <Text style={styles.unavailableIcon}>🔌</Text>
          <Text style={styles.unavailableText}>
            Reviews are not available for this store.
          </Text>
          <Text style={styles.unavailableSubtext}>
            (Powered by Yotpo — not installed on this merchant account)
          </Text>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Reviews</Text>
        <LoadingSpinner />
      </View>
    );
  }

  if (isError || !reviews?.length) {
    return (
      <View>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Reviews</Text>
        <Text style={[styles.noReviews, { color: theme.textColor }]}>
          No reviews yet. Be the first!
        </Text>
      </View>
    );
  }

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const displayed = expanded ? reviews : reviews.slice(0, 2);

  return (
    <View>
      {/* Header */}
      <View style={styles.reviewsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Reviews
        </Text>
        <View style={styles.ratingRow}>
          <StarRating rating={Math.round(avgRating)} />
          <Text style={[styles.avgText, { color: theme.textColor }]}>
            {avgRating.toFixed(1)} ({reviews.length})
          </Text>
        </View>
      </View>

      {/* Review cards */}
      {displayed.map(r => (
        <ReviewCard key={r.id} review={r} />
      ))}

      {/* Show more / less */}
      {reviews.length > 2 && (
        <TouchableOpacity
          onPress={() => setExpanded(e => !e)}
          style={styles.showMore}
        >
          <Text style={[styles.showMoreText, { color: theme.primaryColor }]}>
            {expanded ? 'Show less' : `Show all ${reviews.length} reviews`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Integration badge */}
      <Text style={styles.poweredBy}>
        Reviews powered by{' '}
        <Text style={styles.poweredByBrand}>Yotpo</Text>
        {' '}(demo data)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  reviewsHeader: { marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  stars: { flexDirection: 'row', gap: 2 },
  avgText: { fontSize: 13, opacity: 0.7 },
  reviewCard: {
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  verifiedBadge: { fontSize: 10, color: '#27AE60', fontWeight: '700' },
  reviewTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  reviewBody: { fontSize: 13, opacity: 0.75, lineHeight: 20, marginBottom: 10 },
  reviewFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewAuthor: { fontSize: 12, fontWeight: '600', opacity: 0.6 },
  reviewDate: { fontSize: 11, opacity: 0.4 },
  showMore: { paddingVertical: 12, alignItems: 'center' },
  showMoreText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3 },
  poweredBy: { textAlign: 'center', fontSize: 10, color: '#AAA', marginTop: 4, marginBottom: 8 },
  poweredByBrand: { fontWeight: '700', color: '#F5A623' },
  noReviews: { fontSize: 14, opacity: 0.5, marginBottom: 20 },
  unavailableContainer: { marginBottom: 20 },
  unavailableBanner: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  unavailableIcon: { fontSize: 28, marginBottom: 8 },
  unavailableText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 4 },
  unavailableSubtext: { fontSize: 11, color: '#AAA', textAlign: 'center' },
});

