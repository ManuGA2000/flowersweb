// Orders Screen - My Requests/Orders history
// src/screens/OrdersScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Header } from '../components';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

// Status colors and labels
const STATUS_CONFIG = {
  pending: { color: '#FFC107', bgColor: '#FFF8E1', label: 'Pending' },
  confirmed: { color: '#2196F3', bgColor: '#E3F2FD', label: 'Confirmed' },
  processing: { color: '#9C27B0', bgColor: '#F3E5F5', label: 'Processing' },
  dispatched: { color: '#00BCD4', bgColor: '#E0F7FA', label: 'Dispatched' },
  delivered: { color: '#4CAF50', bgColor: '#E8F5E9', label: 'Delivered' },
  cancelled: { color: '#F44336', bgColor: '#FFEBEE', label: 'Cancelled' },
};

/**
 * Get image URL from order item
 */
const getItemImage = (item) => {
  if (item.displayImage) return item.displayImage;
  if (item.selectedColor?.imageUrl) return item.selectedColor.imageUrl;
  if (item.selectedColor?.image && !item.selectedColor.image.startsWith('/')) {
    return item.selectedColor.image;
  }
  if (item.imageUrl) return item.imageUrl;
  return PLACEHOLDER_IMAGE;
};

/**
 * Order Card Component
 */
const OrderCard = ({ order, onPress }) => {
  const items = order.items || [];
  const itemCount = items.length;
  const totalBunches = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  
  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Get flower names
  const flowerNames = [...new Set(items.map(item => item.name || item.type))].join(', ');

  return (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header Row */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderItemCount}>{itemCount} items</Text>
          <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Item Images Row */}
      <View style={styles.itemImagesRow}>
        {items.slice(0, 4).map((item, index) => (
          <View key={index} style={styles.itemImageContainer}>
            <Image
              source={{ uri: getItemImage(item) }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            {item.quantity > 0 && (
              <View style={styles.itemQuantityBadge}>
                <Text style={styles.itemQuantityText}>{item.quantity}</Text>
              </View>
            )}
          </View>
        ))}
        {items.length > 4 && (
          <View style={styles.moreItemsContainer}>
            <Text style={styles.moreItemsText}>+{items.length - 4}</Text>
          </View>
        )}
      </View>

      {/* Footer Row */}
      <View style={styles.orderFooter}>
        <Text style={styles.flowerNames} numberOfLines={1}>
          {flowerNames || 'Various flowers'}
        </Text>
        <Icon name="chevron-right" size={20} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

const OrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const result = await getUserOrders(user.uid);
      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.error || 'Failed to load orders');
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  const handleOrderPress = (order) => {
    // Navigate to order detail if you have that screen
    // navigation.navigate('OrderDetail', { order });
    console.log('Order pressed:', order.id);
  };

  const handleCreateOrder = () => {
    navigation.navigate('Home');
  };

  const renderOrderCard = ({ item }) => (
    <OrderCard order={item} onPress={() => handleOrderPress(item)} />
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Header
          title="My Requests"
          navigation={navigation}
          showCart={true}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="My Requests"
        navigation={navigation}
        showCart={true}
        rightComponent={
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleCreateOrder}
          >
            <Icon name="plus" size={24} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchOrders}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="clipboard-list-outline" size={48} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>No requests yet</Text>
          <Text style={styles.emptyText}>
            Your order requests will appear here
          </Text>
          <TouchableOpacity style={styles.createBtn} onPress={handleCreateOrder}>
            <Icon name="plus" size={20} color={COLORS.white} />
            <Text style={styles.createBtnText}>Create Request</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  // Order Card Styles
  orderCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderItemCount: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderDate: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SIZES.xs,
    fontWeight: '600',
  },
  itemImagesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  itemImageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  itemQuantityBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  itemQuantityText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  moreItemsContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  flowerNames: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  createBtnText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: SIZES.md,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  retryBtnText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default OrdersScreen;