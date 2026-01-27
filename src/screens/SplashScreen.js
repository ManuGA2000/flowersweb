// Splash Screen with SVG Logo (with fallback)
// src/screens/SplashScreen.js

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

// Try to import SVG logo - will use fallback if not configured
let GrowteqLogo = null;
try {
  // This requires react-native-svg and react-native-svg-transformer to be configured
  GrowteqLogo = require('../assets/Growteq_Fevicon.svg').default;
} catch (e) {
  console.log('SVG import not available, using fallback icon');
}

const SplashScreen = ({ navigation }) => {
  const { loading, isLoggedIn } = useAuth();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Logo fade in and scale
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // Title fade in
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Subtitle fade in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [logoScale, logoOpacity, textOpacity, subtitleOpacity]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (isLoggedIn) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Login');
        }
      }, 1500);
    }
  }, [loading, isLoggedIn, navigation]);

  // Render logo - SVG if available, otherwise fallback to icon
  const renderLogo = () => {
    // Check if GrowteqLogo is a valid React component
    if (GrowteqLogo && typeof GrowteqLogo === 'function') {
      return <GrowteqLogo width={80} height={80} />;
    }
    
    // Fallback to MaterialCommunityIcons
    return <Icon name="flower-tulip" size={70} color={COLORS.primary} />;
  };

  return (
    <LinearGradient
      colors={COLORS.gradientPrimary || [COLORS.primary, COLORS.primaryDark || '#388E3C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      {/* Logo Container */}
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          {renderLogo()}
        </View>
      </Animated.View>
      
      {/* Title */}
      <Animated.Text style={[styles.title, { opacity: textOpacity }]}>
        Growteq Flowers
      </Animated.Text>
      
      {/* Subtitle */}
      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Fresh Flowers, Fresh Moments
      </Animated.Text>
      
      {/* Decorative elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>by Growteq Agri Farms</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.white || '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.white || '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;