import React from 'react';
import { CheckCircle, Truck, Package, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { formatPrice } from '../utils/formatCurrency';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface OrderConfirmationPageProps {
  order: Order;
  onNavigate: (view: string, param?: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onNavigate
}) => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();

  const handleReorder = () => {
    order.items.forEach(item => {
      addToCart(item.product, item.variant, item.quantity);
    });
    onNavigate('cart');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-amber-200 p-8 shadow-xl text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10 animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed!
          </span>
          <h1 className="font-heritage text-3xl font-black text-stone-900 mt-2">
            धन्यवाद! Thank you for ordering from Naik Foods.
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Order Reference: <strong className="font-mono text-amber-900 text-sm">{order.id}</strong> • Placed on {order.date}
          </p>
        </div>

        {/* Tracking Timeline Simulation */}
        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 text-left space-y-4">
          <h3 className="font-heritage text-sm font-bold text-stone-900">
            Simulated Kitchen Dispatch Timeline
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle className="w-4 h-4" />
              </div>
              <p className="font-bold text-stone-900 text-[11px]">Confirmed</p>
              <p className="text-[10px] text-stone-400">Today, 2:15 PM</p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto">
                <Package className="w-4 h-4" />
              </div>
              <p className="font-bold text-stone-900 text-[11px]">Packing Jars</p>
              <p className="text-[10px] text-stone-400">Foil Sealed</p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
                <Truck className="w-4 h-4" />
              </div>
              <p className="font-semibold text-stone-500 text-[11px]">In Transit</p>
              <p className="text-[10px] text-stone-400">Bluedart Express</p>
            </div>

            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center mx-auto">
                <Clock className="w-4 h-4" />
              </div>
              <p className="font-semibold text-stone-500 text-[11px]">Delivery</p>
              <p className="text-[10px] text-stone-400">In 2 Business Days</p>
            </div>
          </div>
        </div>

        {/* Order Details & Delivery Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
            <p className="font-bold text-stone-800">Delivering To:</p>
            <p className="font-semibold text-stone-900">{order.address.fullName}</p>
            <p className="text-stone-600">{order.address.addressLine1}</p>
            <p className="text-stone-600">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p className="text-stone-500">Phone: {order.address.phone}</p>
          </div>

          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-1">
            <p className="font-bold text-stone-800">Payment & Summary:</p>
            <p className="text-stone-600">Method: <strong className="uppercase">{order.paymentMethod}</strong></p>
            <p className="text-stone-600">Total Items: {order.items.length}</p>
            <p className="text-stone-600">Shipping: {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</p>
            <p className="font-bold text-sm text-amber-950 pt-1 border-t border-stone-200">
              Total Paid: {formatPrice(order.total)}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('orders')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold transition"
          >
            View My Orders
          </button>
          <button
            onClick={handleReorder}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Re-Order This Box</span>
          </button>
          <button
            onClick={() => onNavigate('store')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
