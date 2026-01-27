// Order Success Screen
// src/screens/OrderSuccessScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/theme';
import { Button } from '../components';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="check" size={60} color={COLORS.white} />
          </View>
        </View>
        <Text style={styles.title}>Request Sent Successfully!</Text>
        <Text style={styles.message}>
          Your order request has been sent via WhatsApp. Our team will review and confirm your order with pricing details shortly.
        </Text>
        {orderId && (
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIdLabel}>Order Reference</Text>
            <Text style={styles.orderId}>#{orderId.slice(-8).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.infoBox}>
          <Icon name="information-outline" size={24} color={COLORS.primary} />
          <Text style={styles.infoText}>
            You will receive a confirmation message on WhatsApp once your order is reviewed and pricing is confirmed.
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button 
          title="View My Orders" 
          onPress={() => navigation.replace('MainTabs', { screen: 'Orders' })} 
          variant="outline" 
          icon="clipboard-list" 
          style={styles.actionBtn} 
        />
        <Button 
          title="Continue Shopping" 
          onPress={() => navigation.replace('MainTabs', { screen: 'Home' })} 
          icon="shopping" 
          style={styles.actionBtn} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24 
  },
  iconContainer: { 
    marginBottom: 32 
  },
  iconCircle: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: COLORS.success, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: COLORS.text, 
    marginBottom: 12, 
    textAlign: 'center' 
  },
  message: { 
    fontSize: SIZES.md, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    lineHeight: 22, 
    paddingHorizontal: 20, 
    marginBottom: 24 
  },
  orderIdContainer: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  orderIdLabel: { 
    fontSize: SIZES.sm, 
    color: COLORS.textSecondary, 
    marginBottom: 4 
  },
  orderId: { 
    fontSize: SIZES.xl, 
    fontWeight: '700', 
    color: COLORS.primary, 
    letterSpacing: 2 
  },
  infoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.primaryMuted || '#E8F5E9', 
    padding: 16, 
    borderRadius: 12,
    marginHorizontal: 16,
  },
  infoText: { 
    flex: 1, 
    fontSize: SIZES.sm, 
    color: COLORS.textSecondary, 
    marginLeft: 12, 
    lineHeight: 20 
  },
  actions: { 
    padding: 24, 
    gap: 12 
  },
  actionBtn: { 
    width: '100%' 
  },
});

export default OrderSuccessScreen;