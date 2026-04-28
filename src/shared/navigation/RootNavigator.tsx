import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useAppStore} from '@shared/store/appStore';
import {OnboardingNavigator} from '@features/onboarding/navigation/OnboardingNavigator';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {LoadingSplash} from '@features/onboarding/screens/LoadingSplash';
import BootSplash from 'react-native-bootsplash';

// RootNavigator is state-driven
// Zustand is the source of truth, React Navigation is the renderer
export function RootNavigator() {
  const hydrated = useAppStore((state) => state.hydrated);
  const appFlow = useAppStore((state) => state.appFlow);
  const hydrateApp = useAppStore((state) => state.hydrateApp);

  // Hydrate the app on mount
  React.useEffect(() => {
    hydrateApp();
  }, []);

  // Hide native splash when navigation is ready
  const handleReady = React.useCallback(() => {
    BootSplash.hide({fade: true}).catch(() => {});
  }, []);

  // While hydrating, show loading splash
  if (!hydrated || appFlow === 'booting') {
    return <LoadingSplash standalone />;
  }

  // Render the correct navigator based on appFlow
  // key={appFlow} forces remount on flow change, destroying old navigation history
  return (
    <NavigationContainer onReady={handleReady}>
      {appFlow === 'onboarding' && <OnboardingNavigator key="onboarding" />}
      {appFlow === 'auth' && <AuthNavigator key="auth" />}
      {appFlow === 'main' && <MainNavigator key="main" />}
    </NavigationContainer>
  );
}
