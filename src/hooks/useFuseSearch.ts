import { useMemo } from 'react';
import Fuse, { type FuseResultMatch } from 'fuse.js';
import { Product } from '../types';
import productsData from '../data/products.json';

export interface SearchResultItem {
  item: Product;
  score?: number;
  matches?: readonly FuseResultMatch[];
}

export interface SearchAnalysis {
  results: Product[];
  categoryMatches: string[];
  didYouMean: string | null;
  rawResults: SearchResultItem[];
}

export function useFuseSearch() {
  const products = productsData as Product[];

  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'title_mr', weight: 0.3 },
        { name: 'tags', weight: 0.25 },
        { name: 'ingredients', weight: 0.2 },
        { name: 'category', weight: 0.15 },
        { name: 'category_mr', weight: 0.1 },
        { name: 'description', weight: 0.05 }
      ],
      threshold: 0.38,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [products]);

  // Dictionary of common terms for "Did You Mean" spell-checking
  const vocabulary = useMemo(() => {
    const words = new Set<string>();
    products.forEach(p => {
      p.title.toLowerCase().split(/\s+/).forEach(w => words.add(w.replace(/[^a-z]/g, '')));
      p.category.toLowerCase().split(/\s+/).forEach(w => words.add(w.replace(/[^a-z]/g, '')));
      p.tags.forEach(t => words.add(t.toLowerCase()));
      p.ingredients.forEach(i => i.toLowerCase().split(/\s+/).forEach(w => words.add(w.replace(/[^a-z]/g, ''))));
    });
    return Array.from(words).filter(w => w.length > 2);
  }, [products]);

  const search = (query: string): SearchAnalysis => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return {
        results: products.slice(0, 6),
        categoryMatches: [],
        didYouMean: null,
        rawResults: []
      };
    }

    const fuseResults = fuse.search(trimmed);
    const results = fuseResults.map(r => r.item);

    // Identify matched categories
    const matchedCategories = Array.from(
      new Set(results.map(p => p.category))
    ).slice(0, 3);

    // Compute "Did you mean?" if results are low or match score is mediocre
    let didYouMean: string | null = null;
    if (results.length <= 1 && trimmed.length >= 3) {
      // Find closest word in vocabulary using Levenshtein distance
      let bestDist = Infinity;
      let candidateWord = '';
      for (const vocab of vocabulary) {
        const dist = levenshteinDistance(trimmed, vocab);
        if (dist > 0 && dist <= 2 && dist < bestDist) {
          bestDist = dist;
          candidateWord = vocab;
        }
      }
      if (candidateWord && candidateWord !== trimmed) {
        didYouMean = candidateWord;
      }
    }

    return {
      results,
      categoryMatches: matchedCategories,
      didYouMean,
      rawResults: fuseResults
    };
  };

  return { search, products };
}

// Levenshtein distance for fuzzy spell suggestion
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}
