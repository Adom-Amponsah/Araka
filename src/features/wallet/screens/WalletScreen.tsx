import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {BurgerMenu} from '@features/home/components/BurgerMenu';
import {selectUnreadCount, useNotificationStore} from '@features/notifications/store/notificationStore';
import {useAppStore} from '@shared/store/appStore';
import {getSystemFont} from '@styles/typography';

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

const ACTIONS = [
  {label: 'Top Up', icon: 'add-outline'},
  {label: 'Send', icon: 'arrow-up-outline'},
  {label: 'Withdraw', icon: 'download-outline'},
  {label: 'More', icon: 'ellipsis-horizontal-outline'},
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

// Action strip — grid-style tiles
function ActionStrip() {
  const scales = ACTIONS.map(() => React.useRef(new Animated.Value(1)).current);

  const pi = (i: number) =>
    Animated.spring(scales[i], {toValue: 0.93, damping: 14, stiffness: 280, useNativeDriver: true}).start();
  const po = (i: number) =>
    Animated.spring(scales[i], {toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true}).start();

  return (
    <View style={as.grid}>
      {ACTIONS.map((action, i) => (
        <Animated.View key={action.label} style={{transform: [{scale: scales[i]}]}}>
          <Pressable
            onPressIn={() => pi(i)}
            onPressOut={() => po(i)}
            style={as.tile}>
            <View style={as.pillIcon}>
              <Ionicons name={action.icon as any} size={18} color={CORAL} />
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
    gap: 8,
    justifyContent: 'center',
  },
  tile: {
    width: (width - 48) / 4,
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EDF2',
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pillIcon: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    color: DARK,
    fontSize: 11,
    fontWeight: '800',
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

export function WalletScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const unreadNotifications = useNotificationStore(selectUnreadCount);
  const user = useAppStore(state => state.user);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [activeWallet, setActiveWallet] = React.useState(0);
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
            <Pressable hitSlop={10} onPress={openNotifications} style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              {unreadNotifications > 0 && (
                <View style={styles.notificationDot}>
                  <Text style={styles.notificationCount}>{unreadNotifications}</Text>
                </View>
              )}
            </Pressable>
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
          </Animated.View>
        </View>

        <Animated.View style={[styles.curveShadow, {opacity: cardFade}]} />

        <Animated.View
          style={[styles.card, {opacity: cardFade, transform: [{translateY: cardSlide}]}]}>
          <View style={styles.actionWrap}>
            <ActionStrip />
          </View>

          <View style={styles.sectionHead}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: CORAL},
  scroll: {flex: 1},
  hero: {
    backgroundColor: CORAL,
    paddingHorizontal: 24,
    paddingBottom: 70,
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
  notificationBtn: {width: 28, height: 28, alignItems: 'center', justifyContent: 'center'},
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
    marginTop: -1,
    backgroundColor: OFF,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 110,
  },
  actionWrap: {
    marginTop: -38,
    marginBottom: 28,
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
