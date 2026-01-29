// index.js
// CRITICAL: gesture-handler MUST be the very first import

import 'react-native-gesture-handler';

import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

// Suppress known warnings
LogBox.ignoreLogs([
  'RCTEventEmitter',
  'Module RCTEventEmitter',
]);

AppRegistry.registerComponent(appName, () => App);