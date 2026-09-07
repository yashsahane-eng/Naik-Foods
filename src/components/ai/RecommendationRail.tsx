import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

interface RecommendationRailProps {
  targetProduct?: Product;
  cartProductIds?: string[];
  title?: string;
  onSelectProduct: (productId: string) => void;
  limit?: number;
}

export const RecommendationRail: React.FC<RecommendationRailProps> = ({
  targetProduct,
  cartProductIds,
  title,
  onSelectProduct,
  limit = 4
}) => {
  const { getRecommendationsForProduct, getCartCrossSells, allProducts } = useRecommendations();
  const { addToCart } = useCart();
  const { lang } = useLanguage();

  let items: Product[] = [];
  if (targetProduct) {
    items = getRecommendationsForProduct(targetProduct, limit);
  } else if (cartProductIds) {
    items = getCartCrossSells(cartProductIds, limit);
  } else {
    items = allProducts.slice(0, limit);
  }

  if (items.length === 0) return null;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h3 className="font-heritage text-lg font-bold text-stone-900">
              {title || (lang === 'mr' ? 'तुम्हाला हे देखील आवडेल' : 'You May Also Like (Vector Match)')}
            </h3>
            <span className="text-[11px] text-stone-500">
              Cosine vector similarity & tag co-purchase pairing
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(product => (
          <div
            key={product.id}
            className="group relative bg-white rounded-2xl border border-amber-200/80 p-3 shadow-sm hover:shadow-md hover:border-amber-400 transition flex flex-col"
          >
            <div
              onClick={() => onSelectProduct(product.id)}
              className="relative aspect-square overflow-hidden rounded-xl bg-amber-50 cursor-pointer mb-2.5"
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-900/70 text-white backdrop-blur-xs">
                {product.category}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h4
                  onClick={() => onSelectProduct(product.id)}
                  className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition line-clamp-1 cursor-pointer"
                >
                  {lang === 'mr' ? product.title_mr : product.title}
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  {product.variants[0].label}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                <div>
                  <span className="text-xs font-bold text-amber-900">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[10px] text-stone-400 line-through ml-1">
                    {formatPrice(product.mrp)}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition"
                  title="Add to cart"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
