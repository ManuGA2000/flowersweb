// Enhanced Cart Item Component
// src/components/CartItem.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const formatDate = (date) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Check if this is a new-style cart item with selections
  const hasSelections = item.selectedColor || item.selectedSize;

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.selectedColor?.image || item.image || 'https://via.placeholder.com/100' }}
          style={styles.image}
          resizeMode="cover"
        />
        {item.selectedColor && (
          <View style={[styles.colorDot, { backgroundColor: item.selectedColor.hex }]} />
        )}
      </View>

      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        
        {/* Selections Display */}
        {hasSelections && (
          <View style={styles.selectionsContainer}>
            {item.selectedColor && (
              <View style={styles.selectionTag}>
                <View style={[styles.selectionDot, { backgroundColor: item.selectedColor.hex }]} />
                <Text style={styles.selectionText}>{item.selectedColor.name}</Text>
              </View>
            )}
            {item.selectedSize && (
              <View style={styles.selectionTag}>
                <Icon name="ruler" size={10} color={COLORS.textSecondary} />
                <Text style={styles.selectionText}>{item.selectedSize.label}</Text>
              </View>
            )}
          </View>
        )}

        {/* Delivery Date */}
        {item.requiredDate && (
          <View style={styles.dateContainer}>
            <Icon name="calendar-check" size={12} color={COLORS.primary} />
            <Text style={styles.dateText}>Delivery: {formatDate(item.requiredDate)}</Text>
          </View>
        )}

        {/* Price Info */}
        <View style={styles.priceRow}>
          {hasSelections ? (
            <View style={styles.priceInfo}>
              <Text style={styles.pricePerUnit}>₹{item.pricePerStem}/stem</Text>
              <Text style={styles.quantity}>× {item.quantity} stems</Text>
            </View>
          ) : (
            <Text style={styles.price}>₹{item.price}</Text>
          )}
          
          {/* Quantity Controls */}
          {!hasSelections && (
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={() => decreaseQuantity(item.id)}
              >
                <Icon name="minus" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity 
                style={styles.qtyBtn}
                onPress={() => increaseQuantity(item.id)}
              >
                <Icon name="plus" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Discount Badge */}
        {item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Icon name="tag-outline" size={12} color={COLORS.success} />
            <Text style={styles.discountText}>{Math.round(item.discount * 100)}% off applied</Text>
          </View>
        )}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalPrice}>
            ₹{(item.totalPrice || (item.price * item.quantity)).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Remove Button */}
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => removeFromCart(item.id)}
      >
        <Icon name="close" size={18} color={COLORS.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 12,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: SIZES.radiusSM,
    overflow: 'hidden',
    backgroundColor: COLORS.cream,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  colorDot: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 24,
  },
  name: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  selectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  selectionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  selectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectionText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  dateText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pricePerUnit: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  quantity: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cream,
    borderRadius: SIZES.radiusSM,
    padding: 2,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
    gap: 4,
  },
  discountText: {
    fontSize: 10,
    color: COLORS.success,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartItem;