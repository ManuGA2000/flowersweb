// Enhanced WhatsApp Service - Send orders via WhatsApp
// src/services/whatsappService.js
import { Linking } from 'react-native';

// ============================================
// CHANGE THIS TO YOUR WHATSAPP BUSINESS NUMBER
// Format: Country code + Number (no + sign)
// Example: India +91 98765 43210 = 919876543210
// ============================================
const WHATSAPP_NUMBER = '919876543210';

// Format currency
const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

// Format date
const formatDate = (date) => {
  if (!date) return 'Not specified';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Generate Order Message
export const generateOrderMessage = (order, user) => {
  const { items, subtotal, totalDiscount, deliveryFee, totalAmount, deliveryType, address, notes } = order;
  
  let message = `🌸 *NEW FLOWER ORDER REQUEST*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  // Customer Details
  message += `👤 *CUSTOMER DETAILS*\n`;
  message += `┌─────────────────────────\n`;
  message += `│ Name: ${user.name || 'N/A'}\n`;
  message += `│ Phone: ${user.phone || 'N/A'}\n`;
  message += `│ Email: ${user.email || 'N/A'}\n`;
  message += `└─────────────────────────\n\n`;
  
  // Order Items
  message += `🛒 *ORDER ITEMS*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  items.forEach((item, index) => {
    message += `*${index + 1}. ${item.name}*\n`;
    
    // Color selection
    if (item.selectedColor) {
      message += `   🎨 Color: ${item.selectedColor.name}\n`;
    }
    
    // Size selection
    if (item.selectedSize) {
      message += `   📏 Size: ${item.selectedSize.label}\n`;
    }
    
    // Quantity
    message += `   📦 Qty: ${item.quantity} ${item.selectedSize ? 'stems' : 'pcs'}\n`;
    
    // Price per unit
    message += `   💰 Price: ${formatPrice(item.pricePerStem || item.price)}/${item.selectedSize ? 'stem' : 'pc'}\n`;
    
    // Discount if applicable
    if (item.discount > 0) {
      message += `   🏷️ Discount: ${Math.round(item.discount * 100)}% off\n`;
    }
    
    // Required delivery date
    if (item.requiredDate) {
      message += `   📅 Required: ${formatDate(item.requiredDate)}\n`;
    }
    
    // Item total
    message += `   ✨ Subtotal: ${formatPrice(item.totalPrice || (item.price * item.quantity))}\n`;
    message += `\n`;
  });
  
  // Price Summary
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💵 *PRICE SUMMARY*\n\n`;
  message += `   Subtotal: ${formatPrice(subtotal)}\n`;
  
  if (totalDiscount > 0) {
    message += `   Volume Discount: -${formatPrice(totalDiscount)}\n`;
  }
  
  if (deliveryType === 'delivery') {
    message += `   Delivery: ${deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}\n`;
  }
  
  message += `\n   ╔════════════════════╗\n`;
  message += `   ║ *TOTAL: ${formatPrice(totalAmount)}* ║\n`;
  message += `   ╚════════════════════╝\n\n`;
  
  // Delivery Details
  message += `🚚 *DELIVERY DETAILS*\n`;
  message += `┌─────────────────────────\n`;
  message += `│ Type: ${deliveryType === 'delivery' ? '📦 Home Delivery' : '🏪 Store Pickup'}\n`;
  
  if (deliveryType === 'delivery' && address) {
    message += `│\n`;
    message += `│ *📍 Address:*\n`;
    message += `│ ${address.street}\n`;
    if (address.landmark) {
      message += `│ Near: ${address.landmark}\n`;
    }
    message += `│ ${address.city}, ${address.state}\n`;
    message += `│ PIN: ${address.pincode}\n`;
  }
  message += `└─────────────────────────\n\n`;
  
  // Special Instructions
  if (notes) {
    message += `📝 *SPECIAL INSTRUCTIONS*\n`;
    message += `┌─────────────────────────\n`;
    message += `│ ${notes}\n`;
    message += `└─────────────────────────\n\n`;
  }
  
  // Footer
  message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📅 Order Date: ${new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}\n`;
  message += `⏰ Time: ${new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })}\n\n`;
  
  message += `_Thank you for choosing Growteq Flowers!_\n`;
  message += `_We will confirm your order shortly._\n`;
  
  return message;
};

// Send Order via WhatsApp
export const sendOrderViaWhatsApp = async (order, user, customNumber = null) => {
  try {
    const phoneNumber = customNumber || WHATSAPP_NUMBER;
    const message = generateOrderMessage(order, user);
    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      return { success: true };
    } else {
      // Try web WhatsApp as fallback
      const webUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      await Linking.openURL(webUrl);
      return { success: true };
    }
  } catch (error) {
    return { 
      success: false, 
      error: 'Could not open WhatsApp. Please make sure WhatsApp is installed.' 
    };
  }
};

// Check if WhatsApp is installed
export const isWhatsAppInstalled = async () => {
  try {
    return await Linking.canOpenURL('whatsapp://send');
  } catch {
    return false;
  }
};

export default {
  sendOrderViaWhatsApp,
  generateOrderMessage,
  isWhatsAppInstalled,
  WHATSAPP_NUMBER,
};