import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppStore} from '@shared/store/appStore';
import {LoadingSplash} from '../screens/LoadingSplash';

const OnboardingStack = createNativeStackNavigator();

const screenOptions = {headerShown: false};

export function OnboardingNavigator() {
  const onboardingStep = useAppStore((state) => state.onboardingStep);

  return (
    <OnboardingStack.Navigator screenOptions={screenOptions}>
      {onboardingStep === 'loadingSplash' && (
        <OnboardingStack.Screen name="AnimatedLoading" component={LoadingSplash} />
      )}
    </OnboardingStack.Navigator>
  );
}
