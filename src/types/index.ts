export type SpiceLevel = 'mild' | 'medium' | 'spicy' | 'kolhapuri_fiery';

export type DietaryTag = 'jain_friendly' | 'vegan' | 'upvas' | 'gluten_free' | 'sugar_free';

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  weight_g: number;
  price_per_100g: number;
}

export interface ProductNutrition {
  calories: string;
  fat: string;
  protein: string;
  carbs: string;
  sodium: string;
}

export interface Product {
  id: string;
  title: string;
  title_mr: string;
  category: string;
  category_mr: string;
  price: number;
  mrp: number;
  weight_g: number;
  price_per_100g: number;
  images: string[];
  ingredients: string[];
  allergen: string;
  fssai: string;
  best_before_days: number;
  nutrition: ProductNutrition;
  tags: string[];
  spice_level: SpiceLevel;
  dietary: DietaryTag[];
  popularity_score: number;
  rating: number;
  review_count: number;
  description: string;
  description_mr: string;
  recipe_heritage: string;
  storage: string;
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  name_mr: string;
  description: string;
  description_mr: string;
  image: string;
  item_count: number;
  featured: boolean;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  location: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  photos: string[];
  helpful: number;
}

export interface Reel {
  id: string;
  title: string;
  title_mr: string;
  duration: string;
  views: string;
  thumbnail: string;
  recipe_tag: string;
  product_linked: string;
}

export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  days: number;
  serviceable: boolean;
  cod: boolean;
  express: boolean;
}

export interface FaqDoc {
  id: string;
  category: string;
  question: string;
  content: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: ShippingAddress;
  paymentMethod: 'upi' | 'cod' | 'card' | 'netbanking';
  status: 'confirmed' | 'packed' | 'shipped' | 'delivered';
  couponCode?: string;
}

export interface TasteProfileAnswers {
  spiceComfort: 'mild' | 'medium' | 'spicy' | 'kolhapuri';
  dietary: 'all' | 'jain' | 'upvas' | 'vegan';
  mealCompanion: 'bhakri' | 'dal_rice' | 'snacks' | 'cooking';
  packSize: 'sample' | 'family' | 'bulk';
}

export type Language = 'en' | 'mr';
