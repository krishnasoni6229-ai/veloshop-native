import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';

export type ViewMode = 'grid' | 'single';

export interface ListingControlBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showFilter?: boolean;
  onFilterPress?: () => void;
  style?: ViewStyle;
}

// 4-Squares Grid Icon (2x2 grid representing 2 columns)
function GridViewIcon({ color = '#111111', size = 19 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="2" y="2.5" width="7" height="6.5" rx="1" fill={color} />
      <Rect x="11" y="2.5" width="7" height="6.5" rx="1" fill={color} />
      <Rect x="2" y="11" width="7" height="6.5" rx="1" fill={color} />
      <Rect x="11" y="11" width="7" height="6.5" rx="1" fill={color} />
    </Svg>
  );
}

// Single-Column Card View Icon (1 full-width card with image block + bottom info bar)
function SingleViewIcon({ color = '#111111', size = 19 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      {/* Top Image Block */}
      <Rect x="2" y="2.5" width="16" height="10.5" rx="1" fill={color} />
      {/* Bottom Info Line */}
      <Rect x="2" y="15" width="16" height="2.5" rx="0.8" fill={color} />
    </Svg>
  );
}

// Filter Icon (3 descending horizontal lines)
function FilterIcon({ color = '#111111', size = 16 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M2 3.5H14M4.2 8H11.8M6.5 12.5H9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export const ListingControlBar = React.memo(function ListingControlBar({
  viewMode,
  onViewModeChange,
  showFilter = true,
  onFilterPress,
  style,
}: ListingControlBarProps) {
  return (
    <View style={[styles.barContainer, style]}>
      {/* Left: View Mode Toggle (Grid vs Single) */}
      <View style={styles.toggleGroup}>
        {/* 4-Squares Grid Segment */}
        <TouchableOpacity
          onPress={() => onViewModeChange('grid')}
          activeOpacity={0.7}
          style={[
            styles.segmentBtn,
            viewMode === 'grid' ? styles.segmentActive : styles.segmentInactive,
          ]}
        >
          <GridViewIcon color={viewMode === 'grid' ? '#111111' : '#666666'} />
        </TouchableOpacity>

        {/* 1-Column Single Card Segment */}
        <TouchableOpacity
          onPress={() => onViewModeChange('single')}
          activeOpacity={0.7}
          style={[
            styles.segmentBtn,
            viewMode === 'single' ? styles.segmentActive : styles.segmentInactive,
          ]}
        >
          <SingleViewIcon color={viewMode === 'single' ? '#111111' : '#666666'} />
        </TouchableOpacity>
      </View>

      {/* Right: Filter Button (No filter functionality attached as requested) */}
      {showFilter ? (
        <TouchableOpacity
          onPress={onFilterPress}
          activeOpacity={0.8}
          style={styles.filterBtn}
        >
          <FilterIcon />
          <Text style={styles.filterText}>FILTER</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleGroup: {
    flex: 1,
    marginRight: 8,
    height: 48,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  segmentInactive: {
    backgroundColor: 'transparent',
  },
  filterBtn: {
    flex: 1,
    marginLeft: 8,
    height: 48,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  filterText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: 0.8,
  },
});
