import * as React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useTopupFlowStore, PaymentMethod} from '../store/topupFlowStore';
import {BottomSheet} from './components/BottomSheet';
import {EnterPinSheet, ProcessingSheet, ConfirmationSheet} from './components/SharedSheets';
import {TopupMobileMoneyFlow} from './TopupMobileMoneyFlow';
import {TopupCardFlow} from './TopupCardFlow';
import {TopupRibFlow} from './TopupRibFlow';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// Select Payment Method
// ─────────────────────────────────────────────
function SelectMethodSheet({
  visible,
  onClose,
  onSelectMethod,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectMethod: (method: PaymentMethod) => void;
}) {
  const [selected, setSelected] = React.useState<PaymentMethod>('mobileMoney');

  const methods: {id: PaymentMethod; icon: string; label: string; sub: string}[] = [
    {id: 'mobileMoney', icon: 'phone-portrait', label: 'Mobile Money', sub: 'All operators'},
    {id: 'card', icon: 'card', label: 'Card', sub: 'All types of cards'},
    {id: 'rib', icon: 'document-text', label: 'RIB', sub: 'Your Equity BCDC  Account'},
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={sm.title}>Select Method</Text>
      <Text style={sm.sub}>Choose the way you want to use for provisioning.</Text>

      <View style={sm.list}>
        {methods.map((method) => {
          const isSelected = selected === method.id;
          return (
            <Pressable
              key={method.id}
              onPress={() => setSelected(method.id)}
              style={[sm.option, isSelected && sm.optionActive]}>
              <View style={[sm.iconBox, {backgroundColor: isSelected ? CORAL : OFF}]}>
                <Ionicons name={method.icon as any} size={24} color={isSelected ? '#FFFFFF' : CORAL} />
              </View>
              <View style={sm.optionText}>
                <Text style={sm.optionLabel}>{method.label}</Text>
                <Text style={sm.optionSub}>{method.sub}</Text>
              </View>
              <View style={[sm.radio, isSelected && sm.radioActive]}>
                {isSelected && <View style={sm.radioDot} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => onSelectMethod(selected)} style={sm.btn}>
        <Text style={sm.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const sm = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24},
  list: {gap: 12, marginBottom: 24},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  optionActive: {borderColor: CORAL, backgroundColor: '#FFF5F2'},
  iconBox: {width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1, marginLeft: 12},
  optionLabel: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2},
  optionSub: {fontSize: 13, fontFamily: SANS, color: GRAY},
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {borderColor: CORAL},
  radioDot: {width: 12, height: 12, borderRadius: 6, backgroundColor: CORAL},
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
// Main Flow Orchestrator
// ─────────────────────────────────────────────
export function TopupFlow({visible, onClose}: {visible: boolean; onClose: () => void}) {
  const step = useTopupFlowStore((state) => state.step);
  const paymentMethod = useTopupFlowStore((state) => state.paymentMethod);
  const selectedTelco = useTopupFlowStore((state) => state.selectedTelco);
  const phoneNumber = useTopupFlowStore((state) => state.phoneNumber);
  const amount = useTopupFlowStore((state) => state.amount);
  const pin = useTopupFlowStore((state) => state.pin);
  const cardNumber = useTopupFlowStore((state) => state.cardNumber);

  const selectPaymentMethod = useTopupFlowStore((state) => state.selectPaymentMethod);
  const setPin = useTopupFlowStore((state) => state.setPin);
  const submitPin = useTopupFlowStore((state) => state.submitPin);
  const reset = useTopupFlowStore((state) => state.reset);
  const backToMethod = useTopupFlowStore((state) => state.backToMethod);
  const backFromPin = useTopupFlowStore((state) => state.backFromPin);

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!visible) {
    return null;
  }

  const showMobileMoneyFlow = paymentMethod === 'mobileMoney' && (step === 'selectOperator' || step === 'enterDetails');
  const showCardFlow = paymentMethod === 'card' && (step === 'cardDetails' || step === 'visaVerification');
  const showRibFlow = paymentMethod === 'rib' && (step === 'ribDetails' || step === 'enterPin' || step === 'confirmation');

  return (
    <>
      <SelectMethodSheet
        visible={step === 'selectMethod'}
        onClose={handleClose}
        onSelectMethod={selectPaymentMethod}
      />

      <TopupMobileMoneyFlow visible={showMobileMoneyFlow} onClose={handleClose} onBack={backToMethod} />

      <TopupCardFlow visible={showCardFlow} onClose={handleClose} onBack={backToMethod} />

      <TopupRibFlow visible={showRibFlow} onClose={handleClose} onBack={backToMethod} />

      {paymentMethod !== 'rib' && (
        <EnterPinSheet
          visible={step === 'enterPin'}
          onClose={handleClose}
          onBack={backFromPin}
          pin={pin}
          onPinChange={setPin}
          onSubmit={submitPin}
        />
      )}

      <ProcessingSheet
        visible={step === 'processing'}
        telco={selectedTelco}
        phoneNumber={phoneNumber}
        amount={amount}
      />

      {paymentMethod !== 'rib' && (
        <ConfirmationSheet
          visible={step === 'confirmation'}
          onClose={handleClose}
          telco={selectedTelco}
          amount={amount}
          paymentMethod={paymentMethod}
          cardNumber={cardNumber}
        />
      )}
    </>
  );
}
