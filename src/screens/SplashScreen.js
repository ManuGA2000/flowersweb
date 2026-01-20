// src\screens\SplashScreen.js

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { loading, isLoggedIn } = useAuth();

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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Icon name="flower-tulip" size={60} color={COLORS.primary} />
        </View>
      </View>
      
      <Text style={styles.title}>Growteq Flowers</Text>
      <Text style={styles.subtitle}>Fresh Flowers, Fresh Moments</Text>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>by Growteq Agri Farms</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textWhite,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});

export default SplashScreen;