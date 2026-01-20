// Enhanced Theme Configuration for Growteq Flowers App
// Premium Flower Shop Aesthetics
// src/utils/theme.js

export const COLORS = {
  // Primary - Elegant Deep Green
  primary: '#1E5631',
  primaryDark: '#0D3B1E',
  primaryLight: '#3A7D4A',
  primaryMuted: '#D4E6D8',
  
  // Secondary - Rose Gold / Blush
  secondary: '#C08081',
  secondaryLight: '#E8C4C4',
  secondaryDark: '#8B5A5B',
  
  // Accent - Warm Gold
  accent: '#D4A574',
  accentLight: '#EAD4B8',
  accentDark: '#B8860B',
  
  // Backgrounds
  background: '#FAFAF8',
  backgroundDark: '#F0EDE8',
  white: '#FFFFFF',
  cream: '#FFF9F0',
  ivory: '#FFFFF0',
  lightGreen: '#E8F5E9',
  
  // Text
  text: '#1A1A1A',
  textSecondary: '#555555',
  textLight: '#888888',
  textMuted: '#AAAAAA',
  textWhite: '#FFFFFF',
  
  // Status
  success: '#2E7D32',
  successLight: '#C8E6C9',
  error: '#C62828',
  errorLight: '#FFCDD2',
  warning: '#F9A825',
  warningLight: '#FFF9C4',
  info: '#1565C0',
  infoLight: '#BBDEFB',
  
  // Product Status
  inStock: '#4CAF50',
  outOfStock: '#9E9E9E',
  limitedStock: '#FF9800',
  
  // Borders & Shadows
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  borderDark: '#CCCCCC',
  shadow: 'rgba(0,0,0,0.08)',
  shadowDark: 'rgba(0,0,0,0.15)',
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
  
  // WhatsApp
  whatsapp: '#25D366',
  whatsappDark: '#128C7E',
  
  // Flower Category Colors
  roses: '#E91E63',
  chrysanthemums: '#9C27B0',
  gypsophila: '#F8BBD9',
  lisianthus: '#7B1FA2',
  limonium: '#5C6BC0',
  carnation: '#EF5350',
  eucalyptus: '#66BB6A',
  songOfIndia: '#8BC34A',
  songOfJamaica: '#4CAF50',
  eustoma: '#AB47BC',
  
  // Gradients
  gradientPrimary: ['#1E5631', '#3A7D4A'],
  gradientSecondary: ['#C08081', '#E8C4C4'],
  gradientAccent: ['#D4A574', '#EAD4B8'],
  gradientWhite: ['#FFFFFF', '#FAFAF8'],
};

export const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  display: 36,
  
  // Font weights (as strings for React Native)
  weightLight: '300',
  weightRegular: '400',
  weightMedium: '500',
  weightSemiBold: '600',
  weightBold: '700',
  weightExtraBold: '800',
  
  // Spacing
  paddingXS: 4,
  paddingSM: 8,
  padding: 16,
  paddingLG: 24,
  paddingXL: 32,
  
  marginXS: 4,
  marginSM: 8,
  margin: 16,
  marginLG: 24,
  marginXL: 32,
  
  // Border Radius
  radiusXS: 4,
  radiusSM: 8,
  radius: 12,
  radiusLG: 16,
  radiusXL: 20,
  radiusFull: 9999,
  
  // Icon sizes
  iconSM: 16,
  iconMD: 20,
  iconLG: 24,
  iconXL: 32,
  
  // Component heights
  inputHeight: 52,
  buttonHeight: 52,
  headerHeight: 56,
  tabBarHeight: 60,
  cardHeight: 200,
};

// Stem Size Options (in cm)
export const STEM_SIZES = {
  roses: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.2 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.4 },
    { id: 'premium', label: '70 cm', value: 70, priceMultiplier: 1.6 },
    { id: 'extra', label: '80 cm', value: 80, priceMultiplier: 1.8 },
  ],
  chrysanthemums: [
    { id: 'small', label: '50 cm', value: 50, priceMultiplier: 1.0 },
    { id: 'medium', label: '60 cm', value: 60, priceMultiplier: 1.15 },
    { id: 'large', label: '70 cm', value: 70, priceMultiplier: 1.3 },
    { id: 'premium', label: '80 cm', value: 80, priceMultiplier: 1.45 },
  ],
  gypsophila: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.2 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.4 },
  ],
  lisianthus: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.2 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.4 },
    { id: 'premium', label: '70 cm', value: 70, priceMultiplier: 1.6 },
  ],
  limonium: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.15 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.3 },
  ],
  carnation: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.15 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.3 },
    { id: 'premium', label: '70 cm', value: 70, priceMultiplier: 1.45 },
  ],
  eucalyptus: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.1 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.2 },
    { id: 'premium', label: '70 cm', value: 70, priceMultiplier: 1.3 },
  ],
  'song-of-india': [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.15 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.3 },
  ],
  'song-of-jamaica': [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.15 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.3 },
  ],
  eustoma: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.2 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.4 },
    { id: 'premium', label: '70 cm', value: 70, priceMultiplier: 1.6 },
  ],
  default: [
    { id: 'small', label: '40 cm', value: 40, priceMultiplier: 1.0 },
    { id: 'medium', label: '50 cm', value: 50, priceMultiplier: 1.15 },
    { id: 'large', label: '60 cm', value: 60, priceMultiplier: 1.3 },
  ],
};

// Quantity Bundles
export const QUANTITY_OPTIONS = [
  { id: '10', label: '10 stems', value: 10, discount: 0 },
  { id: '20', label: '20 stems', value: 20, discount: 0.05 },
  { id: '25', label: '25 stems', value: 25, discount: 0.05 },
  { id: '50', label: '50 stems', value: 50, discount: 0.10 },
  { id: '100', label: '100 stems', value: 100, discount: 0.15 },
  { id: '200', label: '200 stems', value: 200, discount: 0.18 },
  { id: '500', label: '500 stems', value: 500, discount: 0.22 },
];

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
};

export default { COLORS, SIZES, STEM_SIZES, QUANTITY_OPTIONS, SHADOWS };