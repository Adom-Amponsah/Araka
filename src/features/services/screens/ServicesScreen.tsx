import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {selectUnreadCount, useNotificationStore} from '@features/notifications/store/notificationStore';
import {BurgerMenu} from '@features/home/components/BurgerMenu';
import {useAppStore} from '@shared/store/appStore';
import {SERVICE_CATEGORIES, ServiceProviderConfig} from '../registry/serviceRegistry';
import {useAirtimeTopupFlowStore} from '../store/airtimeTopupFlowStore';
import {useServiceSessionStore} from '../store/serviceSessionStore';
import {useTransferFlowStore} from '../store/transferFlowStore';

const {width, height} = Dimensions.get('window');

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK  = '#1A2535';
const OFF   = '#F4F6FA';
const DISPLAY = getSystemFont('condensed');
const SERIF = getSystemFont('medium');
const SANS = getSystemFont();

// ─────────────────────────────────────────────
// DATA — categories → providers
// ─────────────────────────────────────────────
interface Provider {
  id: string;
  name: string;
  sub: string;
  icon: string;       // Ionicons name
  iconBg: string;
  iconColor: string;
  action: string;     // CTA verb
}

interface Category {
  id: string;
  label: string;
  icon: string;
  providers: Provider[];
}

const CATEGORIES: Category[] = [
    {
    id: 'transfer',
    label: 'Transfer',
    icon: 'paper-plane-outline',
    providers: [
      {id:'m1', name:'M-Pesa',       sub:'Safaricom',      icon:'paper-plane-outline', iconBg:'#EDFBF4', iconColor:'#10B981', action:'Send'},
      {id:'m2', name:'Orange Money', sub:'Orange',         icon:'paper-plane-outline', iconBg:'#FEF3E2', iconColor:'#D97706', action:'Send'},
      {id:'m3', name:'afrimoney',    sub:'Sierratel',      icon:'paper-plane-outline', iconBg:'#E8F4FD', iconColor:'#2980B9', action:'Send'},
      {id:'m4', name:'Wave',         sub:'West Africa',    icon:'paper-plane-outline', iconBg:'#F0E6FF', iconColor:'#7C3AED', action:'Send'},
    ],
  },
  {
    id: 'airtime',
    label: 'Airtime',
    icon: 'phone-portrait-outline',
    providers: [
      {id:'a1', name:'MTN',       sub:'All networks',    icon:'phone-portrait-outline', iconBg:'#FFF8E6', iconColor:'#F59E0B', action:'Top Up'},
      {id:'a2', name:'Vodacom',   sub:'Instant recharge',icon:'phone-portrait-outline', iconBg:'#FEE8DF', iconColor:'#E53E3E', action:'Top Up'},
      {id:'a3', name:'Airtel',    sub:'All amounts',     icon:'phone-portrait-outline', iconBg:'#FEE8DF', iconColor:'#C0392B', action:'Top Up'},
      {id:'a4', name:'Glo',       sub:'Glo network',     icon:'phone-portrait-outline', iconBg:'#EDFBF4', iconColor:'#10B981', action:'Top Up'},
      {id:'a5', name:'9Mobile',   sub:'etisalat',        icon:'phone-portrait-outline', iconBg:'#E8F4FD', iconColor:'#2980B9', action:'Top Up'},
    ],
  },
  {
    id: 'data',
    label: 'Data',
    icon: 'wifi-outline',
    providers: [
      {id:'d1', name:'MTN Data',    sub:'Data bundles',   icon:'wifi-outline', iconBg:'#FFF8E6', iconColor:'#F59E0B', action:'Buy'},
      {id:'d2', name:'Airtel Data', sub:'All plans',      icon:'wifi-outline', iconBg:'#FEE8DF', iconColor:'#C0392B', action:'Buy'},
      {id:'d3', name:'Glo Data',    sub:'Cheap bundles',  icon:'wifi-outline', iconBg:'#EDFBF4', iconColor:'#10B981', action:'Buy'},
      {id:'d4', name:'9Mobile',     sub:'Data plans',     icon:'wifi-outline', iconBg:'#E8F4FD', iconColor:'#2980B9', action:'Buy'},
    ],
  },
  {
    id: 'electricity',
    label: 'Electricity',
    icon: 'flash-outline',
    providers: [
      {id:'e1', name:'SNEL',      sub:'Société Nationale', icon:'flash-outline', iconBg:'#FFF8E6', iconColor:'#F59E0B', action:'Buy Token'},
      {id:'e2', name:'EKEDC',     sub:'Eko Electricity',   icon:'flash-outline', iconBg:'#FEF3E2', iconColor:'#D97706', action:'Buy Token'},
      {id:'e3', name:'IKEDC',     sub:'Ikeja Electric',    icon:'flash-outline', iconBg:'#FEE8DF', iconColor:'#E53E3E', action:'Buy Token'},
      {id:'e4', name:'PHEDC',     sub:'Port Harcourt',     icon:'flash-outline', iconBg:'#EDFBF4', iconColor:'#10B981', action:'Buy Token'},
    ],
  },
  {
    id: 'tv',
    label: 'Cable TV',
    icon: 'tv-outline',
    providers: [
      {id:'t1', name:'DSTV',      sub:'Multichoice',       icon:'tv-outline', iconBg:'#E8F4FD', iconColor:'#2980B9', action:'Renew'},
      {id:'t2', name:'GOtv',      sub:'Multichoice',       icon:'tv-outline', iconBg:'#FFF8E6', iconColor:'#F59E0B', action:'Renew'},
      {id:'t3', name:'Canal+',    sub:'Canal Plus',        icon:'tv-outline', iconBg:'#2D2D2D', iconColor:'#FFFFFF', action:'Renew'},
      {id:'t4', name:'StarTimes', sub:'Digital TV',        icon:'tv-outline', iconBg:'#FEE8DF', iconColor:'#E53E3E', action:'Renew'},
    ],
  },
  // {
  //   id: 'water',
  //   label: 'Water',
  //   icon: 'water-outline',
  //   providers: [
  //     {id:'w1', name:'LAWMA',     sub:'Lagos Water',       icon:'water-outline', iconBg:'#E8F4FD', iconColor:'#2980B9', action:'Pay'},
  //     {id:'w2', name:'RUWASA',    sub:'Rural Water',       icon:'water-outline', iconBg:'#E8F8FF', iconColor:'#0EA5E9', action:'Pay'},
  //   ],
  // },
  {
    id: 'internet',
    label: 'Internet',
    icon: 'globe-outline',
    providers: [
      {id:'i1', name:'Spectranet', sub:'Broadband',        icon:'globe-outline', iconBg:'#E8F4FD', iconColor:'#2980B9', action:'Renew'},
      {id:'i2', name:'Smile',      sub:'4G LTE',           icon:'globe-outline', iconBg:'#FFF8E6', iconColor:'#F59E0B', action:'Renew'},
      {id:'i3', name:'Swift',      sub:'WiMAX',            icon:'globe-outline', iconBg:'#FEE8DF', iconColor:'#C0392B', action:'Renew'},
    ],
  },
];

// ─────────────────────────────────────────────
// Provider Card
// ─────────────────────────────────────────────
function ProviderCard({
  provider,
  index,
  animKey,
  onPress,
}: {
  provider: Provider;
  index: number;
  animKey: string; // changes when category changes → re-triggers animation
  onPress: () => void;
}) {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideY = React.useRef(new Animated.Value(18)).current;
  const scale  = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    fadeIn.setValue(0);
    slideY.setValue(18);
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1, duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideY, {
          toValue: 0, duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, index * 50);
  }, [animKey]);

  const pressIn  = () => Animated.spring(scale, {toValue: 0.95, useNativeDriver: true, damping: 15, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scale, {toValue: 1,    useNativeDriver: true, damping: 10, stiffness: 200}).start();

  return (
    <Animated.View
      style={[
        pc.wrap,
        {opacity: fadeIn, transform: [{translateY: slideY}, {scale}]},
      ]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={pc.card}>
        {/* Icon */}
        <View style={[pc.iconBadge, {backgroundColor: provider.iconBg}]}>
          <Ionicons name={provider.icon as any} size={22} color={provider.iconColor} />
        </View>

        {/* Name + sub */}
        <View style={pc.info}>
          <Text style={pc.name} numberOfLines={1}>{provider.name}</Text>
          <Text style={pc.sub}  numberOfLines={1}>{provider.sub}</Text>
        </View>

        {/* Action CTA */}
        <View style={pc.ctaWrap}>
          <Text style={pc.ctaText}>{provider.action}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const pc = StyleSheet.create({
  wrap: {
    width: (width - 24 * 2 - 12) / 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {gap: 3},
  name: {
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: SERIF,
    letterSpacing: -0.2,
  },
  sub: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: SANS,
    letterSpacing: 0.1,
  },
  ctaWrap: {
    backgroundColor: OFF,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  ctaText: {
    color: SLATE,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: SANS,
    letterSpacing: 0.3,
  },
});

// ─────────────────────────────────────────────
// Category Pill
// ─────────────────────────────────────────────
function CategoryPill({
  cat,
  isActive,
  onPress,
}: {
  cat: Category;
  isActive: boolean;
  onPress: () => void;
}) {
  const bgAnim    = React.useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const pressIn  = () => Animated.spring(scaleAnim, {toValue: 0.92, useNativeDriver: true, damping: 15, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scaleAnim, {toValue: 1,    useNativeDriver: true, damping: 10, stiffness: 200}).start();

  const bg = bgAnim.interpolate({inputRange: [0, 1], outputRange: ['#FFFFFF', DARK]});
  const textColor = bgAnim.interpolate({inputRange: [0, 1], outputRange: [SLATE, '#FFFFFF']});
  const iconColor = isActive ? '#FFFFFF' : '#9CA3AF';

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <Animated.View style={[cp.pill, {backgroundColor: bg}]}>
          <Ionicons name={cat.icon as any} size={14} color={iconColor} />
          <Animated.Text style={[cp.label, {color: textColor}]}>
            {cat.label}
          </Animated.Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const cp = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E8EDF2',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: SANS,
    letterSpacing: 0.1,
  },
});

// ─────────────────────────────────────────────
// Search bar
// ─────────────────────────────────────────────
function SearchBar({onFocus}: {onFocus?: () => void}) {
  const [value, setValue] = React.useState('');
  const borderAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(borderAnim, {toValue: 1, duration: 180, useNativeDriver: false}).start();
    onFocus?.();
  };
  const handleBlur = () => {
    Animated.timing(borderAnim, {toValue: 0, duration: 180, useNativeDriver: false}).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8EDF2', CORAL],
  });

  return (
    <Animated.View style={[sb.wrap, {borderColor}]}>
      <Ionicons name="search-outline" size={16} color="#9CA3AF" style={sb.icon} />
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="Search services or providers…"
        placeholderTextColor="#9CA3AF"
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={sb.input}
        selectionColor={CORAL}
      />
      {value.length > 0 && (
        <Pressable onPress={() => setValue('')}>
          <Ionicons name="close-circle" size={16} color="#C4CDD8" />
        </Pressable>
      )}
    </Animated.View>
  );
}

const sb = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  icon: {flexShrink: 0},
  input: {
    flex: 1,
    fontSize: 14,
    color: DARK,
    fontFamily: SANS,
    padding: 0,
    letterSpacing: 0.2,
  },
});

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────
const CARD_RADIUS = 36;

export function ServicesScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const unreadNotifications = useNotificationStore(selectUnreadCount);
  const user = useAppStore(state => state.user);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const displayName = user?.name || 'Adom Isaac';
  const displayEmail = user?.email || 'adom@araka.app';

  const openNotifications = React.useCallback(() => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('Notifications');
      return;
    }
    navigation.navigate('Notifications');
  }, [navigation]);

  const [activeId, setActiveId] = React.useState(CATEGORIES[0].id);
  const [animKey, setAnimKey]   = React.useState(CATEGORIES[0].id);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [unavailableProvider, setUnavailableProvider] = React.useState<Provider | null>(null);
  const openServiceSession = useServiceSessionStore(s => s.openServiceSession);
  const startAirtimeTopup = useAirtimeTopupFlowStore(s => s.start);
  const startTransfer = useTransferFlowStore(s => s.start);

  // Entrance animations — same pattern as HomeScreen
  const heroFade  = React.useRef(new Animated.Value(0)).current;
  const heroY     = React.useRef(new Animated.Value(-12)).current;
  const cardSlide = React.useRef(new Animated.Value(48)).current;
  const cardFade  = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade,  {toValue: 1, duration: 400, useNativeDriver: true}),
        Animated.timing(heroY,     {toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]),
      Animated.parallel([
        Animated.timing(cardSlide, {toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(cardFade,  {toValue: 1, duration: 380, useNativeDriver: true}),
      ]),
    ]).start();
  }, []);

  const handleCategoryPress = (id: string) => {
    if (id === activeId) return;
    setActiveId(id);
    setAnimKey(id); // triggers provider card re-animation
  };

  const activeCategory = CATEGORIES.find(c => c.id === activeId)!;

  const resolveProviderConfig = (
    category: Category,
    provider: Provider,
  ): ServiceProviderConfig | undefined => {
    const registryCategory = SERVICE_CATEGORIES.find(c => c.id === category.id);
    return registryCategory?.providers.find(item => item.name === provider.name);
  };

  const handleProviderPress = (category: Category, provider: Provider) => {
    const providerConfig = resolveProviderConfig(category, provider);

    if (!providerConfig || !providerConfig.enabled) {
      setUnavailableProvider(provider);
      return;
    }

    const session = openServiceSession(providerConfig);

    if (session.flowId === 'airtimeTopup') {
      startAirtimeTopup(session);
    }

    if (session.flowId === 'transfer') {
      startTransfer(session);
    }

    const parentNavigation = navigation.getParent();

    if (parentNavigation) {
      parentNavigation.navigate('ServiceFlow');
      return;
    }

    navigation.navigate('ServiceFlow');
  };

  // Pair providers into rows of 2
  const providerPairs: Provider[][] = [];
  for (let i = 0; i < activeCategory.providers.length; i += 2) {
    providerPairs.push(activeCategory.providers.slice(i, i + 2));
  }

  // Calculate dynamic padding based on actual content
  const minRequiredHeight = height * 0.7;
  const dynamicPadding = Math.max(32, minRequiredHeight - contentHeight);

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        bounces>

        {/* ════════════════════════
            SLATE HERO
        ════════════════════════ */}
        <View style={[s.hero, {paddingTop: Math.max(insets.top, 20) + 8}]}>
          <View style={s.ringOuter} />
          <View style={s.ringInner} />

          <Animated.View style={[s.topBar, {opacity: heroFade, transform: [{translateY: heroY}]}]}>
            <Pressable hitSlop={10} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={28} color="#FFFFFF" />
            </Pressable>
            <Pressable hitSlop={10} onPress={openNotifications}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              {unreadNotifications > 0 && (
                <View style={s.notificationDot}>
                  <Text style={s.notificationCount}>{unreadNotifications}</Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          <Animated.View style={{opacity: heroFade, transform: [{translateY: heroY}]}}>
            <Text style={s.greetSub}>What would you like to</Text>
            <Text style={s.greetName}>Pay for?</Text>
            {/* <View style={s.greetRule} /> */}
          </Animated.View>
        </View>

        {/* Curve shadow */}
        <Animated.View style={[s.curveShadow, {opacity: cardFade}]} />

        {/* ════════════════════════
            WHITE CARD
        ════════════════════════ */}
        <Animated.View
          style={[s.card, {transform: [{translateY: cardSlide}], opacity: cardFade, paddingBottom: dynamicPadding}]}>

          <View style={s.handle} />

          {/* Search */}
          <SearchBar />

          {/* Category pills — horizontal scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.pillStrip}
            style={s.pillScroll}>
            {CATEGORIES.map(cat => (
              <CategoryPill
                key={cat.id}
                cat={cat}
                isActive={cat.id === activeId}
                onPress={() => handleCategoryPress(cat.id)}
              />
            ))}
          </ScrollView>

          {/* Category label + count */}
          <View style={s.catHeader}>
            <Text style={s.catTitle}>{activeCategory.label}</Text>
            <View style={s.catBadge}>
              <Text style={s.catCount}>{activeCategory.providers.length} providers</Text>
            </View>
          </View>

          {/* Provider grid — 2 columns */}
          <View 
            style={s.grid}
            onLayout={(e) => setContentHeight(e.nativeEvent.layout.height + 400)}>
            {providerPairs.map((pair, rowIdx) => (
              <View key={rowIdx} style={s.gridRow}>
                {pair.map((provider, colIdx) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    index={rowIdx * 2 + colIdx}
                    animKey={animKey}
                    onPress={() => handleProviderPress(activeCategory, provider)}
                  />
                ))}
                {/* If odd provider, fill with empty space */}
                {pair.length === 1 && (
                  <View style={{width: (width - 24 * 2 - 12) / 2}} />
                )}
              </View>
            ))}
          </View>

        </Animated.View>
      </ScrollView>
      <UnavailableServiceSheet
        provider={unavailableProvider}
        onClose={() => setUnavailableProvider(null)}
      />
      <BurgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        name={displayName}
        email={displayEmail}
      />
    </View>
  );
}

function UnavailableServiceSheet({
  provider,
  onClose,
}: {
  provider: Provider | null;
  onClose: () => void;
}) {
  const slideAnim = React.useRef(new Animated.Value(420)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (provider) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 260,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 420,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdropAnim, provider, slideAnim]);

  if (!provider) {
    return null;
  }

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[us.backdrop, {opacity: backdropAnim}]} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          us.sheet,
          {
            transform: [{translateY: slideAnim}],
            paddingBottom: Math.max(insets.bottom, 22),
          },
        ]}>
        <View style={us.handle} />
        <View style={[us.iconWrap, {backgroundColor: provider.iconBg}]}>
          <Ionicons name={provider.icon as any} size={24} color={provider.iconColor} />
        </View>
        <Text style={us.title}>{provider.name} is coming soon</Text>
        <Text style={us.body}>
          We're preparing this service for a smoother payment experience. Try Airtime or Transfer for now.
        </Text>
        <Pressable onPress={onClose} style={us.button}>
          <Text style={us.buttonText}>Got it</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

// ─────────────────────────────────────────────
const s = StyleSheet.create({
  root:  {flex: 1, backgroundColor: CORAL},
  scroll:{flex: 1},

  hero: {
    backgroundColor: CORAL,
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  ringOuter: {
    position: 'absolute', top: -28, right: -48,
    width: 190, height: 190, borderRadius: 95,
    borderWidth: 32, borderColor: 'rgba(61,74,92,0.15)',
  },
  ringInner: {
    position: 'absolute', top: 22, right: 12,
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 1.5, borderColor: 'rgba(61,74,92,0.3)',
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 32,
  },
  notificationDot: {
    position: 'absolute', right: -7, top: -7,
    minWidth: 18, height: 18, borderRadius: 9,
    paddingHorizontal: 4, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: DARK,
  },
  notificationCount: {
    color: DARK, fontSize: 10, fontWeight: '800',
    fontFamily: getSystemFont('bold'), lineHeight: 12,
  },

  greetSub:  {color: 'rgba(255,255,255,0.42)', fontSize: 14, fontFamily: SANS, letterSpacing: 0.4, marginBottom: 4},
  greetName: {color: '#FFFFFF', fontSize: 32, fontWeight: '700', fontFamily: DISPLAY, letterSpacing: -1, lineHeight: 44},
  greetRule: {width: 36, height: 3, backgroundColor: DARK, borderRadius: 2, marginTop: 12},

  curveShadow: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
    borderTopLeftRadius: CARD_RADIUS, borderTopRightRadius: CARD_RADIUS,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: {width: 0, height: -14},
    shadowOpacity: 0.20, shadowRadius: 28, elevation: 22,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    marginTop: -CARD_RADIUS,
    paddingTop: 16,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#D1D9E0',
    alignSelf: 'center', marginBottom: 24,
  },

  pillScroll: {marginBottom: 24},
  pillStrip:  {paddingHorizontal: 24, gap: 8, paddingRight: 32},

  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  catTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: SERIF,
    letterSpacing: -0.3,
  },
  catBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  catCount: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: SANS,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  grid: {
    paddingHorizontal: 24,
    gap: 12,
    paddingBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

const us = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26,37,53,0.55)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    paddingHorizontal: 24,
    paddingTop: 14,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -12},
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D9E0',
    marginBottom: 24,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: DARK,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: SERIF,
    textAlign: 'center',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  body: {
    color: '#8A94A6',
    fontSize: 13,
    fontFamily: SANS,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: CORAL,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: CORAL,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: SANS,
  },
});
