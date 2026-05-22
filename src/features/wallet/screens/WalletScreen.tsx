import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
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

const {width} = Dimensions.get('window');

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK = '#1A2535';
const OFF = '#F4F6FA';
const GREEN = '#10B981';
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const SANS = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';
const CARD_RADIUS = 36;
const WALLET_W = width - 48;

const WALLETS = [
  {
    id: 'usd',
    label: 'Dollar pocket',
    currency: 'USD',
    balance: '12,450.00',
    change: '+3.8%',
    reserve: '2,400',
  },
  {
    id: 'cdf',
    label: 'Local pocket',
    currency: 'CDF',
    balance: '34,820,000',
    change: '+1.2%',
    reserve: '8,200,000',
  },
];

const ACTIONS = [
  {label: 'Top Up', icon: 'add-circle-outline'},
  {label: 'Send', icon: 'paper-plane-outline'},
  {label: 'Withdraw', icon: 'download-outline'},
  {label: 'More', icon: 'ellipsis-horizontal-outline'},
];

const TRANSACTIONS = [
  {
    id: 't01',
    title: 'MTN Airtime',
    provider: 'MTN Mobile',
    date: '28 Apr - 09:14',
    amount: '-20.00',
    currency: 'CDF',
    icon: 'phone-portrait-outline',
    iconBg: '#FFF8E6',
    iconColor: '#F59E0B',
    credit: false,
  },
  {
    id: 't02',
    title: 'SNEL Token',
    provider: 'Societe Nationale',
    date: '28 Apr - 07:02',
    amount: '-45.00',
    currency: 'CDF',
    icon: 'flash-outline',
    iconBg: '#FEF3E2',
    iconColor: '#D97706',
    credit: false,
  },
  {
    id: 't03',
    title: 'Wallet Top-up',
    provider: 'Bank Transfer',
    date: '27 Apr - 16:45',
    amount: '+500.00',
    currency: 'CDF',
    icon: 'arrow-down-outline',
    iconBg: '#EDFBF4',
    iconColor: GREEN,
    credit: true,
  },
];

function WalletPocket({wallet, index}: {wallet: typeof WALLETS[number]; index: number}) {
  const isLocal = wallet.id === 'cdf';

  return (
    <View style={wp.card}>
      <View style={[wp.orbit, isLocal && wp.orbitAlt]} />
      <View style={wp.top}>
        <View>
          <Text style={wp.kicker}>{wallet.label}</Text>
          <Text style={wp.currency}>{wallet.currency}</Text>
        </View>
        <View style={wp.statusPill}>
          <View style={[wp.statusDot, isLocal && {backgroundColor: GREEN}]} />
          <Text style={wp.statusText}>Active</Text>
        </View>
      </View>

      <View style={wp.balanceBlock}>
        <Text style={wp.balance}>{wallet.balance}</Text>
        <Text style={wp.balanceSub}>Available balance</Text>
      </View>

      {/* <View style={wp.bottom}>
        <View>
          <Text style={wp.microLabel}>Reserve</Text>
          <Text style={wp.microValue}>
            {wallet.currency} {wallet.reserve}
          </Text>
        </View>
        <View style={wp.gain}>
          <Ionicons name="trending-up-outline" size={13} color={GREEN} />
          <Text style={wp.gainText}>{wallet.change}</Text>
        </View>
      </View> */}
    </View>
  );
}

const wp = StyleSheet.create({
  card: {
    width: WALLET_W,
    minHeight: 196,
    borderRadius: 24,
    backgroundColor: DARK,
    padding: 22,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 16},
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 10,
  },
  orbit: {
    position: 'absolute',
    right: -42,
    bottom: -46,
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 34,
    borderColor: 'rgba(242,118,73,0.18)',
  },
  orbitAlt: {
    borderColor: 'rgba(16,185,129,0.15)',
  },
  top: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  kicker: {color: 'rgba(255,255,255,0.56)', fontSize: 12, fontFamily: SANS},
  currency: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: SANS,
    letterSpacing: 1.2,
    marginTop: 3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: CORAL},
  statusText: {color: 'rgba(255,255,255,0.78)', fontSize: 11, fontWeight: '700', fontFamily: SANS},
  balanceBlock: {marginTop: 26},
  balance: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '700',
    fontFamily: SERIF,
    letterSpacing: -0.6,
  },
  balanceSub: {color: 'rgba(255,255,255,0.46)', fontSize: 12, fontFamily: SANS, marginTop: 5},
  bottom: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 24},
  microLabel: {color: 'rgba(255,255,255,0.42)', fontSize: 11, fontFamily: SANS},
  microValue: {color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: '800', fontFamily: SANS, marginTop: 3},
  gain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16,185,129,0.13)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  gainText: {color: GREEN, fontSize: 12, fontWeight: '800', fontFamily: SANS},
});

function WalletDeck({onWalletChange}: {onWalletChange: (index: number) => void}) {
  const [active, setActive] = React.useState(0);

  const handleScroll = (event: any) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / WALLET_W);
    setActive(next);
    onWalletChange(next);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        snapToInterval={WALLET_W}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}>
        {WALLETS.map((wallet, index) => (
          <View key={wallet.id} style={{width: WALLET_W}}>
            <WalletPocket wallet={wallet} index={index} />
          </View>
        ))}
      </ScrollView>
      <View style={deck.dots}>
        {WALLETS.map((wallet, index) => (
          <View key={wallet.id} style={[deck.dot, index === active && deck.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const deck = StyleSheet.create({
  dots: {flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14},
  dot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#C8D0DA'},
  dotActive: {width: 20, backgroundColor: CORAL},
});

function ActionDock() {
  return (
    <View style={ad.wrap}>
      {ACTIONS.map((action, index) => {
        const primary = index === 1;
        return (
          <Pressable key={action.label} style={[ad.item, primary && ad.itemPrimary]}>
            <View style={[ad.icon, primary && ad.iconPrimary]}>
              <Ionicons name={action.icon as any} size={18} color={primary ? '#FFFFFF' : CORAL} />
            </View>
            <Text style={[ad.label, primary && ad.labelPrimary]}>{action.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const ad = StyleSheet.create({
  wrap: {
    marginHorizontal: 24,
    marginTop: -28,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    padding: 10,
    flexDirection: 'row',
    gap: 8,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.10,
    shadowRadius: 22,
    elevation: 7,
  },
  item: {
    flex: 1,
    minHeight: 74,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: '#FFF8F4',
  },
  itemPrimary: {backgroundColor: CORAL},
  icon: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconPrimary: {backgroundColor: 'rgba(255,255,255,0.18)'},
  label: {color: DARK, fontSize: 11, fontWeight: '800', fontFamily: SANS},
  labelPrimary: {color: '#FFFFFF'},
});

function InsightStrip({activeWallet}: {activeWallet: number}) {
  const wallet = WALLETS[activeWallet];
  const amount = wallet.id === 'usd' ? 'USD 760' : 'CDF 1.4M';

  return (
    <View style={ins.wrap}>
      <View style={ins.icon}>
        <Ionicons name="sparkles-outline" size={17} color={CORAL} />
      </View>
      <View style={ins.copy}>
        <Text style={ins.title}>Available for instant transfer</Text>
        <Text style={ins.sub}>{amount} can move without extra confirmation today.</Text>
      </View>
    </View>
  );
}

const ins = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    padding: 14,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {flex: 1, gap: 3},
  title: {color: DARK, fontSize: 13, fontWeight: '800', fontFamily: SANS},
  sub: {color: '#8A94A6', fontSize: 11, fontFamily: SANS, lineHeight: 16},
});

function TxnRow({item}: {item: typeof TRANSACTIONS[number]}) {
  return (
    <Pressable style={tx.row}>
      <View style={[tx.icon, {backgroundColor: item.iconBg}]}>
        <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
      </View>
      <View style={tx.body}>
        <Text style={tx.title} numberOfLines={1}>{item.title}</Text>
        <Text style={tx.sub} numberOfLines={1}>{item.provider} - {item.date}</Text>
      </View>
      <View style={tx.amountBlock}>
        <Text style={[tx.amount, {color: item.credit ? GREEN : DARK}]}>
          {item.credit ? '+' : '-'}{item.currency} {item.amount.replace(/[+-]/, '')}
        </Text>
        <View style={[tx.statusDot, {backgroundColor: item.credit ? '#EDFBF4' : OFF}]}>
          <Ionicons name={item.credit ? 'arrow-down' : 'arrow-up'} size={9} color={item.credit ? GREEN : '#9CA3AF'} />
        </View>
      </View>
    </Pressable>
  );
}

const tx = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEF1F6',
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  icon: {width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center'},
  body: {flex: 1, gap: 3},
  title: {color: DARK, fontSize: 13, fontWeight: '700', fontFamily: SANS},
  sub: {color: '#9CA3AF', fontSize: 11, fontFamily: SANS},
  amountBlock: {alignItems: 'flex-end', gap: 4},
  amount: {fontSize: 13, fontWeight: '800', fontFamily: SANS},
  statusDot: {width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center'},
});

function SectionHead({title, cta, onCta}: {title: string; cta?: string; onCta?: () => void}) {
  return (
    <View style={sh.row}>
      <Text style={sh.title}>{title}</Text>
      {cta ? (
        <Pressable hitSlop={10} onPress={onCta}>
          <Text style={sh.cta}>{cta}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const sh = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  title: {color: DARK, fontSize: 17, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.3},
  cta: {color: CORAL, fontSize: 12, fontWeight: '800', fontFamily: SANS},
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
  const heroY = React.useRef(new Animated.Value(-14)).current;
  const bodySlide = React.useRef(new Animated.Value(48)).current;
  const bodyFade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, {toValue: 1, duration: 380, useNativeDriver: true}),
        Animated.timing(heroY, {toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]),
      Animated.parallel([
        Animated.timing(bodySlide, {toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(bodyFade, {toValue: 1, duration: 360, useNativeDriver: true}),
      ]),
    ]).start();
  }, []);

  const openNotifications = React.useCallback(() => {
    navigation.getParent()?.navigate('Notifications');
  }, [navigation]);

  const openTransactions = React.useCallback(() => {
    navigation.navigate('Transactions');
  }, [navigation]);

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} bounces>
        <View style={[s.hero, {paddingTop: Math.max(insets.top, 20) + 8}]}>
          <View style={s.ringOuter} />
          <View style={s.ringInner} />
          <View style={s.ringTertiary} />

          <Animated.View style={[s.topBar, {opacity: heroFade, transform: [{translateY: heroY}]}]}>
            <Pressable hitSlop={10} onPress={() => setMenuVisible(true)} style={s.iconBtn}>
              <Ionicons name="menu-outline" size={22} color="#FFFFFF" />
            </Pressable>

            {/* <View style={s.wordRow}>
              <View style={s.wordDot} />
              <Text style={s.wordmark}>ARAKA</Text>
            </View> */}

            <Pressable hitSlop={10} onPress={openNotifications} style={s.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
              {unreadNotifications > 0 && (
                <View style={s.notifBadge}>
                  <Text style={s.notifCount}>{unreadNotifications}</Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          <Animated.View style={[s.heroCopy, {opacity: heroFade, transform: [{translateY: heroY}]}]}>
            {/* <Text style={s.heroSub}>Wallet</Text> */}
            <Text style={s.heroTitle}></Text>
            {/* <View style={s.heroRule} /> */}
          </Animated.View>
        </View>

        <Animated.View style={[s.curveShadow, {opacity: bodyFade}]} />

        <Animated.View style={[s.body, {opacity: bodyFade, transform: [{translateY: bodySlide}]}]}>
          <View style={s.handle} />

          <View style={s.deckWrap}>
            <WalletDeck onWalletChange={setActiveWallet} />
          </View>

          <ActionDock />

          <View style={s.section}>
            {/* <InsightStrip activeWallet={activeWallet} /> */}
          </View>

          <View style={s.section}>
            <SectionHead title="Recent activity" cta="See all" onCta={openTransactions} />
            <View style={s.txnList}>
              {TRANSACTIONS.map(item => (
                <TxnRow key={item.id} item={item} />
              ))}
            </View>
          </View>
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

const s = StyleSheet.create({
  root: {flex: 1, backgroundColor: SLATE},
  scroll: {flex: 1},
  hero: {
    backgroundColor: CORAL,
    paddingHorizontal: 24,
    paddingBottom: 72,
    overflow: 'hidden',
  },
  ringOuter: {
    position: 'absolute',
    top: -36,
    right: -56,
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 34,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  ringInner: {
    position: 'absolute',
    top: 26,
    right: 14,
    width: 102,
    height: 102,
    borderRadius: 51,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  ringTertiary: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 22,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32},
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  notifBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifCount: {color: '#FFFFFF', fontSize: 9, fontWeight: '800', fontFamily: SANS},
  wordRow: {flexDirection: 'row', alignItems: 'center', gap: 7},
  wordDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: DARK},
  wordmark: {color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 4, fontFamily: SANS},
  heroCopy: {gap: 6},
  heroSub: {color: 'rgba(255,255,255,0.62)', fontSize: 14, fontFamily: SANS, letterSpacing: 0.4},
  heroTitle: {color: '#FFFFFF', fontSize: 44, fontWeight: '700', fontFamily: SERIF, letterSpacing: -1, lineHeight: 48},
  heroRule: {width: 36, height: 3, backgroundColor: DARK, borderRadius: 2, marginTop: 4},
  curveShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    backgroundColor: OFF,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -14},
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 20,
  },
  body: {
    backgroundColor: OFF,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    marginTop: -CARD_RADIUS,
    paddingBottom: 110,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D9E0',
    alignSelf: 'center',
    marginTop: 14,
  },
  deckWrap: {
    paddingHorizontal: 24,
    marginTop: -64,
    marginBottom: 24,
  },
  section: {paddingHorizontal: 24, gap: 14, marginBottom: 28},
  txnList: {gap: 10},
});
