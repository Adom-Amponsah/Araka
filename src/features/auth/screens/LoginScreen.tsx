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
  phone: string;
  password: string;
}

const SLATE = '#3D4A5C';
const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#6B7280';
const INPUT_BORDER = '#E5E7EB';
const CARD_RADIUS = 28;
const {height} = Dimensions.get('window');

function StaticInput({
  label,
  icon,
  value,
  onChange,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  error,
  rightElement,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
  rightElement?: React.ReactNode;
}) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={inputStyles.container}>
      <Text style={inputStyles.label}>{label}</Text>
      <View
        style={[
          inputStyles.field,
          {borderColor: focused ? CORAL : INPUT_BORDER},
        ]}>
        <View style={inputStyles.iconWrap}>
          <Ionicons
            name={icon}
            size={18}
            color={focused ? CORAL : '#C4CDD8'}
          />
        </View>

        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          style={inputStyles.input}
          selectionColor={CORAL}
          placeholderTextColor="#9CA3AF"
        />

        {rightElement}
      </View>

      {error && (
        <View style={inputStyles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={inputStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: DARK,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: getSystemFont('medium'),
    marginBottom: 8,
  },
  field: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
  },
  iconWrap: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    fontFamily: getSystemFont(),
    padding: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
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

  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = (data: LoginFormData) => {
    console.log('Login data:', data);
    // TODO: Replace with actual API call
    loginSuccess(
      {id: 'temp-id', phone: data.phone},
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
        <Animated.View
          style={[
            styles.header,
            {paddingTop: Math.max(insets.top, 20) + 32},
          ]}>
          <Text style={styles.headline}>Login to your{'\n'}account</Text>
          <Text style={styles.subline}>Welcome back to ARAKA!</Text>
        </Animated.View>

        {/* ── CARD ── */}
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{translateY: cardSlide}],
              opacity: cardFade,
            },
          ]}>
          <ScrollView
            style={styles.cardScroll}
            contentContainerStyle={styles.cardScrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            bounces={false}>
            <View style={styles.form}>
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: 'Phone number is required',
                  minLength: {value: 8, message: 'Enter a valid phone number'},
                }}
                render={({field: {onChange, value}}) => (
                  <View style={inputStyles.container}>
                    <Text style={inputStyles.label}>Phone Number</Text>
                    <View style={[
                      inputStyles.field,
                      {borderColor: value ? CORAL : INPUT_BORDER},
                    ]}>
                      <Text style={styles.flagIcon}>🇨🇩</Text>
                      <TextInput
                        value={value || ''}
                        onChangeText={onChange}
                        placeholder="+243 ... ... ..."
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                        style={inputStyles.input}
                        selectionColor={CORAL}
                      />
                    </View>
                    {errors.phone?.message && (
                      <View style={inputStyles.errorRow}>
                        <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                        <Text style={inputStyles.errorText}>{errors.phone.message}</Text>
                      </View>
                    )}
                  </View>
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
                  <StaticInput
                    label="Password"
                    icon="key-outline"
                    value={value || ''}
                    onChange={onChange}
                    secureTextEntry={!showPassword}
                    error={errors.password?.message}
                    rightElement={(
                      <Pressable onPress={() => setShowPassword(s => !s)}>
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={20}
                          color="#9CA3AF"
                        />
                      </Pressable>
                    )}
                  />
                )}
              />
            </View>

            <View>
              {/* CTA */}
              <Pressable
                onPress={handleSubmit(onSubmit)}
                style={({pressed}) => [
                  styles.ctaButton,
                  pressed && styles.ctaButtonPressed,
                ]}>
                <Text style={styles.ctaText}>Login</Text>
              </Pressable>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>No account yet? </Text>
                <Pressable onPress={() => startSignup()}>
                  <Text style={styles.footerLink}>Sign Up</Text>
                </Pressable>
              </View>

              {/* Bottom safe area padding */}
              <View style={{height: Math.max(insets.bottom, 24)}} />
            </View>
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    paddingBottom: 40,
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    fontFamily: getSystemFont('medium'),
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 8,
  },
  subline: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontFamily: getSystemFont(),
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // ── Card ──
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    paddingTop: 36,
  },
  cardScroll: {
    flex: 1,
  },
  cardScrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  form: {
    gap: 4,
  },
  flagIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  // ── CTA ──
  ctaButton: {
    backgroundColor: CORAL,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  ctaButtonPressed: {
    opacity: 0.9,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: getSystemFont(),
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  footerText: {
    color: GRAY,
    fontSize: 14,
    fontFamily: getSystemFont(),
  },
  footerLink: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont(),
  },
});
