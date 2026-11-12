import { computeRationNutrition, RATION_PRODUCTS, RationProduct } from '../data/rations';
import { AnimatedStat } from './AnimatedStat';
import { RevealGridItem, RevealHeading } from './Reveal';
import { TopographicBackground } from './TopographicBackground';

interface SupplyComparisonProps {
  onSelectProduct: (slug: string) => void;
  onAddToCart: (product: RationProduct) => void;
}

export function SupplyComparison({
  onSelectProduct,
  onAddToCart,
}: SupplyComparisonProps) {
  const coreRations = RATION_PRODUCTS.filter((p) =>
    ['milvita-24h-ration', 'milvita-48h-ration', 'milvita-72h-ration'].includes(p.slug)
  );

  const enriched = coreRations.map((product) => ({
    product,
    nutrition: computeRationNutrition(product),
  }));

  return (
    <section
      id="supply-comparison"
      className="relative overflow-hidden border-y border-[#23241F]/15 dark:border-[#EDE8DC]/15 bg-[#EDE8DC] dark:bg-[#161B21] py-16 sm:py-24 transition-colors duration-200"
    >
      <TopographicBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <RevealHeading>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
                02. ZESTAWIENIE AUTONOMII POLOWEJ
              </p>
              <h2 className="type-display-section mt-2 font-bold text-[#23241F] dark:text-[#EDE8DC]">
                Podział zapasu 24H / 48H / 72H
              </h2>
            </div>
            <p className="type-prose max-w-md text-sm text-[#23241F]/75 dark:text-[#EDE8DC]/75">
              Każda racja jest skalowana pod rzeczywiste zapotrzebowanie marszowe. Wartości wynikają bezpośrednio z sumy zawartych komponentów.
            </p>
          </div>
        </RevealHeading>

        {/* Ration label style comparison grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {enriched.map(({ product, nutrition }, index) => (
            <RevealGridItem key={product.id} index={index}>
              <div className="flex h-full flex-col justify-between border border-[#23241F] dark:border-[#EDE8DC]/25 bg-[#EDE8DC] dark:bg-[#23241F] p-6">
              <div>
                <div className="flex items-baseline justify-between border-b-2 border-[#23241F] dark:border-[#EDE8DC]/30 pb-3">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-[#4E5B3A] dark:text-[#9BB575]">
                      {product.sku}
                    </span>
                    <h3 className="font-condensed mt-0.5 text-2xl font-bold text-[#23241F] dark:text-[#EDE8DC]">
                      {product.name}
                    </h3>
                  </div>
                  <span className="font-mono text-lg font-semibold tabular-nums text-[#23241F] dark:text-[#14B8A6]">
                    {product.durationHours}H
                  </span>
                </div>

                {/* Big Calorie Header */}
                <div className="border-b border-[#23241F]/25 dark:border-[#EDE8DC]/20 py-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                      Wartość energetyczna
                    </span>
                    <span className="font-mono text-xs tabular-nums text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                      <AnimatedStat value={nutrition.kj} suffix=" kJ" />
                    </span>
                  </div>
                  <div className="mt-1 font-condensed text-4xl sm:text-[42px] font-bold leading-none tracking-[-0.03em] tabular-nums text-[#23241F] dark:text-[#EDE8DC]">
                    <AnimatedStat value={nutrition.kcal} suffix=" kcal" />
                  </div>
                  <p className="mt-2 type-mono-spec text-[11px] tracking-[0.04em] text-[#4E5B3A] dark:text-[#9BB575]">
                    Średnio {Math.round(nutrition.kcal / (product.durationHours / 24)).toLocaleString('pl-PL')} kcal / 24h
                  </p>
                </div>

                {/* Spec rows */}
                <dl className="divide-y divide-[#23241F]/15 dark:divide-[#EDE8DC]/15 font-mono text-xs tabular-nums">
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Białko</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                      {nutrition.proteinG} g ({nutrition.proteinPct}%)
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Węglowodany</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                      {nutrition.carbsG} g ({nutrition.carbsPct}%)
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Tłuszcze</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                      {nutrition.fatG} g ({nutrition.fatPct}%)
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Masa żywności netto</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                      {(nutrition.netFoodWeightG / 1000).toFixed(2)} kg
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Masa pakietu brutto</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                      {(nutrition.grossWeightG / 1000).toFixed(2)} kg
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Dania główne / Porcje</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                      {product.mealsCount} dania · {product.portionsCount} porcji
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Woda do przygotowania</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">{product.waterRequiredMl} ml</dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">Okres trwałości</dt>
                    <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">{product.shelfLifeMonths} mies.</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 border-t border-[#23241F] dark:border-[#EDE8DC]/20 pt-4">
                <span className="font-mono text-base font-semibold tabular-nums text-[#23241F] dark:text-[#EDE8DC]">
                  {product.pricePln} PLN
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product.slug)}
                    className="min-h-[40px] px-3 py-2 border border-[#23241F]/30 dark:border-[#EDE8DC]/30 font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC] hover:border-[#23241F] dark:hover:border-[#EDE8DC] transition-colors whitespace-nowrap shrink-0"
                  >
                    Skład
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="min-h-[40px] px-3.5 py-2 bg-[#23241F] dark:bg-[#EDE8DC] font-mono text-xs uppercase tracking-wider text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#14B8A6] hover:text-[#161B21] transition-colors whitespace-nowrap shrink-0"
                  >
                    Dodaj
                  </button>
                </div>
              </div>
            </div>
            </RevealGridItem>
          ))}
        </div>

        <p className="mt-6 font-mono text-[11px] text-[#23241F]/65 dark:text-[#EDE8DC]/60">
          UWAGA TECHNICZNA: Dane kaloryczne i makroskładniki dla zestawów prototypowych DROP 001 mają charakter ilustracyjny i pochodzą z obliczeń recepturowych (nie stanowią atestu laboratoryjnego).
        </p>
      </div>
    </section>
  );
}
