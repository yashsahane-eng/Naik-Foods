import React, { useState } from 'react';
import { MapPin, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const PincodeChecker: React.FC = () => {
  const { pincode, pincodeInfo, checkPincode } = useCart();
  const { lang, t } = useLanguage();

  const [inputVal, setInputVal] = useState(pincode);
  const [feedback, setFeedback] = useState<{ status: 'success' | 'error'; message: string } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(inputVal)) {
      setFeedback({ status: 'error', message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }

    const res = checkPincode(inputVal);
    setFeedback({
      status: 'success',
      message: res.message
    });
  };

  return (
    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs">
      <div className="flex items-center gap-2 mb-2 font-bold text-stone-900">
        <MapPin className="w-4 h-4 text-amber-700" />
        <span>{t('check_delivery')}</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={inputVal}
          onChange={e => setInputVal(e.target.value.replace(/\D/g, ''))}
          placeholder={t('enter_pincode')}
          className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-xs"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold transition"
        >
          {t('check_btn')}
        </button>
      </form>

      {feedback && (
        <div
          className={`mt-2.5 p-2.5 rounded-xl flex items-start gap-2 ${
            feedback.status === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {feedback.status === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="leading-tight">{feedback.message}</span>
        </div>
      )}

      {pincodeInfo && !feedback && (
        <div className="mt-2.5 flex items-center gap-3 text-stone-600">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>ETA: <strong>{pincodeInfo.days} business days</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{pincodeInfo.city}, {pincodeInfo.state}</span>
          </div>
        </div>
      )}
    </div>
  );
};
