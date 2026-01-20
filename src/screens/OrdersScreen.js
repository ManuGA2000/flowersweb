// src\screens\OrdersScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/theme';
import { Header, Loader, EmptyState, Button } from '../components';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';

const OrderCard = ({ order, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return COLORS.success;
      case 'processing': return COLORS.warning;
      case 'delivered': return COLORS.primary;
      case 'cancelled': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items?.slice(0, 2).map((item, index) => (
          <Text key={index} style={styles.itemText} numberOfLines={1}>
            {item.quantity}× {item.name}
          </Text>
        ))}
        {order.items?.length > 2 && (
          <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalAmount}>₹{order.totalAmount?.toFixed(2)}</Text>
      </View>

      {order.whatsappSent && (
        <View style={styles.whatsappBadge}>
          <Icon name="whatsapp" size={14} color={COLORS.whatsapp} />
          <Text style={styles.whatsappText}>Sent via WhatsApp</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const OrdersScreen = ({ navigation }) => {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const result = await getUserOrders(user.uid);
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Header title="My Orders" navigation={navigation} />
        <View style={styles.notLoggedIn}>
          <Icon name="account-lock" size={80} color={COLORS.textLight} />
          <Text style={styles.notLoggedInTitle}>Login Required</Text>
          <Text style={styles.notLoggedInText}>
            Please login to view your order history
          </Text>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Orders" navigation={navigation} />

      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No Orders Yet"
          message="Your order history will appear here"
        />
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderCard 
              order={item}
              onPress={() => navigation.navigate('OrderDetail', { order: item })}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  moreItems: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  whatsappBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  whatsappText: {
    fontSize: SIZES.sm,
    color: COLORS.whatsapp,
    marginLeft: 6,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notLoggedInTitle: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  notLoggedInText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginBtn: {
    paddingHorizontal: 48,
  },
});

export default OrdersScreen;
