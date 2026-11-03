import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface TabIconProps {
  color: string | ColorValue;
  focused: boolean;
  size?: number;
}

/**
 * 1. Home Tab Icon
 * Solid black house silhouette with rectangular door cutout
 */
export function HomeTabIcon({ color, focused, size = 24 }: TabIconProps) {
  if (focused) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 3.2L2.5 11.5H5.5V21H10V15H14V21H18.5V11.5H21.5L12 3.2Z"
          fill={color}
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.8L3.5 11.5H6V20.5H10.5V15.5H13.5V20.5H18V11.5H20.5L12 3.8Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 2. Search / Browse Tab Icon
 * Three horizontal lines with integrated magnifying glass at bottom right
 */
export function BrowseTabIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top line */}
      <Path
        d="M3.5 5.5H17.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Middle line */}
      <Path
        d="M3.5 11.5H9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Bottom line */}
      <Path
        d="M3.5 17.5H9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Magnifying glass circle */}
      <Circle
        cx="15"
        cy="14.5"
        r="3.2"
        stroke={color}
        strokeWidth="2"
      />
      {/* Magnifying glass handle */}
      <Path
        d="M17.5 17L20.5 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 3. Shopping Bag / Cart Tab Icon
 * Outline shopping bag with arched loop handle on top
 */
export function CartTabIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Bag body */}
      <Path
        d="M5.5 8.5H18.5V19.5C18.5 20.6 17.6 21.5 16.5 21.5H7.5C6.4 21.5 5.5 20.6 5.5 19.5V8.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arch handle */}
      <Path
        d="M8.5 8.5V6C8.5 4.07 10.07 2.5 12 2.5C13.93 2.5 15.5 4.07 15.5 6V8.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 4. Wishlist / Heart Tab Icon
 * Smooth outline heart
 */
export function WishlistTabIcon({ color, focused, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20.5C12 20.5 3.5 15.2 3.5 8.8C3.5 5.87 5.87 3.5 8.8 3.5C10.5 3.5 12 4.5 12 4.5C12 4.5 13.5 3.5 15.2 3.5C18.13 3.5 20.5 5.87 20.5 8.8C20.5 15.2 12 20.5 12 20.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={focused ? color : 'none'}
      />
    </Svg>
  );
}

/**
 * 5. More / Settings Tab Icon
 * Three horizontal dots
 */
export function MoreTabIcon({ color, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="5.5" cy="12" r="2.2" fill={color} />
      <Circle cx="12" cy="12" r="2.2" fill={color} />
      <Circle cx="18.5" cy="12" r="2.2" fill={color} />
    </Svg>
  );
}

/**
 * Account / Profile Tab Icon (matches Screenshots)
 * User avatar silhouette (head circle + shoulder arc)
 */
export function AccountTabIcon({ color, focused, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="3.8"
        stroke={color}
        strokeWidth="1.8"
        fill={focused ? color : 'none'}
      />
      <Path
        d="M4.5 20C4.5 16.5 7.8 14 12 14C16.2 14 19.5 16.5 19.5 20"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Shop / Search Tab Icon (matches Screenshots)
 * Clean magnifying glass
 */
export function ShopSearchTabIcon({ color, focused, size = 24 }: TabIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="11"
        cy="11"
        r="6.5"
        stroke={color}
        strokeWidth={focused ? '2.2' : '1.8'}
      />
      <Path
        d="M16 16L20.5 20.5"
        stroke={color}
        strokeWidth={focused ? '2.2' : '1.8'}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Dedicated Empty Cart Screen Icon
 * Clean shopping bag with sleek modern contours
 */
export function EmptyCartIcon({ color = '#000000', size = 52 }: { color?: string | ColorValue; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      {/* Arch handle */}
      <Path
        d="M18 19V13C18 8.58 21.58 5 26 5C30.42 5 34 8.58 34 13V19"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bag body */}
      <Path
        d="M11 19H41L38.2 44.5C38.05 45.85 36.9 47 35.5 47H16.5C15.1 47 13.95 45.85 13.8 44.5L11 19Z"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Subtle empty slash or dashed inner accent */}
      <Path
        d="M21 28H31"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={0.3}
      />
    </Svg>
  );
}

/**
 * Dedicated Empty Wishlist Screen Icon
 * Clean heart with smooth contours and radiant badge styling
 */
export function EmptyWishlistIcon({ color = '#000000', size = 52 }: { color?: string | ColorValue; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <Path
        d="M26 44.5C26 44.5 7.5 33 7.5 19C7.5 12.5 12.5 7.5 19 7.5C22.8 7.5 26 9.8 26 9.8C26 9.8 29.2 7.5 33 7.5C39.5 7.5 44.5 12.5 44.5 19C44.5 33 26 44.5 26 44.5Z"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gentle center pulse line for empty state */}
      <Path
        d="M26 18V28"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity={0.3}
      />
      <Circle
        cx="26"
        cy="33"
        r="1.8"
        fill={color}
        opacity={0.35}
      />
    </Svg>
  );
}
