import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppStore} from '@shared/store/appStore';
import {AuthScreen} from '@features/auth/screens/AuthScreen';
import {LoginScreen} from '@features/auth/screens/LoginScreen';
import {SignUpScreen} from '@features/auth/screens/SignUpScreen';
import {OTPVerificationScreen} from '@features/auth/screens/OTPVerificationScreen';
import {SignUpStep2Screen} from '@features/auth/screens/SignUpStep2Screen';
import {IdUploadScreen} from '@features/auth/screens/IdUploadScreen';
import {SelfieScreen} from '@features/auth/screens/SelfieScreen';
import {PinCreationScreen} from '@features/auth/screens/PinCreationScreen';
import {ConfirmPinScreen} from '@features/auth/screens/ConfirmPinScreen';
import {CongratsScreen} from '@features/auth/screens/CongratsScreen';

const AuthStack = createNativeStackNavigator();

const screenOptions = {headerShown: false};

// AuthNavigator is state-driven
// It renders the correct screen based on authStep from Zustand
export function AuthNavigator() {
  const authStep = useAppStore((state) => state.authStep);

  return (
    <AuthStack.Navigator screenOptions={screenOptions}>
      {authStep === 'authHome' && (
        <AuthStack.Screen name="Auth" component={AuthScreen} />
      )}
      {authStep === 'login' && (
        <AuthStack.Screen name="Login" component={LoginScreen} />
      )}
      {authStep === 'signup' && (
        <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      )}
      {authStep === 'otp' && (
        <AuthStack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      )}
      {authStep === 'profileSetup' && (
        <AuthStack.Screen name="SignUpStep2" component={SignUpStep2Screen} />
      )}
      {authStep === 'idUpload' && (
        <AuthStack.Screen name="IdUpload" component={IdUploadScreen} />
      )}
      {authStep === 'selfie' && (
        <AuthStack.Screen name="Selfie" component={SelfieScreen} />
      )}
      {authStep === 'pinCreation' && (
        <AuthStack.Screen name="PinCreation" component={PinCreationScreen} />
      )}
      {authStep === 'confirmPin' && (
        <AuthStack.Screen name="ConfirmPin" component={ConfirmPinScreen} />
      )}
      {authStep === 'congrats' && (
        <AuthStack.Screen name="Congrats" component={CongratsScreen} />
      )}
    </AuthStack.Navigator>
  );
}
