import React from 'react';
import { ProductVariant } from '../../types';
import { formatPrice } from '../../utils/formatCurrency';
import { useLanguage } from '../../context/LanguageContext';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelect: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelect
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-stone-900">
          {t('select_size')}: <span className="text-amber-800 font-extrabold">{selectedVariant.label}</span>
        </label>
        <span className="text-stone-500 font-medium text-[11px]">
          {t('price_per_100g')}: <strong>₹{selectedVariant.price_per_100g}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {variants.map(variant => {
          const isSelected = selectedVariant.id === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant)}
              className={`p-3 rounded-xl border-2 text-left transition flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-700 bg-amber-50/80 text-amber-950 shadow-xs'
                  : 'border-stone-200 hover:border-amber-300 bg-white text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{variant.label}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-700" />
                )}
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-heritage text-sm font-black text-amber-950">
                  {formatPrice(variant.price)}
                </span>
                <span className="text-[10px] text-stone-500">
                  ₹{variant.price_per_100g}/100g
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
