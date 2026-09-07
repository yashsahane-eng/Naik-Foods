import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Mail, Award, Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t-4 border-amber-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800 text-sm">
          {/* Brand & Heritage */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-heritage text-xl font-bold">
                ना
              </div>
              <span className="font-heritage text-2xl font-bold text-amber-100">
                Naik Foods
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {lang === 'mr'
                ? '१९५४ पासून कोल्हापूरच्या पारंपारिक पाककृती आणि शुद्ध घाणीच्या तेलात बनवलेली अस्सल चव तुमच्या घराघरात पोहोचवत आहोत.'
                : 'Pioneering traditional Maharashtrian homemade pickles, stone-pounded thechas, and wood-roasted spice blends since 1954.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FSSAI Central Lic: 11522055000389</span>
            </div>
          </div>

          {/* Traditional Specialties */}
          <div>
            <h4 className="font-heritage text-base font-bold text-amber-200 mb-3">
              {lang === 'mr' ? 'खास वैशिष्ट्ये' : 'Our Specialties'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="hover:text-amber-300 cursor-pointer">Ambadi Bhajiche Lonche</li>
              <li className="hover:text-amber-300 cursor-pointer">Kolhapuri Mirchi Thecha (Kharda)</li>
              <li className="hover:text-amber-300 cursor-pointer">Authentic Shahi Goda Masala</li>
              <li className="hover:text-amber-300 cursor-pointer">Solapuri Roasted Shengdana Chutney</li>
              <li className="hover:text-amber-300 cursor-pointer">Konkan Pure Kokum Agal</li>
            </ul>
          </div>

          {/* Purity Standards */}
          <div>
            <h4 className="font-heritage text-base font-bold text-amber-200 mb-3">
              {lang === 'mr' ? 'शुद्धतेची हमी' : 'Purity Standards'}
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Kachi Ghani Cold-Pressed Oils</span>
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Artificial Preservatives or Colors</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Individually Foil Vacuum Sealed Jars</span>
              </li>
            </ul>
          </div>

          {/* Dispatch & Heritage Kitchen */}
          <div>
            <h4 className="font-heritage text-base font-bold text-amber-200 mb-3">
              {lang === 'mr' ? 'संपर्क व पत्ता' : 'Heritage Kitchen & Dispatch'}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Naik Foods Kitchen, Shivaji Udyamnagar, Kolhapur, Maharashtra — 416008.
            </p>
            <div className="space-y-1 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                +91 98220 55000
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                support@naikfoods.co.in
              </p>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} Naik Foods Prototype. All recipes & imagery mocked for demonstration.</p>
          <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1 rounded-full text-[11px] text-amber-300">
            <span>Client-side AI Prototype • Zero Backend Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
