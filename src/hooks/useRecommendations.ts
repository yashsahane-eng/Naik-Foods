import { useMemo } from 'react';
import { Product } from '../types';
import productsData from '../data/products.json';
import vectorsData from '../data/vectors.json';
import { computeHybridRecommendationScore } from '../utils/cosineSimilarity';

export function useRecommendations() {
  const products = productsData as Product[];
  const vectorsMap = vectorsData as Record<string, number[]>;

  /**
   * Returns top N recommendations for a given target product
   */
  const getRecommendationsForProduct = (targetProduct: Product, limit: number = 4): Product[] => {
    const scored = products
      .filter(p => p.id !== targetProduct.id)
      .map(candidate => ({
        product: candidate,
        score: computeHybridRecommendationScore(targetProduct, candidate, vectorsMap)
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map(s => s.product);
  };

  /**
   * Generates a "Frequently Bought Together" trio bundle for a product:
   * e.g., Pickle + Accompaniment Chutney / Thecha + Masala
   */
  const getBundleForProduct = (targetProduct: Product): { items: Product[]; discountPercent: number; totalPrice: number; bundlePrice: number } => {
    let complementaryChutney: Product | undefined;
    let complementaryMasala: Product | undefined;

    if (targetProduct.category === 'Pickles') {
      complementaryChutney = products.find(p => p.id === 'kolhapuri-mirchi-thecha') || products.find(p => p.category === 'Thecha & Chutneys');
      complementaryMasala = products.find(p => p.id === 'goda-masala-authentic') || products.find(p => p.category === 'Authentic Masalas');
    } else if (targetProduct.category === 'Thecha & Chutneys') {
      complementaryChutney = products.find(p => p.id === 'ambadi-bhajiche-lonche') || products.find(p => p.category === 'Pickles');
      complementaryMasala = products.find(p => p.id === 'kanda-lasun-masala') || products.find(p => p.category === 'Authentic Masalas');
    } else {
      complementaryChutney = products.find(p => p.id === 'shengdana-chutney');
      complementaryMasala = products.find(p => p.id === 'ambadi-bhajiche-lonche');
    }

    const bundleItems = [targetProduct];
    if (complementaryChutney && complementaryChutney.id !== targetProduct.id) {
      bundleItems.push(complementaryChutney);
    }
    if (complementaryMasala && complementaryMasala.id !== targetProduct.id && !bundleItems.some(i => i.id === complementaryMasala?.id)) {
      bundleItems.push(complementaryMasala);
    }

    const totalPrice = bundleItems.reduce((sum, item) => sum + item.price, 0);
    const bundlePrice = Math.round(totalPrice * 0.90); // 10% bundle discount

    return {
      items: bundleItems,
      discountPercent: 10,
      totalPrice,
      bundlePrice
    };
  };

  /**
   * Returns bundle suggestions for items currently in cart
   */
  const getCartCrossSells = (cartProductIds: string[], limit: number = 3): Product[] => {
    const unselected = products.filter(p => !cartProductIds.includes(p.id));
    return unselected
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, limit);
  };

  return {
    getRecommendationsForProduct,
    getBundleForProduct,
    getCartCrossSells,
    allProducts: products
  };
}
