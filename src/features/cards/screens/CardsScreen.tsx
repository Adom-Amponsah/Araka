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
import Svg, {Defs, LinearGradient, Rect, Stop} from 'react-native-svg';
import {BurgerMenu} from '@features/home/components/BurgerMenu';
import {selectUnreadCount, useNotificationStore} from '@features/notifications/store/notificationStore';
import {useAppStore} from '@shared/store/appStore';
import {getSystemFont} from '@styles/typography';
import {useCardsStore} from '../store/cardsStore';
import {BuyVirtualSheet} from '../components/BuyVirtualSheet';
import {CardSuccessSheet} from '../components/CardSuccessSheet';
import {CardDetailsSheet} from '../components/CardDetailsSheet';
import {LinkPhysicalSheet} from '../components/LinkPhysicalSheet';
import {SetLimitSheet} from '../components/SetLimitSheet';

const {width} = Dimensions.get('window');

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK = '#1A2535';
const OFF = '#F4F6FA';
const GREEN = '#22C55E';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

const CARD_W = width - 48;
const CARD_H = CARD_W * 0.58;
const EMPTY_CARD_W = width - 180;
const EMPTY_CARD_H = EMPTY_CARD_W * 1.5;
const CARD_OVERLAP = 60;
const CARD_TOP_OFFSET = 0;
const TOPBAR_HEIGHT = 52;
const TABROW_HEIGHT = 68;
const HERO_PADDING_TOP = 8;
const HERO_PADDING_BOTTOM = 40;

const TRANSACTIONS = [
  {
    id: 't01',
    title: 'Airtime - Vodacom',
    date: 'Feb 17',
    amount: '-5.00',
    currency: 'USD',
    icon: 'phone-portrait-outline',
    iconBg: '#FFF1EA',
    iconColor: CORAL,
    credit: false,
  },
  {
    id: 't02',
    title: 'To Natalia',
    date: 'Feb 20',
    amount: '-45.30',
    currency: 'USD',
    icon: 'person-outline',
    iconBg: '#FFF1EA',
    iconColor: CORAL,
    credit: false,
  },
  {
    id: 't03',
    title: 'From Mathew',
    date: 'Feb 18',
    amount: '+120.00',
    currency: 'USD',
    icon: 'person-outline',
    iconBg: '#EDFBF4',
    iconColor: GREEN,
    credit: true,
  },
];

const VIRTUAL_ACTIONS = [
  {label: 'View Details', icon: 'eye-outline'},
  {label: 'Top Up', icon: 'add-outline'},
  {label: 'More', icon: 'ellipsis-horizontal-outline'},
];

export function CardsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const unreadNotifications = useNotificationStore(selectUnreadCount);
  const user = useAppStore((state) => state.user);
  const [menuVisible, setMenuVisible] = React.useState(false);

  const activeTab = useCardsStore((state) => state.activeTab);
  const cards = useCardsStore((state) => state.cards);
  const hasPhysicalCard = useCardsStore((state) => state.hasPhysicalCard);
  const showSuccess = useCardsStore((state) => state.showSuccess);
  const lastAddedCard = useCardsStore((state) => state.lastAddedCard);
  const setActiveTab = useCardsStore((state) => state.setActiveTab);
  const unlinkPhysicalCard = useCardsStore((state) => state.unlinkPhysicalCard);
  const updatePhysicalCard = useCardsStore((state) => state.updatePhysicalCard);
  const clearSuccess = useCardsStore((state) => state.clearSuccess);
  const updateCard = useCardsStore((state) => state.updateCard);
  const physicalCard = useCardsStore((state) => state.physicalCard);

  const [buyVisible, setBuyVisible] = React.useState(false);
  const [linkVisible, setLinkVisible] = React.useState(false);
  const [detailsVisible, setDetailsVisible] = React.useState(false);
  const [limitVisible, setLimitVisible] = React.useState(false);
  const [amount, setAmount] = React.useState('');

  const fade = React.useRef(new Animated.Value(0)).current;
  const slide = React.useRef(new Animated.Value(24)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {toValue: 1, duration: 300, useNativeDriver: true}),
      Animated.timing(slide, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide]);

  React.useEffect(() => {
    if (showSuccess) {
      setBuyVisible(false);
      setAmount('');
    }
  }, [showSuccess]);

  const openNotifications = React.useCallback(() => {
    navigation.getParent()?.navigate('Notifications');
  }, [navigation]);

  const displayName = user?.name || 'Adom Isaac';
  const displayEmail = user?.email || 'adom@araka.app';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('');
  const userImage = user?.selfieUri;

  const isVirtual = activeTab === 'virtual';
  const hasVirtualCards = cards.length > 0;
  const activeCard = cards[0];
  const showActiveCard = isVirtual && hasVirtualCards;
  const showPhysicalCard = !isVirtual && hasPhysicalCard && physicalCard;
  const showCard = showActiveCard || showPhysicalCard;
  const cardTop =
    insets.top +
    HERO_PADDING_TOP +
    TOPBAR_HEIGHT +
    TABROW_HEIGHT +
    HERO_PADDING_BOTTOM -
    CARD_TOP_OFFSET;
  const bodyMarginTop = showCard
    ? -24
    : Math.max(EMPTY_CARD_H - CARD_OVERLAP - CARD_TOP_OFFSET, 0);

  const onContinue = () => {
    if (!amount) return;
    setBuyVisible(false);
    navigation.navigate('CardPin', {amount});
  };

  const onDone = () => {
    clearSuccess();
  };

  const virtualActions = [
    ...VIRTUAL_ACTIONS.slice(0, 2),
    {
      label: activeCard?.isFrozen ? 'Unfreeze' : 'Freeze',
      icon: activeCard?.isFrozen ? 'lock-open-outline' : 'snow-outline',
    },
    VIRTUAL_ACTIONS[2],
  ];

  const handleAction = (label: string) => {
    if (!activeCard) return;
    if (label === 'View Details') {
      setDetailsVisible(true);
    } else if (label === 'Freeze' || label === 'Unfreeze') {
      updateCard(activeCard.id, {isFrozen: !activeCard.isFrozen});
    }
  };

  const physicalActions = [
    {label: 'View Details', icon: 'eye-outline'},
    {label: 'Unlink', icon: 'unlink-outline'},
    {
      label: physicalCard?.isFrozen ? 'Unfreeze' : 'Freeze',
      icon: physicalCard?.isFrozen ? 'lock-open-outline' : 'snow-outline',
    },
    {label: 'Set limit', icon: 'ellipsis-horizontal-outline'},
  ];

  const handlePhysicalAction = (label: string) => {
    if (!physicalCard) return;
    if (label === 'View Details') {
      setDetailsVisible(true);
    } else if (label === 'Unlink') {
      unlinkPhysicalCard();
    } else if (label === 'Freeze' || label === 'Unfreeze') {
      updatePhysicalCard({isFrozen: !physicalCard.isFrozen});
    } else if (label === 'Set limit') {
      setLimitVisible(true);
    }
  };

  const renderCardBg = (w: number, h: number, gradId: string) => (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E07C55" />
          <Stop offset="1" stopColor="#7C6BDD" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={w} height={h} rx="18" fill={`url(#${gradId})`} />
    </Svg>
  );

  const renderEmptyCard = () => (
    <View style={[styles.emptyCard, {width: EMPTY_CARD_W, height: EMPTY_CARD_H}]}>
      {renderCardBg(EMPTY_CARD_W, EMPTY_CARD_H, 'emptyGrad')}
      <View style={styles.emptyCardBottom}>
        <View style={styles.mastercard}>
          <View style={[styles.mcCircle, styles.mcRed]} />
          <View style={[styles.mcCircle, styles.mcYellow]} />
        </View>
      </View>
    </View>
  );

  const renderCardFace = (card: typeof activeCard) => (
    <View style={[styles.activeCard, {width: CARD_W, height: CARD_H}]}>
      {renderCardBg(CARD_W, CARD_H, 'activeGrad')}
      <View style={styles.activeCardTop}>
        <Text style={styles.cardBalanceLabel}>Balance</Text>
        <Text style={styles.cardBalance}>
          {Math.floor(card.balance).toLocaleString()} {card.currency}
        </Text>
      </View>
      <View style={styles.activeCardBottom}>
        <Text style={styles.cardDigits}>.... {card.digits}</Text>
        <View style={styles.mastercard}>
          <View style={[styles.mcCircle, styles.mcRed]} />
          <View style={[styles.mcCircle, styles.mcYellow]} />
        </View>
      </View>
      {card.isFrozen && (
        <View style={styles.freezeOverlay}>
          <Ionicons name="lock-closed" size={48} color="#FFFFFF" />
        </View>
      )}
    </View>
  );

  const renderActiveCard = () => renderCardFace(activeCard);

  return (
    <View style={styles.root}>
      <View style={[styles.hero, {paddingTop: Math.max(insets.top, 20) + 8}]}>
        <View style={styles.topBar}>
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
              {userImage ? (
                <Animated.Image source={{uri: userImage}} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{initials}</Text>
              )}
            </View>
          </View>
        </View>

        <Animated.View style={[styles.tabRow, {opacity: fade, transform: [{translateY: slide}]}]}>
          <Pressable
            onPress={() => setActiveTab('physical')}
            style={[styles.tab, activeTab === 'physical' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'physical' && styles.tabTextActive]}>
              Physical Card
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('virtual')}
            style={[styles.tab, activeTab === 'virtual' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'virtual' && styles.tabTextActive]}>
              Virtual Cards
            </Text>
          </Pressable>
        </Animated.View>

        {(showActiveCard || showPhysicalCard) && (
          <Animated.View
            style={[
              styles.cardWrap,
              {opacity: fade, transform: [{translateY: slide}]},
            ]}>
            {showActiveCard ? renderActiveCard() : renderCardFace(physicalCard!)}
          </Animated.View>
        )}
      </View>

      <Animated.View
        style={[
          styles.body,
          {opacity: fade, transform: [{translateY: slide}], marginTop: bodyMarginTop},
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.bodyContent,
            !showActiveCard && styles.bodyContentEmpty,
          ]}>
          {isVirtual ? (
            hasVirtualCards ? (
              <View style={styles.cardDetail}>
                <View style={styles.actions}>
                  {virtualActions.map((action) => (
                    <Pressable
                      key={action.label}
                      onPress={() => handleAction(action.label)}
                      style={styles.actionItem}>
                      <View style={styles.actionIcon}>
                        <Ionicons name={action.icon as any} size={18} color={CORAL} />
                      </View>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                    </Pressable>
                  ))}
                </View>

                <View style={styles.sectionHead}>
                  <Text style={styles.sectionTitle}>Latest transactions</Text>
                  <Pressable>
                    <Text style={styles.seeAll}>See All</Text>
                  </Pressable>
                </View>

                <View style={styles.txnList}>
                  {TRANSACTIONS.map((txn) => (
                    <View key={txn.id} style={styles.txn}>
                      <View style={[styles.txnIcon, {backgroundColor: txn.iconBg}]}>
                        <Ionicons name={txn.icon as any} size={18} color={txn.iconColor} />
                      </View>
                      <View style={styles.txnCopy}>
                        <Text style={styles.txnTitle}>{txn.title}</Text>
                        <Text style={styles.txnDate}>{txn.date}</Text>
                      </View>
                      <Text style={[styles.txnAmount, txn.credit && styles.txnCredit]}>
                        {txn.credit ? '+' : ''}
                        {txn.amount} {txn.currency}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No Virtual Card</Text>
                <Text style={styles.emptySub}>You don't have any virtual card, please buy one !</Text>
                <Pressable onPress={() => setBuyVisible(true)} style={styles.cta}>
                  <Text style={styles.ctaText}>Buy virtual card</Text>
                </Pressable>
              </View>
            )
          ) : hasPhysicalCard && physicalCard ? (
            <View style={styles.cardDetail}>
              <View style={styles.actions}>
                {physicalActions.map((action) => (
                  <Pressable
                    key={action.label}
                    onPress={() => handlePhysicalAction(action.label)}
                    style={styles.actionItem}>
                    <View style={styles.actionIcon}>
                      <Ionicons name={action.icon as any} size={18} color={CORAL} />
                    </View>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No Physical card linked !</Text>
              <Text style={styles.emptySub}>You don't have any physical card, please link one !</Text>
              <Pressable onPress={() => setLinkVisible(true)} style={styles.cta}>
                <Text style={styles.ctaText}>Link your physical card</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {isVirtual && hasVirtualCards && (
        <Pressable onPress={() => setBuyVisible(true)} style={styles.fab}>
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.fabText}>Buy New Card</Text>
        </Pressable>
      )}

      {!showCard && (
        <Animated.View
          style={[
            styles.cardOverlay,
            {
              opacity: fade,
              top: cardTop,
              transform: [{translateY: slide}, {rotate: '-4deg'}],
            },
          ]}>
          {renderEmptyCard()}
        </Animated.View>
      )}

      <BuyVirtualSheet
        visible={buyVisible}
        amount={amount}
        onChangeAmount={setAmount}
        onClose={() => setBuyVisible(false)}
        onContinue={onContinue}
      />

      <CardSuccessSheet
        visible={showSuccess}
        card={lastAddedCard || cards[0]}
        onDone={onDone}
      />

      <CardDetailsSheet
        visible={detailsVisible}
        card={isVirtual ? activeCard : physicalCard}
        onClose={() => setDetailsVisible(false)}
      />

      <LinkPhysicalSheet
        visible={linkVisible}
        onClose={() => setLinkVisible(false)}
        onContinue={(details) => {
          setLinkVisible(false);
          navigation.navigate('CardPin', {
            mode: 'physical',
            physicalDetails: details,
          });
        }}
      />

      <SetLimitSheet
        visible={limitVisible}
        onClose={() => setLimitVisible(false)}
        onSave={(limit) => {
          updatePhysicalCard({limit});
          setLimitVisible(false);
        }}
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

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: SLATE},
  hero: {
    backgroundColor: SLATE,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {width: 36, height: 36, borderRadius: 18},
  avatarText: {
    color: CORAL,
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: CORAL,
    borderColor: CORAL,
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  cardOverlay: {
    position: 'absolute',
    alignSelf: 'center',
  },
  cardWrap: {
    alignSelf: 'center',
    marginTop: 8,
  },
  emptyCard: {
    borderRadius: 18,
    padding: 20,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  emptyCardBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  activeCard: {
    borderRadius: 18,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 12,
  },
  activeCardTop: {gap: 4},
  activeCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  freezeOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(26,37,53,0.78)',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBalanceLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontFamily: SANS,
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  cardDigits: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: SANS,
  },
  mastercard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mcCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  mcRed: {
    backgroundColor: '#EB001B',
    marginRight: -10,
  },
  mcYellow: {
    backgroundColor: '#F79E1B',
    opacity: 0.9,
  },
  body: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  bodyContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 120,
  },
  bodyContentEmpty: {
    paddingTop: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 8,
    marginTop: 32,
  },
  emptySub: {
    color: GRAY,
    fontSize: 13,
    fontFamily: SANS,
    marginBottom: 28,
    textAlign: 'center',
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 48,
    marginTop: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  cardDetail: {
    paddingTop: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF1EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: DARK,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: SANS,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
  txn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  txnIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txnCopy: {flex: 1},
  txnTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  txnDate: {
    color: GRAY,
    fontSize: 12,
    fontFamily: SANS,
    marginTop: 2,
  },
  txnAmount: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  txnCredit: {
    color: GREEN,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DARK,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
});
