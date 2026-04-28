import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// Types
// ============================================================================

export type AppFlow = 'booting' | 'onboarding' | 'auth' | 'main';

export type OnboardingStep = 'loadingSplash' | 'slides';

export type AuthStep =
  | 'authHome'
  | 'login'
  | 'signup'
  | 'otp'
  | 'profileSetup';

export type User = {
  id: string;
  email: string;
  name?: string;
};

// ============================================================================
// State
// ============================================================================

interface AppState {
  appFlow: AppFlow;
  onboardingStep: OnboardingStep;
  authStep: AuthStep;
  user: User | null;
  token: string | null;
  hydrated: boolean;
}

// ============================================================================
// Actions
// ============================================================================

// Public actions - what screens call
interface AppActions {
  hydrateApp: () => Promise<void>;
  completeLoadingSplash: () => void;
  completeOnboarding: () => void;
  startLogin: () => void;
  startSignup: () => void;
  submitSignupForm: () => void;
  verifyOtp: () => void;
  completeProfile: (user: User, token: string) => void;
  loginSuccess: (user: User, token: string) => void;
  logout: () => void;
  previewOnboarding: () => void;
  returnFromPreview: () => void;
}

// AppStore type - only exposes public actions
type AppStore = AppState & AppActions;

// ============================================================================
// Store Implementation
// ============================================================================

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      appFlow: 'booting',
      onboardingStep: 'loadingSplash',
      authStep: 'authHome',
      user: null,
      token: null,
      hydrated: false,

      // Hydration - validates and normalizes state on app startup
      hydrateApp: async () => {
        const state = get();
        let correctedFlow = state.appFlow;
        let correctedAuthStep = state.authStep;
        let correctedOnboardingStep = state.onboardingStep;

        // Rule 1: Cannot be in main without token AND user
        if (correctedFlow === 'main' && (!state.token || !state.user)) {
          correctedFlow = 'auth';
          correctedAuthStep = 'authHome';
        }

        // Rule 2: If authenticated, cannot be in auth or onboarding
        if (state.token && state.user && correctedFlow !== 'main') {
          correctedFlow = 'main';
        }

        // Rule 3: If booting and authenticated, go to main
        if (state.token && state.user && correctedFlow === 'booting') {
          correctedFlow = 'main';
        }

        // Rule 4: If booting and not authenticated, go to onboarding
        if (!state.token && !state.user && correctedFlow === 'booting') {
          correctedFlow = 'onboarding';
          correctedOnboardingStep = 'loadingSplash';
        }

        // Rule 5: authStep only valid when appFlow === 'auth'
        if (correctedFlow !== 'auth') {
          correctedAuthStep = 'authHome';
        }

        // Rule 6: onboardingStep only valid when appFlow === 'onboarding'
        if (correctedFlow !== 'onboarding') {
          correctedOnboardingStep = 'loadingSplash';
        }

        // Apply all corrections atomically
        set({
          appFlow: correctedFlow,
          authStep: correctedAuthStep,
          onboardingStep: correctedOnboardingStep,
          hydrated: true,
        });
      },


      // Domain actions (public)
      completeLoadingSplash: () => set({onboardingStep: 'slides'}),
      
      completeOnboarding: () =>
        set({
          appFlow: 'auth',
          authStep: 'authHome',
        }),

      startLogin: () => set({authStep: 'login'}),
      startSignup: () => set({authStep: 'signup'}),
      
      submitSignupForm: () => set({authStep: 'otp'}),
      
      verifyOtp: () => set({authStep: 'profileSetup'}),

      completeProfile: (user, token) =>
        set({
          appFlow: 'main',
          user,
          token,
        }),

      loginSuccess: (user, token) =>
        set({
          appFlow: 'main',
          user,
          token,
        }),

      logout: () =>
        set({
          appFlow: 'auth',
          authStep: 'authHome',
          user: null,
          token: null,
        }),

      // Preview onboarding without losing auth state
      previewOnboarding: () =>
        set({
          appFlow: 'onboarding',
          onboardingStep: 'slides',
        }),

      // Return from preview back to main
      returnFromPreview: () =>
        set({
          appFlow: 'main',
          onboardingStep: 'loadingSplash',
        }),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        appFlow: state.appFlow,
        onboardingStep: state.onboardingStep,
        authStep: state.authStep,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

// ============================================================================
// Derived Selectors
// ============================================================================

export const selectIsAuthenticated = (state: AppStore): boolean => {
  return !!state.token && !!state.user;
};
