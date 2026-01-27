// Cart Context - Shopping cart state management (No Pricing)
// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext({});

const CART_STORAGE_KEY = '@growteq_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    if (!loading) {
      saveCart();
    }
  }, [cartItems, loading]);

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.log('Error saving cart:', error);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Create a unique key based on product id, color, and size
      const itemKey = `${product.id}-${product.selectedColor?.id || 'nocolor'}-${product.selectedSize?.id || 'nosize'}`;
      
      const existingIndex = prevItems.findIndex(item => {
        const existingKey = `${item.id}-${item.selectedColor?.id || 'nocolor'}-${item.selectedSize?.id || 'nosize'}`;
        return existingKey === itemKey;
      });
      
      if (existingIndex >= 0) {
        // Update quantity if item with same options exists
        const updated = [...prevItems];
        updated[existingIndex].quantity = quantity; // Replace quantity instead of adding
        updated[existingIndex].requiredDate = product.requiredDate; // Update delivery date
        return updated;
      } else {
        // Add new item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(i => i.id === productId);
      if (item && item.quantity <= 1) {
        return prevItems.filter(i => i.id !== productId);
      }
      return prevItems.map(i => 
        i.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  // Clear cart
  const clearCart = async () => {
    setCartItems([]);
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.log('Error clearing cart:', error);
    }
  };

  // Get total stems count
  const getTotalStems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart item count (number of unique items)
  const getCartCount = () => {
    return cartItems.length;
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      getTotalStems,
      getCartCount,
      isInCart,
      getItemQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

export default CartContext;