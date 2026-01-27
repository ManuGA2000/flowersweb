// Firebase Flower Data Service
// src/services/flowerService.js

import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@growteq_flower_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Collection references
const flowersCollection = firestore().collection('flowers');
const categoriesCollection = firestore().collection('categories');
const colorsCollection = firestore().collection('flowerColors');
const settingsCollection = firestore().collection('settings');

/**
 * Get all flower products from Firebase
 */
export const getProducts = async (forceRefresh = false) => {
  try {
    if (!forceRefresh) {
      const cachedData = await getCachedData('products');
      if (cachedData) return cachedData;
    }

    const snapshot = await flowersCollection
      .where('isActive', '==', true)
      .orderBy('name')
      .get();

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    await cacheData('products', products);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    const cachedData = await getCachedData('products', true);
    return cachedData || [];
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (categoryId) => {
  try {
    if (categoryId === 'all') {
      return await getProducts();
    }

    const snapshot = await flowersCollection
      .where('categoryId', '==', categoryId)
      .where('isActive', '==', true)
      .orderBy('name')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async () => {
  try {
    const snapshot = await flowersCollection
      .where('featured', '==', true)
      .where('isActive', '==', true)
      .limit(10)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (productId) => {
  try {
    const doc = await flowersCollection.doc(productId).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

/**
 * Search products
 */
export const searchProducts = async (query) => {
  try {
    const searchLower = query.toLowerCase();
    const products = await getProducts();
    
    return products.filter(p =>
      p.name?.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

/**
 * Get all categories
 */
export const getCategories = async (forceRefresh = false) => {
  try {
    if (!forceRefresh) {
      const cachedData = await getCachedData('categories');
      if (cachedData) return cachedData;
    }

    const snapshot = await categoriesCollection
      .where('isActive', '==', true)
      .orderBy('order')
      .get();

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const allCategories = [
      { id: 'all', name: 'All Flowers', icon: 'flower-tulip-outline', description: 'Browse all flowers', order: 0 },
      ...categories,
    ];

    await cacheData('categories', allCategories);
    return allCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    const cachedData = await getCachedData('categories', true);
    return cachedData || [];
  }
};

/**
 * Get flower colors by type
 */
export const getFlowerColors = async (flowerType, forceRefresh = false) => {
  try {
    const cacheKey = `colors_${flowerType}`;
    
    if (!forceRefresh) {
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) return cachedData;
    }

    const doc = await colorsCollection.doc(flowerType).get();
    
    if (doc.exists) {
      const colors = doc.data().colors || [];
      await cacheData(cacheKey, colors);
      return colors;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching flower colors:', error);
    return [];
  }
};

/**
 * Get all flower colors
 */
export const getAllFlowerColors = async (forceRefresh = false) => {
  try {
    if (!forceRefresh) {
      const cachedData = await getCachedData('allColors');
      if (cachedData) return cachedData;
    }

    const snapshot = await colorsCollection.get();
    
    const colorsByType = {};
    snapshot.docs.forEach(doc => {
      colorsByType[doc.id] = doc.data().colors || [];
    });

    await cacheData('allColors', colorsByType);
    return colorsByType;
  } catch (error) {
    console.error('Error fetching all flower colors:', error);
    const cachedData = await getCachedData('allColors', true);
    return cachedData || {};
  }
};

/**
 * Get stem sizes
 */
export const getStemSizes = async (flowerType = 'default') => {
  try {
    const doc = await settingsCollection.doc('stemSizes').get();
    
    if (doc.exists) {
      const data = doc.data();
      return data[flowerType] || data.default || getDefaultStemSizes();
    }
    
    return getDefaultStemSizes();
  } catch (error) {
    console.error('Error fetching stem sizes:', error);
    return getDefaultStemSizes();
  }
};

const getDefaultStemSizes = () => [
  { id: 'small', label: '40-50 cm', value: 40 },
  { id: 'medium', label: '50-60 cm', value: 50 },
  { id: 'large', label: '60-70 cm', value: 60 },
  { id: 'premium', label: '70-80 cm', value: 70 },
];

/**
 * Get app settings
 */
export const getAppSettings = async () => {
  try {
    const doc = await settingsCollection.doc('appConfig').get();
    
    if (doc.exists) {
      return doc.data();
    }
    
    return getDefaultSettings();
  } catch (error) {
    console.error('Error fetching app settings:', error);
    return getDefaultSettings();
  }
};

const getDefaultSettings = () => ({
  minimumOrderQuantity: 50,
  quantityOptions: [50, 100, 200, 500],
  deliveryMinDays: 1,
  deliveryMaxDays: 30,
});

// Cache helpers
const cacheData = async (key, data) => {
  try {
    const cacheItem = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(`${CACHE_KEY}_${key}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

const getCachedData = async (key, ignoreExpiry = false) => {
  try {
    const cached = await AsyncStorage.getItem(`${CACHE_KEY}_${key}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      if (!isExpired || ignoreExpiry) return data;
    }
    return null;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

/**
 * Clear cache
 */
export const clearFlowerCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_KEY));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Real-time subscription for products
 */
export const subscribeToProducts = (callback) => {
  return flowersCollection
    .where('isActive', '==', true)
    .onSnapshot(
      snapshot => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(products);
      },
      error => console.error('Products subscription error:', error)
    );
};

/**
 * Real-time subscription for categories
 */
export const subscribeToCategories = (callback) => {
  return categoriesCollection
    .where('isActive', '==', true)
    .orderBy('order')
    .onSnapshot(
      snapshot => {
        const categories = [
          { id: 'all', name: 'All Flowers', icon: 'flower-tulip-outline', description: 'Browse all flowers', order: 0 },
          ...snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ];
        callback(categories);
      },
      error => console.error('Categories subscription error:', error)
    );
};

export default {
  getProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getProductById,
  searchProducts,
  getCategories,
  getFlowerColors,
  getAllFlowerColors,
  getStemSizes,
  getAppSettings,
  clearFlowerCache,
  subscribeToProducts,
  subscribeToCategories,
};