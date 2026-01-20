// Order Service - Firestore operations for orders
// src\services\orderService.js
import firestore from '@react-native-firebase/firestore';

const ordersRef = firestore().collection('orders');

// Create Order
export const createOrder = async (orderData) => {
  try {
    const docRef = await ordersRef.add({
      ...orderData,
      status: 'pending',
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    
    return { success: true, orderId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get User Orders
export const getUserOrders = async (userId) => {
  try {
    const snapshot = await ordersRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
    
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get Single Order
export const getOrderById = async (orderId) => {
  try {
    const doc = await ordersRef.doc(orderId).get();
    if (doc.exists) {
      const data = doc.data();
      return { 
        success: true, 
        data: { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        } 
      };
    }
    return { success: false, error: 'Order not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update Order Status
export const updateOrderStatus = async (orderId, status) => {
  try {
    await ordersRef.doc(orderId).update({
      status: status,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mark Order as WhatsApp Sent
export const markWhatsAppSent = async (orderId) => {
  try {
    await ordersRef.doc(orderId).update({
      whatsappSent: true,
      whatsappSentAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};