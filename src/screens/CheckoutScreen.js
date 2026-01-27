// Enhanced Checkout Screen - No Pricing, Saved Address Support
// src/screens/CheckoutScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Header, Input, Button, DatePicker } from '../components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { sendOrderViaWhatsApp } from '../services/whatsappService';

const SAVED_ADDRESS_KEY = '@growteq_saved_address';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState({
    street: '',
    landmark: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Load saved addresses on mount
  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_ADDRESS_KEY);
      if (stored) {
        const addresses = JSON.parse(stored);
        setSavedAddresses(addresses);
        // If user has saved addresses, show the selection modal
        if (addresses.length > 0) {
          setShowSavedAddresses(true);
        }
      }
    } catch (error) {
      console.log('Error loading saved addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const saveAddress = async (newAddress) => {
    try {
      // Check if address already exists
      const exists = savedAddresses.some(
        addr => 
          addr.street === newAddress.street && 
          addr.city === newAddress.city && 
          addr.pincode === newAddress.pincode
      );

      if (!exists) {
        const updatedAddresses = [...savedAddresses, { ...newAddress, id: Date.now().toString() }];
        await AsyncStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(updatedAddresses));
        setSavedAddresses(updatedAddresses);
      }
    } catch (error) {
      console.log('Error saving address:', error);
    }
  };

  const selectSavedAddress = (savedAddress) => {
    setAddress({
      street: savedAddress.street,
      landmark: savedAddress.landmark || '',
      city: savedAddress.city,
      state: savedAddress.state || 'Tamil Nadu',
      pincode: savedAddress.pincode,
    });
    setShowSavedAddresses(false);
  };

  const deleteSavedAddress = async (addressId) => {
    try {
      const updatedAddresses = savedAddresses.filter(addr => addr.id !== addressId);
      await AsyncStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(updatedAddresses));
      setSavedAddresses(updatedAddresses);
    } catch (error) {
      console.log('Error deleting address:', error);
    }
  };

  // Calculate totals (for display without pricing)
  const orderSummary = useMemo(() => {
    let totalStems = 0;

    cartItems.forEach(item => {
      totalStems += item.quantity;
    });

    return {
      totalStems,
      itemCount: cartItems.length,
    };
  }, [cartItems]);

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
      // Save the address for future use
      if (deliveryType === 'delivery') {
        await saveAddress(address);
      }

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
          requiredDate: item.requiredDate,
          image: item.selectedColor?.image || item.image,
        })),
        totalStems: orderSummary.totalStems,
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
      {/* Saved Addresses Modal */}
      <Modal
        visible={showSavedAddresses && savedAddresses.length > 0}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSavedAddresses(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Addresses</Text>
              <TouchableOpacity 
                onPress={() => setShowSavedAddresses(false)}
                style={styles.modalCloseBtn}
              >
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Select a saved address or enter a new one
            </Text>

            <ScrollView style={styles.addressList}>
              {savedAddresses.map((savedAddr) => (
                <TouchableOpacity
                  key={savedAddr.id}
                  style={styles.savedAddressCard}
                  onPress={() => selectSavedAddress(savedAddr)}
                >
                  <View style={styles.savedAddressInfo}>
                    <Icon name="map-marker" size={20} color={COLORS.primary} />
                    <View style={styles.savedAddressText}>
                      <Text style={styles.savedAddressStreet} numberOfLines={2}>
                        {savedAddr.street}
                      </Text>
                      {savedAddr.landmark && (
                        <Text style={styles.savedAddressLandmark}>
                          Near: {savedAddr.landmark}
                        </Text>
                      )}
                      <Text style={styles.savedAddressCity}>
                        {savedAddr.city}, {savedAddr.state} - {savedAddr.pincode}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.savedAddressActions}>
                    <TouchableOpacity
                      style={styles.useAddressBtn}
                      onPress={() => selectSavedAddress(savedAddr)}
                    >
                      <Text style={styles.useAddressBtnText}>Use</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteAddressBtn}
                      onPress={() => deleteSavedAddress(savedAddr.id)}
                    >
                      <Icon name="delete-outline" size={18} color={COLORS.error} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Button
              title="Enter New Address"
              onPress={() => setShowSavedAddresses(false)}
              variant="outline"
              icon="plus"
              style={styles.newAddressBtn}
            />
          </View>
        </View>
      </Modal>

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
                  We'll deliver to your address
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
              {savedAddresses.length > 0 && (
                <TouchableOpacity 
                  onPress={() => setShowSavedAddresses(true)}
                  style={styles.savedAddressesBtn}
                >
                  <Icon name="history" size={18} color={COLORS.primary} />
                  <Text style={styles.savedAddressesBtnText}>Saved</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Show selected saved address indicator */}
            {address.street && savedAddresses.some(
              addr => addr.street === address.street && addr.pincode === address.pincode
            ) && (
              <View style={styles.usingSavedAddressNote}>
                <Icon name="check-circle" size={16} color={COLORS.success} />
                <Text style={styles.usingSavedAddressText}>Using saved address</Text>
              </View>
            )}

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
                <View style={styles.orderItemQuantity}>
                  <Text style={styles.itemQty}>{item.quantity}</Text>
                  <Text style={styles.itemQtyLabel}>stems</Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          {/* Total Summary */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Items</Text>
            <Text style={styles.totalValue}>{orderSummary.itemCount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Stems</Text>
            <Text style={styles.totalValueHighlight}>{orderSummary.totalStems.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* WhatsApp Info */}
        <View style={styles.whatsappInfo}>
          <Icon name="whatsapp" size={24} color={COLORS.whatsapp} />
          <Text style={styles.whatsappText}>
            Your order request will be sent via WhatsApp. Our team will review and confirm your order with pricing details.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomTotalLabel}>Total Stems</Text>
          <Text style={styles.bottomTotalValue}>{orderSummary.totalStems.toLocaleString('en-IN')}</Text>
        </View>
        <Button
          title="Send Request via WhatsApp"
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
    flex: 1,
  },
  savedAddressesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  savedAddressesBtnText: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  usingSavedAddressNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight,
    padding: 10,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    gap: 6,
  },
  usingSavedAddressText: {
    fontSize: SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
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
  orderItemQuantity: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
  },
  itemQty: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  itemQtyLabel: {
    fontSize: SIZES.xs,
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValueHighlight: {
    fontSize: SIZES.xxl,
    fontWeight: '800',
    color: COLORS.primary,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusXL,
    borderTopRightRadius: SIZES.radiusXL,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  addressList: {
    maxHeight: 300,
  },
  savedAddressCard: {
    backgroundColor: COLORS.backgroundDark,
    borderRadius: SIZES.radius,
    padding: 14,
    marginBottom: 12,
  },
  savedAddressInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  savedAddressText: {
    flex: 1,
    marginLeft: 12,
  },
  savedAddressStreet: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  savedAddressLandmark: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  savedAddressCity: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  savedAddressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  useAddressBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
  },
  useAddressBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.sm,
  },
  deleteAddressBtn: {
    padding: 8,
  },
  newAddressBtn: {
    marginTop: 8,
  },
});

export default CheckoutScreen;