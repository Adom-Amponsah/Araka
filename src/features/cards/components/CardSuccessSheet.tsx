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


const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

type CardSuccessSheetProps = {
  visible: boolean;
  card: Card | null;
  onDone: () => void;
};

export function CardSuccessSheet({visible, card, onDone}: CardSuccessSheetProps) {
  if (!card) return null;



  return (
    <BottomSheet visible={visible} onClose={onDone}>
      <View style={{alignItems: 'center'}}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={32} color="#22C55E" />
        </View>

          <Text style={styles.title}>
            {card.type === 'physical' ? 'Card linked Successfully' : 'Card added Successfully'}
          </Text>
          <Text style={styles.subtitle}>
            {card.type === 'physical'
              ? 'Your physical card has been successfully linked !'
              : 'Your virtual card has been successfully added !'}
          </Text>

          <View style={styles.cardRow}>
            <Text style={styles.network}>{card.network}</Text>
            <View style={styles.cardInfo}>
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={styles.cardDigits}>1232 XXXX XXXX {card.digits}</Text>
            </View>
          </View>

          <Pressable onPress={onDone} style={styles.cta}>
            <Text style={styles.ctaText}>Done</Text>
          </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#EDFBF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 6,
  },
  subtitle: {
    color: GRAY,
    fontSize: 12,
    fontFamily: SANS,
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    backgroundColor: '#F4F6FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  network: {
    color: '#B0BAC8',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    fontStyle: 'italic',
  },
  cardInfo: {
    flex: 1,
  },
  cardLabel: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    marginBottom: 2,
  },
  cardDigits: {
    color: GRAY,
    fontSize: 12,
    fontFamily: SANS,
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});
