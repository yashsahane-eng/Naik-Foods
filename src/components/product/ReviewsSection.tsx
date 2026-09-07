import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp, Upload, X, Camera, Sparkles } from 'lucide-react';
import { Review } from '../../types';
import reviewsData from '../../data/reviews.json';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../../utils/storage';
import { useLanguage } from '../../context/LanguageContext';

interface ReviewsSectionProps {
  productId: string;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId }) => {
  const { lang, t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = loadFromStorage<Review[]>(STORAGE_KEYS.REVIEWS, reviewsData as Review[]);
    return saved;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === productId);

  // Calculate star distribution
  const totalReviews = productReviews.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRatings = 0;

  productReviews.forEach(r => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
    sumRatings += r.rating;
  });

  const avgRating = totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : '5.0';

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoBase64(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName: userName.trim(),
      location: userLocation.trim() || 'Maharashtra',
      rating: newRating,
      title: reviewTitle.trim() || 'Delicious authentic taste!',
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true,
      photos: photoBase64 ? [photoBase64] : [],
      helpful: 1
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveToStorage(STORAGE_KEYS.REVIEWS, updated);

    // Reset
    setIsModalOpen(false);
    setUserName('');
    setUserLocation('');
    setReviewTitle('');
    setReviewComment('');
    setPhotoBase64(null);
  };

  const handleHelpful = (reviewId: string) => {
    const updated = reviews.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r);
    setReviews(updated);
    saveToStorage(STORAGE_KEYS.REVIEWS, updated);
  };

  return (
    <div className="py-8 border-t border-stone-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heritage text-xl font-bold text-stone-900">
            {t('customer_reviews')}
          </h3>
          <p className="text-xs text-stone-500">
            Verified ratings and customer photos from Maharashtra and beyond
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition shadow-xs"
        >
          {t('write_review')}
        </button>
      </div>

      {/* Ratings Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-white border border-amber-200 mb-8">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-stone-200">
          <span className="font-heritage text-5xl font-black text-amber-950">{avgRating}</span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(Number(avgRating))
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-stone-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-stone-500">
            Based on {totalReviews} verified reviews
          </p>
        </div>

        {/* Star Breakdown Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-10 font-bold text-stone-700 flex items-center gap-1">
                  {star} <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                </span>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-600 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-stone-500 font-mono text-[11px]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {productReviews.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-xs">
            No reviews yet for this product. Be the first to share your experience!
          </div>
        ) : (
          productReviews.map(rev => (
            <div key={rev.id} className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-sm text-stone-900">{rev.title}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                    <span className="font-semibold text-stone-800">{rev.userName}</span>
                    <span>•</span>
                    <span>{rev.location}</span>
                    <span>•</span>
                    <span>{rev.date}</span>
                    {rev.verified && (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold ml-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {t('verified_buyer')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 text-xs transition"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{rev.helpful}</span>
                </button>
              </div>

              <p className="text-xs text-stone-700 mt-3 leading-relaxed">
                {rev.comment}
              </p>

              {/* Photo attachments */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {rev.photos.map((photo, pIdx) => (
                    <img
                      key={pIdx}
                      src={photo}
                      alt="Customer review photo"
                      className="w-16 h-16 object-cover rounded-xl border border-amber-200 shadow-xs cursor-pointer hover:scale-105 transition"
                    />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100 bg-amber-50/50">
              <h4 className="font-heritage text-base font-bold text-stone-900">
                {t('write_review')}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-4 text-xs">
              {/* Star Selector */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Rating:</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= newRating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="e.g. Radhika Kulkarni"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={userLocation}
                    onChange={e => setUserLocation(e.target.value)}
                    placeholder="e.g. Pune, MH"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={e => setReviewTitle(e.target.value)}
                  placeholder="e.g. Authentic Kolhapuri taste!"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Detailed Review *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Tell us about the flavor, freshness, texture and packaging..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Photo Upload via FileReader base64 */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Upload Photo (Optional - stored in localStorage)
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer flex items-center gap-2 text-stone-700 font-semibold transition">
                    <Camera className="w-4 h-4 text-amber-700" />
                    <span>Choose Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoBase64 && (
                    <div className="relative">
                      <img
                        src={photoBase64}
                        alt="Upload preview"
                        className="w-12 h-12 object-cover rounded-xl border border-amber-300"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotoBase64(null)}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold shadow-md transition"
                >
                  {t('submit_review')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
