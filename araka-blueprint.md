# Araka – Full Project Blueprint

## 1. What We Are Building

Araka is a fintech mobile application with the following capabilities:

- OTP-based authentication (sign up / login)
- Dashboard showing recent services
- Bottom tab navigation with five menus: **Home, Services, Pay (centre), Transactions, More**
- Financial transactions: send money, buy airtime, pay bills
- Transaction history with filtering
- Profile and settings

---

## 2. Technology Stack

| Category | Choice |
|---|---|
| React Native | Bare CLI (no Expo) |
| Styling Engine | Uniwind (Tailwind syntax, C++ core) |
| Component Library | React Native Reusables (blueprints copied into project) |
| Navigation | React Navigation v7 (Bottom Tabs + Stack) |
| Client State | Zustand |
| Server State | TanStack Query (React Query) |
| HTTP Client | Axios with interceptors |
| Secure Storage | react-native-keychain |
| Local Storage | react-native-mmkv (encrypted, optional) |
| Lists | @shopify/flash-list |
| Animations | react-native-reanimated 3 |
| Image Caching | react-native-fast-image |
| Biometrics (optional) | react-native-biometrics |
| Form Handling | React Hook Form |
| Environment Variables | react-native-config |

> **Important:** All UI components (Button, Input, Card, Modal, etc.) are copied from React Native Reusables via its CLI. All styling is done exclusively with Uniwind's `className` prop — no manual `StyleSheet` is written.

---

## 3. Folder Structure (Feature-Based)

```
src/
├── app/                     # App entry, providers, theme, config
├── features/
│   ├── auth/                # OTP login/register
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── screens/
│   │   ├── services/
│   │   └── store/
│   ├── home/                # Dashboard (recent services)
│   │   ├── components/
│   │   ├── screens/
│   │   └── services/
│   ├── services/            # Full services catalogue
│   │   ├── components/
│   │   ├── screens/
│   │   └── services/
│   ├── pay/                 # Middle tab – quick payment actions
│   │   ├── components/
│   │   ├── screens/
│   │   └── services/
│   ├── transactions/        # History + details
│   │   ├── components/
│   │   ├── screens/
│   │   └── services/
│   └── more/                # Profile, settings, logout
│       ├── components/
│       └── screens/
├── shared/
│   ├── components/          # Extra shared UI (if not covered by RNR)
│   ├── hooks/               # useDebounce, useNetwork, etc.
│   ├── services/            # Axios instance, secure storage wrapper
│   ├── utils/               # Formatters, validators
│   ├── types/               # TypeScript interfaces
│   └── navigation/          # Root navigator, auth stack, bottom tabs
├── styles/
│   ├── theme.ts             # Uniwind theme (colors, spacing, fonts)
│   └── typography.ts
└── assets/                  # Images, fonts, animations
```

---

## 4. Bottom Navigation

| Tab | Screen | Purpose |
|---|---|---|
| Home | HomeScreen | Dashboard with recent services and user balance |
| Services | ServicesScreen | All available services (send money, airtime, bills, data, etc.) |
| **Pay** | **PayScreen** | **Middle tab – scan QR, send money, request payment** |
| Transactions | TransactionsScreen | Full transaction history with filters (date, type, status) |
| More | MoreScreen | Profile, linked accounts, security settings, support, logout |

> The middle **Pay** tab is visually distinct — larger icon or coloured background.

---

## 5. Authentication Flow (OTP)

1. User opens app → sees login screen (phone number input)
2. User enters phone number → taps **Request OTP**
3. App calls backend API to send OTP via SMS
4. User receives OTP → enters 6-digit code
5. App verifies OTP with backend
6. On success, backend returns access token (and optional refresh token)
7. Token stored in `react-native-keychain` (secure hardware storage)
8. Zustand auth store updated: `isAuthenticated = true`
9. Navigation switches from `AuthStack` to `BottomTabs`
10. On logout, token removed from keychain and store; user returns to login

**Additional auth behaviours:**
- OTP resend with 30-second cooldown timer
- Session persistence: on app relaunch, keychain is checked; if token is valid, user stays logged in

---

## 6. State Management

| State Type | Tool | What It Manages |
|---|---|---|
| Client State | Zustand | Auth token, user session, loading flags, UI toggles (modals, filters) |
| Server State | TanStack Query | Recent services, full services list, transactions, user profile, payment status |
| Local UI State | useState | Form inputs, modal open/close, pagination offset |

> No Redux. Zustand slices are created per feature (`authStore`, `filterStore`, etc.) and combined as needed.

---

## 7. API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/auth/otp/request` | POST | Send OTP to phone number |
| `/auth/otp/verify` | POST | Verify OTP, return token |
| `/auth/logout` | POST | Invalidate token |
| `/user/profile` | GET | Fetch user name, phone, email, balance |
| `/services/recent` | GET | List of recently used services (max 5) |
| `/services/all` | GET | Full catalogue with categories |
| `/pay/send` | POST | Send money to recipient |
| `/pay/airtime` | POST | Buy airtime |
| `/pay/bill` | POST | Pay bill |
| `/transactions` | GET | Paginated transaction history |
| `/transactions/:id` | GET | Single transaction details |

> All requests (except OTP endpoints) include `Authorization: Bearer <token>` via Axios interceptor. On a `401` response, the app attempts token refresh and retries the original request.

---

## 8. Security Measures

- **No AsyncStorage for tokens** — Keychain only (iOS Keychain / Android Keystore hardware security)
- **Certificate pinning** in production to prevent MITM attacks
- **Input validation** on all forms (phone number format, OTP length, amount limits)
- **Biometric authentication** (optional) for Pay screen and full transaction details
- **Code obfuscation** via Metro transformer minification
- **Environment variables** (API base URL, OTP provider keys) in `.env` files, never committed
- **Network security config** (Android) and `NSAppTransportSecurity` (iOS) — HTTPS only

---

## 9. Performance Optimisations

- `FlashList` for all scrollable lists (transactions, services grid, recent services)
- **Hermes engine** enabled (default in React Native 0.78+)
- **Lazy loading** of screens via `React.lazy` and `Suspense`
- `react-native-fast-image` with caching for all icons and avatars
- **Reanimated 3** for all animations (tab transitions, button presses) running on the UI thread
- `useCallback` and `useMemo` to avoid unnecessary re-renders
- **Zustand selectors** to subscribe only to relevant state slices
- **TanStack Query `staleTime`** configured per query to avoid over-fetching

---

## 10. Styling Workflow

1. Install and configure Uniwind for bare React Native
2. Run React Native Reusables CLI to copy components into `src/shared/components/`
   - Button, Input, Card, Modal, Sheet, Tabs, and more
3. All components use `className` prop — no `StyleSheet.create`, no inline styles
4. Global theme defined in `src/styles/theme.ts` (colors, spacing, font sizes, border radii)
5. Dark mode support via Uniwind's built-in `dark:` prefix

**Example patterns:**
- Primary button: `className="bg-blue-600 px-4 py-3 rounded-xl"`
- Card: `className="bg-white p-4 rounded-lg shadow-sm"`
- Text input: `className="border border-gray-300 rounded-lg px-3 py-2"`

---

## 11. Implementation Phases

| Phase | Focus | Deliverable |
|---|---|---|
| 0 | Project setup | Bare RN project, all dependencies installed, Uniwind + RNR configured |
| 1 | Authentication | OTP screens, Zustand store, Keychain integration, navigation guard |
| 2 | Bottom tabs | Five-tab navigator, placeholder screens |
| 3 | Home screen | Recent services (mock API), user balance, greeting |
| 4 | Services screen | Services grid (mock), tap to navigate to service flows |
| 5 | Pay screen | Quick actions (send, scan, request) with modals or sub-screens |
| 6 | Transactions screen | List with pull-to-refresh, infinite scroll, filter modal |
| 7 | More screen | Profile display, settings list, logout |
| 8 | Real backend | Replace mocks, token refresh, error handling |
| 9 | Security hardening | Certificate pinning, obfuscation, biometrics |
| 10 | Testing & build | Internal testing, bug fixes, production APK build |

---

## 12. Build & Deployment (No Expo Cloud)

```bash
# Local APK
cd android && ./gradlew assembleRelease

# Play Store AAB
cd android && ./gradlew bundleRelease

# iOS – open in Xcode and archive
ios/Araka.xcworkspace
```

- No dependency on Expo EAS Build — all builds run locally, completely free
- Android code signing via standard keystore
- iOS signing via Apple Developer certificates

---

## 13. Testing Strategy

| Type | Tool | Coverage |
|---|---|---|
| Unit tests | Jest | Zustand stores, utility functions |
| Component tests | React Native Testing Library | Key screens (Login, Pay) |
| Integration tests | Detox | Critical flows (login → send money → view transaction) |
| Manual testing | Real devices | OTP flows, keyboard handling, biometrics |

---

## 14. Key Takeaways

- **No StyleSheet** — everything uses `className` from Uniwind
- **All components are owned** (copied from RNR), not locked into a third-party library
- **Five-tab bottom navigation** with a visually distinct central Pay button
- **OTP authentication** with secure hardware token storage
- **Production-ready** performance and security from the start
