import React, { useState } from 'react';
import { Package, Truck, Clock, CheckCircle, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { Order } from '../types';
import { loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import { formatPrice } from '../utils/formatCurrency';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface OrdersPageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>(() => {
    return loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  });

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart(item.product, item.variant, item.quantity);
    });
    onNavigate('cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Breadcrumbs
        items={[
          { label: 'Store', label_mr: 'दुकान', view: 'store' },
          { label: 'My Orders', label_mr: 'माझ्या ऑर्डर्स', active: true }
        ]}
        onNavigate={onNavigate}
      />

      <div className="my-6">
        <h1 className="font-heritage text-3xl font-black text-amber-950">
          {t('nav_orders')} ({orders.length})
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Simulated past orders stored in your local browser session (`nf_orders`)
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-amber-200 p-8">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-heritage text-xl font-bold text-stone-900">No past orders yet</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            You haven't placed any orders in this session yet. Complete our simulated checkout to test the order tracking flow.
          </p>
          <button
            onClick={() => onNavigate('store')}
            className="mt-6 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition shadow-md"
          >
            {t('start_shopping')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-900">
                    Order ID: {order.id}
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Placed on: {order.date} • Delivered to: {order.address.city}, {order.address.state}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {order.status === 'confirmed' ? 'In Kitchen Packing' : order.status}
                  </span>

                  <button
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-2 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        onClick={() => onSelectProduct(item.product.id)}
                        className="w-10 h-10 object-cover rounded-lg border border-amber-200 cursor-pointer"
                      />
                      <div>
                        <p
                          onClick={() => onSelectProduct(item.product.id)}
                          className="font-bold text-stone-900 hover:text-amber-800 cursor-pointer"
                        >
                          {lang === 'mr' ? item.product.title_mr : item.product.title}
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Qty: {item.quantity} • {item.variant.label}
                        </p>
                      </div>
                    </div>

                    <span className="font-bold text-stone-900">
                      {formatPrice(item.variant.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Shipping info */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">
                  Payment: <strong className="uppercase">{order.paymentMethod}</strong> • Shipping: {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                </span>
                <div>
                  <span className="text-stone-600 mr-2">Grand Total:</span>
                  <span className="font-heritage text-base font-black text-amber-950">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
