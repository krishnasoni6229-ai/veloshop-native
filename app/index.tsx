import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore, useTheme } from '../src/context/StoreContext';
import {
  hp,
  moderateScale,
  isTablet as checkIsTablet,
  isSmallDevice as checkIsSmallDevice,
} from '../src/responsive';

// Animated values are stable module-level singletons — safe to use in render
const bgFadeAnim = new Animated.Value(0);
const bgScaleAnim = new Animated.Value(1.1);
const skipFadeAnim = new Animated.Value(0);
const headingFadeAnim = new Animated.Value(0);
const headingSlideAnim = new Animated.Value(30);
const subHeadingFadeAnim = new Animated.Value(0);
const subHeadingSlideAnim = new Animated.Value(30);
const ctaFadeAnim = new Animated.Value(0);
const ctaSlideAnim = new Animated.Value(20);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen() {
  const config = useStore();
  const theme = useTheme();

  // Responsive calculations using Dimensions API via responsive.ts (no hooks)
  const isTablet = checkIsTablet();
  const isSmall = checkIsSmallDevice();
  const headingFontSize = isTablet ? 28 : isSmall ? 18 : moderateScale(22);
  const subHeadingFontSize = isTablet ? 44 : isSmall ? 30 : moderateScale(36);
  const buttonPaddingVertical = hp(100) < 700 ? 14 : 18;

  useEffect(() => {
    bgFadeAnim.setValue(0);
    bgScaleAnim.setValue(1.1);
    skipFadeAnim.setValue(0);
    headingFadeAnim.setValue(0);
    headingSlideAnim.setValue(30);
    subHeadingFadeAnim.setValue(0);
    subHeadingSlideAnim.setValue(30);
    ctaFadeAnim.setValue(0);
    ctaSlideAnim.setValue(20);

    // Background fades in first
    Animated.timing(bgFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Ken Burns zoom
    Animated.timing(bgScaleAnim, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    }).start();

    // Skip button fades in after 400ms
    Animated.timing(skipFadeAnim, {
      toValue: 1,
      duration: 500,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // "THE BEST OF GYMSHARK" slides in after 800ms
    Animated.parallel([
      Animated.timing(headingFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(headingSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // "ALL IN ONE PLACE" slides in after 1200ms
    Animated.parallel([
      Animated.timing(subHeadingFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(subHeadingSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Buttons slide in after 1600ms
    Animated.parallel([
      Animated.timing(ctaFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 1600,
        useNativeDriver: true,
      }),
      Animated.timing(ctaSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 1600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function handleShop() {
    router.replace('/(shop)');
  }

  return (
    <View style={styles.container}>
      {/* Background Image with Ken Burns animation */}
      <Animated.View
        style={[
          styles.bgImageContainer,
          { opacity: bgFadeAnim, transform: [{ scale: bgScaleAnim }] },
        ]}
      >
        <Image
          source={require('../assets/Welcome_Bg_Image.jpg')}
          style={styles.bgImage}
          contentFit="cover"
          transition={300}
        />
      </Animated.View>

      {/* Dark overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={[styles.safeArea, { paddingHorizontal: isTablet ? 48 : 28 }]}>
        {/* Top Bar — Skip on the right */}
        <Animated.View style={[styles.topBar, { opacity: skipFadeAnim }]}>
          <View />
          <TouchableOpacity onPress={handleShop} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.skipText}>
              Skip
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Center — headline text vertically centered */}
        <View style={[styles.centerWrapper, isTablet && styles.tabletCentered]}>
          <Animated.View
            style={{
              opacity: headingFadeAnim,
              transform: [{ translateY: headingSlideAnim }],
            }}
          >
            <Text
              style={[
                styles.headlineLight,
                {
                  fontFamily: theme.fontFamily,
                  fontSize: headingFontSize,
                  lineHeight: headingFontSize * 1.4,
                },
              ]}
            >
              THE BEST OF {config.storeName.toUpperCase()}
            </Text>
          </Animated.View>
          <Animated.View
            style={{
              opacity: subHeadingFadeAnim,
              transform: [{ translateY: subHeadingSlideAnim }],
            }}
          >
            <Text
              style={[
                styles.headlineBold,
                {
                  fontFamily: theme.fontFamily,
                  fontSize: subHeadingFontSize,
                  lineHeight: subHeadingFontSize * 1.2,
                },
              ]}
            >
              ALL IN ONE PLACE
            </Text>
          </Animated.View>
        </View>

        {/* Bottom CTA */}
        <View style={[styles.bottomWrapper, isTablet && styles.tabletCentered]}>
          <Animated.View style={[styles.bottomSection, { opacity: ctaFadeAnim, transform: [{ translateY: ctaSlideAnim }] }]}>
            <TouchableOpacity
              onPress={handleShop}
              activeOpacity={0.8}
              style={[
                styles.createAccountButton,
                {
                  borderRadius: theme.borderRadius,
                  paddingVertical: buttonPaddingVertical,
                },
              ]}
            >
              <Text style={styles.createAccountText}>
                Create account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShop} activeOpacity={0.7}>
              <Text style={styles.loginText}>
                Log In
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bgImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.85,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  headlineLight: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headlineBold: {
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  tabletCentered: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  bottomWrapper: {
    width: '100%',
  },
  bottomSection: {
    paddingBottom: 24,
    gap: 16,
  },
  createAccountButton: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 16,
  },
  createAccountText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
