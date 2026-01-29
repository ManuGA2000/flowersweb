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

const COLORS = {
  primary: '#4CAF50',
  white: '#FFFFFF',
};

try {
  const theme = require('./utils/theme');
  if (theme.COLORS) {
    Object.assign(COLORS, theme.COLORS);
  }
} catch (e) {}

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'InteractionManager has been deprecated',
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
  'RCTEventEmitter',
]);

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#FFFFFF', marginTop: 16, fontSize: 16, fontWeight: '500' },
});

const LoadingScreen = () => (
  <View style={[styles.loadingContainer, { backgroundColor: COLORS.primary }]}>
    <ActivityIndicator size="large" color={COLORS.white || '#FFFFFF'} />
    <Text style={styles.loadingText}>Loading GrowteqFlowers...</Text>
  </View>
);

const MainApp = React.memo(() => {
  const [SafeAreaProvider, setSafeAreaProvider] = useState(null);
  const [AuthProvider, setAuthProvider] = useState(null);
  const [CartProvider, setCartProvider] = useState(null);
  const [FlowerDataProvider, setFlowerDataProvider] = useState(null); // ADD THIS
  const [AppNavigator, setAppNavigator] = useState(null);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadModules = async () => {
      try {
        // Step 1: Load SafeAreaProvider
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
        
        // Step 3: Load FlowerDataProvider - ADD THIS STEP
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!mounted) return;
        
        const flowerDataModule = await import('./context/FlowerDataContext');
        if (!mounted) return;
        setFlowerDataProvider(() => flowerDataModule.FlowerDataProvider);
        
        // Step 4: Load CartProvider
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!mounted) return;
        
        const cartModule = await import('./context/CartContext');
        if (!mounted) return;
        setCartProvider(() => cartModule.CartProvider);
        
        // Step 5: Load Navigator
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!mounted) return;
        
        const navModule = await import('./navigation/AppNavigator');
        if (!mounted) return;
        setAppNavigator(() => navModule.default);
        
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

  // ADD FlowerDataProvider to the check
  if (!allLoaded || !SafeAreaProvider || !AuthProvider || !FlowerDataProvider || !CartProvider || !AppNavigator) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        backgroundColor={COLORS.primary} 
        barStyle="light-content" 
      />
      <AuthProvider>
        <FlowerDataProvider>
          <CartProvider>
            <AppNavigator />
          </CartProvider>
        </FlowerDataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
});

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {isReady ? <MainApp /> : <LoadingScreen />}
    </GestureHandlerRootView>
  );
};

export default App;