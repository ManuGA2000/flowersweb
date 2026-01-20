import { AppRegistry } from 'react-native';
import '@react-native-firebase/app';  // Initialize Firebase FIRST
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);