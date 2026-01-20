// Enhanced Checkout Screen
// src/screens/CheckoutScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Header, Input, Button, DatePicker } from '../components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { sendOrderViaWhatsApp } from '../services/whatsappService';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState({
    street: '',
    landmark: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate totals
  const orderSummary = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalStems = 0;

    cartItems.forEach(item => {
      if (item.totalPrice) {
        subtotal += item.pricePerStem * item.quantity;
        totalDiscount += Math.round((item.pricePerStem * item.quantity) * item.discount);
        totalStems += item.quantity;
      } else {
        subtotal += item.price * item.quantity;
      }
    });

    const deliveryFee = deliveryType === 'delivery' ? (subtotal > 5000 ? 0 : 200) : 0;
    const total = subtotal - totalDiscount + deliveryFee;

    return {
      subtotal,
      totalDiscount,
      deliveryFee,
      total,
      totalStems,
      freeDeliveryThreshold: 5000,
    };
  }, [cartItems, deliveryType]);

  const validateForm = () => {
    if (deliveryType === 'delivery') {
      if (!address.street.trim()) {
        Alert.alert('Error', 'Please enter delivery address');
        return false;
      }
      if (!address.city.trim()) {
        Alert.alert('Error', 'Please enter city');
        return false;
      }
      if (!address.pincode.trim()) {
        Alert.alert('Error', 'Please enter pincode');
        return false;
      }
      if (address.pincode.length !== 6) {
        Alert.alert('Error', 'Please enter valid 6-digit pincode');
        return false;
      }
    }
    return true;
  };

  const handleSendOrder = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: userProfile?.name || user.displayName || '',
        userPhone: userProfile?.phone || '',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
          quantity: item.quantity,
          pricePerStem: item.pricePerStem || item.price,
          totalPrice: item.totalPrice || (item.price * item.quantity),
          discount: item.discount || 0,
          requiredDate: item.requiredDate,
          image: item.selectedColor?.image || item.image,
        })),
        subtotal: orderSummary.subtotal,
        totalDiscount: orderSummary.totalDiscount,
        deliveryFee: orderSummary.deliveryFee,
        totalAmount: orderSummary.total,
        deliveryType,
        address: deliveryType === 'delivery' ? address : null,
        notes: notes.trim(),
        whatsappSent: false,
      };

      const orderResult = await createOrder(orderData);
      if (!orderResult.success) {
        Alert.alert('Error', 'Failed to create order. Please try again.');
        setLoading(false);
        return;
      }

      const userInfo = {
        name: userProfile?.name || user.displayName || 'Customer',
        email: user.email,
        phone: userProfile?.phone || '',
      };

      const whatsappResult = await sendOrderViaWhatsApp(orderData, userInfo);
      if (whatsappResult.success) {
        clearCart();
        navigation.replace('OrderSuccess', { orderId: orderResult.orderId });
      } else {
        Alert.alert('WhatsApp Error', whatsappResult.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Checkout"
        showBack
        showCart={false}
        navigation={navigation}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Type Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="truck-delivery-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Delivery Method</Text>
          </View>
          <View style={styles.deliveryOptions}>
            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryType === 'delivery' && styles.deliveryOptionSelected,
              ]}
              onPress={() => setDeliveryType('delivery')}
            >
              <View style={[
                styles.deliveryIcon,
                deliveryType === 'delivery' && styles.deliveryIconSelected,
              ]}>
                <Icon
                  name="truck-delivery"
                  size={24}
                  color={deliveryType === 'delivery' ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={[
                  styles.deliveryOptionText,
                  deliveryType === 'delivery' && styles.deliveryOptionTextSelected,
                ]}>
                  Home Delivery
                </Text>
                <Text style={styles.deliverySubtext}>
                  {orderSummary.subtotal >= orderSummary.freeDeliveryThreshold
                    ? 'Free delivery'
                    : `₹200 delivery fee`}
                </Text>
              </View>
              {deliveryType === 'delivery' && (
                <Icon name="check-circle" size={22} color={COLORS.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deliveryOption,
                deliveryType === 'pickup' && styles.deliveryOptionSelected,
              ]}
              onPress={() => setDeliveryType('pickup')}
            >
              <View style={[
                styles.deliveryIcon,
                deliveryType === 'pickup' && styles.deliveryIconSelected,
              ]}>
                <Icon
                  name="store"
                  size={24}
                  color={deliveryType === 'pickup' ? COLORS.primary : COLORS.textSecondary}
                />
              </View>
              <View style={styles.deliveryInfo}>
                <Text style={[
                  styles.deliveryOptionText,
                  deliveryType === 'pickup' && styles.deliveryOptionTextSelected,
                ]}>
                  Store Pickup
                </Text>
                <Text style={styles.deliverySubtext}>Pick up from our store</Text>
              </View>
              {deliveryType === 'pickup' && (
                <Icon name="check-circle" size={22} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Address Section */}
        {deliveryType === 'delivery' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon name="map-marker-outline" size={22} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Delivery Address</Text>
            </View>
            <Input
              label="Street Address"
              value={address.street}
              onChangeText={(text) => setAddress({ ...address, street: text })}
              placeholder="Enter full street address"
              icon="home-outline"
            />
            <Input
              label="Landmark (Optional)"
              value={address.landmark}
              onChangeText={(text) => setAddress({ ...address, landmark: text })}
              placeholder="Near landmark, building name, etc."
              icon="map-marker-outline"
            />
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="City"
                  value={address.city}
                  onChangeText={(text) => setAddress({ ...address, city: text })}
                  placeholder="City"
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Pincode"
                  value={address.pincode}
                  onChangeText={(text) => setAddress({ ...address, pincode: text })}
                  placeholder="6-digit"
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>
            <Input
              label="State"
              value={address.state}
              onChangeText={(text) => setAddress({ ...address, state: text })}
              placeholder="State"
              icon="map-outline"
            />
          </View>
        )}

        {/* Special Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="message-text-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Special Instructions</Text>
          </View>
          <Input
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or delivery instructions..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Order Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="clipboard-list-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          {/* Order Items */}
          {cartItems.map((item, index) => (
            <View key={item.id || index} style={styles.orderItem}>
              <View style={styles.orderItemMain}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemDetails}>
                    {item.selectedColor && (
                      <View style={styles.itemTag}>
                        <View style={[styles.itemColorDot, { backgroundColor: item.selectedColor.hex }]} />
                        <Text style={styles.itemTagText}>{item.selectedColor.name}</Text>
                      </View>
                    )}
                    {item.selectedSize && (
                      <View style={styles.itemTag}>
                        <Text style={styles.itemTagText}>{item.selectedSize.label}</Text>
                      </View>
                    )}
                  </View>
                  {item.requiredDate && (
                    <View style={styles.itemDateRow}>
                      <Icon name="calendar-check" size={12} color={COLORS.primary} />
                      <Text style={styles.itemDate}>{formatDate(item.requiredDate)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.orderItemPrice}>
                  <Text style={styles.itemQty}>{item.quantity} {item.selectedSize ? 'stems' : 'pcs'}</Text>
                  <Text style={styles.itemPrice}>
                    ₹{(item.totalPrice || (item.price * item.quantity)).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Price Breakdown */}
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₹{orderSummary.subtotal.toLocaleString('en-IN')}</Text>
            </View>

            {orderSummary.totalDiscount > 0 && (
              <View style={[styles.priceRow, styles.discountRow]}>
                <View style={styles.discountLabel}>
                  <Icon name="tag-outline" size={16} color={COLORS.success} />
                  <Text style={styles.discountText}>Volume Discount</Text>
                </View>
                <Text style={styles.discountValue}>
                  - ₹{orderSummary.totalDiscount.toLocaleString('en-IN')}
                </Text>
              </View>
            )}

            {deliveryType === 'delivery' && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Fee</Text>
                <Text style={[
                  styles.priceValue,
                  orderSummary.deliveryFee === 0 && styles.freeText,
                ]}>
                  {orderSummary.deliveryFee === 0 ? 'FREE' : `₹${orderSummary.deliveryFee}`}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.totalDivider} />

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{orderSummary.total.toLocaleString('en-IN')}</Text>
          </View>

          {/* Savings Banner */}
          {orderSummary.totalDiscount > 0 && (
            <View style={styles.savingsBanner}>
              <Icon name="piggy-bank-outline" size={20} color={COLORS.success} />
              <Text style={styles.savingsText}>
                You're saving ₹{orderSummary.totalDiscount.toLocaleString('en-IN')} on this order!
              </Text>
            </View>
          )}
        </View>

        {/* WhatsApp Info */}
        <View style={styles.whatsappInfo}>
          <Icon name="whatsapp" size={24} color={COLORS.whatsapp} />
          <Text style={styles.whatsappText}>
            Your order will be sent via WhatsApp. Our team will review and confirm your order with final pricing.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomTotalLabel}>Total</Text>
          <Text style={styles.bottomTotalValue}>₹{orderSummary.total.toLocaleString('en-IN')}</Text>
        </View>
        <Button
          title="Send Order via WhatsApp"
          onPress={handleSendOrder}
          loading={loading}
          variant="whatsapp"
          icon="whatsapp"
          style={styles.checkoutBtn}
        />
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
  section: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  deliveryOptions: {
    gap: 12,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  deliveryOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  deliveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryIconSelected: {
    backgroundColor: COLORS.white,
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryOptionText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  deliveryOptionTextSelected: {
    color: COLORS.primary,
  },
  deliverySubtext: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  orderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  orderItemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  itemTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  itemColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemTagText: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  itemDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  itemDate: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  orderItemPrice: {
    alignItems: 'flex-end',
  },
  itemQty: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  priceBreakdown: {
    gap: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  freeText: {
    color: COLORS.success,
    fontWeight: '600',
  },
  discountRow: {
    backgroundColor: COLORS.successLight,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  discountLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discountText: {
    fontSize: SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
  discountValue: {
    fontSize: SIZES.md,
    color: COLORS.success,
    fontWeight: '600',
  },
  totalDivider: {
    height: 2,
    backgroundColor: COLORS.primary,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.successLight,
    padding: 12,
    borderRadius: SIZES.radius,
    marginTop: 12,
    gap: 8,
  },
  savingsText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  whatsappInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7FFE7',
    padding: 16,
    borderRadius: SIZES.radius,
    gap: 12,
  },
  whatsappText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.large,
    gap: 16,
  },
  bottomTotal: {
    alignItems: 'flex-start',
  },
  bottomTotalLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  bottomTotalValue: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  checkoutBtn: {
    flex: 1,
  },
});

export default CheckoutScreen;