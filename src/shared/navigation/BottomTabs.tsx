import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '@features/home/screens/HomeScreen';
import {ServicesScreen} from '@features/services/screens/ServicesScreen';
import {PayScreen} from '@features/pay/screens/PayScreen';
import {TransactionsScreen} from '@features/transactions/screens/TransactionsScreen';
import {MoreScreen} from '@features/more/screens/MoreScreen';

const Tab = createBottomTabNavigator();

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true, // Lazy load tabs (default, but explicit for clarity)
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Pay" component={PayScreen} options={{tabBarButton: () => null}} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}
