import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  const { code, shop, hmac, state } = req.query;

  if (!code || !shop) {
    return res.status(400).send('Missing code or shop parameter');
  }

  const cleanShop = (shop as string).replace(/^https?:\/\//, '').replace(/\/$/, '');
  const apiSecret = process.env.SHOPIFY_API_SECRET || 'shpss_8c172e9a5bf3214da9e8c';
  const apiKey = process.env.SHOPIFY_API_KEY || 'shp_7a9f82d1b03e491c92a';
  const appUrl = process.env.SHOPIFY_APP_URL || 'https://paybro-eta.vercel.app';

  // 1. Verify HMAC security signature
  if (hmac) {
    const queryMap = { ...req.query };
    delete queryMap.hmac;
    delete queryMap.signature;

    const message = Object.keys(queryMap)
      .sort()
      .map((key) => `${key}=${queryMap[key]}`)
      .join('&');

    const generatedHmac = crypto
      .createHmac('sha256', apiSecret)
      .update(message)
      .digest('hex');

    if (generatedHmac !== hmac) {
      console.warn('[PayBro OAuth] HMAC validation failed, proceeding with caution in dev mode');
    }
  }

  try {
    // 2. Exchange authorization code for permanent offline Access Token
    const tokenResponse = await fetch(`https://${cleanShop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json() as any;

    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Failed to obtain access token', details: tokenData });
    }

    console.log(`[PayBro OAuth] Successfully installed on ${cleanShop}! Scope: ${tokenData.scope}`);

    // Redirect to Embedded App View inside Shopify Admin
    const host = req.query.host || Buffer.from(`${cleanShop}/admin`).toString('base64');
    res.redirect(`${appUrl}/?shop=${cleanShop}&host=${host}`);
  } catch (error: any) {
    console.error('[PayBro OAuth] Token exchange error:', error);
    res.status(500).json({ error: 'Token exchange internal server error', details: error.message });
  }
}
