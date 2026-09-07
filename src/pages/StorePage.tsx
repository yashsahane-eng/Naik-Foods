import React, { useState, useEffect, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  Flame,
  Check,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { Product, Category, SpiceLevel, DietaryTag } from '../types';
import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/formatCurrency';

interface StorePageProps {
  initialCategory?: string;
  onSelectProduct: (productId: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  initialCategory,
  onSelectProduct,
  onNavigate
}) => {
  const { lang, t } = useLanguage();
  const allProducts = productsData as Product[];
  const categories = categoriesData as Category[];

  // Filter States synced with URL query
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedSpiceLevels, setSelectedSpiceLevels] = useState<SpiceLevel[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [priceRange, setPriceRange] = useState<number>(800);
  const [selectedWeights, setSelectedWeights] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // A/B test toggle stretch goal
  const [showReviewsCount, setShowReviewsCount] = useState(true);

  // Sync initial category prop if changed externally
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    }
  }, [initialCategory]);

  // Read URL query parameters on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('category');
      const spiceParam = params.get('spice');
      const dietParam = params.get('diet');
      const sortParam = params.get('sort');

      if (catParam) setSelectedCategories(catParam.split(','));
      if (spiceParam) setSelectedSpiceLevels(spiceParam.split(',') as SpiceLevel[]);
      if (dietParam) setSelectedDietary(dietParam.split(',') as DietaryTag[]);
      if (sortParam && ['popularity', 'price_asc', 'price_desc', 'rating'].includes(sortParam)) {
        setSortBy(sortParam as any);
      }
    } catch (e) {
      console.warn('Error reading URL params', e);
    }
  }, []);

  // Update URL query parameters on filter change
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedCategories.length > 0) {
        url.searchParams.set('category', selectedCategories.join(','));
      } else {
        url.searchParams.delete('category');
      }

      if (selectedSpiceLevels.length > 0) {
        url.searchParams.set('spice', selectedSpiceLevels.join(','));
      } else {
        url.searchParams.delete('spice');
      }

      if (selectedDietary.length > 0) {
        url.searchParams.set('diet', selectedDietary.join(','));
      } else {
        url.searchParams.delete('diet');
      }

      if (sortBy !== 'popularity') {
        url.searchParams.set('sort', sortBy);
      } else {
        url.searchParams.delete('sort');
      }

      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn('Error updating URL params', e);
    }
  }, [selectedCategories, selectedSpiceLevels, selectedDietary, sortBy]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(p => {
        // Category Filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
          return false;
        }

        // Spice Level Filter
        if (selectedSpiceLevels.length > 0 && !selectedSpiceLevels.includes(p.spice_level)) {
          return false;
        }

        // Dietary Filter
        if (selectedDietary.length > 0 && !selectedDietary.every(d => p.dietary.includes(d))) {
          return false;
        }

        // Price Filter
        if (p.price > priceRange) {
          return false;
        }

        // Weight Filter
        if (selectedWeights.length > 0 && !selectedWeights.some(w => p.variants.some(v => v.weight_g === w))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.popularity_score - a.popularity_score;
      });
  }, [allProducts, selectedCategories, selectedSpiceLevels, selectedDietary, priceRange, selectedWeights, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedSpiceLevels([]);
    setSelectedDietary([]);
    setPriceRange(800);
    setSelectedWeights([]);
    setSortBy('popularity');
  };

  const activeFilterCount =
    selectedCategories.length +
    selectedSpiceLevels.length +
    selectedDietary.length +
    selectedWeights.length +
    (priceRange < 800 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Store', label_mr: 'दुकान', view: 'store' },
          ...(selectedCategories.length === 1
            ? [{ label: selectedCategories[0], active: true }]
            : [])
        ]}
        onNavigate={onNavigate}
      />

      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-heritage text-3xl font-black text-amber-950">
            {selectedCategories.length === 1 ? selectedCategories[0] : (lang === 'mr' ? 'सर्व उत्पादने' : 'Traditional Pantry Catalogue')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Showing <strong>{filteredProducts.length}</strong> authentic handcrafted items
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          {/* A/B Test toggle */}
          <div className="hidden sm:flex items-center gap-2 bg-stone-100 px-2.5 py-1.5 rounded-xl text-[11px] text-stone-600">
            <span>A/B View:</span>
            <button
              onClick={() => setShowReviewsCount(!showReviewsCount)}
              className={`px-2 py-0.5 rounded font-semibold transition ${
                showReviewsCount ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500'
              }`}
            >
              {showReviewsCount ? 'Stars & Count' : 'Stars Only'}
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-stone-700">
            <span className="font-semibold hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-bold text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="popularity">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Desktop Filter Panel */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              <h3 className="font-bold text-sm text-stone-900">Faceted Filters</h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              Categories
            </h4>
            <div className="space-y-1.5">
              {categories.map(cat => {
                const isChecked = selectedCategories.includes(cat.name);
                return (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between text-xs text-stone-700 hover:text-amber-900 cursor-pointer py-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setSelectedCategories(prev =>
                            prev.includes(cat.name)
                              ? prev.filter(c => c !== cat.name)
                              : [...prev, cat.name]
                          );
                        }}
                        className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                      />
                      <span>{lang === 'mr' ? cat.name_mr : cat.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">({cat.item_count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Spice Level Filter */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              Spice Heat Level
            </h4>
            <div className="space-y-1.5">
              {[
                { id: 'mild', label: 'Mild & Fragrant 🌿' },
                { id: 'medium', label: 'Medium Zing ⚡' },
                { id: 'spicy', label: 'Spicy & Rich 🌶️' },
                { id: 'kolhapuri_fiery', label: 'Kolhapuri Fiery 🔥' }
              ].map(lvl => {
                const isChecked = selectedSpiceLevels.includes(lvl.id as SpiceLevel);
                return (
                  <label
                    key={lvl.id}
                    className="flex items-center gap-2 text-xs text-stone-700 hover:text-amber-900 cursor-pointer py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedSpiceLevels(prev =>
                          prev.includes(lvl.id as SpiceLevel)
                            ? prev.filter(s => s !== lvl.id)
                            : [...prev, lvl.id as SpiceLevel]
                        );
                      }}
                      className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span>{lvl.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              Dietary Preferences
            </h4>
            <div className="space-y-1.5">
              {[
                { id: 'jain_friendly', label: 'Jain Friendly (No Onion/Garlic)' },
                { id: 'upvas', label: 'Upvas / Fasting Compliant' },
                { id: 'vegan', label: '100% Plant-Based Vegan' },
                { id: 'gluten_free', label: 'Gluten-Free' }
              ].map(diet => {
                const isChecked = selectedDietary.includes(diet.id as DietaryTag);
                return (
                  <label
                    key={diet.id}
                    className="flex items-center gap-2 text-xs text-stone-700 hover:text-amber-900 cursor-pointer py-0.5"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedDietary(prev =>
                          prev.includes(diet.id as DietaryTag)
                            ? prev.filter(d => d !== diet.id)
                            : [...prev, diet.id as DietaryTag]
                        );
                      }}
                      className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span>{diet.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Weight Filter */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2.5">
              Pack Size
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[200, 250, 280, 500, 1000].map(weight => {
                const isChecked = selectedWeights.includes(weight);
                return (
                  <button
                    key={weight}
                    onClick={() => {
                      setSelectedWeights(prev =>
                        prev.includes(weight)
                          ? prev.filter(w => w !== weight)
                          : [...prev, weight]
                      );
                    }}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-semibold transition ${
                      isChecked
                        ? 'border-amber-700 bg-amber-100 text-amber-950'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {weight >= 1000 ? '1kg' : `${weight}g`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
              <span>Max Price</span>
              <span className="text-amber-900 font-extrabold">{formatPrice(priceRange)}</span>
            </div>
            <input
              type="range"
              min="150"
              max="800"
              step="50"
              value={priceRange}
              onChange={e => setPriceRange(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-amber-200 p-8">
              <h3 className="font-heritage text-lg font-bold text-stone-900">
                No items match your active filters
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try loosening your filter parameters or clearing categories to see our complete authentic pantry range.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold shadow-md hover:bg-amber-800"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  showReviewsCount={showReviewsCount}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="font-bold text-sm text-stone-900">Filters ({activeFilterCount})</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-700 mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 py-0.5">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => {
                          setSelectedCategories(prev =>
                            prev.includes(cat.name)
                              ? prev.filter(c => c !== cat.name)
                              : [...prev, cat.name]
                          );
                        }}
                      />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Spice */}
              <div>
                <h4 className="text-xs font-bold uppercase text-stone-700 mb-2">Spice Level</h4>
                <div className="space-y-1 text-xs">
                  {['mild', 'medium', 'spicy', 'kolhapuri_fiery'].map(s => (
                    <label key={s} className="flex items-center gap-2 py-0.5">
                      <input
                        type="checkbox"
                        checked={selectedSpiceLevels.includes(s as any)}
                        onChange={() => {
                          setSelectedSpiceLevels(prev =>
                            prev.includes(s as any) ? prev.filter(x => x !== s) : [...prev, s as any]
                          );
                        }}
                      />
                      <span className="capitalize">{s.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
