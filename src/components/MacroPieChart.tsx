import { useEffect, useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ComputedNutrition, RationProduct } from '../data/rations';
import { RevealHeading } from './Reveal';

interface MacroPieChartProps {
  product: RationProduct;
  nutrition: ComputedNutrition;
}

type MetricMode = 'energy' | 'mass';

interface MacroSlice {
  name: string;
  key: 'protein' | 'carbs' | 'fat';
  grams: number;
  kcal: number;
  energyPct: number;
  massPct: number;
  colorLight: string;
  colorDark: string;
  factor: string;
  role: string;
}

export function MacroPieChart({ product, nutrition }: MacroPieChartProps) {
  const [metricMode, setMetricMode] = useState<MetricMode>('energy');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains('dark'));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const macroData: MacroSlice[] = useMemo(() => {
    const proteinKcal = nutrition.proteinG * 4;
    const carbsKcal = nutrition.carbsG * 4;
    const fatKcal = nutrition.fatG * 9;
    const totalMacroG = Math.max(1, nutrition.proteinG + nutrition.carbsG + nutrition.fatG);

    return [
      {
        name: 'Białko',
        key: 'protein',
        grams: nutrition.proteinG,
        kcal: proteinKcal,
        energyPct: nutrition.proteinPct,
        massPct: Math.round((nutrition.proteinG / totalMacroG) * 100),
        colorLight: '#4E5B3A',
        colorDark: '#9BB575',
        factor: '4 kcal/g',
        role: 'Regeneracja powysiłkowa i ochrona masy mięśniowej w marszu',
      },
      {
        name: 'Węglowodany',
        key: 'carbs',
        grams: nutrition.carbsG,
        kcal: carbsKcal,
        energyPct: nutrition.carbsPct,
        massPct: Math.round((nutrition.carbsG / totalMacroG) * 100),
        colorLight: '#23241F',
        colorDark: '#EDE8DC',
        factor: '4 kcal/g',
        role: 'Główne paliwo glikogenowe i bieżąca wydolność anaerobowa',
      },
      {
        name: 'Tłuszcze',
        key: 'fat',
        grams: nutrition.fatG,
        kcal: fatKcal,
        energyPct: nutrition.fatPct,
        massPct: Math.round((nutrition.fatG / totalMacroG) * 100),
        colorLight: '#14B8A6',
        colorDark: '#14B8A6',
        factor: '9 kcal/g',
        role: 'Skoncentrowana rezerwa energii i termogeneza w niskich temperaturach',
      },
    ];
  }, [nutrition]);

  const totalMacroGrams = nutrition.proteinG + nutrition.carbsG + nutrition.fatG;
  const totalMacroKcal = nutrition.proteinG * 4 + nutrition.carbsG * 4 + nutrition.fatG * 9;

  const chartData = useMemo(() => {
    return macroData.map((m) => ({
      ...m,
      value: metricMode === 'energy' ? m.energyPct : m.grams,
    }));
  }, [macroData, metricMode]);

  const activeSlice = activeIndex !== null ? macroData[activeIndex] : null;

  return (
    <section
      aria-label="Podział makroskładników racji (Recharts)"
      className="mt-14 border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 pt-12"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <RevealHeading>
          <div>
            <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
              STRUKTURA MAKROSKŁADNIKÓW · WYKRES KOŁOWY RECHARTS
            </p>
            <h2 className="font-condensed mt-1.5 text-2xl sm:text-3xl font-bold leading-tight text-[#23241F] dark:text-[#EDE8DC] [text-wrap:balance]">
              Wizualizacja bilansu białek, węglowodanów i tłuszczów
            </h2>
          </div>
        </RevealHeading>

        {/* Metric mode toggle */}
        <div className="flex border border-[#23241F]/25 dark:border-[#EDE8DC]/25 p-0.5 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setMetricMode('energy')}
            className={`min-h-[34px] px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
              metricMode === 'energy'
                ? 'bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                : 'text-[#23241F] dark:text-[#EDE8DC]/85 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10'
            }`}
          >
            Udział energii (% kcal)
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('mass')}
            className={`min-h-[34px] px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
              metricMode === 'mass'
                ? 'bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                : 'text-[#23241F] dark:text-[#EDE8DC]/85 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10'
            }`}
          >
            Masa netto (gramy)
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 border border-[#23241F] dark:border-[#EDE8DC]/25 bg-[#EDE8DC] dark:bg-[#23241F] p-6 lg:grid-cols-12 lg:items-center">
        {/* Left: Recharts Pie Chart (Donut) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[320px] h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={104}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={600}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, index) => {
                    const isSelected = activeIndex === index;
                    const fillColor = isDark ? entry.colorDark : entry.colorLight;
                    return (
                      <Cell
                        key={`cell-${entry.key}`}
                        fill={fillColor}
                        stroke={isDark ? '#23241F' : '#EDE8DC'}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="cursor-pointer transition-opacity hover:opacity-90"
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload as MacroSlice;
                    return (
                      <div className="border border-[#23241F] dark:border-[#EDE8DC] bg-[#EDE8DC] dark:bg-[#161B21] p-2.5 font-mono text-xs shadow-md">
                        <div className="font-semibold uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC]">
                          {item.name}
                        </div>
                        <div className="mt-1 text-[#23241F]/80 dark:text-[#EDE8DC]/80 tabular-nums">
                          Masa: <strong>{item.grams} g</strong> ({item.massPct}% masy)
                        </div>
                        <div className="text-[#23241F]/80 dark:text-[#EDE8DC]/80 tabular-nums">
                          Energia: <strong>{item.kcal.toLocaleString('pl-PL')} kcal</strong> ({item.energyPct}% kcal)
                        </div>
                        <div className="text-[10px] text-[#4E5B3A] dark:text-[#9BB575] mt-1">
                          Współczynnik: {item.factor}
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#23241F]/60 dark:text-[#EDE8DC]/60">
                {metricMode === 'energy' ? 'Energia makro' : 'Masa makro'}
              </span>
              <span className="font-condensed text-2xl font-bold leading-none tabular-nums text-[#23241F] dark:text-[#EDE8DC] mt-0.5">
                {metricMode === 'energy'
                  ? `${totalMacroKcal.toLocaleString('pl-PL')} kcal`
                  : `${totalMacroGrams} g`}
              </span>
              <span className="font-mono text-[10px] text-[#4E5B3A] dark:text-[#9BB575] mt-1">
                {product.portionsCount} porcji w racji
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-[#23241F]/75 dark:text-[#EDE8DC]/75">
            {macroData.map((m, idx) => (
              <button
                key={m.key}
                type="button"
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`inline-flex items-center gap-1.5 transition-opacity ${
                  activeIndex !== null && activeIndex !== idx ? 'opacity-40' : 'opacity-100'
                }`}
              >
                <span
                  className="inline-block h-2.5 w-3"
                  style={{ backgroundColor: isDark ? m.colorDark : m.colorLight }}
                />
                <span>
                  {m.name} ({metricMode === 'energy' ? `${m.energyPct}%` : `${m.grams}g`})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Macro Cards & Tactical Insights */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 pb-2.5 flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-[#4E5B3A] dark:text-[#9BB575]">
              Matematyka bilansu żywieniowego DROP 001
            </span>
            <span className="font-mono text-[11px] text-[#23241F]/60 dark:text-[#EDE8DC]/60">
              Błonnik: {nutrition.fiberG} g (niekaloryczny)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {macroData.map((m, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <div
                  key={m.key}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`border p-3 transition-colors ${
                    isSelected
                      ? 'border-[#14B8A6] bg-[#14B8A6]/10 dark:bg-[#14B8A6]/15'
                      : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#161B21]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-[#23241F] dark:text-[#EDE8DC]">
                      <span
                        className="inline-block h-2.5 w-2.5"
                        style={{ backgroundColor: isDark ? m.colorDark : m.colorLight }}
                      />
                      {m.name}
                    </div>
                    <span className="font-mono text-[10px] text-[#4E5B3A] dark:text-[#9BB575]">
                      {m.factor}
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between font-mono tabular-nums">
                    <span className="text-xl font-bold text-[#23241F] dark:text-[#EDE8DC]">
                      {m.grams} g
                    </span>
                    <span className="text-xs font-semibold text-[#4E5B3A] dark:text-[#9BB575]">
                      {m.energyPct}% kcal
                    </span>
                  </div>

                  <div className="mt-1 font-mono text-[11px] text-[#23241F]/70 dark:text-[#EDE8DC]/70 tabular-nums">
                    {m.kcal.toLocaleString('pl-PL')} kcal
                  </div>

                  <p className="mt-2 text-[11px] leading-snug text-[#23241F]/75 dark:text-[#EDE8DC]/75 line-clamp-2">
                    {m.role}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contextual military note */}
          <div className="border border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#161B21]/60 p-3 font-mono text-xs text-[#23241F]/80 dark:text-[#EDE8DC]/80">
            {activeSlice ? (
              <span>
                <strong className="uppercase text-[#23241F] dark:text-[#EDE8DC]">
                  {activeSlice.name}:
                </strong>{' '}
                {activeSlice.grams} g dostarcza {activeSlice.kcal.toLocaleString('pl-PL')} kcal (
                {activeSlice.energyPct}% łącznej energii racji). {activeSlice.role}.
              </span>
            ) : (
              <span>
                Wykres kołowy Recharts obrazuje udział makroskładników obliczonych ze składowych porcji. Najedź na wycinek lub kartę, aby przeanalizować rolę taktyczną składnika w racji {product.name}.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
