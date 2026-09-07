import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Sparkles, ArrowRight, CornerDownLeft, ShoppingBag } from 'lucide-react';
import { useFuseSearch } from '../../hooks/useFuseSearch';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatCurrency';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onSelectCategory: (category: string) => void;
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onSelectCategory
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { search } = useFuseSearch();
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();

  const searchAnalysis = useMemo(() => search(query), [query, search]);
  const { results, categoryMatches, didYouMean } = searchAnalysis;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard navigation: Arrow Up/Down, Enter, Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectProduct(results[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectProduct]);

  if (!isOpen) return null;

  // Highlight matched substrings
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.trim()})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-amber-950 font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getSpiceBadge = (level: string) => {
    switch (level) {
      case 'kolhapuri_fiery': return '🔥 Kolhapuri Fiery';
      case 'spicy': return '🌶️ Spicy';
      case 'medium': return '⚡ Medium';
      default: return '🌿 Mild';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-amber-200/80 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 bg-amber-50/50">
          <Search className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t('search_placeholder')}
            className="w-full bg-transparent border-none text-stone-800 placeholder:text-stone-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200/60 mr-2"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-stone-500 bg-stone-200/80 rounded border border-stone-300 hover:bg-stone-300"
          >
            ESC
          </button>
        </div>

        {/* Category Chips & Did You Mean suggestion */}
        <div className="px-4 py-2 bg-amber-50/20 border-b border-amber-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {lang === 'mr' ? 'सुचवलेले:' : 'Quick tags:'}
          </span>
          {categoryMatches.length > 0 ? (
            categoryMatches.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 hover:bg-amber-200 transition font-medium"
              >
                {cat}
              </button>
            ))
          ) : (
            <>
              {['Pickles', 'Thecha', 'Goda Masala', 'Chakli', 'Jain Friendly'].map(preset => (
                <button
                  key={preset}
                  onClick={() => setQuery(preset.toLowerCase())}
                  className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 hover:bg-amber-100 hover:text-amber-900 transition"
                >
                  {preset}
                </button>
              ))}
            </>
          )}

          {didYouMean && (
            <div className="ml-auto text-amber-800 flex items-center gap-1 font-medium">
              <span>{lang === 'mr' ? 'तुम्हाला हे म्हणायचे होते का:' : 'Did you mean:'}</span>
              <button
                onClick={() => setQuery(didYouMean)}
                className="underline text-amber-700 hover:text-amber-950 font-bold"
              >
                "{didYouMean}"
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-stone-100">
          {results.length > 0 ? (
            results.slice(0, 6).map((product, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    isSelected ? 'bg-amber-100/70' : 'hover:bg-stone-50'
                  }`}
                >
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg border border-amber-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 truncate">
                        {renderHighlighted(lang === 'mr' ? product.title_mr : product.title, query)}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600">
                        {product.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {renderHighlighted(product.ingredients.join(', '), query)}
                    </p>

                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="font-bold text-amber-900">{formatPrice(product.price)}</span>
                      <span className="text-stone-400 line-through text-[11px]">{formatPrice(product.mrp)}</span>
                      <span className="text-[11px] text-stone-500">₹{product.price_per_100g}/100g</span>
                      <span className="text-[11px] text-amber-700">{getSpiceBadge(product.spice_level)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition"
                      title="Quick add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(product.id);
                        onClose();
                      }}
                      className="p-2 rounded-lg text-stone-400 hover:text-stone-700"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-stone-600 font-medium">
                {lang === 'mr' ? 'कोणतेही उत्पादन सापडले नाही' : `No products found for "${query}"`}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                {lang === 'mr'
                  ? 'कृपया दुसरा शब्द शोधा किंवा स्पेलिंग तपासा.'
                  : 'Try searching by ingredient (e.g., garlic, peanut, roselle) or category.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-stone-100 text-stone-500 text-xs flex items-center justify-between border-t border-stone-200">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 font-mono text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-300 font-mono text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-amber-800 font-medium">
            ⚡ Client-Side Fuse.js Fuzzy AI
          </span>
        </div>
      </div>
    </div>
  );
};
