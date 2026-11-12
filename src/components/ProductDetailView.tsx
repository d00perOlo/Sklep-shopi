import { useState } from 'react';
import { ArrowLeft, Check, Minus, Plus, Printer, ShieldAlert } from 'lucide-react';
import {
  computeRationNutrition,
  RATION_PRODUCTS,
  RationComponent,
  RationProduct,
} from '../data/rations';
import { AnimatedStat } from './AnimatedStat';
import { MacroPieChart } from './MacroPieChart';
import { NutritionRadarChart } from './NutritionRadarChart';
import { RationPrintLabel } from './RationPrintLabel';
import { RevealHeading } from './Reveal';
import { TopographicBackground } from './TopographicBackground';

interface ProductDetailViewProps {
  product: RationProduct;
  onBackToShop: () => void;
  onSelectProduct: (slug: string) => void;
  onAddToCart: (product: RationProduct, quantity: number) => void;
}

export function ProductDetailView({
  product,
  onBackToShop,
  onSelectProduct,
  onAddToCart,
}: ProductDetailViewProps) {
  const [activePhoto, setActivePhoto] = useState<'outdoor' | 'closeup'>('outdoor');
  const [quantity, setQuantity] = useState(1);
  const [componentFilter, setComponentFilter] = useState<string>('Wszystkie');
  const [added, setAdded] = useState(false);
  const [showPrintLabel, setShowPrintLabel] = useState(false);

  const nutrition = computeRationNutrition(product);
  const categories = ['Wszystkie', 'Danie główne', 'Przekąska', 'Hydratacja', 'Akcesorium'];

  const visibleComponents =
    componentFilter === 'Wszystkie'
      ? nutrition.components
      : nutrition.components.filter((c) => c.category === componentFilter);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const otherRations = RATION_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="relative bg-[#EDE8DC] dark:bg-[#161B21] text-[#23241F] dark:text-[#EDE8DC] pb-20 transition-colors duration-200">
      <TopographicBackground className="opacity-70" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#23241F]/15 dark:border-[#EDE8DC]/15 pb-4">
          <button
            type="button"
            onClick={onBackToShop}
            className="inline-flex min-h-[40px] items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC] hover:text-[#4E5B3A] dark:hover:text-[#14B8A6] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Powrót do katalogu racji
          </button>
          <div className="flex flex-wrap items-center gap-3">
            <div className="font-mono text-xs text-[#23241F]/65 dark:text-[#EDE8DC]/65">
              <span>{product.category}</span>
              <span className="mx-2">/</span>
              <span>SKU: {product.sku}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPrintLabel(true)}
              className="inline-flex min-h-[38px] items-center gap-2 border border-[#23241F] dark:border-[#EDE8DC]/35 bg-[#EDE8DC] dark:bg-[#23241F] px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC] hover:bg-[#23241F] hover:text-[#EDE8DC] dark:hover:bg-[#EDE8DC] dark:hover:text-[#161B21] transition-colors whitespace-nowrap shrink-0"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Label (PDF)
            </button>
          </div>
        </div>

        {/* Main 2-column Contiguous Purchase Module */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Dual Generated Photo Gallery */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[#23241F]/15 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#23241F]">
              <img
                src={activePhoto === 'outdoor' ? product.outdoorImage : product.closeupImage}
                alt={activePhoto === 'outdoor' ? product.outdoorAlt : product.closeupAlt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActivePhoto('outdoor')}
                className={`group flex items-center gap-3 border p-2 text-left transition-colors ${
                  activePhoto === 'outdoor'
                    ? 'border-[#23241F] dark:border-[#EDE8DC] bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                    : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#23241F] text-[#23241F] dark:text-[#EDE8DC] hover:border-[#23241F] dark:hover:border-[#EDE8DC]'
                }`}
              >
                <img
                  src={product.outdoorImage}
                  alt={product.outdoorAlt}
                  referrerPolicy="no-referrer"
                  className="h-14 w-20 shrink-0 object-cover"
                />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-wider">
                    01 · Teren
                  </div>
                  <div className="truncate text-xs opacity-80">Środowisko operacyjne</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActivePhoto('closeup')}
                className={`group flex items-center gap-3 border p-2 text-left transition-colors ${
                  activePhoto === 'closeup'
                    ? 'border-[#23241F] dark:border-[#EDE8DC] bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                    : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#23241F] text-[#23241F] dark:text-[#EDE8DC] hover:border-[#23241F] dark:hover:border-[#EDE8DC]'
                }`}
              >
                <img
                  src={product.closeupImage}
                  alt={product.closeupAlt}
                  referrerPolicy="no-referrer"
                  className="h-14 w-20 shrink-0 object-cover"
                />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-wider">
                    02 · Zawartość
                  </div>
                  <div className="truncate text-xs opacity-80">Opakowanie i komponenty</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right: Contiguous Purchase & Specification Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 border border-[#23241F] dark:border-[#EDE8DC]/25 bg-[#EDE8DC] dark:bg-[#23241F] p-6">
            <div className="flex items-center justify-between gap-2 type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
              <span>{product.shortTag}</span>
              <span>{product.dropStatus}</span>
            </div>

            <h1 className="type-display-section mt-2 font-bold text-[#23241F] dark:text-[#EDE8DC]">
              {product.name}
            </h1>

            <div className="mt-3 flex items-baseline justify-between border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 pb-4">
              <span className="type-mono-spec text-2xl font-semibold text-[#23241F] dark:text-[#EDE8DC]">
                {product.pricePln} PLN
              </span>
              <span className="type-mono-spec text-xs text-[#23241F]/65 dark:text-[#EDE8DC]/65">
                Shopify ID: {product.sku}
              </span>
            </div>

            <p className="type-prose mt-4 text-sm text-[#23241F]/85 dark:text-[#EDE8DC]/85">
              {product.summary}
            </p>
            <p className="mt-2 type-mono-spec text-xs leading-relaxed text-[#4E5B3A] dark:text-[#9BB575]">
              Zastosowanie: {product.fieldUse}
            </p>

            {/* Primary Nutrition Summary Box (Military Ration Label) */}
            <div className="mt-5 border border-[#23241F] dark:border-[#EDE8DC]/25 bg-transparent dark:bg-[#161B21]/60 p-4">
              <div className="flex items-baseline justify-between border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 pb-2">
                <span className="type-kicker text-[10px] text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                  Energia całkowita racji
                </span>
                <span className="type-mono-spec text-xs text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                  <AnimatedStat value={nutrition.kj} suffix=" kJ" />
                </span>
              </div>
              <div className="mt-1.5 font-condensed text-4xl font-bold leading-none tracking-[-0.03em] tabular-nums text-[#23241F] dark:text-[#EDE8DC]">
                <AnimatedStat value={nutrition.kcal} suffix=" kcal" />
              </div>

              {/* Macro split bar */}
              <div className="mt-3 flex h-2 w-full overflow-hidden bg-[#23241F]/10 dark:bg-[#EDE8DC]/10">
                <div
                  style={{ width: `${nutrition.proteinPct}%` }}
                  className="bg-[#4E5B3A] dark:bg-[#9BB575]"
                  title={`Białko ${nutrition.proteinPct}%`}
                />
                <div
                  style={{ width: `${nutrition.carbsPct}%` }}
                  className="bg-[#23241F] dark:bg-[#EDE8DC]/75"
                  title={`Węglowodany ${nutrition.carbsPct}%`}
                />
                <div
                  style={{ width: `${nutrition.fatPct}%` }}
                  className="bg-[#14B8A6]"
                  title={`Tłuszcze ${nutrition.fatPct}%`}
                />
              </div>

              <dl className="mt-3 grid grid-cols-4 gap-2 font-mono text-xs tabular-nums">
                <div>
                  <dt className="text-[10px] uppercase text-[#23241F]/60 dark:text-[#EDE8DC]/60">Białko ({nutrition.proteinPct}%)</dt>
                  <dd className="font-semibold text-[#23241F] dark:text-[#EDE8DC]">{nutrition.proteinG} g</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-[#23241F]/60 dark:text-[#EDE8DC]/60">Węgle ({nutrition.carbsPct}%)</dt>
                  <dd className="font-semibold text-[#23241F] dark:text-[#EDE8DC]">{nutrition.carbsG} g</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-[#23241F]/60 dark:text-[#EDE8DC]/60">Tłuszcz ({nutrition.fatPct}%)</dt>
                  <dd className="font-semibold text-[#23241F] dark:text-[#EDE8DC]">{nutrition.fatG} g</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-[#23241F]/60 dark:text-[#EDE8DC]/60">Błonnik</dt>
                  <dd className="font-semibold text-[#23241F] dark:text-[#EDE8DC]">{nutrition.fiberG} g</dd>
                </div>
              </dl>

              <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-[#23241F]/15 dark:border-[#EDE8DC]/15 pt-3 font-mono text-xs tabular-nums">
                <div>
                  <dt className="text-[10px] uppercase text-[#23241F]/60 dark:text-[#EDE8DC]/60">Masa żywności / Brutto</dt>
                  <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                    {nutrition.netFoodWeightG} g / {nutrition.grossWeightG} g
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase text-[#23241F]/60 dark:text-[#EDE8DC]/60">Posiłki / Trwałość</dt>
                  <dd className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                    {product.mealsCount > 0 ? `${product.mealsCount} dania · ` : ''}
                    {product.portionsCount} porcji · {product.shelfLifeMonths} mies.
                  </dd>
                </div>
              </dl>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center border border-[#23241F] dark:border-[#EDE8DC]/30">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Zmniejsz ilość"
                  className="flex h-11 w-11 items-center justify-center text-[#23241F] dark:text-[#EDE8DC] hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums text-[#23241F] dark:text-[#EDE8DC]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Zwiększ ilość"
                  className="flex h-11 w-11 items-center justify-center text-[#23241F] dark:text-[#EDE8DC] hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                  added
                    ? 'bg-[#14B8A6] text-[#161B21]'
                    : 'bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#4E5B3A] dark:hover:bg-[#14B8A6]'
                }`}
              >
                {added && <Check className="h-4 w-4" />}
                {added
                  ? 'Dodano do koszyka'
                  : `Dodaj do koszyka — ${(product.pricePln * quantity).toLocaleString('pl-PL')} PLN`}
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Macronutrient Pie Chart */}
        <MacroPieChart product={product} nutrition={nutrition} />

        {/* D3.js Nutritional Profile Radar Chart */}
        <NutritionRadarChart product={product} nutrition={nutrition} />

        {/* Full Contents, Ingredients & Exact Component Calorie Breakdown */}
        <section className="mt-14 border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 pt-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <RevealHeading>
              <div>
                <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
                  PEŁNY WYKAZ ZAWARTOŚCI I KALKULACJA KOMPONENTÓW
                </p>
                <h2 className="font-condensed mt-1.5 text-2xl sm:text-3xl font-bold leading-tight text-[#23241F] dark:text-[#EDE8DC] [text-wrap:balance]">
                  Składniki, gramatura i bilans kaloryczny każdego elementu
                </h2>
              </div>
            </RevealHeading>

            {/* Category filter tabs */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const count =
                  cat === 'Wszystkie'
                    ? nutrition.components.length
                    : nutrition.components.filter((c) => c.category === cat).length;
                if (count === 0 && cat !== 'Wszystkie') return null;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setComponentFilter(cat)}
                    className={`min-h-[36px] px-3 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 ${
                      componentFilter === cat
                        ? 'border-[#23241F] dark:border-[#EDE8DC] bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                        : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-transparent text-[#23241F] dark:text-[#EDE8DC]/85 hover:border-[#23241F] dark:hover:border-[#EDE8DC]'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specification Table */}
          <div className="mt-6 overflow-x-auto border border-[#23241F] dark:border-[#EDE8DC]/25">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-[#23241F] dark:border-[#EDE8DC]/25 bg-[#23241F] font-mono text-[11px] uppercase tracking-wider text-[#EDE8DC]">
                  <th className="p-3.5">Komponent i porcja</th>
                  <th className="p-3.5 text-right">Masa</th>
                  <th className="p-3.5 text-right">Białko</th>
                  <th className="p-3.5 text-right">Węgle</th>
                  <th className="p-3.5 text-right">Tłuszcz</th>
                  <th className="p-3.5 text-right">Błonnik</th>
                  <th className="p-3.5 text-right">Energia (kcal / kJ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23241F]/15 dark:divide-[#EDE8DC]/15 text-sm">
                {visibleComponents.map((comp) => (
                  <ComponentRow key={comp.id} comp={comp} />
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[#23241F] dark:border-[#EDE8DC]/30 bg-[#23241F]/5 dark:bg-[#23241F] font-mono text-xs font-semibold tabular-nums text-[#23241F] dark:text-[#EDE8DC]">
                  <td className="p-3.5 uppercase">
                    Suma całkowita racji ({product.components.length} pozycji + opakowanie {product.packagingWeightG} g)
                  </td>
                  <td className="p-3.5 text-right">{nutrition.grossWeightG} g brutto</td>
                  <td className="p-3.5 text-right">{nutrition.proteinG} g</td>
                  <td className="p-3.5 text-right">{nutrition.carbsG} g</td>
                  <td className="p-3.5 text-right">{nutrition.fatG} g</td>
                  <td className="p-3.5 text-right">{nutrition.fiberG} g</td>
                  <td className="p-3.5 text-right">
                    {nutrition.kcal.toLocaleString('pl-PL')} kcal / {nutrition.kj.toLocaleString('pl-PL')} kJ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Illustrative Prototype Disclaimer */}
          <div className="mt-5 flex items-start gap-3 border border-[#23241F]/25 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#23241F] p-4 font-mono text-xs leading-relaxed text-[#23241F]/80 dark:text-[#EDE8DC]/80">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#4E5B3A] dark:text-[#14B8A6]" />
            <div>
              <strong className="font-semibold text-[#23241F] dark:text-[#EDE8DC]">
                DANE ILUSTRACYJNE DLA KONCEPCJI PROTOTYPOWEJ DROP 001:
              </strong>{' '}
              Wartości kaloryczne każdego komponentu zostały wyliczone na podstawie współczynników Atwatera (białko 4 kcal/g, węglowodany 4 kcal/g, tłuszcze 9 kcal/g, przelicznik 1 kcal = 4,184 kJ) i sumują się dokładnie do podanych wartości całkowitych. Dane mają charakter projektowy i nie stanowią certyfikowanego raportu z badań laboratoryjnych.
            </div>
          </div>
        </section>

        {/* Other rations cross-link */}
        <section className="mt-16 border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 pt-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4E5B3A] dark:text-[#9BB575]">
            POZOSTAŁE MODUŁY DROP 001
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {otherRations.map((other) => {
              const otherNut = computeRationNutrition(other);
              return (
                <button
                  key={other.id}
                  type="button"
                  onClick={() => {
                    onSelectProduct(other.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-4 border border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#23241F] p-3 text-left transition-colors hover:border-[#23241F] dark:hover:border-[#EDE8DC]"
                >
                  <img
                    src={other.outdoorImage}
                    alt={other.outdoorAlt}
                    referrerPolicy="no-referrer"
                    className="h-16 w-20 shrink-0 object-cover"
                  />
                  <div className="min-w-0">
                    <div className="font-condensed text-lg font-semibold text-[#23241F] dark:text-[#EDE8DC] truncate">
                      {other.name}
                    </div>
                    <div className="font-mono text-xs tabular-nums text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                      {otherNut.kcal.toLocaleString('pl-PL')} kcal · {other.pricePln} PLN
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {showPrintLabel && (
        <RationPrintLabel
          product={product}
          nutrition={nutrition}
          onClose={() => setShowPrintLabel(false)}
        />
      )}
    </div>
  );
}

function ComponentRow({
  comp,
}: {
  comp: RationComponent & { kcal: number; kj: number };
}) {
  return (
    <tr className="align-top hover:bg-[#23241F]/[0.03] dark:hover:bg-[#EDE8DC]/[0.04]">
      <td className="p-3.5 max-w-md">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-semibold text-[#23241F] dark:text-[#EDE8DC]">{comp.name}</span>
          <span className="font-mono text-[11px] uppercase text-[#4E5B3A] dark:text-[#9BB575]">
            {comp.category} · {comp.portionLabel}
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-[#23241F]/75 dark:text-[#EDE8DC]/75">
          <span className="font-mono uppercase text-[10px] text-[#23241F]/60 dark:text-[#EDE8DC]/60">Skład: </span>
          {comp.ingredients}
        </p>
        <p className="mt-1 font-mono text-[11px] text-[#23241F]/65 dark:text-[#EDE8DC]/65">
          Przygotowanie: {comp.preparation}
        </p>
      </td>
      <td className="p-3.5 text-right font-mono text-xs tabular-nums whitespace-nowrap text-[#23241F] dark:text-[#EDE8DC]">
        {comp.weightG} g
      </td>
      <td className="p-3.5 text-right font-mono text-xs tabular-nums whitespace-nowrap text-[#23241F] dark:text-[#EDE8DC]">
        {comp.proteinG} g
      </td>
      <td className="p-3.5 text-right font-mono text-xs tabular-nums whitespace-nowrap text-[#23241F] dark:text-[#EDE8DC]">
        {comp.carbsG} g
      </td>
      <td className="p-3.5 text-right font-mono text-xs tabular-nums whitespace-nowrap text-[#23241F] dark:text-[#EDE8DC]">
        {comp.fatG} g
      </td>
      <td className="p-3.5 text-right font-mono text-xs tabular-nums whitespace-nowrap text-[#23241F] dark:text-[#EDE8DC]">
        {comp.fiberG} g
      </td>
      <td className="p-3.5 text-right font-mono text-xs font-semibold tabular-nums whitespace-nowrap text-[#23241F] dark:text-[#EDE8DC]">
        {comp.kcal.toLocaleString('pl-PL')} kcal
        <span className="block text-[11px] font-normal text-[#23241F]/65 dark:text-[#EDE8DC]/65">
          {comp.kj.toLocaleString('pl-PL')} kJ
        </span>
      </td>
    </tr>
  );
}
