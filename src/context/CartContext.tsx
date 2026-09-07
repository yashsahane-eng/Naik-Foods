import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Product, ProductVariant, PincodeInfo } from '../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import pincodesData from '../data/pincodes.json';
import productsData from '../data/products.json';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
  hasFreeDelivery: boolean;
  couponCode: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  pincode: string;
  pincodeInfo: PincodeInfo | null;
  checkPincode: (pin: string) => { success: boolean; info?: PincodeInfo; message: string };
  generateShareableCartUrl: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 599;
const STANDARD_SHIPPING_FEE = 60;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    return loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [pincode, setPincode] = useState<string>('411001');
  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo | null>(() => {
    const found = (pincodesData as PincodeInfo[]).find(p => p.pincode === '411001');
    return found || null;
  });

  const [hasTriggeredFreeDeliveryConfetti, setHasTriggeredFreeDeliveryConfetti] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, items);
  }, [items]);

  // Decode shareable cart from URL on first mount
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const sharedCartParam = searchParams.get('cart') || searchParams.get('share_cart');
      if (sharedCartParam) {
        // Format: productId:variantId:quantity,productId:variantId:quantity
        const parts = sharedCartParam.split(',');
        const newItems: CartItem[] = [];

        parts.forEach(part => {
          const [productId, variantId, qtyStr] = part.split(':');
          const product = (productsData as Product[]).find(p => p.id === productId);
          if (product) {
            const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
            const qty = parseInt(qtyStr, 10) || 1;
            newItems.push({ product, variant, quantity: qty });
          }
        });

        if (newItems.length > 0) {
          setItems(newItems);
          setIsCartOpen(true);
        }
      }
    } catch (e) {
      console.warn('Could not parse shared cart url', e);
    }
  }, []);

  const addToCart = useCallback((product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const selectedVariant = variant || product.variants[0];

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.variant.id === selectedVariant.id
      );

      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [...prevItems, { product, variant: selectedVariant, quantity }];
      }
    });

    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId && item.variant.id === variantId)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setItems(prev => prev.map(item => {
      if (item.product.id === productId && item.variant.id === variantId) {
        return { ...item, quantity };
      }
      return item;
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode(null);
  }, []);

  // Calculated totals
  const subtotal = items.reduce((acc, item) => acc + (item.variant.price * item.quantity), 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const hasFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD && items.length > 0;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const shipping = items.length === 0 ? 0 : hasFreeDelivery ? 0 : STANDARD_SHIPPING_FEE;

  // Confetti when crossing free delivery threshold
  useEffect(() => {
    if (hasFreeDelivery && !hasTriggeredFreeDeliveryConfetti) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D97706', '#DC2626', '#16A34A', '#F59E0B']
      });
      setHasTriggeredFreeDeliveryConfetti(true);
    } else if (!hasFreeDelivery) {
      setHasTriggeredFreeDeliveryConfetti(false);
    }
  }, [hasFreeDelivery, hasTriggeredFreeDeliveryConfetti]);

  // Discount computation
  let discount = 0;
  if (couponCode === 'NAIK10') {
    discount = Math.round(subtotal * 0.10);
  } else if (couponCode === 'SWAD50') {
    discount = Math.min(50, subtotal);
  }

  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NAIK10') {
      setCouponCode('NAIK10');
      return { success: true, message: '10% discount applied successfully!' };
    } else if (clean === 'SWAD50') {
      if (subtotal < 300) {
        return { success: false, message: 'SWAD50 is valid on orders above ₹300' };
      }
      setCouponCode('SWAD50');
      return { success: true, message: '₹50 flat discount applied successfully!' };
    }
    return { success: false, message: 'Invalid coupon code. Try NAIK10 or SWAD50' };
  };

  const removeCoupon = () => {
    setCouponCode(null);
  };

  const checkPincode = (pin: string) => {
    const trimmed = pin.trim();
    setPincode(trimmed);
    const found = (pincodesData as PincodeInfo[]).find(p => p.pincode === trimmed);
    if (found) {
      setPincodeInfo(found);
      return {
        success: true,
        info: found,
        message: `Delivery in ${found.days} business days to ${found.city}, ${found.state}. ${found.cod ? 'Cash on Delivery available.' : ''}`
      };
    } else {
      // Fallback: standard pan-India delivery
      const fallbackInfo: PincodeInfo = {
        pincode: trimmed,
        city: 'All India Serviceable',
        state: 'India',
        days: 4,
        serviceable: true,
        cod: true,
        express: false
      };
      setPincodeInfo(fallbackInfo);
      return {
        success: true,
        info: fallbackInfo,
        message: `Delivery available in 3-5 business days via India Post / Bluedart.`
      };
    }
  };

  const generateShareableCartUrl = () => {
    if (items.length === 0) return window.location.href;
    const cartToken = items.map(item => `${item.product.id}:${item.variant.id}:${item.quantity}`).join(',');
    const url = new URL(window.location.href);
    url.searchParams.set('cart', cartToken);
    return url.toString();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        discount,
        shipping,
        total,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountNeededForFreeDelivery,
        hasFreeDelivery,
        couponCode,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        pincode,
        pincodeInfo,
        checkPincode,
        generateShareableCartUrl
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
