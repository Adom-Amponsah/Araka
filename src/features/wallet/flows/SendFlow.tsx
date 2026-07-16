import * as React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useSendFlowStore} from '../store/sendFlowStore';
import {BottomSheet} from './components/BottomSheet';
import {SendArakaUserFlow} from './SendArakaUserFlow';
import {SendLocalTransferFlow} from './SendLocalTransferFlow';
import {SendInternationalFlow} from './SendInternationalFlow';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

export type RecipientType = 'arakaUser' | 'localTransfer' | 'internationalTransfer';

// ─────────────────────────────────────────────
// Select Recipient Type
// ─────────────────────────────────────────────
function SelectRecipientSheet({
  visible,
  onClose,
  onSelectType,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: RecipientType) => void;
}) {
  const [selected, setSelected] = React.useState<RecipientType>('arakaUser');

  const types: {id: RecipientType; icon: string; label: string; sub: string}[] = [
    {id: 'arakaUser', icon: 'person', label: 'Araka User', sub: 'Send to Araka users'},
    {id: 'localTransfer', icon: 'business', label: 'Local Transfer', sub: 'Send to banks & mobile money'},
    {id: 'internationalTransfer', icon: 'globe', label: 'International', sub: 'Send abroad'},
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={sr.title}>Send Money</Text>
      <Text style={sr.sub}>Select recipient type</Text>

      <View style={sr.list}>
        {types.map((type) => {
          const isSelected = selected === type.id;
          return (
            <Pressable
              key={type.id}
              onPress={() => setSelected(type.id)}
              style={[sr.option, isSelected && sr.optionActive]}>
              <View style={[sr.iconBox, {backgroundColor: isSelected ? CORAL : OFF}]}>
                <Ionicons name={type.icon as any} size={24} color={isSelected ? '#FFFFFF' : CORAL} />
              </View>
              <View style={sr.optionText}>
                <Text style={sr.optionLabel}>{type.label}</Text>
                <Text style={sr.optionSub}>{type.sub}</Text>
              </View>
              <View style={[sr.radio, isSelected && sr.radioActive]}>
                {isSelected && <View style={sr.radioDot} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => onSelectType(selected)} style={sr.btn}>
        <Text style={sr.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const sr = StyleSheet.create({
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
// Main Send Flow Orchestrator
// ─────────────────────────────────────────────
export function SendFlow({visible, onClose}: {visible: boolean; onClose: () => void}) {
  const step = useSendFlowStore((state) => state.step);
  const recipientType = useSendFlowStore((state) => state.recipientType);

  const selectRecipientType = useSendFlowStore((state) => state.selectRecipientType);
  const reset = useSendFlowStore((state) => state.reset);
  const backToRecipient = useSendFlowStore((state) => state.backToRecipient);

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!visible) {
    return null;
  }

  const showArakaUserFlow = recipientType === 'arakaUser' && step !== 'selectRecipient';
  const showLocalTransferFlow = recipientType === 'localTransfer' && step !== 'selectRecipient';
  const showInternationalFlow = recipientType === 'internationalTransfer' && step !== 'selectRecipient';

  return (
    <>
      <SelectRecipientSheet
        visible={step === 'selectRecipient'}
        onClose={handleClose}
        onSelectType={selectRecipientType}
      />

      <SendArakaUserFlow
        visible={showArakaUserFlow}
        onClose={handleClose}
        onBack={backToRecipient}
      />

      <SendLocalTransferFlow
        visible={showLocalTransferFlow}
        onClose={handleClose}
        onBack={backToRecipient}
      />

      <SendInternationalFlow
        visible={showInternationalFlow}
        onClose={handleClose}
        onBack={backToRecipient}
      />
    </>
  );
}
