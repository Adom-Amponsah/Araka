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
import type {Card} from '../store/cardsStore';

const {height} = Dimensions.get('window');
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

type CardDetailsSheetProps = {
  visible: boolean;
  card: Card | null;
  onClose: () => void;
};

const ROWS: {label: string; key: keyof Card; prefix?: string}[] = [
  {label: 'Card number', key: 'cardNumber'},
  {label: 'Card holder name', key: 'holderName'},
  {label: 'Expiry date', key: 'expiry'},
  {label: 'CVV', key: 'cvv'},
  {label: 'Limit', key: 'limit', prefix: '$'},
  {label: 'PIN', key: 'pin'},
];

export function CardDetailsSheet({visible, card, onClose}: CardDetailsSheetProps) {
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

  if (!card) return null;

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
            <Text style={styles.title}>Card Details</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={GRAY} />
            </Pressable>
          </View>

          <View style={styles.table}>
            {ROWS.map((row, index) => {
              const value = card[row.key];
              const displayValue = row.prefix ? `${row.prefix}${value}` : `${value}`;
              const isLast = index === ROWS.length - 1;
              return (
                <View key={row.label} style={[styles.row, isLast && styles.rowLast]}>
                  <Text style={styles.label}>{row.label}</Text>
                  <Text style={styles.value}>{displayValue}</Text>
                </View>
              );
            })}
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
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6EBF1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  table: {
    borderWidth: 1,
    borderColor: '#E6EBF1',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EBF1',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    color: GRAY,
    fontSize: 14,
    fontFamily: SANS,
  },
  value: {
    color: DARK,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});
