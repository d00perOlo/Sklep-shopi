import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { HERO_SLIDES } from '../data/rations';

interface HeroSlideshowProps {
  onExploreRations: () => void;
  onComingSoon: () => void;
}

export function HeroSlideshow({ onExploreRations, onComingSoon }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-label="MILVITA Survival Food — Kampania Drop 001"
      className="relative w-full h-[calc(100vh-88px)] min-h-[580px] max-h-[960px] overflow-hidden bg-[#161B21]"
    >
      {/* Background slides */}
      {HERO_SLIDES.map((slide, idx) => {
        const isCurrent = idx === activeIndex;
        return (
          <div
            key={slide.id}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isCurrent ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img
              key={`${slide.id}-${isCurrent ? 'active' : 'idle'}`}
              src={slide.image}
              alt={slide.alt}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover object-center ${
                isCurrent && !prefersReducedMotion ? 'animate-hero-zoom' : ''
              }`}
            />
          </div>
        );
      })}

      {/* Measured contrast scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-b from-[#161B21]/65 via-[#161B21]/45 to-[#161B21]/75"
      />

      {/* Instagram-stories style thin progress bars at top */}
      <div className="absolute top-4 left-4 right-4 z-20 mx-auto max-w-6xl">
        <div className="grid grid-cols-3 gap-2">
          {HERO_SLIDES.map((slide, idx) => {
            const isPast = idx < activeIndex;
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Pokaż slajd ${idx + 1}: ${slide.caption}`}
                className="group py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]"
              >
                <div className="h-[2px] w-full overflow-hidden bg-[#EDE8DC]/30">
                  {isPast && <div className="h-full w-full bg-[#EDE8DC]" />}
                  {isActive && (
                    <div
                      key={`prog-${activeIndex}`}
                      className="h-full w-full bg-[#14B8A6] animate-story-progress"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Centered minimal launch lockup (never in a side column) */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <p className="type-kicker text-[#EDE8DC]/90 tracking-[0.28em]">
          MILVITA <span className="mx-1.5 text-[#14B8A6]" aria-hidden="true">/</span> SURVIVAL FOOD
        </p>

        <div aria-hidden="true" className="mt-4 h-px w-12 bg-[#EDE8DC]/35" />

        <h1 className="type-display-hero mt-5 max-w-3xl font-bold text-[#EDE8DC]">
          KAŻDY ELEMENT MA SWOJE ZADANIE. KAŻDA KALORIA MA ZNACZENIE.
        </h1>

        <p className="type-prose-dark mt-4 max-w-lg text-sm sm:text-[15px] text-[#EDE8DC]/85">
          Gotowe do spożycia racje terenowe 24H, 48H i 72H opracowane pod kątem realnego bilansu energetycznego i masy ekwipunku.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onExploreRations}
            className="min-h-[44px] px-6 py-2.5 bg-[#EDE8DC] text-[#23241F] font-mono text-xs font-semibold tracking-[0.16em] uppercase transition-colors hover:bg-[#14B8A6] hover:text-[#161B21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] whitespace-nowrap shrink-0"
          >
            POZNAJ RACJE
          </button>
          <button
            type="button"
            onClick={onComingSoon}
            className="min-h-[44px] px-6 py-2.5 border border-[#EDE8DC]/55 bg-[#161B21]/60 text-[#EDE8DC] font-mono text-xs font-semibold tracking-[0.16em] uppercase transition-colors hover:border-[#14B8A6] hover:text-[#14B8A6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] whitespace-nowrap shrink-0"
          >
            JUŻ NIEDŁUGO
          </button>
        </div>
      </div>

      {/* Bottom quiet field caption, index & coordinates */}
      <div className="absolute bottom-5 left-4 right-4 z-20 mx-auto flex max-w-6xl items-center justify-between gap-4 border-t border-[#EDE8DC]/20 pt-3 type-mono-spec text-[11px] tracking-[0.08em] text-[#EDE8DC]/80">
        <span className="truncate">{activeSlide.caption}</span>
        <div className="flex items-center gap-4 whitespace-nowrap shrink-0">
          <span className="hidden sm:inline">{activeSlide.coordinates}</span>
          <span className="text-[#14B8A6] font-medium">
            0{activeIndex + 1} / 0{HERO_SLIDES.length}
          </span>
        </div>
      </div>
    </section>
  );
}
