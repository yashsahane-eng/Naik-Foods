import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import productsData from '../data/products.json';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatCurrency';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

interface WishlistPageProps {
  onNavigate: (view: string, param?: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();

  const allProducts = productsData as Product[];
  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <Breadcrumbs
        items={[
          { label: 'Store', label_mr: 'दुकान', view: 'store' },
          { label: 'Wishlist', label_mr: 'माझी आवड', active: true }
        ]}
        onNavigate={onNavigate}
      />

      <div className="my-6">
        <h1 className="font-heritage text-3xl font-black text-amber-950">
          {t('nav_wishlist')} ({wishlistProducts.length})
        </h1>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-amber-200 p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-heritage text-xl font-bold text-stone-900">Your wishlist is empty</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Save your favorite Kolhapuri thechas, pickles, and masalas to view them anytime.
          </p>
          <button
            onClick={() => onNavigate('store')}
            className="mt-6 px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition shadow-md"
          >
            {t('start_shopping')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-amber-50">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    onClick={() => onSelectProduct(product.id)}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-red-600 shadow hover:bg-white"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  {product.category}
                </span>
                <h3
                  onClick={() => onSelectProduct(product.id)}
                  className="font-heritage text-sm font-bold text-stone-900 hover:text-amber-800 cursor-pointer line-clamp-1 mt-0.5"
                >
                  {lang === 'mr' ? product.title_mr : product.title}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="font-heritage text-base font-black text-amber-950">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    {product.variants[0].label}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('add_to_cart')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
