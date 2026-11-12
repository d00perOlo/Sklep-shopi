import { useState } from 'react';
import { FIELD_TESTS, PROTOTYPE_EVOLUTION } from '../data/rations';
import { RevealGridItem, RevealHeading } from './Reveal';
import { TopographicBackground } from './TopographicBackground';

interface TestingSectionProps {
  compact?: boolean;
  onOpenFullTesting?: () => void;
}

export function TestingSection({
  compact = false,
  onOpenFullTesting,
}: TestingSectionProps) {
  const [selectedStageIndex, setSelectedStageIndex] = useState(
    PROTOTYPE_EVOLUTION.length - 1
  );

  const activeStage = PROTOTYPE_EVOLUTION[selectedStageIndex];

  return (
    <>
      {/* 03. TESTED & REFINED */}
      <section
        id="tested-and-refined"
        className="relative overflow-hidden bg-[#23241F] py-16 sm:py-24 text-[#EDE8DC]"
      >
        <TopographicBackground variant="dark" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <RevealHeading>
                <p className="type-kicker text-[#14B8A6]">
                  03. TESTED &amp; REFINED
                </p>
                <h2 className="type-display-section mt-3 font-bold text-[#EDE8DC]">
                  Ewolucja od pierwszej próbki do wersji DROP 001
                </h2>
              </RevealHeading>
              <blockquote className="mt-6 border-t border-[#EDE8DC]/20 pt-5 type-mono-spec text-xs sm:text-[13px] leading-[1.7] tracking-[0.06em] text-[#EDE8DC]/90 max-w-[44ch]">
                TESTOWALIŚMY PRÓBKI.
                <br />
                ANALIZOWALIŚMY SKŁAD. LICZYLIŚMY KALORIE.
                <br />
                SPRAWDZALIŚMY SMAK, WAGĘ I PRAKTYCZNOŚĆ.
                <br />
                POPRAWIALIŚMY KAŻDY ELEMENT.
                <br />
                <span className="text-[#14B8A6]">
                  AŻ DOSZLIŚMY DO WERSJI, KTÓRĄ CHCIELIŚMY ZAPAKOWAĆ.
                </span>
              </blockquote>
              {compact && onOpenFullTesting && (
                <button
                  type="button"
                  onClick={onOpenFullTesting}
                  className="mt-6 min-h-[42px] px-5 py-2.5 border border-[#EDE8DC]/40 font-mono text-xs uppercase tracking-[0.14em] text-[#EDE8DC] hover:border-[#14B8A6] hover:text-[#14B8A6] transition-colors"
                >
                  Zobacz pełny dziennik testów
                </button>
              )}
            </div>

            <div className="lg:col-span-7">
              {/* Stage Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#EDE8DC]/20">
                {PROTOTYPE_EVOLUTION.map((stage, idx) => {
                  const isActive = idx === selectedStageIndex;
                  return (
                    <button
                      key={stage.version}
                      type="button"
                      onClick={() => setSelectedStageIndex(idx)}
                      className={`p-3.5 text-left transition-colors border-b sm:border-b-0 sm:border-r last:border-r-0 border-[#EDE8DC]/20 ${
                        isActive
                          ? 'bg-[#EDE8DC] text-[#23241F]'
                          : 'bg-[#161B21]/60 text-[#EDE8DC]/75 hover:text-[#EDE8DC]'
                      }`}
                    >
                      <div className="font-mono text-[10px] uppercase tracking-wider opacity-75">
                        {stage.date}
                      </div>
                      <div className="font-condensed mt-1 text-base font-semibold">
                        {stage.version}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Details */}
              <div className="border-x border-b border-[#EDE8DC]/20 bg-[#161B21]/75 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#EDE8DC]/15 pb-3">
                  <h3 className="font-condensed text-2xl font-semibold text-[#EDE8DC]">
                    {activeStage.title}
                  </h3>
                  <span className="font-mono text-xs text-[#14B8A6]">
                    {activeStage.version} · {activeStage.date}
                  </span>
                </div>

                <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#EDE8DC]/85">
                  {activeStage.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs text-[#14B8A6] mt-0.5 tabular-nums">
                        0{i + 1}.
                      </span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 border-t border-[#EDE8DC]/15 pt-4 font-mono text-xs text-[#EDE8DC]/75">
                  WYNIK ETAPU: <span className="text-[#EDE8DC]">{activeStage.outcome}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04. FIELD TEST */}
      <section
        id="field-test"
        className="relative overflow-hidden border-t border-transparent dark:border-[#EDE8DC]/15 bg-[#EDE8DC] dark:bg-[#161B21] py-16 sm:py-24 text-[#23241F] dark:text-[#EDE8DC] transition-colors duration-200"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <RevealHeading>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
                  04. FIELD TEST
                </p>
                <h2 className="type-display-section mt-2 font-bold text-[#23241F] dark:text-[#EDE8DC]">
                  Warunki terenowe, czas działania i zmierzona praktyczność
                </h2>
              </div>
              <p className="type-prose max-w-md text-sm text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                Zanim zatwierdziliśmy skład partii DROP 001, prototypy przeszły trzy niezależne bloki testów terenowych w niskich temperaturach i wysokiej wilgotności.
              </p>
            </div>
          </RevealHeading>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {FIELD_TESTS.map((test, index) => (
              <RevealGridItem key={test.id} index={index}>
                <article className="flex h-full flex-col justify-between border border-[#23241F]/25 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#23241F] p-6">
                <div>
                  <div className="flex items-center justify-between border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 pb-3 font-mono text-xs">
                    <span className="font-semibold text-[#4E5B3A] dark:text-[#9BB575]">{test.blockCode}</span>
                    <span className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">{test.duration}</span>
                  </div>

                  <h3 className="font-condensed mt-3 text-xl font-semibold text-[#23241F] dark:text-[#EDE8DC]">
                    {test.location}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                    Warunki: {test.conditions}
                  </p>

                  <dl className="mt-5 divide-y divide-[#23241F]/15 dark:divide-[#EDE8DC]/15 border-y border-[#23241F]/15 dark:border-[#EDE8DC]/15 font-mono text-xs tabular-nums">
                    {test.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-center justify-between gap-2 py-2.5"
                      >
                        <dt className="text-[#23241F]/70 dark:text-[#EDE8DC]/70">{metric.label}</dt>
                        <dd className="font-semibold text-[#23241F] dark:text-[#EDE8DC] whitespace-nowrap shrink-0">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#23241F]/80 dark:text-[#EDE8DC]/80">
                  {test.finding}
                </p>
              </article>
              </RevealGridItem>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
