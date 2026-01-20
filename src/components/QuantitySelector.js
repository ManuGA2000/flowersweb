// Quantity Selector Component - Bundles with Discount
// src/components/QuantitySelector.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, QUANTITY_OPTIONS, SHADOWS } from '../utils/theme';

const QuantitySelector = ({ 
  selectedQuantity, 
  onSelectQuantity,
  customQuantity,
  onCustomQuantityChange,
  minQuantity = 10,
  maxQuantity = 1000,
  basePrice = 0,
  label = 'Select Quantity',
}) => {
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetSelect = (option) => {
    setShowCustom(false);
    onSelectQuantity(option);
  };

  const handleCustomSelect = () => {
    setShowCustom(true);
    onSelectQuantity(null);
    onCustomQuantityChange(customQuantity || minQuantity.toString());
  };

  const calculateDiscount = (qty) => {
    if (qty >= 500) return 0.22;
    if (qty >= 200) return 0.18;
    if (qty >= 100) return 0.15;
    if (qty >= 50) return 0.10;
    if (qty >= 20) return 0.05;
    return 0;
  };

  const formatDiscount = (discount) => {
    if (discount === 0) return null;
    return `${Math.round(discount * 100)}% off`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Icon name="package-variant" size={20} color={COLORS.primary} />
          <Text style={styles.label}>{label}</Text>
        </View>
        {(selectedQuantity || customQuantity) && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedText}>
              {showCustom ? `${customQuantity} stems` : selectedQuantity?.label}
            </Text>
          </View>
        )}
      </View>

      {/* Preset Quantities */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetsContainer}
      >
        {QUANTITY_OPTIONS.map((option) => {
          const isSelected = !showCustom && selectedQuantity?.id === option.id;
          const discountText = formatDiscount(option.discount);

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.presetOption,
                isSelected && styles.presetOptionSelected,
              ]}
              onPress={() => handlePresetSelect(option)}
              activeOpacity={0.8}
            >
              {discountText && (
                <View style={[
                  styles.discountBadge,
                  isSelected && styles.discountBadgeSelected,
                ]}>
                  <Text style={[
                    styles.discountText,
                    isSelected && styles.discountTextSelected,
                  ]}>
                    {discountText}
                  </Text>
                </View>
              )}
              <Text style={[
                styles.presetValue,
                isSelected && styles.presetValueSelected,
              ]}>
                {option.value}
              </Text>
              <Text style={[
                styles.presetLabel,
                isSelected && styles.presetLabelSelected,
              ]}>
                stems
              </Text>
              {isSelected && (
                <Icon 
                  name="check-circle" 
                  size={16} 
                  color={COLORS.primary} 
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Custom Option */}
        <TouchableOpacity
          style={[
            styles.presetOption,
            styles.customOption,
            showCustom && styles.presetOptionSelected,
          ]}
          onPress={handleCustomSelect}
          activeOpacity={0.8}
        >
          <Icon 
            name="pencil-outline" 
            size={20} 
            color={showCustom ? COLORS.primary : COLORS.textSecondary} 
          />
          <Text style={[
            styles.presetLabel,
            showCustom && styles.presetLabelSelected,
          ]}>
            Custom
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Quantity Input */}
      {showCustom && (
        <View style={styles.customInputContainer}>
          <View style={styles.customInputWrapper}>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => {
                const current = parseInt(customQuantity) || minQuantity;
                if (current > minQuantity) {
                  onCustomQuantityChange((current - 10).toString());
                }
              }}
            >
              <Icon name="minus" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <TextInput
              style={styles.customInput}
              value={customQuantity}
              onChangeText={(text) => {
                const num = text.replace(/[^0-9]/g, '');
                onCustomQuantityChange(num);
              }}
              keyboardType="numeric"
              placeholder={minQuantity.toString()}
              placeholderTextColor={COLORS.textLight}
              maxLength={4}
            />

            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => {
                const current = parseInt(customQuantity) || minQuantity;
                if (current < maxQuantity) {
                  onCustomQuantityChange((current + 10).toString());
                }
              }}
            >
              <Icon name="plus" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.customInputLabel}>stems</Text>

          {/* Show calculated discount for custom quantity */}
          {customQuantity && parseInt(customQuantity) >= 20 && (
            <View style={styles.customDiscountBadge}>
              <Icon name="tag-outline" size={14} color={COLORS.success} />
              <Text style={styles.customDiscountText}>
                {formatDiscount(calculateDiscount(parseInt(customQuantity)))} discount applied
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Quantity Tiers Info */}
      <View style={styles.tiersInfo}>
        <Text style={styles.tiersTitle}>Volume Discounts:</Text>
        <View style={styles.tiersGrid}>
          <View style={styles.tierItem}>
            <Text style={styles.tierQty}>20+</Text>
            <Text style={styles.tierDiscount}>5% off</Text>
          </View>
          <View style={styles.tierItem}>
            <Text style={styles.tierQty}>50+</Text>
            <Text style={styles.tierDiscount}>10% off</Text>
          </View>
          <View style={styles.tierItem}>
            <Text style={styles.tierQty}>100+</Text>
            <Text style={styles.tierDiscount}>15% off</Text>
          </View>
          <View style={styles.tierItem}>
            <Text style={styles.tierQty}>200+</Text>
            <Text style={styles.tierDiscount}>18% off</Text>
          </View>
          <View style={styles.tierItem}>
            <Text style={styles.tierQty}>500+</Text>
            <Text style={styles.tierDiscount}>22% off</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.marginLG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedInfo: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  presetsContainer: {
    paddingHorizontal: 4,
    gap: 10,
  },
  presetOption: {
    width: 80,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...SHADOWS.small,
  },
  presetOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  customOption: {
    width: 70,
    gap: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: -4,
    backgroundColor: COLORS.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountBadgeSelected: {
    backgroundColor: COLORS.primary,
  },
  discountText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  discountTextSelected: {},
  presetValue: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  presetValueSelected: {
    color: COLORS.primary,
  },
  presetLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  presetLabelSelected: {
    color: COLORS.primary,
  },
  checkIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  customInputContainer: {
    marginTop: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 4,
    ...SHADOWS.small,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radiusSM,
    backgroundColor: COLORS.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customInput: {
    width: 80,
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    paddingVertical: 8,
  },
  customInputLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  customDiscountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  customDiscountText: {
    fontSize: SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
  tiersInfo: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: SIZES.radius,
    marginHorizontal: 4,
  },
  tiersTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  tiersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tierQty: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  tierDiscount: {
    fontSize: SIZES.xs,
    color: COLORS.success,
    fontWeight: '500',
  },
});

export default QuantitySelector;