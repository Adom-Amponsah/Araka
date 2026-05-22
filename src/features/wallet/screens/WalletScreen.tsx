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
    id: 't01',
    title: 'MTN Airtime',
    provider: 'MTN Mobile',
    date: '28 Apr, 09:14',
    amount: '-CDF 20.00',
    icon: 'phone-portrait-outline',
    bg: '#FFF8E6',
    color: '#F59E0B',
  },
  {
    id: 't02',
    title: 'SNEL Token',
    provider: 'Societe Nationale',
    date: '28 Apr, 07:02',
    amount: '-CDF 45.00',
    icon: 'flash-outline',
    bg: '#FEF3E2',
    color: '#D97706',
  },
  {
    id: 't03',
    title: 'Wallet Top-up',
    provider: 'Bank Transfer',
    date: '27 Apr, 16:45',
    amount: '+CDF 500.00',
    icon: 'arrow-down-outline',
    bg: '#EDFBF4',
    color: GREEN,
  },
];

function WalletTransaction({item}: {item: typeof TRANSACTIONS[number]}) {
  return (
    <Pressable style={styles.txnRow}>
      <View style={[styles.txnIcon, {backgroundColor: item.bg}]}>
        <Ionicons name={item.icon as any} size={18} color={item.color} />
      </View>
      <View style={styles.txnCopy}>
        <Text style={styles.txnTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.txnDate}>{item.provider} - {item.date}</Text>
      </View>
      <Text style={[styles.txnAmount, {color: item.amount.startsWith('+') ? GREEN : CORAL}]}>
        {item.amount}
      </Text>
    </Pressable>
  );
}

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
            <View style={styles.topRight}>
              <Pressable hitSlop={10} onPress={openNotifications} style={styles.notificationBtn}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                {unreadNotifications > 0 && (
                  <View style={styles.notificationDot}>
                    <Text style={styles.notificationCount}>{unreadNotifications}</Text>
                  </View>
                )}
              </Pressable>
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
          </Animated.View>
        </View>

        <Animated.View style={[styles.curveShadow, {opacity: cardFade}]} />

        <Animated.View
          style={[styles.card, {opacity: cardFade, transform: [{translateY: cardSlide}]}]}>
          <View style={styles.actionPanel}>
            {ACTIONS.map(action => (
              <Pressable key={action.label} style={styles.action}>
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon as any} size={20} color={CORAL} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Latest transactions</Text>
            <Pressable hitSlop={10} onPress={openTransactions}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>

          <View style={styles.txnList}>
            {TRANSACTIONS.map(item => (
              <WalletTransaction key={item.id} item={item} />
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
  topRight: {flexDirection: 'row', alignItems: 'center', gap: 12},
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
  actionPanel: {
    marginTop: -38,
    marginBottom: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  action: {alignItems: 'center', gap: 9, width: 68},
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: DARK,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    textAlign: 'center',
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
  txnList: {gap: 10},
  txnRow: {
    minHeight: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9EEF4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
  },
  txnIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnCopy: {flex: 1},
  txnTitle: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  txnDate: {color: '#9CA3AF', fontSize: 11, fontFamily: SANS, marginTop: 4},
  txnAmount: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
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
