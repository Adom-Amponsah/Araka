import {create} from 'zustand';

export type SendStep =
  | 'selectRecipient'
  | 'arakaUserDetails'
  | 'localTransferProviders'
  | 'localTransferDetails'
  | 'intlSelectCountry'
  | 'intlBeneficiaryDetails'
  | 'intlSavedBeneficiaries'
  | 'intlAccountDetails'
  | 'review'
  | 'enterPin'
  | 'processing'
  | 'success'
  | 'saveFavorite'
  | 'viewTransaction';

export type LocalTransferProvider = {
  id: string;
  name: string;
  sub: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  category: 'rib' | 'banks' | 'mobileMoney';
};

export type Country = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
};

export const COUNTRY_LIST: Country[] = [
  {code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32'},
  {code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1'},
  {code: 'CD', name: 'DR Congo', flag: '🇨🇩', dialCode: '+243'},
  {code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33'},
  {code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49'},
  {code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91'},
  {code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254'},
  {code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234'},
  {code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27'},
  {code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256'},
  {code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44'},
  {code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1'},
];

export type SavedBeneficiary = {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  flag: string;
  bankAccount: string;
  avatarColor: string;
};

export const SAVED_BENEFICIARIES: SavedBeneficiary[] = [
  {id: 'b1', firstName: 'Jean', lastName: 'Mukendi', country: 'Belgium', flag: '🇧🇪', bankAccount: 'BE68 5390 0754 7034', avatarColor: '#EAF2FF'},
  {id: 'b2', firstName: 'Sarah', lastName: 'Johnson', country: 'Canada', flag: '🇨🇦', bankAccount: 'CA12 3456 7890 1234', avatarColor: '#EDFBF4'},
  {id: 'b3', firstName: 'Pierre', lastName: 'Dubois', country: 'France', flag: '🇫🇷', bankAccount: 'FR14 2004 1010 0505', avatarColor: '#FFF8E6'},
];

export const LOCAL_TRANSFER_PROVIDERS: LocalTransferProvider[] = [
  {id: 'equity-rib', name: 'Equity RIB', sub: '122993 393939 3999', icon: 'card-outline', iconBg: '#EAF2FF', iconColor: '#2563EB', category: 'rib'},
  {id: 'ecobank', name: 'Ecobank', sub: 'Bank transfer', icon: 'business-outline', iconBg: '#F0FDF4', iconColor: '#16A34A', category: 'banks'},
  {id: 'equity', name: 'Equity', sub: 'Bank transfer', icon: 'business-outline', iconBg: '#EAF2FF', iconColor: '#2563EB', category: 'banks'},
  {id: 'mpesa', name: 'M-Pesa', sub: 'Mobile money', icon: 'phone-portrait-outline', iconBg: '#EDFBF4', iconColor: '#10B981', category: 'mobileMoney'},
  {id: 'airtel', name: 'Airtel Money', sub: 'Mobile money', icon: 'phone-portrait-outline', iconBg: '#FEF3E2', iconColor: '#F59E0B', category: 'mobileMoney'},
  {id: 'orange', name: 'Orange Money', sub: 'Mobile money', icon: 'phone-portrait-outline', iconBg: '#FFF1EA', iconColor: '#F97316', category: 'mobileMoney'},
];

type SendFlowState = {
  step: SendStep;
  recipientType: 'arakaUser' | 'localTransfer' | 'internationalTransfer' | null;
  phoneNumber: string;
  amount: string;
  fee: string;
  pin: string;
  error: string | null;
  selectedProvider: LocalTransferProvider | null;
  bankAccount: string;
  selectedCountry: Country | null;
  beneficiaryFirstName: string;
  beneficiaryLastName: string;
  beneficiaryEmail: string;
  beneficiaryAddress: string;
  beneficiaryDob: string;
  beneficiaryCityOfBirth: string;
  beneficiaryGender: string;
  beneficiaryNationality: string;
  selectedSavedBeneficiary: SavedBeneficiary | null;

  start: () => void;
  selectRecipientType: (type: 'arakaUser' | 'localTransfer' | 'internationalTransfer') => void;
  setPhoneNumber: (phone: string) => void;
  setAmount: (amount: string) => void;
  setBankAccount: (account: string) => void;
  selectProvider: (provider: LocalTransferProvider) => void;
  selectCountry: (country: Country) => void;
  setBeneficiaryField: (field: string, value: string) => void;
  selectSavedBeneficiary: (beneficiary: SavedBeneficiary) => void;
  submitBeneficiaryDetails: () => void;
  submitAccountDetails: () => void;
  submitDetails: () => void;
  editDetails: () => void;
  confirmReview: () => void;
  setPin: (pin: string) => void;
  submitPin: () => void;
  completePayment: () => void;
  saveFavorite: () => void;
  skipFavorite: () => void;
  viewTransaction: () => void;
  backToRecipient: () => void;
  backToDetails: () => void;
  backToProviders: () => void;
  backToCountry: () => void;
  backToBeneficiary: () => void;
  openSavedBeneficiaries: () => void;
  reset: () => void;
};

const initialState = {
  step: 'selectRecipient' as SendStep,
  recipientType: null,
  phoneNumber: '',
  amount: '',
  fee: '0.50',
  pin: '',
  error: null,
  selectedProvider: null,
  bankAccount: '',
  selectedCountry: null,
  beneficiaryFirstName: '',
  beneficiaryLastName: '',
  beneficiaryEmail: '',
  beneficiaryAddress: '',
  beneficiaryDob: '',
  beneficiaryCityOfBirth: '',
  beneficiaryGender: '',
  beneficiaryNationality: '',
  selectedSavedBeneficiary: null,
};

const hasValidPhone = (phone: string) => phone.replace(/\D/g, '').length >= 9;
const hasValidAmount = (amount: string) => Number(amount) > 0;
const hasValidBankAccount = (account: string) => account.replace(/\D/g, '').length >= 5;

export const useSendFlowStore = create<SendFlowState>((set, get) => ({
  ...initialState,

  start: () => set({...initialState, step: 'selectRecipient'}),

  selectRecipientType: recipientType => {
    if (recipientType === 'arakaUser') {
      set({recipientType, step: 'arakaUserDetails', error: null});
    } else if (recipientType === 'localTransfer') {
      set({recipientType, step: 'localTransferProviders', error: null});
    } else if (recipientType === 'internationalTransfer') {
      set({recipientType, step: 'intlSelectCountry', error: null});
    } else {
      set({recipientType, step: 'arakaUserDetails', error: null});
    }
  },

  setPhoneNumber: phoneNumber => set({phoneNumber, error: null}),
  setAmount: amount => set({amount, error: null}),
  setBankAccount: bankAccount => set({bankAccount, error: null}),

  selectProvider: provider => set({selectedProvider: provider, step: 'localTransferDetails', error: null}),

  selectCountry: country => set({selectedCountry: country, step: 'intlBeneficiaryDetails', error: null}),

  setBeneficiaryField: (field, value) => set({[field]: value, error: null} as any),

  selectSavedBeneficiary: beneficiary => {
    set({
      selectedSavedBeneficiary: beneficiary,
      beneficiaryFirstName: beneficiary.firstName,
      beneficiaryLastName: beneficiary.lastName,
      bankAccount: beneficiary.bankAccount,
      step: 'review',
      error: null,
    });
  },

  openSavedBeneficiaries: () => set({step: 'intlSavedBeneficiaries', error: null}),

  submitBeneficiaryDetails: () => {
    const {beneficiaryFirstName, beneficiaryLastName, beneficiaryEmail, beneficiaryDob, beneficiaryCityOfBirth, beneficiaryGender, beneficiaryNationality} = get();
    if (!beneficiaryFirstName.trim()) { set({error: 'Enter first name'}); return; }
    if (!beneficiaryLastName.trim()) { set({error: 'Enter last name'}); return; }
    if (!beneficiaryEmail.trim()) { set({error: 'Enter email address'}); return; }
    if (!beneficiaryDob.trim()) { set({error: 'Enter date of birth'}); return; }
    if (!beneficiaryCityOfBirth.trim()) { set({error: 'Enter city of birth'}); return; }
    if (!beneficiaryGender.trim()) { set({error: 'Select gender'}); return; }
    if (!beneficiaryNationality.trim()) { set({error: 'Enter nationality'}); return; }
    set({step: 'intlAccountDetails', error: null});
  },

  submitAccountDetails: () => {
    const {bankAccount, amount} = get();
    if (!hasValidBankAccount(bankAccount)) { set({error: 'Enter a valid bank account number'}); return; }
    if (!hasValidAmount(amount)) { set({error: 'Enter a valid amount'}); return; }
    set({step: 'review', error: null});
  },

  submitDetails: () => {
    const {phoneNumber, amount, recipientType, selectedProvider, bankAccount} = get();

    if (recipientType === 'arakaUser') {
      if (!hasValidPhone(phoneNumber)) {
        set({error: 'Enter a valid phone number'});
        return;
      }
    } else if (recipientType === 'localTransfer') {
      if (selectedProvider && selectedProvider.category !== 'rib') {
        if (!hasValidBankAccount(bankAccount)) {
          set({error: 'Enter a valid bank account number'});
          return;
        }
      }
    }

    if (!hasValidAmount(amount)) {
      set({error: 'Enter a valid amount'});
      return;
    }

    set({step: 'review', error: null});
  },

  editDetails: () => {
    const {recipientType} = get();
    if (recipientType === 'arakaUser') {
      set({step: 'arakaUserDetails', error: null});
    } else if (recipientType === 'localTransfer') {
      set({step: 'localTransferDetails', error: null});
    } else if (recipientType === 'internationalTransfer') {
      set({step: 'intlAccountDetails', error: null});
    }
  },

  confirmReview: () => set({step: 'enterPin', error: null}),

  setPin: pin => set({pin, error: null}),

  submitPin: () => {
    const {pin} = get();

    if (pin.length !== 4) {
      set({error: 'Enter a 4-digit PIN'});
      return;
    }

    set({step: 'processing', error: null});

    setTimeout(() => {
      get().completePayment();
    }, 2500);
  },

  completePayment: () => set({step: 'success', error: null}),

  saveFavorite: () => set({step: 'saveFavorite', error: null}),
  skipFavorite: () => set({step: 'saveFavorite', error: null}),
  viewTransaction: () => set({step: 'viewTransaction', error: null}),

  backToRecipient: () => set({step: 'selectRecipient', error: null}),
  backToDetails: () => {
    const {recipientType} = get();
    if (recipientType === 'arakaUser') {
      set({step: 'arakaUserDetails', error: null});
    } else if (recipientType === 'localTransfer') {
      set({step: 'localTransferDetails', error: null});
    } else if (recipientType === 'internationalTransfer') {
      set({step: 'intlAccountDetails', error: null});
    } else {
      set({step: 'arakaUserDetails', error: null});
    }
  },
  backToProviders: () => set({step: 'localTransferProviders', error: null}),
  backToCountry: () => set({step: 'intlSelectCountry', error: null}),
  backToBeneficiary: () => set({step: 'intlBeneficiaryDetails', error: null}),

  reset: () => set({...initialState}),
}));
