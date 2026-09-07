import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle,
  ArrowRight,
  Lock,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, ShippingAddress } from '../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { formatPrice } from '../utils/formatCurrency';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface CheckoutPageProps {
  onOrderPlaced: (order: Order) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderPlaced, onNavigate }) => {
  const { items, subtotal, discount, shipping, total, couponCode, clearCart, pincode, pincodeInfo } = useCart();
  const { lang, t } = useLanguage();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Amol Shinde',
    phone: '9822012345',
    email: 'amol.shinde@example.com',
    addressLine1: 'Flat 402, Shreeram Residency, Sadashiv Peth',
    addressLine2: 'Near Tilak Road Ganpati Temple',
    city: pincodeInfo?.city || 'Pune',
    state: pincodeInfo?.state || 'Maharashtra',
    pincode: pincode || '411030'
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod' | 'card' | 'netbanking'>('upi');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-heritage text-2xl font-bold text-stone-900">Your cart is empty</h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Add some delicious traditional pickles or snacks before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('store')}
          className="px-6 py-3 rounded-xl bg-amber-700 text-white font-bold text-xs"
        >
          {t('start_shopping')}
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // Create confirmed order
      const newOrder: Order = {
        id: `NF-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toISOString().split('T')[0],
        items: [...items],
        subtotal,
        discount,
        shipping,
        total,
        address,
        paymentMethod,
        status: 'confirmed',
        couponCode: couponCode || undefined
      };

      // Save to localStorage: nf_orders
      const existingOrders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
      saveToStorage(STORAGE_KEYS.ORDERS, [newOrder, ...existingOrders]);

      // Fire celebratory confetti!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D97706', '#DC2626', '#16A34A', '#F59E0B']
      });

      clearCart();
      setIsProcessing(false);
      onOrderPlaced(newOrder);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Breadcrumbs
        items={[
          { label: 'Store', label_mr: 'दुकान', view: 'store' },
          { label: 'Cart', label_mr: 'खरेदी पिशवी', view: 'cart' },
          { label: 'Simulated Checkout', label_mr: 'खरेदी पूर्ण करा', active: true }
        ]}
        onNavigate={onNavigate}
      />

      <div className="my-6">
        <h1 className="font-heritage text-3xl font-black text-amber-950">
          Simulated Guest Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          Frontend-only simulation • No payment credentials required
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Customer & Delivery Address */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-heritage text-base font-bold text-stone-900">
                Delivery Address & Contact
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={e => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mobile Phone (for tracking SMS) *</label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={address.phone}
                  onChange={e => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={e => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Street Address, Flat / House No *</label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={e => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={address.addressLine2}
                  onChange={e => setAddress({ ...address, addressLine2: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={e => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={e => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={address.pincode}
                    onChange={e => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Simulated Payment Method */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-heritage text-base font-bold text-stone-900">
                Payment Simulation
              </h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'upi',
                  title: 'Instant UPI (GPay, PhonePe, Paytm)',
                  desc: 'Scan QR code or enter VPA. Instant payment simulation.',
                  icon: <QrCode className="w-5 h-5 text-emerald-600" />
                },
                {
                  id: 'cod',
                  title: 'Cash on Delivery (COD)',
                  desc: 'Pay safely with cash or QR code when courier arrives at your door.',
                  icon: <Truck className="w-5 h-5 text-amber-700" />
                },
                {
                  id: 'card',
                  title: 'Credit / Debit Card (Simulated)',
                  desc: 'Visa, Mastercard, RuPay & Amex accepted.',
                  icon: <CreditCard className="w-5 h-5 text-blue-600" />
                }
              ].map(opt => (
                <label
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id as any)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === opt.id
                      ? 'border-amber-700 bg-amber-50/70 text-amber-950'
                      : 'border-stone-200 hover:border-amber-300 bg-white'
                  }`}
                >
                  <div className="mt-0.5">{opt.icon}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-stone-900">{opt.title}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</p>
                  </div>
                  {paymentMethod === opt.id && (
                    <CheckCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  )}
                </label>
              ))}
            </div>

            {/* UPI Mock QR display */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center gap-4 text-xs">
                <div className="w-20 h-20 bg-white border border-stone-300 rounded-xl p-1 flex items-center justify-center">
                  <div className="w-full h-full bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] bg-[length:10px_10px] rounded" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">Scan UPI QR to Simulate Payment</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    UPI ID: <strong className="font-mono text-amber-900">naikfoods@okaxis</strong>
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Clicking "Place Order" below will automatically simulate successful authorization.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
            <h3 className="font-heritage text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Items ({items.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-stone-100 text-xs">
              {items.map(item => (
                <div key={`${item.product.id}-${item.variant.id}`} className="pt-2 flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-12 h-12 object-cover rounded-lg border border-amber-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-900 truncate">
                      {lang === 'mr' ? item.product.title_mr : item.product.title}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Qty: {item.quantity} • {item.variant.label}
                    </p>
                  </div>
                  <span className="font-bold text-amber-950">
                    {formatPrice(item.variant.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount ({couponCode})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Shipping</span>
                <span className="font-semibold text-stone-900">
                  {shipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-amber-950 font-heritage">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-800/25 transition"
            >
              {isProcessing ? (
                <span>Simulating Payment & Dispatch...</span>
              ) : (
                <>
                  <span>Place Order • {formatPrice(total)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Mock Checkout • Saves to Local Orders</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
