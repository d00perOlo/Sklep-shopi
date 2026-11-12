import { FormEvent, useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { computeRationNutrition, RationProduct } from '../data/rations';

function RollingNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState<number>(value);
  const currentRef = useRef<number>(value);

  useEffect(() => {
    const startValue = currentRef.current;
    if (prefersReducedMotion || startValue === value) {
      currentRef.current = value;
      setDisplayValue(value);
      return;
    }

    const controls = animate(startValue, value, {
      duration: 0.42,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const rounded = Math.round(latest);
        currentRef.current = rounded;
        setDisplayValue(rounded);
      },
      onComplete: () => {
        currentRef.current = value;
        setDisplayValue(value);
      },
    });

    return () => controls.stop();
  }, [value, prefersReducedMotion]);

  return (
    <span className="tabular-nums">
      {displayValue.toLocaleString('pl-PL')}
      {suffix}
    </span>
  );
}

export interface CartItem {
  product: RationProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrder {
  orderNumber: string;
  shopifyCheckoutId: string;
  totalPln: number;
  shippingPln: number;
  subtotalPln: number;
  customer: {
    fullName: string;
    email: string;
  };
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'inpost' | 'courier' | 'pickup'>('inpost');
  const [loadLimitKg, setLoadLimitKg] = useState<number>(10);

  if (!isOpen) return null;

  const subtotalPln = items.reduce(
    (sum, item) => sum + item.product.pricePln * item.quantity,
    0
  );

  const totalKcal = items.reduce((sum, item) => {
    const nut = computeRationNutrition(item.product);
    return sum + nut.kcal * item.quantity;
  }, 0);

  const totalKj = items.reduce((sum, item) => {
    const nut = computeRationNutrition(item.product);
    return sum + nut.kj * item.quantity;
  }, 0);

  const totalWeightG = items.reduce((sum, item) => {
    const nut = computeRationNutrition(item.product);
    return sum + nut.grossWeightG * item.quantity;
  }, 0);

  const totalWeightKg = totalWeightG / 1000;
  const isOverLoadLimit = totalWeightKg > loadLimitKg;
  const overweightKg = Math.max(0, totalWeightKg - loadLimitKg);
  const loadProgressPct = Math.min(100, Math.round((totalWeightKg / loadLimitKg) * 100));
  const kcalPerKg = totalWeightKg > 0 ? Math.round(totalKcal / totalWeightKg) : 0;

  const freeShippingThreshold = 250;
  const shippingCost =
    shippingMethod === 'pickup'
      ? 0
      : subtotalPln >= freeShippingThreshold
        ? 0
        : shippingMethod === 'courier'
          ? 22
          : 16;

  const totalPln = subtotalPln + shippingCost;
  const freeShippingProgress = Math.min(100, Math.round((subtotalPln / freeShippingThreshold) * 100));

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/shopify/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { fullName, email, phone, address, city, postalCode },
          shippingMethod,
          items: items.map((item) => ({
            variantId: item.product.shopifyVariantId,
            sku: item.product.sku,
            title: item.product.name,
            quantity: item.quantity,
            unitPricePln: item.product.pricePln,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Wystąpił błąd podczas finalizacji zamówienia.');
        setSubmitting(false);
        return;
      }
      setConfirmedOrder(data);
      setStep('confirmed');
      onClearCart();
    } catch {
      setErrorMsg('Brak połączenia z bramką Shopify Checkout.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetClose = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#161B21]/75 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Koszyk i kasa Shopify MILVITA"
    >
      <div className="flex h-full w-full max-w-lg flex-col border-l border-[#23241F]/25 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#161B21] text-[#23241F] dark:text-[#EDE8DC]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#23241F]/20 dark:border-[#EDE8DC]/20 px-5 py-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Wróć do koszyka"
                className="p-1.5 hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h2 className="font-condensed text-xl font-semibold uppercase tracking-tight">
                {step === 'cart'
                  ? 'Twój koszyk'
                  : step === 'checkout'
                    ? 'Shopify Checkout — Drop 001'
                    : 'Zamówienie potwierdzone'}
              </h2>
              <p className="font-mono text-[11px] text-[#23241F]/65 dark:text-[#EDE8DC]/65">
                MILVITA / STOREFRONT CHECKOUT
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetClose}
            aria-label="Zamknij koszyk"
            className="flex h-10 w-10 items-center justify-center border border-[#23241F]/20 dark:border-[#EDE8DC]/25 hover:border-[#23241F] dark:hover:border-[#EDE8DC]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag className="h-10 w-10 text-[#23241F]/35 dark:text-[#EDE8DC]/35" />
                  <p className="font-condensed mt-4 text-2xl font-semibold">
                    Koszyk jest pusty
                  </p>
                  <p className="mt-1.5 max-w-xs text-sm text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                    Wybierz rację 24H, 48H, 72H lub pakiet terenowy z kolekcji Drop 001.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cumulative Kcal Live Counter */}
                  <div
                    aria-live="polite"
                    className="border border-[#23241F] dark:border-[#EDE8DC]/25 bg-[#23241F] dark:bg-[#23241F] p-3.5 text-[#EDE8DC]"
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#14B8A6]">
                      <span className="inline-flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 shrink-0" />
                        Cumulative Kcal
                      </span>
                      <span className="text-[#EDE8DC]/70 tabular-nums">
                        <RollingNumber value={totalKj} suffix=" kJ" />
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between gap-3">
                      <div className="font-condensed text-3xl font-bold leading-none tracking-[-0.02em] text-[#EDE8DC]">
                        <RollingNumber value={totalKcal} suffix=" kcal" />
                      </div>
                      <span className="font-mono text-[11px] text-[#EDE8DC]/75 tabular-nums">
                        ~{(totalKcal / 3200).toFixed(1)} doby marszu (3200 kcal/d)
                      </span>
                    </div>
                  </div>

                  {/* Free shipping progress */}
                  <div className="border border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#23241F] p-3">
                    <div className="flex justify-between font-mono text-[11px]">
                      <span>
                        {subtotalPln >= freeShippingThreshold
                          ? 'Darmowa dostawa odblokowana'
                          : `Do darmowej dostawy brakuje ${freeShippingThreshold - subtotalPln} PLN`}
                      </span>
                      <span className="tabular-nums">{freeShippingProgress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-[#23241F]/15 dark:bg-[#EDE8DC]/15">
                      <div
                        style={{ width: `${freeShippingProgress}%` }}
                        className="h-full bg-[#14B8A6] transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Field Load Limit Meter & Overload Warning */}
                  <div
                    role={isOverLoadLimit ? 'alert' : undefined}
                    className={`border p-3 transition-colors ${
                      isOverLoadLimit
                        ? 'border-amber-700/70 bg-amber-500/12 text-amber-950 dark:border-amber-400/60 dark:bg-amber-500/15 dark:text-amber-100'
                        : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#23241F]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider">
                        {isOverLoadLimit && (
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-400" />
                        )}
                        {isOverLoadLimit
                          ? `Przekroczono limit obciążenia (+${overweightKg.toFixed(2)} kg)`
                          : 'Limit obciążenia polowego'}
                      </span>

                      <div className="flex items-center gap-1">
                        {[6, 10, 15].map((limit) => (
                          <button
                            key={limit}
                            type="button"
                            onClick={() => setLoadLimitKg(limit)}
                            className={`px-1.5 py-0.5 text-[10px] border transition-colors ${
                              loadLimitKg === limit
                                ? 'border-[#23241F] dark:border-[#EDE8DC] bg-[#23241F] dark:bg-[#EDE8DC] text-[#EDE8DC] dark:text-[#161B21]'
                                : 'border-[#23241F]/25 dark:border-[#EDE8DC]/25 opacity-75 hover:opacity-100'
                            }`}
                          >
                            {limit} kg
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between font-mono text-[11px] tabular-nums">
                      <span>
                        Masa pakietów: <strong>{totalWeightKg.toFixed(2)} kg</strong> / {loadLimitKg}.00 kg
                      </span>
                      <span className="opacity-80">
                        {kcalPerKg.toLocaleString('pl-PL')} kcal/kg
                      </span>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full bg-[#23241F]/15 dark:bg-[#EDE8DC]/15">
                      <div
                        style={{ width: `${loadProgressPct}%` }}
                        className={`h-full transition-all duration-300 ${
                          isOverLoadLimit
                            ? 'bg-amber-600 dark:bg-amber-400'
                            : 'bg-[#4E5B3A] dark:bg-[#9BB575]'
                        }`}
                      />
                    </div>

                    {isOverLoadLimit && (
                      <p className="mt-2 text-xs leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                        Ładunek żywności przekracza wybrany limit marszowy ({loadLimitKg} kg). Zmniejsz liczbę racji lub zastąp część zapasu lżejszym modułem FIELD KIT / ENERGY PACK, aby zoptymalizować wagę ekwipunku.
                      </p>
                    )}
                  </div>

                  {/* Line items */}
                  <ul className="divide-y divide-[#23241F]/15 dark:divide-[#EDE8DC]/15 border-y border-[#23241F]/15 dark:border-[#EDE8DC]/15">
                    {items.map(({ product, quantity }) => {
                      const nut = computeRationNutrition(product);
                      return (
                        <li key={product.id} className="flex gap-4 py-4">
                          <img
                            src={product.outdoorImage}
                            alt={product.outdoorAlt}
                            referrerPolicy="no-referrer"
                            className="h-20 w-24 shrink-0 border border-[#23241F]/15 dark:border-[#EDE8DC]/20 object-cover"
                          />
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="font-condensed text-lg font-semibold truncate">
                                  {product.name}
                                </h3>
                                <p className="font-mono text-[11px] text-[#23241F]/65 dark:text-[#EDE8DC]/65 tabular-nums">
                                  {product.sku} · {(nut.kcal * quantity).toLocaleString('pl-PL')} kcal ·{' '}
                                  {((nut.grossWeightG * quantity) / 1000).toFixed(2)} kg
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(product.id)}
                                aria-label={`Usuń ${product.name}`}
                                className="p-1 text-[#23241F]/50 dark:text-[#EDE8DC]/50 hover:text-[#23241F] dark:hover:text-[#EDE8DC]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center border border-[#23241F]/30 dark:border-[#EDE8DC]/25">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                                  aria-label="Zmniejsz ilość"
                                  className="flex h-8 w-8 items-center justify-center hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums">
                                  {quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                                  aria-label="Zwiększ ilość"
                                  className="flex h-8 w-8 items-center justify-center hover:bg-[#23241F]/10 dark:hover:bg-[#EDE8DC]/10"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <span className="font-mono text-sm font-semibold tabular-nums">
                                {(product.pricePln * quantity).toLocaleString('pl-PL')} PLN
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="shopify-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div
                className={`border p-3 font-mono text-xs tabular-nums ${
                  isOverLoadLimit
                    ? 'border-amber-700/70 bg-amber-500/12 text-amber-950 dark:border-amber-400/60 dark:bg-amber-500/15 dark:text-amber-100'
                    : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#23241F]/5 dark:bg-[#23241F]'
                }`}
              >
                <div className="flex justify-between">
                  <span>Cumulative Kcal w zamówieniu</span>
                  <span className="font-semibold">
                    <RollingNumber value={totalKcal} suffix=" kcal" />
                  </span>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>Masa całkowita przesyłki</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    {isOverLoadLimit && (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                    )}
                    {totalWeightKg.toFixed(2)} kg
                  </span>
                </div>
                {isOverLoadLimit && (
                  <p className="mt-2 border-t border-amber-700/25 dark:border-amber-400/25 pt-2 text-[11px]">
                    Uwaga: przekroczono limit obciążenia polowego {loadLimitKg} kg o {overweightKg.toFixed(2)} kg.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                  Imię i nazwisko *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jan Kowalski"
                  className="mt-1 w-full min-h-[42px] border border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-white/60 dark:bg-[#23241F] px-3 py-2 text-sm text-[#23241F] dark:text-[#EDE8DC] placeholder:text-[#23241F]/40 dark:placeholder:text-[#EDE8DC]/40 focus:border-[#14B8A6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jan@domena.pl"
                    className="mt-1 w-full min-h-[42px] border border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-white/60 dark:bg-[#23241F] px-3 py-2 text-sm text-[#23241F] dark:text-[#EDE8DC] placeholder:text-[#23241F]/40 dark:placeholder:text-[#EDE8DC]/40 focus:border-[#14B8A6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 600 000 000"
                    className="mt-1 w-full min-h-[42px] border border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-white/60 dark:bg-[#23241F] px-3 py-2 text-sm text-[#23241F] dark:text-[#EDE8DC] placeholder:text-[#23241F]/40 dark:placeholder:text-[#EDE8DC]/40 focus:border-[#14B8A6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                  Adres dostawy lub kod Paczkomatu *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ul. Leśna 14/2 lub Paczkomat KRA01M"
                  className="mt-1 w-full min-h-[42px] border border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-white/60 dark:bg-[#23241F] px-3 py-2 text-sm text-[#23241F] dark:text-[#EDE8DC] placeholder:text-[#23241F]/40 dark:placeholder:text-[#EDE8DC]/40 focus:border-[#14B8A6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                    Kod pocztowy *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="30-001"
                    className="mt-1 w-full min-h-[42px] border border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-white/60 dark:bg-[#23241F] px-3 py-2 text-sm text-[#23241F] dark:text-[#EDE8DC] placeholder:text-[#23241F]/40 dark:placeholder:text-[#EDE8DC]/40 focus:border-[#14B8A6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                    Miasto *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kraków"
                    className="mt-1 w-full min-h-[42px] border border-[#23241F]/30 dark:border-[#EDE8DC]/25 bg-white/60 dark:bg-[#23241F] px-3 py-2 text-sm text-[#23241F] dark:text-[#EDE8DC] placeholder:text-[#23241F]/40 dark:placeholder:text-[#EDE8DC]/40 focus:border-[#14B8A6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-[#23241F]/75 dark:text-[#EDE8DC]/75">
                  Metoda dostawy
                </span>
                <div className="mt-1.5 space-y-2">
                  {[
                    {
                      id: 'inpost',
                      label: 'Paczkomat InPost 24/7',
                      price: subtotalPln >= freeShippingThreshold ? '0 PLN' : '16 PLN',
                    },
                    {
                      id: 'courier',
                      label: 'Kurier DPD / DHL',
                      price: subtotalPln >= freeShippingThreshold ? '0 PLN' : '22 PLN',
                    },
                    {
                      id: 'pickup',
                      label: 'Odbiór w punkcie pakowania (Kraków)',
                      price: '0 PLN',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-center justify-between border px-3 py-2.5 text-xs ${
                        shippingMethod === opt.id
                          ? 'border-[#23241F] dark:border-[#EDE8DC] bg-[#23241F]/5 dark:bg-[#23241F] font-medium'
                          : 'border-[#23241F]/20 dark:border-[#EDE8DC]/20'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === opt.id}
                          onChange={() =>
                            setShippingMethod(opt.id as 'inpost' | 'courier' | 'pickup')
                          }
                        />
                        {opt.label}
                      </span>
                      <span className="font-mono tabular-nums">{opt.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="border border-red-700/40 bg-red-100 dark:bg-red-950/60 dark:text-red-200 p-3 font-mono text-xs text-red-900">
                  {errorMsg}
                </div>
              )}
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="space-y-5 py-6">
              <div className="flex items-center gap-3 text-[#4E5B3A] dark:text-[#9BB575]">
                <CheckCircle2 className="h-8 w-8 shrink-0 text-[#14B8A6]" />
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[#4E5B3A] dark:text-[#9BB575]">
                    ZAMÓWIENIE PRZYJĘTE DO REALIZACJI
                  </p>
                  <h3 className="font-condensed text-2xl font-bold text-[#23241F] dark:text-[#EDE8DC]">
                    Numer #{confirmedOrder.orderNumber}
                  </h3>
                </div>
              </div>

              <div className="border border-[#23241F] dark:border-[#EDE8DC]/25 bg-transparent dark:bg-[#23241F] p-4 font-mono text-xs space-y-2 tabular-nums">
                <div className="flex justify-between">
                  <span className="text-[#23241F]/65 dark:text-[#EDE8DC]/65">Shopify Checkout ID</span>
                  <span className="truncate max-w-[200px]">{confirmedOrder.shopifyCheckoutId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#23241F]/65 dark:text-[#EDE8DC]/65">Odbiorca</span>
                  <span>{confirmedOrder.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#23241F]/65 dark:text-[#EDE8DC]/65">Potwierdzenie wysłano na</span>
                  <span>{confirmedOrder.customer.email}</span>
                </div>
                <div className="flex justify-between border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 pt-2 font-semibold">
                  <span>Suma końcowa</span>
                  <span>{confirmedOrder.totalPln} PLN</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#23241F]/80 dark:text-[#EDE8DC]/80">
                Dziękujemy za rezerwację w partii premierowej DROP 001. Gdy partia zejdzie z linii pakowania, wyślemy numer śledzenia przesyłki.
              </p>

              <button
                type="button"
                onClick={handleResetClose}
                className="min-h-[44px] w-full bg-[#23241F] dark:bg-[#EDE8DC] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#4E5B3A] dark:hover:bg-[#14B8A6]"
              >
                Wróć do sklepu MILVITA
              </button>
            </div>
          )}
        </div>

        {/* Footer Totals & CTA */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 bg-[#EDE8DC] dark:bg-[#161B21] px-5 py-4 space-y-3">
            <div className="space-y-1 font-mono text-xs tabular-nums">
              <div className="flex justify-between text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                <span>Cumulative Kcal (bilans koszyka)</span>
                <span className="font-medium text-[#23241F] dark:text-[#EDE8DC]">
                  <RollingNumber value={totalKcal} suffix=" kcal" />
                </span>
              </div>
              <div
                className={`flex justify-between ${
                  isOverLoadLimit
                    ? 'font-medium text-amber-800 dark:text-amber-300'
                    : 'text-[#23241F]/70 dark:text-[#EDE8DC]/70'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {isOverLoadLimit && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
                  Masa łączna (limit {loadLimitKg} kg)
                </span>
                <span>
                  {totalWeightKg.toFixed(2)} kg
                  {isOverLoadLimit ? ` (+${overweightKg.toFixed(2)} kg)` : ''}
                </span>
              </div>
              {step === 'checkout' && (
                <div className="flex justify-between text-[#23241F]/70 dark:text-[#EDE8DC]/70">
                  <span>Dostawa</span>
                  <span>{shippingCost === 0 ? '0 PLN (Darmowa)' : `${shippingCost} PLN`}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#23241F]/20 dark:border-[#EDE8DC]/20 pt-2 text-sm font-semibold text-[#23241F] dark:text-[#EDE8DC]">
                <span>{step === 'cart' ? 'Suma częściowa' : 'Do zapłaty'}</span>
                <span>
                  {(step === 'cart' ? subtotalPln : totalPln).toLocaleString('pl-PL')} PLN
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="min-h-[46px] w-full bg-[#23241F] dark:bg-[#EDE8DC] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#EDE8DC] dark:text-[#161B21] hover:bg-[#14B8A6] hover:text-[#161B21] transition-colors"
              >
                Przejdź do kasy Shopify
              </button>
            ) : (
              <button
                type="submit"
                form="shopify-checkout-form"
                disabled={submitting}
                className="min-h-[46px] w-full bg-[#14B8A6] font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#161B21] hover:bg-[#23241F] hover:text-[#EDE8DC] dark:hover:bg-[#EDE8DC] dark:hover:text-[#161B21] transition-colors disabled:opacity-60"
              >
                {submitting ? 'Autoryzacja zamówienia...' : `Złóż zamówienie (${totalPln} PLN)`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
