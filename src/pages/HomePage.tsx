import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Award,
  Play,
  Heart,
  Truck,
  Leaf,
  CheckCircle2
} from 'lucide-react';
import { Product, Category, Reel } from '../types';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import reelsData from '../data/reels.json';
import { ProductCard } from '../components/product/ProductCard';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenTasteProfile: () => void;
  onOpenAssistant: () => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenTasteProfile,
  onOpenAssistant,
  onSelectProduct
}) => {
  const { lang, t } = useLanguage();
  const products = productsData as Product[];
  const categories = categoriesData as Category[];
  const reels = reelsData as Reel[];

  const bestsellers = products.filter(p => p.tags.includes('bestseller') || p.popularity_score > 93).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-amber-900 to-red-950 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* Background decorative spice pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-800/80 border border-amber-600/60 text-amber-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{lang === 'mr' ? 'अस्सल कोल्हापूरचा घरगुती स्वाद' : 'Authentic Kolhapuri Heritage Recipes'}</span>
            </div>

            <h1 className="font-heritage text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-amber-50">
              {lang === 'mr'
                ? 'आजीच्या हातची अस्सल चव, परंपरेचा खरा ठसका.'
                : 'Purity, Tradition & the Bold Fire of Kolhapur.'}
            </h1>

            <p className="text-base sm:text-lg text-amber-200/90 leading-relaxed max-w-2xl">
              {lang === 'mr'
                ? 'शुद्ध लाकडी घाणीचे तेल, दगडफूल आणि ताज्या मसाल्यांनी सजलेली पारंपारिक लोणची, झणझणीत ठेचा आणि गोडा मसाला.'
                : 'Crafted with 100% cold-pressed oils, stone-crushed Lavangi chilies, and native wild spices in small earthen barnis since 1954.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('store')}
                className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-xl shadow-amber-950/40 flex items-center gap-2 transition transform active:scale-95"
              >
                <span>{t('start_shopping')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTasteProfile}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-amber-300/40 text-amber-100 font-bold text-sm backdrop-blur-md flex items-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{t('taste_profile_title')}</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-800/80 text-xs">
              <div>
                <span className="font-heritage text-xl font-bold text-amber-300 block">100%</span>
                <span className="text-amber-200/80">Cold-Pressed Oils</span>
              </div>
              <div>
                <span className="font-heritage text-xl font-bold text-amber-300 block">0%</span>
                <span className="text-amber-200/80">Chemical Preservatives</span>
              </div>
              <div>
                <span className="font-heritage text-xl font-bold text-amber-300 block">70+ Yrs</span>
                <span className="text-amber-200/80">Kolhapur Courtyard Legacy</span>
              </div>
            </div>
          </div>

          {/* Hero Imagery Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600/40 transform hover:rotate-1 transition duration-500 bg-amber-900">
              <img
                src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80"
                alt="Naik Foods Traditional Pickles & Thecha"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Featured Heritage Pick
                </span>
                <h3 className="font-heritage text-xl font-bold text-white mt-1">
                  Ambadi Bhajiche Lonche
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                  Zesty roselle leaf pickle in mustard oil. Perfect with warm Jowar Bhakri!
                </p>
                <button
                  onClick={() => onSelectProduct('ambadi-bhajiche-lonche')}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-white"
                >
                  View Product Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Taste Profile Finder Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-red-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Client-Side AI Recommender
            </span>
            <h2 className="font-heritage text-2xl sm:text-3xl font-black">
              {lang === 'mr'
                ? 'तुमचा आवडता महाराष्ट्रीयन स्वाद कोणता?'
                : 'Not sure what to start with? Let our AI match your palate!'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100">
              Answer 3 quick questions about your spice tolerance, dietary preferences (Jain/Upvas), and favorite meal pairings to generate your personalized curated pantry box.
            </p>
          </div>

          <button
            onClick={onOpenTasteProfile}
            className="px-6 py-3.5 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 font-black text-sm shadow-xl transition transform active:scale-95 flex items-center gap-2 flex-shrink-0 z-10"
          >
            <span>{t('taste_profile_title')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              {lang === 'mr' ? 'पारंपारिक विभाग' : 'Artisanal Range'}
            </span>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {lang === 'mr' ? 'घराघरात लोकप्रिय' : 'Explore by Category'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('store')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate('store', cat.name)}
              className="group bg-white rounded-2xl border border-amber-200/80 p-3 shadow-2xs hover:shadow-lg hover:border-amber-400 transition cursor-pointer flex flex-col text-center"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-amber-50 mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>
              <h4 className="font-heritage text-xs font-bold text-stone-900 group-hover:text-amber-700 transition line-clamp-1">
                {lang === 'mr' ? cat.name_mr : cat.name}
              </h4>
              <p className="text-[10px] text-stone-500 mt-0.5">
                {cat.item_count} {cat.item_count === 1 ? 'item' : 'items'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              {lang === 'mr' ? 'सर्वाधिक पसंती' : 'Most Loved'}
            </span>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {lang === 'mr' ? 'आमची खास उत्पादने' : 'Naik Foods Bestsellers'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('store')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
          >
            <span>Explore Pantry</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Why Naik Foods / Purity Promise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-900/10 border border-amber-300/80 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              {lang === 'mr' ? 'शुद्धतेचे ३ नियम' : 'The Naik Foods Difference'}
            </span>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Why Our Grandmothers Trust Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-amber-200 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-base font-bold text-stone-900">
                100% Wood-Pressed (Ghani) Oil
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Zero refined or cottonseed oil. We use cold-pressed mustard oil for pungent pickles and aromatic groundnut oil for thechas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-base font-bold text-stone-900">
                Stone-Pounded Khalbatta Texture
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We never turn our thechas into watery puree. Coarsely crushed whole garlic cloves, peanuts, and Lavangi chilies preserve that rustic crunch.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-amber-200 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heritage text-base font-bold text-stone-900">
                Zero Artificial Preservatives
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No Sodium Benzoate, synthetic vinegar, or chemical stabilizers. Our recipes are preserved using age-old solar curing, sea salt, and pure oil layers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reels & Recipe Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
              {lang === 'mr' ? 'पाककृती व व्हिडिओ' : 'Behind the Kitchen'}
            </span>
            <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Grandmother's Video Kitchen Stories
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reels.map(reel => (
            <div
              key={reel.id}
              onClick={() => onSelectProduct(reel.product_linked)}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md cursor-pointer border border-stone-300 hover:border-amber-500 transition"
            >
              <img
                src={reel.thumbnail}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3.5">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] text-white font-semibold">
                    {reel.recipe_tag}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 transition">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white leading-snug line-clamp-2">
                    {lang === 'mr' ? reel.title_mr : reel.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-300">
                    <span>{reel.views} views</span>
                    <span>•</span>
                    <span>{reel.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
