// Enhanced Color Selector Component - With Firebase Storage Image Support
// src/components/ColorSelector.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

/**
 * Helper function to get the best available image URL for a color
 * Prioritizes imageUrl (Firebase Storage) over image (local path)
 */
const getColorImageUrl = (color) => {
  if (!color) return PLACEHOLDER_IMAGE;
  
  // Check for Firebase Storage URL first (imageUrl field)
  if (color.imageUrl) return color.imageUrl;
  
  // Check for displayImage (set by context)
  if (color.displayImage && !color.displayImage.startsWith('/')) {
    return color.displayImage;
  }
  
  // Check for image field
  if (color.image) {
    // If it's a local path (starts with /), return null to show color swatch instead
    if (color.image.startsWith('/')) {
      return null;
    }
    return color.image;
  }
  
  return null; // Return null to show color swatch instead of placeholder
};

const ColorSelector = ({ 
  colors = [], 
  selectedColor, 
  onSelectColor, 
  showImages = true,
  label = "Select Color",
  compact = false,
}) => {
  if (!colors || colors.length === 0) {
    return null;
  }

  const renderColorItem = (color) => {
    const isSelected = selectedColor?.id === color.id;
    const imageUrl = showImages ? getColorImageUrl(color) : null;
    const hasImage = imageUrl && !imageUrl.startsWith('/');

    if (compact) {
      // Compact mode - just color dots
      return (
        <TouchableOpacity
          key={color.id}
          style={[
            styles.compactColorItem,
            isSelected && styles.compactColorItemSelected,
          ]}
          onPress={() => onSelectColor(color)}
          activeOpacity={0.7}
        >
          <View 
            style={[
              styles.compactColorDot,
              { backgroundColor: color.hex || '#ccc' },
              color.bicolor && styles.bicolorDot,
            ]}
          >
            {color.bicolor && (
              <View style={[styles.bicolorHalf, { backgroundColor: color.bicolor }]} />
            )}
          </View>
          {isSelected && (
            <View style={styles.compactCheckmark}>
              <Icon name="check" size={10} color={COLORS.white} />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    // Full mode with images
    return (
      <TouchableOpacity
        key={color.id}
        style={[
          styles.colorItem,
          isSelected && styles.colorItemSelected,
        ]}
        onPress={() => onSelectColor(color)}
        activeOpacity={0.8}
      >
        {/* Color Image or Swatch */}
        <View style={styles.colorImageContainer}>
          {hasImage ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.colorImage}
              resizeMode="cover"
            />
          ) : (
            <View 
              style={[
                styles.colorSwatch,
                { backgroundColor: color.hex || '#ccc' },
              ]}
            >
              {color.bicolor && (
                <View style={[styles.bicolorSwatchHalf, { backgroundColor: color.bicolor }]} />
              )}
              {color.multicolor && (
                <View style={styles.multicolorOverlay}>
                  <Icon name="palette" size={20} color={COLORS.white} />
                </View>
              )}
            </View>
          )}
          
          {/* Selection Indicator */}
          {isSelected && (
            <View style={styles.selectedOverlay}>
              <View style={styles.checkCircle}>
                <Icon name="check" size={16} color={COLORS.white} />
              </View>
            </View>
          )}
        </View>

        {/* Color Name */}
        <Text 
          style={[
            styles.colorName,
            isSelected && styles.colorNameSelected,
          ]}
          numberOfLines={2}
        >
          {color.name}
        </Text>

        {/* Color Hex Indicator */}
        <View style={styles.colorHexContainer}>
          <View 
            style={[
              styles.colorHexDot,
              { backgroundColor: color.hex || '#ccc' },
            ]}
          />
          {color.bicolor && (
            <View 
              style={[
                styles.colorHexDot,
                { backgroundColor: color.bicolor, marginLeft: -4 },
              ]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.colorCount}>{colors.length} available</Text>
        </View>
      )}

      {/* Selected Color Info */}
      {selectedColor && (
        <View style={styles.selectedInfo}>
          <View style={[styles.selectedColorDot, { backgroundColor: selectedColor.hex }]} />
          <Text style={styles.selectedColorName}>{selectedColor.name}</Text>
          <Icon name="check-circle" size={16} color={COLORS.success} />
        </View>
      )}

      {/* Color Grid/List */}
      {compact ? (
        <View style={styles.compactGrid}>
          {colors.map(renderColorItem)}
        </View>
      ) : (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorList}
        >
          {colors.map(renderColorItem)}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  colorCount: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successLight || '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    gap: 8,
  },
  selectedColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
    ...SHADOWS.small,
  },
  selectedColorName: {
    flex: 1,
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.success,
  },
  colorList: {
    paddingVertical: 4,
    gap: 12,
  },
  colorItem: {
    width: 90,
    alignItems: 'center',
    marginRight: 12,
  },
  colorItemSelected: {
    transform: [{ scale: 1.02 }],
  },
  colorImageContainer: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundDark || '#f5f5f5',
    marginBottom: 8,
    ...SHADOWS.small,
  },
  colorImage: {
    width: '100%',
    height: '100%',
  },
  colorSwatch: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bicolorSwatchHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
  },
  multicolorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(74, 124, 89, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorName: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  colorNameSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  colorHexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorHexDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // Compact mode styles
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  compactColorItem: {
    position: 'relative',
    padding: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  compactColorItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  compactColorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
  },
  bicolorDot: {
    overflow: 'hidden',
  },
  bicolorHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
  },
  compactCheckmark: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
});

export default ColorSelector;