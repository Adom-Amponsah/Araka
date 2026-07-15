import * as React from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import type {MenuStackParamList} from '@features/menu/navigation/MenuNavigator';
import {getSystemFont} from '@styles/typography';
import {useAppStore} from '@shared/store/appStore';

const {width} = Dimensions.get('window');

const CORAL = '#F27649';
const DARK = '#0D131A';
const SANS = getSystemFont();

type MenuItem = {
  label: string;
  caption?: string;
  icon: string;
  screen: keyof MenuStackParamList;
};

const MENU_ITEMS: MenuItem[] = [
  {label: 'QR Code', icon: 'grid-outline', screen: 'QRCode'},
  {label: 'Invoices', icon: 'document-text-outline', screen: 'Invoices'},
  {label: 'Language', icon: 'language-outline', screen: 'LanguageSettings'},
  {label: 'Report a problem', icon: 'alert-circle-outline', screen: 'ReportProblem'},
  {label: 'Rate the App', icon: 'star-outline', screen: 'RateApp'},
  {label: 'FAQ', icon: 'help-circle-outline', screen: 'FAQ'},
  {label: 'Contact ProxyPay', icon: 'chatbubble-ellipses-outline', screen: 'ContactProxyPay'},
  {label: 'Share the App', icon: 'share-outline', screen: 'ShareApp'},
  {label: 'Terms & Conditions', icon: 'document-text-outline', screen: 'Terms'},
  {label: 'Fees for all services', icon: 'information-circle-outline', screen: 'Fees'},
];

const getInitials = (name?: string, email?: string) => {
  const source = name?.trim() || email?.split('@')[0] || 'Araka User';
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

type BurgerMenuProps = {
  visible: boolean;
  onClose: () => void;
  name: string;
  email: string;
};

export function BurgerMenu({visible, onClose, name, email}: BurgerMenuProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const slideX = React.useRef(new Animated.Value(-width)).current;
  const backdrop = React.useRef(new Animated.Value(0)).current;
  const initials = getInitials(name, email);
  const userImage = useAppStore(state => state.user?.selfieUri);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideX, {
          toValue: 0,
          useNativeDriver: true,
          damping: 24,
          stiffness: 250,
        }),
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideX, {
          toValue: -width,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdrop, slideX, visible]);

  if (!visible) {
    return null;
  }

  const handleItemPress = (screen: keyof MenuStackParamList) => {
    onClose();
    requestAnimationFrame(() => {
      if (screen === 'QRCode') {
        navigation.navigate('Pay');
      } else {
        navigation.navigate('Menu', {screen});
      }
    });
  };

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, {opacity: backdrop}]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.panel,
          {
            paddingTop: Math.max(insets.top, 20) + 18,
            paddingBottom: Math.max(insets.bottom, 18),
            transform: [{translateX: slideX}],
          },
        ]}>
        <View style={styles.closeRow}>
          <View />
          <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
            <Ionicons name="close" size={17} color="#8A94A6" />
          </Pressable>
        </View>

        <View style={styles.profile}>
          <View style={styles.avatarOuter}>
            {userImage ? (
              <Image source={{uri: userImage}} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {email}
            </Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.items}>
            {MENU_ITEMS.map(item => (
              <Pressable
                key={item.label}
                onPress={() => handleItemPress(item.screen)}
                style={styles.item}>
                <View style={styles.itemIcon}>
                  <Ionicons name={item.icon as any} size={16} color={CORAL} />
                </View>
                <View style={styles.itemCopy}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C4CDD8" />
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(13,19,26,0.38)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: Math.min(width * 0.82, 340),
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: {width: 14, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 24,
  },
  closeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  brandMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CORAL,
  },
  brandText: {
    color: DARK,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: 3,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    marginBottom: 8,
  },
  avatarOuter: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFF3EE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
  },
  avatarFallback: {
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  profileCopy: {
    flex: 1,
  },
  name: {
    color: DARK,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  email: {
    color: '#8A94A6',
    fontSize: 12,
    fontFamily: SANS,
  },
  scroll: {
    flex: 0,
  },
  items: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 62,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 2,
    paddingVertical: 12,
  },
  itemIcon: {
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#FFF3EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCopy: {
    flex: 1,
    gap: 3,
  },
  itemLabel: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  itemCaption: {
    color: '#8A94A6',
    fontSize: 11,
    lineHeight: 15,
    fontFamily: SANS,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F6',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});
