console.log('[index.js] Starting app registration...');
import {AppRegistry} from 'react-native';
import {enableScreens} from 'react-native-screens';
import App from './App';
import {name as appName} from './app.json';

// Enable native screen optimization for better performance and memory usage
enableScreens();

console.log('[index.js] Registering component:', appName);
AppRegistry.registerComponent(appName, () => App);
console.log('[index.js] Component registered successfully');