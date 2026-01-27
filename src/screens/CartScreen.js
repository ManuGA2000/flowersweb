// Cart Screen - No Pricing
// src/screens/CartScreen.js

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Header, CartItem, Button, EmptyState } from '../components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, getCartCount, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const itemCount = getCartCount();

  // Calculate total stems
  const totalStems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Checkout');
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="My Cart" showBack showCart={false} navigation={navigation} />
        <EmptyState title="Your Cart is Empty" message="Add some beautiful flowers to your cart" />
        <View style={styles.emptyAction}>
          <Button title="Browse Flowers" onPress={() => navigation.navigate('Home')} icon="flower-tulip" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={`My Cart (${cartItems.length})`} 
        showBack 
        showCart={false} 
        navigation={navigation}
        rightComponent={
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Icon name="delete-outline" size={22} color={COLORS.textWhite} />
          </TouchableOpacity>
        }
      />
      <FlatList 
        data={cartItems} 
        renderItem={({ item }) => <CartItem item={item} />} 
        keyExtractor={item => item.id} 
        contentContainerStyle={styles.listContent} 
        showsVerticalScrollIndicator={false} 
      />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{cartItems.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Stems</Text>
              <Text style={styles.summaryValueHighlight}>{totalStems.toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.noteContainer}>
          <Icon name="information-outline" size={18} color={COLORS.primary} />
          <Text style={styles.noteText}>
            Pricing will be confirmed after you submit your request
          </Text>
        </View>

        <Button 
          title="Proceed to Checkout" 
          onPress={handleCheckout} 
          icon="arrow-right" 
          iconPosition="right" 
          style={styles.checkoutBtn} 
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
  clearBtn: { 
    padding: 8 
  },
  listContent: { 
    padding: 16,
    paddingBottom: 200,
  },
  emptyAction: { 
    padding: 24, 
    paddingBottom: 40 
  },
  summaryContainer: { 
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white, 
    padding: 20, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    ...SHADOWS.large,
  },
  summaryCard: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: SIZES.radiusLG,
    padding: 16,
    marginBottom: 12,
  },
  summaryRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  summaryLabel: { 
    fontSize: SIZES.sm, 
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryValue: { 
    fontSize: SIZES.xl, 
    color: COLORS.text, 
    fontWeight: '700' 
  },
  summaryValueHighlight: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    gap: 8,
  },
  noteText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.primary,
    lineHeight: 18,
  },
  checkoutBtn: { 
    marginTop: 0,
  },
});

export default CartScreen;