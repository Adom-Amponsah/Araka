import * as React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet, Animated} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useTopupFlowStore} from '../store/topupFlowStore';
import {BottomSheet} from './components/BottomSheet';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// RIB Details & Amount
// ─────────────────────────────────────────────
function RibDetailsSheet({
  visible,
  onClose,
  onBack,
  amount,
  onAmountChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  amount: string;
  onAmountChange: (val: string) => void;
  onSubmit: () => void;
}) {
  const quickAmounts = ['1', '5', '10', '20'];

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <View style={rd.header}>
        <View style={rd.logo}>
          <Ionicons name="document-text" size={24} color={CORAL} />
        </View>
        <Text style={rd.title}>Recharge your wallet</Text>
      </View>

      <View style={rd.ribCard}>
        <View style={rd.ribIcon}>
          <Ionicons name="document-text-outline" size={20} color={CORAL} />
        </View>
        <View style={rd.ribText}>
          <Text style={rd.ribLabel}>Your Equity BCDC RIB</Text>
          <Text style={rd.ribNumber}>1234 7645 4683 6832 9732</Text>
        </View>
      </View>

      <View style={rd.section}>
        <Text style={rd.label}>Amount</Text>
        <View style={rd.inputRow}>
          <Ionicons name="cash-outline" size={20} color={CORAL} />
          <TextInput
            style={[rd.input, {flex: 1}]}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Enter amount"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
          />
          <Text style={rd.currency}>USD</Text>
          <Ionicons name="chevron-down" size={16} color={GRAY} />
        </View>

        <View style={rd.quickRow}>
          {quickAmounts.map((amt) => (
            <Pressable key={amt} onPress={() => onAmountChange(amt)} style={rd.quickBtn}>
              <Text style={rd.quickText}>${amt}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable onPress={onSubmit} style={rd.btn}>
        <Text style={rd.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const rd = StyleSheet.create({
  header: {alignItems: 'center', marginBottom: 24},
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {fontSize: 20, fontWeight: '800', fontFamily: BOLD, color: DARK},
  ribCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  ribIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribText: {flex: 1},
  ribLabel: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 4},
  ribNumber: {fontSize: 13, fontFamily: SANS, color: GRAY},
  section: {marginBottom: 20},
  label: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 8},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  input: {flex: 1, fontSize: 15, fontFamily: SANS, color: DARK, padding: 0},
  currency: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: GRAY},
  quickRow: {flexDirection: 'row', gap: 8, marginTop: 12},
  quickBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: OFF,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickText: {fontSize: 13, fontWeight: '600', fontFamily: BOLD, color: CORAL},
  btn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
});

// ─────────────────────────────────────────────
// PIN Entry with Native Keyboard
// ─────────────────────────────────────────────
function RibPinSheet({
  visible,
  onClose,
  onBack,
  pin,
  onPinChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  pin: string;
  onPinChange: (val: string) => void;
  onSubmit: () => void;
}) {
  const inputRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => inputRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack} fullHeight>
      <View style={rp.content}>
        <Text style={rp.title}>Enter your PIN</Text>
        <Text style={rp.sub}>To confirm your transaction</Text>

        <View style={rp.pinRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[rp.pinBox, pin.length > i && rp.pinBoxFilled]}>
              {pin.length > i && <Text style={rp.pinDot}>*</Text>}
            </View>
          ))}
          <TextInput
            ref={inputRef}
            style={rp.hiddenInput}
            value={pin}
            onChangeText={(text) => onPinChange(text.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            caretHidden
            autoFocus
          />
        </View>

        <Pressable onPress={onSubmit} style={rp.btn} disabled={pin.length !== 4}>
          <Text style={rp.btnText}>Continue</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const rp = StyleSheet.create({
  content: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24},
  title: {fontSize: 24, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 32},
  pinRow: {flexDirection: 'row', gap: 12, marginBottom: 32},
  pinBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pinBoxFilled: {borderColor: CORAL, backgroundColor: '#FFF5F2'},
  pinDot: {fontSize: 32, color: DARK},
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
  btn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
});

// ─────────────────────────────────────────────
// RIB Success Confirmation
// ─────────────────────────────────────────────
function RibConfirmationSheet({
  visible,
  onClose,
  amount,
}: {
  visible: boolean;
  onClose: () => void;
  amount: string;
}) {
  const scale = React.useRef(new Animated.Value(0)).current;
  const bgScale = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          damping: 12,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.spring(bgScale, {
          toValue: 1,
          damping: 15,
          stiffness: 180,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scale, bgScale]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={rc.content}>
        <Animated.View style={[rc.bgCircle, {transform: [{scale: bgScale}]}]} />

        <Animated.View style={[rc.iconWrap, {transform: [{scale}]}]}>
          <Ionicons name="checkmark-circle" size={64} color="#10B981" />
        </Animated.View>

        <Text style={rc.title}>Top up Successful</Text>
        <Text style={rc.sub}>Your transaction was completed successfully.</Text>

        <View style={rc.ribCard}>
          <View style={rc.ribIcon}>
            <Ionicons name="document-text-outline" size={20} color={CORAL} />
          </View>
          <View style={rc.ribText}>
            <Text style={rc.ribLabel}>Your Equity BCDC RIB</Text>
            <Text style={rc.ribNumber}>1234 7645 4683 6832 9732</Text>
          </View>
          <Text style={rc.amount}>${amount || '10.10'}</Text>
        </View>

        <Pressable onPress={onClose} style={rc.btn}>
          <Text style={rc.btnText}>Done</Text>
        </Pressable>

        <Pressable onPress={onClose} style={rc.viewTxn}>
          <Text style={rc.viewTxnText}>View transaction</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const rc = StyleSheet.create({
  content: {alignItems: 'center', paddingVertical: 24, position: 'relative'},
  bgCircle: {
    position: 'absolute',
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    opacity: 0.5,
  },
  iconWrap: {marginBottom: 16, zIndex: 1},
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 8},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, textAlign: 'center', marginBottom: 32},
  ribCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  ribIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribText: {flex: 1},
  ribLabel: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 4},
  ribNumber: {fontSize: 13, fontFamily: SANS, color: GRAY},
  amount: {fontSize: 16, fontWeight: '800', fontFamily: BOLD, color: CORAL},
  btn: {
    width: '100%',
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  viewTxn: {paddingVertical: 12},
  viewTxnText: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: CORAL},
});

// ─────────────────────────────────────────────
// Main RIB Flow
// ─────────────────────────────────────────────
export function TopupRibFlow({visible, onClose, onBack}: {visible: boolean; onClose: () => void; onBack: () => void}) {
  const step = useTopupFlowStore((state) => state.step);
  const amount = useTopupFlowStore((state) => state.amount);
  const pin = useTopupFlowStore((state) => state.pin);

  const setAmount = useTopupFlowStore((state) => state.setAmount);
  const setPin = useTopupFlowStore((state) => state.setPin);
  const submitDetails = useTopupFlowStore((state) => state.submitDetails);
  const submitPin = useTopupFlowStore((state) => state.submitPin);
  const backToRibDetails = useTopupFlowStore((state) => state.backToRibDetails);

  if (!visible) {
    return null;
  }

  return (
    <>
      <RibDetailsSheet
        visible={step === 'ribDetails'}
        onClose={onClose}
        onBack={onBack}
        amount={amount}
        onAmountChange={setAmount}
        onSubmit={submitDetails}
      />

      <RibPinSheet
        visible={step === 'enterPin'}
        onClose={onClose}
        onBack={backToRibDetails}
        pin={pin}
        onPinChange={setPin}
        onSubmit={submitPin}
      />

      <RibConfirmationSheet visible={step === 'confirmation'} onClose={onClose} amount={amount} />
    </>
  );
}
