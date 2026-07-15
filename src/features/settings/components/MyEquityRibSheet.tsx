import * as React from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const {height} = Dimensions.get('window');
const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

type MyEquityRibSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const RIB_ROWS = [
  {label: 'Account Title', value: 'John Doe Mateo'},
  {label: 'Account Number', value: '13245 7632 6536 6333 333'},
  {label: 'Currency', value: 'USD'},
  {label: 'Agent Number', value: '25274'},
  {label: 'Branch', value: '929281'},
];

export function MyEquityRibSheet({visible, onClose}: MyEquityRibSheetProps) {
  const insets = useSafeAreaInsets();
  const slide = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [visible, slide]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent navigationBarTranslucent>
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 16) + 16,
              transform: [{translateY: slide}],
            },
          ]}>
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.title}>My RIB</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={GRAY} />
            </Pressable>
          </View>

          <View style={styles.logoCard}>
            <View style={styles.logoBox}>
              <Ionicons name="home" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.logoText}>
              <Text style={styles.logoTitle}>EQUITY</Text>
              <Text style={styles.logoSubtitle}>BCDC</Text>
            </View>
          </View>

          <Text style={styles.ribNumber}>28932 - 7921 - 712939839082982</Text>

          <View style={styles.divider} />

          <View style={styles.rows}>
            {RIB_ROWS.map((row, index) => (
              <View key={row.label} style={[styles.row, index !== 0 && styles.rowBorder]}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(13,19,26,0.35)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E1E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    color: DARK,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  closeBtn: {
    padding: 4,
  },
  logoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {},
  logoTitle: {
    color: DARK,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
  },
  logoSubtitle: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  ribNumber: {
    color: DARK,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F3F7',
    marginBottom: 16,
  },
  rows: {
    borderWidth: 1,
    borderColor: '#F0F3F7',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0F3F7',
  },
  rowLabel: {
    color: GRAY,
    fontSize: 14,
    fontFamily: SANS,
  },
  rowValue: {
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});
