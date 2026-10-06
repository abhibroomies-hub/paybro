import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];
  const topic = req.headers['x-shopify-topic'];
  const shopDomain = req.headers['x-shopify-shop-domain'];
  const secret = process.env.SHOPIFY_API_SECRET || 'shpss_8c172e9a5bf3214da9e8c';

  // 1. Verify HMAC
  if (hmacHeader) {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
    if (hash !== hmacHeader) {
      console.warn('[SHOPIFY WEBHOOK] HMAC verification failed');
      return res.status(401).json({ error: 'HMAC signature verification failed' });
    }
  }

  console.log(`[SHOPIFY WEBHOOK] Topic: ${topic} from Shop: ${shopDomain}`);

  switch (topic) {
    case 'orders/create':
    case 'orders/paid':
      console.log(`[PAYBRO] Order webhook processed: ${req.body?.name}, financial_status: ${req.body?.financial_status}`);
      break;
    case 'app/uninstalled':
      console.log(`[PAYBRO] App uninstalled by ${shopDomain}. Cleaning up session state.`);
      break;
    default:
      console.log(`[PAYBRO] Unhandled topic: ${topic}`);
  }

  return res.status(200).json({ received: true });
}
