import * as React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
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
// Card Details
// ─────────────────────────────────────────────
function CardDetailsSheet({
  visible,
  onClose,
  onBack,
  cardNumber,
  cardExpiry,
  cardCvv,
  amount,
  onCardNumberChange,
  onExpiryChange,
  onCvvChange,
  onAmountChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  amount: string;
  onCardNumberChange: (val: string) => void;
  onExpiryChange: (val: string) => void;
  onCvvChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onSubmit: () => void;
}) {
  const quickAmounts = ['1', '5', '10', '20'];

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').slice(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <Text style={cd.title}>Card details</Text>
      <Text style={cd.sub}>Enter your card details to top up</Text>

      <View style={cd.section}>
        <Text style={cd.label}>Card</Text>
        <View style={cd.cardRow}>
          <Text style={cd.visaText}>VISA</Text>
          <TextInput
            style={cd.cardInput}
            value={cardNumber}
            onChangeText={(text) => onCardNumberChange(formatCardNumber(text))}
            placeholder="XXXX  XXXX  XXXX  XXXX"
            placeholderTextColor="#D1D5DB"
            keyboardType="number-pad"
            maxLength={19}
          />
          <Ionicons name="person-circle-outline" size={24} color={CORAL} />
        </View>

        <View style={cd.row}>
          <View style={[cd.halfInput, {marginRight: 8}]}>
            <View style={cd.inputBox}>
              <Ionicons name="calendar-outline" size={18} color={CORAL} />
              <TextInput
                style={cd.input}
                value={cardExpiry}
                onChangeText={(text) => onExpiryChange(formatExpiry(text))}
                placeholder="MM/YY"
                placeholderTextColor="#D1D5DB"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
          </View>

          <View style={[cd.halfInput, {marginLeft: 8}]}>
            <View style={cd.inputBox}>
              <Ionicons name="card-outline" size={18} color={CORAL} />
              <TextInput
                style={cd.input}
                value={cardCvv}
                onChangeText={(text) => onCvvChange(text.replace(/\D/g, '').slice(0, 3))}
                placeholder="CVV"
                placeholderTextColor="#D1D5DB"
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        </View>
      </View>

      <View style={cd.section}>
        <Text style={cd.label}>Amount</Text>
        <View style={cd.inputBox}>
          <Ionicons name="cash-outline" size={20} color={CORAL} />
          <TextInput
            style={[cd.input, {flex: 1}]}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Enter amount"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
          />
          <Text style={cd.currency}>USD</Text>
          <Ionicons name="chevron-down" size={16} color={GRAY} />
        </View>

        <View style={cd.quickRow}>
          {quickAmounts.map((amt) => (
            <Pressable key={amt} onPress={() => onAmountChange(amt)} style={cd.quickBtn}>
              <Text style={cd.quickText}>${amt}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable onPress={onSubmit} style={cd.btn}>
        <Text style={cd.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const cd = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24},
  section: {marginBottom: 20},
  label: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 8},
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
    marginBottom: 12,
  },
  visaText: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: BOLD,
    color: '#1A1F71',
    letterSpacing: 1,
  },
  cardInput: {flex: 1, fontSize: 15, fontFamily: SANS, color: DARK, padding: 0, letterSpacing: 1},
  row: {flexDirection: 'row'},
  halfInput: {flex: 1},
  inputBox: {
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
// Visa Verification
// ─────────────────────────────────────────────
function VisaVerificationSheet({
  visible,
  onClose,
  onBack,
  password,
  onPasswordChange,
  onSubmit,
  cardNumber,
  amount,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  password: string;
  onPasswordChange: (val: string) => void;
  onSubmit: () => void;
  cardNumber: string;
  amount: string;
}) {
  const maskedCard = cardNumber
    ? `xxxx-xxxx-xxxx-${cardNumber.replace(/\s/g, '').slice(-4)}`
    : 'xxxx-xxxx-xxxx-1234';

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <View style={vv.content}>
        <View style={vv.card}>
          <View style={vv.visaHeader}>
            <Text style={vv.verifiedText}>Verified by</Text>
            <Text style={vv.visaText}>VISA</Text>
          </View>

          <Text style={vv.securityText}>For your security</Text>

          <View style={vv.details}>
            <Text style={vv.detailText}>Merchant name: your business name</Text>
            <Text style={vv.detailText}>Amount: ${amount || '134.45'}</Text>
            <Text style={vv.detailText}>Date: {new Date().toLocaleDateString()}</Text>
            <Text style={vv.detailText}>Card number: {maskedCard}</Text>
          </View>

          <View style={vv.inputSection}>
            <Text style={vv.inputLabel}>Password:</Text>
            <TextInput
              style={vv.input}
              value={password}
              onChangeText={onPasswordChange}
              secureTextEntry
              placeholder=""
              autoFocus
            />
          </View>

          <Pressable onPress={onSubmit}>
            <Text style={vv.forgotText}>Forgot my password</Text>
          </Pressable>

          <View style={vv.btnRow}>
            <Pressable onPress={onSubmit} style={vv.submitBtn}>
              <Text style={vv.submitText}>Submit</Text>
            </Pressable>
            <Pressable onPress={onClose} style={vv.cancelBtn}>
              <Text style={vv.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const vv = StyleSheet.create({
  content: {paddingVertical: 24, alignItems: 'center'},
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    padding: 24,
  },
  visaHeader: {alignItems: 'center', marginBottom: 24},
  verifiedText: {fontSize: 14, fontFamily: SANS, color: '#1A1F71', marginBottom: 4},
  visaText: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: BOLD,
    color: '#1A1F71',
    letterSpacing: 2,
  },
  securityText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
    marginBottom: 16,
  },
  details: {marginBottom: 20},
  detailText: {fontSize: 13, fontFamily: SANS, color: DARK, marginBottom: 4},
  inputSection: {marginBottom: 12},
  inputLabel: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: DARK, marginBottom: 8},
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: SANS,
    color: DARK,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: SANS,
    color: '#1A5FD6',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  btnRow: {flexDirection: 'row', gap: 12},
  submitBtn: {
    flex: 1,
    backgroundColor: '#1A5FD6',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {color: '#FFFFFF', fontSize: 14, fontWeight: '700', fontFamily: BOLD},
  cancelBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelText: {color: DARK, fontSize: 14, fontWeight: '700', fontFamily: BOLD},
});

// ─────────────────────────────────────────────
// Main Card Flow
// ─────────────────────────────────────────────
export function TopupCardFlow({visible, onClose, onBack}: {visible: boolean; onClose: () => void; onBack: () => void}) {
  const step = useTopupFlowStore((state) => state.step);
  const cardNumber = useTopupFlowStore((state) => state.cardNumber);
  const cardExpiry = useTopupFlowStore((state) => state.cardExpiry);
  const cardCvv = useTopupFlowStore((state) => state.cardCvv);
  const amount = useTopupFlowStore((state) => state.amount);
  const visaPassword = useTopupFlowStore((state) => state.visaPassword);

  const setCardNumber = useTopupFlowStore((state) => state.setCardNumber);
  const setCardExpiry = useTopupFlowStore((state) => state.setCardExpiry);
  const setCardCvv = useTopupFlowStore((state) => state.setCardCvv);
  const setAmount = useTopupFlowStore((state) => state.setAmount);
  const setVisaPassword = useTopupFlowStore((state) => state.setVisaPassword);
  const submitCardDetails = useTopupFlowStore((state) => state.submitCardDetails);
  const submitVisaPassword = useTopupFlowStore((state) => state.submitVisaPassword);
  const backToCardDetails = useTopupFlowStore((state) => state.backToCardDetails);

  if (!visible) {
    return null;
  }

  return (
    <>
      <CardDetailsSheet
        visible={step === 'cardDetails'}
        onClose={onClose}
        onBack={onBack}
        cardNumber={cardNumber}
        cardExpiry={cardExpiry}
        cardCvv={cardCvv}
        amount={amount}
        onCardNumberChange={setCardNumber}
        onExpiryChange={setCardExpiry}
        onCvvChange={setCardCvv}
        onAmountChange={setAmount}
        onSubmit={submitCardDetails}
      />

      <VisaVerificationSheet
        visible={step === 'visaVerification'}
        onClose={onClose}
        onBack={backToCardDetails}
        password={visaPassword}
        onPasswordChange={setVisaPassword}
        onSubmit={submitVisaPassword}
        cardNumber={cardNumber}
        amount={amount}
      />
    </>
  );
}
