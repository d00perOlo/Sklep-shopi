import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface TopographicBackgroundProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function TopographicBackground({
  className = '',
  variant = 'light',
}: TopographicBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  const baseTextColor =
    variant === 'dark'
      ? 'text-[#EDE8DC]'
      : 'text-[#23241F] dark:text-[#EDE8DC]';
  const strokeOpacity = variant === 'dark' ? 0.08 : 0.085;

  const paths = [
    'M-60,120 C140,60 280,190 480,130 C680,70 840,180 1080,110 C1280,50 1400,130 1560,90',
    'M-40,210 C180,150 310,270 520,215 C740,160 890,260 1120,195 C1320,140 1440,210 1580,175',
    'M-80,320 C120,260 290,370 500,310 C710,250 920,350 1140,290 C1340,235 1470,305 1600,270',
    'M120,40 C260,-10 380,95 540,45 C700,-5 860,85 1020,30',
    'M240,410 C420,360 560,445 760,390 C960,335 1120,430 1340,375',
  ];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${baseTextColor} ${className}`}
    >
      <svg
        viewBox="0 0 1440 460"
        preserveAspectRatio="none"
        className="h-full w-full"
        fill="none"
      >
        {paths.map((d, idx) => (
          <motion.path
            key={d}
            d={d}
            stroke={idx === 2 ? '#14B8A6' : 'currentColor'}
            strokeOpacity={idx === 2 ? 0.18 : strokeOpacity}
            strokeWidth={idx === 2 ? 1.25 : 1}
            initial={
              prefersReducedMotion
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            animate={
              isInView || prefersReducedMotion
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 1.4,
              delay: prefersReducedMotion ? 0 : idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </svg>
    </div>
  );
}
