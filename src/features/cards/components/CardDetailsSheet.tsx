import * as React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import {BottomSheet} from '../../wallet/flows/components/BottomSheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import type {Card} from '../store/cardsStore';


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


  if (!card) return null;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
            <Text style={styles.title}>Card Details</Text>
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
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
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
