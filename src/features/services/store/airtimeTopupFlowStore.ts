import {create} from 'zustand';
import {PaymentTelcoId} from '../registry/serviceRegistry';
import {ActiveServiceSession} from './serviceSessionStore';

export type AirtimeTopupStep =
  | 'details'
  | 'review'
  | 'paymentMethod'
  | 'mobileMoneyDetails'
  | 'cardRedirect'
  | 'paymentConfirmation'
  | 'success'
  | 'failed';

export type PaymentMethod = 'mobileMoney' | 'card';

type AirtimeTopupState = {
  step: AirtimeTopupStep;
  session: ActiveServiceSession | null;
  phoneNumber: string;
  amount: string;
  paymentMethod: PaymentMethod | null;
  paymentTelco: PaymentTelcoId | null;
  mobileNumber: string;
  error: string | null;

  start: (session: ActiveServiceSession) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setAmount: (amount: string) => void;
  submitDetails: () => void;
  editDetails: () => void;
  confirmReview: () => void;
  backToReview: () => void;
  selectPaymentMethod: (paymentMethod: PaymentMethod) => void;
  selectPaymentTelco: (paymentTelco: PaymentTelcoId) => void;
  setMobileNumber: (mobileNumber: string) => void;
  completeMobileMoneyDetails: () => void;
  verifyPayment: () => void;
  failPayment: () => void;
  backToPaymentMethod: () => void;
  reset: () => void;
};

const initialState = {
  step: 'details' as AirtimeTopupStep,
  session: null,
  phoneNumber: '',
  amount: '',
  paymentMethod: null,
  paymentTelco: null,
  mobileNumber: '',
  error: null,
};

const hasValidAmount = (amount: string) => Number(amount) > 0;
const hasValidPhone = (phone: string) => phone.replace(/\D/g, '').length >= 9;

export const useAirtimeTopupFlowStore = create<AirtimeTopupState>((set, get) => ({
  ...initialState,

  start: session =>
    set({
      ...initialState,
      session,
      step: 'details',
    }),

  setPhoneNumber: phoneNumber => set({phoneNumber, error: null}),
  setAmount: amount => set({amount, error: null}),

  submitDetails: () => {
    const {phoneNumber, amount} = get();

    if (!hasValidPhone(phoneNumber)) {
      set({error: "Enter recipient's phone number"});
      return;
    }

    if (!hasValidAmount(amount)) {
      set({error: 'Enter amount'});
      return;
    }

    set({step: 'review', error: null});
  },

  editDetails: () => set({step: 'details', error: null}),
  confirmReview: () => set({step: 'paymentMethod', error: null}),
  backToReview: () => set({step: 'review', error: null}),

  selectPaymentMethod: paymentMethod => {
    set({
      paymentMethod,
      step: paymentMethod === 'mobileMoney' ? 'mobileMoneyDetails' : 'cardRedirect',
      error: null,
    });
  },

  selectPaymentTelco: paymentTelco => set({paymentTelco, error: null}),
  setMobileNumber: mobileNumber => set({mobileNumber, error: null}),

  completeMobileMoneyDetails: () => {
    const {paymentTelco, mobileNumber} = get();

    if (!paymentTelco) {
      set({error: 'Choose a mobile money provider'});
      return;
    }

    if (!hasValidPhone(mobileNumber)) {
      set({error: 'Enter mobile number'});
      return;
    }

    set({step: 'paymentConfirmation', error: null});
  },

  verifyPayment: () => set({step: 'success', error: null}),
  failPayment: () => set({step: 'failed', error: 'Payment could not be verified'}),
  backToPaymentMethod: () => set({step: 'paymentMethod', error: null}),
  reset: () => set({...initialState}),
}));

export const selectAirtimeFinancials = (state: AirtimeTopupState) => {
  const amount = Number(state.amount) || 0;
  const fee = state.session?.provider.rules.processingFee ?? 0.5;

  return {
    amount,
    fee,
    total: amount + fee,
    currency: state.session?.provider.rules.currency ?? 'USD',
  };
};
