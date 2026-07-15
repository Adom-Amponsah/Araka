import {create} from 'zustand';

export interface QrRecipient {
  id: string;
  name: string;
  avatar?: string;
}

export type QrPaymentStep = 'scan' | 'amount' | 'confirm' | 'success';

interface QrPaymentState {
  step: QrPaymentStep;
  recipient: QrRecipient | null;
  amount: string;
  currency: string;
  feePercent: number;
  isSubmitting: boolean;
}

interface QrPaymentActions {
  setStep: (step: QrPaymentStep) => void;
  setRecipient: (recipient: QrRecipient) => void;
  setAmount: (amount: string) => void;
  setCurrency: (currency: string) => void;
  confirm: () => void;
  submitPayment: () => void;
  reset: () => void;
}

const initialState: QrPaymentState = {
  step: 'scan',
  recipient: null,
  amount: '',
  currency: 'USD',
  feePercent: 1,
  isSubmitting: false,
};

export const useQrPaymentStore = create<QrPaymentState & QrPaymentActions>(
  (set) => ({
    ...initialState,
    setStep: (step) => set({step}),
    setRecipient: (recipient) => set({recipient}),
    setAmount: (amount) => set({amount}),
    setCurrency: (currency) => set({currency}),
    confirm: () => set({step: 'confirm'}),
    submitPayment: () =>
      set({isSubmitting: true}),
    reset: () => set(initialState),
  }),
);

export const selectQrPaymentTotal = (state: QrPaymentState & QrPaymentActions): number => {
  const amount = parseFloat(state.amount) || 0;
  const fee = amount * (state.feePercent / 100);
  return amount + fee;
};

export const selectQrPaymentFee = (state: QrPaymentState & QrPaymentActions): number => {
  const amount = parseFloat(state.amount) || 0;
  return amount * (state.feePercent / 100);
};
