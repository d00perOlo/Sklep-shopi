import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X } from 'lucide-react';
import { ComputedNutrition, RationProduct } from '../data/rations';

interface RationPrintLabelProps {
  product: RationProduct;
  nutrition: ComputedNutrition;
  onClose: () => void;
}

export function RationPrintLabel({
  product,
  nutrition,
  onClose,
}: RationPrintLabelProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const barcodeWidths = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1];

  return createPortal(
    <div
      id="milvita-print-portal"
      role="dialog"
      aria-modal="true"
      aria-label={`Etykieta do druku PDF — ${product.name}`}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#161B21]/85 p-4 sm:p-8"
    >
      {/* Screen-only toolbar */}
      <div
        id="milvita-print-toolbar"
        className="mx-auto mb-5 flex max-w-[820px] flex-wrap items-center justify-between gap-3 border border-[#EDE8DC]/20 bg-[#23241F] px-4 py-3 text-[#EDE8DC]"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#14B8A6]">
            PODGLĄD ETYKIETY POLOWEJ · FORMAT A4 / PDF
          </p>
          <p className="mt-0.5 text-xs text-[#EDE8DC]/75">
            Użyj przycisku poniżej i wybierz „Zapisz jako PDF” lub drukarkę w oknie systemowym.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[40px] items-center gap-2 bg-[#14B8A6] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#161B21] hover:bg-[#EDE8DC] transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="h-4 w-4" />
            Drukuj / Zapisz PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij podgląd etykiety"
            className="inline-flex min-h-[40px] items-center gap-1.5 border border-[#EDE8DC]/30 px-3 py-2 font-mono text-xs uppercase tracking-wider text-[#EDE8DC] hover:border-[#EDE8DC] transition-colors whitespace-nowrap shrink-0"
          >
            <X className="h-4 w-4" />
            Zamknij
          </button>
        </div>
      </div>

      {/* Physical Military Ration Label Sheet */}
      <article
        id="milvita-print-sheet"
        className="mx-auto max-w-[820px] border-2 border-[#111111] bg-white p-6 sm:p-8 text-[#111111] shadow-2xl"
      >
        {/* Top Military Specification Header */}
        <header className="grid grid-cols-1 gap-4 border-b-2 border-[#111111] pb-4 sm:grid-cols-12 sm:items-end">
          <div className="sm:col-span-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#333333]">
              MILVITA SURVIVAL FOOD · RATION SPECIFICATION LABEL · {product.dropStatus}
            </div>
            <h1 className="font-condensed mt-1 text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111]">
              {product.name}
            </h1>
            <p className="mt-1 font-mono text-xs uppercase text-[#333333]">
              {product.shortTag} · {product.category}
            </p>
          </div>

          <div className="sm:col-span-4 flex flex-col items-start sm:items-end justify-between">
            {/* Deterministic SVG SKU Barcode */}
            <svg
              aria-hidden="true"
              viewBox="0 0 140 34"
              className="h-8 w-36"
              fill="#111111"
            >
              {barcodeWidths.reduce<{ x: number; rects: { x: number; w: number }[] }>(
                (acc, w, idx) => {
                  const nextX = acc.x + w * 2 + 1.5;
                  if (idx % 2 === 0) {
                    acc.rects.push({ x: acc.x, w: w * 2 });
                  }
                  acc.x = nextX;
                  return acc;
                },
                { x: 2, rects: [] }
              ).rects.map((r, i) => (
                <rect key={i} x={r.x} y={2} width={r.w} height={28} />
              ))}
            </svg>
            <div className="mt-1 font-mono text-[11px] font-semibold tracking-widest">
              SKU: {product.sku}
            </div>
          </div>
        </header>

        {/* Quick Technical Telemetry Strip */}
        <dl className="grid grid-cols-2 sm:grid-cols-5 border-b-2 border-[#111111] font-mono text-xs tabular-nums">
          <div className="border-b sm:border-b-0 border-r border-[#111111] p-2.5">
            <dt className="text-[9px] uppercase text-[#444444]">Autonomia</dt>
            <dd className="mt-0.5 font-bold">{product.durationHours} H</dd>
          </div>
          <div className="border-b sm:border-b-0 sm:border-r border-[#111111] p-2.5">
            <dt className="text-[9px] uppercase text-[#444444]">Masa netto / brutto</dt>
            <dd className="mt-0.5 font-bold">
              {nutrition.netFoodWeightG} g / {nutrition.grossWeightG} g
            </dd>
          </div>
          <div className="border-r border-[#111111] p-2.5">
            <dt className="text-[9px] uppercase text-[#444444]">Dania / Porcje</dt>
            <dd className="mt-0.5 font-bold">
              {product.mealsCount} dania · {product.portionsCount} szt.
            </dd>
          </div>
          <div className="sm:border-r border-[#111111] p-2.5">
            <dt className="text-[9px] uppercase text-[#444444]">Wymagana woda</dt>
            <dd className="mt-0.5 font-bold">{product.waterRequiredMl} ml</dd>
          </div>
          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 border-[#111111] p-2.5">
            <dt className="text-[9px] uppercase text-[#444444]">Trwałość</dt>
            <dd className="mt-0.5 font-bold">{product.shelfLifeMonths} mies.</dd>
          </div>
        </dl>

        {/* Nutrition Facts Panel + Field Usage Block */}
        <div className="grid grid-cols-1 gap-5 border-b-2 border-[#111111] py-4 sm:grid-cols-12">
          <div className="sm:col-span-6 border-2 border-[#111111] p-3">
            <div className="border-b-4 border-[#111111] pb-1.5">
              <div className="font-condensed text-xl font-bold uppercase leading-none">
                WARTOŚĆ ODŻYWCZA / NUTRITION FACTS
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase text-[#333333]">
                Pełny pakiet ({nutrition.netFoodWeightG} g żywności netto)
              </div>
            </div>

            <div className="flex items-baseline justify-between border-b-2 border-[#111111] py-2 font-mono tabular-nums">
              <span className="text-xs font-bold uppercase">Energia całkowita</span>
              <span className="text-lg font-bold">
                {nutrition.kcal.toLocaleString('pl-PL')} kcal /{' '}
                {nutrition.kj.toLocaleString('pl-PL')} kJ
              </span>
            </div>

            <dl className="divide-y divide-[#111111]/25 font-mono text-xs tabular-nums">
              <div className="flex justify-between py-1.5">
                <dt className="font-semibold">Białko (Protein)</dt>
                <dd>
                  <strong>{nutrition.proteinG} g</strong> ({nutrition.proteinPct}% kcal)
                </dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="font-semibold">Węglowodany (Carbohydrates)</dt>
                <dd>
                  <strong>{nutrition.carbsG} g</strong> ({nutrition.carbsPct}% kcal)
                </dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="font-semibold">Tłuszcze (Fat)</dt>
                <dd>
                  <strong>{nutrition.fatG} g</strong> ({nutrition.fatPct}% kcal)
                </dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="font-semibold">Błonnik pokarmowy (Dietary Fiber)</dt>
                <dd>
                  <strong>{nutrition.fiberG} g</strong>
                </dd>
              </div>
            </dl>
          </div>

          <div className="sm:col-span-6 flex flex-col justify-between space-y-3 text-xs">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#333333]">
                PRZEZNACZENIE I INSTRUKCJA TERENOWA
              </div>
              <p className="mt-1 leading-relaxed text-[#111111]">{product.summary}</p>
              <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#333333]">
                {product.fieldUse}
              </p>
            </div>

            <div className="border border-[#111111] bg-[#F5F4F0] p-2.5 font-mono text-[10px] leading-relaxed text-[#222222]">
              <div className="font-bold uppercase">WARUNKI PRZECHOWYWANIA I PRZYGOTOWANIA:</div>
              Przechowywać w suchym miejscu w temperaturze od -15°C do +30°C. Dania retortowe
              gotowe do spożycia bezpośrednio z saszetki na zimno lub po podgrzaniu w rękawie FRH
              (8 min) albo w garnku z wodą.
            </div>
          </div>
        </div>

        {/* Complete Component & Ingredient Breakdown Table */}
        <div className="pt-4">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="font-condensed text-lg font-bold uppercase tracking-tight">
              WYKAZ ZAWARTOŚCI I SKŁADNIKI / CONTENTS &amp; INGREDIENTS
            </h2>
            <span className="font-mono text-[10px] uppercase text-[#444444]">
              {nutrition.components.length} pozycji · Partia prototypowa
            </span>
          </div>

          <table className="w-full border-collapse border border-[#111111] text-left">
            <thead>
              <tr className="border-b-2 border-[#111111] bg-[#111111] font-mono text-[10px] uppercase text-white">
                <th className="p-2">Komponent / Składniki</th>
                <th className="p-2 text-right whitespace-nowrap">Masa</th>
                <th className="p-2 text-right whitespace-nowrap">B / W / T / Bł</th>
                <th className="p-2 text-right whitespace-nowrap">Energia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]/30 text-[11px]">
              {nutrition.components.map((comp, idx) => (
                <tr key={comp.id} className="align-top break-inside-avoid">
                  <td className="p-2">
                    <div className="font-bold text-[#111111]">
                      {String(idx + 1).padStart(2, '0')}. {comp.name}{' '}
                      <span className="font-mono text-[10px] font-normal uppercase text-[#444444]">
                        [{comp.portionLabel}]
                      </span>
                    </div>
                    <div className="mt-0.5 leading-snug text-[#222222]">
                      <span className="font-mono text-[10px] uppercase font-semibold">Skład: </span>
                      {comp.ingredients}
                    </div>
                  </td>
                  <td className="p-2 text-right font-mono text-[11px] tabular-nums whitespace-nowrap">
                    {comp.weightG} g
                  </td>
                  <td className="p-2 text-right font-mono text-[10px] tabular-nums whitespace-nowrap">
                    {comp.proteinG}/{comp.carbsG}/{comp.fatG}/{comp.fiberG}g
                  </td>
                  <td className="p-2 text-right font-mono text-[11px] font-semibold tabular-nums whitespace-nowrap">
                    {comp.kcal} kcal
                    <span className="block text-[9px] font-normal text-[#444444]">
                      {comp.kj} kJ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#111111] bg-[#F5F4F0] font-mono text-[11px] font-bold tabular-nums">
                <td className="p-2 uppercase">
                  SUMA CAŁKOWITA (+ opakowanie {product.packagingWeightG} g)
                </td>
                <td className="p-2 text-right">{nutrition.grossWeightG} g</td>
                <td className="p-2 text-right">
                  {nutrition.proteinG}/{nutrition.carbsG}/{nutrition.fatG}/{nutrition.fiberG}g
                </td>
                <td className="p-2 text-right">
                  {nutrition.kcal.toLocaleString('pl-PL')} kcal ({nutrition.kj.toLocaleString('pl-PL')} kJ)
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Legal / Prototype Notice */}
        <footer className="mt-4 flex flex-col gap-1 border-t border-[#111111] pt-2.5 font-mono text-[9px] uppercase text-[#444444] sm:flex-row sm:items-center sm:justify-between">
          <span>
            DANE ILUSTRACYJNE PROTOTYPU DROP 001 — OBLICZENIA RECEPTUROWE (NIE ATEST LABORATORYJNY)
          </span>
          <span>MILVITA.PL · {product.sku}</span>
        </footer>
      </article>
    </div>,
    document.body
  );
}
