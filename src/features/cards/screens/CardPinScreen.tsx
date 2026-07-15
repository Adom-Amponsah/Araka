import * as React from 'react';
import {
  Dimensions,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {useCardsStore} from '../store/cardsStore';

const {width} = Dimensions.get('window');
const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

export function CardPinScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const amount = parseFloat(route.params?.amount || '0') || 0;
  const mode = route.params?.mode === 'physical' ? 'physical' : 'virtual';
  const physicalDetails = route.params?.physicalDetails;
  const addVirtualCard = useCardsStore((s) => s.addVirtualCard);
  const linkPhysicalCard = useCardsStore((s) => s.linkPhysicalCard);
  const [pin, setPin] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);

  const complete = () => {
    if (pin.length < 4) return;
    Keyboard.dismiss();
    if (mode === 'physical' && physicalDetails) {
      linkPhysicalCard({
        cardNumber: physicalDetails.cardNumber,
        expiry: physicalDetails.expiry,
        cardId: physicalDetails.cardId,
        pin,
      });
    } else {
      addVirtualCard({
        id: `vc-${Date.now()}`,
        label: 'Visa Card',
        balance: amount,
        currency: 'USD',
        digits: '3682',
        expiry: '02/29',
        network: 'Visa',
        cardNumber: '1324 3747 3793 3682',
        holderName: 'Mia Lyam Smith',
        cvv: '132',
        limit: 100.5,
        pin,
        isFrozen: false,
      });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.topSpacer, {height: Math.max(insets.top, 12)}]} />
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={DARK} />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Enter your PIN</Text>
        <Text style={styles.subtitle}>To confirm your transaction</Text>

        <View style={styles.dots}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]}>
              {i < pin.length && <Text style={styles.asterisk}>*</Text>}
            </View>
          ))}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={pin}
            onChangeText={(text) => setPin(text.replace(/\D/g, '').slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            caretHidden
            autoFocus
            returnKeyType="done"
          />
        </View>

        <Pressable
          onPress={complete}
          disabled={pin.length < 4}
          style={[styles.cta, pin.length < 4 && styles.ctaDisabled]}>
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#FFFFFF'},
  topSpacer: {width: 1},
  back: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    color: DARK,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: getSystemFont('bold'),
    marginBottom: 8,
  },
  subtitle: {
    color: GRAY,
    fontSize: 14,
    fontFamily: SANS,
    marginBottom: 32,
  },
  dots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  dot: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6EBF1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotFilled: {
    borderColor: CORAL,
  },
  asterisk: {
    color: DARK,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: SANS,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 48,
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
});
