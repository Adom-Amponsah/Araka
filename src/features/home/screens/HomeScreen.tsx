import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK = '#0D131A';
const SURFACE = '#FFFFFF';
const OFF_SURFACE = '#F4F6F9';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const SANS = Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif';

// ─────────────────────────────────────────────
// DATA MODELS
// ─────────────────────────────────────────────
export interface Provider {
  id: string;
  name: string;
  sub: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  action: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  providers: Provider[];
}

const CATEGORIES: Category[] = [
  {
    id: 'airtime',
    label: 'Airtime',
    icon: 'phone-portrait-outline',
    providers: [
      { id: 'a1', name: 'MTN', sub: 'All networks', icon: 'phone-portrait-outline', iconBg: '#FFF8E6', iconColor: '#F59E0B', action: 'Top Up' },
      { id: 'a2', name: 'Vodacom', sub: 'Instant recharge', icon: 'phone-portrait-outline', iconBg: '#FEE8DF', iconColor: '#E53E3E', action: 'Top Up' },
      { id: 'a3', name: 'Airtel', sub: 'All amounts', icon: 'phone-portrait-outline', iconBg: '#FEE8DF', iconColor: '#C0392B', action: 'Top Up' },
      { id: 'a4', name: 'Glo', sub: 'Glo network', icon: 'phone-portrait-outline', iconBg: '#EDFBF4', iconColor: '#10B981', action: 'Top Up' },
      { id: 'a5', name: '9Mobile', sub: 'etisalat', icon: 'phone-portrait-outline', iconBg: '#E8F4FD', iconColor: '#2980B9', action: 'Top Up' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    icon: 'wifi-outline',
    providers: [
      { id: 'd1', name: 'MTN Data', sub: 'Data bundles', icon: 'wifi-outline', iconBg: '#FFF8E6', iconColor: '#F59E0B', action: 'Buy' },
      { id: 'd2', name: 'Airtel Data', sub: 'All plans', icon: 'wifi-outline', iconBg: '#FEE8DF', iconColor: '#C0392B', action: 'Buy' },
      { id: 'd3', name: 'Glo Data', sub: 'Cheap bundles', icon: 'wifi-outline', iconBg: '#EDFBF4', iconColor: '#10B981', action: 'Buy' },
      { id: 'd4', name: '9Mobile', sub: 'Data plans', icon: 'wifi-outline', iconBg: '#E8F4FD', iconColor: '#2980B9', action: 'Buy' },
    ],
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: 'flash-outline',
    providers: [
      { id: 'e1', name: 'SNEL', sub: 'Société Nationale', icon: 'flash-outline', iconBg: '#FFF8E6', iconColor: '#F59E0B', action: 'Buy Token' },
      { id: 'e2', name: 'EKEDC', sub: 'Eko Electricity', icon: 'flash-outline', iconBg: '#FEF3E2', iconColor: '#D97706', action: 'Buy Token' },
      { id: 'e3', name: 'IKEDC', sub: 'Ikeja Electric', icon: 'flash-outline', iconBg: '#FEE8DF', iconColor: '#E53E3E', action: 'Buy Token' },
      { id: 'e4', name: 'PHEDC', sub: 'Port Harcourt', icon: 'flash-outline', iconBg: '#EDFBF4', iconColor: '#10B981', action: 'Buy Token' },
    ],
  },
  {
    id: 'tv',
    label: 'Cable TV',
    icon: 'tv-outline',
    providers: [
      { id: 't1', name: 'DSTV', sub: 'Multichoice', icon: 'tv-outline', iconBg: '#E8F4FD', iconColor: '#2980B9', action: 'Renew' },
      { id: 't2', name: 'GOtv', sub: 'Multichoice', icon: 'tv-outline', iconBg: '#FFF8E6', iconColor: '#F59E0B', action: 'Renew' },
      { id: 't3', name: 'Canal+', sub: 'Canal Plus', icon: 'tv-outline', iconBg: '#2D2D2D', iconColor: '#FFFFFF', action: 'Renew' },
      { id: 't4', name: 'StarTimes', sub: 'Digital TV', icon: 'tv-outline', iconBg: '#FEE8DF', iconColor: '#E53E3E', action: 'Renew' },
    ],
  },
];

// ─────────────────────────────────────────────
// SPRING ANIMATION UTILS
// ─────────────────────────────────────────────
const useSpringEntrance = (delay: number, translateY = 40) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const slide = React.useRef(new Animated.Value(translateY)).current;

  React.useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(slide, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  return { opacity, transform: [{ translateY: slide }] };
};

// ─────────────────────────────────────────────
// BENEFICIARIES (Quick Send)
// ─────────────────────────────────────────────
const BENEFICIARIES = [
  { id: 'add', name: 'New', isAdd: true },
  { id: '1', name: 'David', init: 'DB', color: '#10B981' },
  { id: '2', name: 'Babe', init: '♥', color: '#E11D48' },
  { id: '3', name: 'Kwame', init: 'K', color: '#3B82F6' },
  { id: '4', name: 'Ama', init: 'A', color: '#8B5CF6' },
];

function QuickSendStrip() {
  const animStyle = useSpringEntrance(200, 30);
  
  return (
    <Animated.View style={[ben.container, animStyle]}>
      <Text style={ben.header}>Quick Send</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ben.scroll}>
        {BENEFICIARIES.map((b, i) => (
          <Pressable key={b.id} style={ben.nodeWrap}>
            <View style={[ben.avatar, b.isAdd ? ben.avatarAdd : { backgroundColor: b.color }]}>
              {b.isAdd ? (
                <Ionicons name="add" size={24} color={DARK} />
              ) : (
                <Text style={ben.init}>{b.init}</Text>
              )}
            </View>
            <Text style={ben.name}>{b.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const ben = StyleSheet.create({
  container: { marginBottom: 32 },
  header: { paddingHorizontal: 24, color: '#8A94A6', fontSize: 13, fontWeight: '700', fontFamily: SANS, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  scroll: { paddingHorizontal: 24, gap: 16 },
  nodeWrap: { alignItems: 'center', gap: 6 },
  avatar: { width: 56, height: 56, borderRadius: 22, alignItems: 'center', justifyContent: 'center', shadowColor: DARK, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  avatarAdd: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E9EF', borderStyle: 'dashed' },
  init: { color: '#FFF', fontSize: 18, fontWeight: '800', fontFamily: SANS },
  name: { color: DARK, fontSize: 12, fontWeight: '600', fontFamily: SANS },
});

// ─────────────────────────────────────────────
// ASYMMETRICAL BENTO ACTIONS (Updated with Categories)
// ─────────────────────────────────────────────
function BentoGrid() {
  const animStyle = useSpringEntrance(300, 40);
  const scale1 = React.useRef(new Animated.Value(1)).current;
  const scale2 = React.useRef(new Animated.Value(1)).current;
  const scale3 = React.useRef(new Animated.Value(1)).current;

  const pressIn = (anim: Animated.Value) => Animated.spring(anim, { toValue: 0.94, useNativeDriver: true }).start();
  const pressOut = (anim: Animated.Value) => Animated.spring(anim, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  // Mapping top 3 categories to the Bento grid (Airtime, Data, Electricity)
  const primaryAction = CATEGORIES[0];
  const secAction1 = CATEGORIES[1];
  const secAction2 = CATEGORIES[2];

  return (
    <Animated.View style={[bento.container, animStyle]}>
      {/* Section Header */}
      <View style={bento.headerRow}>
        <Text style={bento.title}>Most Used</Text>
        <Pressable hitSlop={10}>
          <Text style={bento.seeAll}>See all</Text>
        </Pressable>
      </View>

      {/* Asymmetrical Grid */}
      <View style={bento.grid}>
        {/* Tall Primary Action -> Airtime */}
        <Animated.View style={[bento.tallCardWrap, { transform: [{ scale: scale1 }] }]}>
          <Pressable onPressIn={() => pressIn(scale1)} onPressOut={() => pressOut(scale1)} style={bento.tallCard}>
            <View style={bento.iconWrapPrimary}>
              <Ionicons name={primaryAction.icon as any} size={28} color="#FFF" />
            </View>
            <View>
              <Text style={bento.labelPrimary}>{primaryAction.label}</Text>
              <Text style={bento.subPrimary}>Instant recharge</Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* Stacked Secondary Actions -> Data & Electricity */}
        <View style={bento.stackedCol}>
          <Animated.View style={[bento.smallCardWrap, { transform: [{ scale: scale2 }] }]}>
            <Pressable onPressIn={() => pressIn(scale2)} onPressOut={() => pressOut(scale2)} style={bento.smallCard}>
               <View style={[bento.iconWrapSecondary, { backgroundColor: '#E8F4FD' }]}>
                  <Ionicons name={secAction1.icon as any} size={20} color="#2980B9" />
               </View>
               <Text style={bento.labelSecondary}>{secAction1.label}</Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={[bento.smallCardWrap, { transform: [{ scale: scale3 }] }]}>
            <Pressable onPressIn={() => pressIn(scale3)} onPressOut={() => pressOut(scale3)} style={bento.smallCard}>
               <View style={[bento.iconWrapSecondary, { backgroundColor: '#FFF8E6' }]}>
                  <Ionicons name={secAction2.icon as any} size={20} color="#F59E0B" />
               </View>
               <Text style={bento.labelSecondary}>{secAction2.label}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}

const bento = StyleSheet.create({
  container: { paddingHorizontal: 24, marginBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  title: { color: DARK, fontSize: 18, fontWeight: '800', fontFamily: SANS, letterSpacing: -0.5 },
  seeAll: { color: CORAL, fontSize: 13, fontWeight: '800', fontFamily: SANS, textTransform: 'uppercase', letterSpacing: 0.5 },
  grid: { flexDirection: 'row', gap: 16, height: 180 },
  tallCardWrap: { flex: 1.2 },
  tallCard: { flex: 1, backgroundColor: CORAL, borderRadius: 28, padding: 20, justifyContent: 'space-between', shadowColor: CORAL, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  iconWrapPrimary: { width: 56, height: 56, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  labelPrimary: { color: '#FFF', fontSize: 18, fontWeight: '800', fontFamily: SANS, letterSpacing: -0.5, marginBottom: 4 },
  subPrimary: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: SANS, fontWeight: '500' },
  stackedCol: { flex: 1, gap: 16 },
  smallCardWrap: { flex: 1 },
  smallCard: { flex: 1, backgroundColor: SURFACE, borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: DARK, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  iconWrapSecondary: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  labelSecondary: { color: DARK, fontSize: 15, fontWeight: '700', fontFamily: SANS, letterSpacing: -0.3 },
});

// ─────────────────────────────────────────────
// FEATURED BANNER
// ─────────────────────────────────────────────
function AdvertisedBanner() {
  const animStyle = useSpringEntrance(400, 30);
  return (
    <Animated.View style={[promo.wrap, animStyle]}>
      <View style={promo.bgDark}>
        <View style={promo.content}>
          <Text style={promo.eyebrow}>FEATURED</Text>
          <Text style={promo.title}>Société Nationale{'\n'}d'Électricité</Text>
          <Pressable style={promo.btn}>
            <Text style={promo.btnText}>Quick Pay</Text>
            <Ionicons name="arrow-forward" size={14} color={DARK} />
          </Pressable>
        </View>
        <Ionicons name="flash" size={120} color="rgba(242,118,73,0.08)" style={promo.bgIcon} />
        <View style={promo.graphic}>
          <Ionicons name="flash" size={32} color={CORAL} />
        </View>
      </View>
    </Animated.View>
  );
}

const promo = StyleSheet.create({
  wrap: { marginHorizontal: 24, marginBottom: 32 },
  bgDark: { backgroundColor: DARK, borderRadius: 28, padding: 24, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  bgIcon: { position: 'absolute', right: -20, bottom: -30, transform: [{ rotate: '15deg' }] },
  content: { flex: 1, zIndex: 2 },
  eyebrow: { color: CORAL, fontSize: 10, fontFamily: SANS, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#FFF', fontSize: 18, fontWeight: '700', fontFamily: SERIF, letterSpacing: -0.5, lineHeight: 24, marginBottom: 16 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF', alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12 },
  btnText: { color: DARK, fontSize: 12, fontWeight: '800', fontFamily: SANS },
  graphic: { width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(242,118,73,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(242,118,73,0.2)' },
});

// ─────────────────────────────────────────────
// RECENT TRANSACTIONS
// ─────────────────────────────────────────────
const TRANSACTIONS = [
  { id: '1', label: 'Electricity Top-up', sub: 'Today, 09:14 AM', amount: '-GHS 45.00', icon: 'flash' },
  { id: '2', label: 'Wallet Credit', sub: 'Mon, Apr 21', amount: '+GHS 500.00', icon: 'arrow-down' },
  { id: '3', label: 'Airtime – MTN', sub: 'Yesterday, 3:02 PM', amount: '-GHS 20.00', icon: 'phone-portrait' },
];

function TxnRow({ label, sub, amount, icon, index }: any) {
  const isPositive = amount.startsWith('+');
  const animStyle = useSpringEntrance(500 + index * 100, 20);

  return (
    <Animated.View style={[tx.row, animStyle]}>
      <View style={[tx.iconContainer, isPositive && tx.iconPositive]}>
        <Ionicons name={icon} size={18} color={isPositive ? '#10B981' : DARK} />
      </View>
      <View style={tx.info}>
        <Text style={tx.label}>{label}</Text>
        <Text style={tx.sub}>{sub}</Text>
      </View>
      <Text style={[tx.amount, isPositive && { color: '#10B981' }]}>{amount}</Text>
    </Animated.View>
  );
}

const tx = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 48, height: 48, borderRadius: 20, backgroundColor: OFF_SURFACE, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  iconPositive: { backgroundColor: '#EDFBF4' },
  info: { flex: 1 },
  label: { color: DARK, fontSize: 15, fontWeight: '700', fontFamily: SANS, letterSpacing: -0.3, marginBottom: 2 },
  sub: { color: '#8A94A6', fontSize: 12, fontFamily: SANS },
  amount: { fontSize: 16, fontWeight: '800', fontFamily: SANS, letterSpacing: -0.5, color: DARK },
});

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
export function HomeScreen() {
  const insets = useSafeAreaInsets();
  
  // Hero animations
  const heroFade = React.useRef(new Animated.Value(0)).current;
  const heroY = React.useRef(new Animated.Value(-12)).current;
  const lineWidth = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(heroY, { toValue: 0, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.spring(lineWidth, { toValue: 48, tension: 40, friction: 6, delay: 200, useNativeDriver: false }), 
    ]).start();
  }, []);

  const txnHeaderAnim = useSpringEntrance(500, 20);

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* HERO SECTION */}
        <View style={[s.hero, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
          <View style={s.ringOuter} />
          
          <Animated.View style={[s.topBar, { opacity: heroFade, transform: [{ translateY: heroY }] }]}>
            <View style={s.wordRow}>
              <View style={s.wordDot} />
              <Text style={s.wordmark}>ARAKA</Text>
            </View>
            <View style={s.topRight}>
              <Pressable style={s.iconBtn}>
                <Ionicons name="notifications-outline" size={22} color="#FFF" />
                <View style={s.notifDot} />
              </Pressable>
              <Pressable style={s.avatar}>
                <Text style={s.avatarText}>A</Text>
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View style={{ opacity: heroFade, transform: [{ translateY: heroY }] }}>
            <Text style={s.greetSub}>Good morning</Text>
            <Text style={s.greetName}>Adom.</Text>
            {/* The Animated Orange Line */}
            <Animated.View style={[s.orangeLine, { width: lineWidth }]} />
          </Animated.View>
        </View>

        {/* BODY CANVAS */}
        <View style={s.bodyCanvas}>
          
          {/* QUICK SEND (Beneficiaries) */}
          <QuickSendStrip />

          {/* ASYMMETRICAL BENTO GRID */}
          <BentoGrid />

          {/* ADVERTISED BANNER */}
          <AdvertisedBanner />

          {/* TRANSACTIONS SECTION */}
          <View style={s.txnSection}>
            <Animated.View style={[s.sectionHeader, txnHeaderAnim]}>
              <Text style={s.sectionTitle}>Recent Activity</Text>
              <Pressable hitSlop={10}><Text style={s.sectionCta}>View all</Text></Pressable>
            </Animated.View>
            
            {TRANSACTIONS.map((t, i) => (
              <TxnRow key={t.id} {...t} index={i} />
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: SLATE },
  scroll: { flex: 1 },

  hero: { backgroundColor: SLATE, paddingHorizontal: 24, paddingBottom: 48 },
  ringOuter: { position: 'absolute', top: -40, right: -60, width: 240, height: 240, borderRadius: 120, borderWidth: 40, borderColor: 'rgba(242,118,73,0.05)' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wordDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: CORAL },
  wordmark: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 4, fontFamily: SANS },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 4 },
  notifDot: { position: 'absolute', top: 4, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: CORAL, borderWidth: 2, borderColor: SLATE },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: CORAL, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', fontFamily: SANS },
  
  greetSub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: SANS, fontWeight: '600', letterSpacing: 0.5, marginBottom: 4 },
  greetName: { color: '#FFFFFF', fontSize: 44, fontWeight: '700', fontFamily: SERIF, letterSpacing: -1.5, lineHeight: 48 },
  
  orangeLine: { height: 4, backgroundColor: CORAL, borderRadius: 2, marginTop: 12 },

  bodyCanvas: { backgroundColor: OFF_SURFACE, borderTopLeftRadius: 36, borderTopRightRadius: 36, flex: 1, paddingTop: 32, paddingBottom: 60 },

  txnSection: { paddingHorizontal: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  sectionTitle: { color: DARK, fontSize: 18, fontWeight: '800', fontFamily: SANS, letterSpacing: -0.5 },
  sectionCta: { color: CORAL, fontSize: 13, fontWeight: '800', fontFamily: SANS, textTransform: 'uppercase', letterSpacing: 0.5 },
});