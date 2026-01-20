// Price Summary Component
// src/components/PriceSummary.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const PriceSummary = ({
  basePrice = 0,
  quantity = 0,
  sizeMultiplier = 1,
  discount = 0,
  showBreakdown = true,
}) => {
  const pricePerStem = Math.round(basePrice * sizeMultiplier);
  const subtotal = pricePerStem * quantity;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal - discountAmount;

  if (quantity === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderContent}>
          <Icon name="calculator-variant" size={32} color={COLORS.textLight} />
          <Text style={styles.placeholderText}>
            Select options to see price
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Summary</Text>

      {showBreakdown && (
        <View style={styles.breakdown}>
          {/* Price per stem */}
          <View style={styles.row}>
            <Text style={styles.label}>Price per stem</Text>
            <Text style={styles.value}>₹{pricePerStem}</Text>
          </View>

          {/* Quantity */}
          <View style={styles.row}>
            <Text style={styles.label}>Quantity</Text>
            <Text style={styles.value}>× {quantity} stems</Text>
          </View>

          {/* Subtotal */}
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{subtotal.toLocaleString('en-IN')}</Text>
          </View>

          {/* Discount */}
          {discount > 0 && (
            <View style={[styles.row, styles.discountRow]}>
              <View style={styles.discountLabel}>
                <Icon name="tag-outline" size={16} color={COLORS.success} />
                <Text style={styles.discountText}>
                  Volume Discount ({Math.round(discount * 100)}%)
                </Text>
              </View>
              <Text style={styles.discountValue}>
                - ₹{discountAmount.toLocaleString('en-IN')}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <View style={styles.totalValueContainer}>
          {discount > 0 && (
            <Text style={styles.originalTotal}>
              ₹{subtotal.toLocaleString('en-IN')}
            </Text>
          )}
          <Text style={styles.totalValue}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Savings Badge */}
      {discount > 0 && (
        <View style={styles.savingsBadge}>
          <Icon name="piggy-bank-outline" size={18} color={COLORS.success} />
          <Text style={styles.savingsText}>
            You save ₹{discountAmount.toLocaleString('en-IN')}!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusLG,
    padding: SIZES.padding,
    ...SHADOWS.medium,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  placeholderContent: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  placeholderText: {
    fontSize: SIZES.md,
    color: COLORS.textLight,
  },
  breakdown: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  value: {
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  discountRow: {
    backgroundColor: COLORS.successLight,
    marginHorizontal: -SIZES.padding,
    paddingHorizontal: SIZES.padding,
    paddingVertical: 8,
    marginTop: 4,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
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
  totalValueContainer: {
    alignItems: 'flex-end',
  },
  originalTotal: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  totalValue: {
    fontSize: SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.primary,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.successLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: SIZES.radius,
    marginTop: 16,
    gap: 8,
  },
  savingsText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.success,
  },
});

export default PriceSummary;