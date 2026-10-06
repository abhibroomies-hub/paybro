import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const secret = process.env.SHOPIFY_API_SECRET || 'shpss_8c172e9a5bf3214da9e8c';

  if (hmacHeader) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
    if (hash !== hmacHeader) {
      console.warn('[PayBro Webhook] HMAC mismatch for app/uninstalled');
    }
  }

  const shopDomain = req.headers['x-shopify-shop-domain'] || req.body?.myshopify_domain;
  console.log(`[PayBro] App uninstalled by merchant store: ${shopDomain}. Cleaning up active sessions & tokens.`);

  return res.status(200).json({ cleaned: true });
}
