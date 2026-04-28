import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EnterNumberScreen} from '../screens/airtopup/EnterNumberScreen';
import {SelectAmountScreen} from '../screens/airtopup/SelectAmountScreen';
import {SelectPaymentScreen} from '../screens/airtopup/SelectPaymentScreen';
import {EnterPinScreen} from '../screens/airtopup/EnterPinScreen';
import {SuccessScreen} from '../screens/airtopup/SuccessScreen';

export type AirtimeTopupStackParamList = {
  EnterNumber: undefined;
  SelectAmount: undefined;
  SelectPayment: undefined;
  EnterPin: undefined;
  Success: {transactionId: string};
};

const Stack = createNativeStackNavigator<AirtimeTopupStackParamList>();

export function AirtimeTopupNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {fontWeight: '600'},
      }}>
      <Stack.Screen 
        name= EnterNumber 
        component={EnterNumberScreen}
        options={{title: 'Airtime Topup'}}
      />
      <Stack.Screen 
        name=SelectAmount 
        component={SelectAmountScreen}
        options={{title: 'Select Amount'}}
      />
      <Stack.Screen 
        name=SelectPayment 
        component={SelectPaymentScreen}
        options={{title: 'Payment Method'}}
      />
      <Stack.Screen 
        name=EnterPin 
        component={EnterPinScreen}
        options={{title: 'Enter PIN'}}
      />
      <Stack.Screen 
        name=Success 
        component={SuccessScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
