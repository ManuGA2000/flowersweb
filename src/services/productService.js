// Product Service - Firestore operations for products
// src\services\productService.js
import firestore from '@react-native-firebase/firestore';

const productsRef = firestore().collection('products');
const categoriesRef = firestore().collection('categories');

// Get All Categories
export const getCategories = async () => {
  try {
    const snapshot = await categoriesRef.orderBy('order', 'asc').get();
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get All Products
export const getAllProducts = async () => {
  try {
    const snapshot = await productsRef
      .where('inStock', '==', true)
      .get();
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Products by Category
export const getProductsByCategory = async (categoryId) => {
  try {
    let query = productsRef.where('inStock', '==', true);
    
    if (categoryId && categoryId !== 'all') {
      query = query.where('categoryId', '==', categoryId);
    }
    
    const snapshot = await query.get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Single Product
export const getProductById = async (productId) => {
  try {
    const doc = await productsRef.doc(productId).get();
    if (doc.exists) {
      return { success: true, data: { id: doc.id, ...doc.data() } };
    }
    return { success: false, error: 'Product not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Search Products
export const searchProducts = async (searchTerm) => {
  try {
    const snapshot = await productsRef
      .where('inStock', '==', true)
      .get();
    
    const searchLower = searchTerm.toLowerCase();
    const products = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};