# State-Driven Navigation Flow - Visual Guide

## The New Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ZUSTAND STORE                               │
│                    (Single Source of Truth)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  State:                                                             │
│    appFlow: 'booting' | 'onboarding' | 'auth' | 'main'            │
│    onboardingStep: 'loadingSplash' | 'slides'                      │
│    authStep: 'authHome' | 'login' | 'signup' | 'otp' | 'profile'  │
│    user: User | null                                                │
│    token: string | null                                             │
│    hydrated: boolean                                                │
│                                                                     │
│  Actions (Domain-Driven):                                           │
│    completeOnboarding()  → sets appFlow = 'auth'                   │
│    startLogin()          → sets authStep = 'login'                 │
│    startSignup()         → sets authStep = 'signup'                │
│    otpVerified()         → sets authStep = 'profileSetup'          │
│    completeProfile()     → sets appFlow = 'main' + stores user     │
│    loginSuccess()        → sets appFlow = 'main' + stores user     │
│    logout()              → sets appFlow = 'auth', clears user      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
                    STATE CHANGES TRIGGER RE-RENDER
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      REACT NAVIGATION                               │
│                    (Pure Renderer - No Logic)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  RootNavigator reads appFlow:                                       │
│    if appFlow === 'onboarding' → <OnboardingNavigator key="..." /> │
│    if appFlow === 'auth'       → <AuthNavigator key="..." />       │
│    if appFlow === 'main'       → <MainNavigator key="..." />       │
│                                                                     │
│  OnboardingNavigator reads onboardingStep:                          │
│    if onboardingStep === 'loadingSplash' → <LoadingSplash />       │
│    if onboardingStep === 'slides'        → <OnboardingScreen />    │
│                                                                     │
│  AuthNavigator reads authStep:                                      │
│    if authStep === 'authHome'      → <AuthScreen />                │
│    if authStep === 'login'         → <LoginScreen />               │
│    if authStep === 'signup'        → <SignUpScreen />              │
│    if authStep === 'otp'           → <OTPVerificationScreen />     │
│    if authStep === 'profileSetup'  → <SignUpStep2Screen />         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Complete User Journey

### 1. App Boot

```
┌──────────────┐
│ App Launches │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────┐
│ Zustand: appFlow = 'booting' │
│          hydrated = false    │
└──────┬───────────────────────┘
       │
       ↓
┌─────────────────────────┐
│ hydrateApp() called     │
│ - Loads from AsyncStorage│
│ - Validates state       │
│ - Normalizes if invalid │
└──────┬──────────────────┘
       │
       ↓
   ┌───┴────┐
   │ Has    │
   │ token? │
   └───┬────┘
       │
   ┌───┴────────────────────────┐
   │                            │
  YES                          NO
   │                            │
   ↓                            ↓
appFlow = 'main'        appFlow = 'onboarding'
hydrated = true         hydrated = true
   │                            │
   ↓                            ↓
Shows MainNavigator    Shows OnboardingNavigator
```

---

### 2. Onboarding Flow

```
┌─────────────────────────────────────┐
│ appFlow = 'onboarding'              │
│ onboardingStep = 'loadingSplash'    │
└─────────────┬───────────────────────┘
              │
              ↓
    ┌─────────────────────┐
    │ OnboardingNavigator │
    │ renders:            │
    │ <LoadingSplash />   │
    └─────────┬───────────┘
              │
              │ (animation completes)
              │
              ↓
    ┌──────────────────────────┐
    │ Screen calls:            │
    │ setOnboardingStep('slides')│
    └─────────┬────────────────┘
              │
              ↓
    ┌─────────────────────────┐
    │ Zustand updates:        │
    │ onboardingStep = 'slides'│
    └─────────┬───────────────┘
              │
              ↓
    ┌─────────────────────┐
    │ OnboardingNavigator │
    │ re-renders:         │
    │ <OnboardingScreen />│
    └─────────┬───────────┘
              │
              │ (user completes onboarding)
              │
              ↓
    ┌──────────────────────────┐
    │ Screen calls:            │
    │ completeOnboarding()     │
    └─────────┬────────────────┘
              │
              ↓
    ┌─────────────────────────┐
    │ Zustand updates:        │
    │ appFlow = 'auth'        │
    │ authStep = 'authHome'   │
    └─────────┬───────────────┘
              │
              ↓
    ┌─────────────────────┐
    │ RootNavigator       │
    │ re-renders:         │
    │ <AuthNavigator      │
    │   key="auth" />     │ ← key forces remount
    └─────────────────────┘   (onboarding history destroyed)
```

---

### 3. Auth Flow - Signup Path

```
┌─────────────────────────────┐
│ appFlow = 'auth'            │
│ authStep = 'authHome'       │
└─────────┬───────────────────┘
          │
          ↓
┌─────────────────────┐
│ AuthNavigator       │
│ renders:            │
│ <AuthScreen />      │
└─────────┬───────────┘
          │
          │ (user clicks "Get Started")
          │
          ↓
┌──────────────────────┐
│ Screen calls:        │
│ startSignup()        │
└─────────┬────────────┘
          │
          ↓
┌─────────────────────┐
│ Zustand updates:    │
│ authStep = 'signup' │
└─────────┬───────────┘
          │
          ↓
┌─────────────────────┐
│ AuthNavigator       │
│ re-renders:         │
│ <SignUpScreen />    │
└─────────┬───────────┘
          │
          │ (user submits form)
          │
          ↓
┌──────────────────────┐
│ Screen calls:        │
│ otpVerified()        │ (after sending OTP)
└─────────┬────────────┘
          │
          ↓
┌─────────────────────┐
│ Zustand updates:    │
│ authStep = 'otp'    │
└─────────┬───────────┘
          │
          ↓
┌─────────────────────────┐
│ AuthNavigator           │
│ re-renders:             │
│ <OTPVerificationScreen />│
└─────────┬───────────────┘
          │
          │ (user enters OTP)
          │
          ↓
┌──────────────────────────────┐
│ Screen calls:                │
│ setAuthStep('profileSetup')  │
└─────────┬────────────────────┘
          │
          ↓
┌──────────────────────────┐
│ Zustand updates:         │
│ authStep = 'profileSetup'│
└─────────┬────────────────┘
          │
          ↓
┌─────────────────────────┐
│ AuthNavigator           │
│ re-renders:             │
│ <SignUpStep2Screen />   │
└─────────┬───────────────┘
          │
          │ (user completes profile)
          │
          ↓
┌──────────────────────────────┐
│ Screen calls:                │
│ completeProfile(user, token) │
└─────────┬────────────────────┘
          │
          ↓
┌─────────────────────────┐
│ Zustand updates:        │
│ appFlow = 'main'        │
│ user = {...}            │
│ token = "..."           │
└─────────┬───────────────┘
          │
          ↓
┌─────────────────────┐
│ RootNavigator       │
│ re-renders:         │
│ <MainNavigator      │
│   key="main" />     │ ← key forces remount
└─────────────────────┘   (auth history destroyed)
```

---

### 4. Auth Flow - Login Path

```
┌─────────────────────────────┐
│ appFlow = 'auth'            │
│ authStep = 'authHome'       │
└─────────┬───────────────────┘
          │
          ↓
┌─────────────────────┐
│ AuthNavigator       │
│ renders:            │
│ <AuthScreen />      │
└─────────┬───────────┘
          │
          │ (user clicks "Sign In")
          │
          ↓
┌──────────────────────┐
│ Screen calls:        │
│ startLogin()         │
└─────────┬────────────┘
          │
          ↓
┌─────────────────────┐
│ Zustand updates:    │
│ authStep = 'login'  │
└─────────┬───────────┘
          │
          ↓
┌─────────────────────┐
│ AuthNavigator       │
│ re-renders:         │
│ <LoginScreen />     │
└─────────┬───────────┘
          │
          │ (user submits credentials)
          │
          ↓
┌──────────────────────────────┐
│ Screen calls:                │
│ loginSuccess(user, token)    │
└─────────┬────────────────────┘
          │
          ↓
┌─────────────────────────┐
│ Zustand updates:        │
│ appFlow = 'main'        │
│ user = {...}            │
│ token = "..."           │
└─────────┬───────────────┘
          │
          ↓
┌─────────────────────┐
│ RootNavigator       │
│ re-renders:         │
│ <MainNavigator      │
│   key="main" />     │ ← key forces remount
└─────────────────────┘   (auth history destroyed)
```

---

### 5. Logout Flow

```
┌─────────────────────────────┐
│ appFlow = 'main'            │
│ user = {...}                │
│ token = "..."               │
└─────────┬───────────────────┘
          │
          ↓
┌─────────────────────┐
│ MainNavigator       │
│ (user in app)       │
└─────────┬───────────┘
          │
          │ (user clicks logout)
          │
          ↓
┌──────────────────────┐
│ Screen calls:        │
│ logout()             │
└─────────┬────────────┘
          │
          ↓
┌─────────────────────────┐
│ Zustand updates:        │
│ appFlow = 'auth'        │
│ authStep = 'authHome'   │
│ user = null             │
│ token = null            │
└─────────┬───────────────┘
          │
          ↓
┌─────────────────────┐
│ RootNavigator       │
│ re-renders:         │
│ <AuthNavigator      │
│   key="auth" />     │ ← key forces remount
└─────────────────────┘   (main history destroyed)
```

---

## Key Differences: Old vs New

### Old Way (Imperative)

```typescript
// ❌ Screen controls navigation
const handlePress = () => {
  navigation.navigate('OTPVerification');
};

// ❌ Navigation is source of truth
// ❌ Back button can return to old flows
// ❌ State and navigation can diverge
```

### New Way (State-Driven)

```typescript
// ✅ Screen updates state
const otpVerified = useAppStore(s => s.otpVerified);

const handlePress = () => {
  otpVerified(); // Updates authStep
};

// ✅ State is source of truth
// ✅ Navigator re-renders based on state
// ✅ key prop destroys old history
// ✅ State and UI always in sync
```

---

## Critical Rules Enforced

### 1. State Determines UI

```
State Change → Navigator Re-renders → Screen Shows
     ↑                                      │
     └──────────────────────────────────────┘
              (screens call actions)
```

**Never:**
```
Screen → navigation.navigate() → UI Changes
```

### 2. Flow Changes Force Remount

```typescript
// key prop changes when appFlow changes
<OnboardingNavigator key="onboarding" />
<AuthNavigator key="auth" />
<MainNavigator key="main" />

// This destroys old navigation history
// Back button cannot return to previous flow
```

### 3. Per-Flow State Is Scoped

```
appFlow = 'auth'  → authStep matters
appFlow = 'main'  → authStep ignored

appFlow = 'onboarding' → onboardingStep matters
appFlow = 'auth'       → onboardingStep ignored
```

### 4. Actions Are State Updates

```typescript
startLogin()      // = set authStep = 'login'
otpVerified()     // = set authStep = 'profileSetup'
completeProfile() // = set appFlow = 'main', store user/token

// NOT navigation commands
// Pure state transitions
```

---

## What Navigation IS Allowed

### ✅ Allowed (Inside MainNavigator)

```typescript
// Normal UI navigation in authenticated app
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

```typescript
// ❌ NEVER use navigation for flow changes
navigation.navigate('OTPVerification');  // Use otpVerified() instead
navigation.navigate('SignUpStep2');      // Use setAuthStep() instead
navigation.navigate('Main');             // Use loginSuccess() instead
navigation.reset(...);                   // Use store actions instead
```

---

## Hydration & Crash Recovery

```
App Crashes
     ↓
AsyncStorage has:
  appFlow = 'auth'
  authStep = 'otp'
  user = null
  token = null
     ↓
App Restarts
     ↓
hydrateApp() runs:
  - Sees appFlow = 'auth' but no token
  - Validates: auth without token is invalid
  - Corrects: appFlow = 'auth', authStep = 'authHome'
     ↓
User sees AuthScreen (correct state)
Not OTPVerificationScreen (stale state)
```

---

## The Flow in One Sentence

**User interacts → Screen calls Zustand action → State updates → Navigator re-renders → Correct screen shows.**

No `navigation.navigate()`. No `useEffect` syncing. Pure state-driven rendering.
