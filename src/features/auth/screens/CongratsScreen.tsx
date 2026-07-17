import * as React from 'react';
import {View, Pressable, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const CORAL = '#D96B45';

export function CongratsScreen() {
  const insets = useSafeAreaInsets();
  const completeCongrats = useAppStore((state) => state.completeCongrats);

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: Math.max(insets.bottom, 20) + 16,
        },
      ]}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="thumbs-up" size={56} color={CORAL} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>
          Your account has been successfully created. You can can and receive
          money !
        </Text>
      </View>

      <Pressable onPress={completeCongrats} style={styles.ctaButton}>
        <Text style={styles.ctaText}>Start</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    fontFamily: getSystemFont(),
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  ctaButton: {
    backgroundColor: CORAL,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
