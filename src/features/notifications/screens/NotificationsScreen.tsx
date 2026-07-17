import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const LIGHT_GRAY = '#F3F4F6';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

const TABS = ['All', 'Payments', 'ARAKA', 'Recommendations'];

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'New services recommended for you',
    body: 'Discover new services you might like.',
    action: 'Discover',
    time: '2h ago',
    icon: 'sparkles-outline',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Vodacom invoice available',
    body: 'Your invoice for your mobile top up is ready.',
    time: '3h ago',
    icon: 'receipt-outline',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Payment successful',
    body: 'Your payment of €120 has been processed.',
    time: 'Yesterday',
    icon: 'checkmark-circle-outline',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Recommended for you',
    body: "We couldn't process your payment. Please update your payment method.",
    time: '2d ago',
    icon: 'alert-circle-outline',
    unread: false,
  },
  {
    id: 'n5',
    title: 'Update available',
    body: 'A new version of the app is ready to download.',
    action: 'Update app',
    time: 'March 29',
    icon: 'notifications-outline',
    unread: false,
  },
  {
    id: 'n6',
    title: 'Special offer',
    body: 'Get 20% off your next service this week.',
    action: 'Use discount',
    time: 'March 14',
    icon: 'pricetag-outline',
    unread: false,
  },
  {
    id: 'n7',
    title: 'Payment successful',
    body: 'Your payment of €45 has been processed.',
    time: 'Mar 12',
    icon: 'checkmark-circle-outline',
    unread: false,
  },
];

export function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = React.useState('All');

  return (
    <View style={[s.root, {paddingTop: Math.max(insets.top, 20)}]}>
      <View style={s.header}>
        <Pressable hitSlop={10} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={DARK} />
        </Pressable>
        <Text style={s.headerTitle}>Notifications</Text>
      </View>

      <Pressable style={s.markReadRow}>
        <Ionicons name="mail-outline" size={18} color={CORAL} />
        <Text style={s.markReadText}>Mark all as read</Text>
      </Pressable>

      <View style={s.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabs}>
          {TABS.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <Pressable
                key={tab}
                style={[s.tabItem, isActive && s.tabItemActive]}
                onPress={() => setActiveTab(tab)}>
                <Text style={[s.tabText, isActive && s.tabTextActive]}>{tab}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={s.tabBorder} />
      </View>

      <ScrollView style={s.list} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: Math.max(insets.bottom, 24)}}>
        {NOTIFICATIONS.map((item) => (
          <View key={item.id} style={[s.row, item.unread && s.rowUnread]}>
            <View style={s.iconArea}>
              <View style={s.iconCircle}>
                <Ionicons name={item.icon as any} size={20} color={CORAL} />
              </View>
              {item.unread && <View style={s.unreadDot} />}
            </View>
            <View style={s.content}>
              <Text style={s.title}>{item.title}</Text>
              <Text style={s.body}>{item.body}</Text>
              {item.action && (
                <Pressable style={s.actionBtn}>
                  <Text style={s.actionBtnText}>{item.action}</Text>
                </Pressable>
              )}
              <Text style={s.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: BOLD,
    color: DARK,
  },
  markReadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 20,
  },
  markReadText: {
    fontSize: 15,
    fontFamily: SANS,
    color: CORAL,
  },
  tabsWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  tabs: {
    paddingHorizontal: 24,
    gap: 24,
  },
  tabItem: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    zIndex: 1,
  },
  tabItemActive: {
    borderBottomColor: CORAL,
  },
  tabText: {
    fontSize: 15,
    fontFamily: SANS,
    color: GRAY,
  },
  tabTextActive: {
    color: CORAL,
    fontWeight: '700',
    fontFamily: BOLD,
  },
  tabBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F0F3F7',
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3F7',
    gap: 16,
  },
  rowUnread: {
    backgroundColor: '#F9FAFB', // very light grey
  },
  iconArea: {
    position: 'relative',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F2', // light coral
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#84CC16', // green
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: BOLD,
    color: DARK,
  },
  body: {
    fontSize: 14,
    fontFamily: SANS,
    color: GRAY,
    lineHeight: 20,
    marginBottom: 2,
  },
  actionBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#DC8863', // coral-ish, wait image shows a slightly softer coral, we use CORAL
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: BOLD,
    color: '#FFFFFF',
  },
  time: {
    fontSize: 12,
    fontFamily: SANS,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
