import {create} from 'zustand';
import {PaymentTelcoId} from '../registry/serviceRegistry';
import {ActiveServiceSession} from './serviceSessionStore';
import {PaymentMethod} from './airtimeTopupFlowStore';

export type TransferStep =
  | 'details'
  | 'review'
  | 'paymentMethod'
  | 'mobileMoneyDetails'
  | 'cardRedirect'
  | 'paymentConfirmation'
  | 'success'
  | 'failed';

type TransferState = {
  step: TransferStep;
  session: ActiveServiceSession | null;
  subscriberNumber: string;
  phoneNumber: string;
  amount: string;
  paymentMethod: PaymentMethod | null;
  paymentTelco: PaymentTelcoId | null;
  mobileNumber: string;
  error: string | null;

  start: (session: ActiveServiceSession) => void;
  setSubscriberNumber: (subscriberNumber: string) => void;
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
  step: 'details' as TransferStep,
  session: null,
  subscriberNumber: '',
  phoneNumber: '',
  amount: '',
  paymentMethod: null,
  paymentTelco: null,
  mobileNumber: '',
  error: null,
};

const hasValidPhone = (phone: string) => phone.replace(/\D/g, '').length >= 9;
const hasValidAmount = (amount: string) => Number(amount) > 0;

export const useTransferFlowStore = create<TransferState>((set, get) => ({
  ...initialState,

  start: session =>
    set({
      ...initialState,
      session,
      step: 'details',
    }),

  setSubscriberNumber: subscriberNumber => set({subscriberNumber, error: null}),
  setPhoneNumber: phoneNumber => set({phoneNumber, error: null}),
  setAmount: amount => set({amount, error: null}),

  submitDetails: () => {
    const {subscriberNumber, phoneNumber, amount} = get();

    if (!subscriberNumber.trim()) {
      set({error: 'Enter subscriber number'});
      return;
    }

    if (!hasValidPhone(phoneNumber)) {
      set({error: 'Enter phone number'});
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

export const selectTransferFinancials = (state: TransferState) => {
  const amount = Number(state.amount) || 0;
  const fee = amount > 0 ? state.session?.provider.rules.processingFee ?? 0.5 : 0;
  const vatRate = state.session?.provider.rules.vatRate ?? 0;
  const vat = amount > 0 ? Number((amount * vatRate).toFixed(2)) : 0;

  return {
    amount,
    fee,
    vat,
    total: amount + fee + vat,
    currency: state.session?.provider.rules.currency ?? 'USD',
  };
};
