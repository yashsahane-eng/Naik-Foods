import React, { useEffect, useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

interface StickyCtaBarProps {
  product: Product;
  selectedVariant: ProductVariant;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({ product, selectedVariant }) => {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 450px down
      if (window.scrollY > 450) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    addToCart(product, selectedVariant);
    setBounce(true);
    setTimeout(() => setBounce(false), 1200);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-2xl py-3 px-4 sm:px-8 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Product preview */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-12 h-12 object-cover rounded-xl border border-amber-300 flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">
              {lang === 'mr' ? product.title_mr : product.title}
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-extrabold text-amber-950 font-heritage text-sm">
                {formatPrice(selectedVariant.price)}
              </span>
              <span className="text-[11px] text-stone-500 font-medium">
                ({selectedVariant.label})
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAdd}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition transform active:scale-95 ${
            bounce
              ? 'bg-emerald-700 text-white'
              : 'bg-amber-700 hover:bg-amber-800 text-white shadow-amber-800/25'
          }`}
        >
          {bounce ? (
            <>
              <Check className="w-4 h-4" />
              <span>{t('added_to_cart')}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{t('add_to_cart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
