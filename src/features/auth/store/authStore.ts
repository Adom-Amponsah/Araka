import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import * as Keychain from 'react-native-keychain';

interface AuthState {
  // State
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    phone: string;
    name: string;
    balance: number;
  } | null;
  isLoading: boolean;

  // Actions
  setAuthenticated: (value: boolean) => void;
  setToken: (token: string) => Promise<void>;
  setUser: (user: AuthState['user']) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      user: null,
      isLoading: true,

      // Actions
      setAuthenticated: (value) => set({isAuthenticated: value}),

      setToken: async (token) => {
        await Keychain.setGenericPassword('auth_token', token);
        set({token, isAuthenticated: true});
      },

      setUser: (user) => set({user}),

      logout: async () => {
        await Keychain.resetGenericPassword();
        set({
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          user: null,
        });
      },

      checkAuth: async () => {
        try {
          const credentials = await Keychain.getGenericPassword();
          if (credentials && credentials.password) {
            set({token: credentials.password, isAuthenticated: true});
            return true;
          }
          return false;
        } catch (error) {
          return false;
        } finally {
          set({isLoading: false});
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name) => null,
        setItem: async (name, value) => {},
        removeItem: async (name) => {},
      })),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
