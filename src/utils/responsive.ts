import { Dimensions, PixelRatio } from 'react-native';

const GUIDELINE_BASE_WIDTH = 375;
const GUIDELINE_BASE_HEIGHT = 812;

/**
 * Returns current window dimensions via Dimensions API (no hooks)
 */
export const getWindowDimensions = () => Dimensions.get('window');

/**
 * Returns current window width
 */
export const getWindowWidth = (): number => Dimensions.get('window').width;

/**
 * Returns current window height
 */
export const getWindowHeight = (): number => Dimensions.get('window').height;

/**
 * Convert width percentage to dp
 * @param percentage number from 0 to 100
 */
export const wp = (percentage: number): number => {
  const { width } = Dimensions.get('window');
  return PixelRatio.roundToNearestPixel((width * percentage) / 100);
};

/**
 * Convert height percentage to dp
 * @param percentage number from 0 to 100
 */
export const hp = (percentage: number): number => {
  const { height } = Dimensions.get('window');
  return PixelRatio.roundToNearestPixel((height * percentage) / 100);
};

/**
 * Horizontal scaling based on standard guideline width (375)
 */
export const scale = (size: number): number => {
  const { width } = Dimensions.get('window');
  return PixelRatio.roundToNearestPixel((width / GUIDELINE_BASE_WIDTH) * size);
};

/**
 * Vertical scaling based on standard guideline height (812)
 */
export const verticalScale = (size: number): number => {
  const { height } = Dimensions.get('window');
  return PixelRatio.roundToNearestPixel((height / GUIDELINE_BASE_HEIGHT) * size);
};

/**
 * Moderate scaling for font sizes and spacing so they don't over-scale on large screens
 */
export const moderateScale = (size: number, factor = 0.5): number => {
  return PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);
};

/**
 * Checks whether current screen width qualifies as a tablet (>= 768px)
 */
export const isTablet = (): boolean => {
  return Dimensions.get('window').width >= 768;
};

/**
 * Checks whether current screen is a compact device (< 375px)
 */
export const isSmallDevice = (): boolean => {
  return Dimensions.get('window').width < 375;
};

/**
 * Returns responsive column count for grid layouts (FlatList)
 */
export const getGridColumns = (
  phoneColumns = 2,
  tabletColumns = 3,
  desktopColumns = 4
): number => {
  const { width } = Dimensions.get('window');
  if (width >= 1024) return desktopColumns;
  if (width >= 768) return tabletColumns;
  return phoneColumns;
};

/**
 * Responsive object with live getters via Dimensions API
 */
export const responsive = {
  get width(): number {
    return Dimensions.get('window').width;
  },
  get height(): number {
    return Dimensions.get('window').height;
  },
  get isTablet(): boolean {
    return Dimensions.get('window').width >= 768;
  },
  get isSmallDevice(): boolean {
    return Dimensions.get('window').width < 375;
  },
  wp,
  hp,
  scale,
  verticalScale,
  moderateScale,
  getGridColumns,
};

export default responsive;

