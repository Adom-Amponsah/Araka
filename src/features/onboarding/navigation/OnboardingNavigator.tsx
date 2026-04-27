import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {LoadingSplash} from '../screens/LoadingSplash';
export type OnboardingStackParamList = {
  Onboarding: undefined;
  AnimatedLoading: undefined;
};

const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();

const screenOptions = {headerShown: false};

export function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator initialRouteName="AnimatedLoading" screenOptions={screenOptions}>
      <OnboardingStack.Screen name="AnimatedLoading" component={LoadingSplash} />
      <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
    </OnboardingStack.Navigator>
  );
}
