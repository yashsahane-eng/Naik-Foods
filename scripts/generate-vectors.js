/**
 * Offline vector generator script for Naik Foods product embeddings.
 * Generates 64-dimensional normalized feature vectors for each product.
 * Dimensions represent semantic culinary coordinates:
 * - D0-D7:   Spice & Heat (mild, medium, fiery, lavangi chili, black pepper, ginger, byadagi)
 * - D8-D15:  Sour & Acidic (roselle, kokum, lemon, tamarind, raw mango, natural fermentation)
 * - D16-D23: Rich & Savory (roasted garlic, caramelized onion, mustard oil, cold-pressed groundnut oil, hing)
 * - D24-D31: Nutty & Crunchy (peanuts, sesame, roasted flax, copra/coconut, chana dal crumbs)
 * - D32-D39: Heritage Spices (dagad phool, tirphal, star anise, cumin, carom/ajwain, cinnamon, clove)
 * - D40-D47: Texture & Format (stone pounded, dry coarse powder, sun-matured chunk, liquid extract, crispy mix)
 * - D48-D55: Pairing Affinity (bhakri, amti/dal-bhaat, solkadhi, vada pav, tea-time snack, fasting)
 * - D56-D63: Dietary & Preservation (jain-friendly, upvas, vegan, zero-oil, high-shelf-life, high-iron)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.resolve(__dirname, '../src/data/products.json');
const outputPath = path.resolve(__dirname, '../src/data/vectors.json');

const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Deterministic pseudo-random seed generator for reproducing dense embeddings
function seededRandom(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const vectors = {};

products.forEach(p => {
  const rand = seededRandom(p.id);
  const vec = new Array(64).fill(0);

  // Apply base semantic signatures
  // Spice
  if (p.spice_level === 'kolhapuri_fiery') { vec[0] = 0.9; vec[1] = 0.8; vec[3] = 0.9; }
  else if (p.spice_level === 'spicy') { vec[0] = 0.7; vec[1] = 0.8; vec[6] = 0.8; }
  else if (p.spice_level === 'medium') { vec[0] = 0.4; vec[1] = 0.5; }
  else { vec[0] = 0.1; }

  // Sour
  if (p.id.includes('ambadi')) { vec[8] = 0.95; vec[13] = 0.4; vec[61] = 0.9; }
  if (p.id.includes('kokum')) { vec[9] = 0.98; vec[49] = 0.9; vec[59] = 0.9; }
  if (p.id.includes('limbu')) { vec[10] = 0.9; vec[36] = 0.7; vec[59] = 0.95; }
  if (p.id.includes('kairi') || p.id.includes('methamba')) { vec[12] = 0.9; vec[28] = 0.4; }

  // Garlic / Onion
  const ingredientsStr = p.ingredients.join(' ').toLowerCase();
  if (ingredientsStr.includes('garlic')) { vec[16] = 0.9; }
  if (ingredientsStr.includes('onion')) { vec[17] = 0.9; }
  if (ingredientsStr.includes('mustard oil')) { vec[18] = 0.85; }
  if (ingredientsStr.includes('groundnut oil')) { vec[19] = 0.8; }

  // Peanuts / Coconut
  if (ingredientsStr.includes('peanut')) { vec[24] = 0.9; }
  if (ingredientsStr.includes('coconut') || ingredientsStr.includes('kopra')) { vec[27] = 0.85; }
  if (ingredientsStr.includes('flaxseed')) { vec[26] = 0.9; }

  // Spices
  if (ingredientsStr.includes('dagad phool')) { vec[32] = 0.95; }
  if (ingredientsStr.includes('tirphal')) { vec[33] = 0.95; }

  // Dietary
  if (p.dietary.includes('jain_friendly')) { vec[56] = 0.85; }
  if (p.dietary.includes('upvas')) { vec[57] = 0.95; vec[51] = 0.9; }
  if (p.dietary.includes('vegan')) { vec[58] = 0.7; }

  // Add subtle dense variance to ensure smooth cosine distribution
  for (let i = 0; i < 64; i++) {
    vec[i] += (rand() - 0.5) * 0.15;
  }

  // Normalize vector to unit length (L2 norm = 1.0)
  let sumSq = 0;
  for (let i = 0; i < 64; i++) sumSq += vec[i] * vec[i];
  const magnitude = Math.sqrt(sumSq) || 1;
  const normalizedVec = vec.map(val => Number((val / magnitude).toFixed(5)));

  vectors[p.id] = normalizedVec;
});

fs.writeFileSync(outputPath, JSON.stringify(vectors, null, 2), 'utf-8');
console.log(`Generated 64-d normalized vectors for ${products.length} products -> ${outputPath}`);
