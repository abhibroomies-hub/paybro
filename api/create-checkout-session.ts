import crypto from 'crypto';

// Global in-memory storage for active checkout sessions (use Redis in prod)
export const activeSessions: Record<string, any> = {};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { cart, shop, appliedDiscountPct = 10 } = req.body || {};

  if (!cart) {
    return res.status(400).json({ error: 'Missing cart data' });
  }

  const sessionId = 'paybro_sess_' + crypto.randomBytes(12).toString('hex');
  const rawSubtotal = (cart.total_price || cart.item_count ? cart.total_price / 100 : 1500);
  const discountAmount = (rawSubtotal * appliedDiscountPct) / 100;
  const finalTotal = rawSubtotal - discountAmount;

  const sessionPayload = {
    sessionId,
    shop: shop || 'broomiesbakery.in',
    cart,
    items: cart.items || [
      {
        id: 'item-1',
        title: 'Love in Layers',
        variant_title: '1 kg / Almond / Vegetarian',
        price: 1500,
        quantity: 1,
        image: 'https://cdn.shopify.com/s/files/1/0663/8767/3305/files/cake_sample.jpg',
      },
    ],
    subtotal: rawSubtotal,
    discountPercent: appliedDiscountPct,
    discountAmount,
    finalTotal,
    currency: cart.currency || 'INR',
    createdAt: new Date().toISOString(),
  };

  activeSessions[sessionId] = sessionPayload;

  return res.status(200).json({
    success: true,
    sessionId,
    redirectUrl: `/checkout?session=${sessionId}`,
    summary: {
      subtotal: rawSubtotal,
      discount: discountAmount,
      total: finalTotal,
    },
  });
}
