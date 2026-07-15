import * as React from 'react';
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Modal,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppStore} from '@shared/store/appStore';
import {useForm, Controller} from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {getSystemFont} from '@styles/typography';

interface ProfileFormData {
  lastName: string;
  firstName: string;
  email: string;
  address?: string;
  dateOfBirth: string;
  cityOfBirth: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
}

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#6B7280';
const BORDER = '#E5E7EB';

function FormField({
  icon,
  value,
  onChange,
  placeholder,
  keyboardType,
  autoCapitalize,
  error,
}: {
  icon: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  keyboardType?: any;
  autoCapitalize?: any;
  error?: string;
}) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={fieldStyles.container}>
      <View
        style={[
          fieldStyles.field,
          focused && fieldStyles.fieldFocused,
          error && fieldStyles.fieldError,
        ]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={CORAL}
          style={fieldStyles.icon}
        />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'sentences'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={fieldStyles.input}
        />
      </View>
      {error && (
        <View style={fieldStyles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={fieldStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

function SelectField({
  icon,
  value,
  placeholder,
  options,
  onChange,
  error,
}: {
  icon: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  const [visible, setVisible] = React.useState(false);
  return (
    <View style={fieldStyles.container}>
      <Pressable
        onPress={() => setVisible(true)}
        style={[fieldStyles.field, error && fieldStyles.fieldError]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={CORAL}
          style={fieldStyles.icon}
        />
        <Text
          style={[fieldStyles.selectValue, !value && fieldStyles.placeholder]}
          numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#C4CDD8" />
      </Pressable>
      {error && (
        <View style={fieldStyles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <Text style={fieldStyles.errorText}>{error}</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <Pressable
          style={modalStyles.backdrop}
          onPress={() => setVisible(false)}>
          <View style={modalStyles.sheet} pointerEvents="box-none">
            <Text style={modalStyles.title}>{placeholder}</Text>
            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    onChange(option);
                    setVisible(false);
                  }}
                  style={modalStyles.option}>
                  <Text style={modalStyles.optionText}>{option}</Text>
                  {value === option && (
                    <Ionicons name="checkmark" size={18} color={CORAL} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function SignUpStep2Screen() {
  const completeProfileSetup = useAppStore((state) => state.completeProfileSetup);
  const startSignup = useAppStore((state) => state.startSignup);
  const insets = useSafeAreaInsets();

  const {control, handleSubmit, formState} = useForm<ProfileFormData>({
    mode: 'onChange',
  });
  const {errors} = formState;

  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>(
    new Date(2000, 0, 1),
  );

  const onSubmit = (data: ProfileFormData) => {
    console.log('Profile data:', data);
    completeProfileSetup({
      id: 'new-user',
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior="padding"
      enabled
      keyboardVerticalOffset={0}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#FFFFFF'}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        bounces={false}
        automaticallyAdjustKeyboardInsets={true}>
        <View
          style={[
            styles.header,
            {paddingTop: Math.max(insets.top, 20) + 24},
          ]}>
          <Pressable
            onPress={() => startSignup()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <Text style={styles.headline}>Create your account</Text>
          <Text style={styles.subline}>
            Fill in these fields to complete your account.
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="lastName"
            rules={{required: 'Last name is required'}}
            render={({field: {onChange, value}}) => (
              <FormField
                icon="person-outline"
                value={value || ''}
                onChange={onChange}
                placeholder="Last name"
                autoCapitalize="words"
                error={errors.lastName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="firstName"
            rules={{required: 'First name is required'}}
            render={({field: {onChange, value}}) => (
              <FormField
                icon="person-outline"
                value={value || ''}
                onChange={onChange}
                placeholder="First name"
                autoCapitalize="words"
                error={errors.firstName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({field: {onChange, value}}) => (
              <FormField
                icon="mail-outline"
                value={value || ''}
                onChange={onChange}
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({field: {onChange, value}}) => (
              <FormField
                icon="location-outline"
                value={value || ''}
                onChange={onChange}
                placeholder="Address · Optional"
                autoCapitalize="sentences"
                error={errors.address?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="dateOfBirth"
            rules={{required: 'Date of birth is required'}}
            render={({field: {onChange, value}}) => (
              <View style={{marginBottom: 12}}>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    fieldStyles.field,
                    errors.dateOfBirth && fieldStyles.fieldError,
                  ]}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={CORAL}
                    style={fieldStyles.icon}
                  />
                  <Text
                    style={[
                      fieldStyles.selectValue,
                      !value && fieldStyles.placeholder,
                    ]}>
                    {value || 'Date of Birth'}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#C4CDD8" />
                </Pressable>
                {errors.dateOfBirth && (
                  <View style={fieldStyles.errorRow}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={13}
                      color="#EF4444"
                    />
                    <Text style={fieldStyles.errorText}>
                      {errors.dateOfBirth.message}
                    </Text>
                  </View>
                )}
                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    maximumDate={new Date()}
                    onChange={(event, date) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (date) {
                        setSelectedDate(date);
                        onChange(date.toLocaleDateString('en-GB'));
                      }
                    }}
                  />
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="cityOfBirth"
            rules={{required: 'City of birth is required'}}
            render={({field: {onChange, value}}) => (
              <SelectField
                icon="business-outline"
                value={value || ''}
                placeholder="City of Birth"
                options={[
                  'Kinshasa',
                  'Lubumbashi',
                  'Goma',
                  'Bukavu',
                  'Kananga',
                  'Kisangani',
                  'Mbuji-Mayi',
                  'Matadi',
                ]}
                onChange={onChange}
                error={errors.cityOfBirth?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            rules={{required: 'Gender is required'}}
            render={({field: {onChange, value}}) => (
              <SelectField
                icon="male-female-outline"
                value={value || ''}
                placeholder="Gender"
                options={['Male', 'Female', 'Other']}
                onChange={onChange}
                error={errors.gender?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="nationality"
            rules={{required: 'Nationality is required'}}
            render={({field: {onChange, value}}) => (
              <SelectField
                icon="globe-outline"
                value={value || ''}
                placeholder="Nationality"
                options={[
                  'Congolese (DRC)',
                  'Congolese (ROC)',
                  'Rwandan',
                  'Burundian',
                  'Ugandan',
                  'Other',
                ]}
                onChange={onChange}
                error={errors.nationality?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="idType"
            rules={{required: 'ID type is required'}}
            render={({field: {onChange, value}}) => (
              <SelectField
                icon="card-outline"
                value={value || ''}
                placeholder="ID Type"
                options={['National ID', 'Passport', "Driver's License"]}
                onChange={onChange}
                error={errors.idType?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="idNumber"
            rules={{required: 'ID number is required'}}
            render={({field: {onChange, value}}) => (
              <FormField
                icon="card-outline"
                value={value || ''}
                onChange={onChange}
                placeholder="ID Number"
                autoCapitalize="characters"
                error={errors.idNumber?.message}
              />
            )}
          />

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={!formState.isValid}
            style={({pressed}) => [
              styles.ctaButton,
              !formState.isValid && styles.ctaDisabled,
              pressed && formState.isValid && styles.ctaPressed,
            ]}>
            <Text style={styles.ctaText}>Next</Text>
          </Pressable>

          <View style={{height: Math.max(insets.bottom, 24)}} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#FFFFFF'},
  scroll: {flex: 1},

  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  headline: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '700',
    fontFamily: getSystemFont('medium'),
    marginBottom: 8,
  },
  subline: {
    color: GRAY,
    fontSize: 14,
    fontFamily: getSystemFont(),
  },

  form: {
    flex: 1,
    paddingHorizontal: 24,
  },

  ctaButton: {
    backgroundColor: CORAL,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  ctaDisabled: {
    backgroundColor: '#E5E7EB',
  },
  ctaPressed: {
    opacity: 0.95,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: getSystemFont(),
    letterSpacing: 0.5,
  },
});

const fieldStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  fieldFocused: {
    borderColor: CORAL,
  },
  fieldError: {
    borderColor: '#EF4444',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: DARK,
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
    padding: 0,
  },
  selectValue: {
    flex: 1,
    fontSize: 16,
    color: DARK,
    fontFamily: getSystemFont(),
    letterSpacing: 0.3,
  },
  placeholder: {
    color: '#9CA3AF',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: getSystemFont(),
  },
});

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    maxHeight: '55%',
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: getSystemFont('bold'),
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionText: {
    color: DARK,
    fontSize: 16,
    fontFamily: getSystemFont(),
  },
});
