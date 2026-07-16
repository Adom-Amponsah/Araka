import {create} from 'zustand';

export type PaymentMethod = 'mobileMoney' | 'card' | 'rib';
export type MobileTelco = 'mpesa' | 'airtel' | 'orange' | 'afrimoney';

export type TopupStep =
  | 'selectMethod'
  | 'selectOperator'
  | 'enterDetails'
  | 'cardDetails'
  | 'ribDetails'
  | 'enterPin'
  | 'visaVerification'
  | 'processing'
  | 'confirmation';

type TopupFlowState = {
  step: TopupStep;
  paymentMethod: PaymentMethod | null;
  selectedTelco: MobileTelco | null;
  phoneNumber: string;
  amount: string;
  pin: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  visaPassword: string;
  error: string | null;

  start: () => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  selectTelco: (telco: MobileTelco) => void;
  setPhoneNumber: (phone: string) => void;
  setAmount: (amount: string) => void;
  setPin: (pin: string) => void;
  setCardNumber: (card: string) => void;
  setCardExpiry: (expiry: string) => void;
  setCardCvv: (cvv: string) => void;
  setVisaPassword: (password: string) => void;
  submitDetails: () => void;
  submitCardDetails: () => void;
  submitPin: () => void;
  submitVisaPassword: () => void;
  completeTopup: () => void;
  backToMethod: () => void;
  backToOperator: () => void;
  backToDetails: () => void;
  backToCardDetails: () => void;
  backToRibDetails: () => void;
  backFromPin: () => void;
  reset: () => void;
};

const initialState = {
  step: 'selectMethod' as TopupStep,
  paymentMethod: null,
  selectedTelco: null,
  phoneNumber: '',
  amount: '',
  pin: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  visaPassword: '',
  error: null,
};

export const useTopupFlowStore = create<TopupFlowState>((set, get) => ({
  ...initialState,

  start: () => set({...initialState, step: 'selectMethod'}),

  selectPaymentMethod: (paymentMethod) => {
    if (paymentMethod === 'mobileMoney') {
      set({paymentMethod, step: 'selectOperator', error: null});
    } else if (paymentMethod === 'card') {
      set({paymentMethod, step: 'cardDetails', error: null});
    } else if (paymentMethod === 'rib') {
      set({paymentMethod, step: 'ribDetails', error: null});
    } else {
      set({paymentMethod, step: 'enterDetails', error: null});
    }
  },

  selectTelco: (selectedTelco) => {
    set({selectedTelco, step: 'enterDetails', error: null});
  },

  setPhoneNumber: (phoneNumber) => set({phoneNumber, error: null}),
  setAmount: (amount) => set({amount, error: null}),
  setPin: (pin) => set({pin, error: null}),
  setCardNumber: (cardNumber) => set({cardNumber, error: null}),
  setCardExpiry: (cardExpiry) => set({cardExpiry, error: null}),
  setCardCvv: (cardCvv) => set({cardCvv, error: null}),
  setVisaPassword: (visaPassword) => set({visaPassword, error: null}),

  submitDetails: () => {
    const {amount} = get();
    
    if (!amount || Number(amount) <= 0) {
      set({error: 'Enter a valid amount'});
      return;
    }

    set({step: 'enterPin', error: null});
  },

  submitCardDetails: () => {
    const {cardNumber, cardExpiry, cardCvv, amount} = get();
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      set({error: 'Enter valid card number'});
      return;
    }

    if (!cardExpiry || cardExpiry.length < 5) {
      set({error: 'Enter valid expiry date'});
      return;
    }

    if (!cardCvv || cardCvv.length < 3) {
      set({error: 'Enter valid CVV'});
      return;
    }

    if (!amount || Number(amount) <= 0) {
      set({error: 'Enter a valid amount'});
      return;
    }

    set({step: 'enterPin', error: null});
  },

  submitPin: () => {
    const {pin, paymentMethod} = get();
    
    if (pin.length !== 4) {
      set({error: 'Enter 4-digit PIN'});
      return;
    }

    // If card payment, go to visa verification
    if (paymentMethod === 'card') {
      set({step: 'visaVerification', error: null});
    } else {
      set({step: 'processing', error: null});
      
      // Simulate processing
      setTimeout(() => {
        get().completeTopup();
      }, 2500);
    }
  },

  submitVisaPassword: () => {
    const {visaPassword} = get();
    
    if (!visaPassword) {
      set({error: 'Enter password'});
      return;
    }

    set({step: 'processing', error: null});
    
    // Simulate processing
    setTimeout(() => {
      get().completeTopup();
    }, 2500);
  },

  completeTopup: () => set({step: 'confirmation', error: null}),

  backToMethod: () => set({step: 'selectMethod', error: null}),
  backToOperator: () => set({step: 'selectOperator', error: null}),
  backToDetails: () => set({step: 'enterDetails', error: null}),
  backToCardDetails: () => set({step: 'cardDetails', error: null}),
  backToRibDetails: () => set({step: 'ribDetails', error: null}),
  backFromPin: () => {
    const {paymentMethod} = get();
    if (paymentMethod === 'card') {
      set({step: 'cardDetails', error: null});
    } else if (paymentMethod === 'rib') {
      set({step: 'ribDetails', error: null});
    } else {
      set({step: 'enterDetails', error: null});
    }
  },

  reset: () => set({...initialState}),
}));
