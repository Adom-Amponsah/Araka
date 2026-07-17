import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {
  useAirtimeTopupFlowStore,
} from '../store/airtimeTopupFlowStore';
import {useServiceSessionStore} from '../store/serviceSessionStore';

const CORAL = '#F27649';
const DARK = '#1A2535';
const SERIF = getSystemFont('medium');
const SANS = getSystemFont();

const formatMoney = (amount: number) => `$${amount.toFixed(2)}`;

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('243')) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 9);
  if (digits.length === 0) return '+243';
  if (digits.length <= 2) return `+243 ${digits}`;
  if (digits.length <= 5) return `+243 ${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `+243 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
}

// ─────────────────────────────────────────────
// Bottom sheet shell
// ─────────────────────────────────────────────
function BottomSheet({
  visible,
  onClose,
  children,
  closable = true,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closable?: boolean;
}) {
  const slideAnim = React.useRef(new Animated.Value(420)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 260,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 420,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdropAnim, slideAnim, visible]);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={closable ? onClose : undefined}>
      {closable && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[bs.backdrop, {opacity: backdropAnim}]} />
        </TouchableWithoutFeedback>
      )}
      {!closable && (
        <Animated.View style={[bs.backdrop, {opacity: backdropAnim}]} />
      )}
      <Animated.View
        style={[
          bs.sheet,
          {
            transform: [{translateY: slideAnim}],
            paddingBottom: Math.max(insets.bottom, 22),
          },
        ]}>
        {children}
      </Animated.View>
    </Modal>
  );
}

// ─────────────────────────────────────────────
// Details sheet (bottom sheet)
// ─────────────────────────────────────────────
function DetailsSheet({
  visible,
  onClose,
  phoneNumber,
  amount,
  error,
  onPhoneChange,
  onAmountChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  phoneNumber: string;
  amount: string;
  error: string | null;
  onPhoneChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const session = useAirtimeTopupFlowStore(s => s.session);
  const provider = session?.provider;
  const providerIcon = provider?.icon ?? 'phone-portrait-outline';
  const providerIconBg = provider?.iconBg ?? '#FEE8DF';
  const providerIconColor = provider?.iconColor ?? '#E53E3E';

  const [phoneFocused, setPhoneFocused] = React.useState(false);
  const [amountFocused, setAmountFocused] = React.useState(false);

  const numeric = parseFloat(amount) || 0;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={d.dragHandle} />

      <View style={d.header}>
        <View style={d.headerLeft}>
          <View style={[d.iconBadge, {backgroundColor: providerIconBg}]}>
            <Ionicons name={providerIcon as any} size={20} color={providerIconColor} />
          </View>
          <View>
            <Text style={d.title}>Recharge</Text>
            <Text style={d.subtitle}>Enter the recharge details</Text>
          </View>
        </View>
        <Pressable onPress={onClose} style={d.closeBtn}>
          <Ionicons name="close" size={20} color="#8A94A6" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={d.label}>Phone number</Text>
        <View style={[d.inputWrap, {borderColor: phoneFocused ? CORAL : '#E6EBF1'}]}>
          <Ionicons name="call-outline" size={18} color={phoneFocused ? CORAL : '#9CA3AF'} />
          <TextInput
            value={phoneNumber}
            onChangeText={text => onPhoneChange(formatPhone(text))}
            placeholder="+243 81 234 5678"
            placeholderTextColor="#C4CDD8"
            keyboardType="phone-pad"
            selectionColor={CORAL}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            style={d.input}
          />
        </View>

        <Text style={d.label}>Amount</Text>
        <View style={[d.inputWrap, {borderColor: amountFocused ? CORAL : '#E6EBF1'}]}>
          <Ionicons name="cash-outline" size={18} color={amountFocused ? CORAL : '#9CA3AF'} />
          <TextInput
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Enter amount"
            placeholderTextColor="#C4CDD8"
            keyboardType="decimal-pad"
            selectionColor={CORAL}
            onFocus={() => setAmountFocused(true)}
            onBlur={() => setAmountFocused(false)}
            style={d.input}
          />
          <View style={d.currency}>
            <Text style={d.currencyText}>USD</Text>
            <Ionicons name="chevron-down" size={14} color="#8A94A6" />
          </View>
        </View>

        <View style={d.presets}>
          {['1', '5', '10', '20'].map(amt => (
            <Pressable
              key={amt}
              onPress={() => onAmountChange(amt)}
              style={[d.preset, amount === amt && d.presetActive]}>
              <Text style={[d.presetText, amount === amt && d.presetTextActive]}>${amt}</Text>
            </Pressable>
          ))}
        </View>

        {error ? <Text style={d.error}>{error}</Text> : null}

        <Pressable
          onPress={onSubmit}
          disabled={numeric <= 0}
          style={[d.cta, numeric <= 0 && d.ctaDisabled]}>
          <Text style={d.ctaText}>Continue</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
}

const d = StyleSheet.create({
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6EBF1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 4,
  },
  subtitle: {
    color: '#8A94A6',
    fontSize: 12,
    fontFamily: SANS,
  },
  closeBtn: {
    padding: 4,
  },
  label: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E6EBF1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 16,
    fontFamily: SANS,
    padding: 0,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyText: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  presets: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  preset: {
    borderWidth: 1,
    borderColor: '#FFE8DE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8F5',
  },
  presetActive: {
    backgroundColor: CORAL,
    borderColor: CORAL,
  },
  presetText: {
    color: CORAL,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: getSystemFont('medium'),
    marginBottom: 12,
  },
});

// ─────────────────────────────────────────────
// Review sheet
// ─────────────────────────────────────────────
function ReviewSheet({
  visible,
  onClose,
  onPay,
  phoneNumber,
  financials,
}: {
  visible: boolean;
  onClose: () => void;
  onPay: () => void;
  phoneNumber: string;
  financials: {amount: number; fee: number; total: number; currency: string};
}) {
  const session = useAirtimeTopupFlowStore(s => s.session);
  const provider = session?.provider;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={bs.handle} />
      <Pressable onPress={onClose} style={bs.closeBtn}>
        <Ionicons name="close" size={22} color="#8A94A6" />
      </Pressable>

      <Text style={bs.title}>Payment Summary</Text>
      <Text style={bs.subtitle}>
        Please verify the information before confirming.
      </Text>

      <View style={bs.providerCard}>
        <View
          style={[
            bs.providerIcon,
            {backgroundColor: provider?.iconBg ?? '#FEE8DF'},
          ]}>
          <Ionicons
            name={(provider?.icon ?? 'phone-portrait-outline') as any}
            size={22}
            color={provider?.iconColor ?? '#E53E3E'}
          />
        </View>
        <View style={bs.providerInfo}>
          <Text style={bs.providerName}>{provider?.name ?? 'Vodacom'} Airtime</Text>
          <Text style={bs.providerSub}>{provider?.sub ?? 'Recharge mobile balance'}</Text>
          <Text style={bs.providerPhone}>{phoneNumber}</Text>
        </View>
      </View>

      <View style={bs.summaryCard}>
        <View style={bs.summaryRow}>
          <Text style={bs.summaryLabel}>Amount</Text>
          <Text style={bs.summaryValue}>
            {formatMoney(financials.amount)}
          </Text>
        </View>
        <View style={bs.summaryRow}>
          <Text style={bs.summaryLabel}>Fee</Text>
          <Text style={bs.summaryValue}>
            {formatMoney(financials.fee)}
          </Text>
        </View>
        <View style={[bs.summaryRow, bs.totalRow]}>
          <Text style={bs.summaryLabel}>Total</Text>
          <Text style={bs.totalValue}>
            {formatMoney(financials.total)}
          </Text>
        </View>
      </View>

      <Text style={bs.note}>
        ARAKA applies a fixed 1% fee to all purchases.
      </Text>

      <Pressable onPress={onPay} style={bs.payBtn}>
        <Text style={bs.payBtnText}>
          Pay {formatMoney(financials.total)}
        </Text>
      </Pressable>
    </BottomSheet>
  );
}

// ─────────────────────────────────────────────
// Processing sheet
// ─────────────────────────────────────────────
function ProcessingSheet({
  visible,
  phoneNumber,
  financials,
}: {
  visible: boolean;
  phoneNumber: string;
  financials: {amount: number; fee: number; total: number; currency: string};
}) {
  const session = useAirtimeTopupFlowStore(s => s.session);
  const provider = session?.provider;

  return (
    <BottomSheet visible={visible} onClose={() => {}} closable={false}>
      <View style={bs.handle} />
      <Text style={bs.title}>Processing your transaction</Text>
      <Text style={bs.subtitle}>
        Please wait while we complete your payment.{"\n"}
        This may take a few seconds.
      </Text>

      <ActivityIndicator size="large" color={CORAL} style={bs.spinner} />

      <View style={bs.txCard}>
        <View
          style={[
            bs.providerIcon,
            {backgroundColor: provider?.iconBg ?? '#FEE8DF'},
          ]}>
          <Ionicons
            name={(provider?.icon ?? 'phone-portrait-outline') as any}
            size={22}
            color={provider?.iconColor ?? '#E53E3E'}
          />
        </View>
        <View style={bs.providerInfo}>
          <Text style={bs.providerName}>{provider?.name ?? 'Vodacom'} Airtime</Text>
          <Text style={bs.providerSub}>{phoneNumber}</Text>
        </View>
        <Text style={bs.txAmount}>
          {formatMoney(financials.total)}
        </Text>
      </View>
    </BottomSheet>
  );
}

// ─────────────────────────────────────────────
// Success sheet
// ─────────────────────────────────────────────
function SuccessSheet({
  visible,
  onDone,
  phoneNumber,
  financials,
}: {
  visible: boolean;
  onDone: () => void;
  phoneNumber: string;
  financials: {amount: number; fee: number; total: number; currency: string};
}) {
  const session = useAirtimeTopupFlowStore(s => s.session);
  const provider = session?.provider;

  return (
    <BottomSheet visible={visible} onClose={() => {}} closable={false}>
      <View style={bs.handle} />

      <View style={s.successIconWrap}>
        <View style={s.successIconCircle}>
          <Ionicons name="checkmark" size={36} color="#10B981" />
        </View>
      </View>

      <Text style={bs.title}>Payment Successful</Text>
      <Text style={bs.subtitle}>
        Your transaction was completed successfully.
      </Text>

      <View style={bs.txCard}>
        <View
          style={[
            bs.providerIcon,
            {backgroundColor: provider?.iconBg ?? '#FEE8DF'},
          ]}>
          <Ionicons
            name={(provider?.icon ?? 'phone-portrait-outline') as any}
            size={22}
            color={provider?.iconColor ?? '#E53E3E'}
          />
        </View>
        <View style={bs.providerInfo}>
          <Text style={bs.providerName}>{provider?.name ?? 'Vodacom'} Airtime</Text>
          <Text style={bs.providerSub}>{phoneNumber}</Text>
        </View>
        <Text style={bs.txAmount}>
          {formatMoney(financials.total)}
        </Text>
      </View>

      <Pressable onPress={onDone} style={bs.payBtn}>
        <Text style={bs.payBtnText}>Done</Text>
      </Pressable>
      <Pressable onPress={onDone} style={s.viewTx}>
        <Text style={s.viewTxText}>View transaction</Text>
      </Pressable>
    </BottomSheet>
  );
}

// ─────────────────────────────────────────────
// Failed sheet
// ─────────────────────────────────────────────
function FailedSheet({
  visible,
  onDone,
  phoneNumber,
  financials,
}: {
  visible: boolean;
  onDone: () => void;
  phoneNumber: string;
  financials: {amount: number; fee: number; total: number; currency: string};
}) {
  const session = useAirtimeTopupFlowStore(s => s.session);
  const provider = session?.provider;
  const error = useAirtimeTopupFlowStore(s => s.error);

  return (
    <BottomSheet visible={visible} onClose={() => {}} closable={false}>
      <View style={bs.handle} />

      <View style={s.successIconWrap}>
        <View style={[s.successIconCircle, {backgroundColor: '#FEF2F2'}]}>
          <Ionicons name="close" size={36} color="#EF4444" />
        </View>
      </View>

      <Text style={bs.title}>Payment Failed</Text>
      <Text style={bs.subtitle}>
        {error ?? 'Your payment could not be completed. Please try again.'}
      </Text>

      <View style={bs.txCard}>
        <View
          style={[
            bs.providerIcon,
            {backgroundColor: provider?.iconBg ?? '#FEE8DF'},
          ]}>
          <Ionicons
            name={(provider?.icon ?? 'phone-portrait-outline') as any}
            size={22}
            color={provider?.iconColor ?? '#E53E3E'}
          />
        </View>
        <View style={bs.providerInfo}>
          <Text style={bs.providerName}>{provider?.name ?? 'Vodacom'} Airtime</Text>
          <Text style={bs.providerSub}>{phoneNumber}</Text>
        </View>
        <Text style={bs.txAmount}>
          {formatMoney(financials.total)}
        </Text>
      </View>

      <Pressable onPress={onDone} style={bs.payBtn}>
        <Text style={bs.payBtnText}>Try again</Text>
      </Pressable>
    </BottomSheet>
  );
}

const bs = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26,37,53,0.55)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 14,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -12},
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D9E0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 24,
    zIndex: 10,
  },
  title: {
    color: DARK,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: SERIF,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    color: '#8A94A6',
    fontSize: 13,
    fontFamily: SANS,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    padding: 14,
    marginBottom: 20,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  providerInfo: {flex: 1, gap: 3},
  providerName: {
    color: DARK,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: SERIF,
    letterSpacing: -0.2,
  },
  providerSub: {
    color: '#8A94A6',
    fontSize: 12,
    fontFamily: SANS,
  },
  providerPhone: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: SANS,
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    padding: 16,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E8EDF2',
    marginTop: 6,
    paddingTop: 12,
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: SANS,
  },
  summaryValue: {
    color: DARK,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  totalValue: {
    color: CORAL,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: SERIF,
  },
  note: {
    color: '#8A94A6',
    fontSize: 12,
    fontFamily: SANS,
    textAlign: 'center',
    marginBottom: 20,
  },
  payBtn: {
    backgroundColor: CORAL,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 5,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: 0.3,
  },
  spinner: {marginVertical: 24},
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    padding: 14,
    marginBottom: 24,
  },
  txAmount: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    backgroundColor: '#FFF1EA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

const s = StyleSheet.create({
  successIconWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EDFBF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTx: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 6,
  },
  viewTxText: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});

// ─────────────────────────────────────────────
// Save sheet
// ─────────────────────────────────────────────
function SaveSheet({
  visible,
  onClose,
  onSave,
  phoneNumber,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  phoneNumber: string;
}) {
  const [nickname, setNickname] = React.useState('');
  const [nicknameFocused, setNicknameFocused] = React.useState(false);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={bs.handle} />
      <Pressable onPress={onClose} style={bs.closeBtn}>
        <Ionicons name="close" size={22} color="#8A94A6" />
      </Pressable>

      <Text style={sv.title}>Save this information?</Text>
      <Text style={sv.subtitle}>
        Save these details to make future payments faster.
      </Text>

      <Text style={d.label}>Phone number</Text>
      <View style={sv.inputWrap}>
        <Ionicons name="call-outline" size={18} color="#F27649" />
        <TextInput
          style={sv.input}
          value={phoneNumber}
          editable={false}
          placeholderTextColor="#C4CDD8"
        />
        <Ionicons name="chevron-down" size={18} color="#8A94A6" />
      </View>

      <Text style={sv.label}>
        <Text style={sv.labelDark}>Nickname</Text>
        <Text style={sv.labelLight}> · Optional</Text>
      </Text>
      <View style={[sv.inputWrap, {borderColor: nicknameFocused ? '#F27649' : '#E6EBF1'}]}>
        <Ionicons name="pricetag-outline" size={18} color="#F27649" />
        <TextInput
          style={sv.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Mom's phone"
          placeholderTextColor="#1A2535"
          onFocus={() => setNicknameFocused(true)}
          onBlur={() => setNicknameFocused(false)}
        />
      </View>

      <Pressable onPress={onSave} style={[bs.payBtn, sv.saveBtn]}>
        <Text style={bs.payBtnText}>Save</Text>
      </Pressable>
      <Pressable onPress={onClose} style={sv.notNowBtn}>
        <Text style={sv.notNowText}>Not now</Text>
      </Pressable>
    </BottomSheet>
  );
}

const sv = StyleSheet.create({
  title: {
    color: DARK,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: -0.4,
    marginBottom: 6,
    marginTop: 10,
  },
  subtitle: {
    color: '#8A94A6',
    fontSize: 14,
    fontFamily: SANS,
    lineHeight: 20,
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  labelDark: {
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  labelLight: {
    color: '#8A94A6',
    fontSize: 14,
    fontFamily: SANS,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E6EBF1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontFamily: SANS,
    padding: 0,
  },
  saveBtn: {
    marginTop: 12,
  },
  notNowBtn: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  notNowText: {
    color: CORAL,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});

// ─────────────────────────────────────────────
// Main flow
// ─────────────────────────────────────────────
export function VodacomAirtimeFlow() {
  const step = useAirtimeTopupFlowStore(state => state.step);
  const phoneNumber = useAirtimeTopupFlowStore(state => state.phoneNumber);
  const amount = useAirtimeTopupFlowStore(state => state.amount);
  const error = useAirtimeTopupFlowStore(state => state.error);
  const session = useAirtimeTopupFlowStore(state => state.session);
  const currency = useAirtimeTopupFlowStore(state => state.session?.provider.rules.currency ?? 'USD');
  const financials = React.useMemo(() => {
    const amt = Number(amount) || 0;
    const fee = amt * 0.01;
    return {amount: amt, fee, total: amt + fee, currency};
  }, [amount, currency]);
  const setPhoneNumber = useAirtimeTopupFlowStore(state => state.setPhoneNumber);
  const setAmount = useAirtimeTopupFlowStore(state => state.setAmount);
  const submitDetails = useAirtimeTopupFlowStore(state => state.submitDetails);
  const editDetails = useAirtimeTopupFlowStore(state => state.editDetails);
  const confirmReview = useAirtimeTopupFlowStore(state => state.confirmReview);
  const completePayment = useAirtimeTopupFlowStore(state => state.completePayment);
  const reset = useAirtimeTopupFlowStore(state => state.reset);
  const closeServiceSession = useServiceSessionStore(st => st.closeServiceSession);

  React.useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(completePayment, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, completePayment]);

    const [showSaveSheet, setShowSaveSheet] = React.useState(false);

  const handleDone = React.useCallback(() => {
    setShowSaveSheet(true);
  }, []);

  const handleSave = React.useCallback(() => {
    // Save the transaction information
    const transactionData = {
      provider: session?.provider?.name || 'Vodacom',
      phoneNumber,
      amount,
      total: financials.total,
      currency: financials.currency,
      fee: financials.fee,
      timestamp: new Date().toISOString(),
      type: 'airtime',
      status: 'completed'
    };
    
    console.log('Saving transaction data:', transactionData);
    // TODO: Implement actual save logic
    
    setShowSaveSheet(false);
    reset();
    closeServiceSession();
  }, [session, phoneNumber, amount, financials, reset, closeServiceSession]);

  const handleCancelSave = React.useCallback(() => {
    setShowSaveSheet(false);
    reset();
    closeServiceSession();
  }, [reset, closeServiceSession]);

  const handleClose = React.useCallback(() => {
    reset();
    closeServiceSession();
  }, [reset, closeServiceSession]);

  if (!session) {
    return null;
  }

  return (
    <>
      <DetailsSheet
        visible={step === 'details'}
        onClose={handleClose}
        phoneNumber={phoneNumber}
        amount={amount}
        error={error}
        onPhoneChange={setPhoneNumber}
        onAmountChange={setAmount}
        onSubmit={submitDetails}
      />

      {step === 'review' && (
        <ReviewSheet
          visible
          onClose={editDetails}
          onPay={confirmReview}
          phoneNumber={phoneNumber}
          financials={financials}
        />
      )}

      {step === 'processing' && (
        <ProcessingSheet
          visible
          phoneNumber={phoneNumber}
          financials={financials}
        />
      )}

      {step === 'success' && (
        <SuccessSheet
          visible
          onDone={handleDone}
          phoneNumber={phoneNumber}
          financials={financials}
        />
      )}

      {step === 'failed' && (
        <FailedSheet
          visible
          onDone={handleDone}
          phoneNumber={phoneNumber}
          financials={financials}
        />
      )}

      <SaveSheet
        visible={showSaveSheet}
        onClose={handleCancelSave}
        onSave={handleSave}
        phoneNumber={phoneNumber}
      />
    </>
  );
}
