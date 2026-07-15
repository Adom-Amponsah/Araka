import * as React from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

type LinkPhysicalSheetProps = {
  visible: boolean;
  onClose: () => void;
  onContinue: (details: {cardNumber: string; expiry: string; cardId: string}) => void;
};

function formatCardNumber(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g) || [];
  return groups.join(' ');
}

function formatExpiry(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

export function LinkPhysicalSheet({visible, onClose, onContinue}: LinkPhysicalSheetProps) {
  const insets = useSafeAreaInsets();
  const slide = React.useRef(new Animated.Value(height)).current;
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cardId, setCardId] = React.useState('');

  React.useEffect(() => {
    Animated.spring(slide, {
      toValue: visible ? 0 : height,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [visible, slide]);

  React.useEffect(() => {
    if (!visible) {
      setCardNumber('');
      setExpiry('');
      setCardId('');
    }
  }, [visible]);

  const valid = cardNumber.length >= 19 && expiry.length === 5 && cardId.length > 0;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent navigationBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}
        keyboardVerticalOffset={0}>
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
            <View>
              <Text style={styles.title}>Link a physical card</Text>
              <Text style={styles.subtitle}>Have your card handy</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={GRAY} />
            </Pressable>
          </View>

          <Text style={styles.label}>Card Number</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.network}>VISA</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              placeholder="1235 XXXX XXXX 2437"
              placeholderTextColor="#C4CDD8"
              keyboardType="numeric"
              autoFocus={visible}
              returnKeyType="done"
            />
          </View>

          <Text style={styles.label}>Expiry date</Text>
          <View style={[styles.inputWrap, styles.inputSmall]}>
            <Ionicons name="calendar-outline" size={18} color={CORAL} />
            <TextInput
              style={styles.input}
              value={expiry}
              onChangeText={(text) => setExpiry(formatExpiry(text))}
              placeholder="01/37"
              placeholderTextColor="#C4CDD8"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <Text style={styles.label}>Card ID · on the back</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="card-outline" size={18} color={CORAL} />
            <TextInput
              style={styles.input}
              value={cardId}
              onChangeText={(text) => setCardId(text.replace(/\D/g, '').slice(0, 16))}
              placeholder="X X X X X X X X X X X X X"
              placeholderTextColor="#C4CDD8"
              keyboardType="numeric"
              returnKeyType="done"
            />
          </View>

          <Pressable
            onPress={() => onContinue({cardNumber, expiry, cardId})}
            disabled={!valid}
            style={[styles.cta, !valid && styles.ctaDisabled]}>
            <Text style={styles.ctaText}>Save</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.notNow}>
            <Text style={styles.notNowText}>Not now</Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
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
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    color: DARK,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 4,
  },
  subtitle: {
    color: GRAY,
    fontSize: 13,
    fontFamily: SANS,
  },
  closeBtn: {
    padding: 4,
  },
  label: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EBF1',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    gap: 12,
  },
  inputSmall: {
    width: 140,
  },
  network: {
    color: '#B0BAC8',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    fontStyle: 'italic',
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontFamily: SANS,
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  notNow: {
    alignItems: 'center',
  },
  notNowText: {
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
});
