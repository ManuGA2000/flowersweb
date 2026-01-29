// index.js
// CRITICAL: gesture-handler MUST be the very first import
import 'react-native-gesture-handler';

import { AppRegistry, Platform, LogBox } from 'react-native';

// Disable native screens on iOS to avoid RCTEventEmitter crash
// This is a workaround for React Native 0.83 New Architecture + cloud simulators
import { enableScreens } from 'react-native-screens';
if (Platform.OS === 'ios') {
  enableScreens(false);
}

import App from './src/App';
import { name as appName } from './app.json';

// Suppress known warnings
LogBox.ignoreLogs([
  'RCTEventEmitter',
  'Module RCTEventEmitter',
  'ViewPropTypes',
]);

AppRegistry.registerComponent(appName, () => App);