import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CardsScreen} from '../screens/CardsScreen';
import {CardPinScreen} from '../screens/CardPinScreen';

export type CardsStackParamList = {
  CardsHome: undefined;
  CardPin: {
    amount?: string;
    mode?: 'virtual' | 'physical';
    physicalDetails?: {cardNumber: string; expiry: string; cardId: string};
  };
};

const CardsStack = createNativeStackNavigator<CardsStackParamList>();

export function CardsNavigator() {
  return (
    <CardsStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#FFFFFF'},
      }}>
      <CardsStack.Screen name="CardsHome" component={CardsScreen} />
      <CardsStack.Screen name="CardPin" component={CardPinScreen} />
    </CardsStack.Navigator>
  );
}
