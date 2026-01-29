// Cart Screen - Order Summary with grouped items
// src/screens/CartScreen.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Header } from '../components';
import { useCart } from '../context/CartContext';

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

// Flower names mapping
const flowerNames = {
  roses: 'Roses',
  chrysanthemums: 'Chrysanthemums',
  gypsophila: 'Gypsophila',
  lisianthus: 'Lisianthus',
  limonium: 'Limonium',
  carnation: 'Carnation',
  eucalyptus: 'Eucalyptus',
  'song-of-india': 'Song of India',
  'song-of-jamaica': 'Song of Jamaica',
  eustoma: 'Eustoma',
};

/**
 * Get the best available image URL
 */
const getImageUrl = (item) => {
  if (!item) return PLACEHOLDER_IMAGE;
  if (item.displayImage) return item.displayImage;
  if (item.selectedColor?.imageUrl) return item.selectedColor.imageUrl;
  if (item.selectedColor?.image && !item.selectedColor.image.startsWith('/')) {
    return item.selectedColor.image;
  }
  if (item.imageUrl) return item.imageUrl;
  if (item.image && !item.image.startsWith('/')) return item.image;
  return PLACEHOLDER_IMAGE;
};

/**
 * Cart Item Card Component
 */
const CartItemCard = ({ item, onRemove }) => {
  const imageUrl = getImageUrl(item);
  const flowerName = flowerNames[item.type] || item.name || 'Flower';
  const colorName = item.selectedColor?.name || 'Unknown';
  const stemLength = item.selectedSize?.label || '';

  return (
    <View style={styles.cartItem}>
      {/* Item Image */}
      <View style={styles.itemImageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </View>

      {/* Item Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemFlowerName}>{flowerName}</Text>
        <Text style={styles.itemColorName}>{colorName}</Text>
        
        {/* Tags */}
        <View style={styles.itemTags}>
          {stemLength && (
            <View style={styles.itemTag}>
              <Icon name="ruler" size={12} color={COLORS.primary} />
              <Text style={styles.itemTagText}>{stemLength}</Text>
            </View>
          )}
          <View style={styles.itemTag}>
            <Text style={styles.itemTagText}>{item.quantity} bunches</Text>
          </View>
        </View>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => onRemove(item.id)}
      >
        <Icon name="trash-can-outline" size={20} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart, getTotalStems } = useCart();

  // Group cart items by flower type
  const groupedItems = useMemo(() => {
    const groups = {};
    
    cartItems.forEach(item => {
      const flowerType = item.type || 'unknown';
      if (!groups[flowerType]) {
        groups[flowerType] = {
          name: flowerNames[flowerType] || item.name || 'Flower',
          items: [],
          totalBunches: 0,
        };
      }
      groups[flowerType].items.push(item);
      groups[flowerType].totalBunches += item.quantity || 0;
    });

    return groups;
  }, [cartItems]);

  const totalBunches = getTotalStems();
  const itemCount = cartItems.length;

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(itemId) },
      ]
    );
  };

  const handleContinue = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleAddMore = () => {
    navigation.navigate('Home');
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Header
          title="Cart"
          navigation={navigation}
          showBack={true}
          showCart={false}
        />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Icon name="cart-plus" size={48} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Add some flowers to get started</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={handleAddMore}>
            <Text style={styles.browseBtnText}>Browse Flowers</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={`Cart (${itemCount})`}
        navigation={navigation}
        showBack={true}
        showCart={false}
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryBadge}>
              <Icon name="package-variant" size={16} color={COLORS.primary} />
              <Text style={styles.summaryBadgeText}>{totalBunches} bunches</Text>
            </View>
          </View>

          {/* Grouped Items by Flower Type */}
          {Object.keys(groupedItems).map((flowerType, groupIndex) => {
            const group = groupedItems[flowerType];
            return (
              <View 
                key={flowerType} 
                style={[
                  styles.flowerGroup,
                  groupIndex === Object.keys(groupedItems).length - 1 && styles.lastGroup,
                ]}
              >
                {/* Group Header */}
                <View style={styles.groupHeader}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupTotal}>{group.totalBunches} bunches</Text>
                </View>

                {/* Items */}
                {group.items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </View>
            );
          })}
        </View>

        {/* Add More Flowers */}
        <TouchableOpacity
          style={styles.addMoreBtn}
          onPress={handleAddMore}
        >
          <Icon name="plus" size={20} color={COLORS.primary} />
          <Text style={styles.addMoreText}>Add More Flowers</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.sendRequestBtn}
          onPress={handleContinue}
        >
          <Icon name="send" size={20} color={COLORS.white} />
          <Text style={styles.sendRequestText}>Continue to Send Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  summaryBadgeText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  flowerGroup: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastGroup: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  groupTotal: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.backgroundDark || '#F5F5F5',
    borderRadius: SIZES.radius,
    marginBottom: 8,
    gap: 12,
  },
  itemImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.border,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemFlowerName: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  itemColorName: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  itemTags: {
    flexDirection: 'row',
    gap: 6,
  },
  itemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  itemTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.primary,
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusLG,
    backgroundColor: COLORS.white,
    gap: 8,
  },
  addMoreText: {
    fontSize: SIZES.md,
    fontWeight: '500',
    color: COLORS.primary,
  },
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
    backgroundColor: COLORS.backgroundDark || '#F5F5F5',
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
    marginBottom: 24,
  },
  browseBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  browseBtnText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
  },
  sendRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusLG,
    gap: 8,
  },
  sendRequestText: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
});

export default CartScreen;