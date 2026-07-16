import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useTopupFlowStore, MobileTelco} from '../store/topupFlowStore';
import {BottomSheet} from './components/BottomSheet';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// Choose Operator
// ─────────────────────────────────────────────
function SelectOperatorSheet({
  visible,
  onClose,
  onBack,
  onSelectTelco,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onSelectTelco: (telco: MobileTelco) => void;
}) {
  const operators: {id: MobileTelco; label: string; sub: string; logo: string}[] = [
    {id: 'mpesa', label: 'MPesa', sub: 'Topup your wallet with Mpesa', logo: 'phone-portrait'},
    {id: 'airtel', label: 'AirtelMoney', sub: 'Topup your wallet with Airtel  Money', logo: 'phone-portrait'},
    {id: 'orange', label: 'OrangeMoney', sub: 'Topup your wallet with Orange Money', logo: 'phone-portrait'},
    {id: 'afrimoney', label: 'AfriMoney', sub: 'Topup your wallet with AfriMoney', logo: 'phone-portrait'},
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <Text style={so.title}>Choose an Operator</Text>
      <Text style={so.sub}>Select a Mobile Money</Text>

      <ScrollView style={so.scroll} showsVerticalScrollIndicator={false}>
        <View style={so.list}>
          {operators.map((op) => (
            <Pressable key={op.id} onPress={() => onSelectTelco(op.id)} style={so.row}>
              <View style={so.logo}>
                <Ionicons name={op.logo as any} size={24} color={CORAL} />
              </View>
              <View style={so.rowText}>
                <Text style={so.rowLabel}>{op.label}</Text>
                <Text style={so.rowSub}>{op.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const so = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 20},
  scroll: {maxHeight: 400},
  list: {gap: 12, paddingBottom: 24},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F3F7',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {flex: 1, marginLeft: 12},
  rowLabel: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2},
  rowSub: {fontSize: 13, fontFamily: SANS, color: GRAY},
});

// ─────────────────────────────────────────────
// Enter Details (Phone & Amount)
// ─────────────────────────────────────────────
function EnterDetailsSheet({
  visible,
  onClose,
  onBack,
  telco,
  phoneNumber,
  amount,
  onPhoneChange,
  onAmountChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  telco: MobileTelco | null;
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
          <Ionicons name="phone-portrait" size={24} color={CORAL} />
        </View>
        <Text style={ed.title}>Recharge your wallet</Text>
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
// Main Mobile Money Flow
// ─────────────────────────────────────────────
export function TopupMobileMoneyFlow({visible, onClose, onBack}: {visible: boolean; onClose: () => void; onBack: () => void}) {
  const step = useTopupFlowStore((state) => state.step);
  const selectedTelco = useTopupFlowStore((state) => state.selectedTelco);
  const phoneNumber = useTopupFlowStore((state) => state.phoneNumber);
  const amount = useTopupFlowStore((state) => state.amount);

  const selectTelco = useTopupFlowStore((state) => state.selectTelco);
  const setPhoneNumber = useTopupFlowStore((state) => state.setPhoneNumber);
  const setAmount = useTopupFlowStore((state) => state.setAmount);
  const submitDetails = useTopupFlowStore((state) => state.submitDetails);
  const backToOperator = useTopupFlowStore((state) => state.backToOperator);

  if (!visible) {
    return null;
  }

  return (
    <>
      <SelectOperatorSheet
        visible={step === 'selectOperator'}
        onClose={onClose}
        onBack={onBack}
        onSelectTelco={selectTelco}
      />

      <EnterDetailsSheet
        visible={step === 'enterDetails'}
        onClose={onClose}
        onBack={backToOperator}
        telco={selectedTelco}
        phoneNumber={phoneNumber}
        amount={amount}
        onPhoneChange={setPhoneNumber}
        onAmountChange={setAmount}
        onSubmit={submitDetails}
      />
    </>
  );
}
