import React, { useState } from 'react';
import { X, Sparkles, Flame, CheckCircle, ArrowRight, RefreshCw, ShoppingBag, Award } from 'lucide-react';
import { Product, TasteProfileAnswers } from '../../types';
import productsData from '../../data/products.json';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

interface TasteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
}

export const TasteProfileModal: React.FC<TasteProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<TasteProfileAnswers>({
    spiceComfort: 'medium',
    dietary: 'all',
    mealCompanion: 'bhakri',
    packSize: 'family'
  });
  const [results, setResults] = useState<{ product: Product; matchScore: number; matchReasons: string[] }[] | null>(null);

  if (!isOpen) return null;

  const handleComputeMatches = (finalAnswers: TasteProfileAnswers) => {
    const products = productsData as Product[];

    const scored = products.map(p => {
      let score = 50; // base score
      const reasons: string[] = [];

      // 1. Spice rule
      if (finalAnswers.spiceComfort === 'kolhapuri' && p.spice_level === 'kolhapuri_fiery') {
        score += 35;
        reasons.push('Matches fiery Kolhapuri preference');
      } else if (finalAnswers.spiceComfort === 'spicy' && (p.spice_level === 'spicy' || p.spice_level === 'kolhapuri_fiery')) {
        score += 30;
        reasons.push('Satisfies high spice appetite');
      } else if (finalAnswers.spiceComfort === 'medium' && p.spice_level === 'medium') {
        score += 30;
        reasons.push('Perfect balanced zing');
      } else if (finalAnswers.spiceComfort === 'mild' && p.spice_level === 'mild') {
        score += 35;
        reasons.push('Gentle & stomach-friendly');
      }

      // 2. Dietary rule
      if (finalAnswers.dietary === 'jain') {
        if (p.dietary.includes('jain_friendly')) {
          score += 25;
          reasons.push('Strictly Jain friendly (No onion/garlic)');
        } else {
          score -= 60; // disqualify onion/garlic
        }
      } else if (finalAnswers.dietary === 'upvas') {
        if (p.dietary.includes('upvas')) {
          score += 40;
          reasons.push('100% Upvas/Fasting compliant');
        } else {
          score -= 40;
        }
      } else if (finalAnswers.dietary === 'vegan') {
        if (p.dietary.includes('vegan')) {
          score += 15;
          reasons.push('Plant-based vegan recipe');
        }
      }

      // 3. Meal Companion rule
      if (finalAnswers.mealCompanion === 'bhakri') {
        if (p.category === 'Thecha & Chutneys' || p.category === 'Pickles') {
          score += 20;
          reasons.push('Classic accompaniment for hot Bhakri');
        }
      } else if (finalAnswers.mealCompanion === 'dal_rice') {
        if (p.id.includes('goda') || p.id.includes('ambadi') || p.id.includes('shengdana')) {
          score += 20;
          reasons.push('Traditional companion for Dal & Steamed Bhaat');
        }
      } else if (finalAnswers.mealCompanion === 'cooking') {
        if (p.category === 'Authentic Masalas' || p.id.includes('kokum')) {
          score += 25;
          reasons.push('Ideal foundation for authentic curries & rassa');
        }
      } else if (finalAnswers.mealCompanion === 'snacks') {
        if (p.category === 'Snacks & Faral' || p.category === 'Upvas & Fasting' || p.id.includes('khobra')) {
          score += 25;
          reasons.push('Crispy companion for evening tea & snacks');
        }
      }

      // 4. Popularity weight
      score += (p.popularity_score || 85) * 0.1;

      // Bound between 60% and 99% for presentation
      const matchScore = Math.min(99, Math.max(62, Math.round(score)));

      return {
        product: p,
        matchScore,
        matchReasons: reasons.slice(0, 2)
      };
    });

    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
    setResults(sorted);
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
  };

  const handleAddAllToCart = () => {
    if (!results) return;
    results.forEach(({ product }) => {
      addToCart(product);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 bg-amber-500/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heritage text-lg font-bold text-amber-950">
                {t('taste_profile_title')}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'mr' ? '३ प्रश्नांची उत्तरे द्या आणि तुमची चव ओळखा' : 'Answer 3 quick questions to discover your personalized pantry'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {!results ? (
            <div>
              {/* Progress dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map(s => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === step
                        ? 'w-8 bg-amber-600'
                        : s < step
                        ? 'w-4 bg-amber-300'
                        : 'w-2 bg-stone-200'
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Spice Comfort */}
              {step === 1 && (
                <div>
                  <h4 className="text-base font-bold text-stone-900 mb-1">
                    {lang === 'mr' ? '१. तुमचा तिखटपणाचा अंदाज काय आहे?' : '1. What is your comfort level with spice?'}
                  </h4>
                  <p className="text-xs text-stone-500 mb-4">
                    {lang === 'mr' ? 'आम्ही त्यानुसार योग्य लोणची व मसाले निवडू' : 'We calibrate the heat profile of your recommendations.'}
                  </p>

                  <div className="space-y-3">
                    {[
                      { id: 'mild', label: 'Mild & Fragrant', desc: 'Gentle on stomach, aromatic whole spices (Goda Masala, Methamba)', icon: '🌿' },
                      { id: 'medium', label: 'Medium Zing', desc: 'Pleasant traditional kick (Ambadi Lonche, Shengdana Chutney)', icon: '⚡' },
                      { id: 'spicy', label: 'Spicy & Rich', desc: 'Deep heat with garlic & dry red chilies (Kanda Lasun, Malvani)', icon: '🌶️' },
                      { id: 'kolhapuri', label: 'Fiery Kolhapuri 🔥', desc: 'Unapologetic hot Lavangi chili kick (Stone-crushed Thecha)', icon: '🔥' }
                    ].map(opt => (
                      <label
                        key={opt.id}
                        onClick={() => setAnswers(prev => ({ ...prev, spiceComfort: opt.id as any }))}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${
                          answers.spiceComfort === opt.id
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium'
                            : 'border-stone-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-xs text-stone-500">{opt.desc}</p>
                        </div>
                        {answers.spiceComfort === opt.id && (
                          <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 flex items-center gap-2 transition"
                    >
                      {lang === 'mr' ? 'पुढे जा' : 'Next Step'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Dietary Preferences */}
              {step === 2 && (
                <div>
                  <h4 className="text-base font-bold text-stone-900 mb-1">
                    {lang === 'mr' ? '२. काही विशिष्ट पथ्य किंवा धार्मिक नियम आहेत का?' : '2. Any dietary or lifestyle preferences?'}
                  </h4>
                  <p className="text-xs text-stone-500 mb-4">
                    {lang === 'mr' ? 'आम्ही घटक पूर्णपणे फिल्टर करू' : 'We filter ingredients to ensure total peace of mind.'}
                  </p>

                  <div className="space-y-3">
                    {[
                      { id: 'all', label: 'All Traditional Recipes', desc: 'No restrictions. Bring on all authentic Maharashtrian flavors.', badge: 'Popular' },
                      { id: 'jain', label: 'Jain Friendly (No Onion / No Garlic)', desc: 'Pure sattvic preparation without allium ingredients (Goda Masala, Limbu Lonche).', badge: 'Pure' },
                      { id: 'upvas', label: 'Upvas / Religious Fasting Eligible', desc: 'Strict fasting compliant items with pure rock salt (Sendha Namak) and Rajgira.', badge: 'Upvas' },
                      { id: 'vegan', label: '100% Plant-Based Vegan', desc: 'Pure cold-pressed vegetable oils without ghee or dairy derivatives.', badge: 'Vegan' }
                    ].map(opt => (
                      <label
                        key={opt.id}
                        onClick={() => setAnswers(prev => ({ ...prev, dietary: opt.id as any }))}
                        className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition ${
                          answers.dietary === opt.id
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium'
                            : 'border-stone-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">{opt.label}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-semibold">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">{opt.desc}</p>
                        </div>
                        {answers.dietary === opt.id && (
                          <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 ml-2" />
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
                    >
                      {lang === 'mr' ? 'मागे' : 'Back'}
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 flex items-center gap-2 transition"
                    >
                      {lang === 'mr' ? 'पुढे जा' : 'Next Step'} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Meal Companion */}
              {step === 3 && (
                <div>
                  <h4 className="text-base font-bold text-stone-900 mb-1">
                    {lang === 'mr' ? '३. तुम्ही हे पदार्थ मुख्यत्वे कशासोबत खाणार आहात?' : '3. What is your primary meal companion?'}
                  </h4>
                  <p className="text-xs text-stone-500 mb-4">
                    {lang === 'mr' ? 'आम्ही अचूक जोड्या सुचवू' : 'Find pairing affinities for your daily dining routine.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'bhakri', title: 'Hot Jowar Bhakri', sub: 'Thecha, Ambadi & dry peanut chutney', icon: '🫓' },
                      { id: 'dal_rice', title: 'Steaming Dal & Rice', sub: 'Goda masala amti & tangy pickles', icon: '🍚' },
                      { id: 'cooking', title: 'Cooking Curries & Usal', sub: 'Kolhapuri Kanda-lasun & Malvani spices', icon: '🥘' },
                      { id: 'snacks', title: 'Evening Chai Snacks', sub: 'Crunchy Chakli & Faral chivda', icon: '☕' }
                    ].map(opt => (
                      <div
                        key={opt.id}
                        onClick={() => setAnswers(prev => ({ ...prev, mealCompanion: opt.id as any }))}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition text-left ${
                          answers.mealCompanion === opt.id
                            ? 'border-amber-600 bg-amber-50 text-amber-950 font-medium'
                            : 'border-stone-200 hover:border-amber-300 bg-white'
                        }`}
                      >
                        <span className="text-2xl mb-1 block">{opt.icon}</span>
                        <p className="text-sm font-semibold text-stone-900">{opt.title}</p>
                        <p className="text-xs text-stone-500 mt-0.5">{opt.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
                    >
                      {lang === 'mr' ? 'मागे' : 'Back'}
                    </button>
                    <button
                      onClick={() => handleComputeMatches(answers)}
                      className="px-6 py-2.5 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 flex items-center gap-2 shadow-lg shadow-amber-700/20 transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      {lang === 'mr' ? 'माझा स्वाद शोधा' : 'Generate My Taste Box'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    {lang === 'mr' ? 'तुमची वैयक्तिक शिफारस' : 'Your Tailored Taste Profile'}
                  </span>
                  <h4 className="text-base font-bold text-stone-900">
                    {lang === 'mr' ? 'तुमच्या आवडीनुसार निवडलेली उत्पादने' : 'Top 5 Matches for Your Palate'}
                  </h4>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-800 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {lang === 'mr' ? 'पुन्हा सुरू करा' : 'Retake Quiz'}
                </button>
              </div>

              <div className="space-y-3">
                {results.map(({ product, matchScore, matchReasons }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-amber-200/80 bg-amber-50/30 hover:bg-amber-50/80 transition"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-lg border border-amber-200 flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        onSelectProduct(product.id);
                        onClose();
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5
                          onClick={() => {
                            onSelectProduct(product.id);
                            onClose();
                          }}
                          className="text-sm font-bold text-stone-900 truncate hover:text-amber-700 cursor-pointer"
                        >
                          {lang === 'mr' ? product.title_mr : product.title}
                        </h5>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white flex-shrink-0">
                          {matchScore}% Match
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mt-0.5">
                        {matchReasons.join(' • ')}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className="font-bold text-amber-950">{formatPrice(product.price)}</span>
                        <span className="text-stone-400 line-through text-[11px]">{formatPrice(product.mrp)}</span>
                        <span className="text-[11px] text-stone-500">{product.variants[0].label}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition flex-shrink-0"
                      title="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200">
                <button
                  onClick={handleAddAllToCart}
                  className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-800/20 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {lang === 'mr' ? 'हे सर्व पदार्थ पिशवीत टाका' : 'Add Curated Taste Box to Cart'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-2.5 bg-amber-50/50 border-t border-amber-100 text-stone-500 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            Client-Side Rule Matching Engine
          </span>
          <span className="text-stone-400">Zero backend needed</span>
        </div>
      </div>
    </div>
  );
};
