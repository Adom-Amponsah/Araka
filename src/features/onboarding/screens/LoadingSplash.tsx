import * as React from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParamList} from '../navigation/OnboardingNavigator';
import BootSplash from 'react-native-bootsplash';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

type NavigationProp = StackNavigationProp<OnboardingStackParamList>;

interface LoadingSplashProps {
  onFinish?: () => void;
  standalone?: boolean;
}

export function LoadingSplash({onFinish, standalone = false}: LoadingSplashProps) {
  console.log('[LoadingSplash] Component mounting... standalone:', standalone);
  const navigation = standalone ? null : useNavigation<NavigationProp>();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const hasHiddenSplash = React.useRef(false);

  // Hide splash only after component is fully laid out and ready
  const handleLayout = React.useCallback(() => {
    if (!hasHiddenSplash.current) {
      console.log('[LoadingSplash] Component laid out - hiding BootSplash now');
      hasHiddenSplash.current = true;
      try {
        BootSplash.hide({fade: true});
        console.log('[LoadingSplash] BootSplash.hide() called successfully');
      } catch (error) {
        console.error('[LoadingSplash] Error hiding BootSplash:', error);
      }
    }
  }, []);

  React.useEffect(() => {
    console.log('[LoadingSplash] useEffect running - starting animations');

    // Fade in and scale up on mount
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    scale.value = withSequence(
      // Initial scale up
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }),
      // Breathing animation
      withDelay(
        200,
        withRepeat(
          withSequence(
            withTiming(1.05, {
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, {
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          false
        )
      )
    );

    // Navigate or call onFinish after 2.5 seconds
    const timer = setTimeout(() => {
      console.log('[LoadingSplash] Animation complete');
      if (standalone && onFinish) {
        console.log('[LoadingSplash] Standalone mode - calling onFinish');
        onFinish();
      } else if (navigation) {
        console.log('[LoadingSplash] Navigating to Onboarding screen');
        navigation.replace('Onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish, standalone, navigation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <LinearGradient
        colors={['#F27649', '#924225']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.gradient}
      />

      {/* Background overlay image */}
      <Image
        source={require('../../../assets/bg.png')}
        style={styles.backgroundImage}
      />

      {/* Animated Logo */}
      <View style={styles.logoContainer}>
        <Animated.View style={animatedStyle}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F27649',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.4,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 240,
    height: 140,
    resizeMode: 'contain',
  },
});
