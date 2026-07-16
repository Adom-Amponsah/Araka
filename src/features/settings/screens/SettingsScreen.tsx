import * as React from 'react';
import {
  Animated,
  Image,
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
import {MyEquityRibSheet} from '../components/MyEquityRibSheet';
import {useAppStore} from '@shared/store/appStore';
import {getSystemFont} from '@styles/typography';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

const HEADER_HEIGHT = 300;
const AVATAR_SIZE = 100;

const PROFILE_ITEMS = [
  {label: 'Personal Information', icon: 'person-outline' as const},
  {label: 'My Equity RIB', icon: 'document-text-outline' as const},
  {label: 'My QR', icon: 'qr-code-outline' as const},
  {label: 'My Beneficiaries', icon: 'pricetag-outline' as const},
];

const SECURITY_ITEMS = [
  {label: 'Change Password', icon: 'lock-closed-outline' as const},
  {label: 'Change PIN', icon: 'keypad-outline' as const},
];

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const user = useAppStore((state) => state.user);
  const unreadNotifications = useNotificationStore(selectUnreadCount);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [ribVisible, setRibVisible] = React.useState(false);
  const fade = React.useRef(new Animated.Value(0)).current;
  const slide = React.useRef(new Animated.Value(24)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {toValue: 1, duration: 300, useNativeDriver: true}),
      Animated.timing(slide, {toValue: 0, duration: 320, useNativeDriver: true}),
    ]).start();
  }, [fade, slide]);

  const displayName = user?.name || 'John Doe Mat';
  const phone = '+243 817 334 933';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('');

  const openNotifications = () => {
    navigation.getParent()?.navigate('Notifications');
  };

  const handleItemPress = (label: string) => {
    if (label === 'My Equity RIB') {
      setRibVisible(true);
    } else if (label === 'My QR') {
      navigation.getParent()?.navigate('MyQR');
    }
  };

  const logout = useAppStore((state) => state.logout);
  const handleLogout = () => {
    logout();
  };

  const renderItem = (item: {label: string; icon: string}) => (
    <Pressable key={item.label} onPress={() => handleItemPress(item.label)} style={styles.row}>
      <Ionicons name={item.icon as any} size={18} color={CORAL} />
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#C4CDD8" />
    </Pressable>
  );

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <View style={[styles.header, {height: HEADER_HEIGHT + insets.top, paddingTop: insets.top}]}>
          <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="settingsGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={CORAL} />
                <Stop offset="1" stopColor={CORAL} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#settingsGrad)" />
          </Svg>

          <View style={styles.topBar}>
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
          </View>

          <View style={styles.profile}>
            {user?.selfieUri ? (
              <Image source={{uri: user.selfieUri}} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.phone}>{phone}</Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.body,
            {opacity: fade, transform: [{translateY: slide}]},
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.bodyScroll}
            contentContainerStyle={[styles.bodyContent, {paddingBottom: Math.max(insets.bottom, 24)}]}>
            <View>
              <Text style={styles.sectionTitle}>Profile</Text>
              <View style={styles.section}>{PROFILE_ITEMS.map(renderItem)}</View>

              <Text style={styles.sectionTitle}>Security</Text>
              <View style={styles.section}>{SECURITY_ITEMS.map(renderItem)}</View>
            </View>

            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Log out</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>

      <BurgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        name={displayName}
        email={user?.email || ''}
      />

      <MyEquityRibSheet
        visible={ribVisible}
        onClose={() => setRibVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: CORAL,
  },
  header: {
    position: 'relative',
    justifyContent: 'flex-start',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  notificationBtn: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: CORAL,
    fontSize: 8,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  body: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -28,
    paddingTop: 16,
  },
  bodyScroll: {
    flex: 1,
  },
  bodyContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  profile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    // borderWidth: 4,
    // borderColor: '#FFFFFF',
    backgroundColor: '#F4F6FA',
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: CORAL,
    fontSize: 32,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginTop: 12,
  },
  phone: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: SANS,
    marginTop: 2,
  },
  sectionTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginTop: 24,
    marginBottom: 12,
  },
  section: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F3F7',
  },
  rowLabel: {
    flex: 1,
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});
