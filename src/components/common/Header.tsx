import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  Sparkles,
  MapPin,
  Menu,
  X,
  Bot,
  Palette,
  Check,
  Package,
  Globe
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/formatCurrency';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenTasteProfile: () => void;
  onOpenAssistant: () => void;
  onOpenVisualMatch: () => void;
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenTasteProfile,
  onOpenAssistant,
  onOpenVisualMatch,
  onNavigate,
  currentView
}) => {
  const { itemCount, subtotal, openCart, pincode, pincodeInfo, checkPincode } = useCart();
  const { wishlistCount } = useWishlist();
  const { lang, toggleLang, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pincodePopupOpen, setPincodePopupOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState(pincode);
  const [pincodeStatusMsg, setPincodeStatusMsg] = useState('');

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincodeInput.length === 6) {
      const res = checkPincode(pincodeInput);
      setPincodeStatusMsg(res.message);
      setTimeout(() => {
        setPincodePopupOpen(false);
        setPincodeStatusMsg('');
      }, 1500);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      {/* Top Heritage Announcement Ribbon */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-red-800 text-amber-100 text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-600/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {lang === 'mr' ? 'अस्सल कोल्हापुरी' : 'Kolhapur Heritage'}
            </span>
            <span className="hidden sm:inline">
              {t('free_delivery_above')} • 100% Kachi Ghani Cold-Pressed Oil
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Quick Pincode delivery selector */}
            <div className="relative">
              <button
                onClick={() => setPincodePopupOpen(!pincodePopupOpen)}
                className="flex items-center gap-1 text-amber-200 hover:text-white transition"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {lang === 'mr' ? 'पिनकोड:' : 'Deliver to:'} <strong>{pincode}</strong>
                  {pincodeInfo ? ` (${pincodeInfo.city})` : ''}
                </span>
              </button>

              {pincodePopupOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-amber-300 p-3 text-stone-800 z-50 animate-in fade-in zoom-in-95">
                  <p className="text-xs font-bold text-stone-900 mb-1.5">
                    {lang === 'mr' ? 'डिलिव्हरी पिनकोड तपासा' : 'Check Serviceability & Delivery ETA'}
                  </p>
                  <form onSubmit={handlePincodeSubmit} className="flex gap-1.5">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={e => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 411001"
                      className="flex-1 px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-700 text-white text-xs font-semibold rounded-lg hover:bg-amber-800 transition"
                    >
                      {t('check_btn')}
                    </button>
                  </form>
                  {pincodeStatusMsg && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {pincodeStatusMsg}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 bg-amber-900/60 hover:bg-amber-900 px-2.5 py-0.5 rounded-full text-white font-semibold transition border border-amber-600/50"
              title="Toggle English / मराठी"
            >
              <Globe className="w-3 h-3 text-amber-300" />
              <span>{lang === 'en' ? 'मराठी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Heritage Slogan */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-800/20 group-hover:scale-105 transition">
              {/* Pickle Jar / Traditional Barni icon */}
              <span className="font-heritage text-2xl font-black">ना</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heritage text-2xl font-black tracking-tight text-amber-950">
                  Naik Foods
                </span>
                <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300/60">
                  1954
                </span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium -mt-0.5">
                {t('brand_tagline')}
              </p>
            </div>
          </div>

          {/* Persistent Smart Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-amber-50/70 hover:bg-amber-50 border border-amber-200 hover:border-amber-400 rounded-2xl text-stone-500 text-sm shadow-2xs transition group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-amber-700 group-hover:scale-110 transition" />
                <span className="text-stone-400 group-hover:text-stone-600">
                  {t('search_placeholder')}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-amber-800 bg-amber-100/70 border border-amber-300/60 px-2 py-0.5 rounded-lg">
                <span>⌘K /</span>
              </div>
            </button>
          </div>

          {/* Action CTAs: AI Features, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2.5 rounded-xl text-stone-600 hover:text-amber-800 hover:bg-amber-50"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAssistant}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200/90 border border-amber-300/80 transition"
              title="Open Pantry QA Assistant"
            >
              <Bot className="w-4 h-4 text-amber-700" />
              <span>{lang === 'mr' ? 'AI सहाय्यक' : 'AI Assistant'}</span>
            </button>

            {/* Taste Profile AI Trigger */}
            <button
              onClick={onOpenTasteProfile}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
              title="Personalized Taste Matcher"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{lang === 'mr' ? 'माझा स्वाद' : 'Taste Profile'}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2.5 rounded-xl text-stone-700 hover:text-red-700 hover:bg-red-50 transition"
              title={t('nav_wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Orders Icon */}
            <button
              onClick={() => onNavigate('orders')}
              className="hidden sm:flex p-2.5 rounded-xl text-stone-700 hover:text-amber-800 hover:bg-amber-50 transition"
              title={t('nav_orders')}
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white shadow-md shadow-amber-800/20 transition transform active:scale-95"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold text-xs">
                {subtotal > 0 ? formatPrice(subtotal) : t('nav_cart')}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Row */}
        <nav className="hidden md:flex items-center justify-between py-2.5 border-t border-amber-100 text-xs font-semibold text-stone-700">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-amber-700 transition ${currentView === 'home' ? 'text-amber-700 font-bold' : ''}`}
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => onNavigate('store')}
              className={`hover:text-amber-700 transition ${currentView === 'store' ? 'text-amber-700 font-bold' : ''}`}
            >
              {t('nav_store')}
            </button>
            <button
              onClick={() => onNavigate('store', 'Pickles')}
              className="hover:text-amber-700 transition"
            >
              {lang === 'mr' ? 'पारंपारिक लोणची' : 'Pickles (Lonche)'}
            </button>
            <button
              onClick={() => onNavigate('store', 'Thecha & Chutneys')}
              className="hover:text-amber-700 transition"
            >
              {lang === 'mr' ? 'ठेचा आणि चटण्या' : 'Thecha & Chutneys'}
            </button>
            <button
              onClick={() => onNavigate('store', 'Authentic Masalas')}
              className="hover:text-amber-700 transition"
            >
              {lang === 'mr' ? 'अस्सल मसाले' : 'Authentic Masalas'}
            </button>
            <button
              onClick={() => onNavigate('store', 'Upvas & Fasting')}
              className="hover:text-amber-700 transition"
            >
              {lang === 'mr' ? 'उपवास फराळ' : 'Upvas Special'}
            </button>
          </div>

          <div className="flex items-center gap-4 text-amber-900">
            <button
              onClick={onOpenVisualMatch}
              className="flex items-center gap-1 hover:text-amber-700 transition"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'mr' ? 'रंग/पोत शोधक' : 'Color Flavor Matcher'}</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-200 bg-white p-4 space-y-3 animate-in slide-in-from-top-4">
          <div className="space-y-2 text-sm font-semibold">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50"
            >
              {t('nav_home')}
            </button>
            <button
              onClick={() => { onNavigate('store'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50"
            >
              {t('nav_store')}
            </button>
            <button
              onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 px-3 rounded-lg hover:bg-amber-50"
            >
              {t('nav_orders')}
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 space-y-2">
            <button
              onClick={() => { onOpenTasteProfile(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-2 px-3 rounded-lg bg-amber-50 text-amber-900 font-bold text-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('taste_profile_title')}</span>
            </button>
            <button
              onClick={() => { onOpenAssistant(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-2 px-3 rounded-lg bg-stone-100 text-stone-800 font-bold text-xs"
            >
              <Bot className="w-4 h-4 text-amber-700" />
              <span>{t('assistant_title')}</span>
            </button>
            <button
              onClick={() => { onOpenVisualMatch(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 w-full py-2 px-3 rounded-lg bg-stone-100 text-stone-800 font-bold text-xs"
            >
              <Palette className="w-4 h-4 text-amber-700" />
              <span>{t('visual_match_title')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
