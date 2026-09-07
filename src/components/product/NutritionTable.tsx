import React, { useState } from 'react';
import { ShieldCheck, Calendar, Info, HeartHandshake, Archive, Flame } from 'lucide-react';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface NutritionTableProps {
  product: Product;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({ product }) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'nutrition' | 'heritage' | 'storage'>('ingredients');

  return (
    <div className="bg-white rounded-2xl border border-amber-200/90 overflow-hidden shadow-xs">
      {/* Tab Navigation */}
      <div className="flex border-b border-amber-100 bg-amber-50/40 text-xs font-bold overflow-x-auto no-scrollbar">
        {[
          { id: 'ingredients', label: t('ingredients') },
          { id: 'nutrition', label: t('nutritional_facts') },
          { id: 'heritage', label: t('heritage_story') },
          { id: 'storage', label: t('storage_instruction') }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 whitespace-nowrap transition border-b-2 ${
              activeTab === tab.id
                ? 'border-amber-700 text-amber-900 bg-white'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 text-sm text-stone-700">
        {/* Ingredients Tab */}
        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                100% Authentic Native Ingredients
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full bg-amber-100/70 text-amber-950 font-medium text-xs border border-amber-300/60 capitalize"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {product.allergen && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Allergen Advisory:</strong> {product.allergen}
                </div>
              </div>
            )}

            {/* FSSAI Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-bold text-stone-900">{t('fssai_certified')}</p>
                  <p className="font-mono text-stone-600">{product.fssai}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>
                  {t('best_before')}: <strong>{product.best_before_days} {t('days')}</strong>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4">
            <p className="text-xs text-stone-500">
              Values calculated per 100g serving according to standard food laboratory analysis:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: 'Energy', val: product.nutrition.calories, highlight: false },
                { label: 'Total Fat', val: product.nutrition.fat, highlight: false },
                { label: 'Protein', val: product.nutrition.protein, highlight: true },
                { label: 'Carbohydrates', val: product.nutrition.carbs, highlight: false },
                { label: 'Sodium', val: product.nutrition.sodium, highlight: false }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center ${
                    item.highlight
                      ? 'bg-amber-100/50 border-amber-300 text-amber-950 font-bold'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <span className="text-[11px] text-stone-500 block">{item.label}</span>
                  <span className="text-sm font-black text-stone-900 mt-0.5 block">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Heritage Story Tab */}
        {activeTab === 'heritage' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>Kolhapuri Family Courtyard Recipe</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-700 italic">
              "{product.recipe_heritage}"
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Passed down through generations of the Naik family, each batch is slow-cured in small earthen jars (barnis) without artificial thickeners, vinegar, or industrial colorants.
            </p>
          </div>
        )}

        {/* Storage Tab */}
        {activeTab === 'storage' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Archive className="w-4 h-4 text-amber-600" />
              <span>Grandmother's Preservation Guidelines</span>
            </div>
            <p className="text-xs leading-relaxed text-stone-700">
              {product.storage}
            </p>
            <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
              <li>Always use a bone-dry spoon to prevent moisture ingress.</li>
              <li>Keep the jar rim wiped clean before re-screwing the lid.</li>
              <li>The cold-pressed oil layer acts as a natural botanical shield against air.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
