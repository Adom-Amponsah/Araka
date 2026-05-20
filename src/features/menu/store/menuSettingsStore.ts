import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppLanguage = 'en' | 'fr' | 'sw' | 'ln';
export type AutoLockTimer = 'immediate' | '1m' | '5m' | '15m';

type SecuritySettings = {
  faceIdUnlock: boolean;
  faceIdPayments: boolean;
  appLock: boolean;
  requirePinForTransactions: boolean;
  autoLockTimer: AutoLockTimer;
};

type MenuSettingsState = SecuritySettings & {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  setSecurityOption: <Key extends keyof SecuritySettings>(
    key: Key,
    value: SecuritySettings[Key],
  ) => void;
};

export const useMenuSettingsStore = create<MenuSettingsState>()(
  persist(
    set => ({
      language: 'en',
      faceIdUnlock: false,
      faceIdPayments: true,
      appLock: true,
      requirePinForTransactions: false,
      autoLockTimer: '1m',
      setLanguage: language => set({language}),
      setSecurityOption: (key, value) => set({[key]: value}),
    }),
    {
      name: 'menu-settings-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

