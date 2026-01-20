// src\screens\CartScreen.js

import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/theme';
import { Header, CartItem, Button, EmptyState } from '../components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const { isLoggedIn } = useAuth();
  const total = getCartTotal();
  const itemCount = getCartCount();

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
        title={`My Cart (${itemCount})`} 
        showBack 
        showCart={false} 
        navigation={navigation}
        rightComponent={
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Icon name="delete-outline" size={22} color={COLORS.textWhite} />
          </TouchableOpacity>
        }
      />
      <FlatList data={cartItems} renderItem={({ item }) => <CartItem item={item} />} keyExtractor={item => item.id} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal ({itemCount} items)</Text>
          <Text style={styles.summaryValue}>₹{total.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.deliveryText}>Calculated at checkout</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
        </View>
        <Button title="Proceed to Checkout" onPress={handleCheckout} icon="arrow-right" iconPosition="right" style={styles.checkoutBtn} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  clearBtn: { padding: 8 },
  listContent: { padding: 16 },
  emptyAction: { padding: 24, paddingBottom: 40 },
  summaryContainer: { backgroundColor: COLORS.white, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  summaryLabel: { fontSize: SIZES.md, color: COLORS.textSecondary },
  summaryValue: { fontSize: SIZES.md, color: COLORS.text, fontWeight: '500' },
  deliveryText: { fontSize: SIZES.sm, color: COLORS.textLight, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  totalLabel: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text },
  totalValue: { fontSize: 24, fontWeight: '700', color: COLORS.primary },
  checkoutBtn: { marginTop: 16 },
});

export default CartScreen;