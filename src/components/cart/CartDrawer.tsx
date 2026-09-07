import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Share2,
  Tag,
  Check,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { FreeDeliveryMeter } from './FreeDeliveryMeter';
import { formatPrice } from '../../utils/formatCurrency';
import { RecommendationRail } from '../ai/RecommendationRail';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToProduct: (productId: string) => void;
  onNavigateToStore: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onNavigateToProduct,
  onNavigateToStore
}) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    total,
    couponCode,
    applyCoupon,
    removeCoupon,
    pincode,
    pincodeInfo,
    checkPincode,
    generateShareableCartUrl
  } = useCart();

  const { lang, t } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [pincodeEdit, setPincodeEdit] = useState(false);
  const [pincodeVal, setPincodeVal] = useState(pincode);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const handleCopyShareLink = () => {
    const url = generateShareableCartUrl();
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleUpdatePincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeVal.length === 6) {
      checkPincode(pincodeVal);
      setPincodeEdit(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-amber-200">
          {/* Header */}
          <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-700 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heritage text-lg font-bold text-stone-900">
                  {t('nav_cart')} ({items.length})
                </h3>
                <span className="text-[11px] text-stone-500">
                  {lang === 'mr' ? 'अस्सल महाराष्ट्रीयन फराळ व लोणची' : 'Handcrafted pantry box'}
                </span>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress bar */}
          <div className="px-5 py-3 border-b border-stone-100">
            <FreeDeliveryMeter />
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="text-base font-bold text-stone-900">
                  {t('cart_empty')}
                </h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  {lang === 'mr'
                    ? 'अस्सल आजीच्या हातचे लोणचे आणि खमंग ठेचा निवडून खरेदी सुरू करा!'
                    : 'Explore our authentic stone-pounded thechas, traditional pickles, and Goda masala.'}
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigateToStore();
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold hover:bg-amber-800 shadow-md transition"
                >
                  {t('start_shopping')}
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={`${item.product.id}-${item.variant.id}`} className="py-3 flex gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    onClick={() => {
                      closeCart();
                      onNavigateToProduct(item.product.id);
                    }}
                    className="w-16 h-16 object-cover rounded-xl border border-amber-200 flex-shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5
                        onClick={() => {
                          closeCart();
                          onNavigateToProduct(item.product.id);
                        }}
                        className="text-xs font-bold text-stone-900 truncate hover:text-amber-700 cursor-pointer"
                      >
                        {lang === 'mr' ? item.product.title_mr : item.product.title}
                      </h5>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant.id)}
                        className="text-stone-400 hover:text-red-600 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-amber-900 font-semibold mt-0.5">
                      {item.variant.label} • ₹{item.variant.price_per_100g}/100g
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs font-bold transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 text-xs font-bold transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-950">
                          {formatPrice(item.variant.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Cross-Sell suggestions in drawer */}
            {items.length > 0 && (
              <div className="pt-4 mt-2">
                <RecommendationRail
                  cartProductIds={items.map(i => i.product.id)}
                  title={lang === 'mr' ? 'पिशवीत जोडण्यासाठी शिफारसी' : 'Impulse Add-ons'}
                  onSelectProduct={(id) => {
                    closeCart();
                    onNavigateToProduct(id);
                  }}
                  limit={2}
                />
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-amber-200 bg-amber-50/40 space-y-3">
              {/* Pincode ETA snippet */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-200/60">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>
                    Deliver to: <strong>{pincode}</strong> {pincodeInfo ? `(${pincodeInfo.days} days)` : ''}
                  </span>
                </div>
                {pincodeEdit ? (
                  <form onSubmit={handleUpdatePincode} className="flex gap-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeVal}
                      onChange={e => setPincodeVal(e.target.value)}
                      className="w-20 px-1.5 py-0.5 text-xs border rounded"
                    />
                    <button type="submit" className="text-xs text-amber-800 font-bold">Save</button>
                  </form>
                ) : (
                  <button
                    onClick={() => setPincodeEdit(true)}
                    className="text-xs text-amber-700 underline font-medium hover:text-amber-900"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Coupon Simulator */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coupon <strong>{couponCode}</strong> applied</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 text-[11px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon (e.g. NAIK10, SWAD50)"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMessage && (
                  <p className={`text-[11px] mt-1 font-medium ${couponMessage.success ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{t('discount')} ({couponCode})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('shipping')}</span>
                  <span className="font-semibold text-stone-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-700 font-bold">{t('free')}</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-stone-900">
                  <span>{t('total')}</span>
                  <span className="text-base text-amber-950">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons: Checkout + Share Cart */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeCart();
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-800/25 transition"
                >
                  <span>{t('checkout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCopyShareLink}
                  className="w-full py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>{shareToast ? t('share_cart_copied') : t('share_cart')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
