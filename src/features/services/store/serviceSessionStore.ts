import {create} from 'zustand';
import {ServiceFlowId, ServiceProviderConfig} from '../registry/serviceRegistry';

export type ActiveServiceSession = {
  sessionId: string;
  flowId: ServiceFlowId;
  provider: ServiceProviderConfig;
  startedAt: number;
};

type ServiceSessionStore = {
  activeSession: ActiveServiceSession | null;
  openServiceSession: (provider: ServiceProviderConfig) => ActiveServiceSession;
  closeServiceSession: () => void;
};

const createSessionId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useServiceSessionStore = create<ServiceSessionStore>(set => ({
  activeSession: null,

  openServiceSession: provider => {
    const session: ActiveServiceSession = {
      sessionId: createSessionId(),
      flowId: provider.flowId,
      provider,
      startedAt: Date.now(),
    };

    set({activeSession: session});
    return session;
  },

  closeServiceSession: () => set({activeSession: null}),
}));

