import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LanguageScreen} from '../screens/LanguageScreen';
import {SecurityScreen} from '../screens/SecurityScreen';
import {TermsScreen} from '../screens/TermsScreen';
import {HelpCenterScreen} from '../screens/HelpCenterScreen';
import {ArakaSupportScreen} from '../screens/ArakaSupportScreen';
import {ReportProblemScreen} from '../screens/ReportProblemScreen';
import {MenuPlaceholderScreen} from '../screens/MenuPlaceholderScreen';
import {FeesScreen} from '../screens/FeesScreen';

import {InvoicesScreen} from '../screens/InvoicesScreen';

export type MenuStackParamList = {
  LanguageSettings: undefined;
  SecuritySettings: undefined;
  HelpCenter: undefined;
  ArakaSupport: undefined;
  ReportProblem: undefined;
  Terms: undefined;
  QRCode: undefined;
  Invoices: undefined;
  RateApp: undefined;
  FAQ: undefined;
  ContactProxyPay: undefined;
  ShareApp: undefined;
  Fees: undefined;
};

const MenuStack = createNativeStackNavigator<MenuStackParamList>();

export function MenuNavigator() {
  return (
    <MenuStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#FFFFFF'},
      }}>
      <MenuStack.Screen name="LanguageSettings" component={LanguageScreen} />
      <MenuStack.Screen name="SecuritySettings" component={SecurityScreen} />
      <MenuStack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <MenuStack.Screen name="ArakaSupport" component={ArakaSupportScreen} />
      <MenuStack.Screen name="ReportProblem" component={ReportProblemScreen} />
      <MenuStack.Screen name="Terms" component={TermsScreen} />
      <MenuStack.Screen name="QRCode" component={MenuPlaceholderScreen} />
      <MenuStack.Screen name="Invoices" component={InvoicesScreen} />
      <MenuStack.Screen name="RateApp" component={MenuPlaceholderScreen} />
      <MenuStack.Screen name="FAQ" component={MenuPlaceholderScreen} />
      <MenuStack.Screen name="ContactProxyPay" component={MenuPlaceholderScreen} />
      <MenuStack.Screen name="ShareApp" component={MenuPlaceholderScreen} />
      <MenuStack.Screen name="Fees" component={FeesScreen} />
    </MenuStack.Navigator>
  );
}
