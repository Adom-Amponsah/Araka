import * as React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet, Animated} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {BottomSheet} from './BottomSheet';
import {MobileTelco, PaymentMethod} from '../../store/topupFlowStore';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// Enter PIN Sheet
// ─────────────────────────────────────────────
export function EnterPinSheet({
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
      <View style={ep.content}>
        <Text style={ep.title}>Enter your PIN</Text>
        <Text style={ep.sub}>To confirm your transaction</Text>

        <View style={ep.pinRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[ep.pinBox, pin.length > i && ep.pinBoxFilled]}>
              {pin.length > i && <Text style={ep.pinDot}>*</Text>}
            </View>
          ))}
          <TextInput
            ref={inputRef}
            style={ep.hiddenInput}
            value={pin}
            onChangeText={(text) => onPinChange(text.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            caretHidden
            autoFocus
          />
        </View>

        <Pressable onPress={onSubmit} style={ep.btn} disabled={pin.length !== 4}>
          <Text style={ep.btnText}>Continue</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const ep = StyleSheet.create({
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
// Processing Sheet
// ─────────────────────────────────────────────
export function ProcessingSheet({
  visible,
  telco,
  phoneNumber,
  amount,
}: {
  visible: boolean;
  telco: MobileTelco | null;
  phoneNumber: string;
  amount: string;
}) {
  const dots = React.useRef(Array.from({length: 8}, (_, i) => new Animated.Value(0))).current;

  React.useEffect(() => {
    if (visible) {
      const animations = dots.map((dot, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 100),
            Animated.timing(dot, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        )
      );
      animations.forEach((anim) => anim.start());
      return () => animations.forEach((anim) => anim.stop());
    }
  }, [visible, dots]);

  const telcoLabels: Record<MobileTelco, string> = {
    mpesa: 'MPesa',
    airtel: 'AirtelMoney',
    orange: 'OrangeMoney',
    afrimoney: 'AfriMoney',
  };

  return (
    <BottomSheet visible={visible} onClose={() => {}} closable={false}>
      <View style={pr.content}>
        <View style={pr.dotsWrap}>
          {dots.map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                pr.dot,
                {
                  opacity: dot,
                  transform: [{scale: dot}],
                },
              ]}
            />
          ))}
        </View>

        <Text style={pr.title}>Waiting for validation</Text>
        <Text style={pr.sub}>
          Please enter your {telco ? telcoLabels[telco] : 'Mobile Money'} PIN on your device,{'\n'}to validate the
          transaction.
        </Text>

        <View style={pr.card}>
          <View style={pr.cardLeft}>
            <View style={pr.cardLogo}>
              <Ionicons name="phone-portrait" size={24} color={CORAL} />
            </View>
            <View>
              <Text style={pr.cardLabel}>{telco ? telcoLabels[telco] : 'Mobile Money'}</Text>
              <Text style={pr.cardPhone}>{phoneNumber || '+243 81 234 5678'}</Text>
            </View>
          </View>
          <Text style={pr.cardAmount}>${amount || '10.10'}</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

const pr = StyleSheet.create({
  content: {alignItems: 'center', paddingVertical: 32},
  dotsWrap: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CORAL,
  },
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 8},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, textAlign: 'center', marginBottom: 32},
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F3F7',
  },
  cardLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  cardLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2},
  cardPhone: {fontSize: 13, fontFamily: SANS, color: GRAY},
  cardAmount: {fontSize: 16, fontWeight: '800', fontFamily: BOLD, color: CORAL},
});

// ─────────────────────────────────────────────
// Confirmation Sheet
// ─────────────────────────────────────────────
export function ConfirmationSheet({
  visible,
  onClose,
  telco,
  amount,
  paymentMethod,
  cardNumber,
}: {
  visible: boolean;
  onClose: () => void;
  telco: MobileTelco | null;
  amount: string;
  paymentMethod: PaymentMethod | null;
  cardNumber: string;
}) {
  // Confirmation only has close, no back
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

  const maskedCard = cardNumber
    ? `1232 XXXX XXXX ${cardNumber.replace(/\s/g, '').slice(-4)}`
    : '1232 XXXX XXXX 6247';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={cf.content}>
        <Animated.View style={[cf.bgCircle, {transform: [{scale: bgScale}]}]} />

        <Animated.View style={[cf.iconWrap, {transform: [{scale}]}]}>
          <Ionicons name="checkmark-circle" size={64} color="#10B981" />
        </Animated.View>

        <Text style={cf.title}>Top up Successful</Text>
        <Text style={cf.sub}>Your transaction was completed successfully.</Text>

        {paymentMethod === 'card' && (
          <View style={cf.cardInfo}>
            <View style={cf.cardLeft}>
              <Text style={cf.visaLabel}>VISA</Text>
              <View>
                <Text style={cf.cardTitle}>Visa Card</Text>
                <Text style={cf.cardNumber}>{maskedCard}</Text>
              </View>
            </View>
            <Text style={cf.cardAmount}>${amount || '10.10'}</Text>
          </View>
        )}

        {!paymentMethod || paymentMethod === 'mobileMoney' ? (
          <View style={cf.details}>
            <View style={cf.row}>
              <Text style={cf.rowLabel}>Amount</Text>
              <Text style={cf.rowValue}>${amount || '10.10'} USD</Text>
            </View>
            <View style={cf.row}>
              <Text style={cf.rowLabel}>Transaction ID</Text>
              <Text style={cf.rowValue}>TXN{Math.floor(Math.random() * 1000000)}</Text>
            </View>
            <View style={cf.row}>
              <Text style={cf.rowLabel}>Date</Text>
              <Text style={cf.rowValue}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>
        ) : null}

        <Pressable onPress={onClose} style={cf.btn}>
          <Text style={cf.btnText}>Done</Text>
        </Pressable>

        {paymentMethod === 'card' && (
          <Pressable onPress={onClose} style={cf.viewTxn}>
            <Text style={cf.viewTxnText}>View transaction</Text>
          </Pressable>
        )}
      </View>
    </BottomSheet>
  );
}

const cf = StyleSheet.create({
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
  cardInfo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  cardLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  visaLabel: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: BOLD,
    color: '#1A1F71',
    letterSpacing: 1,
  },
  cardTitle: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2},
  cardNumber: {fontSize: 13, fontFamily: SANS, color: GRAY},
  cardAmount: {fontSize: 16, fontWeight: '800', fontFamily: BOLD, color: CORAL},
  details: {
    width: '100%',
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  rowLabel: {fontSize: 14, fontFamily: SANS, color: GRAY},
  rowValue: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK},
  btn: {
    width: '100%',
    backgroundColor: CORAL,
    paddingVertical: 16,
    paddingHorizontal: 64,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  viewTxn: {paddingVertical: 12},
  viewTxnText: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: CORAL},
});
