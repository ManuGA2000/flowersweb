// Enhanced Product Detail Screen - Fixed Navigation
// src/screens/ProductDetailScreen.js
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, STEM_SIZES, QUANTITY_OPTIONS, SHADOWS } from '../utils/theme';
import { FLOWER_COLORS, FLOWER_NAMES } from '../data/flowerData';
import {
  Button,
  ColorSelector,
  SizeSelector,
  QuantitySelector,
  DatePicker,
  PriceSummary,
} from '../components';
import { useCart } from '../context/CartContext';

const { width, height } = Dimensions. get('window');

const ProductDetailScreen = ({ route, navigation }) => {
  // Validate route params
  if (!route || !route.params || !route.params.product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => {
              if (navigation && typeof navigation.goBack === 'function') {
                navigation.goBack();
              }
            }} 
          />
        </View>
      </SafeAreaView>
    );
  }

  const { product } = route.params;
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  // State for selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [customQuantity, setCustomQuantity] = useState('');
  const [requiredDate, setRequiredDate] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Get available colors for this product type
  const availableColors = FLOWER_COLORS[product.type] || [];
  const availableSizes = STEM_SIZES[product.type] || STEM_SIZES.default;

  // Calculate quantities and discounts
  const quantity = useMemo(() => {
    if (selectedQuantity) return selectedQuantity. value;
    if (customQuantity) return parseInt(customQuantity) || 0;
    return 0;
  }, [selectedQuantity, customQuantity]);

  const discount = useMemo(() => {
    if (selectedQuantity) return selectedQuantity.discount;
    if (customQuantity) {
      const qty = parseInt(customQuantity) || 0;
      if (qty >= 500) return 0.22;
      if (qty >= 200) return 0.18;
      if (qty >= 100) return 0.15;
      if (qty >= 50) return 0.10;
      if (qty >= 20) return 0.05;
    }
    return 0;
  }, [selectedQuantity, customQuantity]);

  const sizeMultiplier = selectedSize?. priceMultiplier || 1;

  // Check if cart item already exists with same options
  const inCart = isInCart(product. id);
  const cartQuantity = getItemQuantity(product.id);

  // Get current image based on selected color
  const currentImage = selectedColor?. image || availableColors[0]?.image || product.image || 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

  // Validate selections
  const isValid = useMemo(() => {
    const hasColor = availableColors.length === 0 || selectedColor;
    const hasSize = selectedSize;
    const hasQuantity = quantity >= 10;
    const hasDate = requiredDate;
    return hasColor && hasSize && hasQuantity && hasDate;
  }, [availableColors, selectedColor, selectedSize, quantity, requiredDate]);

  const formatDate = useCallback((date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!isValid) {
      let message = 'Please select:  ';
      if (availableColors.length > 0 && ! selectedColor) message += '\n• Color';
      if (! selectedSize) message += '\n• Size (stem length)';
      if (quantity < 10) message += '\n• Quantity (min.  10 stems)';
      if (!requiredDate) message += '\n• Delivery date';
      
      Alert.alert('Missing Selection', message);
      return;
    }

    setIsAddingToCart(true);

    setTimeout(() => {
      try {
        const pricePerStem = Math.round(product.basePrice * sizeMultiplier);
        const subtotal = pricePerStem * quantity;
        const discountAmount = Math.round(subtotal * discount);
        const total = subtotal - discountAmount;

        const cartItem = {
          ... product,
          selectedColor:  selectedColor,
          selectedSize: selectedSize,
          quantity:  quantity,
          discount: discount,
          requiredDate: requiredDate,
          pricePerStem: pricePerStem,
          totalPrice: total,
          customQuantity: ! selectedQuantity,
        };

        addToCart(cartItem, quantity);
        
        setIsAddingToCart(false);

        Alert.alert(
          'Added to Cart',
          `${product.name} × ${quantity} stems\n${selectedColor?. name || ''} • ${selectedSize?. label}\nDelivery: ${formatDate(requiredDate)}`,
          [
            { text: 'Continue Shopping', style: 'cancel', onPress: () => {} },
            { 
              text: 'View Cart', 
              onPress:  () => {
                if (navigation && typeof navigation.navigate === 'function') {
                  navigation.navigate('Cart');
                }
              }
            },
          ]
        );
      } catch (error) {
        setIsAddingToCart(false);
        Alert.alert('Error', 'Failed to add item to cart');
        console.error('Add to cart error:', error);
      }
    }, 300);
  }, [isValid, selectedColor, selectedSize, quantity, requiredDate, product, discount, sizeMultiplier, addToCart, navigation, availableColors, formatDate]);

  const handleBuyNow = useCallback(() => {
    if (!isValid) {
      handleAddToCart();
      return;
    }

    setIsAddingToCart(true);

    setTimeout(() => {
      try {
        const pricePerStem = Math.round(product.basePrice * sizeMultiplier);
        const subtotal = pricePerStem * quantity;
        const discountAmount = Math.round(subtotal * discount);
        const total = subtotal - discountAmount;

        const cartItem = {
          ...product,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          quantity: quantity,
          discount:  discount,
          requiredDate:  requiredDate,
          pricePerStem: pricePerStem,
          totalPrice: total,
          customQuantity: ! selectedQuantity,
        };

        addToCart(cartItem, quantity);
        setIsAddingToCart(false);

        // Navigate to Cart
        if (navigation && typeof navigation. navigate === 'function') {
          navigation.navigate('Cart');
        }
      } catch (error) {
        setIsAddingToCart(false);
        Alert.alert('Error', 'Something went wrong.  Please try again.');
        console.error('Buy now error:', error);
      }
    }, 300);
  }, [isValid, product, selectedColor, selectedSize, quantity, discount, requiredDate, sizeMultiplier, addToCart, navigation, handleAddToCart]);

  const handleBackPress = useCallback(() => {
    if (navigation && typeof navigation.goBack === 'function') {
      navigation.goBack();
    }
  }, [navigation]);

  const handleCartPress = useCallback(() => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate('Cart');
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Back & Cart Buttons */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles. cartBtn} 
          onPress={handleCartPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Icon name="cart-outline" size={24} color={COLORS.text} />
          {cartQuantity > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
      >
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: currentImage }} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)']}
            style={styles.heroGradient}
          />

          {/* Product Info Overlay */}
          <View style={styles.heroInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.ratingContainer}>
              {product.rating && (
                <>
                  <Icon name="star" size={16} color={COLORS.accent} />
                  <Text style={styles.rating}>{product.rating}</Text>
                  <Text style={styles.reviews}>({product.reviews} reviews)</Text>
                </>
              )}
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Base Price */}
          <View style={styles.priceHeader}>
            <View>
              <Text style={styles. priceLabel}>Starting from</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.basePrice}</Text>
                <Text style={styles.priceUnit}>per stem</Text>
              </View>
            </View>
            <View style={styles. stockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>In Stock</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <View style={styles.section}>
              <ColorSelector
                colors={availableColors}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                showImages={true}
                label="Select Color"
              />
            </View>
          )}

          {/* Size Selection (Stem Length) */}
          <View style={styles.section}>
            <SizeSelector
              productType={product.type}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              basePrice={product.basePrice}
              label="Select Size (Stem Length)"
            />
          </View>

          {/* Quantity Selection */}
          <View style={styles.section}>
            <QuantitySelector
              selectedQuantity={selectedQuantity}
              onSelectQuantity={setSelectedQuantity}
              customQuantity={customQuantity}
              onCustomQuantityChange={setCustomQuantity}
              basePrice={product.basePrice}
              label="Select Quantity"
            />
          </View>

          {/* Delivery Date Selection */}
          <View style={styles.section}>
            <DatePicker
              selectedDate={requiredDate}
              onSelectDate={setRequiredDate}
              minDays={1}
              maxDays={30}
              label="Required Delivery Date"
            />
          </View>

          {/* Price Summary */}
          <View style={styles.section}>
            <PriceSummary
              basePrice={product.basePrice}
              quantity={quantity}
              sizeMultiplier={sizeMultiplier}
              discount={discount}
              showBreakdown={true}
            />
          </View>

          {/* Spacer for bottom bar */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          {/* Quick Summary */}
          {quantity > 0 && (
            <View style={styles.quickSummary}>
              <Text style={styles.quickSummaryText}>
                {quantity} stems • {selectedSize?. label || 'Select size'}
              </Text>
            </View>
          )}
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Add to Cart"
              onPress={handleAddToCart}
              variant="outline"
              icon="cart-plus"
              size="medium"
              fullWidth={true}
              disabled={! isValid || isAddingToCart}
              loading={isAddingToCart}
              style={styles.actionBtn}
            />
            <Button
              title="Buy Now"
              onPress={handleBuyNow}
              variant="primary"
              icon="flash"
              size="medium"
              fullWidth={true}
              disabled={!isValid || isAddingToCart}
              loading={isAddingToCart}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize:  SIZES.lg,
    color: COLORS. error,
    marginBottom: 16,
    textAlign: 'center',
  },
  headerOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems:  'center',
    ... SHADOWS.medium,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems:  'center',
    ... SHADOWS.medium,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.accent,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS. white,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    width: width,
    height: height * 0.45,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient:  {
    position: 'absolute',
    bottom: 0,
    left:  0,
    right: 0,
    height: 120,
  },
  heroInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  productName: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS. white,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  ratingContainer: {
    flexDirection:  'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS. white,
  },
  reviews: {
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius:  SIZES.radiusXL,
    borderTopRightRadius: SIZES.radiusXL,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
    minHeight: height * 0.6,
  },
  priceHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderBottomWidth:  1,
    borderBottomColor: COLORS.border,
  },
  priceLabel: {
    fontSize:  SIZES.sm,
    color: COLORS. textSecondary,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price:  {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS. primary,
  },
  priceUnit: {
    fontSize:  SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  stockText: {
    fontSize:  SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  section:  {
    marginBottom: 16,
  },
  description:  {
    fontSize: SIZES. md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left:  0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusXL,
    borderTopRightRadius: SIZES.radiusXL,
    ... SHADOWS.large,
  },
  bottomBarContent: {
    padding: 16,
    paddingBottom: 24,
  },
  quickSummary: {
    backgroundColor: COLORS.backgroundDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES. radiusSM,
    marginBottom:  12,
    alignItems: 'center',
  },
  quickSummaryText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
});

export default ProductDetailScreen;