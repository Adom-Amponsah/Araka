import * as React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useWithdrawFlowStore, WithdrawMethod} from '../store/withdrawFlowStore';
import {BottomSheet} from './components/BottomSheet';
import {SaveFavoriteSheet} from './components/SendSharedSheets';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const GREEN = '#10B981';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

const QUICK_AMOUNTS = ['10', '25', '50', '100'];

// ─────────────────────────────────────────────
// Select Method Sheet
// ─────────────────────────────────────────────
function SelectMethodSheet({
  visible,
  onClose,
  onSelectMethod,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectMethod: (method: WithdrawMethod) => void;
}) {
  const [selected, setSelected] = React.useState<WithdrawMethod>('atm');

  const methods: {id: WithdrawMethod; icon: string; label: string; sub: string}[] = [
    {id: 'atm', icon: 'cash-outline', label: 'ATM', sub: 'All banks'},
    {id: 'agent', icon: 'storefront-outline', label: 'Agents', sub: 'Cashout from Araka agent'},
    {id: 'cashoutCode', icon: 'key-outline', label: 'Cashout Code', sub: 'Generate a cashout code for someone'},
  ];

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={sm.title}>Withdraw</Text>
      <Text style={sm.sub}>Choose how you want to withdraw</Text>

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
// Enter Amount Sheet
// ─────────────────────────────────────────────
function EnterAmountSheet({
  visible,
  onClose,
  onBack,
  title,
  sub,
  amount,
  onAmountChange,
  onContinue,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  title: string;
  sub: string;
  amount: string;
  onAmountChange: (val: string) => void;
  onContinue: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <Text style={ea.title}>{title}</Text>
      <Text style={ea.sub}>{sub}</Text>

      <View style={ea.fieldWrap}>
        <Text style={ea.fieldLabel}>Amount</Text>
        <View style={ea.inputRow}>
          <Ionicons name="cash-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={ea.input}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Enter amount"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <Text style={ea.currency}>USD</Text>
        </View>
      </View>

      <View style={ea.quickRow}>
        {QUICK_AMOUNTS.map((amt) => (
          <Pressable key={amt} onPress={() => onAmountChange(amt)} style={ea.quickBtn}>
            <Text style={ea.quickText}>${amt}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onContinue} style={ea.btn}>
        <Text style={ea.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const ea = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24},
  fieldWrap: {gap: 6, marginBottom: 16},
  fieldLabel: {fontSize: 13, fontWeight: '600', fontFamily: BOLD, color: DARK},
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
    marginBottom: 16,
  },
  input: {flex: 1, fontSize: 15, fontFamily: SANS, color: DARK, padding: 0},
  currency: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: GRAY},
  quickRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24},
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
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
});

// ─────────────────────────────────────────────
// Agent Details Sheet
// ─────────────────────────────────────────────
function AgentDetailsSheet({
  visible,
  onClose,
  onBack,
  agentNumber,
  onAgentNumberChange,
  amount,
  onAmountChange,
  onContinue,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  agentNumber: string;
  onAgentNumberChange: (val: string) => void;
  amount: string;
  onAmountChange: (val: string) => void;
  onContinue: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <Text style={ad.title}>Withdraw from Agent</Text>
      <Text style={ad.sub}>Enter the agent and amount details</Text>

      <View style={ad.form}>
        <View style={ad.fieldWrap}>
          <Text style={ad.fieldLabel}>Agent Number</Text>
          <View style={ad.inputRow}>
            <Ionicons name="storefront-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={ad.input}
              value={agentNumber}
              onChangeText={onAgentNumberChange}
              placeholder="Enter agent number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={ad.fieldWrap}>
          <Text style={ad.fieldLabel}>Amount</Text>
          <View style={ad.inputRow}>
            <Ionicons name="cash-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={ad.input}
              value={amount}
              onChangeText={onAmountChange}
              placeholder="Enter amount"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
            <Text style={ad.currency}>USD</Text>
          </View>
        </View>
      </View>

      <View style={ad.quickRow}>
        {QUICK_AMOUNTS.map((amt) => (
          <Pressable key={amt} onPress={() => onAmountChange(amt)} style={ad.quickBtn}>
            <Text style={ad.quickText}>${amt}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onContinue} style={ad.btn}>
        <Text style={ad.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const ad = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24},
  form: {gap: 14, marginBottom: 16},
  fieldWrap: {gap: 6},
  fieldLabel: {fontSize: 13, fontWeight: '600', fontFamily: BOLD, color: DARK},
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
  quickRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16},
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
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
});

// ─────────────────────────────────────────────
// Confirm Withdrawal Sheet
// ─────────────────────────────────────────────
function ConfirmWithdrawalSheet({
  visible,
  onClose,
  onBack,
  amount,
  agentName,
  onEdit,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  amount: string;
  agentName?: string;
  onEdit: () => void;
  onConfirm: () => void;
}) {
  const fee = 0.5;
  const total = (parseFloat(amount) || 0) + fee;

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <Text style={cw.title}>Confirm your withdrawal</Text>
      <Text style={cw.sub}>Review the details before confirming</Text>

      <View style={cw.table}>
        {agentName && (
          <>
            <View style={cw.tableRow}>
              <Text style={cw.tableLabel}>Agent Name</Text>
              <Text style={cw.tableValue}>{agentName}</Text>
            </View>
            <View style={cw.tableDivider} />
          </>
        )}
        <View style={cw.tableRow}>
          <Text style={cw.tableLabel}>Amount</Text>
          <Text style={cw.tableValue}>${(parseFloat(amount) || 0).toFixed(2)} USD</Text>
        </View>
        <View style={cw.tableDivider} />
        <View style={cw.tableRow}>
          <Text style={cw.tableLabel}>Fee</Text>
          <Text style={cw.tableValue}>${fee.toFixed(2)} USD</Text>
        </View>
        <View style={cw.tableDivider} />
        <View style={cw.tableRow}>
          <Text style={cw.totalLabel}>Total</Text>
          <Text style={cw.totalValue}>${total.toFixed(2)} USD</Text>
        </View>
      </View>

      <Pressable onPress={onConfirm} style={cw.confirmBtn}>
        <Text style={cw.confirmBtnText}>Confirm</Text>
      </Pressable>

      <Pressable onPress={onEdit} style={cw.editBtn}>
        <Text style={cw.editBtnText}>Edit</Text>
      </Pressable>
    </BottomSheet>
  );
}

const cw = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24},
  table: {
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableLabel: {fontSize: 14, fontFamily: SANS, color: GRAY},
  tableValue: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: DARK},
  tableDivider: {height: 1, backgroundColor: '#E5E7EB', marginVertical: 12},
  totalLabel: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: DARK},
  totalValue: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: CORAL},
  confirmBtn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmBtnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  editBtn: {paddingVertical: 12, alignItems: 'center'},
  editBtnText: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: GRAY},
});

// ─────────────────────────────────────────────
// Withdrawal Success Sheet
// ─────────────────────────────────────────────
function WithdrawalSuccessSheet({
  visible,
  onClose,
  cashoutCode,
  agentName,
  agentNumber,
  total,
  onDone,
}: {
  visible: boolean;
  onClose: () => void;
  cashoutCode: string;
  agentName?: string;
  agentNumber?: string;
  total?: string;
  onDone: () => void;
}) {
  const codeDigits = cashoutCode.padEnd(6, ' ').split('').slice(0, 6);
  const isAgent = !!agentName;

  return (
    <BottomSheet visible={visible} onClose={onClose} fullHeight>
      <View style={ws.content}>
        <View style={ws.checkCircle}>
          <Ionicons name="checkmark" size={36} color="#FFFFFF" />
        </View>

        <Text style={ws.title}>Withdrawal Successful</Text>

        {isAgent ? (
          <>
            <View style={ws.card}>
              <View style={ws.cardRow}>
                <Text style={ws.cardLabel}>Agent Name</Text>
                <Text style={ws.cardValue}>{agentName}</Text>
              </View>
              <View style={ws.cardDivider} />
              <View style={ws.cardRow}>
                <Text style={ws.cardLabel}>Agent Number</Text>
                <Text style={ws.cardValue}>{agentNumber}</Text>
              </View>
              <View style={ws.cardDivider} />
              <View style={ws.cardRow}>
                <Text style={ws.cardLabel}>Total Amount</Text>
                <Text style={ws.cardAmount}>{total}</Text>
              </View>
            </View>

            <Pressable onPress={onDone} style={ws.btn}>
              <Text style={ws.btnText}>Done</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={ws.sub}>Your cashout code</Text>

            <View style={ws.codeRow}>
              {codeDigits.map((digit, i) => (
                <View key={i} style={ws.codeBox}>
                  <Text style={ws.codeDigit}>{digit.trim()}</Text>
                </View>
              ))}
            </View>

            <Pressable onPress={onDone} style={ws.btn}>
              <Text style={ws.btnText}>Done</Text>
            </Pressable>

            <Pressable onPress={onClose} style={ws.viewTxBtn}>
              <Text style={ws.viewTxText}>View Transaction</Text>
            </Pressable>
          </>
        )}
      </View>
    </BottomSheet>
  );
}

const ws = StyleSheet.create({
  content: {alignItems: 'center', paddingTop: 20},
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 8, textAlign: 'center'},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24, textAlign: 'center'},
  card: {
    backgroundColor: OFF,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    width: '100%',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {fontSize: 14, fontFamily: SANS, color: GRAY},
  cardValue: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: DARK},
  cardAmount: {fontSize: 16, fontWeight: '700', fontFamily: BOLD, color: CORAL},
  cardDivider: {height: 1, backgroundColor: '#E5E7EB', marginVertical: 12},
  codeRow: {flexDirection: 'row', gap: 10, marginBottom: 32},
  codeBox: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: CORAL,
    backgroundColor: '#FFF5F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeDigit: {fontSize: 20, fontWeight: '700', fontFamily: BOLD, color: DARK},
  btn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  viewTxBtn: {paddingVertical: 12, alignItems: 'center', width: '100%'},
  viewTxText: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: GRAY},
});

// ─────────────────────────────────────────────
// Main Withdraw Flow Orchestrator
// ─────────────────────────────────────────────
export function WithdrawFlow({visible, onClose}: {visible: boolean; onClose: () => void}) {
  const step = useWithdrawFlowStore((state) => state.step);
  const method = useWithdrawFlowStore((state) => state.method);
  const amount = useWithdrawFlowStore((state) => state.amount);
  const agentNumber = useWithdrawFlowStore((state) => state.agentNumber);
  const agentName = useWithdrawFlowStore((state) => state.agentName);
  const cashoutCode = useWithdrawFlowStore((state) => state.cashoutCode);

  const selectMethod = useWithdrawFlowStore((state) => state.selectMethod);
  const setAmount = useWithdrawFlowStore((state) => state.setAmount);
  const setAgentNumber = useWithdrawFlowStore((state) => state.setAgentNumber);
  const submitAgentDetails = useWithdrawFlowStore((state) => state.submitAgentDetails);
  const confirm = useWithdrawFlowStore((state) => state.confirm);
  const backToMethod = useWithdrawFlowStore((state) => state.backToMethod);
  const backToAmount = useWithdrawFlowStore((state) => state.backToAmount);
  const backToAgentDetails = useWithdrawFlowStore((state) => state.backToAgentDetails);
  const goToSaveFavorite = useWithdrawFlowStore((state) => state.goToSaveFavorite);
  const reset = useWithdrawFlowStore((state) => state.reset);

  const handleClose = React.useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!visible) {
    return null;
  }

  const fee = 0.5;
  const total = `$${((parseFloat(amount) || 0) + fee).toFixed(2)} USD`;
  const isAgent = method === 'agent';

  return (
    <>
      <SelectMethodSheet
        visible={step === 'selectMethod'}
        onClose={handleClose}
        onSelectMethod={selectMethod}
      />

      {/* ATM flow — amount entry */}
      {method === 'atm' && (
        <EnterAmountSheet
          visible={step === 'enterAmount'}
          onClose={handleClose}
          onBack={backToMethod}
          title="Withdraw from ATM"
          sub="Enter the amount you want to withdraw"
          amount={amount}
          onAmountChange={setAmount}
          onContinue={() => useWithdrawFlowStore.setState({step: 'confirm'})}
        />
      )}

      {/* Cashout Code flow — amount entry */}
      {method === 'cashoutCode' && (
        <EnterAmountSheet
          visible={step === 'enterAmount'}
          onClose={handleClose}
          onBack={backToMethod}
          title="Generate Cashout Code"
          sub="Enter the amount for the cashout code"
          amount={amount}
          onAmountChange={setAmount}
          onContinue={() => useWithdrawFlowStore.setState({step: 'confirm'})}
        />
      )}

      {/* Agent flow — agent number + amount entry */}
      {isAgent && (
        <AgentDetailsSheet
          visible={step === 'enterAmount'}
          onClose={handleClose}
          onBack={backToMethod}
          agentNumber={agentNumber}
          onAgentNumberChange={setAgentNumber}
          amount={amount}
          onAmountChange={setAmount}
          onContinue={submitAgentDetails}
        />
      )}

      <ConfirmWithdrawalSheet
        visible={step === 'confirm'}
        onClose={handleClose}
        onBack={isAgent ? backToAgentDetails : backToAmount}
        amount={amount}
        agentName={isAgent ? agentName : undefined}
        onEdit={isAgent ? backToAgentDetails : backToAmount}
        onConfirm={confirm}
      />

      <WithdrawalSuccessSheet
        visible={step === 'success'}
        onClose={handleClose}
        cashoutCode={cashoutCode}
        agentName={isAgent ? agentName : undefined}
        agentNumber={isAgent ? agentNumber : undefined}
        total={isAgent ? total : undefined}
        onDone={isAgent ? goToSaveFavorite : handleClose}
      />

      {isAgent && (
        <SaveFavoriteSheet
          visible={step === 'saveFavorite'}
          onClose={handleClose}
          recipientLabel={agentName}
          recipientDetail={agentNumber}
          amount={amount}
          onReset={reset}
        />
      )}
    </>
  );
}
