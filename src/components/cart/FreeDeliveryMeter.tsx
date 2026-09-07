import React from 'react';
import { Truck, CheckCircle2, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

export const FreeDeliveryMeter: React.FC = () => {
  const { subtotal, freeDeliveryThreshold, hasFreeDelivery, amountNeededForFreeDelivery } = useCart();
  const { lang } = useLanguage();

  const percentage = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 shadow-2xs">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5">
          {hasFreeDelivery ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
          ) : (
            <Truck className="w-4 h-4 text-amber-700" />
          )}
          <span className="font-bold text-stone-900">
            {hasFreeDelivery ? (
              <span className="text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                {lang === 'mr' ? 'मोफत एक्सप्रेस डिलिव्हरी अनलॉक झाली!' : 'FREE Express Delivery Unlocked!'}
              </span>
            ) : (
              <span>
                {lang === 'mr' ? 'मोफत डिलिव्हरीसाठी अजून' : 'Add'}{' '}
                <strong className="text-amber-900 font-extrabold">{formatPrice(amountNeededForFreeDelivery)}</strong>{' '}
                {lang === 'mr' ? 'ची खरेदी करा!' : 'more for FREE delivery!'}
              </span>
            )}
          </span>
        </div>
        <span className="font-extrabold text-amber-800 text-[11px]">{percentage}%</span>
      </div>

      {/* Animated Progress Bar */}
      <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden p-0.5 relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative ${
            hasFreeDelivery
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : 'bg-gradient-to-r from-amber-500 to-red-600'
          }`}
          style={{ width: `${percentage}%` }}
        >
          {/* Subtle pulse animation indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full animate-ping opacity-75" />
        </div>
      </div>
    </div>
  );
};
