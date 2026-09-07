import { Product } from '../types';

/**
 * Computes standard Cosine Similarity between two numeric vectors.
 * If vectors are already L2-normalized, this is strictly the dot product.
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  const score = dotProduct / denominator;
  // Bound to [0, 1] range for feature vectors
  return Math.max(0, Math.min(1, score));
}

/**
 * Hybrid recommendation algorithm combining:
 * 1. 60% Cosine vector similarity (semantic & taste embedding)
 * 2. 30% Tag & ingredient overlap score
 * 3. 10% Popularity normalization
 * 
 * score = 0.6 * vector_sim + 0.3 * tag_overlap + 0.1 * (popularity / 100)
 */
export function computeHybridRecommendationScore(
  targetProduct: Product,
  candidateProduct: Product,
  vectorsMap: Record<string, number[]>
): number {
  if (targetProduct.id === candidateProduct.id) return -1;

  // 1. Vector similarity
  const vecA = vectorsMap[targetProduct.id];
  const vecB = vectorsMap[candidateProduct.id];
  const vectorSim = (vecA && vecB) ? calculateCosineSimilarity(vecA, vecB) : 0.5;

  // 2. Tag & ingredient overlap
  const targetTokens = new Set([
    ...targetProduct.tags.map(t => t.toLowerCase()),
    ...targetProduct.ingredients.map(i => i.toLowerCase().split(' ')).flat(),
    targetProduct.spice_level
  ]);

  let overlapCount = 0;
  candidateProduct.tags.forEach(t => {
    if (targetTokens.has(t.toLowerCase())) overlapCount++;
  });
  if (targetProduct.spice_level === candidateProduct.spice_level) overlapCount += 1.5;
  if (targetProduct.category === candidateProduct.category) overlapCount += 1.0;

  const tagOverlapNorm = Math.min(1, overlapCount / 6);

  // 3. Popularity score (0 - 1)
  const popularityNorm = (candidateProduct.popularity_score || 80) / 100;

  // Weighted composition
  const totalScore = (0.6 * vectorSim) + (0.3 * tagOverlapNorm) + (0.1 * popularityNorm);
  return Number(totalScore.toFixed(4));
}
