// Main App Component

import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox, View, ActivityIndicator, InteractionManager } from 'react-native';
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
]);

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for interactions to complete before rendering full app
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => task.cancel();
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.primary }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
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