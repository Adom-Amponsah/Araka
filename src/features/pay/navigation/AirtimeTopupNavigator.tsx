import * as React from 'react';
import {View, Text} from 'react-native';

export type AirtimeTopupStackParamList = {
  EnterNumber: undefined;
  SelectAmount: undefined;
  SelectPayment: undefined;
  EnterPin: undefined;
  Success: {transactionId: string};
};

export function AirtimeTopupNavigator() {
  return (
    <View>
      <Text>Airtime topup is handled by the service flow state machine.</Text>
    </View>
  );
}
