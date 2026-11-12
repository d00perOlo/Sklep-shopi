import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { RATION_PRODUCTS, RationProduct } from './data/rations';
import { HeroSlideshow } from './components/HeroSlideshow';
import { ProductCard } from './components/ProductCard';
import { SupplyComparison } from './components/SupplyComparison';
import { TestingSection } from './components/TestingSection';
import { NextDropSignup } from './components/NextDropSignup';
import { ShopView } from './components/ShopView';
import { ProductDetailView } from './components/ProductDetailView';
import { AboutView, ThemeMode } from './components/AboutView';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { TopographicBackground } from './components/TopographicBackground';
import { RevealGridItem, RevealHeading } from './components/Reveal';
import { FAQSection } from './components/FAQSection';

type RouteState =
  | { view: 'home' }
  | { view: 'shop' }
  | { view: 'testing' }
  | { view: 'about' }
  | { view: 'product'; slug: string };

const CART_STORAGE_KEY = 'milvita_drop001_cart';
const THEME_STORAGE_KEY = 'milvita_theme_mode';

function parseHashRoute(): RouteState {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw || raw === '/') return { view: 'home' };
  if (raw === '/sklep') return { view: 'shop' };
  if (raw === '/testy') return { view: 'testing' };
  if (raw === '/o-marce') return { view: 'about' };
  if (raw.startsWith('/produkt/')) {
    const slug = raw.replace('/produkt/', '').trim();
    const exists = RATION_PRODUCTS.some((p) => p.slug === slug);
    if (exists) return { view: 'product', slug };
  }
  return { view: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<RouteState>(() => parseHashRoute());
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved) as { productId: string; quantity: number }[];
      return parsed
        .map((entry) => {
          const product = RATION_PRODUCTS.find((p) => p.id === entry.productId);
          return product ? { product, quantity: Math.max(1, entry.quantity) } : null;
        })
        .filter((x): x is CartItem => x !== null);
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      return saved === 'blackout' ? 'blackout' : 'day';
    } catch {
      return 'day';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'blackout');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch {
      // Ignore storage errors
    }
  }, [themeMode]);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute());
      setMobileMenuOpen(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    try {
      const compact = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(compact));
    } catch {
      // Ignore storage errors
    }
  }, [cart]);

  const navigateTo = (next: RouteState, scrollToTop = true) => {
    let hash = '#/';
    if (next.view === 'shop') hash = '#/sklep';
    if (next.view === 'testing') hash = '#/testy';
    if (next.view === 'about') hash = '#/o-marce';
    if (next.view === 'product') hash = `#/produkt/${next.slug}`;

    if (window.location.hash !== hash) {
      window.location.hash = hash;
    } else {
      setRoute(next);
    }
    setMobileMenuOpen(false);
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToHomeSection = (sectionId: string) => {
    if (route.view !== 'home') {
      navigateTo({ view: 'home' }, false);
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = (product: RationProduct, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const selectedProduct =
    route.view === 'product'
      ? RATION_PRODUCTS.find((p) => p.slug === route.slug) || RATION_PRODUCTS[0]
      : null;

  const tickerText =
    'MILVITA. TESTOWALIŚMY. ANALIZOWALIŚMY. UDOSKONALALIŚMY. JUŻ NIEDŁUGO.';

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE8DC] dark:bg-[#161B21] text-[#23241F] dark:text-[#EDE8DC] transition-colors duration-200">
      {/* Thin charcoal top ticker bar */}
      <div
        aria-label="Komunikat premierowy MILVITA"
        className="h-8 w-full overflow-hidden bg-[#23241F] text-[#EDE8DC] flex items-center border-b border-[#EDE8DC]/10"
      >
        <div className="animate-milvita-ticker font-mono text-[11px] tracking-[0.18em] uppercase whitespace-nowrap">
          <span className="px-8">{tickerText}</span>
          <span aria-hidden="true" className="px-8">{tickerText}</span>
          <span aria-hidden="true" className="px-8">{tickerText}</span>
          <span aria-hidden="true" className="px-8">{tickerText}</span>
        </div>
      </div>

      {/* Clean 3-zone Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#23241F]/15 dark:border-[#EDE8DC]/15 bg-[#EDE8DC]/95 dark:bg-[#161B21]/95 backdrop-blur-sm transition-colors duration-200">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigateTo({ view: 'home' })}
            className="font-condensed text-2xl font-bold tracking-tight text-[#23241F] dark:text-[#EDE8DC] whitespace-nowrap shrink-0 hover:text-[#4E5B3A] dark:hover:text-[#14B8A6] transition-colors"
          >
            MILVITA
          </button>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Nawigacja główna"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#23241F]/80 dark:text-[#EDE8DC]/75"
          >
            <button
              type="button"
              onClick={() => navigateTo({ view: 'shop' })}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#23241F] dark:hover:text-[#EDE8DC] hover:underline underline-offset-4 ${
                route.view === 'shop' || route.view === 'product'
                  ? 'text-[#23241F] dark:text-[#EDE8DC] underline decoration-[#14B8A6] decoration-2'
                  : ''
              }`}
            >
              Sklep
            </button>
            <button
              type="button"
              onClick={() => scrollToHomeSection('supply-comparison')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#23241F] dark:hover:text-[#EDE8DC] hover:underline underline-offset-4"
            >
              Racje 24–72H
            </button>
            <button
              type="button"
              onClick={() => navigateTo({ view: 'testing' })}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#23241F] dark:hover:text-[#EDE8DC] hover:underline underline-offset-4 ${
                route.view === 'testing'
                  ? 'text-[#23241F] dark:text-[#EDE8DC] underline decoration-[#14B8A6] decoration-2'
                  : ''
              }`}
            >
              Testy polowe
            </button>
            <button
              type="button"
              onClick={() => navigateTo({ view: 'about' })}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#23241F] dark:hover:text-[#EDE8DC] hover:underline underline-offset-4 ${
                route.view === 'about'
                  ? 'text-[#23241F] dark:text-[#EDE8DC] underline decoration-[#14B8A6] decoration-2'
                  : ''
              }`}
            >
              O marce
            </button>
          </nav>

          {/* Zone 3: 1 primary action (Cart) + mobile menu toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 bg-[#23241F] dark:bg-[#EDE8DC] px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#4E5B3A] dark:hover:bg-[#14B8A6] transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#14B8A6] dark:text-[#161B21]" />
              <span className="tabular-nums">Koszyk ({totalCartItems})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              className="flex md:hidden h-10 w-10 items-center justify-center border border-[#23241F]/25 dark:border-[#EDE8DC]/25 text-[#23241F] dark:text-[#EDE8DC]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#23241F]/15 dark:border-[#EDE8DC]/15 bg-[#EDE8DC] dark:bg-[#161B21] px-4 py-4 space-y-1">
            <button
              type="button"
              onClick={() => navigateTo({ view: 'shop' })}
              className="block w-full py-2.5 text-left font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC]"
            >
              Sklep Drop 001
            </button>
            <button
              type="button"
              onClick={() => scrollToHomeSection('supply-comparison')}
              className="block w-full py-2.5 text-left font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC]"
            >
              Porównanie 24H / 48H / 72H
            </button>
            <button
              type="button"
              onClick={() => navigateTo({ view: 'testing' })}
              className="block w-full py-2.5 text-left font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC]"
            >
              Tested &amp; Refined / Field Test
            </button>
            <button
              type="button"
              onClick={() => navigateTo({ view: 'about' })}
              className="block w-full py-2.5 text-left font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC]"
            >
              O marce MILVITA
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {route.view === 'home' && (
          <>
            <HeroSlideshow
              onExploreRations={() => scrollToHomeSection('drop-001-grid')}
              onComingSoon={() => scrollToHomeSection('next-drop-section')}
            />

            {/* 01. Product Grid on first scroll */}
            <section
              id="drop-001-grid"
              className="relative overflow-hidden bg-[#EDE8DC] dark:bg-[#161B21] py-16 sm:py-24 transition-colors duration-200"
            >
              <TopographicBackground />

              <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
                <RevealHeading>
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-[#23241F]/15 dark:border-[#EDE8DC]/15 pb-6">
                    <div>
                      <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
                        01. KOLEKCJA DROP 001
                      </p>
                      <h2 className="type-display-section mt-2 font-bold text-[#23241F] dark:text-[#EDE8DC]">
                        Racje gotowe do wyjścia w teren
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigateTo({ view: 'shop' })}
                      className="self-start md:self-auto min-h-[40px] px-4 py-2 border border-[#23241F] dark:border-[#EDE8DC]/35 font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC] hover:bg-[#23241F] hover:text-[#EDE8DC] dark:hover:bg-[#EDE8DC] dark:hover:text-[#161B21] transition-colors whitespace-nowrap shrink-0"
                    >
                      Filtruj wszystkie w sklepie
                    </button>
                  </div>
                </RevealHeading>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {RATION_PRODUCTS.map((product, index) => (
                    <RevealGridItem key={product.id} index={index}>
                      <ProductCard
                        product={product}
                        index={index}
                        onSelectProduct={(slug) => navigateTo({ view: 'product', slug })}
                        onAddToCart={(prod) => handleAddToCart(prod, 1)}
                      />
                    </RevealGridItem>
                  ))}
                </div>
              </div>
            </section>

            {/* 02. 24H / 48H / 72H Supply Breakdown */}
            <SupplyComparison
              onSelectProduct={(slug) => navigateTo({ view: 'product', slug })}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
            />

            {/* 03 & 04. Tested & Refined + Field Test */}
            <TestingSection
              compact
              onOpenFullTesting={() => navigateTo({ view: 'testing' })}
            />

            {/* 05. FAQ Accordion */}
            <FAQSection />

            {/* 06. Next Drop Email Signup */}
            <NextDropSignup />
          </>
        )}

        {route.view === 'shop' && (
          <>
            <ShopView
              onSelectProduct={(slug) => navigateTo({ view: 'product', slug })}
              onAddToCart={(prod) => handleAddToCart(prod, 1)}
            />
            <NextDropSignup />
          </>
        )}

        {route.view === 'product' && selectedProduct && (
          <>
            <ProductDetailView
              product={selectedProduct}
              onBackToShop={() => navigateTo({ view: 'shop' })}
              onSelectProduct={(slug) => navigateTo({ view: 'product', slug })}
              onAddToCart={(prod, qty) => {
                handleAddToCart(prod, qty);
                setIsCartOpen(true);
              }}
            />
            <NextDropSignup />
          </>
        )}

        {route.view === 'testing' && (
          <>
            <div className="border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#161B21] py-12 sm:py-16 transition-colors duration-200">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
                  DOKUMENTACJA INŻYNIERYJNA MILVITA
                </p>
                <h1 className="type-display-section mt-2 font-bold text-[#23241F] dark:text-[#EDE8DC]">
                  Testy receptury, próby opakowań i raporty z terenu
                </h1>
              </div>
            </div>
            <TestingSection />
            <NextDropSignup />
          </>
        )}

        {route.view === 'about' && (
          <>
            <AboutView
              themeMode={themeMode}
              onChangeTheme={setThemeMode}
              onGoToShop={() => navigateTo({ view: 'shop' })}
              onGoToTesting={() => navigateTo({ view: 'testing' })}
            />
            <NextDropSignup />
          </>
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#EDE8DC]/15 bg-[#23241F] text-[#EDE8DC]/80">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="font-condensed text-2xl font-bold tracking-tight text-[#EDE8DC]">
                MILVITA
              </div>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#EDE8DC]/65">
                KAŻDY ELEMENT MA SWOJE ZADANIE. KAŻDA KALORIA MA ZNACZENIE.
                <br />
                Partia premierowa DROP 001 przygotowana w architekturze Shopify Storefront.
              </p>
            </div>

            <div className="md:col-span-3 space-y-2 font-mono text-xs">
              <div className="text-[#EDE8DC] uppercase tracking-wider">Nawigacja</div>
              <button
                type="button"
                onClick={() => navigateTo({ view: 'shop' })}
                className="block hover:text-[#14B8A6] transition-colors"
              >
                Sklep Drop 001
              </button>
              <button
                type="button"
                onClick={() => scrollToHomeSection('supply-comparison')}
                className="block hover:text-[#14B8A6] transition-colors"
              >
                Porównanie 24H / 48H / 72H
              </button>
              <button
                type="button"
                onClick={() => navigateTo({ view: 'testing' })}
                className="block hover:text-[#14B8A6] transition-colors"
              >
                Tested &amp; Refined
              </button>
              <button
                type="button"
                onClick={() => navigateTo({ view: 'about' })}
                className="block hover:text-[#14B8A6] transition-colors"
              >
                O marce MILVITA
              </button>
            </div>

            <div className="md:col-span-4 space-y-2 font-mono text-xs">
              <div className="text-[#EDE8DC] uppercase tracking-wider">Racje w ofercie</div>
              {RATION_PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigateTo({ view: 'product', slug: p.slug })}
                  className="block text-left hover:text-[#14B8A6] transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-[#EDE8DC]/15 pt-6 font-mono text-[11px] text-[#EDE8DC]/50 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 MILVITA SURVIVAL FOOD · DROP 001</span>
            <span>Dane wartości odżywczych prototypu mają charakter ilustracyjny.</span>
          </div>
        </div>
      </footer>

      {/* Shopify Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
