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

const CARDS = [
  {id: 'main', label: 'Balance', balance: '12,450 USD', digits: '4589'},
  {id: 'travel', label: 'Travel Card', balance: '2,800 USD', digits: '9012'},
];

const ACTIONS = [
  {label: 'View Details', icon: 'eye-outline'},
  {label: 'Top Up', icon: 'add-outline'},
  {label: 'Freeze', icon: 'snow-outline'},
  {label: 'More', icon: 'ellipsis-horizontal-outline'},
];

const TRANSACTIONS = [
  {
    id: 'c1',
    title: 'Airtime - Vodacom',
    date: 'Feb 17',
    amount: '-5 USD',
    icon: 'phone-portrait-outline',
    bg: '#FEE8DF',
    color: '#E53E3E',
  },
  {
    id: 'c2',
    title: 'To Natalia',
    date: 'Feb 20',
    amount: '-45.30 USD',
    icon: 'paper-plane-outline',
    bg: '#FFF3EE',
    color: CORAL,
  },
  {
    id: 'c3',
    title: 'From Matthew',
    date: 'Feb 18',
    amount: '+120 USD',
    icon: 'arrow-down-outline',
    bg: '#EDFBF4',
    color: GREEN,
  },
];

function CardTransaction({item}: {item: typeof TRANSACTIONS[number]}) {
  return (
    <Pressable style={styles.txnRow}>
      <View style={[styles.txnIcon, {backgroundColor: item.bg}]}>
        <Ionicons name={item.icon as any} size={18} color={item.color} />
      </View>
      <View style={styles.txnCopy}>
        <Text style={styles.txnTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.txnDate}>{item.date}</Text>
      </View>
      <Text style={[styles.txnAmount, {color: item.amount.startsWith('+') ? GREEN : CORAL}]}>
        {item.amount}
      </Text>
    </Pressable>
  );
}

function CardFace({card}: {card: typeof CARDS[number]}) {
  return (
    <View style={styles.cardFace}>
      <View style={styles.cardLight} />
      <Text style={styles.cardLabel}>{card.label}</Text>
      <Text style={styles.cardBalance}>{card.balance}</Text>
      <View style={styles.cardBottom}>
        <Text style={styles.masked}>.... {card.digits}</Text>
        <View style={styles.network}>
          <View style={[styles.networkCircle, {backgroundColor: '#EF2B2D'}]} />
          <View style={[styles.networkCircle, styles.networkCircleOverlap]} />
        </View>
      </View>
    </View>
  );
}

export function VirtualCardsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const unreadNotifications = useNotificationStore(selectUnreadCount);
  const user = useAppStore(state => state.user);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [activeCard, setActiveCard] = React.useState(0);
  const displayName = user?.name || 'Adom Isaac';
  const displayEmail = user?.email || 'adom@araka.app';

  const heroFade = React.useRef(new Animated.Value(0)).current;
  const heroY = React.useRef(new Animated.Value(-12)).current;
  const bodySlide = React.useRef(new Animated.Value(42)).current;
  const bodyFade = React.useRef(new Animated.Value(0)).current;

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
        Animated.timing(bodySlide, {
          toValue: 0,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bodyFade, {toValue: 1, duration: 320, useNativeDriver: true}),
      ]),
    ]).start();
  }, [bodyFade, bodySlide, heroFade, heroY]);

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
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{displayName.slice(0, 2).toUpperCase()}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={{opacity: heroFade, transform: [{translateY: heroY}]}}>
            <Text style={styles.title}>Virtual Cards</Text>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={event =>
                setActiveCard(Math.round(event.nativeEvent.contentOffset.x / (width - 48)))
              }>
              {CARDS.map(card => (
                <View key={card.id} style={styles.cardSlide}>
                  <CardFace card={card} />
                </View>
              ))}
            </ScrollView>
            <View style={styles.dots}>
              {CARDS.map((card, index) => (
                <View
                  key={card.id}
                  style={[styles.dot, index === activeCard && styles.dotActive]}
                />
              ))}
            </View>
          </Animated.View>
        </View>

        <Animated.View
          style={[styles.body, {opacity: bodyFade, transform: [{translateY: bodySlide}]}]}>
          <View style={styles.actions}>
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
              <CardTransaction key={item.id} item={item} />
            ))}
          </View>

          <Pressable style={styles.floatBtn}>
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.floatText}>Add Card</Text>
          </Pressable>
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
    marginBottom: 32,
  },
  topRight: {flexDirection: 'row', alignItems: 'center', gap: 13},
  notificationBtn: {width: 30, height: 30, alignItems: 'center', justifyContent: 'center'},
  notificationDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CORAL,
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
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: DARK,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: 0,
    marginBottom: 18,
  },
  cardSlide: {
    width: width - 48,
    paddingRight: 12,
  },
  cardFace: {
    height: 206,
    borderRadius: 10,
    padding: 22,
    backgroundColor: CORAL,
    overflow: 'hidden',
  },
  cardLight: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#6F6CF6',
    opacity: 0.80,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    fontFamily: SANS,
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 31,
    lineHeight: 38,
    fontWeight: '700',
    fontFamily: DISPLAY,
    letterSpacing: 0,
    marginTop: 4,
  },
  cardBottom: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  masked: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: 1,
  },
  network: {flexDirection: 'row', alignItems: 'center'},
  networkCircle: {width: 45, height: 45, borderRadius: 23},
  networkCircleOverlap: {
    backgroundColor: '#F4B333',
    marginLeft: -17,
    opacity: 0.92,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 7,
    marginTop: 18,
  },
  dot: {width: 10, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.30)'},
  dotActive: {width: 22, backgroundColor: '#FFFFFF'},
  body: {
    minHeight: 520,
    marginTop: -42,
    backgroundColor: OFF,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 110,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  action: {alignItems: 'center', gap: 10, width: 72},
  actionIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: DARK,
    fontSize: 12,
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
    shadowOpacity: 0.20,
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
