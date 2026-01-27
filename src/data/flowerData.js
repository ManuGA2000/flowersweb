// Flower Product Data - Complete Catalog (No Pricing)
// src/data/flowerData.js

export const FLOWER_TYPES = {
  roses: 'roses',
  chrysanthemums: 'chrysanthemums',
  gypsophila: 'gypsophila',
  lisianthus: 'lisianthus',
  limonium: 'limonium',
  carnation: 'carnation',
  eucalyptus: 'eucalyptus',
  'song-of-india': 'song-of-india',
  'song-of-jamaica': 'song-of-jamaica',
  eustoma: 'eustoma',
};

export const FLOWER_NAMES = {
  roses: 'Roses',
  chrysanthemums: 'Chrysanthemums',
  gypsophila: 'Gypsophila',
  lisianthus: 'Lisianthus',
  limonium: 'Limonium',
  carnation: 'Carnation',
  eucalyptus: 'Eucalyptus',
  'song-of-india': 'Song of India',
  'song-of-jamaica': 'Song of Jamaica',
  eustoma: 'Eustoma',
};

// Color Options for each flower type
// Color Options for each flower type
export const FLOWER_COLORS = {
  roses: [
    { id: 'red', name: 'Red', hex: '#DC143C', image: '/red-roses-bouquet.jpg' },
    { id: 'white', name: 'White', hex: '#FFFAFA', image: '/white-roses-bouquet.jpg' },
    { id: 'pink', name: 'Pink', hex: '#FFB6C1', image: '/pink-roses-bouquet.jpg' },
    { id: 'yellow', name: 'Yellow', hex: '#FFD700', image: '/yellow-roses-bouquet.jpg' },
    { id: 'orange', name: 'Orange', hex: '#FF8C00', image: '/orange-roses-bouquet.jpg' },
    { id: 'peach', name: 'Peach', hex: '#FFDAB9', image: '/peach-roses-bouquet.jpg' },
    { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', image: '/lavender-roses-bouquet.jpg' },
    { id: 'coral', name: 'Coral', hex: '#FF7F50', image: '/coral-roses-bouquet.jpg' },
    { id: 'burgundy', name: 'Burgundy', hex: '#800020', image: '/burgundy-roses-bouquet.jpg' },
    { id: 'cream', name: 'Cream', hex: '#FFFDD0', image: '/cream-roses-bouquet.jpg' },
    { id: 'bicolor-red-white', name: 'Red & White', hex: '#DC143C', bicolor: '#FFFAFA', image: '/bicolor-red-white-roses-bouquet.jpg' },
    { id: 'bicolor-pink-white', name: 'Pink & White', hex: '#FFB6C1', bicolor: '#FFFAFA', image: '/bicolor-pink-white-roses-bouquet.jpg' },
  ],

  chrysanthemums: [
    { id: 'white', name: 'White', hex: '#FFFAFA', image: '/white-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'yellow', name: 'Yellow', hex: '#FFD700', image: '/yellow-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'hot-pink', name: 'Hot Pink', hex: '#FF69B4', image: '/hot-pink-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'light-pink', name: 'Light Pink', hex: '#FFB6C1', image: '/light-pink-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'white-pink-center', name: 'White Pink Center', hex: '#FFFAFA', bicolor: '#FFB6C1', image: '/white-chrysanthemum-flowers-with-pink-center-bouqu.jpg' },
    { id: 'white-dark-center', name: 'White Dark Center', hex: '#FFFAFA', bicolor: '#4A0404', image: '/white-chrysanthemum-flowers-with-dark-center-bouqu.jpg' },
    { id: 'bicolor', name: 'Bicolor Maroon/White', hex: '#800000', bicolor: '#FFFAFA', image: '/bicolor-maroon-white-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'orange', name: 'Orange', hex: '#FF8C00', image: '/orange-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'white-green-center', name: 'White Green Center', hex: '#FFFAFA', bicolor: '#90EE90', image: '/white-chrysanthemum-flowers-with-green-center-bouq.jpg' },
    { id: 'green', name: 'Green', hex: '#90EE90', image: '/green-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', image: '/lavender-purple-chrysanthemum-flowers-bouquet.jpg' },
    { id: 'golden-yellow', name: 'Golden Yellow', hex: '#DAA520', image: '/golden-yellow-chrysanthemum-flowers-bouquet.jpg' },
  ],

  gypsophila: [
    { id: 'white', name: 'White', hex: '#FFFAFA', image: '/white-gypsophila-bouquet.jpg' },
    { id: 'pink', name: 'Pink', hex: '#FFB6C1', image: '/pink-gypsophila-bouquet.jpg' },
    { id: 'light-pink', name: 'Light Pink', hex: '#FFE4E1', image: '/light-pink-gypsophila-bouquet.jpg' },
    { id: 'purple', name: 'Purple', hex: '#9370DB', image: '/purple-gypsophila-bouquet.jpg' },
    { id: 'blue', name: 'Blue', hex: '#6495ED', image: '/blue-gypsophila-bouquet.jpg' },
    { id: 'yellow', name: 'Yellow', hex: '#FFD700', image: '/yellow-gypsophila-bouquet.jpg' },
    { id: 'orange', name: 'Orange', hex: '#FF8C00', image: '/orange-gypsophila-bouquet.jpg' },
    { id: 'red', name: 'Red', hex: '#DC143C', image: '/red-gypsophila-bouquet.jpg' },
    { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', image: '/lavender-gypsophila-bouquet.jpg' },
    { id: 'green', name: 'Green', hex: '#90EE90', image: '/green-gypsophila-bouquet.jpg' },
    { id: 'peach', name: 'Peach', hex: '#FFDAB9', image: '/peach-gypsophila-bouquet.jpg' },
    { id: 'rainbow', name: 'Rainbow Mix', hex: '#FF0000', multicolor: true, image: '/rainbow-gypsophila-bouquet.jpg' },
  ],

  lisianthus: [
    { id: 'white', name: 'White', hex: '#FFFAFA', image: '/white-lisianthus-bouquet.jpg' },
    { id: 'pink', name: 'Pink', hex: '#FFB6C1', image: '/pink-lisianthus-bouquet.jpg' },
    { id: 'purple', name: 'Purple', hex: '#9370DB', image: '/purple-lisianthus-bouquet.jpg' },
    { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', image: '/lavender-lisianthus-bouquet.jpg' },
    { id: 'champagne', name: 'Champagne', hex: '#F7E7CE', image: '/champagne-lisianthus-bouquet.jpg' },
    { id: 'peach', name: 'Peach', hex: '#FFDAB9', image: '/peach-lisianthus-bouquet.jpg' },
    { id: 'green', name: 'Green', hex: '#90EE90', image: '/green-lisianthus-bouquet.jpg' },
    { id: 'blue', name: 'Blue', hex: '#6495ED', image: '/blue-lisianthus-bouquet.jpg' },
    { id: 'bicolor-purple', name: 'Bicolor Purple', hex: '#9370DB', bicolor: '#FFFAFA', image: '/bicolor-purple-lisianthus-bouquet.jpg' },
    { id: 'bicolor-pink', name: 'Bicolor Pink', hex: '#FFB6C1', bicolor: '#FFFAFA', image: '/bicolor-pink-lisianthus-bouquet.jpg' },
    { id: 'cream', name: 'Cream', hex: '#FFFDD0', image: '/cream-lisianthus-bouquet.jpg' },
    { id: 'rose', name: 'Rose', hex: '#FF007F', image: '/rose-lisianthus-bouquet.jpg' },
  ],

  limonium: [
    { id: 'purple', name: 'Purple', hex: '#9370DB', image: '/purple-limonium-bouquet.jpg' },
    { id: 'white', name: 'White', hex: '#FFFAFA', image: '/white-limonium-bouquet.jpg' },
    { id: 'pink', name: 'Pink', hex: '#FFB6C1', image: '/pink-limonium-bouquet.jpg' },
    { id: 'blue', name: 'Blue', hex: '#6495ED', image: '/blue-limonium-bouquet.jpg' },
    { id: 'yellow', name: 'Yellow', hex: '#FFD700', image: '/yellow-limonium-bouquet.jpg' },
    { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', image: '/lavender-limonium-bouquet.jpg' },
    { id: 'peach', name: 'Peach', hex: '#FFDAB9', image: '/peach-limonium-bouquet.jpg' },
    { id: 'hot-pink', name: 'Hot Pink', hex: '#FF69B4', image: '/hot-pink-limonium-bouquet.jpg' },
    { id: 'orange', name: 'Orange', hex: '#FF8C00', image: '/orange-limonium-bouquet.jpg' },
    { id: 'green', name: 'Green', hex: '#90EE90', image: '/green-limonium-bouquet.jpg' },
    { id: 'red', name: 'Red', hex: '#DC143C', image: '/red-limonium-bouquet.jpg' },
    { id: 'mixed', name: 'Mixed', hex: '#FF0000', multicolor: true, image: '/mixed-limonium-bouquet.jpg' },
  ],

  carnation: [
    { id: 'red', name: 'Red', hex: '#DC143C', image: '/red-carnation-bouquet.jpg' },
    { id: 'white', name: 'White', hex: '#FFFAFA', image: '/white-carnation-bouquet.jpg' },
    { id: 'pink', name: 'Pink', hex: '#FFB6C1', image: '/pink-carnation-bouquet.jpg' },
    { id: 'yellow', name: 'Yellow', hex: '#FFD700', image: '/yellow-carnation-bouquet.jpg' },
    { id: 'orange', name: 'Orange', hex: '#FF8C00', image: '/orange-carnation-bouquet.jpg' },
    { id: 'purple', name: 'Purple', hex: '#9370DB', image: '/purple-carnation-bouquet.jpg' },
    { id: 'green', name: 'Green', hex: '#90EE90', image: '/green-carnation-bouquet.jpg' },
    { id: 'burgundy', name: 'Burgundy', hex: '#800020', image: '/burgundy-carnation-bouquet.jpg' },
    { id: 'peach', name: 'Peach', hex: '#FFDAB9', image: '/peach-carnation-bouquet.jpg' },
    { id: 'bicolor-red', name: 'Bicolor Red', hex: '#DC143C', bicolor: '#FFFAFA', image: '/bicolor-red-carnation-bouquet.jpg' },
    { id: 'bicolor-pink', name: 'Bicolor Pink', hex: '#FFB6C1', bicolor: '#FFFAFA', image: '/bicolor-pink-carnation-bouquet.jpg' },
    { id: 'cream', name: 'Cream', hex: '#FFFDD0', image: '/cream-carnation-bouquet.jpg' },
  ],

  eucalyptus: [
    { id: 'silver-dollar', name: 'Silver Dollar', hex: '#C0C0C0', image: '/silver-dollar-eucalyptus.jpg' },
    { id: 'seeded', name: 'Seeded', hex: '#808080', image: '/seeded-eucalyptus.jpg' },
    { id: 'baby-blue', name: 'Baby Blue', hex: '#89CFF0', image: '/baby-blue-eucalyptus.jpg' },
    { id: 'willow', name: 'Willow', hex: '#9ACD32', image: '/willow-eucalyptus.jpg' },
    { id: 'parvifolia', name: 'Parvifolia', hex: '#228B22', image: '/parvifolia-eucalyptus.jpg' },
    { id: 'gunnii', name: 'Gunnii', hex: '#3CB371', image: '/gunnii-eucalyptus.jpg' },
    { id: 'spiral', name: 'Spiral', hex: '#2E8B57', image: '/spiral-eucalyptus.jpg' },
    { id: 'populus', name: 'Populus', hex: '#6B8E23', image: '/populus-eucalyptus.jpg' },
    { id: 'true-blue', name: 'True Blue', hex: '#4682B4', image: '/true-blue-eucalyptus.jpg' },
    { id: 'cinerea', name: 'Cinerea', hex: '#708090', image: '/cinerea-eucalyptus.jpg' },
    { id: 'nicholii', name: 'Nicholii', hex: '#556B2F', image: '/nicholii-eucalyptus.jpg' },
    { id: 'preserved', name: 'Preserved', hex: '#8FBC8F', image: '/preserved-eucalyptus.jpg' },
  ],

  'song-of-india': [
    { id: 'green-yellow', name: 'Green & Yellow', hex: '#9ACD32', bicolor: '#FFD700', image: '/green-yellow-song-of-india.jpg' },
    { id: 'green', name: 'Green', hex: '#228B22', image: '/green-song-of-india.jpg' },
    { id: 'variegated', name: 'Variegated', hex: '#9ACD32', bicolor: '#FFFACD', image: '/variegated-song-of-india.jpg' },
    { id: 'lime', name: 'Lime', hex: '#32CD32', image: '/lime-song-of-india.jpg' },
    { id: 'gold', name: 'Gold', hex: '#FFD700', image: '/gold-song-of-india.jpg' },
    { id: 'cream-edge', name: 'Cream Edge', hex: '#228B22', bicolor: '#FFFDD0', image: '/cream-edge-song-of-india.jpg' },
  ],

  'song-of-jamaica': [
    { id: 'green', name: 'Green', hex: '#228B22', image: '/green-song-of-jamaica.jpg' },
    { id: 'variegated', name: 'Variegated', hex: '#9ACD32', bicolor: '#FFFACD', image: '/variegated-song-of-jamaica.jpg' },
    { id: 'lime-green', name: 'Lime Green', hex: '#32CD32', image: '/lime-green-song-of-jamaica.jpg' },
    { id: 'dark-green', name: 'Dark Green', hex: '#006400', image: '/dark-green-song-of-jamaica.jpg' },
    { id: 'yellow-edge', name: 'Yellow Edge', hex: '#228B22', bicolor: '#FFD700', image: '/yellow-edge-song-of-jamaica.jpg' },
    { id: 'cream', name: 'Cream', hex: '#FFFDD0', image: '/cream-song-of-jamaica.jpg' },
  ],

  eustoma: [
    { id: 'white', name: 'White', hex: '#FFFAFA', image: '/white-eustoma-bouquet.jpg' },
    { id: 'pink', name: 'Pink', hex: '#FFB6C1', image: '/pink-eustoma-bouquet.jpg' },
    { id: 'purple', name: 'Purple', hex: '#9370DB', image: '/purple-eustoma-bouquet.jpg' },
    { id: 'lavender', name: 'Lavender', hex: '#E6E6FA', image: '/lavender-eustoma-bouquet.jpg' },
    { id: 'champagne', name: 'Champagne', hex: '#F7E7CE', image: '/champagne-eustoma-bouquet.jpg' },
    { id: 'peach', name: 'Peach', hex: '#FFDAB9', image: '/peach-eustoma-bouquet.jpg' },
    { id: 'green', name: 'Green', hex: '#90EE90', image: '/green-eustoma-bouquet.jpg' },
    { id: 'blue', name: 'Blue', hex: '#6495ED', image: '/blue-eustoma-bouquet.jpg' },
    { id: 'bicolor-purple', name: 'Bicolor Purple', hex: '#9370DB', bicolor: '#FFFAFA', image: '/bicolor-purple-eustoma-bouquet.jpg' },
    { id: 'bicolor-pink', name: 'Bicolor Pink', hex: '#FFB6C1', bicolor: '#FFFAFA', image: '/bicolor-pink-eustoma-bouquet.jpg' },
    { id: 'cream', name: 'Cream', hex: '#FFFDD0', image: '/cream-eustoma-bouquet.jpg' },
    { id: 'rose', name: 'Rose', hex: '#FF007F', image: '/rose-eustoma-bouquet.jpg' },
  ],
};


// Categories for Navigation
export const CATEGORIES = [
  { id: 'all', name: 'All Flowers', icon: 'flower-tulip-outline', description: 'Browse all flowers' },
  { id: 'roses', name: 'Roses', icon: 'flower', description: 'Premium quality roses' },
  { id: 'chrysanthemums', name: 'Chrysanthemums', icon: 'flower-outline', description: 'Fresh chrysanthemums' },
  { id: 'gypsophila', name: 'Gypsophila', icon: 'flower-tulip', description: "Baby's breath flowers" },
  { id: 'lisianthus', name: 'Lisianthus', icon: 'flower-poppy', description: 'Elegant lisianthus' },
  { id: 'limonium', name: 'Limonium', icon: 'flower-outline', description: 'Statice flowers' },
  { id: 'carnation', name: 'Carnation', icon: 'flower', description: 'Colorful carnations' },
  { id: 'eucalyptus', name: 'Eucalyptus', icon: 'leaf', description: 'Fresh eucalyptus greens' },
  { id: 'song-of-india', name: 'Song of India', icon: 'palm-tree', description: 'Decorative foliage' },
  { id: 'song-of-jamaica', name: 'Song of Jamaica', icon: 'palm-tree', description: 'Tropical foliage' },
  { id: 'eustoma', name: 'Eustoma', icon: 'flower-tulip', description: 'Beautiful eustoma' },
];

// Sample Products (without pricing)
export const PRODUCTS = [
  // Roses
  {
    id: 'rose-red',
    name: 'Red Roses',
    type: 'roses',
    categoryId: 'roses',
    description: 'Premium quality red roses, perfect for expressing love and passion. Fresh cut with long-lasting beauty.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 256,
    tags: ['bestseller', 'romantic', 'premium'],
  },
  {
    id: 'rose-white',
    name: 'White Roses',
    type: 'roses',
    categoryId: 'roses',
    description: 'Pure white roses symbolizing innocence and elegance. Perfect for weddings and special occasions.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 189,
    tags: ['wedding', 'elegant', 'premium'],
  },
  {
    id: 'rose-pink',
    name: 'Pink Roses',
    type: 'roses',
    categoryId: 'roses',
    description: 'Delicate pink roses representing grace and gratitude. A gentle expression of admiration.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 142,
    tags: ['gentle', 'gratitude'],
  },
  {
    id: 'rose-yellow',
    name: 'Yellow Roses',
    type: 'roses',
    categoryId: 'roses',
    description: 'Bright yellow roses symbolizing friendship and joy. Spread happiness with these sunny blooms.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 98,
    tags: ['friendship', 'cheerful'],
  },
  
  // Chrysanthemums
  {
    id: 'chrys-white',
    name: 'White Chrysanthemums',
    type: 'chrysanthemums',
    categoryId: 'chrysanthemums',
    description: 'Classic white chrysanthemums with full blooms. Long-lasting and versatile for any arrangement.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 167,
    tags: ['classic', 'versatile'],
  },
  {
    id: 'chrys-yellow',
    name: 'Yellow Chrysanthemums',
    type: 'chrysanthemums',
    categoryId: 'chrysanthemums',
    description: 'Vibrant yellow chrysanthemums bringing sunshine to any space.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 89,
    tags: ['bright', 'cheerful'],
  },
  {
    id: 'chrys-pink',
    name: 'Pink Chrysanthemums',
    type: 'chrysanthemums',
    categoryId: 'chrysanthemums',
    description: 'Beautiful pink chrysanthemums in various shades.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 76,
    tags: ['elegant'],
  },
  
  // Gypsophila
  {
    id: 'gyps-white',
    name: 'White Gypsophila',
    type: 'gypsophila',
    categoryId: 'gypsophila',
    description: "Delicate white baby's breath, perfect as filler or standalone bouquets.",
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 234,
    tags: ['filler', 'delicate', 'popular'],
  },
  {
    id: 'gyps-pink',
    name: 'Pink Gypsophila',
    type: 'gypsophila',
    categoryId: 'gypsophila',
    description: 'Tinted pink gypsophila for a romantic touch.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 145,
    tags: ['tinted', 'romantic'],
  },
  {
    id: 'gyps-rainbow',
    name: 'Rainbow Gypsophila',
    type: 'gypsophila',
    categoryId: 'gypsophila',
    description: 'Colorful mix of tinted gypsophila in multiple colors.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 178,
    tags: ['colorful', 'trending'],
  },
  
  // Lisianthus
  {
    id: 'lisi-white',
    name: 'White Lisianthus',
    type: 'lisianthus',
    categoryId: 'lisianthus',
    description: 'Elegant white lisianthus with rose-like petals.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 145,
    tags: ['premium', 'elegant'],
  },
  {
    id: 'lisi-purple',
    name: 'Purple Lisianthus',
    type: 'lisianthus',
    categoryId: 'lisianthus',
    description: 'Stunning purple lisianthus for sophisticated arrangements.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 112,
    tags: ['sophisticated'],
  },
  
  // Limonium
  {
    id: 'limo-purple',
    name: 'Purple Limonium',
    type: 'limonium',
    categoryId: 'limonium',
    description: 'Classic purple statice, excellent as filler flower.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 98,
    tags: ['filler', 'dried'],
  },
  {
    id: 'limo-mixed',
    name: 'Mixed Limonium',
    type: 'limonium',
    categoryId: 'limonium',
    description: 'Colorful mix of limonium in various shades.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 67,
    tags: ['mixed', 'colorful'],
  },
  
  // Carnation
  {
    id: 'carn-red',
    name: 'Red Carnation',
    type: 'carnation',
    categoryId: 'carnation',
    description: 'Classic red carnations, long-lasting and vibrant.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.6,
    reviews: 189,
    tags: ['classic', 'long-lasting'],
  },
  {
    id: 'carn-mixed',
    name: 'Mixed Carnations',
    type: 'carnation',
    categoryId: 'carnation',
    description: 'Beautiful assortment of carnation colors.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 134,
    tags: ['assorted'],
  },
  
  // Eucalyptus
  {
    id: 'euca-silver',
    name: 'Silver Dollar Eucalyptus',
    type: 'eucalyptus',
    categoryId: 'eucalyptus',
    description: 'Popular eucalyptus with round silver-green leaves.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 267,
    tags: ['popular', 'greenery'],
  },
  {
    id: 'euca-seeded',
    name: 'Seeded Eucalyptus',
    type: 'eucalyptus',
    categoryId: 'eucalyptus',
    description: 'Eucalyptus with decorative seed pods.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 156,
    tags: ['textured', 'unique'],
  },
  
  // Song of India
  {
    id: 'soi-variegated',
    name: 'Song of India',
    type: 'song-of-india',
    categoryId: 'song-of-india',
    description: 'Variegated foliage with green and yellow stripes.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 78,
    tags: ['foliage', 'tropical'],
  },
  
  // Song of Jamaica
  {
    id: 'soj-green',
    name: 'Song of Jamaica',
    type: 'song-of-jamaica',
    categoryId: 'song-of-jamaica',
    description: 'Lush green tropical foliage for arrangements.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.4,
    reviews: 56,
    tags: ['foliage', 'tropical'],
  },
  
  // Eustoma
  {
    id: 'eust-white',
    name: 'White Eustoma',
    type: 'eustoma',
    categoryId: 'eustoma',
    description: 'Delicate white eustoma flowers, similar to lisianthus.',
    unit: 'stem',
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 134,
    tags: ['delicate', 'premium'],
  },
  {
    id: 'eust-pink',
    name: 'Pink Eustoma',
    type: 'eustoma',
    categoryId: 'eustoma',
    description: 'Soft pink eustoma for romantic arrangements.',
    unit: 'stem',
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 98,
    tags: ['romantic'],
  },
];

// Helper function to get colors for a product
export const getProductColors = (productType) => {
  return FLOWER_COLORS[productType] || [];
};

// Helper function to get product by ID
export const getProductById = (productId) => {
  return PRODUCTS.find(p => p.id === productId);
};

// Helper function to get products by category
export const getProductsByCategory = (categoryId) => {
  if (categoryId === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.categoryId === categoryId);
};

// Helper function to search products
export const searchProducts = (query) => {
  const searchLower = query.toLowerCase();
  return PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchLower) ||
    p.description.toLowerCase().includes(searchLower) ||
    p.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

export default {
  FLOWER_TYPES,
  FLOWER_NAMES,
  FLOWER_COLORS,
  CATEGORIES,
  PRODUCTS,
  getProductColors,
  getProductById,
  getProductsByCategory,
  searchProducts,
};