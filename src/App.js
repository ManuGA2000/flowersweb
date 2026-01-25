// Main App Component
// src/App.js
// WORKAROUND for react-native-safe-area-context RCTEventEmitter crash on RN 0.83

import React, { useEffect, useState, useCallback } from 'react';
import { 
  StatusBar, 
  LogBox, 
  View, 
  ActivityIndicator, 
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Theme constants
const COLORS = {
  primary: '#4CAF50',
  white: '#FFFFFF',
};

// Try to import theme if it exists
try {
  const theme = require('./utils/theme');
  if (theme.COLORS) {
    Object.assign(COLORS, theme.COLORS);
  }
} catch (e) {
  // Use default colors
}

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'InteractionManager has been deprecated',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
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

// Loading screen component - NO SafeAreaProvider here
const LoadingScreen = () => (
  <View style={[styles.loadingContainer, { backgroundColor: COLORS.primary }]}>
    <ActivityIndicator size="large" color={COLORS.white || '#FFFFFF'} />
    <Text style={styles.loadingText}>Loading GrowteqFlowers...</Text>
  </View>
);

// Main app content - SafeAreaProvider is loaded here AFTER delay
const MainApp = React.memo(() => {
  const [SafeAreaProvider, setSafeAreaProvider] = useState(null);
  const [AuthProvider, setAuthProvider] = useState(null);
  const [CartProvider, setCartProvider] = useState(null);
  const [AppNavigator, setAppNavigator] = useState(null);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadModules = async () => {
      try {
        // Step 1: Load SafeAreaProvider with delay
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!mounted) return;
        
        const safeAreaModule = await import('react-native-safe-area-context');
        if (!mounted) return;
        setSafeAreaProvider(() => safeAreaModule.SafeAreaProvider);
        
        // Step 2: Load AuthProvider
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!mounted) return;
        
        const authModule = await import('./context/AuthContext');
        if (!mounted) return;
        setAuthProvider(() => authModule.AuthProvider);
        
        // Step 3: Load CartProvider
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!mounted) return;
        
        const cartModule = await import('./context/CartContext');
        if (!mounted) return;
        setCartProvider(() => cartModule.CartProvider);
        
        // Step 4: Load Navigator
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!mounted) return;
        
        const navModule = await import('./navigation/AppNavigator');
        if (!mounted) return;
        setAppNavigator(() => navModule.default);
        
        // All loaded
        if (mounted) {
          setAllLoaded(true);
        }
      } catch (error) {
        console.log('Error loading modules:', error);
      }
    };

    loadModules();

    return () => {
      mounted = false;
    };
  }, []);

  // Show loading while modules load
  if (!allLoaded || !SafeAreaProvider || !AuthProvider || !CartProvider || !AppNavigator) {
    return <LoadingScreen />;
  }

  return (
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
  );
});

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Critical: Wait for RN event system to fully initialize
    // This delay prevents the RCTEventEmitter crash
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000); // 3 second delay for safety

    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {isReady ? <MainApp /> : <LoadingScreen />}
    </GestureHandlerRootView>
  );
};

export default App;