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
import {getSystemFont} from '@styles/typography';

const {width} = Dimensions.get('window');

// ─── Palette (ARAKA system) ────────────────────────────────────────────────
const CORAL  = '#F27649';
const SLATE  = '#3D4A5C';
const DARK   = '#1A2535';
const OFF    = '#F4F6FA';
const GREEN  = '#10B981';
const SERIF  = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const SANS   = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';

const CARD_W = width - 48;

// ─── Data ──────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'main',
    label: 'Primary',
    currency: 'USD',
    balance: '12,450.00',
    digits: '4589',
    expiry: '09/27',
    type: 'Visa',
  },
  {
    id: 'travel',
    label: 'Travel',
    currency: 'USD',
    balance: '2,800.00',
    digits: '9012',
    expiry: '03/26',
    type: 'Mastercard',
  },
];

const ACTIONS = [
  {label: 'Details',  icon: 'eye-outline'},
  {label: 'Top Up',   icon: 'add-circle-outline'},
  {label: 'Transfer', icon: 'swap-horizontal-outline'},
  {label: 'Freeze',   icon: 'snow-outline'},
  {label: 'Settings', icon: 'settings-outline'},
];

const TRANSACTIONS = [
  {
    id: 't01',
    title: 'MTN Airtime',
    provider: 'MTN Mobile',
    date: '28 Apr · 09:14',
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
    provider: 'Société Nationale',
    date: '28 Apr · 07:02',
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
    date: '27 Apr · 16:45',
    amount: '+500.00',
    currency: 'CDF',
    icon: 'arrow-down-outline',
    iconBg: '#EDFBF4',
    iconColor: GREEN,
    credit: true,
  },
  {
    id: 't04',
    title: 'DSTV Renewal',
    provider: 'Multichoice',
    date: '27 Apr · 11:20',
    amount: '-18.00',
    currency: 'CDF',
    icon: 'tv-outline',
    iconBg: '#E8F4FD',
    iconColor: '#2980B9',
    credit: false,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Card face — the physical card design
// ═══════════════════════════════════════════════════════════════════════════
function CardFace({card, index}: {card: typeof CARDS[number]; index: number}) {
  // Each card has a subtle tint variation while staying on-brand
  const tints = ['rgba(242,118,73,0.13)', 'rgba(16,185,129,0.10)'];
  const tint  = tints[index % tints.length];

  return (
    <View style={cf.card}>
      {/* Background geometry — coral quarter-circle, no gradients */}
      <View style={[cf.geo, {backgroundColor: tint}]} />
      <View style={cf.geoSmall} />

      {/* Top row — label + network mark */}
      <View style={cf.top}>
        <View style={cf.labelPill}>
          <View style={cf.labelDot} />
          <Text style={cf.labelText}>{card.label}</Text>
        </View>
        <NetworkMark type={card.type} />
      </View>

      {/* Balance */}
      <View style={cf.balanceBlock}>
        <Text style={cf.balanceCurrency}>{card.currency}</Text>
        <Text style={cf.balanceAmount}>{card.balance}</Text>
      </View>

      {/* Bottom row — masked number + expiry */}
      <View style={cf.bottom}>
        <Text style={cf.masked}>•••• •••• •••• {card.digits}</Text>
        <Text style={cf.expiry}>{card.expiry}</Text>
      </View>
    </View>
  );
}

function NetworkMark({type}: {type: string}) {
  if (type === 'Mastercard') {
    return (
      <View style={nm.wrap}>
        <View style={[nm.circle, {backgroundColor: '#EB001B'}]} />
        <View style={[nm.circle, nm.overlap, {backgroundColor: '#F79E1B'}]} />
      </View>
    );
  }
  // Visa — wordmark-style
  return (
    <View style={nm.visa}>
      <Text style={nm.visaText}>VISA</Text>
    </View>
  );
}

const nm = StyleSheet.create({
  wrap:     {flexDirection: 'row', alignItems: 'center'},
  circle:   {width: 28, height: 28, borderRadius: 14, opacity: 0.9},
  overlap:  {marginLeft: -11},
  visa:     {paddingHorizontal: 6, paddingVertical: 2},
  visaText: {color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '900', fontFamily: SERIF, letterSpacing: 1},
});

const cf = StyleSheet.create({
  card: {
    width: CARD_W,
    height: 196,
    borderRadius: 22,
    backgroundColor: SLATE,
    padding: 22,
    overflow: 'hidden',
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 16},
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 10,
    justifyContent: 'space-between',
  },
  // Decorative quarter-arc shape in bottom-right
  geo: {
    position: 'absolute',
    bottom: -48,
    right: -48,
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 36,
    borderColor: 'rgba(242,118,73,0.18)',
  },
  geoSmall: {
    position: 'absolute',
    bottom: 18,
    right: 70,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(242,118,73,0.20)',
  },
  top:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  labelPill:{flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4},
  labelDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: CORAL},
  labelText:{color: 'rgba(255,255,255,0.82)', fontSize: 11, fontWeight: '700', fontFamily: SANS, letterSpacing: 0.4},
  balanceBlock: {gap: 2},
  balanceCurrency: {color: 'rgba(255,255,255,0.50)', fontSize: 13, fontFamily: SANS, fontWeight: '600', letterSpacing: 0.3},
  balanceAmount: {color: '#FFFFFF', fontSize: 32, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.5, lineHeight: 36},
  bottom:   {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  masked:   {color: 'rgba(255,255,255,0.60)', fontSize: 13, fontFamily: SANS, letterSpacing: 2.5},
  expiry:   {color: 'rgba(255,255,255,0.50)', fontSize: 11, fontFamily: SANS, letterSpacing: 0.4},
});

// ═══════════════════════════════════════════════════════════════════════════
// Card deck with paging dots
// ═══════════════════════════════════════════════════════════════════════════
function CardDeck({onCardChange}: {onCardChange: (i: number) => void}) {
  const [active, setActive] = React.useState(0);

  const handleScroll = (e: any) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    setActive(i);
    onCardChange(i);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_W}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{gap: 0}}>
        {CARDS.map((card, i) => (
          <View key={card.id} style={{width: CARD_W}}>
            <CardFace card={card} index={i} />
          </View>
        ))}
      </ScrollView>

      {/* Pip dots */}
      <View style={deck.dots}>
        {CARDS.map((_, i) => (
          <View key={i} style={[deck.dot, i === active && deck.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const deck = StyleSheet.create({
  dots:     {flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 14},
  dot:      {width: 6, height: 6, borderRadius: 3, backgroundColor: '#C8D0DA'},
  dotActive:{width: 20, backgroundColor: CORAL},
});

// ═══════════════════════════════════════════════════════════════════════════
// Action strip — horizontal scrollable pills
// ═══════════════════════════════════════════════════════════════════════════
function ActionStrip() {
  const scales = ACTIONS.map(() => React.useRef(new Animated.Value(1)).current);

  const pi = (i: number) =>
    Animated.spring(scales[i], {toValue: 0.93, damping: 14, stiffness: 280, useNativeDriver: true}).start();
  const po = (i: number) =>
    Animated.spring(scales[i], {toValue: 1, damping: 10, stiffness: 200, useNativeDriver: true}).start();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={as.strip}>
      {ACTIONS.map((action, i) => (
        <Animated.View key={action.label} style={{transform: [{scale: scales[i]}]}}>
          <Pressable
            onPressIn={() => pi(i)}
            onPressOut={() => po(i)}
            style={as.pill}>
            <View style={as.pillIcon}>
              <Ionicons name={action.icon as any} size={17} color={CORAL} />
            </View>
            <Text style={as.pillLabel}>{action.label}</Text>
          </Pressable>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const as = StyleSheet.create({
  strip:    {paddingHorizontal: 24, gap: 10, alignItems: 'center'},
  pill:     {flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 11, borderWidth: 1, borderColor: '#E8EDF2', shadowColor: DARK, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1},
  pillIcon: {width: 30, height: 30, borderRadius: 10, backgroundColor: '#FFF1EA', alignItems: 'center', justifyContent: 'center'},
  pillLabel:{color: DARK, fontSize: 13, fontWeight: '700', fontFamily: SANS},
});

// ═══════════════════════════════════════════════════════════════════════════
// Transaction row
// ═══════════════════════════════════════════════════════════════════════════
function TxnRow({item, index}: {item: typeof TRANSACTIONS[number]; index: number}) {
  const scale = React.useRef(new Animated.Value(1)).current;
  const pi = () => Animated.spring(scale, {toValue: 0.97, damping: 14, stiffness: 280, useNativeDriver: true}).start();
  const po = () => Animated.spring(scale, {toValue: 1,    damping: 10, stiffness: 200, useNativeDriver: true}).start();

  return (
    <Animated.View style={{transform: [{scale}]}}>
      <Pressable onPressIn={pi} onPressOut={po} style={tx.row}>
        {/* Icon */}
        <View style={[tx.icon, {backgroundColor: item.iconBg}]}>
          <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
        </View>

        {/* Copy */}
        <View style={tx.body}>
          <Text style={tx.title} numberOfLines={1}>{item.title}</Text>
          <Text style={tx.sub} numberOfLines={1}>{item.provider} · {item.date}</Text>
        </View>

        {/* Amount */}
        <View style={tx.amountBlock}>
          <Text style={[tx.amount, {color: item.credit ? GREEN : DARK}]}>
            {item.credit ? '+' : '-'}{item.currency} {item.amount.replace(/[+-]/, '')}
          </Text>
          {/* Status dot */}
          <View style={[tx.statusDot, {backgroundColor: item.credit ? '#EDFBF4' : OFF}]}>
            <Ionicons
              name={item.credit ? 'arrow-down' : 'arrow-up'}
              size={9}
              color={item.credit ? GREEN : '#9CA3AF'}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const tx = StyleSheet.create({
  row:         {flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: '#EEF1F6', paddingHorizontal: 14, paddingVertical: 13, shadowColor: DARK, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1},
  icon:        {width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  body:        {flex: 1, gap: 3},
  title:       {color: DARK, fontSize: 13, fontWeight: '700', fontFamily: SANS},
  sub:         {color: '#9CA3AF', fontSize: 11, fontFamily: SANS},
  amountBlock: {alignItems: 'flex-end', gap: 4},
  amount:      {fontSize: 13, fontWeight: '800', fontFamily: SANS},
  statusDot:   {width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center'},
});

// ═══════════════════════════════════════════════════════════════════════════
// Section header
// ═══════════════════════════════════════════════════════════════════════════
function SectionHead({title, cta, onCta}: {title: string; cta?: string; onCta?: () => void}) {
  return (
    <View style={shead.row}>
      <Text style={shead.title}>{title}</Text>
      {cta && (
        <Pressable hitSlop={10} onPress={onCta}>
          <Text style={shead.cta}>{cta}</Text>
        </Pressable>
      )}
    </View>
  );
}

const shead = StyleSheet.create({
  row:   {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  title: {color: DARK, fontSize: 17, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.3},
  cta:   {color: CORAL, fontSize: 12, fontWeight: '800', fontFamily: SANS},
});

// ═══════════════════════════════════════════════════════════════════════════
// Spend summary bar (mini analytics)
// ═══════════════════════════════════════════════════════════════════════════
function SpendBar({activeCard}: {activeCard: number}) {
  const card = CARDS[activeCard];
  const spent = activeCard === 0 ? 1340 : 420;
  const total = activeCard === 0 ? 12450 : 2800;
  const pct   = Math.min(spent / total, 1);
  const barW  = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    barW.setValue(0);
    Animated.timing(barW, {
      toValue: pct,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [activeCard]);

  const animW = barW.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={sb.wrap}>
      <View style={sb.row}>
        <View>
          <Text style={sb.label}>Spent this month</Text>
          <Text style={sb.amount}>{card.currency} {spent.toLocaleString()}</Text>
        </View>
        <View style={sb.right}>
          <Text style={sb.label}>Remaining</Text>
          <Text style={[sb.amount, {color: GREEN}]}>{card.currency} {(total - spent).toLocaleString()}</Text>
        </View>
      </View>
      {/* Track */}
      <View style={sb.track}>
        <Animated.View style={[sb.fill, {width: animW}]} />
      </View>
      <Text style={sb.pct}>{Math.round(pct * 100)}% of balance used</Text>
    </View>
  );
}

const sb = StyleSheet.create({
  wrap:   {backgroundColor: '#FFFFFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#EEF1F6', gap: 12, shadowColor: DARK, shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1},
  row:    {flexDirection: 'row', justifyContent: 'space-between'},
  right:  {alignItems: 'flex-end'},
  label:  {color: '#9CA3AF', fontSize: 11, fontFamily: SANS, marginBottom: 2},
  amount: {color: DARK, fontSize: 15, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.3},
  track:  {height: 5, backgroundColor: '#EEF1F6', borderRadius: 3, overflow: 'hidden'},
  fill:   {height: 5, backgroundColor: CORAL, borderRadius: 3},
  pct:    {color: '#B0BAC9', fontSize: 10, fontFamily: SANS},
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════
const CARD_RADIUS = 36;

export function VirtualCardsScreen() {
  const navigation         = useNavigation<any>();
  const insets             = useSafeAreaInsets();
  const unreadNotifications= useNotificationStore(selectUnreadCount);
  const user               = useAppStore(state => state.user);
  const [menuVisible, setMenuVisible]   = React.useState(false);
  const [activeCard, setActiveCard]     = React.useState(0);

  const displayName  = user?.name  || 'Adom Isaac';
  const displayEmail = user?.email || 'adom@araka.app';

  // ── Entrance animations (same grammar as ServicesScreen) ─────────────────
  const heroFade  = React.useRef(new Animated.Value(0)).current;
  const heroY     = React.useRef(new Animated.Value(-14)).current;
  const bodySlide = React.useRef(new Animated.Value(48)).current;
  const bodyFade  = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, {toValue: 1, duration: 380, useNativeDriver: true}),
        Animated.timing(heroY,    {toValue: 0, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]),
      Animated.parallel([
        Animated.timing(bodySlide,{toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
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

        {/* ════════ SLATE HERO ════════ */}
        <View style={[s.hero, {paddingTop: Math.max(insets.top, 20) + 8}]}>
          {/* Brand rings — ARAKA motif */}
          <View style={s.ringOuter} />
          <View style={s.ringInner} />
          {/* Subtle third ring bottom-left for depth */}
          <View style={s.ringTertiary} />

          {/* Top bar */}
          <Animated.View style={[s.topBar, {opacity: heroFade, transform: [{translateY: heroY}]}]}>
            <Pressable hitSlop={10} onPress={() => setMenuVisible(true)} style={s.iconBtn}>
              <Ionicons name="menu-outline" size={22} color="#FFFFFF" />
            </Pressable>

            <View style={s.wordRow}>
              <View style={s.wordDot} />
              <Text style={s.wordmark}>ARAKA</Text>
            </View>

            <Pressable hitSlop={10} onPress={openNotifications} style={s.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
              {unreadNotifications > 0 && (
                <View style={s.notifBadge}>
                  <Text style={s.notifCount}>{unreadNotifications}</Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          {/* Hero copy */}
          <Animated.View style={[s.heroCopy, {opacity: heroFade, transform: [{translateY: heroY}]}]}>
            <Text style={s.heroSub}>Your wallet</Text>
            <Text style={s.heroTitle}>Cards.</Text>
            <View style={s.heroRule} />
          </Animated.View>
        </View>

        {/* Curve shadow bridge */}
        <Animated.View style={[s.curveShadow, {opacity: bodyFade}]} />

        {/* ════════ WHITE BODY ════════ */}
        <Animated.View
          style={[
            s.body,
            {opacity: bodyFade, transform: [{translateY: bodySlide}]},
          ]}>

          <View style={s.handle} />

          {/* Card deck — overlaps hero */}
          <View style={s.deckWrap}>
            <CardDeck onCardChange={setActiveCard} />
          </View>

          {/* Action strip */}
          <View style={s.actionWrap}>
            <ActionStrip />
          </View>

          {/* Spend summary */}
          {/* <View style={s.section}>
            <SectionHead title="Spending this month" />
            <SpendBar activeCard={activeCard} />
          </View> */}

          {/* Transactions */}
          <View style={s.section}>
            <SectionHead
              title="Recent activity"
              cta="See all"
              onCta={openTransactions}
            />
            <View style={s.txnList}>
              {TRANSACTIONS.map((item, i) => (
                <TxnRow key={item.id} item={item} index={i} />
              ))}
            </View>
          </View>

          {/* Add card — full-width anchored, not a FAB */}
          {/* <View style={s.addCardWrap}>
            <Pressable style={s.addCardBtn}>
              <View style={s.addCardIcon}>
                <Ionicons name="add" size={18} color={CORAL} />
              </View>
              <Text style={s.addCardLabel}>Add a new card</Text>
              <Ionicons name="chevron-forward" size={16} color="#C4CDD8" />
            </Pressable>
          </View> */}

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

// ═══════════════════════════════════════════════════════════════════════════
// Root styles
// ═══════════════════════════════════════════════════════════════════════════
const s = StyleSheet.create({
  root:   {flex: 1, backgroundColor: SLATE},
  scroll: {flex: 1},

  // ── Coral hero ────────────────────────────────────────────────────────
  hero: {
    backgroundColor: CORAL,
    paddingHorizontal: 24,
    paddingBottom: 72,
    overflow: 'hidden',
  },
  ringOuter: {
    position: 'absolute', top: -36, right: -56,
    width: 210, height: 210, borderRadius: 105,
    borderWidth: 34, borderColor: 'rgba(255,255,255,0.12)',
  },
  ringInner: {
    position: 'absolute', top: 26, right: 14,
    width: 102, height: 102, borderRadius: 51,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.24)',
  },
  ringTertiary: {
    position: 'absolute', bottom: -30, left: -30,
    width: 130, height: 130, borderRadius: 65,
    borderWidth: 22, borderColor: 'rgba(255,255,255,0.08)',
  },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 32,
  },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  notifBadge: {
    position: 'absolute', top: -2, right: -2,
    minWidth: 16, height: 16, borderRadius: 8,
    backgroundColor: CORAL,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifCount: {color: '#FFFFFF', fontSize: 9, fontWeight: '800', fontFamily: SANS},

  wordRow:  {flexDirection: 'row', alignItems: 'center', gap: 7},
  wordDot:  {width: 8, height: 8, borderRadius: 4, backgroundColor: CORAL},
  wordmark: {color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 4, fontFamily: SANS},

  heroCopy: {gap: 6},
  heroSub:  {color: 'rgba(255,255,255,0.42)', fontSize: 14, fontFamily: SANS, letterSpacing: 0.4},
  heroTitle:{color: '#FFFFFF', fontSize: 44, fontWeight: '700', fontFamily: SERIF, letterSpacing: -1, lineHeight: 48},
  heroRule: {width: 36, height: 3, backgroundColor: CORAL, borderRadius: 2, marginTop: 4},

  // Curve shadow
  curveShadow: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
    borderTopLeftRadius: CARD_RADIUS, borderTopRightRadius: CARD_RADIUS,
    backgroundColor: OFF,
    shadowColor: '#000', shadowOffset: {width: 0, height: -14},
    shadowOpacity: 0.18, shadowRadius: 28, elevation: 20,
  },

  // ── White body ────────────────────────────────────────────────────────
  body: {
    backgroundColor: OFF,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    marginTop: -CARD_RADIUS,
    paddingBottom: 48,
  },
  handle: {
    width: 38, height: 4, borderRadius: 2,
    backgroundColor: '#D1D9E0', alignSelf: 'center',
    marginTop: 14, marginBottom: 0,
  },

  // Card deck — pulled up to overlap the hero
  deckWrap: {
    paddingHorizontal: 24,
    marginTop: -64,      // overlaps the slate hero
    marginBottom: 24,
  },

  // Action strip — negative margin to bleed to edges
  actionWrap: {marginBottom: 28},

  // Sections
  section: {paddingHorizontal: 24, gap: 14, marginBottom: 28},
  txnList: {gap: 10},

  // Add card row
  addCardWrap: {paddingHorizontal: 24},
  addCardBtn:  {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#FFFFFF', borderRadius: 18,
    borderWidth: 1, borderColor: '#EEF1F6',
    paddingHorizontal: 16, paddingVertical: 14,
    shadowColor: DARK, shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  addCardIcon: {
    width: 40, height: 40, borderRadius: 13,
    backgroundColor: '#FFF1EA', alignItems: 'center', justifyContent: 'center',
  },
  addCardLabel:{flex: 1, color: DARK, fontSize: 14, fontWeight: '700', fontFamily: SANS},
});