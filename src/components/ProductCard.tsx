import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { computeRationNutrition, RationProduct } from '../data/rations';

interface ProductCardProps {
  product: RationProduct;
  index?: number;
  onSelectProduct: (slug: string) => void;
  onAddToCart: (product: RationProduct) => void;
}

const EASE_MANUAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const cardContainerVariants: Variants = {
  hidden: {},
  visible: (cardIndex: number = 0) => ({
    transition: {
      delayChildren: Math.min(cardIndex, 5) * 0.05,
      staggerChildren: 0.055,
    },
  }),
};

const slideInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: EASE_MANUAL,
    },
  },
};

export function ProductCard({
  product,
  index = 0,
  onSelectProduct,
  onAddToCart,
}: ProductCardProps) {
  const [showCloseup, setShowCloseup] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const nutrition = computeRationNutrition(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1200);
  };

  const itemMotionProps = prefersReducedMotion ? {} : { variants: slideInUpVariants };

  return (
    <motion.article
      custom={index}
      variants={prefersReducedMotion ? undefined : cardContainerVariants}
      initial={prefersReducedMotion ? false : 'hidden'}
      whileInView={prefersReducedMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.12 }}
      className="group flex h-full flex-col border border-[#23241F]/15 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#23241F] transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      {/* Image Container: 4:3 outdoor default, hover/toggle reveals close-up contents */}
      <motion.div
        {...itemMotionProps}
        onClick={() => onSelectProduct(product.slug)}
        onMouseEnter={() => setShowCloseup(true)}
        onMouseLeave={() => setShowCloseup(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectProduct(product.slug);
          }
        }}
        aria-label={`Otwórz szczegóły produktu ${product.name}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#23241F]/10 dark:bg-[#161B21] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]"
      >
        <img
          src={product.outdoorImage}
          alt={product.outdoorAlt}
          referrerPolicy="no-referrer"
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            showCloseup ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={product.closeupImage}
          alt={product.closeupAlt}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
            showCloseup ? 'opacity-100 scale-[1.02]' : 'opacity-0 scale-100'
          }`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowCloseup((prev) => !prev);
          }}
          className="absolute bottom-2.5 right-2.5 min-h-[32px] px-2.5 py-1 bg-[#161B21]/85 text-[#EDE8DC] font-mono text-[11px] tracking-wider uppercase transition-colors hover:bg-[#14B8A6] hover:text-[#161B21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]"
        >
          {showCloseup ? 'Widok: Teren' : 'Widok: Zawartość'}
        </button>
      </motion.div>

      {/* Product Metadata & Actions */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Quiet unboxed metadata line */}
          <motion.div
            {...itemMotionProps}
            className="flex items-center justify-between gap-2 type-mono-spec text-[11px] uppercase tracking-[0.12em] text-[#23241F]/65 dark:text-[#EDE8DC]/65"
          >
            <span className="truncate">{product.shortTag}</span>
            <span className="whitespace-nowrap shrink-0 text-[#4E5B3A] dark:text-[#9BB575] font-medium">
              {product.dropStatus}
            </span>
          </motion.div>

          <motion.h3
            {...itemMotionProps}
            className="font-condensed mt-2.5 text-2xl font-bold leading-[1.04] text-[#23241F] dark:text-[#EDE8DC]"
          >
            <button
              type="button"
              onClick={() => onSelectProduct(product.slug)}
              className="text-left hover:text-[#4E5B3A] dark:hover:text-[#14B8A6] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              {product.name}
            </button>
          </motion.h3>

          <motion.p
            {...itemMotionProps}
            className="mt-2 text-sm leading-[1.58] text-[#23241F]/78 dark:text-[#EDE8DC]/78 line-clamp-2"
          >
            {product.summary}
          </motion.p>

          {/* Military spec mini-row */}
          <motion.dl
            {...itemMotionProps}
            className="mt-4 grid grid-cols-3 border-y border-[#23241F]/15 dark:border-[#EDE8DC]/15 py-2.5 type-mono-spec text-xs"
          >
            <div>
              <dt className="text-[10px] uppercase tracking-[0.1em] text-[#23241F]/55 dark:text-[#EDE8DC]/55">Energia</dt>
              <dd className="mt-0.5 font-semibold text-[#23241F] dark:text-[#EDE8DC]">
                {nutrition.kcal.toLocaleString('pl-PL')} kcal
              </dd>
            </div>
            <div className="border-x border-[#23241F]/15 dark:border-[#EDE8DC]/15 px-2.5">
              <dt className="text-[10px] uppercase tracking-[0.1em] text-[#23241F]/55 dark:text-[#EDE8DC]/55">Masa brutto</dt>
              <dd className="mt-0.5 font-semibold text-[#23241F] dark:text-[#EDE8DC]">
                {(nutrition.grossWeightG / 1000).toFixed(2)} kg
              </dd>
            </div>
            <div className="pl-2.5">
              <dt className="text-[10px] uppercase tracking-[0.1em] text-[#23241F]/55 dark:text-[#EDE8DC]/55">Porcje</dt>
              <dd className="mt-0.5 font-semibold text-[#23241F] dark:text-[#EDE8DC]">{product.portionsCount} szt.</dd>
            </div>
          </motion.dl>
        </div>

        <motion.div
          {...itemMotionProps}
          className="mt-4 flex items-center justify-between gap-3 pt-1"
        >
          <span className="font-mono text-base font-semibold tabular-nums text-[#23241F] dark:text-[#EDE8DC]">
            {product.pricePln} PLN
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectProduct(product.slug)}
              className="min-h-[40px] px-3 py-2 border border-[#23241F]/25 dark:border-[#EDE8DC]/25 text-xs font-mono font-medium uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC] hover:border-[#23241F] dark:hover:border-[#EDE8DC] transition-colors whitespace-nowrap shrink-0"
            >
              Specyfikacja
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className={`min-h-[40px] px-3.5 py-2 text-xs font-mono font-medium uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                addedFeedback
                  ? 'bg-[#14B8A6] text-[#161B21]'
                  : 'bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#4E5B3A] dark:hover:bg-[#14B8A6]'
              }`}
            >
              {addedFeedback ? 'Dodano' : 'Do koszyka'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
