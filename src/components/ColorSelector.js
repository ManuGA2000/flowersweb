// Color Selector Component
// src/components/ColorSelector.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const ColorSelector = ({ 
  colors, 
  selectedColor, 
  onSelectColor, 
  showImages = true,
  label = 'Select Color',
}) => {
  if (!colors || colors.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {selectedColor && (
          <View style={styles.selectedInfo}>
            <View 
              style={[
                styles.selectedDot, 
                { backgroundColor: selectedColor.hex }
              ]} 
            />
            <Text style={styles.selectedName}>{selectedColor.name}</Text>
          </View>
        )}
      </View>

      {showImages ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollContent}
        >
          {colors.map((color) => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.imageOption,
                selectedColor?.id === color.id && styles.imageOptionSelected,
              ]}
              onPress={() => onSelectColor(color)}
              activeOpacity={0.8}
            >
              <View style={styles.imageWrapper}>
                <Image 
                  source={{ uri: color.image }} 
                  style={styles.colorImage}
                  resizeMode="cover"
                />
                {selectedColor?.id === color.id && (
                  <View style={styles.selectedOverlay}>
                    <Icon name="check-circle" size={24} color={COLORS.white} />
                  </View>
                )}
              </View>
              <View style={styles.colorInfo}>
                <View 
                  style={[
                    styles.colorDot,
                    { backgroundColor: color.hex },
                    color.bicolor && styles.bicolorDot,
                  ]}
                >
                  {color.bicolor && (
                    <View 
                      style={[
                        styles.bicolorHalf, 
                        { backgroundColor: color.bicolor }
                      ]} 
                    />
                  )}
                  {color.multicolor && (
                    <View style={styles.rainbowDot} />
                  )}
                </View>
                <Text 
                  style={[
                    styles.colorName,
                    selectedColor?.id === color.id && styles.colorNameSelected,
                  ]}
                  numberOfLines={1}
                >
                  {color.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.swatchGrid}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.swatchOption,
                selectedColor?.id === color.id && styles.swatchOptionSelected,
              ]}
              onPress={() => onSelectColor(color)}
              activeOpacity={0.8}
            >
              <View 
                style={[
                  styles.swatch,
                  { backgroundColor: color.hex },
                  color.bicolor && styles.bicolorSwatch,
                ]}
              >
                {color.bicolor && (
                  <View 
                    style={[
                      styles.bicolorSwatchHalf, 
                      { backgroundColor: color.bicolor }
                    ]} 
                  />
                )}
                {color.multicolor && (
                  <View style={styles.rainbowSwatch} />
                )}
                {selectedColor?.id === color.id && (
                  <Icon 
                    name="check" 
                    size={16} 
                    color={getContrastColor(color.hex)} 
                    style={styles.checkIcon}
                  />
                )}
              </View>
              <Text 
                style={[
                  styles.swatchLabel,
                  selectedColor?.id === color.id && styles.swatchLabelSelected,
                ]}
                numberOfLines={2}
              >
                {color.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Helper function to determine text color based on background
const getContrastColor = (hex) => {
  if (!hex) return COLORS.text;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? COLORS.text : COLORS.white;
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
  label: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  selectedDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedName: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  imageScrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  imageOption: {
    width: 100,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  imageOptionSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  imageWrapper: {
    width: '100%',
    height: 80,
    position: 'relative',
  },
  colorImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 86, 49, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  bicolorDot: {
    position: 'relative',
  },
  bicolorHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
  },
  rainbowDot: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, red, orange, yellow, green, blue, purple)',
  },
  colorName: {
    flex: 1,
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
  },
  colorNameSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 4,
  },
  swatchOption: {
    alignItems: 'center',
    width: 60,
  },
  swatchOptionSelected: {},
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 4,
  },
  bicolorSwatch: {
    position: 'relative',
  },
  bicolorSwatchHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
  },
  rainbowSwatch: {
    width: '100%',
    height: '100%',
  },
  checkIcon: {},
  swatchLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
  },
  swatchLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ColorSelector;