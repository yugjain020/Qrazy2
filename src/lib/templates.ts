import { type BusinessType } from '@/types';

export interface TemplateData {
  templateId: string;
  name: string;
  category: BusinessType;
  description: string;
  previewColor: string;
  gradient: string;
  geometryType: string;
  isPublic: boolean;
  defaultMetadata: Record<string, string>;
}

export const TEMPLATES: TemplateData[] = [
  // Restaurant Templates
  {
    templateId: 'tpl-restaurant-menu-classic',
    name: 'Classic Menu Card',
    category: 'restaurant',
    description: 'Elegant flat card layout perfect for daily specials and menu items',
    previewColor: '#F97316',
    gradient: 'from-orange-500 to-red-500',
    geometryType: 'plate',
    isPublic: true,
    defaultMetadata: { cuisineType: 'Italian', isSpecial: 'No' },
  },
  {
    templateId: 'tpl-restaurant-dish-360',
    name: 'Dish 360° Showcase',
    category: 'restaurant',
    description: 'Circular plate presentation for full dish preview in AR',
    previewColor: '#FB923C',
    gradient: 'from-orange-400 to-amber-500',
    geometryType: 'plate',
    isPublic: true,
    defaultMetadata: { cuisineType: 'Japanese', isSpecial: 'Yes' },
  },
  {
    templateId: 'tpl-restaurant-specials-board',
    name: 'Specials Board',
    category: 'restaurant',
    description: 'Billboard-style AR display for daily specials and promotions',
    previewColor: '#EA580C',
    gradient: 'from-red-500 to-orange-600',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { cuisineType: 'American', isSpecial: 'Yes' },
  },

  // Retail Templates
  {
    templateId: 'tpl-retail-product-card',
    name: 'Product Card',
    category: 'retail',
    description: 'Standard product display card with front-facing image',
    previewColor: '#3B82F6',
    gradient: 'from-blue-500 to-cyan-500',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { category: 'Electronics' },
  },
  {
    templateId: 'tpl-retail-box-preview',
    name: 'Box Preview',
    category: 'retail',
    description: '3D box presentation for packaged products and gift items',
    previewColor: '#2563EB',
    gradient: 'from-blue-600 to-blue-400',
    geometryType: 'box',
    isPublic: true,
    defaultMetadata: { category: 'Accessories' },
  },
  {
    templateId: 'tpl-retail-promo-banner',
    name: 'Promo Banner',
    category: 'retail',
    description: 'Large banner display for promotional campaigns and sales',
    previewColor: '#60A5FA',
    gradient: 'from-blue-400 to-indigo-500',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { category: 'Clothing' },
  },

  // Furniture Templates
  {
    templateId: 'tpl-furniture-room-view',
    name: 'Room Placement',
    category: 'furniture',
    description: '3D box representation for room placement visualization',
    previewColor: '#8B5CF6',
    gradient: 'from-violet-500 to-purple-600',
    geometryType: 'box',
    isPublic: true,
    defaultMetadata: { category: 'Sofa' },
  },
  {
    templateId: 'tpl-furniture-catalog',
    name: 'Catalog Card',
    category: 'furniture',
    description: 'Flat catalog display for furniture collections',
    previewColor: '#7C3AED',
    gradient: 'from-purple-600 to-violet-500',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { category: 'Table' },
  },
  {
    templateId: 'tpl-furniture-miniature',
    name: 'Miniature Preview',
    category: 'furniture',
    description: 'Compact 3D model for quick furniture preview in AR',
    previewColor: '#A78BFA',
    gradient: 'from-violet-400 to-purple-500',
    geometryType: 'box',
    isPublic: true,
    defaultMetadata: { category: 'Cabinet' },
  },

  // Jewelry Templates
  {
    templateId: 'tpl-jewelry-ring-display',
    name: 'Ring Display',
    category: 'jewelry',
    description: 'Toroidal display for rings and circular jewelry items',
    previewColor: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    geometryType: 'ring',
    isPublic: true,
    defaultMetadata: { jewelryType: 'Ring', material: 'Gold' },
  },
  {
    templateId: 'tpl-jewelry-luxury-card',
    name: 'Luxury Card',
    category: 'jewelry',
    description: 'Premium flat card display for high-end jewelry pieces',
    previewColor: '#F472B6',
    gradient: 'from-pink-400 to-rose-400',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { jewelryType: 'Necklace', material: 'Silver' },
  },
  {
    templateId: 'tpl-jewelry-pendant-showcase',
    name: 'Pendant Showcase',
    category: 'jewelry',
    description: 'Elegant display for pendants and delicate pieces',
    previewColor: '#DB2777',
    gradient: 'from-rose-500 to-pink-600',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { jewelryType: 'Earring', material: 'Platinum' },
  },

  // Real Estate Templates
  {
    templateId: 'tpl-realestate-building',
    name: 'Property Tower',
    category: 'real_estate',
    description: 'Tall building model for apartment and commercial property showcase',
    previewColor: '#10B981',
    gradient: 'from-emerald-500 to-teal-500',
    geometryType: 'building',
    isPublic: true,
    defaultMetadata: { propertyType: 'Apartment' },
  },
  {
    templateId: 'tpl-realestate-floorplan',
    name: 'Floor Plan Card',
    category: 'real_estate',
    description: 'Flat display for floor plan images and property layouts',
    previewColor: '#059669',
    gradient: 'from-emerald-600 to-green-500',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { propertyType: 'House' },
  },
  {
    templateId: 'tpl-realestate-listing',
    name: 'Listing Card',
    category: 'real_estate',
    description: 'Standard property listing display with image and details',
    previewColor: '#34D399',
    gradient: 'from-teal-500 to-emerald-400',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { propertyType: 'Condo' },
  },

  // Automotive Templates
  {
    templateId: 'tpl-automotive-showroom',
    name: 'Showroom Display',
    category: 'automotive',
    description: 'Box display for vehicle preview and AR showroom experience',
    previewColor: '#EF4444',
    gradient: 'from-red-500 to-orange-500',
    geometryType: 'box',
    isPublic: true,
    defaultMetadata: { vehicleType: 'Sedan' },
  },
  {
    templateId: 'tpl-automotive-feature-card',
    name: 'Feature Card',
    category: 'automotive',
    description: 'Flat card for highlighting vehicle features and specs',
    previewColor: '#DC2626',
    gradient: 'from-red-600 to-red-400',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: { vehicleType: 'SUV' },
  },

  // General Templates
  {
    templateId: 'tpl-general-product',
    name: 'Universal Product',
    category: 'general',
    description: 'Standard flat product card suitable for any business type',
    previewColor: '#6366F1',
    gradient: 'from-indigo-500 to-blue-500',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: {},
  },
  {
    templateId: 'tpl-general-promo',
    name: 'Promotional Card',
    category: 'general',
    description: 'Eye-catching promotional display for campaigns and offers',
    previewColor: '#818CF8',
    gradient: 'from-indigo-400 to-violet-500',
    geometryType: 'plane',
    isPublic: true,
    defaultMetadata: {},
  },
  {
    templateId: 'tpl-general-3d-box',
    name: '3D Box Display',
    category: 'general',
    description: '3D box representation for packaged or physical products',
    previewColor: '#4F46E5',
    gradient: 'from-indigo-600 to-blue-600',
    geometryType: 'box',
    isPublic: true,
    defaultMetadata: {},
  },
];

export function getTemplatesForBusiness(businessType: BusinessType): TemplateData[] {
  // Get templates for the specific business type plus general templates
  return TEMPLATES.filter(
    (t) => t.category === businessType || t.category === 'general'
  );
}

export function getTemplateById(templateId: string): TemplateData | undefined {
  return TEMPLATES.find((t) => t.templateId === templateId);
}