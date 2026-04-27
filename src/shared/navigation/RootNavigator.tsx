import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {BottomTabs} from './BottomTabs';
import {LoginScreen} from '@features/auth/screens/LoginScreen';
import {AuthScreen} from '@features/auth/screens/AuthScreen';
import {OnboardingNavigator} from '@features/onboarding/navigation/OnboardingNavigator';
import {LoadingSplash} from '@features/onboarding/screens/LoadingSplash';
import {OTPVerificationScreen} from '@features/auth/screens/OTPVerificationScreen';
import {SignUpStep2Screen} from '@features/auth/screens/SignUpStep2Screen';
import {SignUpScreen} from '@features/auth/screens/SignUpScreen';
import {AirtimeTopupNavigator} from '@features/pay/navigation/AirtimeTopupNavigator';
import {useAuthStore} from '@features/auth/store/authStore';
import BootSplash from 'react-native-bootsplash';

export type AuthStackParamList = {
  Auth: undefined;
  Login: undefined;
  SignUp: undefined;
  OTPVerification: {email: string};
  SignUpStep2: undefined;
};

export type RootStackParamList = {
  OnboardingStack: undefined;
  AuthStack: undefined;
  Main: undefined;
  AirtimeTopup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const authScreenOptions = {headerShown: false};

const authScreenListeners = {
  state: (e: any) => {
    console.log('[AuthNavigator] Screen state event:', e.data);
  },
  focus: (e: any) => {
    console.log('[AuthNavigator] Screen focused:', e.target);
  },
};

function OnboardingStackNavigator() {
  console.log('[OnboardingStackNavigator] Rendering');
  return <OnboardingNavigator />;
}

function AuthNavigator() {
  console.log('[AuthNavigator] Rendering AuthNavigator');
  return (
    <AuthStack.Navigator 
      initialRouteName="Auth"
      screenOptions={authScreenOptions}
      screenListeners={authScreenListeners as any}>
      <AuthStack.Screen name="Auth" component={AuthScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <AuthStack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
    </AuthStack.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  
  console.log('[RootNavigator] isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  React.useEffect(() => {
    console.log('[RootNavigator] useEffect - calling checkAuth');
    checkAuth();
  }, []);

  const handleStateChange = React.useCallback((state: any) => {
    console.log('[RootNavigator] Navigation state changed:', state?.routes[state.index]?.name);
  }, []);

  const handleReady = React.useCallback(() => {
    console.log('[RootNavigator] Navigation container ready - hiding BootSplash as fallback');
    // Hide BootSplash when navigation is ready (fallback in case LoadingSplash doesn't mount)
    BootSplash.hide({fade: true}).catch((error) => {
      console.log('[RootNavigator] BootSplash already hidden or error:', error);
    });
  }, []);

  const rootScreenOptions = React.useMemo(() => ({headerShown: false}), []);
  const airtimeOptions = React.useMemo(() => ({presentation: 'modal' as const}), []);

  // Show loading splash only during initial auth check
  if (isLoading) {
    console.log('[RootNavigator] Auth loading - showing standalone LoadingSplash');
    return <LoadingSplash standalone={true} />;
  }

  return (
    <NavigationContainer
      onStateChange={handleStateChange}
      onReady={handleReady}>
      <Stack.Navigator 
        screenOptions={rootScreenOptions}
        initialRouteName={isAuthenticated ? 'Main' : 'OnboardingStack'}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="OnboardingStack" component={OnboardingStackNavigator} />
            <Stack.Screen name="AuthStack" component={AuthNavigator} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={BottomTabs} />
            <Stack.Screen 
              name="AirtimeTopup" 
              component={AirtimeTopupNavigator}
              options={airtimeOptions}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
