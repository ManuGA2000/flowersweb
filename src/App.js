// Main App Component

import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, View, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Theme
import { COLORS } from './utils/theme';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'InteractionManager has been deprecated',
]);

// Lazy load heavy components
const AuthProvider = React.lazy(() => import('./context/AuthContext').then(m => ({ default: m.AuthProvider })));
const CartProvider = React.lazy(() => import('./context/CartContext').then(m => ({ default: m.CartProvider })));
const AppNavigator = React.lazy(() => import('./navigation/AppNavigator'));

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary || '#4CAF50' }}>
    <ActivityIndicator size="large" color="#fff" />
    <Text style={{ color: '#fff', marginTop: 10 }}>Loading...</Text>
  </View>
);

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Longer delay to ensure RN is fully initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LoadingScreen />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar 
          backgroundColor={COLORS.primary} 
          barStyle="light-content" 
        />
        <React.Suspense fallback={<LoadingScreen />}>
          <AuthProvider>
            <CartProvider>
              <AppNavigator />
            </CartProvider>
          </AuthProvider>
        </React.Suspense>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;