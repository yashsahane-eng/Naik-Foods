# Naik Foods — Frontend Prototype (Improved UX + Client-Side AI)

A modern, high-fidelity, frontend-only shopping prototype recreating and enhancing key customer journeys from [naikfoods.co.in](https://naikfoods.co.in). The prototype demonstrates product discovery, interactive PDP, simulated guest checkout, and functional client-side "AI" features (smart fuzzy search, vector-based recommendations, taste profile quiz, QA document assistant, and visual texture matcher) with **zero backend dependency** and **no exposed API keys**.

---

## 🌟 Key Highlights & UX Enhancements

1. **Persistent Smart Search (Fuse.js AI)**:
   - Instant search triggered anywhere via `⌘K` or `/`.
   - Weighted field search: `title (0.4) > tags (0.25) > ingredients (0.2) > category (0.15) > description (0.05)`.
   - Typo-tolerance (e.g. `"techa"` matches `"Kolhapuri Mirchi Thecha"`).
   - "Did you mean?" suggestions and keyword highlighting in results.
   - Arrow-key navigation (`↑`, `↓`, `Enter`, `Esc`).

2. **Semantic Similarity Recommendations (Cosine Similarity + Vectors)**:
   - Precomputed 64-dimensional feature embeddings in `/src/data/vectors.json`.
   - Pure client-side cosine similarity dot product in TypeScript: `0.6 * cosine_sim + 0.3 * tag_overlap + 0.1 * popularity`.
   - Displays "People Also Bought" recommendations on PDP and Cart drawer.

3. **Interactive "Taste Profile" Recommender**:
   - 3-step wizard evaluating spice tolerance, dietary restrictions (Jain / Upvas / Vegan), and favorite meal accompaniments (Bhakri, Dal-Rice, Snacks, Curries).
   - Rule-based weighting engine computes top 5 matches with match % score and 1-click "Add Curated Taste Box to Cart".

4. **In-Browser FAQ & Pantry QA Assistant (Document Retriever)**:
   - Local document search indexing product descriptions, FSSAI info, shelf life, and heritage FAQs from `faq_docs.json`.
   - Direct answers with linked product cards.
   - Developer-only cloud LLM configuration modal (keeps private keys strictly opt-in in development).

5. **Visual Flavor / Texture Recommender**:
   - Canvas-based RGB / hue heuristic analyzer.
   - Allows users to upload a food photo or pick authentic Maharashtrian color tones (Kolhapuri Crimson, Emerald Green Chili, Golden Mustard Amber, Dark Shahi Masala) to recommend matching products.

6. **Comprehensive PDP Experience**:
   - Dynamic variant selector (280g / 500g / 1kg) updating prices and price-per-100g automatically.
   - Image gallery with interactive hover zoom and full-screen preview.
   - FSSAI Central License number, 100% vegetarian mark, Best-Before badge.
   - Tabbed deep info: Ingredients, Nutritional facts per 100g, Aaji's heritage recipe, and Storage tips.
   - Frequently Bought Together bundle builder (with 10% combo discount).
   - Sticky mobile/desktop Add-to-Cart bar.
   - Reviews section with star breakdown and photo review submission (base64 stored in `nf_reviews`).

7. **Cart & Simulated Checkout**:
   - Free delivery progress meter (Goal: ₹599) with celebratory confetti animation.
   - Pincode serviceability checker with delivery ETA simulation (1-4 days) from `pincodes.json`.
   - Shareable cart URL encoder/decoder (`?cart=...` or `?share_cart=...`).
   - Guest checkout simulation with address validation, mock UPI QR code, and order tracking timeline.

8. **Bilingual Support (मराठी / English)**:
   - Full toggle between English and मराठी across headers, categories, badges, and CTAs.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 (with custom amber/saffron/chili palette & serif typography)
- **Icons**: Lucide React
- **Fuzzy Search**: `fuse.js`
- **Celebratory Effects**: `canvas-confetti`
- **Persistence**: `localStorage` (Keys: `nf_cart`, `nf_wishlist`, `nf_reviews`, `nf_orders`, `nf_lang`)

---

## 📁 Directory Structure

```
naik-foods-prototype/
├── public/
│   └── favicon.svg                # Authentic pickle jar motif
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   ├── SmartSearchModal.tsx       # Fuse.js instant search & Did-You-Mean
│   │   │   ├── TasteProfileModal.tsx      # 3-question rule-based flavor matcher
│   │   │   ├── AiAssistantModal.tsx       # Local document retriever QA
│   │   │   ├── VisualRecommenderModal.tsx # Canvas color/texture matcher
│   │   │   └── RecommendationRail.tsx     # Cosine similarity recommendation carousel
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx             # Slide-over cart with coupon & share link
│   │   │   └── FreeDeliveryMeter.tsx      # Progress meter (Free delivery @ ₹599)
│   │   ├── common/
│   │   │   ├── Header.tsx                 # Search trigger, language toggle, pincode selector
│   │   │   ├── Footer.tsx                 # Brand heritage story, FSSAI notice
│   │   │   └── Breadcrumbs.tsx            # Home / Store / Category / Product trail
│   │   └── product/
│   │       ├── ProductCard.tsx            # Variant toggle, ₹/100g, quick-add
│   │       ├── ProductGallery.tsx         # Multi-image hover zoom loupe
│   │       ├── VariantSelector.tsx        # Dynamic pack size selector
│   │       ├── NutritionTable.tsx         # FSSAI, nutrition, ingredients & story
│   │       ├── FrequentlyBoughtTogether.tsx # 3-item combo with 10% discount
│   │       ├── ReviewsSection.tsx         # Star breakdown & photo review uploader
│   │       └── StickyCtaBar.tsx           # Floating add-to-cart bar
│   ├── context/
│   │   ├── CartContext.tsx                # Cart state, pincode ETA & shareable URL
│   │   ├── WishlistContext.tsx            # Wishlist state in localStorage
│   │   └── LanguageContext.tsx            # English / मराठी toggle
│   ├── data/
│   │   ├── products.json                  # 14 authentic Maharashtrian products
│   │   ├── categories.json                # Categories with banner imagery & Marathi titles
│   │   ├── reviews.json                   # Initial customer reviews with photos
│   │   ├── reels.json                     # Kitchen video recipes & reels
│   │   ├── pincodes.json                  # Delivery ETA mapping (1-4 business days)
│   │   ├── faq_docs.json                  # Indexed heritage, FSSAI & storage knowledge base
│   │   └── vectors.json                   # 64-dimensional normalized feature embeddings
│   ├── hooks/
│   │   ├── useFuseSearch.ts               # Fuse.js search hook
│   │   └── useRecommendations.ts          # Cosine similarity recommendation engine
│   ├── pages/
│   │   ├── HomePage.tsx                   # Hero, categories, bestsellers, reels
│   │   ├── StorePage.tsx                  # Faceted filter panel, sorting & URL sync
│   │   ├── ProductDetailPage.tsx          # PDP with zoom, bundle, reviews, nutrition
│   │   ├── CartPage.tsx                   # Dedicated cart view
│   │   ├── CheckoutPage.tsx               # Guest checkout simulation & mock UPI
│   │   ├── OrderConfirmationPage.tsx      # Confetti, order details & tracking timeline
│   │   ├── WishlistPage.tsx               # Saved items
│   │   └── OrdersPage.tsx                 # Past orders from nf_orders
│   ├── utils/
│   │   ├── cosineSimilarity.ts            # Mathematical vector dot-product & hybrid scoring
│   │   ├── formatCurrency.ts              # ₹ formatter & weight display
│   │   ├── storage.ts                     # Safe localStorage helper
│   │   └── translations.ts                # English & Marathi dictionary
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── scripts/
│   ├── generate-vectors.js                # Offline generator for 64-d embeddings
│   └── test-acceptance.js                 # Automated acceptance criteria test suite
├── package.json
└── README.md
```

---

## 🧠 How the Client-Side AI Features Work

### 1. Smart Search & Autosuggest (`useFuseSearch.ts`)
Uses `Fuse.js` with weighted multi-field search. It indexes:
- `title` (weight 0.4)
- `title_mr` (weight 0.3)
- `tags` (weight 0.25)
- `ingredients` (weight 0.2)
- `category` (weight 0.15)
- `description` (weight 0.05)

When typing queries with typos (e.g., `"techa"`), the threshold allows fuzzy matching to `"Kolhapuri Mirchi Thecha"`. If the match score is low or results are sparse, Levenshtein distance against the product vocabulary calculates a `"Did you mean: {word}?"` prompt.

### 2. Precomputed Vectors & Cosine Similarity (`cosineSimilarity.ts`)
Each product is associated with a normalized 64-dimensional feature vector in `vectors.json`. Dimensions map to culinary coordinates:
- D0–D7: Spice & Heat
- D8–D15: Sour & Acidic notes (Roselle, Kokum, Lemon)
- D16–D23: Roasted garlic, caramelized onion, mustard oil
- D24–D31: Roasted peanuts, copra, flaxseed
- D32–D39: Heritage spices (Dagad phool, Tirphal)
- D48–D55: Pairing affinity (Bhakri, Dal-Rice, Usal)
- D56–D63: Dietary certifications (Jain, Upvas, Vegan)

At runtime, JavaScript computes the dot product:
$$\text{Cosine Similarity} = \sum_{i=0}^{63} A_i \cdot B_i$$

The hybrid recommendation score is:
$$\text{Score} = 0.6 \times \text{VectorSim} + 0.3 \times \text{TagOverlap} + 0.1 \times \left(\frac{\text{Popularity}}{100}\right)$$

### 3. Taste Profile Recommender (`TasteProfileModal.tsx`)
A 3-step interactive questionnaire asking:
1. Spice comfort (Mild, Medium, Spicy, Fiery Kolhapuri)
2. Dietary rules (All, Jain-Friendly, Upvas Fasting, Vegan)
3. Meal companion (Bhakri, Dal-Rice, Evening Snacks, Cooking Curries)

The client rule engine computes a customized palate match score (%) and returns the top 5 matches with explanations of why they fit.

### 4. In-Browser Document QA Retriever (`AiAssistantModal.tsx`)
Indexes `faq_docs.json` covering FSSAI certification, shelf life, oil quality, shipping policies, and product details. User queries are tokenized client-side and matched against document chunks. The best matching section is retrieved with verified badges and links to relevant product cards.

**Developer Cloud LLM Mode (Optional)**:
A developer modal allows entering a temporary session API key to test external LLM naturalization. No keys are ever bundled or committed.

### 5. Visual Color/Texture Matcher (`VisualRecommenderModal.tsx`)
Allows users to drag/drop any food image. An HTML5 canvas reads the average RGB/hue values and classifies the flavor profile (Crimson -> Spicy Thecha; Emerald -> Green chili; Amber -> Cold-pressed mustard pickles; Dark Brown -> Slow-roasted Goda Masala).

---

## 🚀 Running the Project Locally

```bash
# 1. Clone repository or navigate to scratch directory
cd C:\Users\sahan\.gemini\antigravity\scratch\naik-foods-prototype

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production (static output in /dist)
npm run build

# 5. Preview production build
npm run preview
```

---

## 🧪 Acceptance Test Suite

Run the automated acceptance suite verifying search, vectors, FSSAI, nutrition, pincodes, and FAQ retrieval:

```bash
node scripts/test-acceptance.js
```

### Verified Test Output:
- ✅ PASS: Search "thecha" matches Kolhapuri Mirchi Thecha
- ✅ PASS: Search "ambadi" matches Ambadi Bhajiche Lonche
- ✅ PASS: Search "mild" matches mild products
- ✅ PASS: All 14 products have precomputed 64-d vectors in `vectors.json`
- ✅ PASS: Cosine similarity between Ambadi and Karlyache pickle is coherent (0.662)
- ✅ PASS: FSSAI license is valid 14 digits (11522055000389)
- ✅ PASS: Ingredients list is authentic and detailed (7 items)
- ✅ PASS: Nutrition data contains calories and fat
- ✅ PASS: Variants selector has multiple pack sizes (280g Jar, 500g Jar, 1kg Bulk Pack)
- ✅ PASS: Pincode 411001 (Pune) maps to 1-2 day express ETA
- ✅ PASS: FAQ retriever correctly answers Jain friendly questions
- ✅ PASS: FAQ retriever correctly answers shelf life questions
- **RESULT: 12/12 TESTS PASSED**

---

## 🌐 Deploying as Static Site (Netlify / Vercel / Cloudflare Pages)

Because this application is 100% frontend-only:
1. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `dist`
2. **Vercel**:
   - Framework preset: `Vite`
   - Output directory: `dist`
3. **Cloudflare Pages**:
   - Build command: `npm run build`
   - Output directory: `dist`
