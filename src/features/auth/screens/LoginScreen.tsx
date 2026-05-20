import * as React from 'react';
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import {useForm, Controller} from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

interface LoginFormData {
  email: string;
  password: string;
}

// Animated input that lifts its label and glows on focus
function FloatingInput({
  label,
  icon,
  value,
  onChange,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  error,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
}) {
  const [focused, setFocused] = React.useState(false);
  const labelAnim = React.useRef(new Animated.Value(value ? 1 : 0)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  const hasContent = !!value;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(labelAnim, {
        toValue: focused || hasContent ? 1 : 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused, hasContent]);

  const labelTop = labelAnim.interpolate({inputRange: [0, 1], outputRange: [18, 6]});
  const labelSize = labelAnim.interpolate({inputRange: [0, 1], outputRange: [15, 11]});
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#9CA3AF', focused ? '#F27649' : '#9CA3AF'],
  });
  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8EDF2', '#F27649'],
  });

  return (
    <View style={floatStyles.container}>
      <Animated.View
        style={[
          floatStyles.field,
          {borderColor},
        ]}>
        {/* Icon */}
        <View style={floatStyles.iconWrap}>
          <Ionicons
            name={icon}
            size={18}
            color={focused ? '#F27649' : '#C4CDD8'}
          />
        </View>

        {/* Floating label */}
        <Animated.Text
          style={[
            floatStyles.label,
            {top: labelTop, fontSize: labelSize, color: labelColor},
          ]}>
          {label}
        </Animated.Text>

        {/* Input */}
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          style={floatStyles.input}
          selectionColor="#F27649"
        />
      </Animated.View>

      {error && (
        <View style={floatStyles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={floatStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const floatStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  field: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 62,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingRight: 16,
    overflow: 'hidden',
    // Subtle inset shadow via elevation trick on Android; iOS shadow
    shadowColor: '#B8C4D0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 48,
    alignItems: 'center',
    paddingBottom: 2,
  },
  label: {
    position: 'absolute',
    left: 48,
    fontFamily: getSystemFont('medium'),
    letterSpacing: 0.2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A2535',
    paddingTop: 18,
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 12,
    gap: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: getSystemFont(),
  },
});

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const loginSuccess = useAppStore((state) => state.loginSuccess);
  const startSignup = useAppStore((state) => state.startSignup);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormData>({mode: 'onSubmit'});

  // Entrance animations
  const headerFade = React.useRef(new Animated.Value(0)).current;
  const cardSlide = React.useRef(new Animated.Value(60)).current;
  const cardFade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 440,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const onSubmit = (data: LoginFormData) => {
    console.log('Login data:', data);
    // TODO: Replace with actual API call
    loginSuccess(
      {id: 'temp-id', email: data.email},
      'temp-token'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{flexGrow: 1, backgroundColor: SLATE}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
        automaticallyAdjustKeyboardInsets={true}>

        {/* ── HEADER ZONE ── */}
        <View
          style={[
            styles.header,
            {paddingTop: Math.max(insets.top, 20) + 32},
          ]}>

          {/* Geometric accent — top-right corner decorative ring */}
          <View style={styles.ringDecor} />
          <View style={styles.ringDecorInner} />

          {/* Monogram badge */}
          {/* <Animated.View style={[styles.monogramWrap, {opacity: headerFade}]}>
            <Text style={styles.monogram}>A</Text>
          </Animated.View> */}

          <Animated.View style={{opacity: headerFade}}>
            {/* <Text style={styles.eyebrow}>ARAKA FINANCE</Text> */}
            <Text style={styles.headline}>Welcome{'\n'}back.</Text>
            <Text style={styles.subline}>Sign in to your account</Text>
          </Animated.View>
        </View>

        {/* ── CARD ── */}
        {/* Shadow layer behind the card to give curve depth */}
        <Animated.View
          style={[
            styles.cardShadowLayer,
            {opacity: cardFade},
          ]}
        />

        <Animated.View
          style={[
            styles.card,
            {
              transform: [{translateY: cardSlide}],
              opacity: cardFade,
            },
          ]}>

          {/* Thin gold/coral rule at card top */}
          <View style={styles.cardRule} />

          <Text style={styles.cardTitle}>Sign in</Text>

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            }}
            render={({field: {onChange, value}}) => (
              <FloatingInput
                label="Email address"
                icon="mail-outline"
                value={value || ''}
                onChange={onChange}
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
              minLength: {value: 6, message: 'At least 6 characters'},
            }}
            render={({field: {onChange, value}}) => (
              <FloatingInput
                label="Password"
                icon="lock-closed-outline"
                value={value || ''}
                onChange={onChange}
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          {/* Forgot password */}
          <Pressable style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {/* CTA */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={({pressed}) => [
              styles.ctaButton,
              pressed && styles.ctaButtonPressed,
            ]}>
            <Text style={styles.ctaText}>Sign In</Text>
            {/* Arrow accent */}
            {/* <View style={styles.ctaArrow}>
              <Ionicons name="arrow-forward" size={18} color="#F27649" />
            </View> */}
          </Pressable>

          {/* Divider */}
          <View style={styles.divRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>New to ARAKA?</Text>
            <View style={styles.divLine} />
          </View>

          {/* Sign up ghost button */}
          <Pressable
            onPress={() => startSignup()}
            style={({pressed}) => [
              styles.ghostButton,
              pressed && {opacity: 0.7},
            ]}>
            <Text style={styles.ghostText}>Create an account</Text>
          </Pressable>

          {/* Bottom safe area padding */}
          <View style={{height: Math.max(insets.bottom, 24)}} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const SLATE = '#3D4A5C';   // slightly deeper than original for contrast
const CORAL = '#F27649';
const CARD_RADIUS = 36;
const {height} = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SLATE,
  },
  scroll: {
    flex: 1,
  },

  // ── Header ──
  header: {
    backgroundColor: SLATE,
    paddingHorizontal: 28,
    paddingBottom: 56, // extra so card curve feels spacious
  },
  ringDecor: {
    position: 'absolute',
    top: 24,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 28,
    borderColor: 'rgba(242, 118, 73, 0.12)',
  },
  ringDecorInner: {
    position: 'absolute',
    top: 60,
    right: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 118, 73, 0.25)',
  },
  monogramWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: CORAL,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    // small shadow so it lifts off the header
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  monogram: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: getSystemFont('medium'),
    letterSpacing: 1,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    letterSpacing: 3,
    fontFamily: getSystemFont(),
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: getSystemFont('medium'),
    lineHeight: 36,
    letterSpacing: 0.1,
    marginBottom: 10,
  },
  subline: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 14,
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
  },

  // ── Card shadow layer: sits BEHIND the card to cast shadow onto header ──
  cardShadowLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    // We use the card's border-radius translated upward
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    // The actual shadow
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -12},
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 20,
  },

  // ── Card ──
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 200,
    marginTop: -CARD_RADIUS, // pulls card up to overlap header curve
    minHeight: height,
    // Shadow that peeks above the curve
    shadowColor: '#1A2535',
    shadowOffset: {width: 0, height: -8},
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 16,
  },
  cardRule: {
    width: 40,
    height: 3,
    backgroundColor: CORAL,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  cardTitle: {
    color: '#1A2535',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: getSystemFont('medium'),
    letterSpacing: -0.3,
    marginBottom: 28,
  },

  // ── Forgot ──
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 28,
    paddingVertical: 4,
  },
  forgotText: {
    color: CORAL,
    fontSize: 13,
    fontFamily: getSystemFont(),
    letterSpacing: 0.2,
  },

  // ── CTA ──
  ctaButton: {
    backgroundColor: '#F27649',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#1A2535',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaButtonPressed: {
    backgroundColor: '#263347',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: getSystemFont(),
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  ctaArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(242, 118, 73, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Divider ──
  divRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  divLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EDF0F5',
  },
  divText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
  },

  // ── Ghost button ──
  ghostButton: {
    borderWidth: 1.5,
    borderColor: '#E8EDF2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ghostText: {
    color: '#3D4A5C',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
  },
});
