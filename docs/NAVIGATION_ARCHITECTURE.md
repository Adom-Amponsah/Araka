# ARAKA Navigation Architecture Guide

This document explains how the ARAKA React Native app's navigation is structured, from splash screen to authentication flow.

## Table of Contents
1. [Overview](#overview)
2. [The Three Stacks](#the-three-stacks)
3. [Step-by-Step Flow](#step-by-step-flow)
4. [Why We Structured It This Way](#why-we-structured-it-this-way)
5. [Key Concepts](#key-concepts)
6. [Code Examples](#code-examples)

---

## Overview

Our app uses **React Navigation v6** with a **nested stack navigator** pattern. This means we have multiple layers of navigation stacks that work together to create a seamless user experience.

```
RootNavigator (Top Level)
├── OnboardingStack (Splash → Onboarding)
├── AuthStack (Auth → Login → SignUp → OTP → SignUpStep2)
└── MainStack (BottomTabs → AirtimeTopup)
```

---

## The Three Stacks

### 1. Root Stack (`RootNavigator`)
**File**: `src/shared/navigation/RootNavigator.tsx`

This is the **parent navigator** that decides which major section of the app to show:
- If user is **authenticated** → Shows `Main` (BottomTabs)
- If user is **not authenticated** → Shows `OnboardingStack` first

```typescript
export type RootStackParamList = {
  OnboardingStack: undefined;
  AuthStack: undefined;
  Main: undefined;
  AirtimeTopup: undefined;
};
```

### 2. Onboarding Stack (`OnboardingNavigator`)
**File**: `src/features/onboarding/navigation/OnboardingNavigator.tsx`

Handles the **first-time user experience**:
1. `AnimatedLoading` (LoadingSplash) - Brand animation
2. `Onboarding` - Carousel with 3 slides (Airtime, Bills, Money)

```typescript
export type OnboardingStackParamList = {
  AnimatedLoading: undefined;
  Onboarding: undefined;
};
```

### 3. Auth Stack (`AuthNavigator`)
**File**: `src/shared/navigation/RootNavigator.tsx` (lines 50-62)

Handles **authentication flows**:
1. `Auth` - Get Started / Login buttons
2. `Login` - Login form
3. `SignUp` - Sign up form (Step 1)
4. `OTPVerification` - Email verification
5. `SignUpStep2` - Profile completion

```typescript
export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  SignUp: undefined;
  OTPVerification: {email: string};
  SignUpStep2: undefined;
};
```

---

## Step-by-Step Flow

### 1. App Launch → Native Splash Screen

**What happens**: Before any JavaScript runs, the native app shows a static splash screen (configured in Android/iOS native code).

**Why**: Provides instant visual feedback while the JS bundle loads.

**Files**:
- Android: `android/app/src/main/res/drawable/launch_screen.xml`
- iOS: `ios/Araka/LaunchScreen.storyboard`

---

### 2. Native Splash → LoadingSplash (Animated)

**File**: `src/features/onboarding/screens/LoadingSplash.tsx`

**What happens**:
1. Native splash hides (`BootSplash.hide()`)
2. Shows animated logo with breathing animation
3. After 2.5 seconds → navigates to `Onboarding`

```typescript
// LoadingSplash.tsx
navigation.replace('Onboarding');  // Goes to OnboardingStack's Onboarding screen
```

**Why we did this**: 
- The native splash is static (can't animate)
- LoadingSplash gives us a smooth animated transition
- Creates a "premium" feel with the breathing logo animation

---

### 3. LoadingSplash → OnboardingScreen

**File**: `src/features/onboarding/screens/OnboardingScreen.tsx`

**What happens**:
1. Full-screen image carousel (3 slides)
2. Progress bar at top (like Instagram Stories)
3. Auto-advances every 6 seconds OR user taps arrow
4. Skip button jumps to Auth

**Key features**:
- Dark overlay for text readability
- Left-aligned text at bottom
- No page numbers (clean design)
- Arrow button (→) for next/Start

---

### 4. Onboarding → AuthScreen

**What happens**: When user completes onboarding or taps Skip:

```typescript
// OnboardingScreen.tsx
navigation.navigate('AuthStack');  // Jumps to AuthStack in RootNavigator
```

**Why**: 
- OnboardingStack is done
- User now enters AuthStack for login/signup
- This is cross-stack navigation (OnboardingStack → Root → AuthStack)

---

### 5. AuthScreen → Login or SignUp

**File**: `src/features/auth/screens/AuthScreen.tsx`

**What happens**:
- User taps "Get Started" → navigates to `SignUp`
- User taps "Login" → navigates to `Login`

```typescript
// AuthScreen.tsx
navigation.navigate('SignUp');  // Within AuthStack
navigation.navigate('Login');   // Within AuthStack
```

**Why this works**: AuthScreen is INSIDE AuthStack, so it can navigate directly to sibling screens.

---

### 6. SignUp → OTP → SignUpStep2

**SignUpScreen.tsx**:
```typescript
navigation.navigate('OTPVerification', {email: data.email});
```

**OTPVerificationScreen.tsx**:
```typescript
navigation.navigate('SignUpStep2');
```

---

## Why We Structured It This Way

### 1. Separation of Concerns
- **Onboarding** = First-time experience only (can be skipped in future)
- **Auth** = Login/signup logic only
- **Main** = App functionality for authenticated users

### 2. Clean Navigation Types
Each stack has its own TypeScript type definition, preventing navigation to wrong screens:

```typescript
// Onboarding can't navigate to Login directly
type OnboardingStackParamList = {
  Onboarding: undefined;
  AnimatedLoading: undefined;
  // NO Login here!
};
```

### 3. Easy Conditional Rendering
RootNavigator can easily switch between stacks:

```typescript
{!isAuthenticated ? (
  <>
    <Stack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />
    <Stack.Screen name="AuthStack" component={AuthNavigator} />
  </>
) : (
  <Stack.Screen name="Main" component={BottomTabs} />
)}
```

---

## Key Concepts

### Cross-Stack Navigation
When navigating from one stack to another (e.g., Onboarding → Auth):

```typescript
// Inside OnboardingScreen (OnboardingStack)
navigation.navigate('AuthStack');  // Goes UP to Root, then INTO AuthStack
```

### Within-Stack Navigation
When navigating between screens in the same stack:

```typescript
// Inside AuthScreen (AuthStack)
navigation.navigate('Login');  // Direct sibling navigation
```

### CompositeNavigationProp
For screens that need to navigate both within their stack AND to parent stacks:

```typescript
import {CompositeNavigationProp} from '@react-navigation/native';

type NavigationProp = CompositeNavigationProp<
  StackNavigationProp<OnboardingStackParamList>,  // Can navigate to Onboarding, AnimatedLoading
  StackNavigationProp<RootStackParamList>         // Can ALSO navigate to AuthStack, Main
>;
```

---

## Code Examples

### Adding a New Screen to Auth Stack

1. Add to `AuthStackParamList`:
```typescript
export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  MyNewScreen: undefined;  // Add here
};
```

2. Register in `AuthNavigator`:
```typescript
<AuthStack.Screen name="MyNewScreen" component={MyNewScreen} />
```

3. Navigate to it:
```typescript
navigation.navigate('MyNewScreen');
```

### Navigating from Onboarding to Auth (Cross-Stack)

```typescript
// OnboardingScreen.tsx
const handleComplete = () => {
  navigation.navigate('AuthStack');  // Note: NOT 'Auth'
};
```

### Navigating within Auth Stack

```typescript
// AuthScreen.tsx
const handleLogin = () => {
  navigation.navigate('Login');  // Direct navigation
};
```

---

## Summary

| Stack | Purpose | Screens |
|-------|---------|---------|
| **Root** | App-level routing | OnboardingStack, AuthStack, Main |
| **Onboarding** | First-time experience | LoadingSplash, Onboarding |
| **Auth** | Login/Signup flow | Auth, Login, SignUp, OTP, SignUpStep2 |

**Key Takeaway**: React Navigation uses nested stacks. Navigate WITHIN your current stack for siblings, navigate to the STACK NAME for cross-stack jumps.
