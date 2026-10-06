import type { Request, Response } from 'express';
import crypto from 'crypto';

export default async function handler(req: any, res: any) {
  const shop = req.query.shop as string;

  if (!shop) {
    return res.status(400).json({ error: 'Missing shop parameter (e.g. broomiesbakery.myshopify.com)' });
  }

  // Sanitize shop domain
  const cleanShop = shop.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const apiKey = process.env.SHOPIFY_API_KEY || 'shp_7a9f82d1b03e491c92a';
  const appUrl = process.env.SHOPIFY_APP_URL || 'https://paybro-eta.vercel.app';
  const scopes = process.env.SHOPIFY_SCOPES || [
    'read_orders', 'write_orders',
    'read_discounts', 'write_discounts',
    'write_theme_code', 'read_themes', 'write_themes',
    'read_checkouts', 'write_checkouts',
    'read_payment_customizations', 'write_payment_customizations',
    'read_products', 'write_products',
    'read_price_rules', 'write_price_rules',
    'read_draft_orders', 'write_draft_orders',
    'read_customers',
    'read_delivery_customizations', 'write_delivery_customizations'
  ].join(',');

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${appUrl}/api/auth/callback`;

  const installUrl = `https://${cleanShop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

  // Redirect merchant to Shopify OAuth consent screen
  res.redirect(installUrl);
}
