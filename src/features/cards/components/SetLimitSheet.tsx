import * as React from 'react';
import {
  Text,
  TextInput,
  View,
  Pressable,
  StyleSheet,
} from 'react-native';
import {BottomSheet} from '../../wallet/flows/components/BottomSheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';


const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const SANS = getSystemFont();

type SetLimitSheetProps = {
  visible: boolean;
  limit: number;
  onClose: () => void;
  onSave: (limit: number) => void;
};

export function SetLimitSheet({visible, onClose, onSave}: Omit<SetLimitSheetProps, 'limit'>) {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    if (visible) {
      setValue('');
    }
  }, [visible]);

  const numeric = parseFloat(value) || 0;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <View style={styles.header}>
            <View>
              <Text style={styles.title}>Set limit</Text>
              <Text style={styles.subtitle}>Define the limit of your physical card</Text>
            </View>
          </View>

          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="cash-outline" size={18} color={CORAL} />
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              placeholder="0.00"
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

          <Pressable
            onPress={() => onSave(numeric)}
            disabled={numeric <= 0}
            style={[styles.cta, numeric <= 0 && styles.ctaDisabled]}>
        <Text style={styles.ctaText}>Save</Text>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 24,
    gap: 12,
  },
  input: {
    flex: 1,
    color: DARK,
    fontSize: 15,
    fontFamily: SANS,
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
