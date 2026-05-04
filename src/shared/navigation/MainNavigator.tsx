import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomTabs} from './BottomTabs';
import {ServiceFlowHost} from '@features/services/navigation/ServiceFlowHost';

export type MainStackParamList = {
  MainTabs: undefined;
  ServiceFlow: undefined;
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
    </MainStack.Navigator>
  );
}
