import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {
  AppNotification,
  NotificationFilter,
  NotificationService,
  NotificationTone,
  useNotificationStore,
} from '../store/notificationStore';

const CORAL = '#F27649';
const SLATE = '#3D4A5C';
const DARK = '#1A2535';
const OFF = '#F4F6FA';
const GREEN = '#10B981';
const RED = '#EF4444';
const SANS = getSystemFont();
const {height} = Dimensions.get('window');
const CARD_RADIUS = 36;

const FILTERS: Array<{id: NotificationFilter; label: string}> = [
  {id: 'all', label: 'All'},
  {id: 'unread', label: 'Unread'},
  {id: 'transfer', label: 'Transfer'},
  {id: 'airtime', label: 'Airtime'},
];

const serviceTheme: Record<NotificationService, {icon: string; color: string; bg: string; label: string}> = {
  transfer: {
    icon: 'paper-plane-outline',
    color: GREEN,
    bg: '#EAFBF3',
    label: 'Transfer',
  },
  airtime: {
    icon: 'phone-portrait-outline',
    color: CORAL,
    bg: '#FEEDE6',
    label: 'Airtime',
  },
};

const toneIcon: Record<NotificationTone, string> = {
  success: 'checkmark-circle-outline',
  failed: 'alert-circle-outline',
};

const toneColor: Record<NotificationTone, string> = {
  success: GREEN,
  failed: RED,
};

const useEntrance = (delay: number, distance = 24) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(distance)).current;

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 16,
          stiffness: 190,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, opacity, translateY]);

  return {opacity, transform: [{translateY}]};
};

function FilterPill({
  filter,
  active,
  onPress,
}: {
  filter: {id: NotificationFilter; label: string};
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[fp.pill, active && fp.pillActive]}>
      <Text style={[fp.label, active && fp.labelActive]}>{filter.label}</Text>
    </Pressable>
  );
}

function NotificationRow({
  item,
  index,
  onPress,
}: {
  item: AppNotification;
  index: number;
  onPress: () => void;
}) {
  const animStyle = useEntrance(220 + index * 45, 18);
  const scale = React.useRef(new Animated.Value(1)).current;
  const theme = serviceTheme[item.service];
  const statusColor = toneColor[item.tone];
  const statusLabel = item.tone === 'success' ? 'Successful' : 'Failed';

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      damping: 16,
      stiffness: 260,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 12,
      stiffness: 220,
    }).start();

  return (
    <Animated.View style={[animStyle, {transform: [...animStyle.transform, {scale}]}]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={row.card}>
        <View style={[row.iconWrap, {backgroundColor: theme.bg}]}>
          <Ionicons name={theme.icon as any} size={20} color={theme.color} />
          <View style={[row.toneBadge, {backgroundColor: statusColor}]}>
            <Ionicons name={toneIcon[item.tone] as any} size={10} color="#FFFFFF" />
          </View>
        </View>

        <View style={row.content}>
          <View style={row.headerLine}>
            <View style={row.serviceLine}>
              {item.unread && <View style={row.unreadDot} />}
              <Text style={row.service}>{theme.label}</Text>
            </View>
            <Text style={row.meta}>{item.meta}</Text>
          </View>

          <Text style={row.title} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={row.footer}>
            <View style={row.footerLeft}>
              <View style={[row.statusPill, {backgroundColor: `${statusColor}12`}]}>
                <Ionicons name={toneIcon[item.tone] as any} size={12} color={statusColor} />
                <Text style={[row.statusText, {color: statusColor}]}>{statusLabel}</Text>
              </View>
              {item.amount && (
                <View style={row.amountPill}>
                  <Text style={row.amount}>{item.amount}</Text>
                </View>
              )}
            </View>
            <Text style={row.timestamp}>{item.timestamp}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function NotificationDetailSheet({
  notification,
  visible,
  onClose,
}: {
  notification: AppNotification | null;
  visible: boolean;
  onClose: () => void;
}) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 260,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdropAnim, slideAnim, visible]);

  if (!notification) {
    return null;
  }

  const theme = serviceTheme[notification.service];
  const statusColor = toneColor[notification.tone];
  const statusLabel = notification.tone === 'success' ? 'Successful' : 'Failed';
  const dateLabel = notification.meta;
  const timeLabel = notification.timestamp;

  const DetailRow = ({label, value}: {label: string; value: string}) => (
    <View style={sheet.row}>
      <Text style={sheet.rowLabel}>{label}</Text>
      <Text style={sheet.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[sheet.backdrop, {opacity: backdropAnim}]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          sheet.sheet,
          {
            transform: [{translateY: slideAnim}],
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}>
        <View style={sheet.handle} />

        <View style={sheet.hero}>
          <View style={[sheet.bigIcon, {backgroundColor: theme.bg}]}>
            <Ionicons name={theme.icon as any} size={28} color={theme.color} />
          </View>
          <Text style={sheet.service}>{theme.label}</Text>
          <Text style={sheet.title}>{notification.title}</Text>
          {notification.amount && <Text style={sheet.amount}>{notification.amount}</Text>}
          <View style={[sheet.statusBadge, {backgroundColor: `${statusColor}12`}]}>
            <Ionicons name={toneIcon[notification.tone] as any} size={13} color={statusColor} />
            <Text style={[sheet.statusText, {color: statusColor}]}>{statusLabel}</Text>
          </View>
        </View>

        <View style={sheet.divider}>
          <View style={sheet.dividerLine} />
          <Text style={sheet.dividerLabel}>DETAILS</Text>
          <View style={sheet.dividerLine} />
        </View>

        <View style={sheet.rows}>
          <DetailRow label="Date" value={dateLabel} />
          <DetailRow label="Time" value={timeLabel} />
          <DetailRow label="Type" value={theme.label} />
          <DetailRow label="Reference" value={notification.id.toUpperCase()} />
        </View>

        <Pressable onPress={onClose} style={sheet.closeBtn}>
          <Text style={sheet.closeBtnText}>Close</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

function EmptyState() {
  return (
    <View style={empty.wrap}>
      <View style={empty.icon}>
        <Ionicons name="notifications-off-outline" size={26} color={CORAL} />
      </View>
      <Text style={empty.title}>Nothing here yet</Text>
      <Text style={empty.body}>Transfer and airtime updates will appear here as they happen.</Text>
    </View>
  );
}

export function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const notifications = useNotificationStore(state => state.notifications);
  const activeFilter = useNotificationStore(state => state.activeFilter);
  const setFilter = useNotificationStore(state => state.setFilter);
  const markAllAsRead = useNotificationStore(state => state.markAllAsRead);
  const markAsRead = useNotificationStore(state => state.markAsRead);
  const [selectedNotification, setSelectedNotification] =
    React.useState<AppNotification | null>(null);
  const [detailVisible, setDetailVisible] = React.useState(false);

  const heroAnim = useEntrance(40, -14);
  const visibleNotifications = notifications.filter(
    item => item.tone === 'success' || item.tone === 'failed',
  );
  const list =
    activeFilter === 'all'
      ? visibleNotifications
      : activeFilter === 'unread'
        ? visibleNotifications.filter(item => item.unread)
        : visibleNotifications.filter(item => item.service === activeFilter);

  const openNotification = (item: AppNotification) => {
    setSelectedNotification(item);
    setDetailVisible(true);
    markAsRead(item.id);
  };

  const closeNotification = () => {
    setDetailVisible(false);
  };

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces
        style={s.scroll}
        contentContainerStyle={s.scrollContent}>
        <View style={[s.hero, {paddingTop: Math.max(insets.top, 20) + 8}]}>
          <View style={s.ringOuter} />
          <View style={s.ringInner} />

          <Animated.View style={[s.topBar, heroAnim]}>
            <Pressable hitSlop={10} onPress={() => navigation.goBack()} style={s.navButton}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Pressable hitSlop={10} onPress={markAllAsRead} style={s.markButton}>
              <Ionicons name="checkmark-done-outline" size={15} color={CORAL} />
              <Text style={s.markText}>Mark read</Text>
            </Pressable>
          </Animated.View>
        </View>

        <View style={s.curveShadow} />

        <View style={[s.canvas, {minHeight: height - Math.max(insets.top, 20)}]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={s.filterScroll}
            contentContainerStyle={s.filters}>
            {FILTERS.map(filter => (
              <FilterPill
                key={filter.id}
                filter={filter}
                active={filter.id === activeFilter}
                onPress={() => setFilter(filter.id)}
              />
            ))}
          </ScrollView>

          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Latest activity</Text>
            <Text style={s.sectionMeta}>{list.length} updates</Text>
          </View>

          {list.length === 0 ? (
            <EmptyState />
          ) : (
            <View style={s.list}>
              {list.map((item, index) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  index={index}
                  onPress={() => openNotification(item)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <NotificationDetailSheet
        notification={selectedNotification}
        visible={detailVisible}
        onClose={closeNotification}
      />
    </View>
  );
}

const fp = StyleSheet.create({
  pill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7ECF2',
    borderRadius: 22,
    height: 42,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: CORAL,
    borderColor: CORAL,
  },
  label: {
    color: '#7B8491',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  labelActive: {
    color: '#FFFFFF',
  },
});

const row = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232,237,242,0.85)',
    padding: 14,
    gap: 12,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.055,
    shadowRadius: 8,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  toneBadge: {
    position: 'absolute',
    right: -3,
    bottom: -3,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  headerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },
  serviceLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: CORAL,
  },
  service: {
    color: CORAL,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  meta: {
    color: '#A1AAB7',
    fontSize: 11,
    fontFamily: SANS,
  },
  title: {
    color: DARK,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: getSystemFont('medium'),
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  amountPill: {
    backgroundColor: OFF,
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  amount: {
    color: DARK,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  timestamp: {
    color: '#A1AAB7',
    fontSize: 11,
    fontFamily: SANS,
  },
});

const sheet = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26,37,53,0.72)',
    zIndex: 9999,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 14,
    minHeight: height * 0.56,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: -12},
    shadowOpacity: 0.20,
    shadowRadius: 28,
    elevation: 24,
    zIndex: 10000,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D9E0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  bigIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: DARK,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  service: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: SANS,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: DARK,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  amount: {
    color: DARK,
    fontSize: 34,
    fontWeight: '700',
    fontFamily: getSystemFont('condensed'),
    letterSpacing: -1,
    lineHeight: 38,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F3F7',
  },
  dividerLabel: {
    color: '#C4CDD8',
    fontSize: 10,
    fontFamily: getSystemFont('bold'),
    fontWeight: '700',
    letterSpacing: 2,
  },
  rows: {
    gap: 0,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F4F6FA',
  },
  rowLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: SANS,
  },
  rowValue: {
    color: DARK,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: getSystemFont('medium'),
    maxWidth: '58%',
    textAlign: 'right',
  },
  closeBtn: {
    paddingVertical: 13,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: getSystemFont('medium'),
    fontWeight: '600',
  },
});

const empty = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 54,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#FEEDE6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 6,
  },
  body: {
    color: '#8A94A6',
    fontSize: 13,
    fontFamily: SANS,
    lineHeight: 19,
    textAlign: 'center',
  },
});

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CORAL,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: OFF,
  },
  hero: {
    backgroundColor: CORAL,
    paddingHorizontal: 24,
    paddingBottom: 56,
    overflow: 'hidden',
  },
  ringOuter: {
    position: 'absolute',
    top: -32,
    right: -54,
    width: 196,
    height: 196,
    borderRadius: 98,
    borderWidth: 32,
    borderColor: 'rgba(61,74,92,0.15)',
  },
  ringInner: {
    position: 'absolute',
    top: 26,
    right: 16,
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1.5,
    borderColor: 'rgba(61,74,92,0.3)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  markText: {
    color: CORAL,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
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
    shadowOpacity: 0.20,
    shadowRadius: 28,
    elevation: 22,
  },
  canvas: {
    flex: 1,
    backgroundColor: OFF,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    marginTop: -CARD_RADIUS,
    paddingTop: 18,
    paddingBottom: 72,
  },
  filterScroll: {
    flexGrow: 0,
    height: 46,
    maxHeight: 46,
  },
  filters: {
    paddingHorizontal: 24,
    gap: 8,
    paddingRight: 32,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 26,
    marginBottom: 16,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: getSystemFont('medium'),
    letterSpacing: -0.4,
  },
  sectionMeta: {
    color: '#8A94A6',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: getSystemFont('medium'),
  },
  list: {
    paddingHorizontal: 24,
    gap: 10,
  },
});
