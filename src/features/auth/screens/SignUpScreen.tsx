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

interface SignUpFormData {
  phone: string;
  agreedToTerms: boolean;
}

const SLATE = '#425466';
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
  const phone = watch('phone') || '';

  const headerFade = React.useRef(new Animated.Value(0)).current;
  const cardSlide = React.useRef(new Animated.Value(60)).current;
  const cardFade = React.useRef(new Animated.Value(0)).current;
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
    console.log('SignUp step 1:', data);
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
        <View
          style={[styles.header, {paddingTop: Math.max(insets.top, 20) + 80}]}>
          <Animated.View style={{opacity: headerFade}}>
            <Text style={styles.headline}>Create your{'\n'}account</Text>
            <Text style={styles.subline}>Welcome to ARAKA!</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.cardShadowLayer, {opacity: cardFade}]} />

        <Animated.View
          style={[
            styles.card,
            {transform: [{translateY: cardSlide}], opacity: cardFade},
          ]}>
          <View style={styles.cardRule} />

          <View style={styles.cardContent}>
            <Controller
              control={control}
              name="phone"
              rules={{required: 'Phone number is required'}}
              render={({field: {onChange, value}}) => (
                <View style={inputStyles.container}>
                  <Text style={inputStyles.label}>Phone Number</Text>
                  <View
                    style={[
                      inputStyles.field,
                      errors.phone && inputStyles.fieldError,
                    ]}>
                    <Text style={inputStyles.flag}>🇨🇩</Text>
                    <TextInput
                      value={value || ''}
                      onChangeText={onChange}
                      placeholder="+243 ... ... ..."
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      style={inputStyles.input}
                    />
                  </View>
                  {errors.phone && (
                    <View style={inputStyles.errorRow}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={13}
                        color="#EF4444"
                      />
                      <Text style={inputStyles.errorText}>
                        {errors.phone.message}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            />
          </View>

          <View style={styles.cardBottom}>
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
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms and Conditions</Text>
                  </Text>
                </Pressable>
              )}
            />
            {errors.agreedToTerms && (
              <View style={styles.termsError}>
                <Ionicons
                  name="alert-circle-outline"
                  size={13}
                  color="#EF4444"
                />
                <Text style={styles.termsErrorText}>
                  {errors.agreedToTerms.message}
                </Text>
              </View>
            )}

            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={({pressed}) => [
                styles.ctaButton,
                (!agreedToTerms || !phone) && styles.ctaDisabled,
                pressed && agreedToTerms && !!phone && styles.ctaPressed,
              ]}>
              <Text style={styles.ctaText}>Sign Up</Text>
            </Pressable>

            <Pressable onPress={() => startLogin()} style={styles.footerBtn}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.footerLink}>Sign In</Text>
              </Text>
            </Pressable>
          </View>

          <View style={{height: Math.max(insets.bottom, 24)}} />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: SLATE},
  scroll: {flex: 1},

  header: {
    backgroundColor: SLATE,
    paddingHorizontal: 28,
    paddingBottom: 80,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headline: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: getSystemFont(),
    lineHeight: 36,
    letterSpacing: 0.1,
    marginBottom: 10,
    textAlign: 'center',
  },
  subline: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
  },

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
    justifyContent: 'space-between',
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

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  },
  termsText: {
    flex: 1,
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: getSystemFont(),
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
    fontFamily: getSystemFont(),
  },

  ctaButton: {
    backgroundColor: CORAL,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  ctaDisabled: {
    backgroundColor: '#E5E7EB',
  },
  ctaPressed: {
    opacity: 0.95,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: getSystemFont(),
    letterSpacing: 0.5,
  },

  footerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  cardContent: {
    flex: 1,
  },

  cardBottom: {
    paddingBottom: Math.max(80, 0),
  },
  footerText: {
    color: '#6B7280',
    fontSize: 15,
    fontFamily: getSystemFont(),
  },
  footerLink: {
    color: CORAL,
    fontWeight: '700',
    fontFamily: getSystemFont(),
  },
});

const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: getSystemFont(),
    marginBottom: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  fieldError: {
    borderColor: '#EF4444',
  },
  flag: {
    fontSize: 22,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
    padding: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: getSystemFont(),
  },
});
