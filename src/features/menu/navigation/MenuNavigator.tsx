import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LanguageScreen} from '../screens/LanguageScreen';
import {SecurityScreen} from '../screens/SecurityScreen';
import {TermsScreen} from '../screens/TermsScreen';
import {HelpCenterScreen} from '../screens/HelpCenterScreen';
import {ArakaSupportScreen} from '../screens/ArakaSupportScreen';
import {ReportProblemScreen} from '../screens/ReportProblemScreen';

export type MenuStackParamList = {
  LanguageSettings: undefined;
  SecuritySettings: undefined;
  HelpCenter: undefined;
  ArakaSupport: undefined;
  ReportProblem: undefined;
  Terms: undefined;
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
    </MenuStack.Navigator>
  );
}
