// Main App Component
// src/App.js

import React, { useEffect, useState } from 'react';
import { 
  StatusBar, 
  LogBox, 
  View, 
  ActivityIndicator, 
  Text,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Navigation
import AppNavigator from './navigation/AppNavigator';

// Theme
import { COLORS } from './utils/theme';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'InteractionManager has been deprecated',
  'ViewPropTypes will be removed',
  'RCTEventEmitter',
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

const LoadingScreen = () => (
  <View style={[styles.loadingContainer, { backgroundColor: COLORS?.primary || '#4CAF50' }]}>
    <ActivityIndicator size="large" color="#FFFFFF" />
    <Text style={styles.loadingText}>Loading GrowteqFlowers...</Text>
  </View>
);

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for React Native to be fully initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <LoadingScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <StatusBar 
          backgroundColor={COLORS?.primary || '#4CAF50'} 
          barStyle="light-content" 
        />
        <AuthProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;