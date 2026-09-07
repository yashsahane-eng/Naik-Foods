import React, { useState } from 'react';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

interface FrequentlyBoughtTogetherProps {
  product: Product;
  onSelectProduct: (productId: string) => void;
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  product,
  onSelectProduct
}) => {
  const { getBundleForProduct } = useRecommendations();
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();

  const bundle = getBundleForProduct(product);
  const [selectedIds, setSelectedIds] = useState<string[]>(bundle.items.map(i => i.id));
  const [bundleAdded, setBundleAdded] = useState(false);

  const toggleItem = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = bundle.items.filter(i => selectedIds.includes(i.id));
  const rawSubtotal = selectedItems.reduce((sum, i) => sum + i.price, 0);
  const isAllSelected = selectedIds.length === bundle.items.length;
  const bundleDiscount = isAllSelected ? Math.round(rawSubtotal * 0.10) : 0;
  const bundleFinalPrice = rawSubtotal - bundleDiscount;

  const handleAddBundle = () => {
    selectedItems.forEach(item => {
      addToCart(item);
    });
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 2000);
  };

  return (
    <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-700" />
        <div>
          <h3 className="font-heritage text-base font-bold text-stone-900">
            {t('frequently_bought_together')}
          </h3>
          <p className="text-xs text-stone-500">
            {t('save_bundle')}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Products in bundle */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
          {bundle.items.map((item, index) => {
            const isChecked = selectedIds.includes(item.id);
            return (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border-2 transition cursor-pointer bg-white ${
                    isChecked ? 'border-amber-600 shadow-xs' : 'border-stone-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                      isChecked ? 'bg-amber-700 border-amber-700 text-white' : 'border-stone-300'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>

                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />

                  <div className="text-left">
                    <p className="text-xs font-bold text-stone-900 max-w-[120px] truncate">
                      {lang === 'mr' ? item.title_mr : item.title}
                    </p>
                    <p className="text-[11px] font-bold text-amber-900">{formatPrice(item.price)}</p>
                  </div>
                </div>

                {index < bundle.items.length - 1 && (
                  <Plus className="w-4 h-4 text-stone-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bundle Summary and CTA */}
        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heritage text-lg font-black text-amber-950">
                {formatPrice(bundleFinalPrice)}
              </span>
              {bundleDiscount > 0 && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(rawSubtotal)}
                </span>
              )}
            </div>
            {bundleDiscount > 0 && (
              <span className="text-[11px] text-emerald-700 font-bold">
                You save {formatPrice(bundleDiscount)} (10% Combo OFF)
              </span>
            )}
          </div>

          <button
            onClick={handleAddBundle}
            disabled={selectedItems.length === 0}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-800/20 transition"
          >
            {bundleAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Bundle Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{t('add_bundle')} ({selectedItems.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
