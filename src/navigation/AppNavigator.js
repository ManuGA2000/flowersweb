// Navigation Configuration - React Navigation v7
// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS } from '../utils/theme';
import { useCart } from '../context/CartContext';

// Screens
import {
  SplashScreen,
  LoginScreen,
  SignUpScreen,
  ForgotPasswordScreen,
  HomeScreen,
  ProductDetailScreen,
  CartScreen,
  CheckoutScreen,
  OrderSuccessScreen,
  OrdersScreen,
  ProfileScreen,
  GalleryScreen,
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const TabNavigator = ({ navigation }) => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Icon name="clipboard-list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={GalleryScreen}
        options={{
          tabBarLabel: 'Gallery',
          tabBarIcon: ({ color, size }) => (
            <Icon name="image-multiple-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: cartCount > 0 ? cartCount : null,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.accent,
            color: COLORS.textWhite,
            fontSize: 10,
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer
      fallback={<SplashScreen />}
      onReady={() => {
        // Optional: Handle navigation ready state
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
        initialRouteName="Splash"
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{
            animationEnabled: false,
          }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen 
          name="SignUp" 
          component={SignUpScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Group
          screenOptions={{
            presentation: 'card',
            animationEnabled: true,
          }}
        >
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator}
            options={{
              animationEnabled: false,
            }}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen}
            options={{
              animationEnabled: true,
              cardStyle: { backgroundColor: COLORS.background },
            }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{
              animationEnabled: true,
              cardStyle: { backgroundColor: COLORS.background },
            }}
          />
          <Stack.Screen 
            name="OrderSuccess" 
            component={OrderSuccessScreen}
            options={{
              animationEnabled: true,
              cardStyle: { backgroundColor: COLORS.background },
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;