import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTheme, useStore } from '../context/StoreContext';
import { createLoyaltyAdapter } from '../integrations/loyalty';
import { LoadingSpinner } from './LoadingSpinner';

interface LoyaltySectionProps {
  compact?: boolean;
}

export function LoyaltySection({ compact = false }: LoyaltySectionProps) {
  const theme = useTheme();
  const config = useStore();

  const adapter = createLoyaltyAdapter(config);

  const { data: loyalty, isLoading } = useQuery({
    queryKey: ['loyalty', config.merchantId],
    queryFn: () => adapter.getPoints('cust-demo-001'),
    enabled: adapter.isAvailable(),
  });

  // Integration Unavailable State
  if (!adapter.isAvailable()) {
    if (compact) {
      return (
        <View style={[styles.unavailableBannerCompact, { borderRadius: theme.borderRadius }]}>
          <Text style={styles.unavailableIcon}>🔌</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.unavailableTitle}>Loyalty Rewards Disabled</Text>
            <Text style={styles.unavailableSubtext}>
              Smile.io integration is not active for {config.storeName}.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          LOYALTY & REWARDS
        </Text>
        <View style={[styles.unavailableBanner, { borderRadius: theme.borderRadius }]}>
          <Text style={styles.unavailableIcon}>🔌</Text>
          <Text style={styles.unavailableTitle}>Loyalty Program Unavailable</Text>
          <Text style={styles.unavailableText}>
            Rewards & tier points are not enabled in {config.storeName}&apos;s configuration.
          </Text>
          <Text style={styles.unavailableSubtext}>
            (Integration adapter: Smile.io — showing unavailable state)
          </Text>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const balance = loyalty?.balance ?? 1250;
  const nextReward = loyalty?.nextReward ?? { pointsNeeded: 250, rewardValue: '$5 off' };
  const totalTarget = balance + nextReward.pointsNeeded;
  const progressPercent = Math.min(Math.round((balance / totalTarget) * 100), 100);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
        LOYALTY & REWARDS
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.cardColor,
            borderRadius: theme.borderRadius,
            borderColor: theme.primaryColor,
          },
        ]}
      >
        {/* Tier Header */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.clubName, { color: theme.primaryColor }]}>
              {config.storeName.toUpperCase()} REWARDS CLUB
            </Text>
            <Text style={[styles.tierBadge, { color: theme.textColor }]}>
              ★ Gold Tier Member
            </Text>
          </View>
          <View style={[styles.pointsBadge, { backgroundColor: theme.primaryColor }]}>
            <Text style={[styles.pointsValue, { color: theme.secondaryColor }]}>
              {balance.toLocaleString()}
            </Text>
            <Text style={[styles.pointsLabel, { color: theme.secondaryColor }]}>
              POINTS
            </Text>
          </View>
        </View>

        {/* Progress Bar towards next reward */}
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={[styles.rewardTitle, { color: theme.textColor }]}>
              Next Reward: {nextReward.rewardValue}
            </Text>
            <Text style={styles.pointsNeeded}>
              {nextReward.pointsNeeded} pts left
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%`, backgroundColor: theme.primaryColor },
              ]}
            />
          </View>
        </View>

        {/* Member Perks */}
        <View style={styles.perksRow}>
          <Text style={[styles.perkItem, { color: theme.textColor }]}>
            ✓ 1 pt per $1 spent
          </Text>
          <Text style={[styles.perkItem, { color: theme.textColor }]}>
            ✓ Free priority shipping
          </Text>
          <Text style={[styles.perkItem, { color: theme.textColor }]}>
            ✓ Early drop access
          </Text>
        </View>

        {/* Integration Footer */}
        <Text style={styles.poweredBy}>
          ⚡ Powered by <Text style={{ fontWeight: '700' }}>Smile.io</Text> (mocked third-party integration)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  card: {
    padding: 16,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  clubName: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  tierBadge: {
    fontSize: 15,
    fontWeight: '700',
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  pointsLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rewardTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  pointsNeeded: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  perksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    marginBottom: 8,
  },
  perkItem: {
    fontSize: 11,
    opacity: 0.75,
    fontWeight: '500',
  },
  poweredBy: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
    marginTop: 4,
  },
  unavailableBanner: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderStyle: 'dashed',
  },
  unavailableBannerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  unavailableIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  unavailableTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 2,
  },
  unavailableText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
  unavailableSubtext: {
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
  },
});
