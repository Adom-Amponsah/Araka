import * as React from 'react';
import {View, Text, Pressable, TextInput, ScrollView, StyleSheet, Animated, Easing, Modal} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getSystemFont} from '@styles/typography';
import {
  useSendFlowStore,
  COUNTRY_LIST,
  SAVED_BENEFICIARIES,
  Country,
  SavedBeneficiary,
} from '../store/sendFlowStore';
import {BottomSheet} from './components/BottomSheet';
import {ReviewSheet, SendProcessingSheet, SendSuccessSheet, SaveFavoriteSheet} from './components/SendSharedSheets';
import {EnterPinSheet} from './components/SharedSheets';

const CORAL = '#F27649';
const DARK = '#1A2535';
const GRAY = '#8A94A6';
const OFF = '#F4F6FA';
const SLATE = '#3D4A5C';
const SANS = getSystemFont();
const BOLD = getSystemFont('bold');

// ─────────────────────────────────────────────
// Search Bar (matches ServicesScreen style)
// ─────────────────────────────────────────────
function SearchBar({value, onChange, placeholder, onFilter, filterColor}: {value: string; onChange: (v: string) => void; placeholder: string; onFilter?: () => void; filterColor?: string}) {
  const borderAnim = React.useRef(new Animated.Value(0)).current;
  const handleFocus = () => Animated.timing(borderAnim, {toValue: 1, duration: 180, useNativeDriver: false}).start();
  const handleBlur = () => Animated.timing(borderAnim, {toValue: 0, duration: 180, useNativeDriver: false}).start();
  const borderColor = borderAnim.interpolate({inputRange: [0, 1], outputRange: ['#E8EDF2', CORAL]});

  return (
    <View style={sb.row}>
      <Animated.View style={[sb.wrap, {borderColor}]}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={sb.icon} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={sb.input}
          selectionColor={CORAL}
        />
      </Animated.View>
      {onFilter && (
        <Pressable onPress={onFilter} style={[sb.filterBtn, {backgroundColor: filterColor || DARK}]}>
          <Ionicons name="funnel-outline" size={18} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}

const sb = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18},
  wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  icon: {marginRight: 2},
  input: {flex: 1, fontSize: 14, fontFamily: SANS, color: DARK, padding: 0},
  filterBtn: {
    backgroundColor: DARK,
    borderRadius: 14,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─────────────────────────────────────────────
// Country Row
// ─────────────────────────────────────────────
function CountryRow({country, index, onPress}: {country: Country; index: number; onPress: () => void}) {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideX = React.useRef(new Animated.Value(14)).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    fadeIn.setValue(0);
    slideX.setValue(14);
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeIn, {toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(slideX, {toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]).start();
    }, index * 50);
  }, [country.code]);

  const pressIn = () => Animated.spring(scale, {toValue: 0.98, useNativeDriver: true, damping: 20, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200}).start();

  return (
    <Animated.View style={[cr.wrap, {opacity: fadeIn, transform: [{translateX: slideX}, {scale}]}]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={cr.row}>
        <Text style={cr.flag}>{country.flag}</Text>
        <View style={cr.info}>
          <Text style={cr.name} numberOfLines={1}>{country.name}</Text>
          <Text style={cr.sub} numberOfLines={1}>{country.dialCode}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C4CDD8" />
      </Pressable>
    </Animated.View>
  );
}

const cr = StyleSheet.create({
  wrap: {marginBottom: 10},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EDF0F4',
  },
  flag: {fontSize: 28},
  info: {flex: 1, gap: 3},
  name: {color: DARK, fontSize: 15, fontWeight: '700', fontFamily: BOLD, letterSpacing: -0.2},
  sub: {color: '#8A94A6', fontSize: 12, fontFamily: SANS},
});

// ─────────────────────────────────────────────
// Step 1: Select Country Sheet
// ─────────────────────────────────────────────
function SelectCountrySheet({
  visible,
  onClose,
  onBack,
  onSelectCountry,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  onSelectCountry: (country: Country) => void;
}) {
  const [search, setSearch] = React.useState('');

  const filtered = React.useMemo(() => {
    if (!search.trim()) return COUNTRY_LIST;
    const q = search.toLowerCase();
    return COUNTRY_LIST.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [search]);

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack} scrollable>
      <Text style={sc.title}>Select a Country</Text>
      <Text style={sc.sub}>Choose the destination country</Text>

      <SearchBar value={search} onChange={setSearch} placeholder="Search country..." />

      <View style={sc.list}>
        {filtered.map((country, index) => (
          <CountryRow key={country.code} country={country} index={index} onPress={() => onSelectCountry(country)} />
        ))}
      </View>
    </BottomSheet>
  );
}

const sc = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 16},
  list: {paddingBottom: 20},
});

// ─────────────────────────────────────────────
// Step 2: Beneficiary Details Sheet
// ─────────────────────────────────────────────
function BeneficiaryDetailsSheet({
  visible,
  onClose,
  onBack,
  onOpenSaved,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  onOpenSaved: () => void;
  onSubmit: () => void;
}) {
  const setBeneficiaryField = useSendFlowStore(s => s.setBeneficiaryField);
  const beneficiaryFirstName = useSendFlowStore(s => s.beneficiaryFirstName);
  const beneficiaryLastName = useSendFlowStore(s => s.beneficiaryLastName);
  const beneficiaryEmail = useSendFlowStore(s => s.beneficiaryEmail);
  const beneficiaryAddress = useSendFlowStore(s => s.beneficiaryAddress);
  const beneficiaryDob = useSendFlowStore(s => s.beneficiaryDob);
  const beneficiaryCityOfBirth = useSendFlowStore(s => s.beneficiaryCityOfBirth);
  const beneficiaryGender = useSendFlowStore(s => s.beneficiaryGender);
  const beneficiaryNationality = useSendFlowStore(s => s.beneficiaryNationality);
  const error = useSendFlowStore(s => s.error);

  const [showGenderPicker, setShowGenderPicker] = React.useState(false);
  const [showNationalityModal, setShowNationalityModal] = React.useState(false);
  const [nationalitySearch, setNationalitySearch] = React.useState('');

  const textFields = [
    {key: 'beneficiaryLastName', value: beneficiaryLastName, placeholder: 'Last name'},
    {key: 'beneficiaryFirstName', value: beneficiaryFirstName, placeholder: 'First name'},
    {key: 'beneficiaryEmail', value: beneficiaryEmail, placeholder: 'Email address', keyboard: 'email-address'},
    {key: 'beneficiaryAddress', value: beneficiaryAddress, placeholder: 'Address (optional)'},
    {key: 'beneficiaryCityOfBirth', value: beneficiaryCityOfBirth, placeholder: 'City of birth'},
  ];

  const filteredCountries = React.useMemo(() => {
    if (!nationalitySearch.trim()) return COUNTRY_LIST;
    const q = nationalitySearch.toLowerCase();
    return COUNTRY_LIST.filter(c => c.name.toLowerCase().includes(q));
  }, [nationalitySearch]);

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack} scrollable>
      <SearchBar value="" onChange={() => {}} placeholder="Search beneficiary..." onFilter={onOpenSaved} filterColor={CORAL} />

      <Text style={bd.sectionTitle}>Send to a Beneficiary</Text>
      <Text style={bd.sectionSub}>Fill these fields to complete beneficiary details</Text>

      <View style={bd.form}>
        {textFields.map((field) => (
          <View key={field.key} style={bd.inputRow}>
            <TextInput
              style={bd.input}
              value={field.value}
              onChangeText={(text) => setBeneficiaryField(field.key, text)}
              placeholder={field.placeholder}
              placeholderTextColor="#9CA3AF"
              keyboardType={field.keyboard as any || 'default'}
            />
          </View>
        ))}

        <Pressable onPress={() => setShowGenderPicker(!showGenderPicker)} style={bd.inputRow}>
          <Text style={[bd.input, !beneficiaryGender && bd.placeholder]}>
            {beneficiaryGender || 'Select gender'}
          </Text>
          <Ionicons name={showGenderPicker ? 'chevron-up' : 'chevron-down'} size={18} color={GRAY} />
        </Pressable>
        {showGenderPicker && (
          <View style={bd.picker}>
            {['Male', 'Female'].map((g) => (
              <Pressable
                key={g}
                onPress={() => {
                  setBeneficiaryField('beneficiaryGender', g);
                  setShowGenderPicker(false);
                }}
                style={[bd.pickerItem, beneficiaryGender === g && bd.pickerItemActive]}>
                <Text style={[bd.pickerItemText, beneficiaryGender === g && bd.pickerItemTextActive]}>{g}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable onPress={() => setShowNationalityModal(true)} style={bd.inputRow}>
          <Text style={[bd.input, !beneficiaryNationality && bd.placeholder]}>
            {beneficiaryNationality ? `${COUNTRY_LIST.find(c => c.name === beneficiaryNationality)?.flag || ''} ${beneficiaryNationality}` : 'Select nationality'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={GRAY} />
        </Pressable>

        <View style={bd.inputRow}>
          <Ionicons name="calendar-outline" size={18} color={GRAY} style={{marginRight: 4}} />
          <TextInput
            style={bd.input}
            value={beneficiaryDob}
            onChangeText={(text) => setBeneficiaryField('beneficiaryDob', text)}
            placeholder="Date of birth (DD/MM/YYYY)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      {error && <Text style={bd.error}>{error}</Text>}

      <Pressable onPress={onSubmit} style={bd.btn}>
        <Text style={bd.btnText}>Continue</Text>
      </Pressable>

      <Modal visible={showNationalityModal} transparent animationType="slide" onRequestClose={() => setShowNationalityModal(false)}>
        <View style={bd.modalOverlay}>
          <View style={bd.modalSheet}>
            <View style={bd.modalHeader}>
              <Text style={bd.modalTitle}>Select Nationality</Text>
              <Pressable onPress={() => setShowNationalityModal(false)} style={bd.modalClose}>
                <Ionicons name="close" size={22} color={GRAY} />
              </Pressable>
            </View>
            <View style={bd.modalSearch}>
              <Ionicons name="search-outline" size={18} color="#9CA3AF" style={{marginRight: 6}} />
              <TextInput
                style={bd.modalSearchInput}
                value={nationalitySearch}
                onChangeText={setNationalitySearch}
                placeholder="Search country..."
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <ScrollView style={bd.modalList} showsVerticalScrollIndicator={false}>
              {filteredCountries.map((c) => (
                <Pressable
                  key={c.code}
                  onPress={() => {
                    setBeneficiaryField('beneficiaryNationality', c.name);
                    setShowNationalityModal(false);
                    setNationalitySearch('');
                  }}
                  style={[bd.pickerItem, beneficiaryNationality === c.name && bd.pickerItemActive]}>
                  <Text style={bd.pickerFlag}>{c.flag}</Text>
                  <Text style={[bd.pickerItemText, beneficiaryNationality === c.name && bd.pickerItemTextActive]}>{c.name}</Text>
                  {beneficiaryNationality === c.name && <Ionicons name="checkmark" size={18} color={CORAL} />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </BottomSheet>
  );
}

const bd = StyleSheet.create({
  sectionTitle: {fontSize: 16, fontWeight: '700', fontFamily: BOLD, color: DARK, marginBottom: 2, marginTop: 4},
  sectionSub: {fontSize: 13, fontFamily: SANS, color: GRAY, marginBottom: 16},
  form: {gap: 16, marginBottom: 20},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  input: {flex: 1, fontSize: 14, fontFamily: SANS, color: DARK, padding: 0},
  placeholder: {color: '#9CA3AF'},
  picker: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
  },
  pickerItemActive: {borderColor: CORAL, backgroundColor: '#FFF5F2'},
  pickerItemText: {flex: 1, fontSize: 14, fontFamily: SANS, color: DARK},
  pickerItemTextActive: {fontWeight: '700', fontFamily: BOLD, color: CORAL},
  pickerFlag: {fontSize: 20},
  error: {fontSize: 13, fontFamily: SANS, color: '#EF4444', marginBottom: 12, textAlign: 'center'},
  btn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(26,37,53,0.5)',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  modalTitle: {fontSize: 18, fontWeight: '700', fontFamily: BOLD, color: DARK},
  modalClose: {width: 32, height: 32, alignItems: 'center', justifyContent: 'center'},
  modalSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalSearchInput: {flex: 1, fontSize: 14, fontFamily: SANS, color: DARK, padding: 0},
  modalList: {paddingHorizontal: 24, maxHeight: 400},
});

// ─────────────────────────────────────────────
// Step 3: Saved Beneficiaries Sheet
// ─────────────────────────────────────────────
function SavedBeneficiariesSheet({
  visible,
  onClose,
  onBack,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  onSelect: (beneficiary: SavedBeneficiary) => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack} scrollable>
      <Text style={sv.title}>Select a Beneficiary</Text>
      <Text style={sv.sub}>Choose from your saved beneficiaries</Text>

      <View style={sv.list}>
        {SAVED_BENEFICIARIES.map((beneficiary, index) => (
          <SavedBeneficiaryRow key={beneficiary.id} beneficiary={beneficiary} index={index} onPress={() => onSelect(beneficiary)} />
        ))}
      </View>
    </BottomSheet>
  );
}

function SavedBeneficiaryRow({beneficiary, index, onPress}: {beneficiary: SavedBeneficiary; index: number; onPress: () => void}) {
  const fadeIn = React.useRef(new Animated.Value(0)).current;
  const slideX = React.useRef(new Animated.Value(14)).current;
  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    fadeIn.setValue(0);
    slideX.setValue(14);
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeIn, {toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
        Animated.timing(slideX, {toValue: 0, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      ]).start();
    }, index * 60);
  }, [beneficiary.id]);

  const pressIn = () => Animated.spring(scale, {toValue: 0.98, useNativeDriver: true, damping: 20, stiffness: 300}).start();
  const pressOut = () => Animated.spring(scale, {toValue: 1, useNativeDriver: true, damping: 12, stiffness: 200}).start();

  const initials = `${beneficiary.firstName[0]}${beneficiary.lastName[0]}`;

  return (
    <Animated.View style={[svr.wrap, {opacity: fadeIn, transform: [{translateX: slideX}, {scale}]}]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={svr.row}>
        <View style={[svr.avatar, {backgroundColor: beneficiary.avatarColor}]}>
          <Text style={svr.avatarText}>{initials}</Text>
        </View>
        <View style={svr.info}>
          <Text style={svr.name} numberOfLines={1}>{beneficiary.firstName} {beneficiary.lastName}</Text>
          <Text style={svr.sub} numberOfLines={1}>{beneficiary.flag} {beneficiary.country}</Text>
          <Text style={svr.account} numberOfLines={1}>{beneficiary.bankAccount}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C4CDD8" />
      </Pressable>
    </Animated.View>
  );
}

const sv = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 16},
  list: {paddingBottom: 20},
});

const svr = StyleSheet.create({
  wrap: {marginBottom: 10},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EDF0F4',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 16, fontWeight: '700', fontFamily: BOLD, color: DARK},
  info: {flex: 1, gap: 3},
  name: {color: DARK, fontSize: 15, fontWeight: '700', fontFamily: BOLD, letterSpacing: -0.2},
  sub: {color: '#8A94A6', fontSize: 12, fontFamily: SANS},
  account: {color: '#6B7280', fontSize: 11, fontFamily: SANS},
});

// ─────────────────────────────────────────────
// Step 4: Account Details Sheet (bank account + amount)
// ─────────────────────────────────────────────
function IntlAccountDetailsSheet({
  visible,
  onClose,
  onBack,
  bankAccount,
  amount,
  onBankAccountChange,
  onAmountChange,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  bankAccount: string;
  amount: string;
  onBankAccountChange: (val: string) => void;
  onAmountChange: (val: string) => void;
  onSubmit: () => void;
}) {
  const quickAmounts = ['50', '100', '200', '500'];
  const error = useSendFlowStore(s => s.error);

  return (
    <BottomSheet visible={visible} onClose={onClose} onBack={onBack} scrollable>
      <Text style={ad.title}>International Transfer</Text>
      <Text style={ad.sub}>Enter transfer details</Text>

      <View style={ad.section}>
        <View style={ad.inputRow}>
          <Ionicons name="business-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={[ad.input, {flex: 1}]}
            value={bankAccount}
            onChangeText={onBankAccountChange}
            placeholder="Bank account number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={ad.section}>
        <View style={ad.inputRow}>
          <Ionicons name="cash-outline" size={20} color={CORAL} style={{marginLeft: 4}} />
          <TextInput
            style={[ad.input, {flex: 1}]}
            value={amount}
            onChangeText={onAmountChange}
            placeholder="Amount"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <Text style={ad.currency}>USD</Text>
          <Ionicons name="chevron-down" size={16} color={GRAY} />
        </View>

        <View style={ad.quickRow}>
          {quickAmounts.map((amt) => (
            <Pressable key={amt} onPress={() => onAmountChange(amt)} style={ad.quickBtn}>
              <Text style={ad.quickText}>${amt}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {error && <Text style={ad.error}>{error}</Text>}

      <Pressable onPress={onSubmit} style={ad.btn}>
        <Text style={ad.btnText}>Continue</Text>
      </Pressable>
    </BottomSheet>
  );
}

const ad = StyleSheet.create({
  title: {fontSize: 22, fontWeight: '800', fontFamily: BOLD, color: DARK, marginBottom: 4},
  sub: {fontSize: 14, fontFamily: SANS, color: GRAY, marginBottom: 24},
  section: {marginBottom: 20},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  input: {fontSize: 15, fontFamily: SANS, color: DARK, padding: 0},
  currency: {fontSize: 14, fontWeight: '600', fontFamily: BOLD, color: GRAY},
  quickRow: {flexDirection: 'row', gap: 8, marginTop: 12},
  quickBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: OFF,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickText: {fontSize: 13, fontWeight: '600', fontFamily: BOLD, color: CORAL},
  error: {fontSize: 13, fontFamily: SANS, color: '#EF4444', marginBottom: 12, textAlign: 'center'},
  btn: {
    backgroundColor: CORAL,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {color: '#FFFFFF', fontSize: 15, fontWeight: '700', fontFamily: BOLD},
});

// ─────────────────────────────────────────────
// Main International Transfer Flow
// ─────────────────────────────────────────────
export function SendInternationalFlow({visible, onClose, onBack}: {visible: boolean; onClose: () => void; onBack: () => void}) {
  const step = useSendFlowStore((state) => state.step);
  const selectedCountry = useSendFlowStore((state) => state.selectedCountry);
  const bankAccount = useSendFlowStore((state) => state.bankAccount);
  const amount = useSendFlowStore((state) => state.amount);
  const fee = useSendFlowStore((state) => state.fee);
  const pin = useSendFlowStore((state) => state.pin);
  const beneficiaryFirstName = useSendFlowStore((state) => state.beneficiaryFirstName);
  const beneficiaryLastName = useSendFlowStore((state) => state.beneficiaryLastName);

  const selectCountry = useSendFlowStore((state) => state.selectCountry);
  const setBankAccount = useSendFlowStore((state) => state.setBankAccount);
  const setAmount = useSendFlowStore((state) => state.setAmount);
  const submitBeneficiaryDetails = useSendFlowStore((state) => state.submitBeneficiaryDetails);
  const submitAccountDetails = useSendFlowStore((state) => state.submitAccountDetails);
  const selectSavedBeneficiary = useSendFlowStore((state) => state.selectSavedBeneficiary);
  const openSavedBeneficiaries = useSendFlowStore((state) => state.openSavedBeneficiaries);
  const editDetails = useSendFlowStore((state) => state.editDetails);
  const confirmReview = useSendFlowStore((state) => state.confirmReview);
  const setPin = useSendFlowStore((state) => state.setPin);
  const submitPin = useSendFlowStore((state) => state.submitPin);
  const saveFavorite = useSendFlowStore((state) => state.saveFavorite);
  const backToCountry = useSendFlowStore((state) => state.backToCountry);
  const backToBeneficiary = useSendFlowStore((state) => state.backToBeneficiary);
  const backToDetails = useSendFlowStore((state) => state.backToDetails);

  if (!visible) {
    return null;
  }

  const fullName = `${beneficiaryFirstName} ${beneficiaryLastName}`.trim() || 'Beneficiary';
  const recipientLabel = selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'International';
  const recipientDetail = `${fullName}\n${bankAccount}`;

  return (
    <>
      <SelectCountrySheet
        visible={step === 'intlSelectCountry'}
        onClose={onClose}
        onBack={onBack}
        onSelectCountry={selectCountry}
      />

      <BeneficiaryDetailsSheet
        visible={step === 'intlBeneficiaryDetails'}
        onClose={onClose}
        onBack={backToCountry}
        onOpenSaved={openSavedBeneficiaries}
        onSubmit={submitBeneficiaryDetails}
      />

      <SavedBeneficiariesSheet
        visible={step === 'intlSavedBeneficiaries'}
        onClose={onClose}
        onBack={backToBeneficiary}
        onSelect={selectSavedBeneficiary}
      />

      <IntlAccountDetailsSheet
        visible={step === 'intlAccountDetails'}
        onClose={onClose}
        onBack={backToBeneficiary}
        bankAccount={bankAccount}
        amount={amount}
        onBankAccountChange={setBankAccount}
        onAmountChange={setAmount}
        onSubmit={submitAccountDetails}
      />

      <ReviewSheet
        visible={step === 'review'}
        onClose={onClose}
        onBack={backToDetails}
        recipientLabel={recipientLabel}
        recipientDetail={recipientDetail}
        amount={amount}
        fee={fee}
        onConfirm={confirmReview}
        onEdit={editDetails}
        fullName={fullName}
        bankAccount={bankAccount}
      />

      <EnterPinSheet
        visible={step === 'enterPin'}
        onClose={onClose}
        onBack={backToDetails}
        pin={pin}
        onPinChange={setPin}
        onSubmit={submitPin}
      />

      <SendProcessingSheet
        visible={step === 'processing'}
        recipientLabel={recipientLabel}
        recipientDetail={fullName}
        amount={amount}
      />

      <SendSuccessSheet
        visible={step === 'success'}
        onClose={onClose}
        onDone={saveFavorite}
        recipientLabel={recipientLabel}
        recipientDetail={fullName}
        amount={amount}
      />

      <SaveFavoriteSheet
        visible={step === 'saveFavorite'}
        onClose={onClose}
        recipientLabel={fullName}
        recipientDetail={bankAccount}
        amount={amount}
      />
    </>
  );
}
