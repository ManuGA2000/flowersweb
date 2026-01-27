// Flower Data Context - Global state for flower data from Firebase
// src/context/FlowerDataContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
  getProducts,
  getCategories,
  getAllFlowerColors,
  getStemSizes,
  getAppSettings,
  getFeaturedProducts,
  searchProducts as searchProductsApi,
  getProductsByCategory as getProductsByCategoryApi,
  subscribeToProducts,
  subscribeToCategories,
  clearFlowerCache,
} from '../services/flowerService';

const FlowerDataContext = createContext({});

export const FlowerDataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flowerColors, setFlowerColors] = useState({});
  const [stemSizes, setStemSizes] = useState({});
  const [appSettings, setAppSettings] = useState({
    minimumOrderQuantity: 50,
    quantityOptions: [50, 100, 200, 500],
    deliveryMinDays: 1,
    deliveryMaxDays: 30,
  });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Initial data load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Set up real-time listeners
  useEffect(() => {
    const unsubscribeProducts = subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      // Update featured products
      setFeaturedProducts(updatedProducts.filter(p => p.featured));
    });

    const unsubscribeCategories = subscribeToCategories((updatedCategories) => {
      setCategories(updatedCategories);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load all data in parallel
      const [
        productsData,
        categoriesData,
        colorsData,
        settingsData,
        featuredData,
      ] = await Promise.all([
        getProducts(),
        getCategories(),
        getAllFlowerColors(),
        getAppSettings(),
        getFeaturedProducts(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setFlowerColors(colorsData);
      setAppSettings(settingsData);
      setFeaturedProducts(featuredData);

      // Load stem sizes for each flower type
      const uniqueTypes = [...new Set(productsData.map(p => p.type))];
      const sizesPromises = uniqueTypes.map(async (type) => {
        const sizes = await getStemSizes(type);
        return { type, sizes };
      });
      
      const sizesResults = await Promise.all(sizesPromises);
      const sizesMap = {};
      sizesResults.forEach(({ type, sizes }) => {
        sizesMap[type] = sizes;
      });
      
      // Also get default sizes
      const defaultSizes = await getStemSizes('default');
      sizesMap.default = defaultSizes;
      
      setStemSizes(sizesMap);
      setLastRefresh(Date.now());
    } catch (err) {
      console.error('Error loading flower data:', err);
      setError('Failed to load flower data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = useCallback(async () => {
    await clearFlowerCache();
    await loadInitialData();
  }, []);

  /**
   * Get colors for a product type with proper image URLs
   * This function ensures we use imageUrl (Firebase Storage) when available,
   * falling back to image (local path) for backwards compatibility
   */
  const getProductColors = useCallback((productType) => {
    const colors = flowerColors[productType] || [];
    
    // Map colors to ensure we have proper image URLs
    return colors.map(color => ({
      ...color,
      // Use imageUrl from Firebase Storage if available, otherwise use image field
      // If neither exists, return null
      displayImage: color.imageUrl || color.image || null,
    }));
  }, [flowerColors]);

  /**
   * Get a single color's image URL
   * Prioritizes Firebase Storage URL over local path
   */
  const getColorImageUrl = useCallback((color) => {
    if (!color) return null;
    return color.imageUrl || color.image || null;
  }, []);

  const getProductSizes = useCallback((productType) => {
    return stemSizes[productType] || stemSizes.default || [];
  }, [stemSizes]);

  const getProductById = useCallback((productId) => {
    return products.find(p => p.id === productId) || null;
  }, [products]);

  /**
   * Get the default/primary image for a product
   * Uses the first color's image if available
   */
  const getProductImage = useCallback((product) => {
    if (!product) return null;
    
    // First try to get image from the product's colors
    const colors = flowerColors[product.type] || [];
    if (colors.length > 0) {
      const firstColor = colors[0];
      if (firstColor.imageUrl) return firstColor.imageUrl;
      if (firstColor.image) return firstColor.image;
    }
    
    // Fall back to product's own image field
    if (product.imageUrl) return product.imageUrl;
    if (product.image) return product.image;
    
    // Default placeholder
    return 'https://images.unsplash.com/photo-1518882605630-8eb548fe0eff?w=400';
  }, [flowerColors]);

  const getProductsByCategory = useCallback(async (categoryId) => {
    if (categoryId === 'all') {
      return products;
    }
    return products.filter(p => p.categoryId === categoryId);
  }, [products]);

  const searchProducts = useCallback(async (query) => {
    if (!query.trim()) {
      return products;
    }
    
    const searchLower = query.toLowerCase();
    return products.filter(p =>
      p.name?.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [products]);

  const value = {
    // Data
    products,
    categories,
    flowerColors,
    stemSizes,
    appSettings,
    featuredProducts,
    
    // State
    loading,
    error,
    lastRefresh,
    
    // Functions
    refreshData,
    getProductColors,
    getColorImageUrl,
    getProductSizes,
    getProductById,
    getProductImage,
    getProductsByCategory,
    searchProducts,
  };

  return (
    <FlowerDataContext.Provider value={value}>
      {children}
    </FlowerDataContext.Provider>
  );
};

export const useFlowerData = () => {
  const context = useContext(FlowerDataContext);
  if (!context) {
    throw new Error('useFlowerData must be used within a FlowerDataProvider');
  }
  return context;
};

export default FlowerDataContext;