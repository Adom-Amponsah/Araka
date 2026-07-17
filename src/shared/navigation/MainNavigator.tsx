import * as React from 'react';
import {NavigatorScreenParams} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomTabs} from './BottomTabs';
import {ServiceFlowHost} from '@features/services/navigation/ServiceFlowHost';
import {NotificationsScreen} from '@features/notifications/screens/NotificationsScreen';
import {MenuNavigator, MenuStackParamList} from '@features/menu/navigation/MenuNavigator';
import {MyQrScreen} from '@features/settings/screens/MyQrScreen';
import {CreateInvoiceScreen} from '@features/wallet/screens/CreateInvoiceScreen';
import {AllTransactionsScreen} from '@features/wallet/screens/AllTransactionsScreen';

export type MainStackParamList = {
  MainTabs: undefined;
  ServiceFlow: undefined;
  Notifications: undefined;
  MyQR: undefined;
  CreateInvoice: undefined;
  Transactions: undefined;
  Menu: NavigatorScreenParams<MenuStackParamList> | undefined;
};

const MainStack = createNativeStackNavigator<MainStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: {backgroundColor: '#FFFFFF'}, // Match tab bar background
};

// MainNavigator for authenticated users
// Currently just BottomTabs, can expand for modal flows
export function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={screenOptions}>
      <MainStack.Screen name="MainTabs" component={BottomTabs} />
      <MainStack.Screen
        name="ServiceFlow"
        component={ServiceFlowHost}
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          contentStyle: {backgroundColor: 'transparent'},
        }}
      />
      <MainStack.Screen name="Notifications" component={NotificationsScreen} />
      <MainStack.Screen name="MyQR" component={MyQrScreen} />
      <MainStack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
      <MainStack.Screen name="Transactions" component={AllTransactionsScreen} />
      <MainStack.Screen name="Menu" component={MenuNavigator} />
    </MainStack.Navigator>
  );
}
