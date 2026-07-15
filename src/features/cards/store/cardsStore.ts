import {create} from 'zustand';

export type CardType = 'physical' | 'virtual';

export type Card = {
  id: string;
  type: CardType;
  label: string;
  balance: number;
  currency: string;
  digits: string;
  expiry: string;
  network: 'Visa' | 'Mastercard';
  cardNumber: string;
  holderName: string;
  cvv: string;
  limit: number;
  pin: string;
  isFrozen: boolean;
};

export type PhysicalCardDetails = {
  cardNumber: string;
  expiry: string;
  cardId: string;
  pin: string;
};

type CardsState = {
  cards: Card[];
  hasPhysicalCard: boolean;
  physicalCard: Card | null;
  activeTab: CardType;
  lastAddedCard: Card | null;
  showSuccess: boolean;
};

type CardsActions = {
  setActiveTab: (tab: CardType) => void;
  addVirtualCard: (card: Omit<Card, 'type'>) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  linkPhysicalCard: (details: PhysicalCardDetails) => void;
  updatePhysicalCard: (updates: Partial<Card>) => void;
  unlinkPhysicalCard: () => void;
  clearSuccess: () => void;
  reset: () => void;
};

const initialState: CardsState = {
  cards: [],
  hasPhysicalCard: false,
  physicalCard: null,
  activeTab: 'virtual',
  lastAddedCard: null,
  showSuccess: false,
};

export const useCardsStore = create<CardsState & CardsActions>((set) => ({
  ...initialState,
  setActiveTab: (tab) => set({activeTab: tab}),
  addVirtualCard: (card) =>
    set((state) => {
      const newCard = {...card, type: 'virtual'} as Card;
      return {
        cards: [newCard, ...state.cards],
        lastAddedCard: newCard,
        showSuccess: true,
      };
    }),
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? {...c, ...updates} : c)),
    })),
  updatePhysicalCard: (updates) =>
    set((state) => ({
      physicalCard: state.physicalCard ? {...state.physicalCard, ...updates} : null,
    })),
  linkPhysicalCard: (details) => {
    const digits = details.cardNumber.replace(/\D/g, '').slice(-4);
    const card: Card = {
      id: `pc-${Date.now()}`,
      type: 'physical',
      label: 'Visa Card',
      balance: 0,
      currency: 'USD',
      digits,
      expiry: details.expiry,
      network: 'Visa',
      cardNumber: details.cardNumber,
      holderName: 'Mia Lyam Smith',
      cvv: '132',
      limit: 100.5,
      pin: details.pin,
      isFrozen: false,
    };
    set({
      hasPhysicalCard: true,
      physicalCard: card,
      lastAddedCard: card,
      showSuccess: true,
    });
  },
  unlinkPhysicalCard: () => set({hasPhysicalCard: false, physicalCard: null}),
  clearSuccess: () => set({showSuccess: false, lastAddedCard: null}),
  reset: () => set(initialState),
}));
