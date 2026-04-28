import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomTabs} from './BottomTabs';
// import {AirtimeTopupNavigator} from '@features/pay/navigation/AirtimeTopupNavigator';

const MainStack = createNativeStackNavigator();

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
      {/* <MainStack.Screen 
          name="AirtimeTopup" 
          component={AirtimeTopupNavigator}
          options={{presentation: 'modal'}}
        /> */}
    </MainStack.Navigator>
  );
}
