import * as React from 'react';
import {View, Text, Pressable, TextInput, ScrollView, StyleSheet, Animated, Easing} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useSendFlowStore, LOCAL_TRANSFER_PROVIDERS, LocalTransferProvider} from '../store/sendFlowStore';
import {BottomSheet} from './components/BottomSheet';
import {ReviewSheet, SendProcessingSheet, SendSuccessSheet, SaveFavoriteSheet} from './components/SendSharedSheets';
import {EnterPinSheet} from './components/SharedSheets';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SLATE = '#3D4A5C';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// Filter Pill (matches ServicesScreen style)
// ─────────────────────────────────────────────
function FilterPill({label, isActive, onPress}: {label: string; isActive: boolean; onPress: () => void}) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scaleAnim, {toValue: 0.92, useNativeDriver: true, damping: 15, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, damping: 10, stiffness: 200}).start();

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <View style={[fp.pill, isActive && fp.pillActive]}>
          <Text style={[fp.label, isActive && fp.labelActive]}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const fp = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    backgroundColor: '#FFFFFF',
  },
  pillActive: {
    backgroundColor: DARK,
    borderColor: DARK,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: SANS,
    color: SLATE,
    letterSpacing: 0.1,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});

// ─────────────────────────────────────────────
// Provider Row (matches ServicesScreen style)
// ─────────────────────────────────────────────
function ProviderRow({provider, index, onPress}: {provider: LocalTransferProvider; index: number; onPress: () => void}) {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideX = React.useRef(new Animated.Value(14)).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    fadeIn.setValue(0);
    slideX.setValue(14);
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeIn, {toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(slideX, {toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]).start();
    }, index * 60);
  }, [provider.id]);

  const pressIn = () => Animated.spring(scale, {toValue: 0.98, useNativeDriver: true, damping: 20, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200}).start();

  return (
    <Animated.View style={[pr.wrap, {opacity: fadeIn, transform: [{translateX: slideX}, {scale}]}]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={pr.row}>
        <View style={[pr.iconBadge, {backgroundColor: provider.iconBg}]}>
          <Ionicons name={provider.icon as any} size={20} color={provider.iconColor} />
        </View>
        <View style={pr.info}>
          <Text style={pr.name} numberOfLines={1}>{provider.name}</Text>
          <Text style={pr.sub} numberOfLines={1}>{provider.sub}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C4CDD8" />
      </Pressable>
    </Animated.View>
  );
}

const pr = StyleSheet.create({
  wrap: {marginBottom: 10},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EDF0F4',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {flex: 1, gap: 3},
  name: {
    color: DARK,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
    letterSpacing: -0.2,
  },
  sub: {
    color: '#8A94A6',
    fontSize: 12,
    fontFamily: SANS,
  },
});

// ─────────────────────────────────────────────
// Equity RIB Card (special first card)
// ─────────────────────────────────────────────
function EquityRibCard({onPress}: {onPress: () => void}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, {toValue: 0.98, useNativeDriver: true, damping: 20, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200}).start();

  return (
    <Animated.View style={[erb.wrap, {transform: [{scale}]}]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={erb.card}>
        <View style={erb.cardTop}>
          <View style={erb.chipRow}>
            <Ionicons name="card-chip-outline" size={20} color="#2563EB" />
            <Text style={erb.bankName}>Equity RIB</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C4CDD8" />
        </View>
        <Text style={erb.cardNumber}>122993 393939 3999</Text>
        <View style={erb.cardBottom}>
          <Text style={erb.cardLabel}>Your Equity RIB</Text>
          <View style={erb.badge}>
            <Text style={erb.badgeText}>RIB</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const erb = StyleSheet.create({
  wrap: {marginBottom: 16},
  card: {
    backgroundColor: '#EAF2FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chipRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  bankName: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: '#2563EB'},
  cardNumber: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
    letterSpacing: 2,
    marginBottom: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {fontSize: 12, fontFamily: SANS, color: GRAY},
  badge: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {fontSize: 10, fontWeight: '700', fontFamily: BOLD, color: '#FFFFFF'},
});

// ─────────────────────────────────────────────
// Provider Selection Sheet
// ─────────────────────────────────────────────
function LocalTransferProvidersSheet({
  visible,
  onClose,
  onBack,
  onSelectProvider,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  onSelectProvider: (provider: LocalTransferProvider) => void;
}) {
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'banks' | 'mobileMoney'>('all');

  const ribProvider = LOCAL_TRANSFER_PROVIDERS.find(p => p.category === 'rib');
  const banks = LOCAL_TRANSFER_PROVIDERS.filter(p => p.category === 'banks');
  const mobileMoney = LOCAL_TRANSFER_PROVIDERS.filter(p => p.category === 'mobileMoney');

  const showRib = activeFilter === 'all';
  const showBanks = activeFilter === 'all' || activeFilter === 'banks';
  const showMobileMoney = activeFilter === 'all' || activeFilter === 'mobileMoney';

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack} scrollable>
      <Text style={lp.title}>Local Transfer</Text>
      <Text style={lp.sub}>Select a provider</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={lp.filterStrip}
        style={lp.filterScroll}
        nestedScrollEnabled>
        <FilterPill label="All" isActive={activeFilter === 'all'} onPress={() => setActiveFilter('all')} />
        <FilterPill label="Banks" isActive={activeFilter === 'banks'} onPress={() => setActiveFilter('banks')} />
        <FilterPill label="Mobile Money" isActive={activeFilter === 'mobileMoney'} onPress={() => setActiveFilter('mobileMoney')} />
      </ScrollView>

      {showRib && ribProvider && (
        <View style={lp.section}>
          <EquityRibCard onPress={() => onSelectProvider(ribProvider)} />
        </View>
      )}

      {showBanks && (
        <View style={lp.section}>
          <Text style={lp.sectionTitle}>Banks</Text>
          {banks.map((provider, index) => (
            <ProviderRow
              key={provider.id}
              provider={provider}
              index={index}
              onPress={() => onSelectProvider(provider)}
            />
          ))}
        </View>
      )}

      {showMobileMoney && (
        <View style={lp.section}>
          <Text style={lp.sectionTitle}>Mobile Money</Text>
          {mobileMoney.map((provider, index) => (
            <ProviderRow
              key={provider.id}
              provider={provider}
              index={index}
              onPress={() => onSelectProvider(provider)}
            />
          ))}
        </View>
      )}
    </BottomSheet>
  );
}

const lp = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 16},
  filterStrip: {gap: 8, paddingHorizontal: 0, marginBottom: 16},
  filterScroll: {flexGrow: 0, marginBottom: 8},
  section: {marginBottom: 20},
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: BOLD,
    color: SLATE,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
});

// ─────────────────────────────────────────────
// Local Transfer Details Sheet
// ─────────────────────────────────────────────
function LocalTransferDetailsSheet({
  visible,
  onClose,
  onBack,
  provider,
  bankAccount,
  amount,
  onBankAccountChange,
  onAmountChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  provider: LocalTransferProvider | null;
  bankAccount: string;
  amount: string;
  onBankAccountChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onSubmit: () => void;
}) {
  const quickAmounts = ['1', '5', '10', '20'];
  const isRib = provider?.category === 'rib';

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack}>
      <View style={ld.header}>
        <View style={ld.logo}>
          <Ionicons name={(provider?.icon || 'business') as any} size={24} color={provider?.iconColor || CORAL} />
        </View>
        <Text style={ld.title}>{provider?.name || 'Transfer'}</Text>
      </View>

      <View style={ld.section}>
        <Text style={ld.label}>{isRib ? 'Your Equity RIB Card' : 'Bank Account'}</Text>
        {isRib ? (
          <View style={ld.ribDisplay}>
            <Ionicons name="card-chip-outline" size={20} color="#2563EB" />
            <Text style={ld.ribNumber}>122993 393939 3999</Text>
          </View>
        ) : (
          <View style={ld.inputRow}>
            <Ionicons name="business-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={[ld.input, {flex: 1}]}
              value={bankAccount}
              onChangeText={onBankAccountChange}
              placeholder="Enter bank account number"
              placeholderTextColor="#D1D5DB"
              keyboardType="numeric"
            />
          </View>
        )}
      </View>

      <View style={ld.section}>
        <Text style={ld.label}>Amount</Text>
        <View style={ld.inputRow}>
          <Ionicons name="cash-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={[ld.input, {flex: 1}]}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Enter amount"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
          />
          <Text style={ld.currency}>USD</Text>
          <Ionicons name="chevron-down" size={16} color={GRAY} />
        </View>

        <View style={ld.quickRow}>
          {quickAmounts.map((amt) => (
            <Pressable key={amt} onPress={() => onAmountChange(amt)} style={ld.quickBtn}>
              <Text style={ld.quickText}>${amt}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable onPress={onSubmit} style={ld.btn}>
        <Text style={ld.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const ld = StyleSheet.create({
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
  input: {fontSize: 15, fontFamily: SANS, color: DARK, padding: 0},
  currency: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: GRAY},
  ribDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  ribNumber: {fontSize: 15, fontWeight: '600', fontFamily: BOLD, color: '#2563EB', letterSpacing: 1},
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
// Main Local Transfer Flow
// ─────────────────────────────────────────────
export function SendLocalTransferFlow({visible, onClose, onBack}: {visible: boolean; onClose: () => void; onBack: () => void}) {
  const step = useSendFlowStore((state) => state.step);
  const selectedProvider = useSendFlowStore((state) => state.selectedProvider);
  const bankAccount = useSendFlowStore((state) => state.bankAccount);
  const amount = useSendFlowStore((state) => state.amount);
  const fee = useSendFlowStore((state) => state.fee);
  const pin = useSendFlowStore((state) => state.pin);

  const selectProvider = useSendFlowStore((state) => state.selectProvider);
  const setBankAccount = useSendFlowStore((state) => state.setBankAccount);
  const setAmount = useSendFlowStore((state) => state.setAmount);
  const submitDetails = useSendFlowStore((state) => state.submitDetails);
  const editDetails = useSendFlowStore((state) => state.editDetails);
  const confirmReview = useSendFlowStore((state) => state.confirmReview);
  const setPin = useSendFlowStore((state) => state.setPin);
  const submitPin = useSendFlowStore((state) => state.submitPin);
  const saveFavorite = useSendFlowStore((state) => state.saveFavorite);
  const backToProviders = useSendFlowStore((state) => state.backToProviders);
  const backToDetails = useSendFlowStore((state) => state.backToDetails);

  if (!visible) {
    return null;
  }

  const recipientLabel = selectedProvider?.name || 'Local Transfer';
  const recipientDetail = selectedProvider?.category === 'rib'
    ? '122993 393939 3999'
    : bankAccount || '—';

  return (
    <>
      <LocalTransferProvidersSheet
        visible={step === 'localTransferProviders'}
        onClose={onClose}
        onBack={onBack}
        onSelectProvider={selectProvider}
      />

      <LocalTransferDetailsSheet
        visible={step === 'localTransferDetails'}
        onClose={onClose}
        onBack={backToProviders}
        provider={selectedProvider}
        bankAccount={bankAccount}
        amount={amount}
        onBankAccountChange={setBankAccount}
        onAmountChange={setAmount}
        onSubmit={submitDetails}
      />

      <ReviewSheet
        visible={step === 'review'}
        onClose={onClose}
        onBack={backToDetails}
        recipientLabel={recipientLabel}
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
        recipientLabel={recipientLabel}
        recipientDetail={recipientDetail}
        amount={amount}
      />

      <SendSuccessSheet
        visible={step === 'success'}
        onClose={onClose}
        onDone={saveFavorite}
        recipientLabel={recipientLabel}
        recipientDetail={recipientDetail}
        amount={amount}
      />

      <SaveFavoriteSheet
        visible={step === 'saveFavorite'}
        onClose={onClose}
        recipientLabel={recipientLabel}
        recipientDetail={recipientDetail}
        amount={amount}
      />
    </>
  );
}
