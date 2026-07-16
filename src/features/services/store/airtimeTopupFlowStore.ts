import {create} from 'zustand';
import {ActiveServiceSession} from './serviceSessionStore';

export type AirtimeTopupStep =
  | 'details'
  | 'review'
  | 'processing'
  | 'success'
  | 'failed';

type AirtimeTopupState = {
  step: AirtimeTopupStep;
  session: ActiveServiceSession | null;
  phoneNumber: string;
  amount: string;
  error: string | null;

  start: (session: ActiveServiceSession) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setAmount: (amount: string) => void;
  submitDetails: () => void;
  editDetails: () => void;
  confirmReview: () => void;
  completePayment: () => void;
  failPayment: () => void;
  reset: () => void;
};

const initialState = {
  step: 'details' as AirtimeTopupStep,
  session: null,
  phoneNumber: '',
  amount: '',
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
  confirmReview: () => set({step: 'processing', error: null}),
  completePayment: () => set({step: 'success', error: null}),
  failPayment: () => set({step: 'failed', error: 'Payment could not be completed'}),
  reset: () => set({...initialState}),
}));

export const selectAirtimeFinancials = (state: AirtimeTopupState) => {
  const amount = Number(state.amount) || 0;
  const fee = amount * 0.01; // 1% fee
  const total = amount + fee;

  return {
    amount,
    fee,
    total,
    currency: state.session?.provider.rules.currency ?? 'USD',
  };
};
