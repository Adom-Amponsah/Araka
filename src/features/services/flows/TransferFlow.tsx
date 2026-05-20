import * as React from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {PAYMENT_TELCOS, PaymentTelcoId} from '../registry/serviceRegistry';
import {useServiceSessionStore} from '../store/serviceSessionStore';
import {
  selectTransferFinancials,
  useTransferFlowStore,
} from '../store/transferFlowStore';

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK = '#1A2535';
const OFF = '#F4F6FA';
const GREEN = '#10B981';
const RED = '#EF4444';
const DISPLAY = getSystemFont('condensed');
const SERIF = getSystemFont('medium');
const SANS = getSystemFont();

const STEPS = ['details', 'review', 'paymentMethod', 'mobileMoneyDetails', 'paymentConfirmation'];

const formatMoney = (currency: string, amount: number) =>
  `${currency} ${amount.toFixed(2)}`;

function FadeSlideIn({
  children,
  delay = 0,
  fromY = 20,
}: {
  children: React.ReactNode;
  delay?: number;
  fromY?: number;
}) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(fromY)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 340,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 340,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, fromY, opacity, translateY]);

  return (
    <Animated.View style={{opacity, transform: [{translateY}]}}>
      {children}
    </Animated.View>
  );
}

function StepDots({currentStep}: {currentStep: string}) {
  const stepIndex = STEPS.indexOf(currentStep);
  if (stepIndex < 0) return null;

  return (
    <View style={dot.row}>
      {STEPS.map((_, i) => {
        const active = i === stepIndex;
        const done = i < stepIndex;

        return (
          <View
            key={i}
            style={[dot.base, active && dot.active, done && dot.done]}
          />
        );
      })}
    </View>
  );
}

const dot = StyleSheet.create({
  row: {flexDirection: 'row', gap: 6, alignItems: 'center'},
  base: {width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.28)'},
  active: {width: 22, backgroundColor: '#FFFFFF'},
  done: {backgroundColor: 'rgba(255,255,255,0.72)'},
});

function PulseRing() {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(0.6)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {toValue: 1.6, duration: 900, useNativeDriver: true}),
          Animated.timing(opacity, {toValue: 0, duration: 900, useNativeDriver: true}),
        ]),
        Animated.parallel([
          Animated.timing(scale, {toValue: 1, duration: 0, useNativeDriver: true}),
          Animated.timing(opacity, {toValue: 0.6, duration: 0, useNativeDriver: true}),
        ]),
      ]),
    ).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={[pulse.ring, {transform: [{scale}], opacity}]} />
  );
}

const pulse = StyleSheet.create({
  ring: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: CORAL,
  },
});

function FlowInput({
  label,
  rightLabel,
  icon,
  prefix,
  onFocus,
  ...props
}: {
  label: string;
  rightLabel?: string;
  icon?: string;
  prefix?: string;
  placeholder: string;
  value: string;
  keyboardType?: 'default' | 'decimal-pad' | 'phone-pad' | 'number-pad';
  onChangeText: (value: string) => void;
  onFocus?: () => void;
}) {
  const [focused, setFocused] = React.useState(false);
  const borderAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    onFocus?.();
    Animated.timing(borderAnim, {toValue: 1, duration: 180, useNativeDriver: false}).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {toValue: 0, duration: 180, useNativeDriver: false}).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5EAF0', CORAL],
  });

  return (
    <View style={fi.group}>
      <View style={fi.labelRow}>
        <Text style={fi.label}>{label}</Text>
        {rightLabel && (
          <View style={fi.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={12} color={GREEN} />
            <Text style={fi.verified}>{rightLabel}</Text>
          </View>
        )}
      </View>
      <Animated.View style={[fi.inputWrap, {borderColor}]}>
        {icon && (
          <Ionicons
            name={icon as any}
            size={18}
            color={focused ? CORAL : '#9CA3AF'}
            style={fi.icon}
          />
        )}
        {prefix && <Text style={fi.prefix}>{prefix}</Text>}
        <TextInput
          {...props}
          placeholderTextColor="#B0BAC9"
          selectionColor={CORAL}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={fi.input}
        />
      </Animated.View>
    </View>
  );
}

const fi = StyleSheet.create({
  group: {gap: 8},
  labelRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  label: {color: DARK, fontSize: 13, fontWeight: '700', fontFamily: getSystemFont('bold'), letterSpacing: 0.1},
  verifiedBadge: {flexDirection: 'row', alignItems: 'center', gap: 4},
  verified: {color: GREEN, fontSize: 12, fontWeight: '700', fontFamily: getSystemFont('bold')},
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    gap: 10,
  },
  icon: {flexShrink: 0},
  prefix: {color: '#9CA3AF', fontSize: 15, fontFamily: getSystemFont('medium'), fontWeight: '600'},
  input: {flex: 1, fontSize: 16, color: DARK, fontFamily: SANS, padding: 0},
});

function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon?: string;
  disabled?: boolean;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const pressIn = () => {
    if (!disabled) {
      Animated.spring(scale, {toValue: 0.96, useNativeDriver: true, damping: 15, stiffness: 300}).start();
    }
  };
  const pressOut = () => {
    if (!disabled) {
      Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 10, stiffness: 200}).start();
    }
  };

  return (
    <Animated.View style={{transform: [{scale}]}}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled}
        accessibilityState={{disabled}}
        style={[btn.primary, disabled && btn.primaryDisabled]}>
        <Text style={[btn.primaryText, disabled && btn.primaryTextDisabled]}>{label}</Text>
        {icon && <Ionicons name={icon as any} size={18} color={disabled ? '#9CA3AF' : '#FFFFFF'} />}
      </Pressable>
    </Animated.View>
  );
}

function SecondaryButton({label, onPress}: {label: string; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} style={btn.secondary}>
      <Text style={btn.secondaryText}>{label}</Text>
    </Pressable>
  );
}

function ErrorText({error}: {error: string | null}) {
  if (!error) return null;

  return (
    <View style={btn.errorWrap}>
      <Ionicons name="alert-circle-outline" size={14} color={RED} />
      <Text style={btn.error}>{error}</Text>
    </View>
  );
}

const btn = StyleSheet.create({
  primary: {
    backgroundColor: CORAL,
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryText: {color: '#FFFFFF', fontSize: 16, fontWeight: '800', fontFamily: getSystemFont('bold'), letterSpacing: 0.3},
  primaryDisabled: {
    backgroundColor: '#E5EAF0',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryTextDisabled: {color: '#9CA3AF'},
  secondary: {borderRadius: 18, paddingVertical: 16, alignItems: 'center'},
  secondaryText: {color: SLATE, fontSize: 14, fontWeight: '700', fontFamily: getSystemFont('bold')},
  errorWrap: {flexDirection: 'row', alignItems: 'center', gap: 6},
  error: {color: RED, fontSize: 13, fontWeight: '600', fontFamily: getSystemFont('medium'), flex: 1},
});

function OptionCard({
  icon,
  title,
  body,
  badge,
  onPress,
}: {
  icon: string;
  title: string;
  body: string;
  badge?: string;
  onPress: () => void;
}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, {toValue: 0.97, useNativeDriver: true, damping: 15, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 10, stiffness: 200}).start();

  return (
    <Animated.View style={{transform: [{scale}]}}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={oc.card}>
        <View style={oc.iconWrap}>
          <Ionicons name={icon as any} size={22} color={CORAL} />
        </View>
        <View style={oc.text}>
          <View style={oc.titleRow}>
            <Text style={oc.title}>{title}</Text>
            {badge && (
              <View style={oc.badge}>
                <Text style={oc.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          <Text style={oc.body}>{body}</Text>
        </View>
        <View style={oc.arrow}>
          <Ionicons name="chevron-forward" size={18} color={CORAL} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const oc = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF2',
    borderRadius: 20,
    padding: 16,
    gap: 14,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {flex: 1, gap: 3},
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  title: {color: DARK, fontSize: 15, fontWeight: '800', fontFamily: getSystemFont('bold')},
  body: {color: '#6B7280', fontSize: 12, fontFamily: SANS, lineHeight: 17},
  badge: {backgroundColor: '#EDFBF4', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3},
  badgeText: {color: GREEN, fontSize: 10, fontWeight: '800', fontFamily: getSystemFont('bold')},
  arrow: {width: 32, height: 32, borderRadius: 10, backgroundColor: '#FFF1EA', alignItems: 'center', justifyContent: 'center', flexShrink: 0},
});

function SectionHead({title, sub}: {title: string; sub?: string}) {
  return (
    <View style={sh.wrap}>
      <Text style={sh.title}>{title}</Text>
      {sub && <Text style={sh.sub}>{sub}</Text>}
    </View>
  );
}

const sh = StyleSheet.create({
  wrap: {gap: 4, marginBottom: 4},
  title: {color: DARK, fontSize: 22, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.4},
  sub: {color: '#6B7280', fontSize: 13, fontFamily: SANS, lineHeight: 18},
});

function SummaryRow({label, value, strong}: {label: string; value: string; strong?: boolean}) {
  return (
    <View style={sr.row}>
      <Text style={sr.label}>{label}</Text>
      <Text style={[sr.value, strong && sr.strong]}>{value}</Text>
    </View>
  );
}

const sr = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6},
  label: {color: '#6B7280', fontSize: 13, fontFamily: SANS},
  value: {color: DARK, fontSize: 14, fontWeight: '700', fontFamily: getSystemFont('bold')},
  strong: {fontSize: 18, color: CORAL, fontFamily: SERIF},
});

function SummaryCard({children}: {children: React.ReactNode}) {
  return <View style={sc.wrap}>{children}</View>;
}

const sc = StyleSheet.create({
  wrap: {
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 16,
    gap: 2,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
});

export function TransferFlow() {
  const navigation = useNavigation<any>();
  const closeServiceSession = useServiceSessionStore(s => s.closeServiceSession);
  const store = useTransferFlowStore();
  const financials = selectTransferFinancials(store);
  const provider = store.session?.provider;

  const heroFade = React.useRef(new Animated.Value(0)).current;
  const heroY = React.useRef(new Animated.Value(-10)).current;
  const cardSlide = React.useRef(new Animated.Value(40)).current;
  const cardFade = React.useRef(new Animated.Value(0)).current;
  const scrollRef = React.useRef<ScrollView | null>(null);

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, {toValue: 1, duration: 380, useNativeDriver: true}),
        Animated.timing(heroY, {toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]),
      Animated.parallel([
        Animated.timing(cardSlide, {toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(cardFade, {toValue: 1, duration: 360, useNativeDriver: true}),
      ]),
    ]).start();
  }, [cardFade, cardSlide, heroFade, heroY]);

  const closeFlow = () => {
    store.reset();
    closeServiceSession();
    navigation.goBack();
  };

  const bringLowerFieldsIntoView = React.useCallback(() => {
    [80, 280].forEach(delay => {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({animated: true});
      }, delay);
    });
  }, []);

  if (!provider) {
    return <EmptyFlow onClose={closeFlow} />;
  }

  const isTerminal = store.step === 'success' || store.step === 'failed';

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Animated.View style={[s.hero, {opacity: heroFade, transform: [{translateY: heroY}]}]}>
        <View style={s.ringOuter} />
        <View style={s.ringInner} />

        <View style={s.topBar}>
              <View style={s.providerBadge}>
                <View style={s.providerDot} />
                <Text style={s.providerLabel}>{provider.name} Transfer</Text>
              </View>
           <Pressable onPress={closeFlow} style={s.closeBtn}>
            <Ionicons name="close" size={18} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* <View style={s.headWrap}> */}
           {/* <View style={s.providerBadge}>
            <View style={s.providerDot} />
            <Text style={s.providerLabel}>{provider.name} Transfer</Text>
          </View> */}
          {/* <View style={s.heroRule} /> */}
        {/* </View> */}

        {!isTerminal && <StepDots currentStep={store.step} />}
      </Animated.View>

      <Animated.View style={[s.curveShadow, {opacity: cardFade}]} />

      <Animated.View
        style={[s.card, {transform: [{translateY: cardSlide}], opacity: cardFade}]}>
        <View style={s.handle} />
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={[
            s.scrollContent,
            store.step === 'details' && s.detailsScrollContent,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled">
          {store.step === 'details' && (
            <DetailsStep
              subscriberNumber={store.subscriberNumber}
              smartCardNumber={store.smartCardNumber}
              phoneNumber={store.phoneNumber}
              amount={store.amount}
              error={store.error}
              currency={financials.currency}
              onSubscriberNumberChange={store.setSubscriberNumber}
              onSmartCardNumberChange={store.setSmartCardNumber}
              onPhoneNumberChange={store.setPhoneNumber}
              onAmountChange={store.setAmount}
              onLowerFieldFocus={bringLowerFieldsIntoView}
              onSubmit={store.submitDetails}
            />
          )}

          {store.step === 'review' && (
            <ReviewStep
              subscriberNumber={store.subscriberNumber}
              smartCardNumber={store.smartCardNumber}
              phoneNumber={store.phoneNumber}
              financials={financials}
              onEdit={store.editDetails}
              onContinue={store.confirmReview}
            />
          )}

          {store.step === 'paymentMethod' && (
            <PaymentMethodStep
              error={store.error}
              onSelect={store.selectPaymentMethod}
              onBack={store.backToReview}
            />
          )}

          {store.step === 'mobileMoneyDetails' && (
            <MobileMoneyStep
              enabledTelcos={provider.capabilities.mobileMoneyTelcos}
              selectedTelco={store.paymentTelco}
              mobileNumber={store.mobileNumber}
              error={store.error}
              total={formatMoney(financials.currency, financials.total)}
              onSelectTelco={store.selectPaymentTelco}
              onMobileNumberChange={store.setMobileNumber}
              onSubmit={store.completeMobileMoneyDetails}
              onBack={store.backToPaymentMethod}
            />
          )}

          {store.step === 'cardRedirect' && (
            <CardRedirectStep onBack={store.backToPaymentMethod} />
          )}

          {store.step === 'paymentConfirmation' && (
            <ConfirmationStep
              providerName={provider.name}
              onVerify={store.verifyPayment}
              onFail={store.failPayment}
            />
          )}

          {store.step === 'success' && (
            <ResultStep
              success
              title="Transfer successful"
              body="Your transfer payment was completed successfully."
              onDone={closeFlow}
            />
          )}

          {store.step === 'failed' && (
            <ResultStep
              title="Transfer failed"
              body={store.error || 'Your payment could not be completed.'}
              onDone={store.backToPaymentMethod}
            />
          )}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

function DetailsStep({
  subscriberNumber,
  smartCardNumber,
  phoneNumber,
  amount,
  error,
  currency,
  onSubscriberNumberChange,
  onSmartCardNumberChange,
  onPhoneNumberChange,
  onAmountChange,
  onLowerFieldFocus,
  onSubmit,
}: {
  subscriberNumber: string;
  smartCardNumber: string;
  phoneNumber: string;
  amount: string;
  error: string | null;
  currency: string;
  onSubscriberNumberChange: (value: string) => void;
  onSmartCardNumberChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onLowerFieldFocus: () => void;
  onSubmit: () => void;
}) {
  const phoneVerified = phoneNumber.replace(/\D/g, '').length >= 9;
  const smartCardReady = smartCardNumber.replace(/\D/g, '').length === 4;
  const canReview =
    subscriberNumber.trim().length > 0 &&
    smartCardReady &&
    phoneVerified &&
    Number(amount) > 0;

  return (
    <View style={step.wrap}>
      <FadeSlideIn delay={60}>
        <SectionHead
          title="Transfer details"
          // sub="Enter the subscriber, smart card, recipient phone, and amount."
        />
      </FadeSlideIn>

      <FadeSlideIn delay={110}>
        <FlowInput
          label="Subscriber number"
          placeholder="Enter subscriber number"
          value={subscriberNumber}
          onChangeText={onSubscriberNumberChange}
          icon="person-outline"
        />
      </FadeSlideIn>

      {/* <FadeSlideIn delay={150}>
        <FlowInput
          label="Smart card"
          placeholder="Last 4 digits"
          value={smartCardNumber}
          keyboardType="number-pad"
          onChangeText={onSmartCardNumberChange}
          icon="keypad-outline"
          rightLabel={smartCardReady ? 'Ready' : undefined}
        />
      </FadeSlideIn> */}

      <FadeSlideIn delay={190}>
        <FlowInput
          label="Phone number"
          placeholder="Enter phone number"
          value={phoneNumber}
          keyboardType="phone-pad"
          onChangeText={onPhoneNumberChange}
          onFocus={onLowerFieldFocus}
          icon="call-outline"
          rightLabel={phoneVerified ? 'Verified' : undefined}
        />
      </FadeSlideIn>

      <FadeSlideIn delay={230}>
        <FlowInput
          label="Amount"
          placeholder="0.00"
          value={amount}
          keyboardType="decimal-pad"
          onChangeText={onAmountChange}
          onFocus={onLowerFieldFocus}
          icon="wallet-outline"
          prefix={currency}
        />
      </FadeSlideIn>

      <FadeSlideIn delay={270}>
        <View style={step.detailsFooter}>
          <ErrorText error={error} />
          <PrimaryButton
            label="Review details"
            onPress={onSubmit}
            icon="arrow-forward"
            disabled={!canReview}
          />
        </View>
      </FadeSlideIn>
    </View>
  );
}

function ReviewStep({
  subscriberNumber,
  smartCardNumber,
  phoneNumber,
  financials,
  onEdit,
  onContinue,
}: {
  subscriberNumber: string;
  smartCardNumber: string;
  phoneNumber: string;
  financials: ReturnType<typeof selectTransferFinancials>;
  onEdit: () => void;
  onContinue: () => void;
}) {
  return (
    <View style={step.wrap}>
      <FadeSlideIn delay={60}>
        <View style={rv.breakdown}>
          <View style={rv.breakdownHead}>
            <View>
              <Text style={rv.breakdownEyebrow}>Review</Text>
              <Text style={rv.breakdownTitle}>Payment details</Text>
            </View>
            <View style={rv.headIcon}>
              <Ionicons name="receipt-outline" size={19} color={CORAL} />
            </View>
          </View>

          <View style={rv.identityGrid}>
            <View style={rv.identityItem}>
              <Text style={rv.identityLabel}>Subscriber</Text>
              <Text style={rv.identityValue}>{subscriberNumber}</Text>
            </View>
            <View style={rv.identityItem}>
              <Text style={rv.identityLabel}>Smart card</Text>
              <Text style={rv.identityValue}>Last 4: {smartCardNumber}</Text>
            </View>
            <View style={[rv.identityItem, rv.identityWide]}>
              <Text style={rv.identityLabel}>Phone number</Text>
              <Text style={rv.identityValue}>{phoneNumber}</Text>
            </View>
          </View>

          <View style={rv.timeline}>
            <View style={rv.rail} />
            <TimelineItem
              accent="coral"
              label="Transfer amount"
              hint="Sent to the subscriber account"
              value={formatMoney(financials.currency, financials.amount)}
            />
            <TimelineItem
              accent="slate"
              label="Processing fee"
              hint="Network and settlement cost"
              value={formatMoney(financials.currency, financials.fee)}
            />
            <TimelineItem
              accent="green"
              label="VAT"
              hint="Tax applied to this transfer"
              value={formatMoney(financials.currency, financials.vat)}
            />
          </View>

          <View style={rv.totalPanel}>
            <Text style={rv.totalLabel}>TOTAL</Text>
            <Text style={rv.totalValue}>{formatMoney(financials.currency, financials.total)}</Text>
          </View>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={120}>
        <PrimaryButton label="Continue to payment" onPress={onContinue} icon="arrow-forward" />
        <SecondaryButton label="Edit details" onPress={onEdit} />
      </FadeSlideIn>
    </View>
  );
}

function TimelineItem({
  accent,
  label,
  hint,
  value,
}: {
  accent: 'coral' | 'slate' | 'green';
  label: string;
  hint: string;
  value: string;
}) {
  return (
    <View style={rv.timelineItem}>
      <View
        style={[
          rv.timelineDot,
          accent === 'coral' && rv.dotCoral,
          accent === 'slate' && rv.dotSlate,
          accent === 'green' && rv.dotGreen,
        ]}
      />
      <View style={rv.timelineCopy}>
        <Text style={rv.timelineLabel}>{label}</Text>
        <Text style={rv.timelineHint}>{hint}</Text>
      </View>
      <Text style={rv.timelineValue}>{value}</Text>
    </View>
  );
}

const rv = StyleSheet.create({
  breakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    gap: 18,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  breakdownHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  breakdownEyebrow: {color: CORAL, fontSize: 11, fontWeight: '800', fontFamily: getSystemFont('bold'), letterSpacing: 1.4, textTransform: 'uppercase'},
  breakdownTitle: {color: DARK, fontSize: 24, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.5, marginTop: 2},
  headIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  identityGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  identityItem: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: '#F7F9FC',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 3,
  },
  identityWide: {flexBasis: '100%'},
  identityLabel: {color: '#7B8491', fontSize: 11, fontWeight: '700', fontFamily: getSystemFont('bold')},
  identityValue: {color: DARK, fontSize: 12, fontWeight: '800', fontFamily: getSystemFont('bold')},
  timeline: {gap: 22, position: 'relative', paddingVertical: 3},
  rail: {
    position: 'absolute',
    left: 6,
    top: 12,
    bottom: 12,
    width: 1,
    backgroundColor: '#E4EAF1',
  },
  timelineItem: {flexDirection: 'row', alignItems: 'center', gap: 12},
  timelineDot: {width: 13, height: 13, borderRadius: 7, borderWidth: 3, borderColor: '#FFFFFF', zIndex: 1},
  dotCoral: {backgroundColor: CORAL},
  dotSlate: {backgroundColor: SLATE},
  dotGreen: {backgroundColor: GREEN},
  timelineCopy: {flex: 1, gap: 2},
  timelineLabel: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: getSystemFont('bold')},
  timelineHint: {color: '#8B95A3', fontSize: 11, fontFamily: SANS},
  timelineValue: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: getSystemFont('bold')},
  totalPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF1EA',
    borderRadius: 18,
    padding: 16,
  },
  totalLabel: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: getSystemFont('bold')},
  totalValue: {color: CORAL, fontSize: 20, fontWeight: '700', fontFamily: DISPLAY, letterSpacing: -0.3},
});

function PaymentMethodStep({
  error,
  onSelect,
  onBack,
}: {
  error: string | null;
  onSelect: (method: 'mobileMoney' | 'card') => void;
  onBack: () => void;
}) {
  return (
    <View style={step.wrap}>
      <FadeSlideIn delay={60}>
        <SectionHead
          title="How would you like to pay?"
          sub="Choose your preferred payment method below"
        />
      </FadeSlideIn>

      <FadeSlideIn delay={120}>
        <OptionCard
          icon="phone-portrait-outline"
          title="Mobile money"
          body="Pay instantly via mobile wallet - Orange, Mpesa, Airtel and more"
          badge="Instant"
          onPress={() => onSelect('mobileMoney')}
        />
      </FadeSlideIn>

      <FadeSlideIn delay={170}>
        <OptionCard
          icon="card-outline"
          title="Card payment"
          body="Visa, Mastercard or any credit / debit card"
          onPress={() => onSelect('card')}
        />
      </FadeSlideIn>

      <FadeSlideIn delay={220}>
        <ErrorText error={error} />
        <SecondaryButton label="Back to summary" onPress={onBack} />
      </FadeSlideIn>
    </View>
  );
}

function MobileMoneyStep({
  enabledTelcos,
  selectedTelco,
  mobileNumber,
  error,
  total,
  onSelectTelco,
  onMobileNumberChange,
  onSubmit,
  onBack,
}: {
  enabledTelcos: PaymentTelcoId[];
  selectedTelco: PaymentTelcoId | null;
  mobileNumber: string;
  error: string | null;
  total: string;
  onSelectTelco: (telco: PaymentTelcoId) => void;
  onMobileNumberChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const canPay = Boolean(selectedTelco && mobileNumber.trim());

  return (
    <View style={step.wrap}>
      <FadeSlideIn delay={60}>
        <SectionHead
          title="Mobile money"
          sub="Select your network and enter the wallet number to debit"
        />
      </FadeSlideIn>

      <FadeSlideIn delay={110}>
        <View style={mm.networkSection}>
          <Text style={mm.networkLabel}>Select network</Text>
          <View style={mm.networkRow}>
            {enabledTelcos.map(telco => {
              const active = selectedTelco === telco;
              return (
                <Pressable
                  key={telco}
                  onPress={() => onSelectTelco(telco)}
                  style={[mm.network, active && mm.networkActive]}>
                  <View style={[mm.networkDot, active && mm.networkDotActive]} />
                  <Text style={[mm.networkText, active && mm.networkTextActive]}>
                    {PAYMENT_TELCOS[telco].label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={160}>
        <FlowInput
          label="Wallet number"
          placeholder="Enter mobile money number"
          value={mobileNumber}
          keyboardType="phone-pad"
          onChangeText={onMobileNumberChange}
          icon="phone-portrait-outline"
        />
      </FadeSlideIn>

      <FadeSlideIn delay={200}>
        <View style={mm.notice}>
          <Ionicons name="information-circle-outline" size={16} color={SLATE} />
          <Text style={mm.noticeText}>
            You will receive a push prompt on your phone to authorise this payment.
          </Text>
        </View>
      </FadeSlideIn>

      <FadeSlideIn delay={240}>
        <SummaryCard>
          <SummaryRow label="Amount to pay" value={total} strong />
        </SummaryCard>
      </FadeSlideIn>

      <FadeSlideIn delay={280}>
        <ErrorText error={error} />
        <PrimaryButton
          label={`Pay ${total}`}
          onPress={onSubmit}
          icon="lock-closed-outline"
          disabled={!canPay}
        />
        <SecondaryButton label="Change payment method" onPress={onBack} />
      </FadeSlideIn>
    </View>
  );
}

const mm = StyleSheet.create({
  networkSection: {gap: 10},
  networkLabel: {color: DARK, fontSize: 13, fontWeight: '700', fontFamily: getSystemFont('bold')},
  networkRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  network: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: '#E8EDF2',
    backgroundColor: '#FFFFFF',
  },
  networkActive: {borderColor: DARK, backgroundColor: DARK},
  networkDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D9E0'},
  networkDotActive: {backgroundColor: CORAL},
  networkText: {color: SLATE, fontSize: 13, fontWeight: '700', fontFamily: getSystemFont('bold')},
  networkTextActive: {color: '#FFFFFF'},
  notice: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#EEF2F7',
    borderRadius: 14,
    padding: 14,
  },
  noticeText: {flex: 1, color: SLATE, fontSize: 12, fontFamily: SANS, lineHeight: 18},
});

function CardRedirectStep({onBack}: {onBack: () => void}) {
  return (
    <View style={step.wrap}>
      <FadeSlideIn delay={60}>
        <SectionHead
          title="Secure card checkout"
          sub="You will be redirected to our PCI-compliant payment page to complete this transaction."
        />
      </FadeSlideIn>
      <FadeSlideIn delay={120}>
        <View style={cd.lockCard}>
          <View style={cd.lockIcon}>
            <Ionicons name="lock-closed" size={28} color={CORAL} />
          </View>
          <Text style={cd.lockTitle}>256-bit SSL encrypted</Text>
          <Text style={cd.lockSub}>Your card details are never stored on our servers</Text>
        </View>
      </FadeSlideIn>
      <FadeSlideIn delay={180}>
        <SecondaryButton label="Back to payment methods" onPress={onBack} />
      </FadeSlideIn>
    </View>
  );
}

const cd = StyleSheet.create({
  lockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  lockIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  lockTitle: {color: DARK, fontSize: 16, fontWeight: '700', fontFamily: SERIF, textAlign: 'center'},
  lockSub: {color: '#6B7280', fontSize: 13, fontFamily: SANS, textAlign: 'center', lineHeight: 18},
});

function ConfirmationStep({
  providerName,
  onVerify,
  onFail,
}: {
  providerName: string;
  onVerify: () => void;
  onFail: () => void;
}) {
  return (
    <View style={step.wrap}>
      <FadeSlideIn delay={60}>
        <SectionHead
          title="Awaiting payment"
          sub={`Check your phone for the ${providerName} payment prompt and approve it.`}
        />
      </FadeSlideIn>
      <FadeSlideIn delay={120}>
        <View style={cf.pulseWrap}>
          <PulseRing />
          <View style={cf.pulseCenter}>
            <Ionicons name="phone-portrait-outline" size={30} color={CORAL} />
          </View>
        </View>
        <Text style={cf.pulseLabel}>Waiting for approval on your device...</Text>
      </FadeSlideIn>
      <FadeSlideIn delay={200}>
        <PrimaryButton label="I have approved the payment" onPress={onVerify} icon="checkmark" />
        <SecondaryButton label="Payment did not come through?" onPress={onFail} />
      </FadeSlideIn>
    </View>
  );
}

const cf = StyleSheet.create({
  pulseWrap: {alignItems: 'center', justifyContent: 'center', height: 130, marginVertical: 12},
  pulseCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseLabel: {color: '#9CA3AF', fontSize: 13, fontFamily: SANS, textAlign: 'center', marginTop: 4},
});

function ResultStep({
  success,
  title,
  body,
  onDone,
}: {
  success?: boolean;
  title: string;
  body: string;
  onDone: () => void;
}) {
  const scale = React.useRef(new Animated.Value(0.5)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 12, stiffness: 150}).start();
    Animated.timing(opacity, {toValue: 1, duration: 300, useNativeDriver: true}).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={[step.wrap, {opacity}]}>
      <View style={rs.center}>
        <Animated.View style={[rs.iconWrap, success ? rs.success : rs.failed, {transform: [{scale}]}]}>
          <View style={[rs.iconRing, success ? rs.successRing : rs.failedRing]} />
          <Ionicons name={success ? 'checkmark' : 'close'} size={36} color="#FFFFFF" />
        </Animated.View>
        <Text style={rs.title}>{title}</Text>
        <Text style={rs.body}>{body}</Text>
      </View>
      <PrimaryButton
        label={success ? 'All done!' : 'Try again'}
        onPress={onDone}
        icon={success ? 'home-outline' : 'refresh-outline'}
      />
    </Animated.View>
  );
}

const rs = StyleSheet.create({
  center: {alignItems: 'center', gap: 12, paddingVertical: 24},
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  iconRing: {
    position: 'absolute',
    inset: -10,
    borderRadius: 50,
    borderWidth: 1.5,
    opacity: 0.25,
  },
  success: {backgroundColor: GREEN},
  failed: {backgroundColor: RED},
  successRing: {borderColor: GREEN},
  failedRing: {borderColor: RED},
  title: {color: DARK, fontSize: 24, fontWeight: '700', fontFamily: SERIF, textAlign: 'center', letterSpacing: -0.4},
  body: {color: '#6B7280', fontSize: 14, fontFamily: SANS, textAlign: 'center', lineHeight: 21, maxWidth: 280},
});

const step = StyleSheet.create({
  wrap: {gap: 20},
  detailsFooter: {marginTop: 22},
});

function EmptyFlow({onClose}: {onClose: () => void}) {
  return (
    <View style={ef.root}>
      <Ionicons name="alert-circle-outline" size={48} color="#D1D9E0" />
      <Text style={ef.title}>No active session</Text>
      <PrimaryButton label="Close" onPress={onClose} />
    </View>
  );
}

const ef = StyleSheet.create({
  root: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, backgroundColor: OFF},
  title: {color: DARK, fontSize: 18, fontWeight: '700', fontFamily: SERIF},
});

const CARD_RADIUS = 36;

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: CORAL},
  hero: {
    backgroundColor: CORAL,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 86,
    position: 'relative',
    overflow: 'hidden',
  },
  ringOuter: {
    position: 'absolute',
    top: -30,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 32,
    borderColor: 'rgba(61,74,92,0.15)',
  },
  ringInner: {
    position: 'absolute',
    top: 24,
    right: 14,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(61,74,92,0.3)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  flowTag: {color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: getSystemFont('bold')},
  headWrap: {gap: 10, marginBottom: 20},
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.11)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  providerDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: OFF},
  providerLabel: {color: 'rgba(255,255,255,0.78)', fontSize: 12, fontWeight: '700', fontFamily: getSystemFont('bold'), letterSpacing: 0.5},
  heroRule: {width: 36, height: 3, backgroundColor: DARK, borderRadius: 2},
  curveShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -14},
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 22,
  },
  card: {
    flex: 1,
    backgroundColor: OFF,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    marginTop: -CARD_RADIUS,
    paddingTop: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D9E0',
    alignSelf: 'center',
    marginBottom: 8,
  },
  scroll: {flex: 1},
  scrollContent: {flexGrow: 1, padding: 24, paddingBottom: 72},
  detailsScrollContent: {paddingBottom: 280},
});
