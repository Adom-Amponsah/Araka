import * as React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  StyleSheet,
  FlatList,
  ViewToken,
  Animated,
  Easing,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import {getSystemFont} from '@styles/typography';

const {width, height} = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  imageSource: any;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    tag: 'CONNECTIVITY',
    title: 'Buy\nAirtime.',
    subtitle: 'All networks, instantly.',
    description:
      'Top up airtime and data for all networks in seconds. Fast, secure, and zero hassle.',
    imageSource: require('../../../assets/images/onboarding1.jpg'),
  },
  {
    id: '2',
    tag: 'UTILITIES',
    title: 'Pay\nBills.',
    subtitle: 'Every bill, one place.',
    description:
      'Electricity, water, and all utilities paid in one place with just a few taps.',
    imageSource: require('../../../assets/images/onboarding2.jpg'),
  },
  {
    id: '3',
    tag: 'TRANSFERS',
    title: 'Send\nMoney.',
    subtitle: 'Anyone, anywhere.',
    description:
      'Transfer to anyone, instantly. Quick, safe, and straight from your wallet.',
    imageSource: require('../../../assets/images/onboarding3.jpg'),
  },
];

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const PANEL_HEIGHT = height * 0.42;

// ─────────────────────────────────────────────
// Stories-style progress bar at top
// ─────────────────────────────────────────────
function ProgressBar({
  total,
  current,
  transitionAnim,
}: {
  total: number;
  current: number;
  transitionAnim: Animated.Value;
}) {
  return (
    <View style={pbStyles.row}>
      {Array.from({length: total}).map((_, i) => (
        <View key={i} style={pbStyles.track}>
          {i < current ? (
            // Fully completed
            <View style={[pbStyles.fill, {width: '100%'}]} />
          ) : i === current ? (
            // Animating fill
            <Animated.View
              style={[
                pbStyles.fill,
                {
                  width: transitionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const pbStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 24,
  },
  track: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
});

// ─────────────────────────────────────────────
// Individual slide
// ─────────────────────────────────────────────
function Slide({
  item,
  isActive,
}: {
  item: OnboardingSlide;
  isActive: boolean;
}) {
  const panelY = React.useRef(new Animated.Value(40)).current;
  const panelOpacity = React.useRef(new Animated.Value(0)).current;
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const titleX = React.useRef(new Animated.Value(-20)).current;
  const descOpacity = React.useRef(new Animated.Value(0)).current;
  const strokeWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isActive) {
      // Staggered entrance
      Animated.parallel([
        Animated.timing(panelY, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(panelOpacity, {
          toValue: 1,
          duration: 380,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 340,
            useNativeDriver: true,
          }),
          Animated.timing(titleX, {
            toValue: 0,
            duration: 340,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();

        Animated.timing(strokeWidth, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false, // width needs native: false
        }).start();
      }, 160);

      setTimeout(() => {
        Animated.timing(descOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 340);
    } else {
      // Reset when not active
      panelY.setValue(40);
      panelOpacity.setValue(0);
      titleOpacity.setValue(0);
      titleX.setValue(-20);
      descOpacity.setValue(0);
      strokeWidth.setValue(0);
    }
  }, [isActive]);

  return (
    <View style={slideStyles.root}>
      {/* Full-bleed image */}
      <Image
        source={item.imageSource}
        style={slideStyles.image}
        resizeMode="cover"
      />

      {/* Directional gradient overlay — heavy at bottom, breathes at top */}
      <View style={slideStyles.gradientTop} />
      <View style={slideStyles.gradientBottom} />

      {/* Frosted editorial panel */}
      <Animated.View
        style={[
          slideStyles.panel,
          {
            transform: [{translateY: panelY}],
            opacity: panelOpacity,
          },
        ]}>

        {/* Tag */}
        <View style={slideStyles.tagRow}>
          <View style={slideStyles.tagDot} />
          <Text style={slideStyles.tagText}>{item.tag}</Text>
        </View>

        {/* Headline */}
        <Animated.Text
          style={[
            slideStyles.title,
            {opacity: titleOpacity, transform: [{translateX: titleX}]},
          ]}>
          {item.title}
        </Animated.Text>

        {/* Coral animated underline stroke under the title */}
        <Animated.View
          style={[
            slideStyles.titleStroke,
            {
              width: strokeWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 56],
              }),
            },
          ]}
        />

        {/* Description */}
        <Animated.Text style={[slideStyles.description, {opacity: descOpacity}]}>
          {item.description}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const slideStyles = StyleSheet.create({
  root: {
    width,
    height,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  // Light top vignette — just enough to make the progress bar legible
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'transparent',
    // Simulate gradient with layered opacities
    borderTopLeftRadius: 0,
    // We'll use a dark overlay that fades; RN doesn't have LinearGradient built-in
    // so we stack two overlapping views
    opacity: 0.55,
    // This creates a top-fade effect
    // background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    // Full screen dark overlay
    backgroundColor: 'rgba(20,28,38,0.75)',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 160, // space for nav controls below
    paddingTop: 40,
    justifyContent: 'flex-end',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: CORAL,
  },
  tagText: {
    color: CORAL,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    fontFamily: getSystemFont(),
  },
  title: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '700',
    fontFamily: getSystemFont('medium'),
    lineHeight: 60,
    letterSpacing: -1.5,
    marginBottom: 10,
  },
  titleStroke: {
    height: 3,
    backgroundColor: CORAL,
    borderRadius: 2,
    marginBottom: 18,
  },
  description: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
    lineHeight: 24,
    fontFamily: getSystemFont(),
    letterSpacing: 0.2,
    maxWidth: width * 0.75,
  },
});

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export function OnboardingScreen() {
  console.log('[OnboardingScreen] Rendering component');
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const returnFromPreview = useAppStore((state) => state.returnFromPreview);
  const user = useAppStore((state) => state.user);
  const token = useAppStore((state) => state.token);
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const flatListRef = React.useRef<FlatList<OnboardingSlide>>(null);
  
  // Check if user is authenticated (preview mode)
  const isPreviewMode = !!(user && token);

  // Progress bar fill animation — resets and runs per slide
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const progressTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Arrow button scale for press feedback
  const btnScale = React.useRef(new Animated.Value(1)).current;

  // Auto-advance timer (6 seconds per slide)
  const AUTO_ADVANCE_MS = 6000;

  const startProgressBar = React.useCallback(() => {
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: AUTO_ADVANCE_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  React.useEffect(() => {
    startProgressBar();
    progressTimer.current = setTimeout(() => {
      if (currentIndex < SLIDES.length - 1) {
        const nextIndex = currentIndex + 1;
        flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
        setCurrentIndex(nextIndex);
      } else {
        completeOnboarding();
      }
    }, AUTO_ADVANCE_MS);

    return () => {
      if (progressTimer.current) clearTimeout(progressTimer.current);
    };
  }, [currentIndex]);

  const onViewableItemsChanged = React.useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const handleNext = React.useCallback(() => {
    if (progressTimer.current) clearTimeout(progressTimer.current);

    // Press animation
    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.88,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.back(3)),
        useNativeDriver: true,
      }),
    ]).start();

    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
      setCurrentIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  }, [currentIndex, completeOnboarding]);

  const handleSkip = React.useCallback(() => {
    if (progressTimer.current) clearTimeout(progressTimer.current);
    completeOnboarding();
  }, [completeOnboarding]);

  const renderSlide = React.useCallback(
    ({item, index}: {item: OnboardingSlide; index: number}) => (
      <Slide item={item} isActive={index === currentIndex} />
    ),
    [currentIndex],
  );

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.root}>
      {/* ── CAROUSEL ── */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        scrollEnabled
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* ── TOP CHROME ── */}
      <View
        style={[
          styles.topChrome,
          {paddingTop: Math.max(insets.top, 16) + 4},
        ]}>
        {/* Stories progress bar */}
        <ProgressBar
          total={SLIDES.length}
          current={currentIndex}
          transitionAnim={progressAnim}
        />

        {/* ARAKA wordmark + skip */}
        <View style={styles.topRow}>
          <View style={styles.wordmarkRow}>
            <View style={styles.wordmarkDot} />
            <Text style={styles.wordmark}>ARAKA</Text>
          </View>
            <Pressable onPress={handleSkip} style={styles.skipPill}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
        </View>
      </View>

      {/* ── BOTTOM NAV ── */}
      <View
        style={[
          styles.bottomNav,
          {paddingBottom: Math.max(insets.bottom, 20) + 8},
        ]}>
        {/* Ghost circle arrow button */}
        <Animated.View style={{transform: [{scale: btnScale}]}}>
          <Pressable onPress={handleNext} style={styles.arrowBtn}>
            {isLast ? (
              <Text style={styles.arrowBtnLabel}>Start</Text>
            ) : (
              // Arrow drawn with lines — no icon dependency
              <View style={styles.arrowIcon}>
                <View style={styles.arrowShaft} />
                <View style={styles.arrowHead} />
              </View>
            )}
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111820',
  },

  // ── Top Chrome ──
  topChrome: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    gap: 12,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 2,
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  wordmarkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CORAL,
  },
  wordmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 4,
    fontFamily: getSystemFont(),
  },
  skipPill: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  skipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
  },

  // ── Bottom Nav ──
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    paddingTop: 16,
  },

  // Circle arrow button
  arrowBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: CORAL,
    backgroundColor: 'rgba(242, 118, 73, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    // Glow
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.45,
    shadowRadius: 16,
    // elevation: 10,
  },
  arrowBtnLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: getSystemFont(),
  },
  // Hand-drawn arrow components
  arrowIcon: {
    width: 26,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  arrowShaft: {
    position: 'absolute',
    left: 0,
    right: 8,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    top: 6,
  },
  arrowHead: {
    position: 'absolute',
    right: 0,
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{rotate: '45deg'}],
    top: 2,
  },
});
