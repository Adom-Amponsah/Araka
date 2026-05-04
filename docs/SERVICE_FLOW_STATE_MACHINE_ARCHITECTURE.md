# Service Flow State Machine Architecture

## Core Principle

**Services are selected by navigation, but completed by state machines.**

React Navigation opens one flow container. Zustand owns the active service session and the current flow step. Provider configuration customizes the flow, but the flow state machine defines the valid journey.

```
User taps provider
  -> create service session
  -> initialize the correct flow machine
  -> navigate once to ServiceFlow
  -> ServiceFlowHost renders the active flow
  -> flow advances by domain actions
  -> transaction succeeds, fails, cancels, or resets
```

No payment flow should be modeled as a stack of route screens.

---

## Ownership Boundaries

### React Navigation Owns App Placement

React Navigation answers:

```
Where is the user in the app shell?
```

Allowed:

```typescript
navigation.navigate('ServiceFlow');
navigation.goBack();
```

Not allowed:

```typescript
navigation.navigate('TransferAmount');
navigation.navigate('EnterPin');
navigation.navigate('Success');
navigation.reset(...);
```

### Zustand Owns Flow State

Zustand answers:

```
Which service flow is active?
Which provider was selected?
Which step is the flow currently on?
What data has the user entered?
What quote/result/error exists?
```

### Service Registry Owns Service Metadata

The registry answers:

```
Which category/service/provider did the user tap?
Which flow handles this service?
What provider rules and capabilities apply?
```

### Backend Owns Transaction Truth

The backend answers:

```
Is this provider available?
Is the recipient valid?
What are the fees?
What is the quote id?
Did the transaction execute?
```

---

## Domain Model

### Category

A UI grouping in `ServicesScreen`.

Examples:

```typescript
type ServiceCategoryId =
  | 'transfer'
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'tv'
  | 'internet'
  | 'water';
```

### Service

The actual product/action.

Examples:

```typescript
type ServiceId =
  | 'mobile_money_transfer'
  | 'airtime_topup'
  | 'data_bundle'
  | 'electricity_token'
  | 'tv_subscription';
```

### Provider

The operator/vendor selected by the user.

Examples:

```typescript
type ProviderId =
  | 'mpesa'
  | 'orange_money'
  | 'airtel_money'
  | 'mtn'
  | 'dstv'
  | 'ekedc';
```

### Flow

The state machine that completes the service.

Examples:

```typescript
type ServiceFlowId =
  | 'transfer'
  | 'airtimeTopup'
  | 'dataBundle'
  | 'electricityBill'
  | 'tvSubscription';
```

---

## Service Registry

All providers under the same service should usually use the same flow.

M-Pesa, Orange Money, and Airtel Money under Transfer all use `transfer`.

MTN, Airtel, Orange, and Glo under Airtime all use `airtimeTopup`.

```typescript
type ProviderCapability = {
  recipientLookup: 'required' | 'optional' | 'unsupported';
  feeQuote: 'required' | 'optional' | 'unsupported';
  savedRecipients: boolean;
  authorization: 'pin' | 'otp' | 'biometric' | 'none';
};

type ProviderRules = {
  countryCode: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  phonePrefixes?: string[];
  accountPattern?: string;
};

type ServiceProviderConfig = {
  id: ProviderId;
  categoryId: ServiceCategoryId;
  serviceId: ServiceId;
  flowId: ServiceFlowId;
  displayName: string;
  providerCode: string;
  icon?: string;
  brandColor?: string;
  enabled: boolean;
  maintenance?: boolean;
  capabilities: ProviderCapability;
  rules: ProviderRules;
};
```

Example:

```typescript
const M_PESA_CONFIG: ServiceProviderConfig = {
  id: 'mpesa',
  categoryId: 'transfer',
  serviceId: 'mobile_money_transfer',
  flowId: 'transfer',
  displayName: 'M-Pesa',
  providerCode: 'MPESA_KE',
  brandColor: '#10B981',
  enabled: true,
  capabilities: {
    recipientLookup: 'required',
    feeQuote: 'required',
    savedRecipients: true,
    authorization: 'pin',
  },
  rules: {
    countryCode: 'KE',
    currency: 'KES',
    minAmount: 1,
    maxAmount: 150000,
    phonePrefixes: ['2547'],
  },
};
```

Provider config should customize rules and capabilities. It should not invent arbitrary new flow steps.

---

## Active Session Store

The service session is the bridge between `ServicesScreen` and the flow host.

```typescript
type ActiveServiceSession = {
  sessionId: string;
  categoryId: ServiceCategoryId;
  serviceId: ServiceId;
  flowId: ServiceFlowId;
  provider: ServiceProviderConfig;
  startedAt: number;
};

type ServiceSessionState = {
  activeSession: ActiveServiceSession | null;
  openServiceSession: (provider: ServiceProviderConfig) => ActiveServiceSession;
  closeServiceSession: () => void;
};
```

When a provider card is pressed:

```typescript
const session = openServiceSession(provider);
initializeFlow(session);
navigation.navigate('ServiceFlow');
```

This is the only navigation event needed to enter the payment process.

---

## Main Navigator

`MainNavigator` should expose one generic service-flow route.

```tsx
<MainStack.Screen
  name="MainTabs"
  component={BottomTabs}
/>

<MainStack.Screen
  name="ServiceFlow"
  component={ServiceFlowHost}
  options={{headerShown: false}}
/>
```

Do not add route screens like:

```tsx
<MainStack.Screen name="TransferRecipient" />
<MainStack.Screen name="TransferAmount" />
<MainStack.Screen name="TransferPin" />
```

Those are flow states, not app routes.

---

## ServiceFlowHost

The host renders the correct flow from the active session.

```tsx
export function ServiceFlowHost() {
  const activeSession = useServiceSessionStore(s => s.activeSession);

  if (!activeSession) {
    return <NoActiveServiceSessionScreen />;
  }

  switch (activeSession.flowId) {
    case 'transfer':
      return <TransferFlow />;
    case 'airtimeTopup':
      return <AirtimeTopupFlow />;
    case 'dataBundle':
      return <DataBundleFlow />;
    case 'electricityBill':
      return <ElectricityBillFlow />;
    case 'tvSubscription':
      return <TvSubscriptionFlow />;
    default:
      return <UnsupportedServiceFlow />;
  }
}
```

The host does not know flow steps. It only picks the flow machine.

---

## Transfer Flow State Machine

The transfer state machine owns all valid transfer steps.

```typescript
type TransferStep =
  | 'recipient'
  | 'recipientLookup'
  | 'amount'
  | 'quote'
  | 'review'
  | 'authorization'
  | 'processing'
  | 'success'
  | 'failed';
```

Recommended state:

```typescript
type TransferDraft = {
  recipientPhone: string;
  recipientName?: string;
  amount: string;
  note?: string;
};

type TransferQuote = {
  quoteId: string;
  amount: number;
  fee: number;
  total: number;
  currency: string;
  expiresAt: string;
};

type TransferResult = {
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  message?: string;
};

type TransferFlowState = {
  step: TransferStep;
  draft: TransferDraft;
  quote: TransferQuote | null;
  result: TransferResult | null;
  error: string | null;
  loading: boolean;

  startTransfer: (session: ActiveServiceSession) => void;
  enterRecipient: (phone: string) => void;
  submitRecipient: () => Promise<void>;
  enterAmount: (amount: string) => void;
  submitAmount: () => Promise<void>;
  confirmReview: () => void;
  authorize: (pin: string) => Promise<void>;
  retry: () => void;
  cancel: () => void;
  reset: () => void;
};
```

### Transfer Step Rules

#### recipient

Collect recipient details.

Validation uses provider rules:

```typescript
provider.rules.countryCode
provider.rules.phonePrefixes
provider.rules.accountPattern
```

On submit:

```typescript
if provider.capabilities.recipientLookup === 'required':
  step = 'recipientLookup'
else:
  step = 'amount'
```

#### recipientLookup

Call backend to validate/resolve recipient.

Backend request includes:

```typescript
serviceId
providerCode
recipientPhone
```

On success:

```typescript
draft.recipientName = response.name;
step = 'amount';
```

On failure:

```typescript
step = 'recipient';
error = response.message;
```

#### amount

Collect amount.

Validation uses:

```typescript
provider.rules.minAmount
provider.rules.maxAmount
provider.rules.currency
```

On submit:

```typescript
step = 'quote';
```

#### quote

Request backend-confirmed fees, total, limits, and availability.

Backend request includes:

```typescript
serviceId
providerCode
recipientPhone
amount
currency
```

On success:

```typescript
quote = response.quote;
step = 'review';
```

On failure:

```typescript
step = 'amount';
error = response.message;
```

#### review

Show backend-confirmed transaction details:

```typescript
provider display name
recipient phone/name
amount
fee
total
currency
quote expiry
```

On confirm:

```typescript
step = 'authorization';
```

#### authorization

Collect PIN, OTP, biometric approval, or skip if provider requires no authorization.

Authorization mode comes from:

```typescript
provider.capabilities.authorization
```

On submit:

```typescript
step = 'processing';
```

#### processing

Execute transaction.

Backend request includes:

```typescript
quoteId
providerCode
serviceId
authorizationPayload
```

On success:

```typescript
result = response.result;
step = 'success';
```

On failure:

```typescript
result = response.result;
step = 'failed';
```

---

## Airtime Topup Flow State Machine

Airtime providers share one flow, with provider-specific validation and backend codes.

```typescript
type AirtimeTopupStep =
  | 'recipientNumber'
  | 'amount'
  | 'quote'
  | 'review'
  | 'authorization'
  | 'processing'
  | 'success'
  | 'failed';
```

Recommended state:

```typescript
type AirtimeDraft = {
  phoneNumber: string;
  amount: string;
};

type AirtimeFlowState = {
  step: AirtimeTopupStep;
  draft: AirtimeDraft;
  quote: TransferQuote | null;
  result: TransferResult | null;
  error: string | null;
  loading: boolean;

  startAirtimeTopup: (session: ActiveServiceSession) => void;
  enterPhoneNumber: (phone: string) => void;
  submitPhoneNumber: () => void;
  enterAmount: (amount: string) => void;
  submitAmount: () => Promise<void>;
  confirmReview: () => void;
  authorize: (pin: string) => Promise<void>;
  retry: () => void;
  cancel: () => void;
  reset: () => void;
};
```

Example provider differences:

```typescript
MTN:
  phonePrefixes: ['024', '054', '055']
  minAmount: 1
  maxAmount: 500

Orange:
  phonePrefixes: ['077', '078']
  minAmount: 1
  maxAmount: 1000
```

Same `AirtimeTopupFlow`. Different provider config.

### Implemented Airtime Lifecycle

The first Airtime implementation uses these states:

```typescript
type AirtimeTopupStep =
  | 'details'
  | 'paymentMethod'
  | 'mobileMoneyDetails'
  | 'cardRedirect'
  | 'paymentConfirmation'
  | 'success'
  | 'failed';
```

#### details

Collect:

```typescript
phoneNumber
amount
currency
processingFee
totalAmount
```

The phone number shows `Verified` once it passes local validation.

#### paymentMethod

User chooses:

```typescript
mobileMoney
card
```

Mobile money continues inside the flow. Card goes to `cardRedirect` until the secure card checkout integration exists.

#### mobileMoneyDetails

Collect:

```typescript
paymentTelco // MPesa, Airtel Money, Vodacom
mobileNumber
```

This number receives the OTP, push prompt, or mobile-money confirmation request.

#### paymentConfirmation

Show:

```text
Payment Confirmation
Checking payment status...
Click the button below to verify your payment
I've Completed the Payment
```

In production, this action should call a payment-status endpoint. In the first implementation it advances to success locally.

---

### Implemented Transfer Lifecycle

The first Transfer implementation uses these states:

```typescript
type TransferStep =
  | 'details'
  | 'paymentMethod'
  | 'mobileMoneyDetails'
  | 'cardRedirect'
  | 'paymentConfirmation'
  | 'success'
  | 'failed';
```

#### details

Collect:

```typescript
subscriberNumber
smartCardNumber // last 4 digits
phoneNumber
amount
currency
processingFee
vat
totalAmount
```

Amount is blocked conceptually until phone number is present.

#### paymentMethod

User chooses:

```typescript
mobileMoney
card
```

Mobile money continues inside the flow. Card goes to `cardRedirect` until the secure card checkout integration exists.

#### mobileMoneyDetails

Collect:

```typescript
paymentTelco // MPESA, AIRTEL, ORANGE
mobileNumber
```

This number receives the confirmation prompt.

#### paymentConfirmation

Show:

```text
Click the button below to verify your payment
I've Completed the Payment
```

In production, this action should call a payment-status endpoint. In the first implementation it advances to success locally.

---

## Flow Rendering Pattern

Each flow renders based on its own `step`.

```tsx
export function TransferFlow() {
  const step = useTransferFlowStore(s => s.step);

  switch (step) {
    case 'recipient':
      return <TransferRecipientStep />;
    case 'recipientLookup':
      return <TransferRecipientLookupStep />;
    case 'amount':
      return <TransferAmountStep />;
    case 'quote':
      return <TransferQuoteStep />;
    case 'review':
      return <TransferReviewStep />;
    case 'authorization':
      return <TransferAuthorizationStep />;
    case 'processing':
      return <TransferProcessingStep />;
    case 'success':
      return <TransferSuccessStep />;
    case 'failed':
      return <TransferFailedStep />;
  }
}
```

Screens call actions only:

```typescript
submitRecipient();
submitAmount();
confirmReview();
authorize(pin);
retry();
cancel();
```

Screens should not call:

```typescript
setStep('amount');
navigation.navigate('TransferAmount');
```

---

## ServicesScreen Integration

`ServicesScreen` is a catalogue. It should not know flow steps.

Provider card press:

```typescript
const handleProviderPress = (provider: ServiceProviderConfig) => {
  if (!provider.enabled || provider.maintenance) {
    showServiceUnavailable(provider);
    return;
  }

  const session = openServiceSession(provider);
  initializeFlow(session);
  navigation.navigate('ServiceFlow');
};
```

The catalogue should display:

```typescript
category label
provider display name
provider icon/logo
provider availability
provider action label
```

It should not contain:

```typescript
transfer step names
airtime step names
PIN logic
quote logic
backend transaction logic
```

---

## Initialization Contract

Opening a session must initialize exactly one flow.

```typescript
function initializeFlow(session: ActiveServiceSession) {
  switch (session.flowId) {
    case 'transfer':
      useTransferFlowStore.getState().startTransfer(session);
      break;
    case 'airtimeTopup':
      useAirtimeTopupFlowStore.getState().startAirtimeTopup(session);
      break;
  }
}
```

Starting a new flow should reset old draft/quote/result state for that flow.

If the user abandons a flow:

```typescript
flowStore.reset();
serviceSessionStore.closeServiceSession();
navigation.goBack();
```

---

## Backend API Shape

Recommended endpoints:

```typescript
POST /services/recipient-lookup
POST /services/quote
POST /services/execute
GET  /services/catalog
```

### Recipient Lookup

```typescript
{
  serviceId: 'mobile_money_transfer',
  providerCode: 'MPESA_KE',
  recipient: {
    type: 'phone',
    value: '+254712345678'
  }
}
```

### Quote

```typescript
{
  serviceId: 'mobile_money_transfer',
  providerCode: 'MPESA_KE',
  amount: 1000,
  currency: 'KES',
  recipient: {
    type: 'phone',
    value: '+254712345678'
  }
}
```

### Execute

```typescript
{
  quoteId: 'quote_123',
  authorization: {
    type: 'pin',
    value: '1234'
  }
}
```

The frontend should execute using a quote id when possible. This prevents fee/limit/provider changes between review and execution.

---

## Error Handling

Errors should be state, not route redirects.

Recommended error types:

```typescript
type FlowErrorCode =
  | 'VALIDATION_ERROR'
  | 'PROVIDER_UNAVAILABLE'
  | 'RECIPIENT_NOT_FOUND'
  | 'QUOTE_EXPIRED'
  | 'INSUFFICIENT_BALANCE'
  | 'AUTHORIZATION_FAILED'
  | 'TRANSACTION_FAILED'
  | 'NETWORK_ERROR';
```

Examples:

```typescript
recipient lookup fails -> step = 'recipient'
quote fails            -> step = 'amount'
PIN fails              -> step = 'authorization'
execution fails        -> step = 'failed'
network retryable      -> keep current step and show retry
```

---

## Persistence Rules

Do not persist sensitive or short-lived payment data by default.

Should not persist:

```typescript
PIN
OTP
authorization payload
quote details after expiry
processing state
```

May persist carefully:

```typescript
selected provider
draft recipient
draft amount
current non-sensitive step
```

On app restart, validate the session:

```typescript
if quote expired:
  step = 'amount'
  quote = null

if was processing:
  step = 'failed' or 'statusCheck'

if provider disabled:
  close session and show unavailable state
```

For the first implementation, prefer no persistence for payment flow drafts unless product explicitly needs resume behavior.

---

## Security Rules

- Never store PIN in Zustand after submission.
- Never persist authorization data.
- Clear authorization input immediately after request.
- Prefer backend quote ids over recomputing fees client-side.
- Validate client-side for UX, but trust backend for final rules.
- Treat provider config from backend as display/routing config, not security authority.

---

## Production Rollout Order

### Phase 1: Flow Shell

- Add service registry types.
- Add `serviceSessionStore`.
- Add `ServiceFlowHost`.
- Add `ServiceFlow` route to `MainNavigator`.
- Wire provider cards to open sessions.

### Phase 2: First Real Flow

- Implement `TransferFlow` state machine.
- Implement recipient, amount, quote, review, authorization, processing, result steps.
- Use mocked backend adapters behind real API-shaped functions.

### Phase 3: Airtime Flow

- Implement `AirtimeTopupFlow` using the same session/host pattern.
- Reuse quote, review, authorization, processing, result concepts.

### Phase 4: Backend Integration

- Replace mocks with real catalog, lookup, quote, and execute APIs.
- Add provider availability and maintenance handling.
- Add quote expiry handling.

### Phase 5: Hardening

- Add tests for flow transitions.
- Add invalid-state recovery.
- Add transaction status check for interrupted processing.
- Add analytics events for each domain action.

---

## Testing Checklist

- [ ] Tapping M-Pesa creates a transfer session with M-Pesa provider config.
- [ ] Tapping Orange Money creates a transfer session with Orange provider config.
- [ ] Both providers render the same `TransferFlow`.
- [ ] Provider-specific recipient validation is applied.
- [ ] Required lookup moves through `recipientLookup`.
- [ ] Unsupported lookup skips `recipientLookup`.
- [ ] Amount uses provider min/max/currency.
- [ ] Quote failure returns to the correct editable step.
- [ ] Review uses backend quote, not client-estimated fees.
- [ ] PIN failure stays in authorization.
- [ ] Execution success shows success result.
- [ ] Execution failure shows failed result.
- [ ] Closing a flow resets session and flow state.
- [ ] Back button does not expose impossible stale flow states.

---

## Final Mental Model

```
ServicesScreen = catalogue
Provider card = doorway
Service registry = map from provider to flow
Service session = selected provider + service context
ServiceFlowHost = flow router
Flow store = state machine
Flow screens = dumb UI
Provider config = rules and capabilities
Backend = transaction truth
React Navigation = enter/exit container only
```

**Provider config customizes the flow. The state machine defines the flow.**
