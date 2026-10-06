import express from 'express';
import dotenv from 'dotenv';
import { PaymentProviderFactory } from './src/payments/PaymentProviderFactory';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Log safe boot status (Zero crash guarantee on missing DB / Razorpay env vars)
console.log('----------------------------------------------------');
console.log('🚀 PayBro / Prepaid Perks Serverless Engine Starting');
console.log('📦 Database: Zero External Database (Shopify Metafields + In-Memory TTL)');
console.log(`💳 Payment Provider: ${process.env.PAYMENT_PROVIDER || 'mock'} (MockPaymentProvider active)`);
console.log('----------------------------------------------------');

// Lazy-import API route handlers
import authHandler from './api/auth';
import authCallbackHandler from './api/auth/callback';
import createCheckoutSessionHandler from './api/create-checkout-session';
import checkoutSessionHandler from './api/checkout-session';
import paymentMethodsHandler from './api/payment-methods';
import createPaymentOrderHandler from './api/payments/create-order';
import verifyPaymentHandler from './api/payments/verify';
import settingsHandler from './api/settings';
import createDiscountHandler from './api/create-discount';
import createShopifyOrderHandler from './api/create-shopify-order';
import shopifyWebhookHandler from './api/webhooks/shopify';

// Mount API routes
app.all('/api/auth', authHandler);
app.all('/api/auth/callback', authCallbackHandler);
app.all('/api/create-checkout-session', createCheckoutSessionHandler);
app.all('/api/checkout-session', checkoutSessionHandler);
app.all('/api/payment-methods', paymentMethodsHandler);
app.all('/api/payments/create-order', createPaymentOrderHandler);
app.all('/api/payments/verify', verifyPaymentHandler);
app.all('/api/settings', settingsHandler);
app.all('/api/create-discount', createDiscountHandler);
app.all('/api/create-shopify-order', createShopifyOrderHandler);
app.all('/api/webhooks/shopify', shopifyWebhookHandler);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    store: 'broomiesbakery.in',
    storage: 'Shopify Metafields (Zero Database)',
    activePaymentProvider: PaymentProviderFactory.getProvider().name,
  });
});

export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`[PayBro] Server running smoothly on port ${port}`);
  });
}
