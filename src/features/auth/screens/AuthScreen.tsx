import * as React from 'react';
import {View, Image, Dimensions, Pressable, Platform, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {useAppStore} from '@shared/store/appStore';
import {getSystemFont} from '@styles/typography';

const {width} = Dimensions.get('window');

export function AuthScreen() {
  console.log('[AuthScreen] Rendering AuthScreen');
  const startSignup = useAppStore((state) => state.startSignup);
  const startLogin = useAppStore((state) => state.startLogin);
  const insets = useSafeAreaInsets();

  const handleGetStarted = React.useCallback(() => {
    console.log('[AuthScreen] Get Started button pressed - starting signup flow');
    startSignup();
  }, [startSignup]);

  const handleLogin = React.useCallback(() => {
    console.log('[AuthScreen] Login button pressed - starting login flow');
    startLogin();
  }, [startLogin]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F27649', '#924225']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={styles.gradient}
      />

      {/* Background overlay image */}
      <Image
        source={require('../../../assets/bg.png')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height: '100%',
          resizeMode: 'cover',
          opacity: 0.4,
        }}
      />

      {/* Content Container with Safe Area */}
      <View 
        style={[
          styles.contentContainer,
          {
            paddingTop: Math.max(insets.top, 60),
            paddingBottom: Math.max(insets.bottom, 24),
          }
        ]}>
        
        {/* Logo and Tagline */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={{
              width: 220,
              height: 130,
              resizeMode: 'contain',
              marginBottom: 32,
            }}
          />

          <View style={styles.taglineContainer}>
            {/* <Text className="text-white text-center text-2xl font-bold tracking-tight">
              All your services.
            </Text>
            <Text className="text-white text-center text-2xl font-bold tracking-tight">
              One wallet.
            </Text> */}
            <Text style={styles.taglineText}>
              Pay bills, buy airtime, and manage your finances seamlessly
            </Text>
          </View>
        </View>

        {/* Bottom CTA Section */}
        <View style={[styles.ctaContainer, {paddingBottom: Platform.OS === 'android' ? 16 : 0}]}>
          {/* Primary Button */}
          <Pressable
            onPress={handleGetStarted}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>
              Get Started
            </Text>
          </Pressable>

          {/* Secondary Action */}
          <Pressable
            onPress={handleLogin}
            style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Already have an account? Log In
            </Text>
          </Pressable>
        </View>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  taglineContainer: {
    alignItems: 'center',
    gap: 8,
  },
  taglineText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: getSystemFont(),
    marginTop: 12,
    maxWidth: 280,
    lineHeight: 20,
  },
  ctaContainer: {
    paddingHorizontal: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#F27649',
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    textAlign: 'center',
    fontSize: 18,
  },
  secondaryButton: {
    marginTop: 16,
    marginBottom: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: getSystemFont('medium'),
  },
});
