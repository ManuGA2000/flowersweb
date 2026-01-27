// Enhanced Product Detail Screen - With proper Firebase Storage image handling
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
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import {
  Button,
  ColorSelector,
  SizeSelector,
  DatePicker,
} from '../components';
import { useCart } from '../context/CartContext';
import { useFlowerData } from '../context/FlowerDataContext';

const { width, height } = Dimensions.get('window');

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

/**
 * Helper function to get the best available image URL
 * Prioritizes imageUrl (Firebase Storage) over image (local path)
 */
const getImageUrl = (item) => {
  if (!item) return PLACEHOLDER_IMAGE;
  
  // Check for Firebase Storage URL first
  if (item.imageUrl) return item.imageUrl;
  
  // Check for displayImage (set by context)
  if (item.displayImage && !item.displayImage.startsWith('/')) {
    return item.displayImage;
  }
  
  // Check for image field (might be local path or URL)
  if (item.image) {
    // If it's a local path (starts with /), return placeholder
    if (item.image.startsWith('/')) {
      return PLACEHOLDER_IMAGE;
    }
    return item.image;
  }
  
  return PLACEHOLDER_IMAGE;
};

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
  const { getProductColors, getProductSizes, appSettings, getColorImageUrl } = useFlowerData();
  
  // Get minimum quantity from settings
  const MIN_QUANTITY = appSettings?.minimumOrderQuantity || 50;
  
  // Quick quantity options from settings
  const QUANTITY_OPTIONS = [
    ...(appSettings?.quantityOptions || [50, 100, 200, 500]).map(val => ({ label: val.toString(), value: val })),
    { label: 'Custom', value: 'custom' },
  ];
  
  // State for selections
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantityOption, setSelectedQuantityOption] = useState(null);
  const [customQuantity, setCustomQuantity] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [requiredDate, setRequiredDate] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showMinQuantityModal, setShowMinQuantityModal] = useState(false);
  
  // Get available colors for this product type from Firebase
  // The colors now include displayImage field with proper URLs
  const availableColors = useMemo(() => {
    const colors = getProductColors(product.type) || [];
    // Ensure each color has a proper image URL
    return colors.map(color => ({
      ...color,
      // Use the helper to get the best available image
      image: getImageUrl(color),
    }));
  }, [getProductColors, product.type]);

  const availableSizes = getProductSizes(product.type) || [];

  // Calculate quantity
  const quantity = useMemo(() => {
    if (selectedQuantityOption && selectedQuantityOption !== 'custom') {
      return selectedQuantityOption;
    }
    if (customQuantity) {
      return parseInt(customQuantity) || 0;
    }
    return 0;
  }, [selectedQuantityOption, customQuantity]);

  // Check if cart item already exists with same options
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  // Get current image based on selected color
  // This now properly uses Firebase Storage URLs
  const currentImage = useMemo(() => {
    if (selectedColor) {
      return getImageUrl(selectedColor);
    }
    if (availableColors.length > 0) {
      return getImageUrl(availableColors[0]);
    }
    return getImageUrl(product);
  }, [selectedColor, availableColors, product]);

  // Validate selections
  const isValid = useMemo(() => {
    const hasColor = availableColors.length === 0 || selectedColor;
    const hasSize = selectedSize;
    const hasQuantity = quantity >= MIN_QUANTITY;
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

  const handleQuantityOptionSelect = (option) => {
    if (option.value === 'custom') {
      setShowCustomInput(true);
      setSelectedQuantityOption(null);
      setCustomQuantity('');
    } else {
      setShowCustomInput(false);
      setSelectedQuantityOption(option.value);
      setCustomQuantity('');
    }
  };

  const handleCustomQuantityChange = (text) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setCustomQuantity(numericValue);
  };

  const handleCustomQuantityBlur = () => {
    const qty = parseInt(customQuantity) || 0;
    if (qty > 0 && qty < MIN_QUANTITY) {
      setShowMinQuantityModal(true);
    }
  };

  const handleColorSelect = useCallback((color) => {
    // Ensure the color has proper image URL when selected
    const colorWithImage = {
      ...color,
      image: getImageUrl(color),
    };
    setSelectedColor(colorWithImage);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!isValid) {
      let message = 'Please select:';
      if (availableColors.length > 0 && !selectedColor) message += '\n• Color';
      if (!selectedSize) message += '\n• Size (stem length)';
      if (quantity < MIN_QUANTITY) message += `\n• Quantity (min. ${MIN_QUANTITY} stems)`;
      if (!requiredDate) message += '\n• Delivery date';
      
      if (quantity > 0 && quantity < MIN_QUANTITY) {
        setShowMinQuantityModal(true);
        return;
      }
      
      Alert.alert('Missing Selection', message);
      return;
    }

    setIsAddingToCart(true);

    setTimeout(() => {
      try {
        const cartItem = {
          ...product,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          quantity: quantity,
          requiredDate: requiredDate,
          customQuantity: showCustomInput,
          // Include the proper image URL for cart display
          displayImage: currentImage,
        };

        addToCart(cartItem, quantity);
        
        setIsAddingToCart(false);

        Alert.alert(
          'Added to Cart',
          `${product.name} × ${quantity} stems\n${selectedColor?.name || ''} • ${selectedSize?.label}\nDelivery: ${formatDate(requiredDate)}`,
          [
            { text: 'Continue Shopping', style: 'cancel', onPress: () => {} },
            { 
              text: 'View Cart', 
              onPress: () => {
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
  }, [isValid, selectedColor, selectedSize, quantity, requiredDate, product, addToCart, navigation, availableColors, formatDate, showCustomInput, currentImage]);

  const handleSubmitRequest = useCallback(() => {
    if (!isValid) {
      handleAddToCart();
      return;
    }

    setIsAddingToCart(true);

    setTimeout(() => {
      try {
        const cartItem = {
          ...product,
          selectedColor: selectedColor,
          selectedSize: selectedSize,
          quantity: quantity,
          requiredDate: requiredDate,
          customQuantity: showCustomInput,
          displayImage: currentImage,
        };

        addToCart(cartItem, quantity);
        setIsAddingToCart(false);

        // Navigate to Cart
        if (navigation && typeof navigation.navigate === 'function') {
          navigation.navigate('Cart');
        }
      } catch (error) {
        setIsAddingToCart(false);
        Alert.alert('Error', 'Something went wrong. Please try again.');
        console.error('Submit request error:', error);
      }
    }, 300);
  }, [isValid, product, selectedColor, selectedSize, quantity, requiredDate, addToCart, navigation, handleAddToCart, showCustomInput, currentImage]);

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
      {/* Minimum Quantity Modal */}
      <Modal
        visible={showMinQuantityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMinQuantityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon name="information" size={40} color={COLORS.warning} />
            </View>
            <Text style={styles.modalTitle}>Minimum Order Quantity</Text>
            <Text style={styles.modalMessage}>
              Minimum order quantity is {MIN_QUANTITY} units. Please enter a quantity of {MIN_QUANTITY} or more to proceed.
            </Text>
            <Button
              title="Got it"
              onPress={() => setShowMinQuantityModal(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

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
          style={styles.cartBtn} 
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
            defaultSource={{ uri: PLACEHOLDER_IMAGE }}
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
          {/* Stock Status */}
          <View style={styles.stockHeader}>
            <View style={styles.stockBadge}>
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
                onSelectColor={handleColorSelect}
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
              label="Select Size (Stem Length)"
              showPrice={false}
            />
          </View>

          {/* Quantity Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Select Quantity</Text>
            <Text style={styles.minQuantityNote}>Minimum order: {MIN_QUANTITY} stems</Text>
            
            {/* Quick Quantity Options */}
            <View style={styles.quantityOptionsContainer}>
              {QUANTITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.label}
                  style={[
                    styles.quantityOption,
                    (option.value === 'custom' && showCustomInput) && styles.quantityOptionSelected,
                    (option.value !== 'custom' && selectedQuantityOption === option.value) && styles.quantityOptionSelected,
                  ]}
                  onPress={() => handleQuantityOptionSelect(option)}
                >
                  <Text style={[
                    styles.quantityOptionText,
                    ((option.value === 'custom' && showCustomInput) || selectedQuantityOption === option.value) && styles.quantityOptionTextSelected,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom Quantity Input */}
            {showCustomInput && (
              <View style={styles.customInputContainer}>
                <Text style={styles.customInputLabel}>Enter quantity:</Text>
                <View style={styles.customInputWrapper}>
                  <TextInput
                    style={styles.customInput}
                    value={customQuantity}
                    onChangeText={handleCustomQuantityChange}
                    onBlur={handleCustomQuantityBlur}
                    placeholder={`Min. ${MIN_QUANTITY}`}
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                  <Text style={styles.customInputSuffix}>stems</Text>
                </View>
                {customQuantity && parseInt(customQuantity) < MIN_QUANTITY && parseInt(customQuantity) > 0 && (
                  <View style={styles.quantityWarning}>
                    <Icon name="alert-circle" size={14} color={COLORS.warning} />
                    <Text style={styles.quantityWarningText}>
                      Minimum {MIN_QUANTITY} stems required
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Selected Quantity Display */}
            {quantity >= MIN_QUANTITY && (
              <View style={styles.selectedQuantityDisplay}>
                <Icon name="check-circle" size={18} color={COLORS.success} />
                <Text style={styles.selectedQuantityText}>
                  {quantity} stems selected
                </Text>
              </View>
            )}
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

          {/* Order Summary */}
          {quantity >= MIN_QUANTITY && selectedSize && (
            <View style={styles.section}>
              <View style={styles.orderSummaryCard}>
                <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                <View style={styles.orderSummaryRow}>
                  <Text style={styles.orderSummaryLabel}>Product</Text>
                  <Text style={styles.orderSummaryValue}>{product.name}</Text>
                </View>
                {selectedColor && (
                  <View style={styles.orderSummaryRow}>
                    <Text style={styles.orderSummaryLabel}>Color</Text>
                    <View style={styles.orderSummaryColorValue}>
                      <View style={[styles.orderSummaryColorDot, { backgroundColor: selectedColor.hex }]} />
                      <Text style={styles.orderSummaryValue}>{selectedColor.name}</Text>
                    </View>
                  </View>
                )}
                <View style={styles.orderSummaryRow}>
                  <Text style={styles.orderSummaryLabel}>Size</Text>
                  <Text style={styles.orderSummaryValue}>{selectedSize.label}</Text>
                </View>
                <View style={styles.orderSummaryRow}>
                  <Text style={styles.orderSummaryLabel}>Quantity</Text>
                  <Text style={styles.orderSummaryValue}>{quantity} stems</Text>
                </View>
                {requiredDate && (
                  <View style={styles.orderSummaryRow}>
                    <Text style={styles.orderSummaryLabel}>Delivery Date</Text>
                    <Text style={styles.orderSummaryValue}>{formatDate(requiredDate)}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Spacer for bottom bar */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarContent}>
          {/* Quick Summary */}
          {quantity >= MIN_QUANTITY && (
            <View style={styles.quickSummary}>
              <Text style={styles.quickSummaryText}>
                {quantity} stems • {selectedSize?.label || 'Select size'}
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
              disabled={!isValid || isAddingToCart}
              loading={isAddingToCart}
              style={styles.actionBtn}
            />
            <Button
              title="Submit Request"
              onPress={handleSubmitRequest}
              variant="primary"
              icon="send"
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
    fontSize: SIZES.lg,
    color: COLORS.error,
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
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
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
    color: COLORS.white,
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
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
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
    color: COLORS.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
  },
  reviews: {
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusXL,
    borderTopRightRadius: SIZES.radiusXL,
    marginTop: -20,
    paddingTop: 20,
    paddingHorizontal: 16,
    minHeight: height * 0.6,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  minQuantityNote: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  quantityOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quantityOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    minWidth: 70,
    alignItems: 'center',
  },
  quantityOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  quantityOptionText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  quantityOptionTextSelected: {
    color: COLORS.primary,
  },
  customInputContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: SIZES.radius,
  },
  customInputLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  customInput: {
    flex: 1,
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    paddingVertical: 14,
  },
  customInputSuffix: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  quantityWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  quantityWarningText: {
    fontSize: SIZES.sm,
    color: COLORS.warning,
  },
  selectedQuantityDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.successLight,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  selectedQuantityText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
  },
  orderSummaryCard: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: SIZES.radiusLG,
    padding: 16,
  },
  orderSummaryTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderSummaryLabel: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  orderSummaryValue: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderSummaryColorValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderSummaryColorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusXL,
    borderTopRightRadius: SIZES.radiusXL,
    ...SHADOWS.large,
  },
  bottomBarContent: {
    padding: 16,
    paddingBottom: 24,
  },
  quickSummary: {
    backgroundColor: COLORS.backgroundDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusSM,
    marginBottom: 12,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.warningLight || '#FFF3CD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButton: {
    width: '100%',
  },
});

export default ProductDetailScreen;