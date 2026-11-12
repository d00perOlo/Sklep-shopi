import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  className?: string;
}

export function AnimatedStat({ value, suffix = '', className = '' }: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    if (prefersReducedMotion || !isInView) {
      setDisplayValue(value);
      return;
    }

    const duration = 550;
    const startTime = performance.now();
    const startVal = Math.round(value * 0.65);
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startVal + (value - startVal) * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, isInView, prefersReducedMotion]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {displayValue.toLocaleString('pl-PL')}
      {suffix}
    </span>
  );
}
