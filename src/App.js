// Main App Component
// src/App.js

import React, { useEffect, useState, useCallback } from 'react';
import { 
  StatusBar, 
  LogBox, 
  View, 
  ActivityIndicator, 
  Text,
  StyleSheet 
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Theme - import only constants, not heavy modules
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
]);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    fontSize: 16,
  },
});

// Loading screen component
const LoadingScreen = () => (
  <View style={[styles.loadingContainer, { backgroundColor: COLORS.primary }]}>
    <ActivityIndicator size="large" color={COLORS.white || '#FFFFFF'} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Main app content - loaded after delay
const AppContent = React.memo(() => {
  const [providersReady, setProvidersReady] = useState(false);
  const [AuthProvider, setAuthProvider] = useState(null);
  const [CartProvider, setCartProvider] = useState(null);
  const [AppNavigator, setAppNavigator] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadProviders = async () => {
      try {
        // Load providers sequentially with delays
        const authModule = await import('./context/AuthContext');
        if (!mounted) return;
        setAuthProvider(() => authModule.AuthProvider);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const cartModule = await import('./context/CartContext');
        if (!mounted) return;
        setCartProvider(() => cartModule.CartProvider);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const navModule = await import('./navigation/AppNavigator');
        if (!mounted) return;
        setAppNavigator(() => navModule.default);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (mounted) {
          setProvidersReady(true);
        }
      } catch (error) {
        console.log('Error loading providers:', error);
        if (mounted) {
          setProvidersReady(true);
        }
      }
    };

    loadProviders();

    return () => {
      mounted = false;
    };
  }, []);

  if (!providersReady || !AuthProvider || !CartProvider || !AppNavigator) {
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
    // Wait for React Native to be fully initialized
    // This delay is critical for the New Architecture
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {isReady ? <AppContent /> : <LoadingScreen />}
    </GestureHandlerRootView>
  );
};

export default App;