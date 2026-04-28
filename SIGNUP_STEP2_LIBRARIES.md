# SignUpStep2 Required Libraries

## Overview
To complete the SignUpStep2Screen improvements, you need to install two React Native libraries for better UX:

1. **Date Picker** - For DOB field with calendar UI
2. **Country Picker** - For country selection with searchable list

---

## 1. Date Picker Installation

### Library: `@react-native-community/datetimepicker`

**Install:**
```bash
npm install @react-native-community/datetimepicker
```

**For iOS (if using CocoaPods):**
```bash
cd ios && pod install && cd ..
```

**Usage in SignUpStep2Screen:**

Replace the DOB FloatingInput with a date picker button:

```typescript
import DateTimePicker from '@react-native-community/datetimepicker';

// Add state for date picker
const [showDatePicker, setShowDatePicker] = React.useState(false);
const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);

// In the form, replace DOB FloatingInput with:
<Controller
  control={control}
  name="dateOfBirth"
  rules={{required: 'Date of birth is required'}}
  render={({field: {onChange, value}}) => (
    <>
      <Pressable 
        onPress={() => setShowDatePicker(true)}
        style={dobStyles.button}>
        <Ionicons name="calendar-outline" size={18} color={CORAL} />
        <Text style={dobStyles.text}>
          {value || 'Select Date of Birth'}
        </Text>
      </Pressable>
      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (date) {
              setSelectedDate(date);
              onChange(date.toLocaleDateString('en-GB')); // DD/MM/YYYY
            }
          }}
        />
      )}
    </>
  )}
/>
```

---

## 2. Country Picker Installation

### Library: `react-native-country-picker-modal`

**Install:**
```bash
npm install react-native-country-picker-modal
```

**Dependencies (also required):**
```bash
npm install react-native-modal
```

**Usage in SignUpStep2Screen:**

Replace the Country FloatingInput with a country picker:

```typescript
import CountryPicker, { Country } from 'react-native-country-picker-modal';

// Add state
const [countryCode, setCountryCode] = React.useState<string>('');
const [showCountryPicker, setShowCountryPicker] = React.useState(false);

// In the form, replace Country FloatingInput with:
<Controller
  control={control}
  name="country"
  rules={{required: 'Country is required'}}
  render={({field: {onChange, value}}) => (
    <>
      <Pressable 
        onPress={() => setShowCountryPicker(true)}
        style={countryStyles.button}>
        <Ionicons name="globe-outline" size={18} color={CORAL} />
        <Text style={countryStyles.text}>
          {value || 'Select Country'}
        </Text>
      </Pressable>
      
      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={(country: Country) => {
          onChange(country.name);
          setCountryCode(country.cca2);
          setShowCountryPicker(false);
        }}
        withFilter
        withFlag
        withCountryNameButton
        withAlphaFilter
        withCallingCode
      />
    </>
  )}
/>
```

---

## 3. Styling for Picker Buttons

Add these styles to match the FloatingInput design:

```typescript
const dobStyles = StyleSheet.create({
  button: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1.5,
    borderColor: '#E8EDF2',
    borderRadius: 14,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    fontFamily: SANS,
  },
});

const countryStyles = StyleSheet.create({
  button: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1.5,
    borderColor: '#E8EDF2',
    borderRadius: 14,
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    fontFamily: SANS,
  },
});
```

---

## Summary of Changes Made

✅ **Completed:**
1. ✅ Moved circular design from bottom-left to top-right
2. ✅ Removed accent bar (right border) from active inputs
3. ✅ Changed Complete button to orange (CORAL)
4. ✅ Added icons to gender selection chips
5. ✅ Fixed KeyboardAvoidingView with proper behavior and offset

📦 **Requires Installation:**
6. 📦 Date picker for DOB - Install `@react-native-community/datetimepicker`
7. 📦 Country picker - Install `react-native-country-picker-modal`

---

## Installation Commands

Run these commands in your project root:

```bash
# Install both libraries
npm install @react-native-community/datetimepicker react-native-country-picker-modal react-native-modal

# For iOS
cd ios && pod install && cd ..

# Rebuild the app
npm run android
# or
npm run ios
```

After installation, implement the code snippets above in `SignUpStep2Screen.tsx`.
