# Service Flow Implementation

This document describes what is implemented in the codebase now.

The implemented system follows the state-driven navigation architecture:

```text
ServicesScreen provider click
  -> create active service session
  -> initialize the matching Zustand flow store
  -> navigate once to ServiceFlow
  -> ServiceFlowHost renders the active flow
  -> flow screens render from Zustand state
```

React Navigation opens and closes the flow container. It does not navigate between payment steps.

---

## Files Added

### Service Registry

```text
src/features/services/registry/serviceRegistry.ts
```

Contains:

```typescript
SERVICE_CATEGORIES
PAYMENT_TELCOS
ServiceProviderConfig
ServiceFlowId
ServiceCategoryId
ServiceId
PaymentTelcoId
```

This registry maps each visible provider to a flow.

Implemented active flows:

```typescript
'transfer'
'airtimeTopup'
```

Unsupported providers are included with:

```typescript
flowId: 'unsupported'
enabled: false
```

---

### Active Session Store

```text
src/features/services/store/serviceSessionStore.ts
```

Contains:

```typescript
activeSession
openServiceSession(provider)
closeServiceSession()
```

The active session stores:

```typescript
sessionId
flowId
provider
startedAt
```

This is the bridge between `ServicesScreen` and `ServiceFlowHost`.

---

### Airtime Flow Store

```text
src/features/services/store/airtimeTopupFlowStore.ts
```

Implemented steps:

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

State fields:

```typescript
session
phoneNumber
amount
paymentMethod
paymentTelco
mobileNumber
error
```

Actions:

```typescript
start(session)
setPhoneNumber(phoneNumber)
setAmount(amount)
submitDetails()
selectPaymentMethod(paymentMethod)
selectPaymentTelco(paymentTelco)
setMobileNumber(mobileNumber)
completeMobileMoneyDetails()
verifyPayment()
failPayment()
backToPaymentMethod()
reset()
```

Derived financials:

```typescript
selectAirtimeFinancials(state)
```

Calculates:

```typescript
amount
fee
total
currency
```

---

### Transfer Flow Store

```text
src/features/services/store/transferFlowStore.ts
```

Implemented steps:

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

State fields:

```typescript
session
subscriberNumber
smartCardNumber
phoneNumber
amount
paymentMethod
paymentTelco
mobileNumber
error
```

Actions:

```typescript
start(session)
setSubscriberNumber(subscriberNumber)
setSmartCardNumber(smartCardNumber)
setPhoneNumber(phoneNumber)
setAmount(amount)
submitDetails()
selectPaymentMethod(paymentMethod)
selectPaymentTelco(paymentTelco)
setMobileNumber(mobileNumber)
completeMobileMoneyDetails()
verifyPayment()
failPayment()
backToPaymentMethod()
reset()
```

Derived financials:

```typescript
selectTransferFinancials(state)
```

Calculates:

```typescript
amount
fee
vat
total
currency
```

---

### Service Flow Host

```text
src/features/services/navigation/ServiceFlowHost.tsx
```

Reads:

```typescript
useServiceSessionStore(s => s.activeSession)
```

Renders:

```typescript
airtimeTopup -> <AirtimeTopupFlow />
transfer     -> <TransferFlow />
default      -> unavailable screen
```

If there is no active session, it shows a simple fallback and lets the user close the route.

---

### Airtime Flow UI

```text
src/features/services/flows/AirtimeTopupFlow.tsx
```

Renders Airtime based on the Airtime flow store step.

Current lifecycle:

```text
details
  -> paymentMethod
  -> mobileMoneyDetails OR cardRedirect
  -> paymentConfirmation
  -> success OR failed
```

#### details

Collects:

```text
Phone Number
Amount
Currency
Processing Fee
Total Amount
```

Shows `Verified` once the phone number passes local length validation.

#### paymentMethod

Shows:

```text
Mobile Money
Card Payment
```

Mobile Money advances to `mobileMoneyDetails`.

Card Payment advances to `cardRedirect`.

#### mobileMoneyDetails

Shows provider-supported telcos:

```text
MPesa
Airtel Money
Vodacom
```

Collects:

```text
Mobile Number
```

Shows:

```text
You'll receive a confirmation prompt on your mobile device
You'll pay USD <total>
```

#### paymentConfirmation

Shows:

```text
Payment Confirmation
Checking payment status...
Click the button below to verify your payment
I've Completed the Payment
```

For now, tapping the verification button advances to `success` locally.

#### cardRedirect

Currently a placeholder screen explaining that secure card checkout is not connected yet.

---

### Transfer Flow UI

```text
src/features/services/flows/TransferFlow.tsx
```

Renders Transfer based on the Transfer flow store step.

Current lifecycle:

```text
details
  -> paymentMethod
  -> mobileMoneyDetails OR cardRedirect
  -> paymentConfirmation
  -> success OR failed
```

#### details

Collects:

```text
Subscriber Number
Smart Card Number
Phone Number
Amount
Currency
Processing Fee
VAT
Total Amount
```

Smart card number is limited to 4 characters in the store.

#### paymentMethod

Shows:

```text
Mobile Money
Card Payment
```

Mobile Money advances to `mobileMoneyDetails`.

Card Payment advances to `cardRedirect`.

#### mobileMoneyDetails

Shows provider-supported telcos:

```text
MPESA
AIRTEL
ORANGE
```

Collects:

```text
Mobile Number
```

Shows:

```text
You'll receive a confirmation prompt on your mobile device
You'll pay USD <total>
```

#### paymentConfirmation

Shows:

```text
Payment Confirmation
Checking payment status...
Click the button below to verify your payment
I've Completed the Payment
```

For now, tapping the verification button advances to `success` locally.

#### cardRedirect

Currently a placeholder screen explaining that secure card checkout is not connected yet.

---

## Files Modified

### Main Navigator

```text
src/shared/navigation/MainNavigator.tsx
```

Added typed main stack params:

```typescript
export type MainStackParamList = {
  MainTabs: undefined;
  ServiceFlow: undefined;
};
```

Added route:

```tsx
<MainStack.Screen name="ServiceFlow" component={ServiceFlowHost} />
```

This is the only route used to enter Airtime or Transfer flows.

---

### Services Screen

```text
src/features/services/screens/ServicesScreen.tsx
```

Changes:

- Added provider card `onPress`.
- Changed first category id from `money` to `transfer`.
- Imported service registry and flow stores.
- Added `handleProviderPress(category, provider)`.

Provider click now does:

```typescript
const providerConfig = resolveProviderConfig(category, provider);
const session = openServiceSession(providerConfig);

if (session.flowId === 'airtimeTopup') {
  startAirtimeTopup(session);
}

if (session.flowId === 'transfer') {
  startTransfer(session);
}

navigation.getParent()?.navigate('ServiceFlow');
```

If the provider is missing or disabled:

```typescript
Alert.alert('Service unavailable', `${provider.name} is not available yet.`);
```

---

### Legacy Airtime Navigator

```text
src/features/pay/navigation/AirtimeTopupNavigator.tsx
```

The old fake navigator had invalid JSX route names and blocked TypeScript parsing.

It was replaced with a compatibility shim:

```tsx
export function AirtimeTopupNavigator() {
  return (
    <View>
      <Text>Airtime topup is handled by the service flow state machine.</Text>
    </View>
  );
}
```

The old param list is still exported so existing old screens can type-check imports while the new flow system takes over.

---

## Current Runtime Behavior

### Airtime

Example:

```text
Tap Airtime -> MTN
```

Actual path:

```text
ServicesScreen
  -> openServiceSession(MTN)
  -> useAirtimeTopupFlowStore.start(session)
  -> navigation.navigate('ServiceFlow')
  -> ServiceFlowHost
  -> AirtimeTopupFlow
  -> details step
```

### Transfer

Example:

```text
Tap Transfer -> M-Pesa
```

Actual path:

```text
ServicesScreen
  -> openServiceSession(M-Pesa)
  -> useTransferFlowStore.start(session)
  -> navigation.navigate('ServiceFlow')
  -> ServiceFlowHost
  -> TransferFlow
  -> details step
```

---

## Current Limitations

These flows are wired as frontend state machines only.

Not connected yet:

```text
backend recipient validation
backend quote creation
backend payment initiation
backend payment-status check
card payment provider route
real success/failure from API
transaction persistence
analytics
tests
```

The `I've Completed the Payment` button currently calls local success state. In production it should call a status-check endpoint.

---

## Verification

`git diff --check` passes.

`npx tsc --noEmit --pretty false` is still blocked by existing unrelated project issues:

```text
src/components/ui/dialog.tsx: missing lucide-react-native
src/components/ui/icon.tsx: missing lucide-react-native
src/components/ui/icon.tsx: missing nativewind
src/features/pay/screens/airtopup/EnterNumberScreen.tsx: className on TouchableOpacity
src/features/pay/screens/airtopup/SelectAmountScreen.tsx: className on TouchableOpacity
```

ESLint could not run in this environment because the local ESLint runtime fails with:

```text
structuredClone is not defined
```
