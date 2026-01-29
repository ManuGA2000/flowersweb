// Gallery Screen - Live photos of flower bunches and packing process
// src/screens/GalleryScreen.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Gallery images data
const galleryImages = [
  {
    id: '1',
    title: 'Pink Chrysanthemum Bunch - Fresh Packed',
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400',
    category: 'Live Bunches',
  },
  {
    id: '2',
    title: 'Golden Yellow Chrysanthemum Bunch',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
    category: 'Live Bunches',
  },
  {
    id: '3',
    title: 'Red Roses Professional Packing',
    image: 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400',
    category: 'Packing Process',
  },
  {
    id: '4',
    title: 'Orange-Red Rose Bunch in Hand',
    image: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400',
    category: 'Live Bunches',
  },
  {
    id: '5',
    title: 'White Gypsophila Fresh Packed',
    image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400',
    category: 'Live Bunches',
  },
  {
    id: '6',
    title: 'Mixed Flower Bunch Packed',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400',
    category: 'Packing Process',
  },
  {
    id: '7',
    title: 'Multiple Color Varieties Ready for Shipment',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400',
    category: 'Packing Process',
  },
  {
    id: '8',
    title: 'Bulk Flower Packing - Quality Control',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=400',
    category: 'Packing Process',
  },
  {
    id: '9',
    title: 'Fresh Carnation Bunches',
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400',
    category: 'Live Bunches',
  },
  {
    id: '10',
    title: 'Lavender Roses Collection',
    image: 'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=400',
    category: 'Live Bunches',
  },
  {
    id: '11',
    title: 'Eucalyptus Foliage Bundle',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400',
    category: 'Live Bunches',
  },
  {
    id: '12',
    title: 'Premium Packaging Process',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
    category: 'Packing Process',
  },
];

const categories = ['Live Bunches', 'Packing Process'];

const GalleryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = useMemo(() => {
    let result = galleryImages;

    if (selectedCategory) {
      result = result.filter((img) => img.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={COLORS.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Gallery</Text>
          <Text style={styles.headerSubtitle}>
            Live photos of our fresh flower bunches and packing process
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={22} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search photos..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              selectedCategory === null && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.categoryTextActive,
              ]}
            >
              All Photos
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryBtn,
                selectedCategory === category && styles.categoryBtnActive,
              ]}
              onPress={() =>
                setSelectedCategory(selectedCategory === category ? null : category)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <View style={styles.galleryGrid}>
            {filteredImages.map((image) => (
              <TouchableOpacity
                key={image.id}
                style={styles.galleryCard}
                onPress={() => setSelectedImage(image)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: image.image }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
                <View style={styles.galleryOverlay}>
                  <Text style={styles.galleryTitle} numberOfLines={2}>
                    {image.title}
                  </Text>
                  <Text style={styles.galleryCategory}>{image.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="magnify" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No photos found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filter
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            onPress={() => setSelectedImage(null)}
          />
          <View style={styles.modalContent}>
            {selectedImage && (
              <>
                <Image
                  source={{ uri: selectedImage.image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                  <Text style={styles.modalCategory}>{selectedImage.category}</Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedImage(null)}
            >
              <Icon name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  backText: {
    fontSize: SIZES.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  headerTitleContainer: {},
  headerTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    marginLeft: 10,
    paddingVertical: 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundDark,
  },
  categoryBtnActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryCard: {
    width: CARD_WIDTH,
    aspectRatio: 4 / 5,
    borderRadius: SIZES.radiusLG,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: COLORS.backgroundDark,
    ...SHADOWS.small,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  galleryTitle: {
    fontSize: SIZES.xs,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 4,
  },
  galleryCategory: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
  },
  modalImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: SIZES.radiusLG,
  },
  modalInfo: {
    marginTop: 16,
  },
  modalTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalCategory: {
    fontSize: SIZES.sm,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: -40,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GalleryScreen;