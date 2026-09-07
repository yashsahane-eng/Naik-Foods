import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Truck,
  ShieldCheck,
  Share2,
  Calendar,
  Flame,
  Clock
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import productsData from '../data/products.json';
import { ProductGallery } from '../components/product/ProductGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { NutritionTable } from '../components/product/NutritionTable';
import { FrequentlyBoughtTogether } from '../components/product/FrequentlyBoughtTogether';
import { ReviewsSection } from '../components/product/ReviewsSection';
import { StickyCtaBar } from '../components/product/StickyCtaBar';
import { RecommendationRail } from '../components/ai/RecommendationRail';
import { PincodeChecker } from '../components/checkout/PincodeChecker';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatCurrency';

interface ProductDetailPageProps {
  productId: string;
  onSelectProduct: (productId: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onSelectProduct,
  onNavigate
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { lang, t } = useLanguage();

  const allProducts = productsData as Product[];
  const product = allProducts.find(p => p.id === productId) || allProducts[0];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedBounce, setAddedBounce] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // If product changed via props, update selected variant
  React.useEffect(() => {
    setSelectedVariant(product.variants[0]);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedBounce(true);
    setTimeout(() => setAddedBounce(false), 1200);
  };

  const handleShareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Accurate Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Store', label_mr: 'दुकान', view: 'store' },
          { label: product.category, label_mr: product.category_mr, view: 'store', param: product.category },
          { label: product.title, label_mr: product.title_mr, active: true }
        ]}
        onNavigate={onNavigate}
      />

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-4 mb-14">
        {/* Left: Interactive Multi-Image Gallery with Zoom */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        {/* Right: Buy Box & Product Info */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Top Badges */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                {lang === 'mr' ? product.category_mr : product.category}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${spice.bg}`}>
                {spice.text}
              </span>
              {product.tags.includes('bestseller') && (
                <span className="text-xs font-bold bg-amber-600 text-white px-2.5 py-0.5 rounded-full">
                  Bestseller
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-heritage text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
              {lang === 'mr' ? product.title_mr : product.title}
            </h1>

            {/* Marathi subtitle if in English */}
            {lang === 'en' && product.title_mr && (
              <p className="font-heritage text-sm text-amber-800 font-bold mt-0.5">
                {product.title_mr}
              </p>
            )}

            {/* Ratings & Reviews */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 bg-amber-500 text-white font-bold px-2 py-0.5 rounded-lg">
                <span>{product.rating}</span>
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-stone-500 font-medium">
                {product.review_count} Verified Customer Reviews
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                100% Kachi Ghani Oil
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-baseline gap-3">
              <span className="font-heritage text-3xl font-black text-amber-950">
                {formatPrice(selectedVariant.price)}
              </span>
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(product.mrp)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Save {formatPrice(product.mrp - selectedVariant.price)} ({(Math.round(((product.mrp - selectedVariant.price) / product.mrp) * 100))}% OFF)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 mt-2 pt-2 border-t border-amber-200/60">
              <span>{t('price_per_100g')}: <strong>₹{selectedVariant.price_per_100g}</strong></span>
              <span>Inclusive of all taxes</span>
            </div>
          </div>

          {/* Dynamic Variant Selector */}
          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onSelect={setSelectedVariant}
          />

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {lang === 'mr' ? product.description_mr : product.description}
          </p>

          {/* Action CTAs: Quantity Stepper, Add to Cart, Wishlist, Share */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-stone-600 hover:bg-stone-100 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-2.5 font-bold text-sm text-stone-900 font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-stone-600 hover:bg-stone-100 font-bold text-sm"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 ${
                  addedBounce
                    ? 'bg-emerald-700 text-white shadow-emerald-800/20'
                    : 'bg-amber-700 hover:bg-amber-800 text-white shadow-amber-800/25'
                }`}
              >
                {addedBounce ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{t('added_to_cart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{t('add_to_cart')} ({formatPrice(selectedVariant.price * quantity)})</span>
                  </>
                )}
              </button>

              {/* Wishlist Heart */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border transition ${
                  isFavorited
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-stone-300 bg-white text-stone-600 hover:border-red-300'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleShareProduct}
                className="p-3.5 rounded-xl border border-stone-300 bg-white text-stone-600 hover:bg-stone-50 transition"
                title="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {shareToast && (
              <p className="text-xs text-emerald-700 font-semibold text-center animate-in fade-in">
                Product link copied to clipboard!
              </p>
            )}
          </div>

          {/* Pincode & Delivery Checker */}
          <PincodeChecker />
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      <div className="mb-14">
        <FrequentlyBoughtTogether
          product={product}
          onSelectProduct={onSelectProduct}
        />
      </div>

      {/* Tabbed Nutrition, Ingredients, FSSAI & Heritage Story */}
      <div className="mb-14">
        <NutritionTable product={product} />
      </div>

      {/* Semantic Cosine Similarity Recommendations */}
      <div className="mb-14">
        <RecommendationRail
          targetProduct={product}
          title={lang === 'mr' ? 'या पदार्थासोबत काय खरेदी केले जाते?' : 'People Also Bought (Vector Match)'}
          onSelectProduct={onSelectProduct}
          limit={4}
        />
      </div>

      {/* Reviews Section */}
      <div className="mb-14">
        <ReviewsSection productId={product.id} />
      </div>

      {/* Floating Bottom Sticky CTA for seamless mobile/desktop conversion */}
      <StickyCtaBar product={product} selectedVariant={selectedVariant} />
    </div>
  );
};
