import { useMemo, useState } from 'react';
import { computeRationNutrition, RATION_PRODUCTS, RationProduct } from '../data/rations';
import { ProductCard } from './ProductCard';
import { RevealGridItem, RevealHeading } from './Reveal';
import { TopographicBackground } from './TopographicBackground';

interface ShopViewProps {
  onSelectProduct: (slug: string) => void;
  onAddToCart: (product: RationProduct) => void;
}

export function ShopView({ onSelectProduct, onAddToCart }: ShopViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('Wszystkie');
  const [durationFilter, setDurationFilter] = useState<string>('Wszystkie');
  const [sortBy, setSortBy] = useState<'default' | 'kcal-desc' | 'price-asc' | 'weight-asc'>('default');

  const categories = ['Wszystkie', 'Racje dobowe', 'Pakiety energetyczne', 'Zestawy terenowe'];
  const durations = [
    { key: 'Wszystkie', label: 'Wszystkie czasy' },
    { key: 'short', label: 'Do 16H (Szybkie)' },
    { key: '24', label: '24H' },
    { key: '48', label: '48H' },
    { key: '72', label: '72H' },
  ];

  const filteredProducts = useMemo(() => {
    const base = RATION_PRODUCTS.filter((p) => {
      if (categoryFilter !== 'Wszystkie' && p.category !== categoryFilter) {
        return false;
      }
      if (durationFilter === 'short' && p.durationHours > 16) return false;
      if (durationFilter === '24' && p.durationHours !== 24) return false;
      if (durationFilter === '48' && p.durationHours !== 48) return false;
      if (durationFilter === '72' && p.durationHours !== 72) return false;
      return true;
    });

    if (sortBy === 'default') return base;

    return [...base].sort((a, b) => {
      const nutA = computeRationNutrition(a);
      const nutB = computeRationNutrition(b);
      if (sortBy === 'kcal-desc') return nutB.kcal - nutA.kcal;
      if (sortBy === 'price-asc') return a.pricePln - b.pricePln;
      if (sortBy === 'weight-asc') return nutA.grossWeightG - nutB.grossWeightG;
      return 0;
    });
  }, [categoryFilter, durationFilter, sortBy]);

  return (
    <div className="relative min-h-[70vh] bg-[#EDE8DC] dark:bg-[#161B21] py-12 sm:py-16 transition-colors duration-200">
      <TopographicBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <RevealHeading>
          <div className="border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 pb-6">
            <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
              SKLEP MILVITA · ARCHITEKTURA SHOPIFY DROP 001
            </p>
            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h1 className="type-display-section font-bold text-[#23241F] dark:text-[#EDE8DC]">
                Wszystkie racje i moduły terenowe
              </h1>
              <p className="type-mono-spec text-xs text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                Wyświetlono: {filteredProducts.length} z {RATION_PRODUCTS.length} pozycji
              </p>
            </div>
          </div>
        </RevealHeading>

        {/* Filter Bar */}
        <div className="mt-6 flex flex-col gap-4 border-b border-[#23241F]/15 dark:border-[#EDE8DC]/15 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`min-h-[38px] px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'border-[#23241F] dark:border-[#EDE8DC] bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                    : 'border-[#23241F]/25 dark:border-[#EDE8DC]/25 bg-transparent text-[#23241F] dark:text-[#EDE8DC]/85 hover:border-[#23241F] dark:hover:border-[#EDE8DC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1">
              {durations.map((dur) => (
                <button
                  key={dur.key}
                  type="button"
                  onClick={() => setDurationFilter(dur.key)}
                  className={`min-h-[36px] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                    durationFilter === dur.key
                      ? 'bg-[#4E5B3A] text-[#EDE8DC]'
                      : 'bg-[#23241F]/5 dark:bg-[#23241F] text-[#23241F]/80 dark:text-[#EDE8DC]/80 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 font-mono text-xs text-[#23241F]/75 dark:text-[#EDE8DC]/75">
              <span className="sr-only">Sortowanie</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'default' | 'kcal-desc' | 'price-asc' | 'weight-asc')
                }
                className="min-h-[38px] border border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-[#EDE8DC] dark:bg-[#23241F] px-3 py-1.5 font-mono text-xs text-[#23241F] dark:text-[#EDE8DC] focus:border-[#14B8A6] focus:outline-none"
              >
                <option value="default">Kolejność Drop 001</option>
                <option value="kcal-desc">Najwyższa kaloryczność (kcal)</option>
                <option value="price-asc">Cena: od najniższej</option>
                <option value="weight-asc">Masa: od najlżejszej</option>
              </select>
            </label>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <RevealGridItem key={product.id} index={index}>
                <ProductCard
                  product={product}
                  index={index}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              </RevealGridItem>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-[#23241F]/25 dark:border-[#EDE8DC]/20 bg-transparent dark:bg-[#23241F] p-10 text-center">
            <p className="font-condensed text-2xl font-semibold text-[#23241F] dark:text-[#EDE8DC]">
              Brak racji spełniających wybrane filtry.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter('Wszystkie');
                setDurationFilter('Wszystkie');
                setSortBy('default');
              }}
              className="mt-4 min-h-[40px] px-5 py-2 bg-[#23241F] dark:bg-[#EDE8DC] font-mono text-xs uppercase tracking-wider text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#4E5B3A] dark:hover:bg-[#14B8A6]"
            >
              Resetuj filtry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
