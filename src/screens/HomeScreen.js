// Home Screen - Updated UI matching screenshot design
// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  TextInput,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { useFlowerData } from '../context/FlowerDataContext';
import { Header } from '../components';


const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

// Flower type descriptions
const flowerDescriptions = {
  roses: 'Classic elegance',
  chrysanthemums: 'Vibrant blooms',
  gypsophila: 'Delicate filler',
  lisianthus: 'Rose-like beauty',
  limonium: 'Long-lasting color',
  carnation: 'Timeless charm',
  eucalyptus: 'Fresh foliage',
  'song-of-india': 'Tropical accent',
  'song-of-jamaica': 'Exotic foliage',
  eustoma: 'Elegant petals',
};

// Category mapping for flowers
const FLOWER_CATEGORIES = {
  roses: 'flowers',
  chrysanthemums: 'flowers',
  gypsophila: 'flowers',
  lisianthus: 'flowers',
  limonium: 'flowers',
  carnation: 'flowers',
  eustoma: 'flowers',
  eucalyptus: 'foliage',
  'song-of-india': 'foliage',
  'song-of-jamaica': 'foliage',
};

// Flower Card Component
const FlowerCard = ({ product, onPress, getImageUrl }) => {
  const imageUrl = getImageUrl(product);
  const description = flowerDescriptions[product.type] || product.description || 'Fresh flowers';

  return (
    <TouchableOpacity
      style={styles.flowerCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.flowerImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.flowerGradient}
      />
      <View style={styles.flowerInfo}>
        <Text style={styles.flowerName}>{product.name}</Text>
        <Text style={styles.flowerDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const {
    products: allProducts,
    loading: dataLoading,
    error: dataError,
    refreshData,
    getProductColors,
    getProductImage,
  } = useFlowerData();

  const [selectedTab, setSelectedTab] = useState('flowers'); // 'flowers' or 'foliage'
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Helper function to get the best available image URL for a product
   */
  const getImageUrl = useCallback((product) => {
    if (getProductImage) {
      const url = getProductImage(product);
      if (url && !url.startsWith('/')) {
        return url;
      }
    }

    const colors = getProductColors(product.type);
    if (colors && colors.length > 0) {
      const firstColor = colors[0];
      if (firstColor.imageUrl) return firstColor.imageUrl;
      if (firstColor.displayImage && !firstColor.displayImage.startsWith('/')) {
        return firstColor.displayImage;
      }
    }

    if (product.imageUrl) return product.imageUrl;
    if (product.image && !product.image.startsWith('/')) return product.image;

    return PLACEHOLDER_IMAGE;
  }, [getProductColors, getProductImage]);

  // Filter products by selected tab and search query
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const category = FLOWER_CATEGORIES[product.type] || 'flowers';
      return category === selectedTab;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.type?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allProducts, selectedTab, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  const renderFlowerCard = ({ item }) => (
    <FlowerCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      getImageUrl={getImageUrl}
    />
  );

  // Loading state
  if (dataLoading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading flowers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (dataError && !dataLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Icon name="cloud-off-outline" size={60} color={COLORS.textLight} />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>{dataError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Icon name="refresh" size={20} color={COLORS.white} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
    <Header
      title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, ${
        userProfile?.name?.split(' ')[0] || 'Guest'
      }`}
      subtitle="Find perfect flowers for every occasion"
      navigation={navigation}
      showSearch={false}
    />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={22} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search flowers..."
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

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'flowers' && styles.tabActive]}
          onPress={() => setSelectedTab('flowers')}
        >
          <Icon
            name="flower"
            size={18}
            color={selectedTab === 'flowers' ? COLORS.white : COLORS.primary}
          />
          <Text style={[styles.tabText, selectedTab === 'flowers' && styles.tabTextActive]}>
            Flowers & Fillers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'foliage' && styles.tabActive]}
          onPress={() => setSelectedTab('foliage')}
        >
          <Icon
            name="leaf"
            size={18}
            color={selectedTab === 'foliage' ? COLORS.white : COLORS.primary}
          />
          <Text style={[styles.tabText, selectedTab === 'foliage' && styles.tabTextActive]}>
            Foliage & Leaves
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Icon name="star-outline" size={20} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Popular Flowers</Text>
      </View>

      {/* Flower Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderFlowerCard}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon name="flower-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No flowers found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try a different search term' : 'No flowers available in this category'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    gap: 8,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    marginLeft: 10,
    paddingVertical: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    gap: 6,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  flowerCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.2,
    borderRadius: SIZES.radiusLG,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
  },
  flowerImage: {
    width: '100%',
    height: '100%',
  },
  flowerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  flowerInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  flowerName: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 2,
  },
  flowerDescription: {
    fontSize: SIZES.xs,
    color: 'rgba(255,255,255,0.85)',
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
    textAlign: 'center',
  },
});

export default HomeScreen;