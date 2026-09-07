import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SmartSearchModal } from './components/ai/SmartSearchModal';
import { TasteProfileModal } from './components/ai/TasteProfileModal';
import { AiAssistantModal } from './components/ai/AiAssistantModal';
import { VisualRecommenderModal } from './components/ai/VisualRecommenderModal';

// Pages
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { OrdersPage } from './pages/OrdersPage';

// Context Providers
import { LanguageProvider } from './context/LanguageContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { Order } from './types';

export function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'store' | 'product' | 'cart' | 'checkout' | 'order_confirmation' | 'wishlist' | 'orders'>('home');
  const [activeProductId, setActiveProductId] = useState<string>('ambadi-bhajiche-lonche');
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // AI Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTasteProfileOpen, setIsTasteProfileOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isVisualMatchOpen, setIsVisualMatchOpen] = useState(false);

  // Global Keyboard Shortcut: ⌘K or / to open smart search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'store') {
      setActiveCategory(param);
      setCurrentView('store');
    } else if (view === 'product') {
      if (param) setActiveProductId(param);
      setCurrentView('product');
    } else if (view === 'home' || view === 'cart' || view === 'checkout' || view === 'wishlist' || view === 'orders') {
      setCurrentView(view as any);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setActiveProductId(productId);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
    setCurrentView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderPlaced = (order: Order) => {
    setLatestOrder(order);
    setCurrentView('order_confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-stone-900">
      {/* Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTasteProfile={() => setIsTasteProfileOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenVisualMatch={() => setIsVisualMatchOpen(true)}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenTasteProfile={() => setIsTasteProfileOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'store' && (
          <StorePage
            initialCategory={activeCategory}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'product' && (
          <ProductDetailPage
            productId={activeProductId}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderPlaced={handleOrderPlaced}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'order_confirmation' && latestOrder && (
          <OrderConfirmationPage
            order={latestOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'orders' && (
          <OrdersPage
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => handleNavigate('checkout')}
        onNavigateToProduct={handleSelectProduct}
        onNavigateToStore={() => handleNavigate('store')}
      />

      {/* AI Modals */}
      <SmartSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
        onSelectCategory={handleSelectCategory}
      />

      <TasteProfileModal
        isOpen={isTasteProfileOpen}
        onClose={() => setIsTasteProfileOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <AiAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      <VisualRecommenderModal
        isOpen={isVisualMatchOpen}
        onClose={() => setIsVisualMatchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <WishlistProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </WishlistProvider>
    </LanguageProvider>
  );
}
