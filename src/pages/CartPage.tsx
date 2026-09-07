import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Share2,
  Tag,
  MapPin,
  Check,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FreeDeliveryMeter } from '../components/cart/FreeDeliveryMeter';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { formatPrice } from '../utils/formatCurrency';
import { RecommendationRail } from '../components/ai/RecommendationRail';

interface CartPageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onSelectProduct }) => {
  const {
    items,
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
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [pincodeVal, setPincodeVal] = useState(pincode);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const handleCopyShareLink = () => {
    const url = generateShareableCartUrl();
    navigator.clipboard.writeText(url);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Breadcrumbs
        items={[
          { label: 'Store', label_mr: 'दुकान', view: 'store' },
          { label: 'Cart', label_mr: 'खरेदी पिशवी', active: true }
        ]}
        onNavigate={onNavigate}
      />

      <div className="my-6">
        <h1 className="font-heritage text-3xl font-black text-amber-950">
          {t('nav_cart')} ({items.length} items)
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-amber-200 p-8">
          <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10 opacity-70" />
          </div>
          <h2 className="font-heritage text-xl font-bold text-stone-900">{t('cart_empty')}</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Your pantry cart is currently empty. Explore our authentic stone-pounded thechas, traditional pickles, and masalas.
          </p>
          <button
            onClick={() => onNavigate('store')}
            className="mt-6 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition"
          >
            {t('start_shopping')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Meter */}
            <FreeDeliveryMeter />

            <div className="bg-white rounded-2xl border border-amber-200 divide-y divide-stone-100 p-6 shadow-xs">
              {items.map(item => (
                <div
                  key={`${item.product.id}-${item.variant.id}`}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      onClick={() => onSelectProduct(item.product.id)}
                      className="w-20 h-20 object-cover rounded-xl border border-amber-200 cursor-pointer flex-shrink-0"
                    />
                    <div>
                      <h3
                        onClick={() => onSelectProduct(item.product.id)}
                        className="font-heritage text-sm font-bold text-stone-900 hover:text-amber-800 cursor-pointer"
                      >
                        {lang === 'mr' ? item.product.title_mr : item.product.title}
                      </h3>
                      <p className="text-xs text-amber-900 font-semibold mt-0.5">
                        {item.variant.label} • ₹{item.variant.price_per_100g}/100g
                      </p>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        Category: {item.product.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-heritage text-base font-black text-amber-950">
                        {formatPrice(item.variant.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.variant.id)}
                      className="text-stone-400 hover:text-red-600 p-2"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <RecommendationRail
              cartProductIds={items.map(i => i.product.id)}
              title={lang === 'mr' ? 'ग्राहकांनी हे देखील खरेदी केले' : 'Frequently Added With Your Items'}
              onSelectProduct={onSelectProduct}
              limit={4}
            />
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
              <h3 className="font-heritage text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
                {t('order_summary')}
              </h3>

              {/* Pincode ETA */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    Deliver to {pincode}
                  </span>
                  <span className="text-emerald-700 font-bold">
                    {pincodeInfo ? `${pincodeInfo.days} Days ETA` : 'Pan-India'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  {pincodeInfo ? `${pincodeInfo.city}, ${pincodeInfo.state}` : 'Serviceable across India'}
                </p>
              </div>

              {/* Coupon input */}
              <div>
                {couponCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
                    <span className="text-emerald-900 font-bold">Coupon {couponCode} applied</span>
                    <button onClick={removeCoupon} className="text-red-600 font-bold text-xs">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Discount Coupon (NAIK10)"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[11px] mt-1 ${couponMsg.success ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Cost breakdown */}
              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('shipping')}</span>
                  <span className="font-semibold text-stone-900">
                    {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                  <span>{t('total')}</span>
                  <span className="text-amber-950 font-heritage">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-800/25 transition"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Share Cart */}
              <button
                onClick={handleCopyShareLink}
                className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-700" />
                <span>{shareToast ? t('share_cart_copied') : t('share_cart')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
