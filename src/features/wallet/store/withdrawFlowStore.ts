import {create} from 'zustand';

export type WithdrawMethod = 'atm' | 'agent' | 'cashoutCode';
export type WithdrawStep =
  | 'selectMethod'
  | 'enterAmount'
  | 'agentDetails'
  | 'confirm'
  | 'success'
  | 'saveFavorite';

type WithdrawFlowState = {
  step: WithdrawStep;
  method: WithdrawMethod | null;
  amount: string;
  agentNumber: string;
  agentName: string;
  cashoutCode: string;
  error: string | null;

  start: () => void;
  selectMethod: (method: WithdrawMethod) => void;
  setAmount: (amount: string) => void;
  setAgentNumber: (number: string) => void;
  submitAgentDetails: () => void;
  confirm: () => void;
  backToMethod: () => void;
  backToAmount: () => void;
  backToAgentDetails: () => void;
  goToSaveFavorite: () => void;
  reset: () => void;
};

const initialState = {
  step: 'selectMethod' as WithdrawStep,
  method: null,
  amount: '',
  agentNumber: '',
  agentName: '',
  cashoutCode: '',
  error: null,
};

export const useWithdrawFlowStore = create<WithdrawFlowState>((set) => ({
  ...initialState,

  start: () => set({...initialState, step: 'selectMethod'}),

  selectMethod: (method) => set({method, step: 'enterAmount', error: null}),

  setAmount: (amount) => set({amount}),

  setAgentNumber: (agentNumber) => set({agentNumber}),

  submitAgentDetails: () => {
    const agentName = 'Araka Agent #' + Math.floor(1000 + Math.random() * 9000);
    set({agentName, step: 'confirm', error: null});
  },

  confirm: () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    set({cashoutCode: code, step: 'success', error: null});
  },

  backToMethod: () => set({step: 'selectMethod', error: null}),

  backToAmount: () => set({step: 'enterAmount', error: null}),

  backToAgentDetails: () => set({step: 'agentDetails', error: null}),

  goToSaveFavorite: () => set({step: 'saveFavorite', error: null}),

  reset: () => set({...initialState}),
}));
