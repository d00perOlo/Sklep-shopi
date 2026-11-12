import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
  className?: string;
}

const EASE_MANUAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function RevealHeading({
  children,
  delay = 0,
  yOffset = 18,
  className = '',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay, ease: EASE_MANUAL }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealGridItem({
  children,
  index = 0,
  className = '',
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const stagger = Math.min(index, 5) * 0.06;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.48, delay: stagger, ease: EASE_MANUAL }}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
