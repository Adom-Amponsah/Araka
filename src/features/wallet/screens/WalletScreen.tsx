import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BurgerMenu} from '@features/home/components/BurgerMenu';
import {selectUnreadCount, useNotificationStore} from '@features/notifications/store/notificationStore';
import {useAppStore} from '@shared/store/appStore';
import {getSystemFont} from '@styles/typography';
import {TopupFlow} from '../flows/TopupFlow';
import {SendFlow} from '../flows/SendFlow';
import {WithdrawFlow} from '../flows/WithdrawFlow';
import {useTopupFlowStore} from '../store/topupFlowStore';
import {useSendFlowStore} from '../store/sendFlowStore';
import {useWithdrawFlowStore} from '../store/withdrawFlowStore';
import {BottomSheet} from '../flows/components/BottomSheet';

const {width} = Dimensions.get('window');

const CORAL = '#F27649';
const DARK = '#1A2535';
const OFF = '#F4F6FA';
const GREEN = '#10B981';
const DISPLAY = getSystemFont('condensed');
const SANS = getSystemFont();

const WALLETS = [
  {id: 'usd', currency: 'USD', balance: '12,450', tint: '#E09272'},
  {id: 'cdf', currency: 'CDF', balance: '34,820,000', tint: '#536177'},
];

const PRIMARY_ACTIONS = [
  {label: 'Top Up', icon: 'add-outline'},
  {label: 'Send', icon: 'paper-plane-outline'},
  {label: 'Withdraw', icon: 'arrow-down-outline'},
  {label: 'Add wallet', icon: 'wallet-outline'},
];

const SECONDARY_ACTIONS = [
  {label: 'Add Card', icon: 'card-outline'},
  {label: 'Payment Link', icon: 'link-outline'},
  {label: 'Pay Bills', icon: 'receipt-outline'},
  {label: 'Reduce', icon: 'chevron-up-outline'},
];

const TRANSACTIONS = [
  {
    id: 'w1',
    label: 'Airtime - Vodacom',
    provider: 'Vodacom',
    type: 'out',
    amount: 5.00,
    currency: 'USD',
    date: new Date('2026-02-17T09:14:00'),
    status: 'completed',
    icon: 'phone-portrait-outline',
    iconBg: '#FEE8DF',
    iconColor: '#E53E3E',
  },
  {
    id: 'w2',
    label: 'To Natalia',
    provider: 'Transfer',
    type: 'out',
    amount: 45.30,
    currency: 'USD',
    date: new Date('2026-02-20T14:30:00'),
    status: 'completed',
    icon: 'paper-plane-outline',
    iconBg: '#FFF3EE',
    iconColor: CORAL,
  },
  {
    id: 'w3',
    label: 'From Matthew',
    provider: 'Bank Transfer',
    type: 'in',
    amount: 120.00,
    currency: 'USD',
    date: new Date('2026-02-18T16:45:00'),
    status: 'completed',
    icon: 'arrow-down-outline',
    iconBg: '#EDFBF4',
    iconColor: GREEN,
  },
];

// Action strip — circular buttons on the orange hero
function ActionStrip({showMore, onToggleMore, onTopUp, onSend, onWithdraw, onPayBills, onAddCard, onAddWallet, onPaymentLink}: {showMore: boolean; onToggleMore: () => void; onTopUp: () => void; onSend: () => void; onWithdraw: () => void; onPayBills: () => void; onAddCard: () => void; onAddWallet: () => void; onPaymentLink: () => void}) {
  const actions = showMore ? [...PRIMARY_ACTIONS, ...SECONDARY_ACTIONS] : [...PRIMARY_ACTIONS.slice(0, 3), {label: 'More', icon: 'ellipsis-horizontal-outline'}];
  
  // Fixed array of 8 scales to avoid hooks violation
  const scales = React.useMemo(() => 
    Array.from({length: 8}, () => new Animated.Value(1)),
    []
  );

  const pi = (i: number) =>
    Animated.spring(scales[i], {toValue: 0.9, damping: 14, stiffness: 280, useNativeDriver: true}).start();
  const po = (i: number) =>
    Animated.spring(scales[i], {toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true}).start();

  const tints = ['#D6653D', '#E07C55', '#EA9270', '#F5A98C', '#D6653D', '#E07C55', '#EA9270', '#F5A98C'];

  const handlePress = (label: string) => {
    if (label === 'More' || label === 'Reduce') {
      onToggleMore();
    } else if (label === 'Top Up') {
      onTopUp();
    } else if (label === 'Send') {
      onSend();
    } else if (label === 'Withdraw') {
      onWithdraw();
    } else if (label === 'Pay Bills') {
      onPayBills();
    } else if (label === 'Add Card') {
      onAddCard();
    } else if (label === 'Add wallet') {
      onAddWallet();
    } else if (label === 'Payment Link') {
      onPaymentLink();
    }
  };

  return (
    <View style={as.grid}>
      {actions.map((action, i) => (
        <Animated.View key={`${action.label}-${i}`} style={{transform: [{scale: scales[i]}]}}>
          <Pressable
            onPressIn={() => pi(i)}
            onPressOut={() => po(i)}
            onPress={() => handlePress(action.label)}
            style={as.tile}>
            <View style={[as.pillIcon, {backgroundColor: tints[i]}]}>
              <Ionicons name={action.icon as any} size={20} color="#FFFFFF" />
            </View>
            <Text style={as.pillLabel}>{action.label}</Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

const as = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    gap: 16,
  },
  tile: {
    alignItems: 'center',
    gap: 8,
  },
  pillIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  pillLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: SANS,
    textAlign: 'center',
  },
});

// Helper to format time
function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'});
}

// Transaction row — matching TransactionsScreen
function TxnRow({txn, index}: {txn: typeof TRANSACTIONS[number]; index: number}) {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideX = React.useRef(new Animated.Value(16)).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeIn, {toValue: 1, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(slideX, {toValue: 0, duration: 240, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]).start();
    }, Math.min(index * 40, 280));
  }, []);

  const pressIn = () => Animated.spring(scale, {toValue: 0.97, useNativeDriver: true, damping: 15, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 10, stiffness: 200}).start();

  const isOut = txn.type === 'out';

  return (
    <Animated.View style={{opacity: fadeIn, transform: [{translateX: slideX}, {scale}]}}>
      <Pressable onPressIn={pressIn} onPressOut={pressOut} style={tw.row}>
        <View style={[tw.iconBadge, {backgroundColor: txn.iconBg}]}>
          <Ionicons name={txn.icon as any} size={19} color={txn.iconColor} />
        </View>
        <View style={tw.info}>
          <Text style={tw.label} numberOfLines={1}>{txn.label}</Text>
          <Text style={tw.sub}>{txn.provider} · {formatTime(txn.date)}</Text>
        </View>
        <View style={tw.right}>
          <Text style={[tw.amount, {color: isOut ? DARK : GREEN}]}>
            {isOut ? '−' : '+'}{txn.currency} {txn.amount.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const tw = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.055,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {flex: 1},
  label: {color: DARK, fontSize: 14, fontWeight: '600', fontFamily: getSystemFont('medium'), letterSpacing: 0.1, marginBottom: 3},
  sub: {color: '#9CA3AF', fontSize: 11, fontFamily: SANS},
  right: {alignItems: 'flex-end', gap: 4},
  amount: {fontSize: 14, fontWeight: '700', fontFamily: getSystemFont('bold'), letterSpacing: 0.1},
});

// ─────────────────────────────────────────────
// Add Card Sheet
// ─────────────────────────────────────────────
function AddCardSheet({visible, onClose}: {visible: boolean; onClose: () => void}) {
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [nickname, setNickname] = React.useState('');

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={ac.title}>Add a Card</Text>
      <Text style={ac.sub}>Save these details to make future payments</Text>

      <View style={ac.form}>
        <View style={ac.inputRow}>
          <Ionicons name="card-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={ac.input}
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            placeholder="Card number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        <View style={ac.row}>
          <View style={[ac.inputRow, {flex: 1}]}>
            <TextInput
              style={ac.input}
              value={expiry}
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              placeholder="MM/YY"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={[ac.inputRow, {flex: 1}]}>
            <TextInput
              style={ac.input}
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 4))}
              placeholder="CVV"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <View style={ac.inputRow}>
          <TextInput
            style={ac.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Nickname (optional)"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <Pressable onPress={onClose} style={ac.btn}>
        <Text style={ac.btnText}>Save</Text>
      </Pressable>

      <Pressable onPress={onClose} style={ac.skipBtn}>
        <Text style={ac.skipText}>Not Now</Text>
      </Pressable>
    </BottomSheet>
  );
}

const ac = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: getSystemFont('bold'), color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: '#8A94A6', marginBottom: 24},
  form: {gap: 14, marginBottom: 24},
  row: {flexDirection: 'row', gap: 12},
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
  btn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: getSystemFont('bold')},
  skipBtn: {paddingVertical: 12, alignItems: 'center'},
  skipText: {fontSize: 14, fontWeight: '700', fontFamily: getSystemFont('bold'), color: '#8A94A6'},
});

// ─────────────────────────────────────────────
// Add Wallet Sheet
// ─────────────────────────────────────────────
function AddWalletSheet({visible, onClose}: {visible: boolean; onClose: () => void}) {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [nickname, setNickname] = React.useState('');

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={ac.title}>Add a Wallet</Text>
      <Text style={ac.sub}>Save these details to make future payments</Text>

      <View style={ac.form}>
        <View style={aw.fieldWrap}>
          <Text style={aw.label}>Phone Number</Text>
          <View style={ac.inputRow}>
            <Ionicons name="phone-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={ac.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={aw.fieldWrap}>
          <Text style={aw.label}>Nickname <Text style={aw.optional}>(optional)</Text></Text>
          <View style={ac.inputRow}>
            <Ionicons name="person-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
            <TextInput
              style={ac.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="Enter nickname"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>

      <Pressable onPress={onClose} style={ac.btn}>
        <Text style={ac.btnText}>Save</Text>
      </Pressable>

      <Pressable onPress={onClose} style={ac.skipBtn}>
        <Text style={ac.skipText}>Not Now</Text>
      </Pressable>
    </BottomSheet>
  );
}

const aw = StyleSheet.create({
  fieldWrap: {gap: 6},
  label: {fontSize: 13, fontWeight: '600', fontFamily: getSystemFont('bold'), color: DARK},
  optional: {fontSize: 12, fontFamily: SANS, color: '#8A94A6', fontWeight: '400'},
});

export function WalletScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const unreadNotifications = useNotificationStore(selectUnreadCount);
  const user = useAppStore(state => state.user);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [activeWallet, setActiveWallet] = React.useState(0);
  const [showMoreActions, setShowMoreActions] = React.useState(false);
  const [topupVisible, setTopupVisible] = React.useState(false);
  const [sendVisible, setSendVisible] = React.useState(false);
  const [addCardVisible, setAddCardVisible] = React.useState(false);
  const [addWalletVisible, setAddWalletVisible] = React.useState(false);
  const [withdrawVisible, setWithdrawVisible] = React.useState(false);
  const startTopup = useTopupFlowStore((state) => state.start);
  const startSend = useSendFlowStore((state) => state.start);
  const startWithdraw = useWithdrawFlowStore((state) => state.start);
  const displayName = user?.name || 'Adom Isaac';
  const displayEmail = user?.email || 'adom@araka.app';

  const heroFade = React.useRef(new Animated.Value(0)).current;
  const heroY = React.useRef(new Animated.Value(-12)).current;
  const cardSlide = React.useRef(new Animated.Value(42)).current;
  const cardFade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, {toValue: 1, duration: 360, useNativeDriver: true}),
        Animated.timing(heroY, {
          toValue: 0,
          duration: 360,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardFade, {toValue: 1, duration: 320, useNativeDriver: true}),
      ]),
    ]).start();
  }, [cardFade, cardSlide, heroFade, heroY]);

  const openNotifications = React.useCallback(() => {
    navigation.getParent()?.navigate('Notifications');
  }, [navigation]);

  const openTransactions = React.useCallback(() => {
    navigation.navigate('Transactions');
  }, [navigation]);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.hero, {paddingTop: Math.max(insets.top, 20) + 8}]}>
          <View style={styles.ringOuter} />
          <View style={styles.ringInner} />

          <Animated.View style={[styles.topBar, {opacity: heroFade, transform: [{translateY: heroY}]}]}>
            <Pressable hitSlop={10} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={28} color="#FFFFFF" />
            </Pressable>
            <View style={styles.headerRight}>
              <Pressable hitSlop={10} onPress={openNotifications} style={styles.notificationBtn}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                {unreadNotifications > 0 && (
                  <View style={styles.notificationDot}>
                    <Text style={styles.notificationCount}>{unreadNotifications}</Text>
                  </View>
                )}
              </Pressable>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{displayName.split(' ').map(n => n[0]).join('')}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={{opacity: heroFade, transform: [{translateY: heroY}]}}>
            <Text style={styles.balanceLabel}>Current Wallet Balance</Text>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={event =>
                setActiveWallet(Math.round(event.nativeEvent.contentOffset.x / (width - 48)))
              }>
              {WALLETS.map(wallet => (
                <View key={wallet.id} style={styles.walletSlide}>
                  <Text style={styles.balance}>
                    {wallet.balance} {wallet.currency}
                  </Text>
                  {/* <View style={[styles.balanceGlow, {backgroundColor: wallet.tint}]} /> */}
                </View>
              ))}
            </ScrollView>
            <View style={styles.dots}>
              {WALLETS.map((wallet, index) => (
                <View
                  key={wallet.id}
                  style={[styles.dot, index === activeWallet && styles.dotActive]}
                />
              ))}
            </View>

            <View style={styles.actionWrap}>
              <ActionStrip 
                showMore={showMoreActions} 
                onToggleMore={() => setShowMoreActions(prev => !prev)}
                onTopUp={() => {
                  startTopup();
                  setTopupVisible(true);
                }}
                onSend={() => {
                  startSend();
                  setSendVisible(true);
                }}
                onWithdraw={() => {
                  startWithdraw();
                  setWithdrawVisible(true);
                }}
                onPayBills={() => navigation.navigate('Services')}
                onAddCard={() => setAddCardVisible(true)}
                onAddWallet={() => setAddWalletVisible(true)}
                onPaymentLink={() => navigation.navigate('CreateInvoice')}
              />
            </View>
          </Animated.View>
        </View>


        <Animated.View
          style={[styles.card, {opacity: cardFade, transform: [{translateY: cardSlide}]}]}>
          {!showMoreActions && (
            <View style={styles.payBillsCard}>
            <View style={styles.payBillsText}>
              <Text style={styles.payBillsTitle}>Pay bills</Text>
              <Text style={styles.payBillsSub}>Pay your bills securely in seconds.</Text>
            </View>
            <Pressable style={styles.payBillsBtn} onPress={() => navigation.navigate('Services')}>
              <Text style={styles.payBillsBtnText}>Pay Bills</Text>
            </Pressable>
          </View>
          )}

          <View style={[styles.sectionHead, showMoreActions && {marginTop: 20}]}>
            <Text style={styles.sectionTitle}>Latest transactions</Text>
            <Pressable hitSlop={10} onPress={openTransactions}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>

          <View style={styles.txnList}>
            {TRANSACTIONS.map((item, index) => (
              <TxnRow key={item.id} txn={item} index={index} />
            ))}
          </View>

          {/* <Pressable style={styles.floatBtn}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.floatText}>Add Wallet</Text>
          </Pressable> */}
        </Animated.View>
      </ScrollView>

      <BurgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        name={displayName}
        email={displayEmail}
      />

      <TopupFlow visible={topupVisible} onClose={() => setTopupVisible(false)} />
      <SendFlow visible={sendVisible} onClose={() => setSendVisible(false)} />
      <WithdrawFlow visible={withdrawVisible} onClose={() => setWithdrawVisible(false)} />
      <AddCardSheet visible={addCardVisible} onClose={() => setAddCardVisible(false)} />
      <AddWalletSheet visible={addWalletVisible} onClose={() => setAddWalletVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: CORAL},
  scroll: {flex: 1},
  hero: {
    backgroundColor: CORAL,
    paddingHorizontal: 24,
  },
  ringOuter: {
    position: 'absolute',
    top: -44,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 34,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  ringInner: {
    position: 'absolute',
    top: 44,
    right: 20,
    width: 98,
    height: 98,
    borderRadius: 49,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 34,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {width: 28, height: 28, alignItems: 'center', justifyContent: 'center'},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: CORAL,
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  notificationDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: SANS,
  },
  walletSlide: {
    width: width - 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    fontFamily: DISPLAY,
    letterSpacing: 0,
  },
  balanceGlow: {
    position: 'absolute',
    width: 170,
    height: 22,
    borderRadius: 11,
    bottom: 6,
    opacity: 0.18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
    marginTop: 8,
    marginBottom: 4,
  },
  dot: {width: 9, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.38)'},
  dotActive: {width: 22, backgroundColor: '#FFFFFF'},
  curveShadow: {
    height: 18,
    marginTop: -18,
    backgroundColor: 'rgba(26,37,53,0.08)',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  card: {
    minHeight: 520,
    marginTop: 20,
    backgroundColor: OFF,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 110,
  },
  actionWrap: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  payBillsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginTop: -20,
    marginBottom: 24,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  payBillsText: {flex: 1, paddingRight: 12},
  payBillsTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    marginBottom: 4,
  },
  payBillsSub: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: SANS,
  },
  payBillsBtn: {
    backgroundColor: CORAL,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  payBillsBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  seeAll: {
    color: CORAL,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  txnList: {gap: 8},
  floatBtn: {
    position: 'absolute',
    right: 24,
    bottom: 72,
    backgroundColor: DARK,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  floatText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
});
