// Product Detail Screen - Updated UI with expandable color cards and stem quantities
// src/screens/ProductDetailScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { useCart } from '../context/CartContext';
import { useFlowerData } from '../context/FlowerDataContext';

const { width } = Dimensions.get('window');

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

const STEM_LENGTHS = ['40cm', '50cm', '60cm', '70cm', '80cm'];
const QUICK_QUANTITIES = [20, 50, 100, 200, 300];
const MIN_BUNCHES = 20;

const getImageUrl = (item) => {
  if (!item) return PLACEHOLDER_IMAGE;
  if (item.imageUrl) return item.imageUrl;
  if (item.displayImage && !item.displayImage.startsWith('/')) return item.displayImage;
  if (item.image && !item.image.startsWith('/')) return item.image;
  return PLACEHOLDER_IMAGE;
};

const StemRow = ({ stemLength, quantity, onQuantityChange, isHighlighted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(quantity || ''));

  const handleQuickSelect = (val) => {
    onQuantityChange(val);
    setEditValue(String(val));
  };

  const handleSliderChange = (direction) => {
    let newVal = quantity;
    if (direction === 'increase') {
      newVal = Math.min(quantity + 10, 500);
    } else {
      newVal = Math.max(quantity - 10, 0);
    }
    onQuantityChange(newVal);
    setEditValue(String(newVal));
  };

  const handleEditPress = () => {
    setEditValue(String(quantity || ''));
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    const val = Number(editValue) || 0;

    if (val > 0 && val < MIN_BUNCHES) {
      Alert.alert('Minimum Quantity', `Minimum ${MIN_BUNCHES} bunches required`);
      setEditValue(String(quantity || ''));
      return;
    }

    onQuantityChange(val);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(String(quantity || ''));
  };

  const fillPercent = Math.min((quantity / 300) * 100, 100);

  return (
    <View style={[styles.stemRow, isHighlighted && styles.stemRowHighlighted]}>
      <View style={styles.stemLabelContainer}>
        <Icon name="tag-outline" size={16} color={COLORS.primary} />
        <Text style={styles.stemLabel}>{stemLength}</Text>
      </View>

      <View style={styles.stemControls}>
        <View style={styles.quickButtons}>
          {QUICK_QUANTITIES.map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.quickBtn,
                quantity === val && styles.quickBtnActive,
              ]}
              onPress={() => handleQuickSelect(val)}
            >
              <Text
                style={[
                  styles.quickBtnText,
                  quantity === val && styles.quickBtnTextActive,
                ]}
              >
                {val}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sliderRow}>
          <TouchableOpacity
            style={styles.sliderBtn}
            onPress={() => handleSliderChange('decrease')}
          >
            <Icon name="minus" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <View style={styles.sliderTrack}>
            <View style={[styles.sliderFill, { width: `${fillPercent}%` }]} />
          </View>

          <TouchableOpacity
            style={styles.sliderBtn}
            onPress={() => handleSliderChange('increase')}
          >
            <Icon name="plus" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editInputWrapper}>
              <TextInput
                style={styles.editInput}
                value={editValue}
                onChangeText={setEditValue}
                keyboardType="number-pad"
                autoFocus
                selectTextOnFocus
                maxLength={4}
                onSubmitEditing={handleEditSubmit}
                returnKeyType="done"
                placeholder="0"
                placeholderTextColor={COLORS.textSecondary + '80'}
              />
              <TouchableOpacity style={styles.editConfirmBtn} onPress={handleEditSubmit}>
                <Icon name="check" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editCancelBtn} onPress={handleEditCancel}>
                <Icon name="close" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.quantityDisplay} onPress={handleEditPress}>
              <Text style={[
                styles.quantityText,
                quantity > 0 && styles.quantityTextActive
              ]}>
                {quantity || '—'}
              </Text>
              <Icon name="pencil" size={16} color={quantity > 0 ? COLORS.primary : COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const ColorCard = ({
  color,
  isExpanded,
  onToggle,
  stemQuantities,
  onStemQuantityChange,
}) => {
  const imageUrl = getImageUrl(color);
  const totalBunches = Object.values(stemQuantities).reduce((sum, qty) => sum + qty, 0);

  return (
    <View style={[styles.colorCard, isExpanded && styles.colorCardExpanded]}>
      <TouchableOpacity
        style={styles.colorHeader}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.colorInfo}>
          <Image source={{ uri: imageUrl }} style={styles.colorImage} />
          <View style={styles.colorTextContainer}>
            <Text style={styles.colorName}>{color.name}</Text>
            {totalBunches > 0 && (
              <Text style={styles.colorTotal}>{totalBunches} bunches</Text>
            )}
          </View>
        </View>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.colorContent}>
          {STEM_LENGTHS.map((stem) => (
            <StemRow
              key={stem}
              stemLength={stem}
              quantity={stemQuantities[stem] || 0}
              onQuantityChange={(qty) => onStemQuantityChange(stem, qty)}
              isHighlighted={stemQuantities[stem] > 0}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const ProductDetailScreen = ({ route, navigation }) => {
  if (!route?.params?.product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity style={styles.errorBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.errorBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { product } = route.params;
  const { addToCart, getCartCount } = useCart();
  const { getProductColors } = useFlowerData();

  const availableColors = useMemo(() => {
    const colors = getProductColors(product.type) || [];
    return colors.map(color => ({
      ...color,
      image: getImageUrl(color),
    }));
  }, [getProductColors, product.type]);

  const [expandedColors, setExpandedColors] = useState([]);
  const [colorSelections, setColorSelections] = useState({});

  const { totalBunches, totalColors } = useMemo(() => {
    let bunches = 0;
    let colors = 0;
    Object.values(colorSelections).forEach(stems => {
      const colorTotal = Object.values(stems).reduce((sum, q) => sum + q, 0);
      if (colorTotal > 0) {
        bunches += colorTotal;
        colors++;
      }
    });
    return { totalBunches: bunches, totalColors: colors };
  }, [colorSelections]);

  const cartCount = getCartCount();

  const handleToggleColor = (colorId) => {
    setExpandedColors(prev =>
      prev.includes(colorId) ? prev.filter(id => id !== colorId) : [...prev, colorId]
    );
  };

  const handleStemQuantityChange = (colorId, stemLength, quantity) => {
    setColorSelections(prev => {
      const newSel = { ...prev };
      if (!newSel[colorId]) newSel[colorId] = {};
      newSel[colorId][stemLength] = quantity;
      return newSel;
    });

    if (quantity > 0 && !expandedColors.includes(colorId)) {
      setExpandedColors(prev => [...prev, colorId]);
    }
  };

  const handleAddToCart = () => {
    if (totalBunches === 0) {
      Alert.alert('No Selection', 'Please select some quantities first');
      return;
    }

    Object.entries(colorSelections).forEach(([colorId, stems]) => {
      const color = availableColors.find(c => c.id === colorId);
      if (!color) return;

      Object.entries(stems).forEach(([stemLength, qty]) => {
        if (qty <= 0) return;

        const cartItem = {
          ...product,
          id: `${product.id}-${colorId}-${stemLength}-${Date.now()}`,
          selectedColor: color,
          selectedSize: { id: stemLength, label: stemLength, value: Number(stemLength) },
          quantity: qty,
          displayImage: getImageUrl(color),
        };

        addToCart(cartItem, qty);
      });
    });

    Alert.alert(
      'Added to Cart',
      `${totalBunches} bunches added`,
      [
        { text: 'Continue', onPress: () => navigation.goBack() },
       { text: 'View Cart', onPress: () => navigation.navigate('MainTabs', { screen: 'Cart' }) },
      ]
    );
  };

  const handleViewCart = () => {
    if (totalBunches > 0) handleAddToCart();
    else navigation.navigate('Cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{product.name}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Icon name="palette-outline" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Select Colors & Quantity</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Choose colors and specify bunches for each length
          </Text>
        </View>

        {totalBunches > 0 && (
          <View style={styles.summaryBadge}>
            <Icon name="package-variant" size={18} color={COLORS.primary} />
            <Text style={styles.summaryText}>
              {totalBunches} bunches • {totalColors} color{totalColors !== 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <View style={styles.colorCardsContainer}>
          {availableColors.map(color => (
            <ColorCard
              key={color.id}
              color={color}
              isExpanded={expandedColors.includes(color.id)}
              onToggle={() => handleToggleColor(color.id)}
              stemQuantities={colorSelections[color.id] || {}}
              onStemQuantityChange={(stem, qty) =>
                handleStemQuantityChange(color.id, stem, qty)
              }
            />
          ))}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomProductName}>{product.name}</Text>
          <Text style={styles.bottomTotal}>
            {totalBunches} {totalBunches === 1 ? 'bunch' : 'bunches'}
          </Text>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.addMoreBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.addMoreText}>Add Other Flowers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewCartBtn} onPress={handleViewCart}>
            <Text style={styles.viewCartText}>
              View Cart ({cartCount + totalBunches})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Styles ───────────────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: SIZES.lg, fontWeight: '700', color: COLORS.text },
  headerRight: { width: 44 },

  content: { flex: 1 },
  scrollContent: { padding: 16 },

  titleSection: { marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  sectionTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text },
  sectionSubtitle: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginLeft: 32 },

  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
    gap: 6,
  },
  summaryText: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.primary },

  colorCardsContainer: { gap: 12 },

  colorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  colorCardExpanded: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  colorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  colorInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  colorImage: { width: 54, height: 54, borderRadius: 10, backgroundColor: COLORS.border },
  colorTextContainer: { flex: 1 },
  colorName: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.text },
  colorTotal: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },

  colorContent: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 12,
  },

  // ─── Stem Row ────────────────────────────────────────────────────────────────

  stemRow: { paddingVertical: 10 },
  stemRowHighlighted: {
    backgroundColor: COLORS.primary + '08',
    borderRadius: 12,
    marginHorizontal: -8,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  stemLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  stemLabel: { fontSize: SIZES.sm, fontWeight: '600', color: COLORS.text },

  stemControls: { gap: 10 },

  quickButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickBtnText: { fontSize: SIZES.sm, color: COLORS.text, fontWeight: '500' },
  quickBtnTextActive: { color: '#fff' },

  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sliderBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },

  // ─── Quantity Display + Edit ─────────────────────────────────────────────────

  quantityDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.backgroundDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 80,
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    minWidth: 30,
    textAlign: 'center',
  },
  quantityTextActive: {
    color: COLORS.primary,
  },

  editInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editInput: {
    width: 70,
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  editConfirmBtn: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editCancelBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundDark,
  },

  // ─── Bottom Bar ──────────────────────────────────────────────────────────────

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 16,
    ...SHADOWS.medium,
  },
  bottomInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomProductName: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  bottomTotal: { fontSize: SIZES.md, fontWeight: '700', color: COLORS.text },

  bottomButtons: { flexDirection: 'row', gap: 12 },
  addMoreBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  addMoreText: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.primary },
  viewCartBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  viewCartText: { fontSize: SIZES.md, fontWeight: '600', color: '#fff' },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: { fontSize: SIZES.lg, color: COLORS.error, marginBottom: 16 },
  errorBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  errorBtnText: { color: '#fff', fontWeight: '600', fontSize: SIZES.md },
});

export default ProductDetailScreen;