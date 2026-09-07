import React, { useState } from 'react';
import { Heart, ShoppingBag, Star, Flame, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  showReviewsCount?: boolean; // A/B test toggle parameter
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  showReviewsCount = true
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { lang, t } = useLanguage();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [addedBounce, setAddedBounce] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant);
    setAddedBounce(true);
    setTimeout(() => setAddedBounce(false), 1200);
  };

  const getSpiceBadge = (level: string) => {
    switch (level) {
      case 'kolhapuri_fiery': return { text: 'Kolhapuri Fiery 🔥', bg: 'bg-red-700 text-white' };
      case 'spicy': return { text: 'Spicy 🌶️', bg: 'bg-red-600 text-white' };
      case 'medium': return { text: 'Medium ⚡', bg: 'bg-amber-600 text-white' };
      default: return { text: 'Mild 🌿', bg: 'bg-emerald-700 text-white' };
    }
  };

  const spice = getSpiceBadge(product.spice_level);

  return (
    <div
      onClick={() => onSelect(product.id)}
      className="group bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-50">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.tags.includes('bestseller') && (
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-amber-600 text-white shadow-xs">
              {t('bestseller')}
            </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${spice.bg}`}>
            {spice.text}
          </span>
        </div>

        {/* Veg icon & Wishlist button */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {/* Veg mark */}
          <div className="w-5 h-5 rounded-md bg-white/90 backdrop-blur-xs flex items-center justify-center p-0.5 border border-emerald-600 shadow-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-xs shadow-xs transition ${
              isFavorited
                ? 'bg-red-600 text-white'
                : 'bg-white/90 text-stone-600 hover:text-red-600'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-amber-800 text-[11px] uppercase tracking-wide">
              {lang === 'mr' ? product.category_mr : product.category}
            </span>
            <div className="flex items-center gap-1 text-stone-700 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{product.rating}</span>
              {showReviewsCount && (
                <span className="text-stone-400 font-normal text-[11px]">
                  ({product.review_count})
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heritage text-sm font-bold text-stone-900 group-hover:text-amber-800 transition line-clamp-1">
            {lang === 'mr' ? product.title_mr : product.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {lang === 'mr' ? product.description_mr : product.description}
          </p>

          {/* Inline Variant Selector */}
          {product.variants.length > 1 && (
            <div className="mt-3 pt-2 border-t border-stone-100 flex items-center gap-1.5">
              {product.variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`text-[11px] px-2 py-1 rounded-lg border font-semibold transition ${
                    selectedVariant.id === variant.id
                      ? 'border-amber-600 bg-amber-50 text-amber-900'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {variant.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heritage text-base font-black text-amber-950">
                {formatPrice(selectedVariant.price)}
              </span>
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.mrp)}
              </span>
            </div>
            <span className="text-[10px] text-stone-500 font-medium block">
              ₹{selectedVariant.price_per_100g}/100g
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs transform active:scale-95 ${
              addedBounce
                ? 'bg-emerald-700 text-white'
                : 'bg-amber-700 hover:bg-amber-800 text-white'
            }`}
          >
            {addedBounce ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t('added_to_cart')}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('add_to_cart')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
