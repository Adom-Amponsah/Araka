import * as React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useSendFlowStore} from '../store/sendFlowStore';
import {BottomSheet} from './components/BottomSheet';
import {ReviewSheet, SendProcessingSheet, SendSuccessSheet} from './components/SendSharedSheets';
import {EnterPinSheet} from './components/SharedSheets';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// Enter Araka User Details
// ─────────────────────────────────────────────
function ArakaUserDetailsSheet({
  visible,
  onClose,
  onBack,
  phoneNumber,
  amount,
  onPhoneChange,
  onAmountChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  phoneNumber: string;
  amount: string;
  onPhoneChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onSubmit: () => void;
}) {
  const quickAmounts = ['1', '5', '10', '20'];

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <View style={ed.header}>
        <View style={ed.logo}>
          <Ionicons name="person" size={24} color={CORAL} />
        </View>
        <Text style={ed.title}>Send to Araka User</Text>
      </View>

      <View style={ed.section}>
        <Text style={ed.label}>Phone Number</Text>
        <View style={ed.inputRow}>
          <View style={ed.flag}>
            <Text style={ed.flagText}>🇨🇩</Text>
          </View>
          <TextInput
            style={ed.input}
            value={phoneNumber}
            onChangeText={onPhoneChange}
            placeholder="+243 ••• ••• •••"
            placeholderTextColor="#D1D5DB"
            keyboardType="phone-pad"
          />
          <Ionicons name="person-circle-outline" size={24} color={CORAL} />
        </View>
      </View>

      <View style={ed.section}>
        <Text style={ed.label}>Amount</Text>
        <View style={ed.inputRow}>
          <Ionicons name="cash-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={[ed.input, {flex: 1}]}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Enter amount"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
          />
          <Text style={ed.currency}>USD</Text>
          <Ionicons name="chevron-down" size={16} color={GRAY} />
        </View>

        <View style={ed.quickRow}>
          {quickAmounts.map((amt) => (
            <Pressable key={amt} onPress={() => onAmountChange(amt)} style={ed.quickBtn}>
              <Text style={ed.quickText}>${amt}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable onPress={onSubmit} style={ed.btn}>
        <Text style={ed.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const ed = StyleSheet.create({
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
  flag: {width: 28, height: 28, alignItems: 'center', justifyContent: 'center'},
  flagText: {fontSize: 18},
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
// Main Araka User Send Flow
// ─────────────────────────────────────────────
export function SendArakaUserFlow({visible, onClose, onBack}: {visible: boolean; onClose: () => void; onBack: () => void}) {
  const step = useSendFlowStore((state) => state.step);
  const phoneNumber = useSendFlowStore((state) => state.phoneNumber);
  const amount = useSendFlowStore((state) => state.amount);
  const fee = useSendFlowStore((state) => state.fee);
  const pin = useSendFlowStore((state) => state.pin);

  const setPhoneNumber = useSendFlowStore((state) => state.setPhoneNumber);
  const setAmount = useSendFlowStore((state) => state.setAmount);
  const submitDetails = useSendFlowStore((state) => state.submitDetails);
  const editDetails = useSendFlowStore((state) => state.editDetails);
  const confirmReview = useSendFlowStore((state) => state.confirmReview);
  const setPin = useSendFlowStore((state) => state.setPin);
  const submitPin = useSendFlowStore((state) => state.submitPin);
  const backToRecipient = useSendFlowStore((state) => state.backToRecipient);
  const backToDetails = useSendFlowStore((state) => state.backToDetails);

  if (!visible) {
    return null;
  }

  const recipientDetail = phoneNumber || '+243 81 234 5678';

  return (
    <>
      <ArakaUserDetailsSheet
        visible={step === 'arakaUserDetails'}
        onClose={onClose}
        onBack={backToRecipient}
        phoneNumber={phoneNumber}
        amount={amount}
        onPhoneChange={setPhoneNumber}
        onAmountChange={setAmount}
        onSubmit={submitDetails}
      />

      <ReviewSheet
        visible={step === 'review'}
        onClose={onClose}
        onBack={backToDetails}
        recipientLabel="Araka User"
        recipientDetail={recipientDetail}
        amount={amount}
        fee={fee}
        onConfirm={confirmReview}
        onEdit={editDetails}
      />

      <EnterPinSheet
        visible={step === 'enterPin'}
        onClose={onClose}
        onBack={backToDetails}
        pin={pin}
        onPinChange={setPin}
        onSubmit={submitPin}
      />

      <SendProcessingSheet
        visible={step === 'processing'}
        recipientLabel="Araka User"
        recipientDetail={recipientDetail}
        amount={amount}
      />

      <SendSuccessSheet
        visible={step === 'success'}
        onClose={onClose}
        recipientLabel="Araka User"
        recipientDetail={recipientDetail}
        amount={amount}
      />
    </>
  );
}
