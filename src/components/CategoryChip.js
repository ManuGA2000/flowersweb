// Enhanced Category Chip Component
// src/components/CategoryChip.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const CategoryChip = ({ category, isSelected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[
        styles.iconContainer,
        isSelected && styles.iconContainerSelected,
      ]}>
        <Icon 
          name={category.icon || 'flower-outline'} 
          size={20} 
          color={isSelected ? COLORS.white : COLORS.primary} 
        />
      </View>
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

// Category List Component
export const CategoryList = ({ categories, selectedId, onSelect }) => {
  const allCategory = { id: 'all', name: 'All', icon: 'flower-tulip-outline' };
  const allCategories = [allCategory, ...categories];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    >
      {allCategories.map(category => (
        <CategoryChip
          key={category.id}
          category={category}
          isSelected={selectedId === category.id}
          onPress={() => onSelect(category.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingLeft: 4,
    paddingRight: 16,
    paddingVertical: 6,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  text: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  textSelected: {
    color: COLORS.textWhite,
  },
});

export default CategoryChip;