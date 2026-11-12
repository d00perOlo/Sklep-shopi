import { FormEvent, useState } from 'react';
import { Check } from 'lucide-react';
import { RevealHeading } from './Reveal';

export function NextDropSignup() {
  const [email, setEmail] = useState('');
  const [focus, setFocus] = useState('DROP 001 — PEŁNA OFERTA');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, focus }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Nie udało się zapisać adresu.');
        return;
      }
      setStatus('success');
      setMessage(data.message || 'Zapisano na listę NEXT DROP.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Błąd połączenia z serwerem. Spróbuj ponownie.');
    }
  };

  return (
    <section
      id="next-drop-section"
      className="border-t border-[#23241F]/20 bg-[#161B21] py-16 sm:py-24 text-[#EDE8DC]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <RevealHeading>
              <p className="type-kicker text-[#14B8A6]">
                06. NEXT DROP / POWIADOMIENIA PRODUKCYJNE
              </p>
              <h2 className="type-display-section mt-3 font-bold text-[#EDE8DC]">
                PRACUJEMY NAD TYM. MILVITA JUŻ NIEDŁUGO.
              </h2>
              <p className="type-prose-dark mt-4 max-w-lg text-sm text-[#EDE8DC]/80">
                Pierwsza partia produkcyjna DROP 001 trafia do pakowania w ograniczonej liczbie zestawów. Zostaw adres e-mail, aby otrzymać bezpośredni link do otwarcia sprzedaży w sklepie Shopify.
              </p>
            </RevealHeading>
          </div>

          <div className="lg:col-span-6 border border-[#EDE8DC]/20 bg-[#23241F] p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="next-drop-focus"
                  className="block font-mono text-[11px] uppercase tracking-wider text-[#EDE8DC]/70"
                >
                  Interesujący Cię wariant
                </label>
                <select
                  id="next-drop-focus"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="mt-1.5 w-full min-h-[44px] border border-[#EDE8DC]/25 bg-[#161B21] px-3.5 py-2.5 font-mono text-xs text-[#EDE8DC] focus:border-[#14B8A6] focus:outline-none"
                >
                  <option value="DROP 001 — PEŁNA OFERTA">DROP 001 — Pełna oferta racji</option>
                  <option value="MILVITA 24H RATION">MILVITA 24H RATION</option>
                  <option value="MILVITA 48H RATION">MILVITA 48H RATION</option>
                  <option value="MILVITA 72H RATION">MILVITA 72H RATION</option>
                  <option value="MILVITA ENERGY PACK & FIELD KIT">ENERGY PACK + FIELD KIT</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="next-drop-email"
                  className="block font-mono text-[11px] uppercase tracking-wider text-[#EDE8DC]/70"
                >
                  Adres e-mail do powiadomienia
                </label>
                <div className="mt-1.5 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="next-drop-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj@adres.pl"
                    className="min-h-[44px] flex-1 border border-[#EDE8DC]/25 bg-[#161B21] px-3.5 py-2.5 font-mono text-sm text-[#EDE8DC] placeholder:text-[#EDE8DC]/35 focus:border-[#14B8A6] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="min-h-[44px] px-6 py-2.5 bg-[#14B8A6] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#161B21] hover:bg-[#EDE8DC] transition-colors disabled:opacity-60 whitespace-nowrap shrink-0"
                  >
                    {status === 'loading' ? 'Zapisywanie...' : 'Powiadom mnie'}
                  </button>
                </div>
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 border border-[#14B8A6]/40 bg-[#14B8A6]/10 p-3 font-mono text-xs text-[#14B8A6]">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="border border-red-400/40 bg-red-950/40 p-3 font-mono text-xs text-red-300">
                  {message}
                </div>
              )}

              <p className="font-mono text-[11px] text-[#EDE8DC]/50">
                Wyłącznie jedno powiadomienie przy starcie partii DROP 001. Bez spamu.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
