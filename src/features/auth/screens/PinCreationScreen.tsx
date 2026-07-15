import * as React from 'react';
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

const CORAL = '#D96B45';

export function PinCreationScreen() {
  const insets = useSafeAreaInsets();
  const completePinCreation = useAppStore((state) => state.completePinCreation);
  const backToSelfie = useAppStore((state) => state.backToSelfie);
  const [pin, setPin] = React.useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    console.log('PIN created:', pin.join(''));
    completePinCreation(pin.join(''));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, {paddingTop: insets.top}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable onPress={backToSelfie} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Create your PIN</Text>
        <Text style={styles.subtitle}>It must be 4 digits</Text>

        <View style={styles.pinContainer}>
          {pin.map((digit, index) => {
            const filled = digit !== '';
            const focused = focusedIndex === index;
            return (
              <View
                key={index}
                style={[
                  styles.pinBox,
                  (filled || focused) && styles.pinBoxActive,
                ]}>
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  secureTextEntry
                  style={styles.pinInput}
                  autoFocus={index === 0}
                />
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={pin.join('').length !== 4}
          style={[
            styles.ctaButton,
            pin.join('').length !== 4 && styles.ctaButtonDisabled,
          ]}>
          <Text style={styles.ctaButtonText}>Continue</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 16,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    color: '#111827',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    fontFamily: getSystemFont(),
    textAlign: 'center',
    marginBottom: 48,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 48,
  },
  pinBox: {
    width: 58,
    height: 58,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBoxActive: {
    borderColor: CORAL,
  },
  pinInput: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    textAlign: 'center',
    color: '#111827',
    width: '100%',
  },
  ctaButton: {
    backgroundColor: CORAL,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  ctaButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: getSystemFont('bold'),
    fontSize: 17,
  },
});
