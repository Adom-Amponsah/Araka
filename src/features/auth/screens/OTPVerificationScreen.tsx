import * as React from 'react';
import {View, TextInput, Pressable, KeyboardAvoidingView, Platform, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';

export function OTPVerificationScreen() {
  const verifyOtp = useAppStore((state) => state.verifyOtp);
  const startSignup = useAppStore((state) => state.startSignup);
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = React.useState(['', '', '', '', '']);
  const inputRefs = React.useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const otpCode = otp.join('');
    console.log('OTP Code:', otpCode);
    verifyOtp();
  };

  const handleResend = () => {
    console.log('Resending OTP...');
    setOtp(['', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView style={[styles.container, {paddingTop: insets.top}]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable onPress={() => startSignup()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>Code sent to your email</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={styles.otpBox}>
              <TextInput
                ref={(ref) => {inputRefs.current[index] = ref;}}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                style={styles.otpInput}
                autoFocus={index === 0}
              />
            </View>
          ))}
        </View>

        <Pressable onPress={handleContinue} disabled={otp.join('').length !== 5} style={[styles.continueButton, otp.join('').length !== 5 && styles.continueButtonDisabled]}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </Pressable>

        <Pressable onPress={handleResend} style={styles.resendButton}>
          <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend</Text></Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  backButton: {padding: 16},
  content: {flex: 1, paddingHorizontal: 24, paddingTop: 32},
  title: {color: '#111827', fontSize: 30, fontWeight: 'bold', fontFamily: getSystemFont('bold'), marginBottom: 12},
  subtitle: {color: '#6B7280', fontSize: 16, fontFamily: getSystemFont(), marginBottom: 48},
  otpContainer: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32},
  otpBox: {width: 60, height: 60, borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center'},
  otpInput: {fontSize: 24, fontWeight: 'bold', fontFamily: getSystemFont('bold'), textAlign: 'center', color: '#111827', width: '100%'},
  continueButton: {backgroundColor: '#F27649', borderRadius: 12, paddingVertical: 16, marginBottom: 24, shadowColor: '#D97757', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4},
  continueButtonDisabled: {backgroundColor: '#D1D5DB', shadowOpacity: 0},
  continueButtonText: {color: '#FFFFFF', fontWeight: 'bold', fontFamily: getSystemFont('bold'), textAlign: 'center', fontSize: 18},
  resendButton: {alignItems: 'center'},
  resendText: {color: '#6B7280', fontSize: 14, fontFamily: getSystemFont()},
  resendLink: {color: '#F27649', fontWeight: '600', fontFamily: getSystemFont('medium')},
});
