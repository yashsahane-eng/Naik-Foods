export const STORAGE_KEYS = {
  CART: 'nf_cart',
  WISHLIST: 'nf_wishlist',
  REVIEWS: 'nf_reviews',
  ORDERS: 'nf_orders',
  USER_PROFILE: 'nf_user_profile',
  LANG: 'nf_lang',
  AB_TEST_REVIEWS: 'nf_ab_reviews_visibility'
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing to localStorage key "${key}":`, err);
  }
}
