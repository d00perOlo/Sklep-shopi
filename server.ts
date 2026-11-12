import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

interface NewsletterEntry {
  email: string;
  focus: string;
  createdAt: string;
}

interface OrderLineItem {
  variantId: string;
  sku: string;
  title: string;
  quantity: number;
  unitPricePln: number;
}

interface ShopifyOrderRecord {
  orderNumber: string;
  shopifyCheckoutId: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  shippingMethod: 'inpost' | 'courier' | 'pickup';
  items: OrderLineItem[];
  subtotalPln: number;
  shippingPln: number;
  totalPln: number;
  createdAt: string;
  status: string;
}

const newsletterSubscribers: NewsletterEntry[] = [];
const orders: ShopifyOrderRecord[] = [];
let orderCounter = 1041;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, brand: 'MILVITA', drop: 'DROP 001' });
});

app.post('/api/newsletter', (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const focus = typeof req.body?.focus === 'string' ? req.body.focus.trim() : 'DROP 001';

  if (!email || !email.includes('@') || !email.includes('.')) {
    res.status(400).json({ error: 'Podaj poprawny adres e-mail.' });
    return;
  }

  const existing = newsletterSubscribers.find((entry) => entry.email === email);
  if (existing) {
    res.json({
      subscribed: true,
      alreadyRegistered: true,
      message: 'Ten adres jest już wpisany na listę powiadomień NEXT DROP.',
    });
    return;
  }

  newsletterSubscribers.push({
    email,
    focus,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json({
    subscribed: true,
    alreadyRegistered: false,
    message: 'Zapisano do powiadomień NEXT DROP (DROP 001).',
    count: newsletterSubscribers.length,
  });
});

app.post('/api/shopify/checkout', (req, res) => {
  const { customer, shippingMethod, items } = req.body ?? {};

  if (!customer?.fullName || !customer?.email || !customer?.address || !customer?.postalCode) {
    res.status(400).json({ error: 'Uzupełnij wszystkie wymagane dane dostawy.' });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Koszyk jest pusty.' });
    return;
  }

  const validItems: OrderLineItem[] = items.map((item: OrderLineItem) => ({
    variantId: String(item.variantId || ''),
    sku: String(item.sku || ''),
    title: String(item.title || ''),
    quantity: Math.max(1, Number(item.quantity) || 1),
    unitPricePln: Math.max(0, Number(item.unitPricePln) || 0),
  }));

  const subtotalPln = validItems.reduce(
    (sum, item) => sum + item.unitPricePln * item.quantity,
    0
  );

  const method: 'inpost' | 'courier' | 'pickup' =
    shippingMethod === 'courier' || shippingMethod === 'pickup' ? shippingMethod : 'inpost';

  const freeThreshold = 250;
  const shippingPln =
    method === 'pickup' ? 0 : subtotalPln >= freeThreshold ? 0 : method === 'courier' ? 22 : 16;

  const totalPln = subtotalPln + shippingPln;
  orderCounter += 1;
  const orderNumber = `MV-${orderCounter}`;
  const shopifyCheckoutId = `gid://shopify/Checkout/${Date.now().toString(36)}`;

  const record: ShopifyOrderRecord = {
    orderNumber,
    shopifyCheckoutId,
    customer: {
      fullName: String(customer.fullName).trim(),
      email: String(customer.email).trim(),
      phone: String(customer.phone || '').trim(),
      address: String(customer.address).trim(),
      city: String(customer.city || '').trim(),
      postalCode: String(customer.postalCode).trim(),
    },
    shippingMethod: method,
    items: validItems,
    subtotalPln,
    shippingPln,
    totalPln,
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED_DROP_001',
  };

  orders.push(record);
  res.status(201).json(record);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MILVITA Storefront running on http://localhost:${PORT}`);
  });
}

startServer();
