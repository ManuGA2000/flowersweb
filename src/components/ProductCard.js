// Enhanced Product Card Component - With Firebase Storage Image Support
// src/components/ProductCard.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

/**
 * Helper function to get the best available image URL
 * Prioritizes imageUrl (Firebase Storage) over image (local path)
 */
const getImageUrl = (item) => {
  if (!item) return PLACEHOLDER_IMAGE;
  
  // Check for Firebase Storage URL first (imageUrl field)
  if (item.imageUrl) return item.imageUrl;
  
  // Check for displayImage (set by context/parent)
  if (item.displayImage && !item.displayImage.startsWith('/')) {
    return item.displayImage;
  }
  
  // Check for image field
  if (item.image) {
    // If it's a local path (starts with /), return placeholder
    if (item.image.startsWith('/')) {
      return PLACEHOLDER_IMAGE;
    }
    return item.image;
  }
  
  return PLACEHOLDER_IMAGE;
};

/**
 * Get the best image URL for a product, checking colors array
 */
const getProductImageUrl = (product) => {
  if (!product) return PLACEHOLDER_IMAGE;
  
  // First check product's own displayImage (set by parent/context)
  if (product.displayImage && !product.displayImage.startsWith('/')) {
    return product.displayImage;
  }
  
  // Check product's imageUrl
  if (product.imageUrl) return product.imageUrl;
  
  // Check colors array for images
  const colors = product.colors || [];
  if (colors.length > 0) {
    const firstColor = colors[0];
    // Prioritize imageUrl over image
    if (firstColor.imageUrl) return firstColor.imageUrl;
    if (firstColor.displayImage && !firstColor.displayImage.startsWith('/')) {
      return firstColor.displayImage;
    }
    if (firstColor.image && !firstColor.image.startsWith('/')) {
      return firstColor.image;
    }
  }
  
  // Check product's image field
  if (product.image && !product.image.startsWith('/')) {
    return product.image;
  }
  
  return PLACEHOLDER_IMAGE;
};

const ProductCard = ({ product, onPress, variant = 'default' }) => {
  // Get colors from product (should be set by parent with proper URLs)
  const colors = product.colors || [];
  const displayColors = colors.slice(0, 5);
  const hasMoreColors = colors.length > 5;

  // Get the product image URL
  const productImage = getProductImageUrl(product);

  return (
    <TouchableOpacity 
      style={[styles.container, variant === 'horizontal' && styles.containerHorizontal]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View style={[styles.imageContainer, variant === 'horizontal' && styles.imageContainerHorizontal]}>
        <Image 
          source={{ uri: productImage }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={{ uri: PLACEHOLDER_IMAGE }}
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageGradient}
        />

        {/* Color Count Badge */}
        {colors.length > 0 && (
          <View style={styles.colorCountBadge}>
            <Icon name="palette" size={12} color={COLORS.white} />
            <Text style={styles.colorCountText}>{colors.length} colors</Text>
          </View>
        )}

        {/* Featured Badge */}
        {product.featured && (
          <View style={styles.featuredBadge}>
            <Icon name="star" size={12} color={COLORS.white} />
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={styles.info}>
        {/* Product Name */}
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        
        {/* Rating */}
        {product.rating && (
          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color={COLORS.accent} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews})</Text>
          </View>
        )}

        {/* Color Swatches */}
        {displayColors.length > 0 && (
          <View style={styles.colorSwatches}>
            {displayColors.map((color, index) => (
              <View 
                key={color.id || index} 
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color.hex || '#ccc' },
                  color.bicolor && styles.bicolorSwatch,
                ]}
              >
                {color.bicolor && (
                  <View style={[styles.bicolorHalf, { backgroundColor: color.bicolor }]} />
                )}
              </View>
            ))}
            {hasMoreColors && (
              <View style={styles.moreColors}>
                <Text style={styles.moreColorsText}>+{colors.length - 5}</Text>
              </View>
            )}
          </View>
        )}

        {/* Stock Status */}
        <View style={styles.stockRow}>
          <View style={[
            styles.stockBadge,
            { backgroundColor: product.inStock ? COLORS.successLight : COLORS.errorLight }
          ]}>
            <View style={[
              styles.stockDot,
              { backgroundColor: product.inStock ? COLORS.success : COLORS.error }
            ]} />
            <Text style={[
              styles.stockText,
              { color: product.inStock ? COLORS.success : COLORS.error }
            ]}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>
        </View>

        {/* View Button */}
        <TouchableOpacity 
          style={styles.viewBtn}
          onPress={onPress}
        >
          <Text style={styles.viewBtnText}>View Options</Text>
          <Icon name="arrow-right" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    marginBottom: SIZES.margin,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  containerHorizontal: {
    width: '100%',
    flexDirection: 'row',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    backgroundColor: COLORS.backgroundDark || '#f5f5f5',
    position: 'relative',
  },
  imageContainerHorizontal: {
    width: 120,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  colorCountBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  colorCountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '500',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 4,
  },
  reviews: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  colorSwatches: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 4,
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  bicolorSwatch: {
    position: 'relative',
  },
  bicolorHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
  },
  moreColors: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundDark || '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreColorsText: {
    fontSize: 8,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  stockRow: {
    marginBottom: 10,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '600',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
    gap: 6,
  },
  viewBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
});

export default ProductCard;