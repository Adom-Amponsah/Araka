import {create} from 'zustand';

interface AirtimeState {
  // Flow state - persists across screens
  step: number;
  phoneNumber: string;
  networkProvider: string;
  amount: string;
  paymentMethod: string;
  pin: string;

  // Actions
  setStep: (step: number) => void;
  setPhoneNumber: (phone: string) => void;
  setNetworkProvider: (provider: string) => void;
  setAmount: (amount: string) => void;
  setPaymentMethod: (method: string) => void;
  setPin: (pin: string) => void;
  resetFlow: () => void;

  // Validation
  isStepValid: (step: number) => boolean;
}

const initialState = {
  step: 1,
  phoneNumber: '',
  networkProvider: '',
  amount: '',
  paymentMethod: '',
  pin: '',
};

export const useAirtimeStore = create<AirtimeState>((set, get) => ({
  ...initialState,

  setStep: (step) => set({step}),
  setPhoneNumber: (phoneNumber) => set({phoneNumber}),
  setNetworkProvider: (networkProvider) => set({networkProvider}),
  setAmount: (amount) => set({amount}),
  setPaymentMethod: (paymentMethod) => set({paymentMethod}),
  setPin: (pin) => set({pin}),

  resetFlow: () => set({...initialState}),

  isStepValid: (step) => {
    const state = get();
    switch (step) {
      case 1:
        return state.phoneNumber.length >= 10 && !!state.networkProvider;
      case 2:
        return parseFloat(state.amount) > 0;
      case 3:
        return !!state.paymentMethod;
      case 4:
        return state.pin.length === 4;
      default:
        return true;
    }
  },
}));
