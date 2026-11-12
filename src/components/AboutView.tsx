import { Moon, Sun } from 'lucide-react';
import { TopographicBackground } from './TopographicBackground';
import { HERO_SLIDES } from '../data/rations';

export type ThemeMode = 'day' | 'blackout';

interface AboutViewProps {
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  onGoToShop: () => void;
  onGoToTesting: () => void;
}

export function AboutView({
  themeMode,
  onChangeTheme,
  onGoToShop,
  onGoToTesting,
}: AboutViewProps) {
  const pillars = [
    {
      index: '01.',
      title: 'Zero pustych wypełniaczy',
      body: 'Nie pakujemy tanich cukrów prostych ani zbędnego powietrza. Każdy gram w saszetce ma uzasadnienie kaloryczne, białkowe lub elektrolitowe.',
    },
    {
      index: '02.',
      title: 'Gotowość w temperaturach ujemnych',
      body: 'Batony i czekolada są komponowane tak, aby nie twardniały na kamień przy -10°C. Dania retortowe można spożyć bezpośrednio bez gotowania.',
    },
    {
      index: '03.',
      title: 'Opakowania klasy barierowej',
      body: 'Matowy laminat wielowarstwowy odporny na przetarcie o skałę i zawilgocenie. Nacięcia otwierania działają pewnie w grubych rękawicach.',
    },
    {
      index: '04.',
      title: 'Przejrzysta partia DROP 001',
      body: 'Startujemy od pięciu dopracowanych modułów żywnościowych zamiast szerokiego katalogu przypadkowych przekąsek.',
    },
  ];

  return (
    <div className="relative bg-[#EDE8DC] dark:bg-[#161B21] text-[#23241F] dark:text-[#EDE8DC] pb-20 transition-colors duration-200">
      <TopographicBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
                O MARCE MILVITA · PROJEKT DROP 001
              </p>
              <h1 className="type-display-hero mt-3 font-bold text-[#23241F] dark:text-[#EDE8DC]">
                KAŻDY ELEMENT MA SWOJE ZADANIE. KAŻDA KALORIA MA ZNACZENIE.
              </h1>
              <p className="type-prose mt-6 text-base text-[#23241F]/85 dark:text-[#EDE8DC]/85">
                MILVITA powstała z prostego powodu: większość dostępnych racji przetrwania smakuje jak kompromis albo waży zbyt dużo w stosunku do oferowanej energii. Zamiast budować kolejną linię gadżetów taktycznych, zaprojektowaliśmy system żywieniowy oparty na twardej matematyce bilansu energetycznego i praktyczności w terenie.
              </p>
              <p className="mt-5 border-t border-[#23241F]/15 dark:border-[#EDE8DC]/20 pt-4 type-kicker text-[#4E5B3A] dark:text-[#14B8A6]">
                PRACUJEMY NAD TYM. MILVITA JUŻ NIEDŁUGO.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onGoToShop}
                className="min-h-[44px] px-6 py-2.5 bg-[#23241F] dark:bg-[#EDE8DC] font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#4E5B3A] dark:hover:bg-[#14B8A6] transition-colors"
              >
                Zobacz racje Drop 001
              </button>
              <button
                type="button"
                onClick={onGoToTesting}
                className="min-h-[44px] px-6 py-2.5 border border-[#23241F] dark:border-[#EDE8DC]/40 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#23241F] dark:text-[#EDE8DC] hover:bg-[#23241F]/5 dark:hover:bg-[#EDE8DC]/10 transition-colors"
              >
                Przeczytaj raport z testów
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[320px] overflow-hidden border border-[#23241F]/20 dark:border-[#EDE8DC]/20">
              <img
                src={HERO_SLIDES[2].image}
                alt={HERO_SLIDES[2].alt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Blackout / Night Operations Theme Switch Panel */}
        <section
          aria-label="Przełącznik trybu wizualnego"
          className="mt-14 border border-[#23241F] dark:border-[#EDE8DC]/25 bg-[#EDE8DC] dark:bg-[#23241F] p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="type-kicker text-[#4E5B3A] dark:text-[#14B8A6]">
                KONFIGURACJA INTERFEJSU · TRYB PRACY POLOWEJ
              </p>
              <h2 className="font-condensed mt-2 text-2xl sm:text-3xl font-bold text-[#23241F] dark:text-[#EDE8DC]">
                Tryb Dzienny / Blackout (Night Operations)
              </h2>
              <p className="type-prose mt-2 text-sm text-[#23241F]/80 dark:text-[#EDE8DC]/80">
                Przełącz cały sklep pomiędzy klasyczną estetyką papieru polowego (Bone / Charcoal) a trybem nocnym o niskim olśnieniu (Graphite #161B21 / Bone #EDE8DC) przeznaczonym do przeglądania w słabym oświetleniu.
              </p>
            </div>

            <div
              role="group"
              aria-label="Wybór motywu kolorystycznego"
              className="grid grid-cols-1 gap-2 sm:grid-cols-2 shrink-0"
            >
              <button
                type="button"
                aria-pressed={themeMode === 'day'}
                onClick={() => onChangeTheme('day')}
                className={`flex min-h-[48px] items-center justify-center gap-2.5 border px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors whitespace-nowrap shrink-0 ${
                  themeMode === 'day'
                    ? 'border-[#23241F] bg-[#23241F] text-[#EDE8DC]'
                    : 'border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-transparent text-[#23241F] dark:text-[#EDE8DC]/80 hover:border-[#23241F] dark:hover:border-[#EDE8DC]'
                }`}
              >
                <Sun className="h-4 w-4 text-[#14B8A6]" />
                <span>Dzień · Bone</span>
              </button>

              <button
                type="button"
                aria-pressed={themeMode === 'blackout'}
                onClick={() => onChangeTheme('blackout')}
                className={`flex min-h-[48px] items-center justify-center gap-2.5 border px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] transition-colors whitespace-nowrap shrink-0 ${
                  themeMode === 'blackout'
                    ? 'border-[#14B8A6] bg-[#161B21] text-[#EDE8DC]'
                    : 'border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-transparent text-[#23241F] dark:text-[#EDE8DC]/80 hover:border-[#23241F] dark:hover:border-[#EDE8DC]'
                }`}
              >
                <Moon className="h-4 w-4 text-[#14B8A6]" />
                <span>Blackout / Night Ops</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4 Engineering Principles */}
        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 pt-12 md:grid-cols-2">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="border border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#23241F] p-6"
            >
              <div className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">{pillar.index}</div>
              <h2 className="font-condensed mt-2 text-2xl font-bold leading-tight text-[#23241F] dark:text-[#EDE8DC]">
                {pillar.title}
              </h2>
              <p className="type-prose mt-2.5 text-sm text-[#23241F]/80 dark:text-[#EDE8DC]/80">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
