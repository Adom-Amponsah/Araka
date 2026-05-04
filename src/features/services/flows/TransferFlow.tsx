import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {PAYMENT_TELCOS, PaymentTelcoId} from '../registry/serviceRegistry';
import {useServiceSessionStore} from '../store/serviceSessionStore';
import {
  selectTransferFinancials,
  useTransferFlowStore,
} from '../store/transferFlowStore';

const {height} = Dimensions.get('window');

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK = '#1A2535';
const OFF = '#F4F6FA';
const GREEN = '#10B981';
const RED = '#EF4444';
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const SANS = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';
const SHEET_RADIUS = 30;

const formatMoney = (currency: string, amount: number) =>
  `${currency} ${amount.toFixed(2)}`;

export function TransferFlow() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const closeServiceSession = useServiceSessionStore(s => s.closeServiceSession);
  const store = useTransferFlowStore();
  const financials = selectTransferFinancials(store);
  const provider = store.session?.provider;

  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 24,
        stiffness: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [backdropAnim, slideAnim]);

  const closeFlow = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      store.reset();
      closeServiceSession();
      navigation.goBack();
    });
  };

  if (!provider) {
    return (
      <OverlayFrame
        title="No service"
        subtitle="This payment session is no longer active."
        onClose={closeFlow}
        slideAnim={slideAnim}
        backdropAnim={backdropAnim}
        bottomInset={insets.bottom}>
        <PrimaryButton label="Close" onPress={closeFlow} />
      </OverlayFrame>
    );
  }

  const stepLabel = {
    details: 'Transaction Details',
    review: 'Payment Summary',
    paymentMethod: 'Payment Method',
    mobileMoneyDetails: 'Select Wallet',
    cardRedirect: 'Card Payment',
    paymentConfirmation: 'Transaction Processing',
    success: 'Transaction Successful',
    failed: 'Transaction Failed',
  }[store.step];

  return (
    <OverlayFrame
      title="Transfer"
      subtitle={stepLabel}
      onClose={closeFlow}
      slideAnim={slideAnim}
      backdropAnim={backdropAnim}
      bottomInset={insets.bottom}>
      <ProviderHeader
        icon={provider.icon}
        iconBg={provider.iconBg}
        iconColor={provider.iconColor}
        title={provider.name}
        subtitle="Mobile money transfer"
      />

      {store.step === 'details' && (
        <DetailsStep
          subscriberNumber={store.subscriberNumber}
          smartCardNumber={store.smartCardNumber}
          phoneNumber={store.phoneNumber}
          amount={store.amount}
          error={store.error}
          onSubscriberNumberChange={store.setSubscriberNumber}
          onSmartCardNumberChange={store.setSmartCardNumber}
          onPhoneNumberChange={store.setPhoneNumber}
          onAmountChange={store.setAmount}
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
        />
      )}

      {store.step === 'success' && (
        <ResultStep
          success
          title="Payment Successful"
          body="Your transfer payment was completed successfully."
          ctaLabel="Done"
          onDone={closeFlow}
        />
      )}

      {store.step === 'failed' && (
        <ResultStep
          title="Transaction Failed"
          body={store.error || 'Your payment could not be completed.'}
          ctaLabel="Try Again"
          onDone={store.backToPaymentMethod}
        />
      )}
    </OverlayFrame>
  );
}

function OverlayFrame({
  title,
  subtitle,
  children,
  onClose,
  slideAnim,
  backdropAnim,
  bottomInset,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onClose: () => void;
  slideAnim: Animated.Value;
  backdropAnim: Animated.Value;
  bottomInset: number;
}) {
  return (
    <View style={styles.overlayRoot}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, {opacity: backdropAnim}]} />
      </TouchableWithoutFeedback>

      <View style={styles.flowCanvas}>
        <View style={styles.ringOuter} />
        <View style={styles.ringInner} />
        <View style={styles.heroBar}>
          <View style={styles.wordRow}>
            <View style={styles.wordDot} />
            <Text style={styles.wordmark}>ARAKA</Text>
          </View>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.heroSub}>Secure money movement</Text>
          <Text style={styles.heroTitle}>Transfer.</Text>
          <View style={styles.heroRule} />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
        pointerEvents="box-none"
        style={styles.keyboardLayer}>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{translateY: slideAnim}],
              paddingBottom: Math.max(bottomInset, 18),
            },
          ]}>
          <View style={styles.handle} />
          <View style={styles.sheetHead}>
            <View>
              <Text style={styles.sheetTitle}>{title}</Text>
              <Text style={styles.sheetSub}>{subtitle}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={16} color="#9CA3AF" />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetScroll}>
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

function ProviderHeader({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
}: {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.providerCard}>
      <View style={[styles.providerIcon, {backgroundColor: iconBg}]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={styles.providerInfo}>
        <Text style={styles.providerTitle}>{title}</Text>
        <Text style={styles.providerSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

function DetailsStep({
  subscriberNumber,
  smartCardNumber,
  phoneNumber,
  amount,
  error,
  onSubscriberNumberChange,
  onSmartCardNumberChange,
  onPhoneNumberChange,
  onAmountChange,
  onSubmit,
}: {
  subscriberNumber: string;
  smartCardNumber: string;
  phoneNumber: string;
  amount: string;
  error: string | null;
  onSubscriberNumberChange: (value: string) => void;
  onSmartCardNumberChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View style={styles.block}>
      <Field
        icon="person-outline"
        label="Subscriber Number"
        placeholder="Enter subscriber number"
        value={subscriberNumber}
        onChangeText={onSubscriberNumberChange}
      />
      <Field
        icon="keypad-outline"
        label="Smart Card Number"
        placeholder="Last 4 digits only"
        value={smartCardNumber}
        keyboardType="number-pad"
        onChangeText={onSmartCardNumberChange}
      />
      <Field
        icon="call-outline"
        label="Phone Number"
        placeholder="Enter phone number"
        value={phoneNumber}
        keyboardType="phone-pad"
        onChangeText={onPhoneNumberChange}
      />
      <Field
        icon="cash-outline"
        label="Amount"
        placeholder={phoneNumber ? 'Enter amount' : 'Enter phone number first'}
        value={amount}
        keyboardType="decimal-pad"
        onChangeText={onAmountChange}
      />
      <ErrorText error={error} />
      <PrimaryButton label="Review Details" onPress={onSubmit} />
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
    <View style={styles.block}>
      <View style={styles.reviewHero}>
        <View style={styles.reviewIcon}>
          <Ionicons name="receipt-outline" size={22} color={CORAL} />
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.reviewTitle}>Payment Summary</Text>
          <Text style={styles.reviewSub}>Check the transfer details before selecting how to pay.</Text>
        </View>
      </View>
      <SummaryCard>
        <SummaryRow label="Subscriber Number" value={subscriberNumber} />
        <SummaryRow label="Smart Card" value={`Last 4: ${smartCardNumber}`} />
        <SummaryRow label="Phone Number" value={phoneNumber} />
        <SummaryRow label="Amount" value={formatMoney(financials.currency, financials.amount)} />
        <SummaryRow label="Processing Fee" value={formatMoney(financials.currency, financials.fee)} />
        <SummaryRow label="VAT" value={formatMoney(financials.currency, financials.vat)} />
        <SummaryRow label="Total Amount" value={formatMoney(financials.currency, financials.total)} highlight />
      </SummaryCard>
      <PrimaryButton label="Choose Payment Method" onPress={onContinue} />
      <GhostButton label="Edit Details" onPress={onEdit} />
    </View>
  );
}

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
    <View style={styles.block}>
      <Text style={styles.groupLabel}>Choose Payment Method</Text>
      <OptionRow
        icon="phone-portrait-outline"
        title="Mobile Money"
        subtitle="Fast and secure mobile payments"
        onPress={() => onSelect('mobileMoney')}
      />
      <OptionRow
        icon="card-outline"
        title="Card Payment"
        subtitle="Pay with credit/debit card"
        onPress={() => onSelect('card')}
      />
      <ErrorText error={error} />
      <GhostButton label="Back to Summary" onPress={onBack} />
    </View>
  );
}

function MobileMoneyStep({
  enabledTelcos,
  selectedTelco,
  mobileNumber,
  error,
  onSelectTelco,
  onMobileNumberChange,
  onSubmit,
  onBack,
}: {
  enabledTelcos: PaymentTelcoId[];
  selectedTelco: PaymentTelcoId | null;
  mobileNumber: string;
  error: string | null;
  onSelectTelco: (telco: PaymentTelcoId) => void;
  onMobileNumberChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <View style={styles.block}>
      <Text style={styles.groupLabel}>Select Wallet</Text>
      <View style={styles.walletList}>
        {enabledTelcos.map(telco => {
          const selected = selectedTelco === telco;
          return (
            <Pressable
              key={telco}
              onPress={() => onSelectTelco(telco)}
              style={[styles.walletCard, selected && styles.walletCardActive]}>
              <View style={styles.walletMark}>
                <Text style={styles.walletInitial}>{PAYMENT_TELCOS[telco].label.slice(0, 1)}</Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.walletTitle}>{PAYMENT_TELCOS[telco].label}</Text>
                <Text style={styles.walletSub}>Send confirmation prompt to this wallet</Text>
              </View>
              <View style={[styles.walletCheck, selected && styles.walletCheckActive]}>
                {selected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.promptCard}>
        <Field
          icon="phone-portrait-outline"
          label="Mobile Number"
          placeholder="243810000002"
          value={mobileNumber}
          keyboardType="phone-pad"
          onChangeText={onMobileNumberChange}
        />
        <Text style={styles.helper}>You'll receive a confirmation prompt on your mobile device.</Text>
      </View>
      <ErrorText error={error} />
      <PrimaryButton label="Complete Payment" onPress={onSubmit} />
      <GhostButton label="Back" onPress={onBack} />
    </View>
  );
}

function CardRedirectStep({onBack}: {onBack: () => void}) {
  return (
    <View style={styles.centerBlock}>
      <View style={styles.statusHalo}>
        <Ionicons name="card-outline" size={30} color={CORAL} />
      </View>
      <Text style={styles.resultTitle}>Secure card checkout</Text>
      <Text style={styles.resultBody}>Card payments will route to the payment processor once that integration is connected.</Text>
      <GhostButton label="Back to Payment Methods" onPress={onBack} />
    </View>
  );
}

function ConfirmationStep({
  providerName,
  onVerify,
}: {
  providerName: string;
  onVerify: () => void;
}) {
  return (
    <View style={styles.centerBlock}>
      <View style={styles.spinner}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <View
            key={i}
            style={[
              styles.spinnerDot,
              {
                opacity: 1 - i * 0.12,
                transform: [{rotate: `${i * 60}deg`}, {translateY: -18}],
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.resultTitle}>Processing your transaction</Text>
      <Text style={styles.resultBody}>Please wait while we check your {providerName} payment status.</Text>
      <PrimaryButton label="I've Completed the Payment" onPress={onVerify} />
    </View>
  );
}

function ResultStep({
  success,
  title,
  body,
  ctaLabel,
  onDone,
}: {
  success?: boolean;
  title: string;
  body: string;
  ctaLabel: string;
  onDone: () => void;
}) {
  return (
    <View style={styles.centerBlock}>
      <View style={[styles.resultHalo, success ? styles.successHalo : styles.failedHalo]}>
        <Ionicons name={success ? 'checkmark-circle' : 'close-circle'} size={36} color={success ? GREEN : RED} />
      </View>
      <Text style={styles.resultTitle}>{title}</Text>
      <Text style={styles.resultBody}>{body}</Text>
      <PrimaryButton label={ctaLabel} onPress={onDone} />
      {success && <GhostButton label="View Transaction" onPress={onDone} />}
    </View>
  );
}

function Field({
  icon,
  label,
  ...props
}: {
  icon: string;
  label: string;
  placeholder: string;
  value: string;
  keyboardType?: 'default' | 'decimal-pad' | 'phone-pad' | 'number-pad';
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputShell}>
        <Ionicons name={icon as any} size={16} color={CORAL} />
        <TextInput
          {...props}
          placeholderTextColor="#A3ACB9"
          selectionColor={CORAL}
          style={styles.input}
        />
      </View>
    </View>
  );
}

function SummaryCard({children, compact}: {children: React.ReactNode; compact?: boolean}) {
  return <View style={[styles.summaryCard, compact && styles.summaryCompact]}>{children}</View>;
}

function SummaryRow({label, value, highlight}: {label: string; value: string; highlight?: boolean}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, highlight && styles.summaryHighlight]}>{value}</Text>
    </View>
  );
}

function OptionRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.optionRow}>
      <View style={styles.optionIcon}>
        <Ionicons name={icon as any} size={18} color={CORAL} />
      </View>
      <View style={styles.providerInfo}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color="#C4CDD8" />
    </Pressable>
  );
}

function PrimaryButton({label, onPress}: {label: string; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryText}>{label}</Text>
    </Pressable>
  );
}

function GhostButton({label, onPress}: {label: string; onPress: () => void}) {
  return (
    <Pressable onPress={onPress} style={styles.ghostButton}>
      <Text style={styles.ghostText}>{label}</Text>
    </Pressable>
  );
}

function ErrorText({error}: {error: string | null}) {
  return error ? <Text style={styles.error}>{error}</Text> : null;
}

const styles = StyleSheet.create({
  overlayRoot: {flex: 1, justifyContent: 'flex-end'},
  keyboardLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(26,37,53,0.42)',
  },
  flowCanvas: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: SLATE,
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  ringOuter: {
    position: 'absolute',
    top: -28,
    right: -48,
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 32,
    borderColor: 'rgba(242,118,73,0.10)',
  },
  ringInner: {
    position: 'absolute',
    top: 22,
    right: 12,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(242,118,73,0.22)',
  },
  heroBar: {marginBottom: 30},
  wordRow: {flexDirection: 'row', alignItems: 'center', gap: 7},
  wordDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: CORAL},
  wordmark: {color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 4, fontFamily: SANS},
  heroCopy: {marginTop: 4},
  heroSub: {color: 'rgba(255,255,255,0.42)', fontSize: 14, fontFamily: SANS, letterSpacing: 0.4, marginBottom: 4},
  heroTitle: {color: '#FFFFFF', fontSize: 40, fontWeight: '700', fontFamily: SERIF, letterSpacing: -1, lineHeight: 44},
  heroRule: {width: 36, height: 3, backgroundColor: CORAL, borderRadius: 2, marginTop: 12},
  sheet: {
    maxHeight: height * 0.9,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingHorizontal: 18,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -12},
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 28,
  },
  handle: {width: 38, height: 4, borderRadius: 2, backgroundColor: '#D1D9E0', alignSelf: 'center', marginBottom: 18},
  sheetHead: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  sheetTitle: {color: DARK, fontSize: 20, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.5},
  sheetSub: {color: '#9CA3AF', fontSize: 12, fontFamily: SANS, marginTop: 3},
  closeBtn: {width: 30, height: 30, borderRadius: 15, backgroundColor: OFF, alignItems: 'center', justifyContent: 'center'},
  sheetScroll: {paddingBottom: 10},
  providerCard: {flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FAFBFD', borderWidth: 1, borderColor: '#EEF1F5', borderRadius: 18, padding: 12, marginBottom: 14},
  providerIcon: {width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  providerInfo: {flex: 1},
  providerTitle: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: SANS},
  providerSub: {color: '#9CA3AF', fontSize: 11, fontFamily: SANS, marginTop: 2},
  block: {gap: 12},
  field: {gap: 7},
  fieldLabel: {color: DARK, fontSize: 12, fontWeight: '800', fontFamily: SANS},
  inputShell: {height: 48, borderRadius: 14, borderWidth: 1, borderColor: '#E8EDF2', backgroundColor: '#F8FAFC', flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12},
  input: {flex: 1, padding: 0, color: DARK, fontSize: 14, fontFamily: SANS},
  summaryCard: {backgroundColor: OFF, borderRadius: 16, padding: 13, gap: 9},
  summaryCompact: {paddingVertical: 10},
  summaryTitle: {color: DARK, fontSize: 14, fontWeight: '800', fontFamily: SANS, marginBottom: 2},
  reviewHero: {flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF8F4', borderWidth: 1, borderColor: '#FFE0D1', borderRadius: 18, padding: 13},
  reviewIcon: {width: 42, height: 42, borderRadius: 15, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'},
  reviewTitle: {color: DARK, fontSize: 15, fontWeight: '900', fontFamily: SANS},
  reviewSub: {color: '#8A94A6', fontSize: 11, lineHeight: 16, fontFamily: SANS, marginTop: 2},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  summaryLabel: {color: '#8A94A6', fontSize: 12, fontFamily: SANS},
  summaryValue: {color: DARK, fontSize: 12, fontWeight: '700', fontFamily: SANS},
  summaryHighlight: {color: CORAL, fontSize: 13, fontWeight: '900'},
  groupLabel: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: SANS, marginTop: 2},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 13, borderWidth: 1, borderColor: '#EEF1F5', backgroundColor: '#FFFFFF'},
  optionIcon: {width: 38, height: 38, borderRadius: 13, backgroundColor: '#FFF1EA', alignItems: 'center', justifyContent: 'center'},
  optionTitle: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: SANS},
  optionSub: {color: '#9CA3AF', fontSize: 11, fontFamily: SANS, marginTop: 2},
  walletList: {gap: 8},
  walletCard: {flexDirection: 'row', alignItems: 'center', gap: 11, borderRadius: 18, padding: 13, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8EDF2'},
  walletCardActive: {borderColor: CORAL, backgroundColor: '#FFF8F4', shadowColor: CORAL, shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.1, shadowRadius: 12, elevation: 2},
  walletMark: {width: 38, height: 38, borderRadius: 14, backgroundColor: '#F1F4F8', alignItems: 'center', justifyContent: 'center'},
  walletInitial: {color: DARK, fontSize: 13, fontWeight: '900', fontFamily: SANS},
  walletCheck: {width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#D5DCE5', alignItems: 'center', justifyContent: 'center'},
  walletCheckActive: {backgroundColor: CORAL, borderColor: CORAL},
  walletTitle: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: SANS},
  walletSub: {color: '#9CA3AF', fontSize: 11, fontFamily: SANS},
  promptCard: {gap: 8, backgroundColor: '#FAFBFD', borderRadius: 18, borderWidth: 1, borderColor: '#EEF1F5', padding: 12},
  helper: {color: '#8A94A6', fontSize: 12, lineHeight: 18, fontFamily: SANS},
  centerBlock: {alignItems: 'center', gap: 12, paddingVertical: 12},
  statusHalo: {width: 70, height: 70, borderRadius: 24, backgroundColor: '#FFF1EA', alignItems: 'center', justifyContent: 'center'},
  spinner: {width: 70, height: 70, alignItems: 'center', justifyContent: 'center'},
  spinnerDot: {position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: CORAL},
  resultHalo: {width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center'},
  successHalo: {backgroundColor: '#EAFBF4'},
  failedHalo: {backgroundColor: '#FEF2F2'},
  resultTitle: {color: DARK, fontSize: 18, fontWeight: '800', textAlign: 'center', fontFamily: SANS},
  resultBody: {color: '#8A94A6', fontSize: 12, lineHeight: 18, textAlign: 'center', fontFamily: SANS},
  primaryButton: {backgroundColor: CORAL, borderRadius: 13, paddingVertical: 14, alignItems: 'center', marginTop: 2, alignSelf: 'stretch', shadowColor: CORAL, shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.18, shadowRadius: 12, elevation: 5},
  primaryText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800', fontFamily: SANS},
  ghostButton: {paddingVertical: 11, alignItems: 'center', alignSelf: 'stretch'},
  ghostText: {color: CORAL, fontSize: 12, fontWeight: '800', fontFamily: SANS},
  error: {color: RED, fontSize: 12, fontWeight: '700', fontFamily: SANS},
});
