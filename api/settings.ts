import { ShopifyMetafieldService } from '../src/services/ShopifyMetafieldService';

export default async function handler(req: any, res: any) {
  const shop = (req.query.shop as string) || (req.body?.shop as string) || 'broomiesbakery.myshopify.com';

  if (req.method === 'GET') {
    const settings = await ShopifyMetafieldService.getShopSettings(shop, process.env.SHOPIFY_ACCESS_TOKEN);
    return res.status(200).json({ success: true, settings });
  }

  if (req.method === 'POST') {
    const newSettings = req.body?.settings;
    if (!newSettings) return res.status(400).json({ error: 'Missing settings payload' });

    const ok = await ShopifyMetafieldService.saveShopSettings(
      shop,
      newSettings,
      process.env.SHOPIFY_ACCESS_TOKEN
    );

    return res.status(200).json({ success: ok, message: 'Settings saved to Shopify Shop Metafield' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
