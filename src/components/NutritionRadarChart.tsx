import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useReducedMotion } from 'motion/react';
import { ComputedNutrition, RationProduct } from '../data/rations';
import { RevealHeading } from './Reveal';

interface NutritionRadarChartProps {
  product: RationProduct;
  nutrition: ComputedNutrition;
}

type ReferenceProfile = 'standard' | 'field';
type ScopeMode = 'daily' | 'total';

interface NutrientAxis {
  key: 'carbs' | 'protein' | 'fat' | 'fiber';
  label: string;
  grams: number;
  rdiGrams: number;
  pct: number;
}

const REFERENCE_TARGETS: Record<
  ReferenceProfile,
  {
    label: string;
    subtitle: string;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
  }
> = {
  standard: {
    label: 'RWS Standard (2000 kcal)',
    subtitle: 'Referencyjna wartość spożycia dla osoby dorosłej (UE 1169/2011 + EFSA)',
    carbs: 260,
    protein: 50,
    fat: 70,
    fiber: 25,
  },
  field: {
    label: 'Teren / Marsz (3200 kcal)',
    subtitle: 'Profil zwiększonego zapotrzebowania marszowego z obciążeniem',
    carbs: 400,
    protein: 110,
    fat: 120,
    fiber: 35,
  },
};

export function NutritionRadarChart({
  product,
  nutrition,
}: NutritionRadarChartProps) {
  const isMultiDay = product.durationHours > 24;
  const [scope, setScope] = useState<ScopeMode>(isMultiDay ? 'daily' : 'total');
  const [refProfile, setRefProfile] = useState<ReferenceProfile>('standard');
  const [hoveredKey, setHoveredKey] = useState<NutrientAxis['key'] | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.classList.contains('dark'));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setScope(product.durationHours > 24 ? 'daily' : 'total');
    setHoveredKey(null);
  }, [product.id, product.durationHours]);

  const divisor = isMultiDay && scope === 'daily' ? product.durationHours / 24 : 1;
  const target = REFERENCE_TARGETS[refProfile];

  const axes: NutrientAxis[] = useMemo(() => {
    const carbsG = Math.round((nutrition.carbsG / divisor) * 10) / 10;
    const proteinG = Math.round((nutrition.proteinG / divisor) * 10) / 10;
    const fatG = Math.round((nutrition.fatG / divisor) * 10) / 10;
    const fiberG = Math.round((nutrition.fiberG / divisor) * 10) / 10;

    return [
      {
        key: 'carbs',
        label: 'Węglowodany',
        grams: carbsG,
        rdiGrams: target.carbs,
        pct: Math.round((carbsG / target.carbs) * 100),
      },
      {
        key: 'protein',
        label: 'Białko',
        grams: proteinG,
        rdiGrams: target.protein,
        pct: Math.round((proteinG / target.protein) * 100),
      },
      {
        key: 'fat',
        label: 'Tłuszcze',
        grams: fatG,
        rdiGrams: target.fat,
        pct: Math.round((fatG / target.fat) * 100),
      },
      {
        key: 'fiber',
        label: 'Błonnik',
        grams: fiberG,
        rdiGrams: target.fiber,
        pct: Math.round((fiberG / target.fiber) * 100),
      },
    ];
  }, [nutrition, divisor, target]);

  const maxPct = useMemo(() => {
    const peak = Math.max(120, ...axes.map((a) => a.pct));
    return Math.ceil(peak / 50) * 50;
  }, [axes]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const size = 400;
    const center = size / 2;
    const radius = 128;
    const levels = 4;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${size} ${size}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${center}, ${center})`);

    const angleSlice = (Math.PI * 2) / axes.length;
    const rScale = d3.scaleLinear().domain([0, maxPct]).range([0, radius]);

    const radialLine = d3
      .lineRadial<number>()
      .radius((d) => rScale(d))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const inkColor = isDark ? '#EDE8DC' : '#23241F';
    const surfaceColor = isDark ? '#23241F' : '#EDE8DC';
    const mossColor = isDark ? '#9BB575' : '#4E5B3A';
    const ringFillEven = isDark ? 'rgba(237, 232, 220, 0.04)' : 'rgba(35, 36, 31, 0.025)';

    // Concentric polygonal grid rings
    for (let level = 1; level <= levels; level++) {
      const levelValue = (maxPct / levels) * level;
      const ringValues = axes.map(() => levelValue);

      g.append('path')
        .datum(ringValues)
        .attr('d', radialLine)
        .attr('fill', level % 2 === 0 ? ringFillEven : 'none')
        .attr('stroke', inkColor)
        .attr('stroke-opacity', isDark ? 0.2 : 0.16)
        .attr('stroke-width', 1);

      g.append('text')
        .attr('x', 4)
        .attr('y', -rScale(levelValue) + 11)
        .attr('fill', inkColor)
        .attr('fill-opacity', isDark ? 0.65 : 0.55)
        .style('font-family', '"IBM Plex Mono", monospace')
        .style('font-size', '10px')
        .text(`${Math.round(levelValue)}%`);
    }

    // 100% Daily Recommended Intake reference polygon (dashed Moss)
    const rdiValues = axes.map(() => 100);
    g.append('path')
      .datum(rdiValues)
      .attr('d', radialLine)
      .attr('fill', 'none')
      .attr('stroke', mossColor)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,4');

    // Radial axes and labels
    axes.forEach((axis, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x2 = Math.cos(angle) * radius;
      const y2 = Math.sin(angle) * radius;

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x2)
        .attr('y2', y2)
        .attr('stroke', inkColor)
        .attr('stroke-opacity', isDark ? 0.25 : 0.22)
        .attr('stroke-width', 1);

      const labelRadius = radius + 24;
      const lx = Math.cos(angle) * labelRadius;
      const ly = Math.sin(angle) * labelRadius;

      const textAnchor =
        Math.abs(Math.cos(angle)) < 0.2
          ? 'middle'
          : Math.cos(angle) > 0
            ? 'start'
            : 'end';

      const dyOffset = Math.sin(angle) > 0.5 ? 10 : Math.sin(angle) < -0.5 ? -4 : 4;

      const labelGroup = g.append('g').attr('transform', `translate(${lx}, ${ly + dyOffset})`);

      labelGroup
        .append('text')
        .attr('text-anchor', textAnchor)
        .attr('fill', inkColor)
        .style('font-family', '"IBM Plex Mono", monospace')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .style('text-transform', 'uppercase')
        .text(axis.label);

      labelGroup
        .append('text')
        .attr('y', 13)
        .attr('text-anchor', textAnchor)
        .attr('fill', mossColor)
        .style('font-family', '"IBM Plex Mono", monospace')
        .style('font-size', '10px')
        .text(`${axis.pct}%`);
    });

    // Data polygon
    const dataValues = axes.map((a) => a.pct);
    const zeroValues = axes.map(() => 0);

    const dataPath = g
      .append('path')
      .datum(prefersReducedMotion ? dataValues : zeroValues)
      .attr('d', radialLine)
      .attr('fill', '#14B8A6')
      .attr('fill-opacity', isDark ? 0.28 : 0.22)
      .attr('stroke', '#14B8A6')
      .attr('stroke-width', 2);

    if (!prefersReducedMotion) {
      dataPath
        .datum(dataValues)
        .transition()
        .duration(450)
        .ease(d3.easeCubicOut)
        .attr('d', radialLine);
    }

    // Vertex nodes
    axes.forEach((axis, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = rScale(axis.pct);
      const cx = Math.cos(angle) * r;
      const cy = Math.sin(angle) * r;

      const node = g
        .append('circle')
        .attr('cx', prefersReducedMotion ? cx : 0)
        .attr('cy', prefersReducedMotion ? cy : 0)
        .attr('r', hoveredKey === axis.key ? 6 : 4.5)
        .attr('fill', hoveredKey === axis.key ? inkColor : '#14B8A6')
        .attr('stroke', surfaceColor)
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .attr('tabindex', 0)
        .attr('role', 'button')
        .attr('aria-label', `${axis.label}: ${axis.grams} g (${axis.pct}% normy)`)
        .on('mouseenter', () => setHoveredKey(axis.key))
        .on('mouseleave', () => setHoveredKey(null))
        .on('focus', () => setHoveredKey(axis.key))
        .on('blur', () => setHoveredKey(null));

      if (!prefersReducedMotion) {
        node
          .transition()
          .duration(450)
          .ease(d3.easeCubicOut)
          .attr('cx', cx)
          .attr('cy', cy);
      }
    });
  }, [axes, maxPct, hoveredKey, prefersReducedMotion, isDark]);

  const activeAxis = hoveredKey ? axes.find((a) => a.key === hoveredKey) || axes[0] : null;

  return (
    <section
      aria-label="Profil odżywczy względem dziennego zapotrzebowania"
      className="mt-14 border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 pt-12"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <RevealHeading>
          <div>
            <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
              ANALIZA PROFILU ODŻYWCZEGO · WYKRES RADAROWY D3.JS
            </p>
            <h2 className="font-condensed mt-1.5 text-2xl sm:text-3xl font-bold leading-tight text-[#23241F] dark:text-[#EDE8DC] [text-wrap:balance]">
              Pokrycie dziennego zapotrzebowania (Węglowodany · Białko · Tłuszcze · Błonnik)
            </h2>
          </div>
        </RevealHeading>

        <div className="flex flex-wrap items-center gap-2">
          {isMultiDay && (
            <div className="flex border border-[#23241F]/25 dark:border-[#EDE8DC]/25 p-0.5">
              <button
                type="button"
                onClick={() => setScope('daily')}
                className={`min-h-[34px] px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  scope === 'daily'
                    ? 'bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                    : 'text-[#23241F] dark:text-[#EDE8DC]/85 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10'
                }`}
              >
                Na dobę (24h)
              </button>
              <button
                type="button"
                onClick={() => setScope('total')}
                className={`min-h-[34px] px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  scope === 'total'
                    ? 'bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                    : 'text-[#23241F] dark:text-[#EDE8DC]/85 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10'
                }`}
              >
                Cała racja ({product.durationHours}h)
              </button>
            </div>
          )}

          <div className="flex border border-[#23241F]/25 dark:border-[#EDE8DC]/25 p-0.5">
            <button
              type="button"
              onClick={() => setRefProfile('standard')}
              className={`min-h-[34px] px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                refProfile === 'standard'
                  ? 'bg-[#4E5B3A] text-[#EDE8DC]'
                  : 'text-[#23241F] dark:text-[#EDE8DC]/85 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10'
              }`}
            >
              RWS 2000 kcal
            </button>
            <button
              type="button"
              onClick={() => setRefProfile('field')}
              className={`min-h-[34px] px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                refProfile === 'field'
                  ? 'bg-[#4E5B3A] text-[#EDE8DC]'
                  : 'text-[#23241F] dark:text-[#EDE8DC]/85 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10'
              }`}
            >
              Teren 3200 kcal
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 border border-[#23241F] dark:border-[#EDE8DC]/25 bg-[#EDE8DC] dark:bg-[#23241F] p-6 lg:grid-cols-12 lg:items-center">
        {/* Left: D3 Radar SVG */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[380px]">
            <svg
              ref={svgRef}
              className="h-auto w-full overflow-visible"
              role="img"
              aria-label={`Wykres radarowy wartości odżywczych dla ${product.name}`}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-[#23241F]/75 dark:text-[#EDE8DC]/75">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2.5 w-4 border-2 border-[#14B8A6] bg-[#14B8A6]/25" />
              Profil {product.name} ({isMultiDay && scope === 'daily' ? '24h' : 'pakiet'})
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-5 border-t-2 border-dashed border-[#4E5B3A] dark:border-[#9BB575]" />
              100% normy dziennej
            </span>
          </div>
        </div>

        {/* Right: Tabular Nutrient Reference Table */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 pb-3">
            <div className="font-mono text-xs uppercase tracking-wider text-[#4E5B3A] dark:text-[#9BB575]">
              {target.label}
            </div>
            <p className="mt-1 text-xs text-[#23241F]/75 dark:text-[#EDE8DC]/75">{target.subtitle}</p>
          </div>

          <dl className="divide-y divide-[#23241F]/15 dark:divide-[#EDE8DC]/15 border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 font-mono text-xs tabular-nums">
            {axes.map((axis) => {
              const isHighlighted = hoveredKey === axis.key;
              return (
                <div
                  key={axis.key}
                  onMouseEnter={() => setHoveredKey(axis.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  className={`flex items-center justify-between gap-4 py-3 px-2 transition-colors ${
                    isHighlighted ? 'bg-[#14B8A6]/15' : ''
                  }`}
                >
                  <div>
                    <dt className="font-semibold text-[#23241F] dark:text-[#EDE8DC] uppercase">{axis.label}</dt>
                    <dd className="mt-0.5 text-[11px] text-[#23241F]/65 dark:text-[#EDE8DC]/65">
                      Norma dzienna: {axis.rdiGrams} g
                    </dd>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#23241F] dark:text-[#EDE8DC]">{axis.grams} g</div>
                    <div
                      className={`text-[11px] font-medium ${
                        axis.pct >= 100
                          ? 'text-[#4E5B3A] dark:text-[#9BB575]'
                          : 'text-[#23241F]/70 dark:text-[#EDE8DC]/70'
                      }`}
                    >
                      {axis.pct}% normy
                    </div>
                  </div>
                </div>
              );
            })}
          </dl>

          <div className="min-h-[48px] border border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#161B21]/60 p-3 font-mono text-xs text-[#23241F]/80 dark:text-[#EDE8DC]/80">
            {activeAxis ? (
              <span>
                <strong className="uppercase text-[#23241F] dark:text-[#EDE8DC]">{activeAxis.label}:</strong>{' '}
                {activeAxis.grams} g stanowi{' '}
                <strong className="text-[#4E5B3A] dark:text-[#9BB575]">{activeAxis.pct}%</strong> dziennego celu (
                {activeAxis.rdiGrams} g) w wybranym profilu odniesienia.
              </span>
            ) : (
              <span>
                Najedź na dowolny wierzchołek wykresu lub wiersz tabeli, aby porównać makroskładnik z dziennym zapotrzebowaniem.
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
