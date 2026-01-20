// Enhanced Home Screen
// src/screens/HomeScreen. js
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Header, SearchBar, ProductCard, Loader, EmptyState } from '../components';
import { CategoryList } from '../components/CategoryChip';
import { CATEGORIES, PRODUCTS, getProductsByCategory, searchProducts } from '../data/flowerData';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

// Section Header Component
const SectionHeader = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles. sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  </View>
);

const HomeScreen = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState(PRODUCTS);
  const [categories] = useState(CATEGORIES. filter(c => c.id !== 'all'));
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const featuredProducts = PRODUCTS.filter(p => p. featured);

  const loadData = useCallback(async () => {
    setLoading(true);
    setTimeout(() => {
      setProducts(PRODUCTS);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const filtered = getProductsByCategory(categoryId);
    setProducts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (! query. trim()) {
      handleCategorySelect(selectedCategory);
      return;
    }
    const results = searchProducts(query);
    setProducts(results);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    setSelectedCategory('all');
    loadData();
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    />
  );

  const renderFeaturedProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.featuredCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=300' }}
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.featuredGradient}
      />
      <View style={styles.featuredInfo}>
        <Text style={styles. featuredName} numberOfLines={1}>{item. name}</Text>
        <Text style={styles.featuredPrice}>From ₹{item.basePrice}/stem</Text>
      </View>
      {item.featured && (
        <View style={styles.featuredBadge}>
          <Icon name="star" size={10} color={COLORS.white} />
        </View>
      )}
    </TouchableOpacity>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <Header 
        title={`${getGreeting()}, ${userProfile?.name?. split(' ')[0] || 'Guest'}`}
        subtitle="Find perfect flowers for every occasion"
        navigation={navigation}
        showSearch={false}
      />
      
      <FlatList
        data={products}
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

            {! searchQuery && featuredProducts.length > 0 && (
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

            <View style={styles.section}>
              <SectionHeader 
                title="Shop by Category"
                subtitle="Browse our collection"
              />
              <CategoryList
                categories={categories}
                selectedId={selectedCategory}
                onSelect={handleCategorySelect}
              />
            </View>

            <View style={styles.productsHeader}>
              <Text style={styles.productsTitle}>
                {selectedCategory === 'all' ? 'All Flowers' :  CATEGORIES. find(c => c.id === selectedCategory)?.name || 'Products'}
              </Text>
              <Text style={styles.productsCount}>{products.length} items</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          loading ? <Loader /> : (
            <EmptyState 
              title="No Flowers Found" 
              message="Try a different search or category" 
            />
          )
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
    backgroundColor: COLORS. background,
  },
  headerContent: {
    backgroundColor: COLORS.background,
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
    fontSize:  SIZES.xl,
    fontWeight: '700',
    color: COLORS. text,
  },
  sectionSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS. textSecondary,
    marginTop: 4,
  },
  horizontalList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  featuredCard: {
    width: width * 0.4,
    height: 180,
    borderRadius:  SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    ... SHADOWS.medium,
    marginRight: 12,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left:  0,
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
    color: COLORS. white,
    marginBottom: 2,
  },
  featuredPrice: {
    fontSize:  SIZES.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height:  24,
    borderRadius:  12,
    backgroundColor:  COLORS.accent,
    justifyContent: 'center',
    alignItems:  'center',
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:  'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS. white,
    borderTopLeftRadius: SIZES.radiusLG,
    borderTopRightRadius: SIZES.radiusLG,
    marginTop: 8,
  },
  productsTitle: {
    fontSize:  SIZES.lg,
    fontWeight: '700',
    color: COLORS. text,
  },
  productsCount: {
    fontSize:  SIZES.sm,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;