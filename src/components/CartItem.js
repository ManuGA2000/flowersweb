// Enhanced Cart Item Component - With Firebase Storage Image Support
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

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

/**
 * Helper function to get the best available image URL
 * Prioritizes imageUrl (Firebase Storage) over image (local path)
 */
const getImageUrl = (item) => {
  if (!item) return PLACEHOLDER_IMAGE;
  
  // Check for displayImage first (set when adding to cart)
  if (item.displayImage && !item.displayImage.startsWith('/')) {
    return item.displayImage;
  }
  
  // Check selectedColor for image
  if (item.selectedColor) {
    if (item.selectedColor.imageUrl) return item.selectedColor.imageUrl;
    if (item.selectedColor.displayImage && !item.selectedColor.displayImage.startsWith('/')) {
      return item.selectedColor.displayImage;
    }
    if (item.selectedColor.image && !item.selectedColor.image.startsWith('/')) {
      return item.selectedColor.image;
    }
  }
  
  // Check item's own imageUrl
  if (item.imageUrl) return item.imageUrl;
  
  // Check item's image field
  if (item.image && !item.image.startsWith('/')) {
    return item.image;
  }
  
  return PLACEHOLDER_IMAGE;
};

const CartItem = ({ item }) => {
  const { removeFromCart } = useCart();

  const formatDate = (date) => {
    if (!date) return 'Not set';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Get the best image URL
  const imageUrl = getImageUrl(item);

  // Check if this is a new-style cart item with selections
  const hasSelections = item.selectedColor || item.selectedSize;

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={{ uri: PLACEHOLDER_IMAGE }}
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

        {/* Quantity Display */}
        <View style={styles.quantityContainer}>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityNumber}>{item.quantity}</Text>
            <Text style={styles.quantityLabel}>stems</Text>
          </View>
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
    backgroundColor: COLORS.cream || '#f5f5f5',
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
    backgroundColor: COLORS.backgroundDark || '#f0f0f0',
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
    marginBottom: 8,
  },
  dateText: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quantityBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radius,
    gap: 4,
  },
  quantityNumber: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  quantityLabel: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.errorLight || '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartItem;