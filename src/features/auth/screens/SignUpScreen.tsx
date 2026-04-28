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

interface SignUpFormData {
  fullName: string;
  email: string;
  phone: string;
  agreedToTerms: boolean;
}

// ─────────────────────────────────────────────
// Reusable FloatingInput (same as LoginScreen)
// ─────────────────────────────────────────────
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
      <Animated.View style={[floatStyles.field, {borderColor}]}>
        <View style={floatStyles.iconWrap}>
          <Ionicons name={icon} size={18} color={focused ? '#F27649' : '#C4CDD8'} />
        </View>
        <Animated.Text
          style={[floatStyles.label, {top: labelTop, fontSize: labelSize, color: labelColor}]}>
          {label}
        </Animated.Text>
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
  container: {marginBottom: 16},
  field: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#B8C4D0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {width: 40, alignItems: 'center', justifyContent: 'center'},
  label: {
    position: 'absolute',
    left: 56,
    top: 6,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A2535',
    paddingTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
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
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
});

// ─────────────────────────────────────────────
// Step indicator — shows 3 dots, first is active
// (visual affordance that signup is a multi-step flow)
// ─────────────────────────────────────────────
function StepDots({active}: {active: number}) {
  return (
    <View style={dotStyles.row}>
      {[0, 1].map(i => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i === active && dotStyles.dotActive,
            i < active && dotStyles.dotDone,
          ]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {flexDirection: 'row', gap: 6, alignItems: 'center'},
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 22,
    backgroundColor: '#F27649',
  },
  dotDone: {
    backgroundColor: 'rgba(242,118,73,0.45)',
  },
});

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
const SLATE = '#3D4A5C';
const CORAL = '#F27649';
const CARD_RADIUS = 36;
const {height} = Dimensions.get('window');

export function SignUpScreen() {
  const insets = useSafeAreaInsets();
  const submitSignupForm = useAppStore((state) => state.submitSignupForm);
  const startLogin = useAppStore((state) => state.startLogin);

  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<SignUpFormData>({
    defaultValues: {agreedToTerms: false},
    mode: 'onSubmit',
  });

  const agreedToTerms = watch('agreedToTerms');

  // Entrance animations
  const headerFade = React.useRef(new Animated.Value(0)).current;
  const cardSlide = React.useRef(new Animated.Value(60)).current;
  const cardFade = React.useRef(new Animated.Value(0)).current;

  // Checkbox pulse animation
  const checkPulse = React.useRef(new Animated.Value(1)).current;

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

  // Pulse the checkbox when checked
  const handleCheckPulse = () => {
    Animated.sequence([
      Animated.timing(checkPulse, {
        toValue: 1.18,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(checkPulse, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.back(3)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onSubmit = (data: SignUpFormData) => {
    console.log('SignUp data:', data);
    submitSignupForm();
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

        {/* ── HEADER ── */}
        <View style={[styles.header, {paddingTop: Math.max(insets.top, 20) + 32}]}>
          {/* Geometric decor — bottom-left this time (mirrors login's top-right) */}
          <View style={styles.ringDecor} />
          <View style={styles.ringDecorInner} />

          <Animated.View style={{opacity: headerFade}}>
            {/* Step indicator */}
            <View style={styles.stepRow}>
              <StepDots active={0} />
              <Text style={styles.stepLabel}>Step 1 of 2</Text>
            </View>

            <Text style={styles.headline}>Create your{'\n'}account.</Text>
            <Text style={styles.subline}>Get started with ARAKA</Text>
          </Animated.View>
        </View>

        {/* Shadow layer */}
        <Animated.View style={[styles.cardShadowLayer, {opacity: cardFade}]} />

        {/* ── CARD ── */}
        <Animated.View
          style={[
            styles.card,
            {transform: [{translateY: cardSlide}], opacity: cardFade},
          ]}>

          <View style={styles.cardRule} />
          <Text style={styles.cardTitle}>Enter Your Details</Text>

          <Controller
            control={control}
            name="fullName"
            rules={{required: 'Full name is required'}}
            render={({field: {onChange, value}}) => (
              <FloatingInput
                label="Full name"
                icon="person-outline"
                value={value || ''}
                onChange={onChange}
                autoCapitalize="words"
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
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
            name="phone"
            rules={{required: 'Phone number is required'}}
            render={({field: {onChange, value}}) => (
              <FloatingInput
                label="Phone number"
                icon="call-outline"
                value={value || ''}
                onChange={onChange}
                keyboardType="phone-pad"
                error={errors.phone?.message}
              />
            )}
          />

          {/* ── Terms checkbox ── */}
          <Controller
            control={control}
            name="agreedToTerms"
            rules={{required: 'You must agree to continue'}}
            render={({field: {onChange, value}}) => (
              <Pressable
                onPress={() => {
                  onChange(!value);
                  handleCheckPulse();
                }}
                style={styles.termsRow}>
                <Animated.View
                  style={[
                    styles.checkBox,
                    value && styles.checkBoxChecked,
                    {transform: [{scale: checkPulse}]},
                  ]}>
                  {value && <Ionicons name="checkmark" size={13} color="#FFF" />}
                </Animated.View>
                <Text style={styles.termsText}>
                  I agree to{' '}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </Pressable>
            )}
          />
          {errors.agreedToTerms && (
            <View style={styles.termsError}>
              <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
              <Text style={styles.termsErrorText}>{errors.agreedToTerms.message}</Text>
            </View>
          )}

          {/* ── CTA ── */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            style={({pressed}) => [
              styles.ctaButton,
              !agreedToTerms && styles.ctaDisabled,
              pressed && agreedToTerms && styles.ctaPressed,
            ]}>
            <Text style={[styles.ctaText, !agreedToTerms && styles.ctaTextDisabled]}>
              Continue
            </Text>
            {/* <View style={[styles.ctaArrow, !agreedToTerms && styles.ctaArrowDisabled]}>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={agreedToTerms ? CORAL : '#9CA3AF'}
              />
            </View> */}
          </Pressable>

          {/* ── Already have account ── */}
          <View style={styles.divRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>Have an account?</Text>
            <View style={styles.divLine} />
          </View>

          <Pressable
            onPress={() => startLogin()}
            style={({pressed}) => [styles.ghostButton, pressed && {opacity: 0.7}]}>
            <Text style={styles.ghostText}>Sign In Instead</Text>
          </Pressable>

          <View style={{height: Math.max(insets.bottom, 24)}} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: SLATE},
  scroll: {flex: 1},

  // ── Header ──
  header: {
    backgroundColor: SLATE,
    paddingHorizontal: 28,
    paddingBottom: 56,
  },
  ringDecor: {
    position: 'absolute',
    top: -28,
    right: -48,
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 32,
    borderColor: 'rgba(242, 118, 73, 0.10)',
  },
  ringDecorInner: {
    position: 'absolute',
    top: 22,
    right: 12,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(242, 118, 73, 0.22)',
  },

  // Back button
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },

  // Step indicator row
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  stepLabel: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    fontWeight: '600',
  },

  headline: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    lineHeight: 46,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 0.3,
  },

  // ── Card shadow layer ──
  cardShadowLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
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
    marginTop: -CARD_RADIUS,
    minHeight: height,
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
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: -0.3,
    marginBottom: 24,
  },

  // ── Terms ──
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 8,
    gap: 12,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    backgroundColor: '#F7F9FC',
  },
  checkBoxChecked: {
    backgroundColor: CORAL,
    borderColor: CORAL,
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  termsText: {
    flex: 1,
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  termsLink: {
    color: CORAL,
    fontWeight: '600',
  },
  termsError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
    marginLeft: 34,
  },
  termsErrorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },

  // ── CTA ──
  ctaButton: {
    backgroundColor: '#F27649',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 28,
    shadowColor: '#1A2535',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaDisabled: {
    backgroundColor: '#F0F2F5',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaPressed: {
    backgroundColor: '#263347',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 0.5,
    flex: 1,
    textAlign: 'center',
  },
  ctaTextDisabled: {
    color: '#9CA3AF',
  },
  ctaArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(242, 118, 73, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaArrowDisabled: {
    backgroundColor: '#E8EDF2',
  },

  // ── Divider ──
  divRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  divLine: {flex: 1, height: 1, backgroundColor: '#EDF0F5'},
  divText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
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
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
    letterSpacing: 0.3,
  },
});