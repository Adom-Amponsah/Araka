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
    alignItems: 'center',
  },
  dragHandle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E6EBF1',
    marginBottom: 16,
  },
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
