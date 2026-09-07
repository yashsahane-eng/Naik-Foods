import React, { useState, useRef } from 'react';
import { X, Upload, Palette, Sparkles, Image as ImageIcon, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import productsData from '../../data/products.json';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

interface VisualRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}

const SAMPLE_PALETTES = [
  { name: 'Kolhapuri Crimson Red', color: '#B91C1C', desc: 'Fiery red chilies & rich tarri rassa', tag: 'kolhapuri_fiery' },
  { name: 'Lavangi Chili Emerald', color: '#15803D', desc: 'Fresh crushed green chilies & garlic', tag: 'Thecha & Chutneys' },
  { name: 'Golden Mustard Amber', color: '#D97706', desc: 'Cold-pressed mustard oil & raw mango', tag: 'Pickles' },
  { name: 'Shahi Dark Masala Brown', color: '#78350F', desc: 'Roasted dry copra & dagad phool', tag: 'Authentic Masalas' },
  { name: 'Wild Kokum Deep Plum', color: '#831843', desc: 'Amsul fruit extract for Solkadhi', tag: 'Syrups & Agal' }
];

export const VisualRecommenderModal: React.FC<VisualRecommenderModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const [analyzedColor, setAnalyzedColor] = useState<string | null>(null);
  const [analyzedLabel, setAnalyzedLabel] = useState<string | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const matchProductsByHeuristic = (r: number, g: number, b: number, hex: string, label: string) => {
    setAnalyzedColor(hex);
    setAnalyzedLabel(label);

    const products = productsData as Product[];
    let matches: Product[] = [];

    // Color tone heuristics
    if (r > 140 && g < 80 && b < 80) {
      // Deep Crimson / Red -> Spicy Kanda Lasun, Thecha, Malvani
      matches = products.filter(p => p.spice_level === 'kolhapuri_fiery' || p.spice_level === 'spicy' || p.tags.includes('bestseller'));
    } else if (g > r && g > b) {
      // Emerald Green -> Green Thecha
      matches = products.filter(p => p.id.includes('thecha') || p.ingredients.some(i => i.includes('green')));
    } else if (r > 160 && g > 120 && b < 80) {
      // Golden Amber / Yellow -> Pickles, Methamba, Limbu, Chakli
      matches = products.filter(p => p.category === 'Pickles' || p.id.includes('chakli'));
    } else if (r < 120 && g < 100 && b < 90) {
      // Dark earthy brown -> Goda Masala, Jawas Flaxseed
      matches = products.filter(p => p.id.includes('goda') || p.id.includes('jawas') || p.category === 'Authentic Masalas');
    } else if (r > 100 && b > 80 && g < 70) {
      // Purple / Plum -> Kokum Agal
      matches = products.filter(p => p.id.includes('kokum'));
    } else {
      matches = products.slice(0, 4);
    }

    setMatchedProducts(matches.slice(0, 4));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);

      // Create image in memory to sample average color via Canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 100, 100);
        const imgData = ctx.getImageData(0, 0, 100, 100).data;

        let totalR = 0, totalG = 0, totalB = 0;
        const totalPixels = imgData.length / 4;

        for (let i = 0; i < imgData.length; i += 4) {
          totalR += imgData[i];
          totalG += imgData[i + 1];
          totalB += imgData[i + 2];
        }

        const avgR = Math.round(totalR / totalPixels);
        const avgG = Math.round(totalG / totalPixels);
        const avgB = Math.round(totalB / totalPixels);
        const hex = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;

        matchProductsByHeuristic(avgR, avgG, avgB, hex, 'Uploaded Image Texture');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_PALETTES[0]) => {
    setImagePreview(null);
    if (sample.tag === 'kolhapuri_fiery') {
      matchProductsByHeuristic(185, 28, 28, sample.color, sample.name);
    } else if (sample.tag === 'Thecha & Chutneys') {
      matchProductsByHeuristic(21, 128, 61, sample.color, sample.name);
    } else if (sample.tag === 'Pickles') {
      matchProductsByHeuristic(217, 119, 6, sample.color, sample.name);
    } else if (sample.tag === 'Authentic Masalas') {
      matchProductsByHeuristic(120, 53, 15, sample.color, sample.name);
    } else {
      matchProductsByHeuristic(131, 24, 67, sample.color, sample.name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 bg-amber-500/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-700 text-white">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heritage text-base font-bold text-stone-900">
                {t('visual_match_title')}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? 'फोटो किंवा रंग निवडा आणि सुसंगत पदार्थ शोधा' : 'Image color & texture heuristic recommender'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Upload Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer bg-amber-50/40 hover:bg-amber-50 transition group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            {imagePreview ? (
              <div className="flex items-center justify-center gap-4">
                <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl shadow border border-amber-300" />
                <div className="text-left">
                  <p className="text-xs font-bold text-amber-900">Image Analyzed Successfully</p>
                  <p className="text-xs text-stone-500">Click here to upload another photo</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-stone-800">
                  Drop an appetizing food photo or click to upload
                </p>
                <p className="text-xs text-stone-500">
                  Our client canvas analyzer detects dominant hues (chili red, roasted amber, deep spice)
                </p>
              </div>
            )}
          </div>

          {/* Quick Preset Palettes */}
          <div>
            <p className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Or pick an authentic Maharashtrian color tone:
            </p>
            <div className="grid grid-cols-5 gap-2">
              {SAMPLE_PALETTES.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sp)}
                  className="flex flex-col items-center p-2 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition group text-center"
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-sm mb-1.5 group-hover:scale-110 transition"
                    style={{ backgroundColor: sp.color }}
                  />
                  <span className="text-[10px] font-medium text-stone-700 line-clamp-1">{sp.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {matchedProducts.length > 0 && (
            <div className="pt-3 border-t border-stone-200">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full border border-stone-300 shadow-sm"
                  style={{ backgroundColor: analyzedColor || '#D97706' }}
                />
                <h4 className="text-xs font-bold text-stone-800">
                  Matching Flavor Profile: <span className="text-amber-800">{analyzedLabel}</span>
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {matchedProducts.map(product => (
                  <div
                    key={product.id}
                    className="flex items-center gap-2 p-2 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50 transition"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded-lg border border-amber-200 flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        onSelectProduct(product.id);
                        onClose();
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        onClick={() => {
                          onSelectProduct(product.id);
                          onClose();
                        }}
                        className="text-xs font-bold text-stone-900 truncate hover:text-amber-700 cursor-pointer"
                      >
                        {lang === 'mr' ? product.title_mr : product.title}
                      </p>
                      <p className="text-[11px] font-bold text-amber-900">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition flex-shrink-0"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
