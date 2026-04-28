import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppStore} from '@shared/store/appStore';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {LoadingSplash} from '../screens/LoadingSplash';

const OnboardingStack = createNativeStackNavigator();

const screenOptions = {headerShown: false};

// OnboardingNavigator is state-driven
// It renders the correct screen based on onboardingStep from Zustand
export function OnboardingNavigator() {
  const onboardingStep = useAppStore((state) => state.onboardingStep);

  return (
    <OnboardingStack.Navigator screenOptions={screenOptions}>
      {onboardingStep === 'loadingSplash' && (
        <OnboardingStack.Screen name="AnimatedLoading" component={LoadingSplash} />
      )}
      {onboardingStep === 'slides' && (
        <OnboardingStack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
    </OnboardingStack.Navigator>
  );
}
