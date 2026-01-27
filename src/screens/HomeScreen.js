// Enhanced Home Screen - Uses Firebase Data with proper image handling
// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Header, SearchBar, ProductCard, Loader, EmptyState } from '../components';
import { CategoryList } from '../components/CategoryChip';
import { useAuth } from '../context/AuthContext';
import { useFlowerData } from '../context/FlowerDataContext';

const { width } = Dimensions.get('window');

// Default placeholder image
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';

// Section Header Component
const SectionHeader = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const { 
    products: allProducts, 
    categories, 
    featuredProducts,
    loading: dataLoading,
    error: dataError,
    refreshData,
    searchProducts,
    getProductsByCategory,
    getProductColors,
    getProductImage, // New helper function
  } = useFlowerData();

  const [displayProducts, setDisplayProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);

  // Update display products when all products change
  useEffect(() => {
    setDisplayProducts(allProducts);
  }, [allProducts]);

  const handleCategorySelect = useCallback(async (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    
    const filtered = await getProductsByCategory(categoryId);
    setDisplayProducts(filtered);
  }, [getProductsByCategory]);

  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    setSearching(true);
    
    try {
      if (!query.trim()) {
        const filtered = await getProductsByCategory(selectedCategory);
        setDisplayProducts(filtered);
      } else {
        const results = await searchProducts(query);
        setDisplayProducts(results);
      }
    } finally {
      setSearching(false);
    }
  }, [selectedCategory, getProductsByCategory, searchProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearchQuery('');
    setSelectedCategory('all');
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  /**
   * Helper function to get the best available image URL for a product
   */
  const getImageUrl = useCallback((product) => {
    // Use the context helper if available
    if (getProductImage) {
      const url = getProductImage(product);
      if (url && !url.startsWith('/')) {
        return url;
      }
    }

    // Get colors for the product type
    const colors = getProductColors(product.type);
    
    if (colors && colors.length > 0) {
      const firstColor = colors[0];
      // Prioritize imageUrl (Firebase Storage) over image (local path)
      if (firstColor.imageUrl) return firstColor.imageUrl;
      if (firstColor.displayImage && !firstColor.displayImage.startsWith('/')) {
        return firstColor.displayImage;
      }
    }
    
    // Check product's own image fields
    if (product.imageUrl) return product.imageUrl;
    if (product.image && !product.image.startsWith('/')) return product.image;
    
    // Return placeholder
    return PLACEHOLDER_IMAGE;
  }, [getProductColors, getProductImage]);

  const renderProduct = ({ item }) => {
    // Get colors for the product with proper image URLs
    const colors = getProductColors(item.type);
    const productImage = getImageUrl(item);
    
    const productWithImage = { 
      ...item, 
      colors,
      displayImage: productImage,
    };
    
    return (
      <ProductCard
        product={productWithImage}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      />
    );
  };

  const renderFeaturedProduct = ({ item }) => {
    const productImage = getImageUrl(item);

    return (
      <TouchableOpacity 
        style={styles.featuredCard}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: productImage }}
          style={styles.featuredImage}
          resizeMode="cover"
          defaultSource={{ uri: PLACEHOLDER_IMAGE }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.featuredGradient}
        />
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.featuredBadgeRow}>
            <View style={styles.inStockBadge}>
              <Text style={styles.inStockText}>
                {item.inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>
        </View>
        {item.featured && (
          <View style={styles.featuredBadge}>
            <Icon name="star" size={10} color={COLORS.white} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Show loading state
  if (dataLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header 
          title={`${getGreeting()}, ${userProfile?.name?.split(' ')[0] || 'Guest'}`}
          subtitle="Find perfect flowers for every occasion"
          navigation={navigation}
          showSearch={false}
        />
        <View style={styles.loadingContainer}>
          <Loader />
          <Text style={styles.loadingText}>Loading flowers...</Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (dataError && !dataLoading) {
    return (
      <View style={styles.container}>
        <Header 
          title={`${getGreeting()}, ${userProfile?.name?.split(' ')[0] || 'Guest'}`}
          subtitle="Find perfect flowers for every occasion"
          navigation={navigation}
          showSearch={false}
        />
        <View style={styles.errorContainer}>
          <Icon name="cloud-off-outline" size={60} color={COLORS.textLight} />
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorText}>{dataError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Icon name="refresh" size={20} color={COLORS.white} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Filter categories (exclude 'all' for display in chips)
  const displayCategories = categories.filter(c => c.id !== 'all');

  return (
    <View style={styles.container}>
      <Header 
        title={`${getGreeting()}, ${userProfile?.name?.split(' ')[0] || 'Guest'}`}
        subtitle="Find perfect flowers for every occasion"
        navigation={navigation}
        showSearch={false}
      />
      
      <FlatList
        data={displayProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={[COLORS.primary]} 
          />
        }
        ListHeaderComponent={() => (
          <View style={styles.headerContent}>
            <SearchBar
              value={searchQuery}
              onChangeText={handleSearch}
              onClear={() => handleSearch('')}
              placeholder="Search flowers, colors..."
            />

            {searching && (
              <View style={styles.searchingIndicator}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.searchingText}>Searching...</Text>
              </View>
            )}

            {!searchQuery && featuredProducts.length > 0 && (
              <View style={styles.section}>
                <SectionHeader 
                  title="Featured Flowers"
                  subtitle="Handpicked for you"
                />
                <FlatList
                  data={featuredProducts}
                  renderItem={renderFeaturedProduct}
                  keyExtractor={item => `featured-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                  scrollEnabled={true}
                />
              </View>
            )}

            {displayCategories.length > 0 && (
              <View style={styles.section}>
                <SectionHeader 
                  title="Shop by Category"
                  subtitle="Browse our collection"
                />
                <CategoryList
                  categories={displayCategories}
                  selectedId={selectedCategory}
                  onSelect={handleCategorySelect}
                />
              </View>
            )}

            <View style={styles.productsHeader}>
              <Text style={styles.productsTitle}>
                {selectedCategory === 'all' 
                  ? 'All Flowers' 
                  : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
              </Text>
              <Text style={styles.productsCount}>{displayProducts.length} items</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Flowers Found" 
            message={searchQuery 
              ? "Try a different search term" 
              : "No flowers available in this category"
            } 
          />
        )}
        contentContainerStyle={styles.listContent}
        scrollEventThrottle={16}
      />
    </View>
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
  headerContent: {
    backgroundColor: COLORS.background,
  },
  searchingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 8,
  },
  searchingText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  featuredCard: {
    width: width * 0.4,
    height: 180,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ...SHADOWS.medium,
    marginRight: 12,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  featuredName: {
    fontSize: SIZES.md,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  featuredBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inStockBadge: {
    backgroundColor: 'rgba(40, 167, 69, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inStockText: {
    fontSize: SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    marginTop: 8,
  },
  productsTitle: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  productsCount: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;