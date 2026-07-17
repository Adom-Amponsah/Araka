import * as React from 'react';
import {View, Text, Pressable, TextInput, ScrollView, StyleSheet, Animated, Easing} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useSendFlowStore, LOCAL_TRANSFER_PROVIDERS, LocalTransferProvider} from '../store/sendFlowStore';
import {BottomSheet} from './components/BottomSheet';
import {ReviewSheet, SendProcessingSheet, SendSuccessSheet, SaveFavoriteSheet, ViewTransactionSheet} from './components/SendSharedSheets';
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
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {flex: 1, gap: 4},
  name: {
    color: DARK,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
  },
  sub: {
    color: GRAY,
    fontSize: 13,
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
        <View style={erb.cardLeft}>
          <Ionicons name="receipt-outline" size={36} color={CORAL} />
          <View style={erb.cardInfo}>
            <Text style={erb.cardName}>To your Equity BCDC RIB</Text>
            <Text style={erb.cardNumber}>1234 7645 4683 6832 9732</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C4CDD8" />
      </Pressable>
    </Animated.View>
  );
}

const erb = StyleSheet.create({
  wrap: {marginBottom: 16},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardInfo: {
    gap: 4,
  },
  cardName: {fontSize: 15, fontWeight: '700', fontFamily: BOLD, color: DARK},
  cardNumber: {
    fontSize: 13,
    fontFamily: SANS,
    color: GRAY,
  },
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
    <BottomSheet visible={visible} onClose={onClose} scrollable>
      <View style={lp.headerRow}>
        <Pressable onPress={onBack} style={lp.backBtn}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
        </Pressable>
        <Text style={lp.title}>Local Transfer</Text>
      </View>

      <View style={lp.searchRow}>
        <View style={lp.searchInputBox}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={lp.searchInput}
            placeholder="Search banks or mobile money..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <Pressable style={lp.filterBtn}>
          <Ionicons name="funnel-outline" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    marginRight: 12,
  },
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK},
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  searchInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: SANS,
    color: DARK,
    padding: 0,
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: CORAL,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterStrip: {gap: 8, paddingHorizontal: 0, marginBottom: 24},
  filterScroll: {flexGrow: 0, marginBottom: 8},
  section: {marginBottom: 24},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    fontFamily: BOLD,
    color: DARK,
    marginBottom: 16,
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
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={ld.header}>
        <View style={ld.logoBadge}>
          <Ionicons name={(provider?.icon || 'business') as any} size={32} color={provider?.iconColor || CORAL} />
        </View>
        <Text style={ld.title}>{isRib ? 'Send Money to your\nRIB' : `Send Money to\n${provider?.name}`}</Text>
      </View>

      {isRib ? (
        <View style={ld.ribCard}>
          <Ionicons name="receipt-outline" size={32} color={CORAL} />
          <View style={ld.ribCardInfo}>
            <Text style={ld.ribCardName}>Your Equity BCDC RIB</Text>
            <Text style={ld.ribCardNumber}>1234 7645 4683 6832 9732</Text>
          </View>
        </View>
      ) : (
        <View style={ld.section}>
          <Text style={ld.label}>Bank Account</Text>
          <View style={ld.inputRow}>
            <Ionicons name="business-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={[ld.input, {flex: 1}]}
              value={bankAccount}
              onChangeText={onBankAccountChange}
              placeholder="Enter bank account number"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
            />
          </View>
        </View>
      )}

      <View style={ld.section}>
        <Text style={ld.label}>Amount</Text>
        <View style={ld.inputRow}>
          <Ionicons name="cash-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={[ld.input, {flex: 1}]}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Enter amount"
            placeholderTextColor="#9CA3AF"
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: BOLD,
    color: DARK,
    lineHeight: 28,
  },
  section: {marginBottom: 24},
  label: {fontSize: 16, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 12},
  ribCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  ribCardInfo: {
    gap: 4,
  },
  ribCardName: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: DARK},
  ribCardNumber: {fontSize: 13, fontFamily: SANS, color: GRAY},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  input: {fontSize: 15, fontFamily: SANS, color: DARK, padding: 0},
  currency: {fontSize: 14, fontWeight: '700', fontFamily: BOLD, color: '#4B5563'},
  quickRow: {flexDirection: 'row', gap: 8, marginTop: 16},
  quickBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5F2',
  },
  quickText: {fontSize: 13, fontWeight: '700', fontFamily: BOLD, color: CORAL},
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
  const viewTransaction = useSendFlowStore((state) => state.viewTransaction);
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
        onViewTransaction={viewTransaction}
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

      <ViewTransactionSheet
        visible={step === 'viewTransaction'}
        onClose={onClose}
        amount={amount || '0.00'}
        fee={fee}
        recipientName={recipientLabel}
        recipientPhone={recipientDetail}
      />
    </>
  );
}
