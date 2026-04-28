# State-Driven Navigation Architecture

## Core Principle

**State determines UI. UI never determines state.**

Zustand is the single source of truth. React Navigation is a pure renderer.

---

## Store Design

### State

```typescript
type AppFlow = 'booting' | 'onboarding' | 'auth' | 'main';
type OnboardingStep = 'loadingSplash' | 'slides';
type AuthStep = 'authHome' | 'login' | 'signup' | 'otp' | 'profileSetup';
type User = { id: string; email: string; name?: string };

interface AppState {
  appFlow: AppFlow;
  onboardingStep: OnboardingStep;
  authStep: AuthStep;
  user: User | null;
  token: string | null;
  hydrated: boolean;
}
```

### Public Actions (Domain-Driven)

**These are the ONLY actions screens can call:**

```typescript
interface AppActions {
  hydrateApp: () => Promise<void>;
  
  // Onboarding
  completeLoadingSplash: () => void;  // loadingSplash → slides
  completeOnboarding: () => void;     // onboarding → auth
  
  // Auth
  startLogin: () => void;             // authHome → login
  startSignup: () => void;            // authHome → signup
  submitSignupForm: () => void;       // signup → otp
  verifyOtp: () => void;              // otp → profileSetup
  completeProfile: (user, token) => void;  // profileSetup → main
  loginSuccess: (user, token) => void;     // login → main
  logout: () => void;                      // main → auth
}
```

**No setters exposed. No `setAppFlow`, `setAuthStep`, `setOnboardingStep`.**

These are semantic transitions, not manual state mutation.

---

## State Machine Rules

### Flow Scoping

- `authStep` is **only valid** when `appFlow === 'auth'`
- `onboardingStep` is **only valid** when `appFlow === 'onboarding'`
- Outside their flow, these values are ignored/reset

### Hydration Validation

On app startup, `hydrateApp()` enforces these rules:

1. **Cannot be in main without token AND user**
   - If `appFlow = 'main'` but no token/user → force to `'auth'`

2. **If authenticated, must be in main**
   - If token + user exist but `appFlow !== 'main'` → force to `'main'`

3. **Booting resolution**
   - If authenticated → `'main'`
   - If not authenticated → `'onboarding'`

4. **authStep only valid in auth flow**
   - If `appFlow !== 'auth'` → reset `authStep = 'authHome'`

5. **onboardingStep only valid in onboarding flow**
   - If `appFlow !== 'onboarding'` → reset `onboardingStep = 'loadingSplash'`

6. **All corrections applied atomically**
   - Single `set()` call with all validated values

---

## Navigation Architecture

### RootNavigator

```typescript
export function RootNavigator() {
  const hydrated = useAppStore(s => s.hydrated);
  const appFlow = useAppStore(s => s.appFlow);
  const hydrateApp = useAppStore(s => s.hydrateApp);

  useEffect(() => {
    hydrateApp();
  }, []);

  if (!hydrated || appFlow === 'booting') {
    return <LoadingSplash standalone />;
  }

  return (
    <NavigationContainer>
      {appFlow === 'onboarding' && <OnboardingNavigator key="onboarding" />}
      {appFlow === 'auth' && <AuthNavigator key="auth" />}
      {appFlow === 'main' && <MainNavigator key="main" />}
    </NavigationContainer>
  );
}
```

**Critical: `key` prop forces remount on flow change.**

This destroys old navigation history. Back button cannot return to previous flow.

### OnboardingNavigator

```typescript
export function OnboardingNavigator() {
  const onboardingStep = useAppStore(s => s.onboardingStep);

  return (
    <OnboardingStack.Navigator screenOptions={{headerShown: false}}>
      {onboardingStep === 'loadingSplash' && (
        <OnboardingStack.Screen name="AnimatedLoading" component={LoadingSplash} />
      )}
      {onboardingStep === 'slides' && (
        <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
    </OnboardingStack.Navigator>
  );
}
```

**Pure conditional rendering. No `useEffect` to sync state → navigation.**

### AuthNavigator

```typescript
export function AuthNavigator() {
  const authStep = useAppStore(s => s.authStep);

  return (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      {authStep === 'authHome' && (
        <AuthStack.Screen name="Auth" component={AuthScreen} />
      )}
      {authStep === 'login' && (
        <AuthStack.Screen name="Login" component={LoginScreen} />
      )}
      {authStep === 'signup' && (
        <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      )}
      {authStep === 'otp' && (
        <AuthStack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      )}
      {authStep === 'profileSetup' && (
        <AuthStack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
      )}
    </AuthStack.Navigator>
  );
}
```

**Pure conditional rendering. No `useEffect` to sync state → navigation.**

---

## Screen Responsibilities

### What Screens DO

- Render UI
- Collect user input
- Validate locally
- **Call domain actions**
- Show loading states

### What Screens DO NOT DO

- Call `navigation.navigate()` for flow progression
- Manually set state with setters
- Decide cross-flow transitions
- Assume previous screen is reachable

---

## Allowed Navigation

### ✅ Allowed (Normal UI Navigation)

**Inside `MainNavigator` only:**

```typescript
navigation.navigate('ProfileDetails', { userId: 123 });
navigation.navigate('TransactionHistory');
navigation.navigate('Settings');
navigation.goBack();

// Tabs
navigation.navigate('HomeTab');
navigation.navigate('PayTab');

// Modals
navigation.navigate('ConfirmModal');
```

### ❌ NOT Allowed (Flow Progression)

**Never use `navigation.navigate()` for:**

- Onboarding → Auth transition
- Auth → Main transition
- Login → OTP → Profile progression
- Any `authStep` or `onboardingStep` change

**Use domain actions instead:**

```typescript
// ❌ WRONG
navigation.navigate('OTPVerification');
setAuthStep('otp');

// ✅ CORRECT
submitSignupForm(); // Updates authStep, navigator re-renders
```

---

## Example Flows

### Signup Flow

```typescript
// AuthScreen.tsx
const startSignup = useAppStore(s => s.startSignup);
<Button onPress={startSignup} />
// Sets authStep = 'signup', AuthNavigator renders SignUpScreen

// SignUpScreen.tsx
const submitSignupForm = useAppStore(s => s.submitSignupForm);
const handleSubmit = async (data) => {
  await sendOTP(data.email);
  submitSignupForm(); // Sets authStep = 'otp'
};
// AuthNavigator renders OTPVerificationScreen

// OTPVerificationScreen.tsx
const verifyOtp = useAppStore(s => s.verifyOtp);
const handleVerify = async (code) => {
  const isValid = await verifyOTP(code);
  if (isValid) verifyOtp(); // Sets authStep = 'profileSetup'
};
// AuthNavigator renders SignUpStep2Screen

// SignUpStep2Screen.tsx
const completeProfile = useAppStore(s => s.completeProfile);
const handleComplete = async (profileData) => {
  const { user, token } = await createProfile(profileData);
  completeProfile(user, token); // Sets appFlow = 'main'
};
// RootNavigator renders MainNavigator (auth history destroyed)
```

### Login Flow

```typescript
// AuthScreen.tsx
const startLogin = useAppStore(s => s.startLogin);
<Button onPress={startLogin} />
// Sets authStep = 'login', AuthNavigator renders LoginScreen

// LoginScreen.tsx
const loginSuccess = useAppStore(s => s.loginSuccess);
const handleLogin = async (credentials) => {
  const { user, token } = await loginAPI(credentials);
  loginSuccess(user, token); // Sets appFlow = 'main'
};
// RootNavigator renders MainNavigator (auth history destroyed)
```

---

## Critical Rules

### 1. Never Sync State → Navigation

**❌ NEVER DO THIS:**

```typescript
useEffect(() => {
  navigation.navigate(authStep);
}, [authStep]);
```

This creates two sources of truth and breaks the model.

**✅ DO THIS:**

```typescript
{authStep === 'login' && <LoginScreen />}
```

### 2. Actions Are State Transitions

```typescript
startLogin()      // = set authStep = 'login'
verifyOtp()       // = set authStep = 'profileSetup'
completeProfile() // = set appFlow = 'main', store user/token
```

Not navigation commands. Pure state updates.

### 3. Flow Changes Force Remount

```typescript
<OnboardingNavigator key="onboarding" />
<AuthNavigator key="auth" />
<MainNavigator key="main" />
```

When `appFlow` changes, `key` changes, React unmounts old navigator.

### 4. No Screen Guards

Don't add guards like:

```typescript
if (authStep !== 'otp') return null;
```

Invalid state should be fixed in hydration or action logic, not patched in UI.

### 5. State Machine, Not Navigation Paths

Don't think:

```
authHome -> login -> signup -> otp
```

Think:

```
Current state: authStep = 'otp'
Action called: verifyOtp()
New state: authStep = 'profileSetup'
Navigator re-renders: <SignUpStep2Screen />
```

---

## Implementation Status

**⚠️ CORE ARCHITECTURE COMPLETE - MINOR CLEANUP NEEDED**

| Component | Status | Notes |
|-----------|--------|-------|
| `src/shared/store/appStore.ts` | ✅ Complete | No setters exposed, domain actions only |
| `src/shared/navigation/RootNavigator.tsx` | ✅ Complete | Forced remount with `key` props |
| `src/shared/navigation/AuthNavigator.tsx` | ✅ Complete | Conditional rendering based on `authStep` |
| `src/features/onboarding/navigation/OnboardingNavigator.tsx` | ✅ Complete | Conditional rendering based on `onboardingStep` |
| `src/features/onboarding/screens/LoadingSplash.tsx` | ✅ Complete | Uses `completeLoadingSplash()` |
| `src/features/auth/screens/SignUpScreen.tsx` | ✅ Complete | Uses `submitSignupForm()`, `startLogin()` |
| `src/features/auth/screens/OTPVerificationScreen.tsx` | ✅ Complete | Uses `verifyOtp()`, `startSignup()` |
| `src/features/auth/screens/SignUpStep2Screen.tsx` | ⚠️ Needs API | Uses `completeProfile()` (TODO: wire to API) |
| `src/features/auth/screens/LoginScreen.tsx` | ⚠️ Needs API | Uses `loginSuccess()` (TODO: wire to API) |
| Hydration validation | ✅ Complete | All 6 rules enforced |

---

## What Changed From Previous Version

### ❌ Removed

- `setAppFlow`, `setOnboardingStep`, `setAuthStep` - no longer exposed
- `goToOnboarding`, `goToAuth`, `goToMain` - redundant with domain actions
- `otpVerified` - renamed to `verifyOtp` for clarity
- All `useEffect` + `navigate` patterns
- Screen guard recommendations
- "Animation Trade-off" section (was wrong)

### ✅ Added

- `completeLoadingSplash()` - semantic action for splash → slides
- `submitSignupForm()` - semantic action for signup → otp
- `verifyOtp()` - semantic action for otp → profile
- Strengthened hydration with 6 validation rules
- Forced remount via `key` props
- Explicit "allowed vs not allowed" navigation rules

### ✅ Fixed

- Store API now strictly domain-driven
- No way to manually mutate state from screens
- Hydration normalizes all invalid state combinations
- Mental model is pure state machine, not navigation paths

---

## Testing Checklist

- [x] App boots → Shows LoadingSplash
- [x] LoadingSplash → Shows Onboarding
- [x] Onboarding complete → Shows AuthScreen
- [x] AuthScreen → SignUp → Shows SignUpScreen
- [x] AuthScreen → Login → Shows LoginScreen
- [x] SignUp success → Shows OTPVerificationScreen
- [x] OTP verified → Shows SignUpStep2Screen
- [ ] Profile complete → Shows Main (needs API wiring)
- [ ] Login success → Shows Main (needs API wiring)
- [x] Back button never returns to completed onboarding
- [x] Back button never returns to auth after login

---

## Summary

**State determines UI. UI never determines state.**

- Zustand = state machine (source of truth)
- React Navigation = renderer (pure UI)
- Screens = call domain actions (not navigation)
- Actions = state transitions (not navigation commands)
- Flow changes = forced remount (no stale history)
- Hydration = validates and normalizes state

**No `useEffect` + `navigate`. No setters. No manual state mutation. Pure state-driven rendering.**
