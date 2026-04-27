import * as React from 'react';
import {AppProviders} from '@/app/providers/AppProviders';
import {RootNavigator} from '@/shared/navigation/RootNavigator';

function App(): React.JSX.Element {
  console.log('[App] Rendering App component');
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}

export default App;