import * as React from 'react';
import {View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import {useForm, Controller} from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SignUpStep2FormData {
  dateOfBirth: string;
  gender: string;
  address: string;
  country: string;
  city: string;
}

export function SignUpStep2Screen() {
  const completeProfile = useAppStore((state) => state.completeProfile);
  const verifyOtp = useAppStore((state) => state.verifyOtp);
  const insets = useSafeAreaInsets();
  const {control, handleSubmit, formState: {errors}} = useForm<SignUpStep2FormData>({mode: 'onSubmit'});

  const onSubmit = (data: SignUpStep2FormData) => {
    console.log('Profile data:', data);
    // TODO: Call API to complete profile
    // completeProfile(user, token);
  };

  return (
    <KeyboardAvoidingView style={[styles.container, {paddingTop: insets.top}]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => verifyOtp()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Fill in these fields to complete your account.</Text>

          <View style={styles.inputContainer}>
            <Controller control={control} name="dateOfBirth" rules={{required: 'Date of birth is required'}} render={({field: {onChange, value}}) => (
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Ionicons name="calendar-outline" size={20} color="#F27649" /></View>
                <TextInput value={value} onChangeText={onChange} placeholder="Date of Birth (DD/MM/YYYY)" placeholderTextColor="#9CA3AF" style={styles.input} />
              </View>
            )} />
            {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth.message}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Controller control={control} name="gender" rules={{required: 'Gender is required'}} render={({field: {onChange, value}}) => (
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Ionicons name="people-outline" size={20} color="#F27649" /></View>
                <TextInput value={value} onChangeText={onChange} placeholder="Gender" placeholderTextColor="#9CA3AF" style={styles.input} />
              </View>
            )} />
            {errors.gender && <Text style={styles.errorText}>{errors.gender.message}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Controller control={control} name="address" rules={{required: 'Address is required'}} render={({field: {onChange, value}}) => (
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Ionicons name="location-outline" size={20} color="#F27649" /></View>
                <TextInput value={value} onChangeText={onChange} placeholder="Address" placeholderTextColor="#9CA3AF" style={styles.input} />
              </View>
            )} />
            {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Controller control={control} name="country" rules={{required: 'Country is required'}} render={({field: {onChange, value}}) => (
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Ionicons name="globe-outline" size={20} color="#F27649" /></View>
                <TextInput value={value} onChangeText={onChange} placeholder="Country" placeholderTextColor="#9CA3AF" style={styles.input} />
              </View>
            )} />
            {errors.country && <Text style={styles.errorText}>{errors.country.message}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Controller control={control} name="city" rules={{required: 'City is required'}} render={({field: {onChange, value}}) => (
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}><Ionicons name="business-outline" size={20} color="#F27649" /></View>
                <TextInput value={value} onChangeText={onChange} placeholder="City" placeholderTextColor="#9CA3AF" style={styles.input} />
              </View>
            )} />
            {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
          </View>

          <Pressable onPress={handleSubmit(onSubmit)} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  scrollView: {flex: 1},
  backButton: {padding: 16},
  content: {flex: 1, paddingHorizontal: 24, paddingTop: 16},
  title: {color: '#111827', fontSize: 30, fontWeight: 'bold', marginBottom: 8},
  subtitle: {color: '#6B7280', fontSize: 16, marginBottom: 32},
  inputContainer: {marginBottom: 16},
  inputWrapper: {position: 'relative'},
  inputIcon: {position: 'absolute', left: 16, top: 16, zIndex: 10},
  input: {backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 48, paddingVertical: 16, fontSize: 16, color: '#111827'},
  errorText: {color: '#EF4444', fontSize: 14, marginTop: 4, marginLeft: 4},
  completeButton: {backgroundColor: '#F27649', borderRadius: 12, paddingVertical: 16, marginTop: 16, marginBottom: 24, shadowColor: '#D97757', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4},
  completeButtonText: {color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', fontSize: 18},
});
