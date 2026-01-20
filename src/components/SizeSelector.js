// Size Selector Component - Stem Length in CM
// src/components/SizeSelector.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, STEM_SIZES, SHADOWS } from '../utils/theme';

const SizeSelector = ({ 
  productType, 
  selectedSize, 
  onSelectSize, 
  basePrice = 0,
  label = 'Select Size (Stem Length)',
}) => {
  const sizes = STEM_SIZES[productType] || STEM_SIZES.default;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Icon name="ruler" size={20} color={COLORS.primary} />
          <Text style={styles.label}>{label}</Text>
        </View>
        {selectedSize && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedText}>{selectedSize.label}</Text>
          </View>
        )}
      </View>

      <View style={styles.optionsContainer}>
        {sizes.map((size) => {
          const isSelected = selectedSize?.id === size.id;
          const calculatedPrice = Math.round(basePrice * size.priceMultiplier);
          const priceDiff = calculatedPrice - basePrice;

          return (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
              onPress={() => onSelectSize(size)}
              activeOpacity={0.8}
            >
              <View style={styles.optionContent}>
                {/* Size Visualization */}
                <View style={styles.sizeVisualization}>
                  <View 
                    style={[
                      styles.stemLine,
                      { height: 20 + (size.value / 80) * 30 },
                      isSelected && styles.stemLineSelected,
                    ]}
                  />
                  <Icon 
                    name="flower" 
                    size={16} 
                    color={isSelected ? COLORS.primary : COLORS.textLight} 
                  />
                </View>

                {/* Size Info */}
                <View style={styles.sizeInfo}>
                  <Text style={[
                    styles.sizeLabel,
                    isSelected && styles.sizeLabelSelected,
                  ]}>
                    {size.label}
                  </Text>
                  <Text style={[
                    styles.sizeId,
                    isSelected && styles.sizeIdSelected,
                  ]}>
                    {size.id.charAt(0).toUpperCase() + size.id.slice(1)}
                  </Text>
                </View>

                {/* Price Difference */}
                <View style={styles.priceInfo}>
                  {priceDiff > 0 ? (
                    <Text style={[
                      styles.priceDiff,
                      isSelected && styles.priceDiffSelected,
                    ]}>
                      +₹{priceDiff}
                    </Text>
                  ) : (
                    <Text style={[
                      styles.baseLabel,
                      isSelected && styles.baseLabelSelected,
                    ]}>
                      Base
                    </Text>
                  )}
                </View>

                {/* Selection Indicator */}
                {isSelected && (
                  <View style={styles.checkContainer}>
                    <Icon name="check-circle" size={20} color={COLORS.primary} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Size Guide */}
      <TouchableOpacity style={styles.sizeGuide}>
        <Icon name="help-circle-outline" size={16} color={COLORS.textSecondary} />
        <Text style={styles.sizeGuideText}>Size Guide</Text>
      </TouchableOpacity>
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
  optionsContainer: {
    gap: 10,
    paddingHorizontal: 4,
  },
  option: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  sizeVisualization: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stemLine: {
    width: 3,
    backgroundColor: COLORS.textLight,
    borderRadius: 1.5,
    marginBottom: 2,
  },
  stemLineSelected: {
    backgroundColor: COLORS.primary,
  },
  sizeInfo: {
    flex: 1,
  },
  sizeLabel: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  sizeLabelSelected: {
    color: COLORS.primary,
  },
  sizeId: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textTransform: 'capitalize',
  },
  sizeIdSelected: {
    color: COLORS.primaryLight,
  },
  priceInfo: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  priceDiff: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priceDiffSelected: {
    color: COLORS.primary,
  },
  baseLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  baseLabelSelected: {
    color: COLORS.primaryLight,
  },
  checkContainer: {
    marginLeft: 8,
  },
  sizeGuide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 4,
  },
  sizeGuideText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default SizeSelector;