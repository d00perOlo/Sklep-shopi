import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';
import { RevealHeading } from './Reveal';
import { TopographicBackground } from './TopographicBackground';

interface FAQItem {
  id: string;
  topic: 'TRWAŁOŚĆ' | 'PRZYGOTOWANIE' | 'UŻYCIE AWARYJNE' | 'DROP 001';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-shelf-life',
    topic: 'TRWAŁOŚĆ',
    question: 'Jaki jest okres trwałości racji MILVITA i w jakich warunkach należy je przechowywać?',
    answer:
      'Racje dobowe 24H, 48H oraz Field Kit posiadają projektowy okres przydatności do spożycia wynoszący 36 miesięcy, a pakiety awaryjne 72H Ration oraz Energy Pack — do 48 miesięcy dzięki sterylizacji retortowej i blokom kompresowanym. Zestawy należy przechowywać w suchym miejscu, w zakresie temperatur od -15°C do +30°C, z dala od długotrwałej ekspozycji powyżej +40°C.',
  },
  {
    id: 'faq-cold-prep',
    topic: 'PRZYGOTOWANIE',
    question: 'Czy dania główne wymagają gotowania lub dostępu do ognia w terenie?',
    answer:
      'Nie. Wszystkie dania główne w saszetkach retortowych są w pełni ugotowane i sterylizowane termicznie w opakowaniu. Można je zjeść bezpośrednio po otwarciu na zimno, podgrzać w naczyniu na palniku lub skorzystać z dołączonych bezpłomieniowych podgrzewaczy chemicznych FRH (w racjach 24H, 48H i 72H), które potrzebują jedynie ok. 45 ml dowolnej wody.',
  },
  {
    id: 'faq-frh-winter',
    topic: 'PRZYGOTOWANIE',
    question: 'Jak zachowuje się racja i podgrzewacz FRH przy temperaturach poniżej zera?',
    answer:
      'Podczas testów terenowych w Beskidach (-8°C) batony owsiano-miodowe oraz czekolada 70% zachowały strukturę umożliwiającą gryzienie bez nadmiernego twardnienia. Reakcja chemiczna podgrzewacza FRH startuje również w niskich temperaturach (ok. 9 minut do osiągnięcia pełnej temperatury posiłku przy -6°C), o ile użyta woda jest w stanie ciekłym.',
  },
  {
    id: 'faq-water',
    topic: 'PRZYGOTOWANIE',
    question: 'Ile wody potrzeba do wykorzystania wszystkich elementów jednej racji?',
    answer:
      'Dania retortowe nie wymagają dolewania wody do samego jedzenia. Woda jest potrzebna wyłącznie do rozpuszczenia napojów izotonicznych, kawy/herbaty oraz aktywacji podgrzewacza FRH (łącznie ok. 500 ml na dobę w racji 24H i Field Kit). Racja 48H zawiera dodatkowo 4 tabletki do uzdatniania wody (NaDCC na 4 litry), a 72H — 10 tabletek (na 10 litrów).',
  },
  {
    id: 'faq-emergency',
    topic: 'UŻYCIE AWARYJNE',
    question: 'Który zestaw wybrać do plecaka ewakuacyjnego (BOB), a który na jednodniowy wyjazd?',
    answer:
      'Do plecaka ewakuacyjnego lub bagażnika samochodu na krótkie zabezpieczenie kryzysowe optymalnym wyborem jest MILVITA 24H RATION lub MILVITA 72H RATION w wodoodpornej skrzynce odpornej na zgniecenie. Na jednodniowe wyjścia górskie i bikepacking zaprojektowano lżejszy MILVITA FIELD KIT (840 g brutto), a jako rezerwę do kieszeni kurtki — MILVITA ENERGY PACK (320 g, 1447 kcal).',
  },
  {
    id: 'faq-packaging',
    topic: 'UŻYCIE AWARYJNE',
    question: 'Czy opakowania są odporne na deszcz, zalanie i otwieranie w rękawicach?',
    answer:
      'Zewnętrzne opakowania oraz saszetki posiłków wykonano z wielowarstwowego laminatu barierowego AL/PE o podwyższonej odporności na przebicie i wilgoć. W wersji V3 przeprojektowano nacięcia łatwego otwierania (tear-notch), aby można było otworzyć każdy komponent w grubych rękawicach zimowych bez użycia noża.',
  },
  {
    id: 'faq-nutrition',
    topic: 'DROP 001',
    question: 'Skąd pochodzą wartości kaloryczne i makroskładniki podane przy produktach?',
    answer:
      'Wszystkie dane energetyczne (kcal i kJ), białko, węglowodany, tłuszcze oraz błonnik zostały wyliczone spójnie z receptur i gramatury poszczególnych komponentów zgodnie ze współczynnikami Atwatera. Dla partii prototypowej DROP 001 mają one charakter ilustracyjny przed finalną certyfikacją laboratoryjną.',
  },
  {
    id: 'faq-drop-shipping',
    topic: 'DROP 001',
    question: 'Jak działają zamówienia i kiedy rusza wysyłka partii DROP 001?',
    answer:
      'Zamówienia składane przez koszyk i kasę Shopify rezerwują wybrane zestawy w ograniczonej serii produkcyjnej DROP 001. Zamówienia powyżej 250 PLN objęte są darmową dostawą (Paczkomat InPost lub kurier). Aktualny postęp partii premierowej można śledzić, zapisując się na listę powiadomień NEXT DROP poniżej.',
  },
];

export function FAQSection() {
  const [openIds, setOpenIds] = useState<string[]>(['faq-shelf-life']);
  const [topicFilter, setTopicFilter] = useState<string>('WSZYSTKIE');
  const prefersReducedMotion = useReducedMotion();

  const topics = ['WSZYSTKIE', 'TRWAŁOŚĆ', 'PRZYGOTOWANIE', 'UŻYCIE AWARYJNE', 'DROP 001'];

  const visibleItems =
    topicFilter === 'WSZYSTKIE'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.topic === topicFilter);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allVisibleOpen =
    visibleItems.length > 0 && visibleItems.every((item) => openIds.includes(item.id));

  const toggleAllVisible = () => {
    if (allVisibleOpen) {
      const visibleSet = new Set(visibleItems.map((i) => i.id));
      setOpenIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      setOpenIds((prev) => Array.from(new Set([...prev, ...visibleItems.map((i) => i.id)])));
    }
  };

  return (
    <section
      id="faq-section"
      className="relative overflow-hidden border-t border-[#23241F]/15 dark:border-[#EDE8DC]/15 bg-[#EDE8DC] dark:bg-[#161B21] py-16 sm:py-24 text-[#23241F] dark:text-[#EDE8DC] transition-colors duration-200"
    >
      <TopographicBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-5 border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 pb-6 md:flex-row md:items-end md:justify-between">
          <RevealHeading>
            <div>
              <p className="type-kicker text-[#4E5B3A] dark:text-[#9BB575]">
                05. PYTANIA TECHNICZNE I FAQ
              </p>
              <h2 className="type-display-section mt-2 font-bold text-[#23241F] dark:text-[#EDE8DC]">
                Trwałość, przygotowanie w terenie i użycie awaryjne
              </h2>
            </div>
          </RevealHeading>

          <button
            type="button"
            onClick={toggleAllVisible}
            className="self-start md:self-auto min-h-[38px] px-4 py-1.5 border border-[#23241F]/30 dark:border-[#EDE8DC]/30 font-mono text-xs uppercase tracking-wider text-[#23241F] dark:text-[#EDE8DC] hover:border-[#23241F] dark:hover:border-[#EDE8DC] transition-colors whitespace-nowrap shrink-0"
          >
            {allVisibleOpen ? 'Zwiń wszystkie' : 'Rozwiń wszystkie'}
          </button>
        </div>

        {/* Topic Filter Tabs */}
        <div className="mt-6 flex flex-wrap gap-1.5">
          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setTopicFilter(topic)}
              className={`min-h-[36px] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider border transition-colors whitespace-nowrap shrink-0 ${
                topicFilter === topic
                  ? 'border-[#23241F] dark:border-[#EDE8DC] bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                  : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-transparent text-[#23241F] dark:text-[#EDE8DC]/80 hover:border-[#23241F] dark:hover:border-[#EDE8DC]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="mt-6 divide-y divide-[#23241F]/20 dark:divide-[#EDE8DC]/15 border-y border-[#23241F] dark:border-[#EDE8DC]/25">
          {visibleItems.map((item, index) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div key={item.id} className="bg-[#EDE8DC]/85 dark:bg-[#161B21]/90">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => toggleItem(item.id)}
                  className="flex w-full items-start justify-between gap-4 py-5 px-2 sm:px-4 text-left transition-colors hover:bg-[#23241F]/[0.03] dark:hover:bg-[#EDE8DC]/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#4E5B3A] dark:text-[#9BB575]">
                      <span className="tabular-nums">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.topic}</span>
                    </div>
                    <span className="font-condensed mt-1 block text-xl sm:text-2xl font-semibold text-[#23241F] dark:text-[#EDE8DC]">
                      {item.question}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center border transition-colors ${
                      isOpen
                        ? 'border-[#23241F] dark:border-[#14B8A6] bg-[#23241F] text-[#14B8A6]'
                        : 'border-[#23241F]/30 dark:border-[#EDE8DC]/30 text-[#23241F] dark:text-[#EDE8DC]'
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.id}`}
                      initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={
                        prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }
                      }
                      exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-5 sm:px-4 sm:pr-14">
                        <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-[#23241F]/80 dark:text-[#EDE8DC]/85">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
