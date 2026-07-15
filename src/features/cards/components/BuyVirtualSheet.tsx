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

const PRESETS = [1, 5, 10, 20];

type BuyVirtualSheetProps = {
  visible: boolean;
  amount: string;
  onChangeAmount: (value: string) => void;
  onClose: () => void;
  onContinue: () => void;
};

export function BuyVirtualSheet({
  visible,
  amount,
  onChangeAmount,
  onClose,
  onContinue,
}: BuyVirtualSheetProps) {
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

  const numeric = parseFloat(amount) || 0;

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
              <Text style={styles.title}>Buy Virtual Card</Text>
              <Text style={styles.subtitle}>Enter the amount of the first deposit</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={GRAY} />
            </Pressable>
          </View>

          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="cash-outline" size={18} color={CORAL} />
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={onChangeAmount}
              placeholder="Enter amount"
              placeholderTextColor="#C4CDD8"
              keyboardType="numeric"
              autoFocus={visible}
              returnKeyType="done"
            />
            <View style={styles.currency}>
              <Text style={styles.currencyText}>USD</Text>
              <Ionicons name="chevron-down" size={14} color={GRAY} />
            </View>
          </View>

          <View style={styles.presets}>
            {PRESETS.map((p) => (
              <Pressable
                key={p}
                onPress={() => onChangeAmount(p.toString())}
                style={[styles.preset, amount === p.toString() && styles.presetActive]}>
                <Text style={[styles.presetText, amount === p.toString() && styles.presetTextActive]}>
                  ${p}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={onContinue}
            disabled={numeric <= 0}
            style={[styles.cta, numeric <= 0 && styles.ctaDisabled]}>
            <Text style={styles.ctaText}>Continue</Text>
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
    fontSize: 12,
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
    gap: 10,
    borderWidth: 1,
    borderColor: '#E6EBF1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 16,
    fontFamily: SANS,
    padding: 0,
  },
  currency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyText: {
    color: DARK,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  presets: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  preset: {
    borderWidth: 1,
    borderColor: '#FFE8DE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8F5',
  },
  presetActive: {
    backgroundColor: CORAL,
    borderColor: CORAL,
  },
  presetText: {
    color: CORAL,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  cta: {
    backgroundColor: CORAL,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
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
