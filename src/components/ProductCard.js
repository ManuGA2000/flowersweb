// Enhanced Product Card Component - Removed badges and pricing
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
import { FLOWER_COLORS } from '../data/flowerData';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const ProductCard = ({ product, onPress, variant = 'default' }) => {
  const colors = FLOWER_COLORS[product.type] || [];
  const displayColors = colors.slice(0, 5);
  const hasMoreColors = colors.length > 5;

  // Get default image based on color
  const defaultColor = colors[0];
  const productImage = defaultColor?. image || product.image || 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

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
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles. imageGradient}
        />

        {/* Color Count Badge */}
        {colors.length > 0 && (
          <View style={styles. colorCountBadge}>
            <Icon name="palette" size={12} color={COLORS.white} />
            <Text style={styles.colorCountText}>{colors.length} colors</Text>
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
                key={color.id} 
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color. hex },
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
    ... SHADOWS.card,
  },
  containerHorizontal:  {
    width: '100%',
    flexDirection: 'row',
  },
  imageContainer: {
    width: '100%',
    height:  CARD_WIDTH * 0.9,
    backgroundColor: COLORS.backgroundDark,
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
  imageGradient:  {
    position: 'absolute',
    bottom: 0,
    left:  0,
    right: 0,
    height: 60,
  },
  colorCountBadge: {
    position: 'absolute',
    bottom: 8,
    right:  8,
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
  info:  {
    padding: 12,
  },
  name:  {
    fontSize: SIZES. md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection:  'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating:  {
    fontSize: SIZES. sm,
    fontWeight: '600',
    color: COLORS. text,
    marginLeft: 4,
  },
  reviews: {
    fontSize:  SIZES.xs,
    color: COLORS. textLight,
    marginLeft: 4,
  },
  colorSwatches: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  bicolorSwatch:  {
    position: 'relative',
  },
  bicolorHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    width:  '50%',
    height: '100%',
  },
  moreColors: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreColorsText: {
    fontSize: 8,
    fontWeight: '600',
    color: COLORS. textSecondary,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingVertical: 10,
    borderRadius:  SIZES.radius,
    gap: 6,
  },
  viewBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
});

export default ProductCard;