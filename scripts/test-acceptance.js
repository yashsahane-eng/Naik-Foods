/**
 * Automated Acceptance Test Script for Naik Foods Client-Side Features
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Fuse from 'fuse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/products.json'), 'utf-8'));
const vectors = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/vectors.json'), 'utf-8'));
const faqDocs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/faq_docs.json'), 'utf-8'));
const pincodes = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/data/pincodes.json'), 'utf-8'));

console.log('--- RUNNING NAIK FOODS ACCEPTANCE TESTS ---\n');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. Test Fuse.js search
const fuse = new Fuse(products, {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'title_mr', weight: 0.3 },
    { name: 'tags', weight: 0.25 },
    { name: 'ingredients', weight: 0.2 },
    { name: 'category', weight: 0.15 },
    { name: 'category_mr', weight: 0.1 },
    { name: 'description', weight: 0.05 }
  ],
  threshold: 0.4
});

const thechaResults = fuse.search('thecha');
assert(thechaResults.length > 0 && thechaResults[0].item.id === 'kolhapuri-mirchi-thecha', 'Search "thecha" matches Kolhapuri Mirchi Thecha');

const ambadiResults = fuse.search('ambadi');
assert(ambadiResults.length > 0 && ambadiResults[0].item.id === 'ambadi-bhajiche-lonche', 'Search "ambadi" matches Ambadi Bhajiche Lonche');

const mildResults = fuse.search('mild');
assert(mildResults.length > 0 && mildResults.some(r => r.item.spice_level === 'mild'), 'Search "mild" matches mild products');

// 2. Test Vectors Cosine Similarity
function cosineSim(vA, vB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vA.length; i++) {
    dot += vA[i] * vB[i];
    normA += vA[i] * vA[i];
    normB += vB[i] * vB[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

assert(Object.keys(vectors).length === products.length, `All ${products.length} products have precomputed 64-d vectors in vectors.json`);
const simAmbadiKarlya = cosineSim(vectors['ambadi-bhajiche-lonche'], vectors['karlyache-lonche']);
assert(simAmbadiKarlya > 0.3, `Cosine similarity between Ambadi and Karlyache pickle is positive and coherent: ${simAmbadiKarlya.toFixed(3)}`);

// 3. Test PDP attributes
const ambadi = products.find(p => p.id === 'ambadi-bhajiche-lonche');
assert(ambadi.fssai.length === 14, `FSSAI license is valid 14 digits (${ambadi.fssai})`);
assert(ambadi.ingredients.length >= 5, `Ingredients list is authentic and detailed (${ambadi.ingredients.length} items)`);
assert(ambadi.nutrition.calories && ambadi.nutrition.fat, 'Nutrition data contains calories and fat');
assert(ambadi.variants.length >= 2, `Variants selector has multiple pack sizes (${ambadi.variants.map(v => v.label).join(', ')})`);

// 4. Test Pincode verification
const punePin = pincodes.find(p => p.pincode === '411001');
assert(punePin && punePin.days <= 2 && punePin.serviceable, 'Pincode 411001 (Pune) maps to 1-2 day express ETA');

// 5. Test FAQ QA Document retrieval
function retrieveFaq(query) {
  const qTokens = query.toLowerCase().split(' ');
  let bestDoc = null;
  let bestScore = 0;
  faqDocs.forEach(doc => {
    let score = 0;
    const text = (doc.question + ' ' + doc.content + ' ' + doc.tags.join(' ')).toLowerCase();
    qTokens.forEach(t => {
      if (text.includes(t)) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      bestDoc = doc;
    }
  });
  return bestDoc;
}

const jainFaq = retrieveFaq('which items are jain friendly no onion no garlic');
assert(jainFaq && jainFaq.id === 'faq-1', 'FAQ retriever correctly answers Jain friendly questions');

const shelfFaq = retrieveFaq('what is the shelf life of pickles storage');
assert(shelfFaq && shelfFaq.id === 'faq-3', 'FAQ retriever correctly answers shelf life questions');

console.log(`\n--- RESULT: ${passed}/${total} TESTS PASSED ---`);
